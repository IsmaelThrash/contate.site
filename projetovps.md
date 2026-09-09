# 🚀 Projeto VPS — contate.site

**Data:** 25 de agosto de 2026
**Objetivo:** Especificar a evolução da arquitetura do contate.site com a adição de uma **VPS** ao lado da hospedagem premium Hostinger — movendo toda a lógica de negócio para o servidor, isolando segredos, adicionando perímetro de segurança, serviços complementares (Docker/n8n) e eliminando as limitações atuais.
**Perfil assumido:** Operador iniciante em Linux/servidores → prioridade para **ferramentas visuais, guias passo a passo e validação em homelab antes de produção**.

---

## 1. Por que a VPS resolve problemas reais do projeto hoje

O `relatoriodeseg2508.md` identificou que a raiz das falhas críticas (SEC-C01, SEC-A01, SEC-M04) é a mesma: **o cliente fala direto com o banco** via anon key, e a RLS sozinha não consegue garantir integridade de colunas nem identidade em funções `SECURITY DEFINER`. Com uma API própria na VPS:

| Vulnerabilidade atual | Como a arquitetura VPS resolve |
|---|---|
| 🔴 SEC-C01 — mass assignment (`is_admin`) | Endpoint `/api/admin/*` valida papel **server-side**; cliente nunca monta payload do banco |
| 🟠 SEC-A01 — IDOR em `claim_slug` | RPC substituída por endpoint que usa o **JWT validado no servidor** (`auth.uid()` implícito) |
| 🟠 SEC-A02 — headers inertes na Hostinger | Nginx/Caddy na VPS (ou Cloudflare na frente) garante CSP+HSTS independentemente do Apache |
| 🟠 SEC-A03 — `SELECT *` anônimo | Banco deixa de ser exposto ao browser; só a API consulta, retornando campos mínimos |
| 🟡 SEC-M03 — magic link sem rate limit | Rate limiting no Nginx/CrowdSec antes mesmo de chegar ao Auth |
| 🟡 SEC-M04 — admin sem auditoria | Toda ação administrativa passa pela API → audit log automático |

**Princípio alvo:** *client gera tela, server decide tudo.* A SPA passa a ser uma "casca" de apresentação; regras de negócio, permissões, pagamentos e uploads vivem na VPS.

---

## 2. Arquitetura Alvo

```
                        ┌─────────────────────────────┐
 Visitantes ──► Cloudflare ──► Hostinger (premium)      │  Site estático (SPA build)
   (DNS/WAF     (proxy/cache)  public_html               │  _headers/.htaccess continuam
    gratuito)   └──────────┬──────────────────────────┘  como camada extra
                           │ /api/* e painéis apontam p/ baixo
                           ▼
        ┌─────────────────────────────────────────────────┐
        │  VPS (Hetzner/Contabo/DigitalOcean — Ubuntu LTS)│
        │                                                 │
        │  Docker Compose:                                │
        │  ├─ caddy/nginx-proxy   ← TLS automático + headers + rate limit
        │  ├─ crowdsec            ← WAF/deteção de abuso
        │  ├─ api (Node/Fastify)  ← TODA a lógica de negócio
        │  ├─ postgres            ← (opcional, ver §6)
        │  ├─ n8n                 ← automações/webhooks
        │  ├─ umami               ← analytics próprio
        │  ├─ imgproxy/sharp      ← redimensionamento de avatares
        │  ├─ uptime-kuma         ← monitoramento/alertas
        │  └─ restic (cron)       ← backups versionados
        │                                                 │
        │  Supabase (mantido na Fase 1): auth + banco     │
        └─────────────────────────────────────────────────┘
```

**Divisão de responsabilidades:**
- **Hostinger:** continua servindo o site estático (rápido, barato, CDN incluso). Zero mudança no deploy atual.
- **Cloudflare (free):** DNS do domínio, proxy com WAF básico, cache e ocultação do IP da VPS. Opcional na fase inicial, recomendado desde o início.
- **VPS:** cérebro do projeto — API, dados sensíveis, automações, backups.

---

## 2.1 📝 Anotação — Instância selecionada: Oracle Cloud **Always Free** (25/08/2026)

Specs da instância cotada no console Oracle:

| Item | Valor |
|---|---|
| SO | Canonical Ubuntu 24.04 (build 2026.06.29-0) |
| Forma | `VM.Standard.A1.Flex` — **elegível Always Free** |
| CPU | 2 OCPU (ARM **Ampere Altra** — tentativa atual; até 4 núcleos disponíveis no free tier) |
| RAM | 12 GB (até 24 GB disponíveis no free tier) |
| Rede | 2 Gbps |
| Disco | Boot volume 100 GB (VPU 10, criptografia em trânsito) |
| Rede virtual | VCN `vcn-20250626-1545` / sub-rede `subnet-20250626-1545` (regional) + IPv4 público |
| Acesso | Chave SSH registrada no console (`ssh-key-2026-08-26`); privada salva em `C:\Users\Ismael\.ssh\` |
| Agentes OCI | Apenas os 3 padrão ativos: Monitoring, Custom Logs, Cloud Guard Workload Protection |
| Custo | R$ 0/mês |

**Log de provisionamento (25–26/08/2026):**

| Tentativa | Configuração | Resultado |
|---|---|---|
| 1 — `instance-20260826-0231` | 1 OCPU / 6 GB / AD-1 | ❌ Out of capacity (escassez conhecida de A1 free) |
| 2 — `instance-20260826-0310` | **2 OCPU / 12 GB** / AD-1 (FD automático) | ⏳ em tentativa — truque do pool maior (§2.1 item 6) |

Plano de contingência se persistir: tentar FD-2/FD-3 manualmente → tentar em horário de baixa demanda → **script de retry automático** (`deploy/oracle-retry.sh`, roda no Cloud Shell e cria a instância via API em loop, respeitando rate-limit) → ativar Pay As You Go (mantém consumo zero dentro do free tier).

### Implicações e adaptações ao plano

1. **Arquitetura ARM64 (aarch64)** — o maior ponto de atenção. Todas as imagens do plano precisam ter build multi-arch. Verificado: `node` ✅, `postgres` ✅, `caddy` ✅, `npx/coolify` ✅, `n8n` ✅, `umami` ✅, `uptime-kuma` ✅, `crowdsec` ✅, `restic` ✅, `imgproxy` ✅, `portainer` ✅. Regra prática: sempre conferir `linux/arm64` no Docker Hub antes de adicionar qualquer serviço novo.
2. **Recursos sobram para a stack** — estimativa de uso da stack completa (API + Postgres + n8n + Umami + Kuma + CrowdSec + Caddy + restic): **< 1,5 GB RAM / ~30% de 1 OCPU**. Os 6 GB permitem inclusive subir o Postgres na própria instância (cenário B/C do §6) sem custo extra.
3. **Armazenamento:** free tier inclui **200 GB de block volume no total** (boot volume padrão ~47 GB — expandir na criação para ~100 GB, fica dentro do limite).
4. **⚠️ Gotcha clássico de rede na Oracle:** além do *Security List* do console, as imagens Ubuntu da OCI vêm com **iptables pré-configurado bloqueando tudo exceto a porta 22** (`/etc/iptables/rules.v4`). Liberar 80/443 nos DOIS lugares ou o site "não abre" e parece bug.
5. **⚠️ Reclaim por ociosidade:** a Oracle pode reciclar instâncias Always Free ociosas (~95º percentil < 20% de CPU/RAM/rede em 7 dias). Como essa VPS será o cérebro em produção (tráfego + backups + n8n agendado), o risco é baixo — mas durante a fase de testes parados, manter um workload mínimo (Kuma monitorando já conta) e ficar atento aos e-mails de aviso.
6. **⚠️ "Out of capacity":** formas A1 gratuitas esgotam em regiões movimentadas. Estratégias: tentar os domínios de disponibilidade (AD) diferentes da sua home region, insistir em horários alternativos, ou converter a conta para **Pay As You Go** (remove o problema de capacidade e mantém consumo zero dentro dos limites free — requer cartão).
7. **Home region:** recursos Always Free só podem ser criados na região definida como *home* na criação da conta — escolher bem antes (para Brasil, `sa-saopaulo-1` ou `sa-vinhedo-1` são as opções latentes mais próximas).
8. **Snapshots limitados:** o free tier inclui apenas **5 backups de volume** — diferente do plano Hetzner (§5/§9). Adaptação: usar os 5 slots como "pontos de restauração manuais raros" (antes de mudanças grandes) e tratar o **restic off-site como backup primário** (ele já é criptografado e versionado, então a mudança é segura).
9. **Homelab continua valendo**, mas ganha flexibilidade: como a instância é grátis, ela pode exercer os papéis de **staging E primeira produção** simultaneamente (ou rodar a stack inteira no homelab enquanto a instância Oracle é liberada/provisionada). O compose não muda nada entre ambientes.

> **Decisão registrada:** avançar com Oracle A1 Always Free como VPS do projeto. Custos caem para **R$ 0 de infraestrutura** (resta apenas o storage off-site de backup, ~US$ 4–7/mês — ver §9 atualizado).

---

## 3. Estratégia Homelab → Produção (recomendada para seu perfil)

Como você quer testar antes e administração será iniciante, proponho **3 estágios com a MESMA stack Docker** — nada do homelab é jogado fora:

| Estágio | Onde | Objetivo | Custo |
|---|---|---|---|
| **0 — Homelab** | Mini PC/PC antigo ou VM no seu desktop | Subir a stack completa, aprender Docker sem medo, testar integrações (n8n, pagamentos sandbox) | R$ 0 (hardware existente) |
| **1 — Staging VPS** | VPS pequena (2 vCPU/4GB) | Réplica da produção, testes de carga, ensaio de restores | ~US$ 6–10/mês |
| **2 — Produção** | VPS 4 vCPU/8GB + snapshots | Cérebro oficial do projeto | ~US$ 12–20/mês |

**Acesso ao homelab sem IP público/exposição:** **Cloudflare Tunnel** (`cloudflared` em container) — expõe `api-homelab.contate.site` sem abrir portas no roteador. É a forma mais segura para iniciantes.

**Painel de gestão sugerido (substitui terminal onde possível):**
- **Coolify** (self-hosted, gratuito): painel visual estilo Vercel — deploy por Git, SSL automático, bancos em 1 clique. Ideal para iniciante que quer Docker por trás.
- Alternativas: Dokploy (mais leve) ou Portainer (só gestão de containers).

> Recomendação: **Coolify + docker-compose explícito versionado no repo** (`deploy/docker-compose.yml`). Você ganha botões visuais E documentação técnica reproduzível.

---

## 4. Os Serviços (containers) em Detalhe

### 4.1 `api` — o coração (Node.js 20 + Fastify/Express)
Substitui os fluxos que hoje vão do browser direto ao Supabase:

| Endpoint | Substitui/corrige |
|---|---|
| `POST /api/admin/users/:id` (edit/toggle/delete) | AdminPage.jsx → corrige SEC-C01/M04, grava audit log |
| `POST /api/profile` | updateProfile com **whitelist de campos** (nunca spread) |
| `POST /api/slug` | claim_slug server-side → elimina SEC-A01 |
| `POST /api/uploads/avatar` | upload novo com sharp: valida MIME real, limite 5MB, redimensiona p/ 512px WebP |
| `POST /api/webhooks/payments` | Stripe/Mercado Pago com verificação de assinatura server-side |
| `GET /api/analytics/collect` | coleta própria de eventos (ou Umami cuida disso sozinho) |

Autenticação da API: valida o JWT do Supabase com `supabase.auth.getUser()` usando a **service_role key que passa a viver SOMENTE no `.env` da VPS** (nunca mais no bundle do frontend).

### 4.2 `n8n` — automações (você citou explicitamente)
Casos de uso concretos no contate.site:
- **Expiração do cofre de slugs:** workflow diário limpa `slugs_reservados` com `liberado_em < now()` (hoje não existe essa limpeza);
- **Onboarding:** e-mail de boas-vindas quando usuário ganha slug;
- **Moderação:** notificação no Telegram/Discord quando novo cadastro é criado (status 0);
- **Webhooks genéricos:** qualquer integração futura (planilha CRM, WhatsApp API) sem escrever código novo;
- **Backup report:** mensagem diária confirmando sucesso/falha do backup.

### 4.3 `umami` — analytics próprio (sem cookies/LGPD-friendly)
Dashboard visual próprio, script `<script defer src="/script.js" data-website-id="...">` no index.html. Sem Google Analytics, sem banner de cookies necessário. ~50MB RAM.

### 4.4 Perímetro de segurança
- **Caddy** (TLS automático, headers seguros nativos) ou **Nginx Proxy Manager** (UI visual — melhor para iniciante);
- **Rate limiting:** 10 req/min por IP em `/api/auth/*`, 60 req/min no resto (resolve SEC-M03);
- **CrowdSec:** WAF comportamental gratuito com console web; bloqueia scanners/botnets conhecidos automaticamente;
- **Cloudflare na frente (grátis):** esconde IP da VPS, DDoS básico, regras de país se um dia precisar.

### 4.5 Monitoramento
- **Uptime Kuma:** UI bonita, alerta Telegram quando site/API caem;
- **Dozzle:** logs de containers via navegador;
- **Netdata (opcional):** métricas de CPU/RAM/disco em tempo real.

---

## 5. Backups e Disaster Recovery — respondendo sua pergunta

Você perguntou: *"o backup do site, BD e os serviços estariam todos no backup geral do docker… o que acha?"*

**Metade certa, metade perigosa.** ✅ Orquestrar tudo pelo Docker (volumes nomeados + cron + restic) é exatamente o modelo ideal. ❌ Mas se os backups ficarem **somente dentro da própria VPS**, você tem redundância zero: disco corrompido, conta suspensa, ransomware ou erro seu (`rm -rf`) = projeto perdido. Regra de ouro **3-2-1**:

> **3** cópias · **2** mídias diferentes · **1** fora do local (off-site)

### Plano concreto

| Camada | O quê | Como | Frequência | Destino |
|---|---|---|---|---|
| 1. Snapshots do provedor | Disco inteiro da VPS | Hetzner auto-backups (20% do preço) ou snapshot manual antes de cada mudança | Diária/semanal | Mesma VPS (restore rápido) |
| 2. Backup versionado | Postgres (`pg_dump`), volumes (uploads, n8n), configs | Container **restic** com cron, criptografado AES | Diária, retenção 30 dias | **Off-site:** Hetzner Storage Box / Backblaze B2 (~R$ 5–15/mês) |
| 3. Código & infra | Repo Git + `docker-compose.yml` + `.env.example` | GitHub (já existe) | A cada push | GitHub |

- O **site estático** nem precisa entrar no backup pesado: ele vive no Git e é regenerado pelo CI a qualquer momento.
- **Teste de restore trimestral obrigatório** (estágio staging serve pra isso): subir backup num container limpo e validar login + perfil. Backup não testado = não existe.
- Alerta no Telegram via n8n se o backup falhar.

---

## 6. Trade-off: manter Supabase vs migrar para Postgres na VPS

Você pediu análise — cenários comparados:

| Critério | A. Manter Supabase (API na VPS na frente) | B. Híbrido: Auth Supabase + DB na VPS | C. Tudo self-hosted na VPS |
|---|---|---|---|
| Esforço de migração | ⭐ Quase zero (só criar API) | Médio (migrar schema + queries) | Alto (auth, storage, e-mails) |
| Segurança possível | Alta (banco some do alcance do browser) | Alta | Alta — mas **você** é responsável por patches |
| Custo mensal | US$ 0 (free tier) + VPS | + Postgres na mesma VPS | + mail server, storage… |
| Riscos | Vendor lock-in moderado; free tier pode limitar | Dois sistemas p/ manter durante transição | Backup/restauração, deliverability de e-mail, updates de segurança manuais |
| Escala/expansão | Boa | Boa | Total liberdade |
| Adequado ao seu perfil (iniciante) | ✅ Recomendado agora | ⚠️ Depois, se necessário | ❌ Não como passo 1 |

**Recomendação:** começar no **cenário A** — a VPS entra como camada de inteligência/segurança e o Supabase vira "apenas um banco atrás da API". Isso já resolve 100% das vulnerabilidades do relatório 2508. Migração total (C) vira decisão de custo/escala futura, não urgência. O documento de migração (schema SQL já existe em `SUPABASE_SCHEMA.md`) pode ser preparado quando fizer sentido.

---

## 7. Plano de Adoção em Fases (com critérios de conclusão)

### Fase 0 — Homelab (~1 fim de semana)
- [ ] Instalar Docker + Coolify no mini PC/VM;
- [ ] Subir stack mínima: `caddy`, `api` (hello world), `uptime-kuma`;
- [ ] Configurar Cloudflare Tunnel → `*.homelab.contate.site`;
- [ ] Primeiro backup restic local + restore de teste.

### Fase 1 — API segura (corrige as vulnerabilidades P0)
- [ ] Criar `apps/api` (Fastify) com endpoints §4.1;
- [ ] `service_role` sai do frontend → `.env` da VPS;
- [ ] Refatorar frontend: chamadas passam por `/api/*`;
- [ ] Audit log em tabela própria para ações admin;
- [ ] Validar contra o relatório 2508: PoCs do SEC-C01 e SEC-A01 devem **falhar**;
- [ ] Deploy na VPS de staging com TLS.

### Fase 2 — Perímetro e observabilidade
- [ ] Rate limits no Caddy/NPM + CrowdSec;
- [ ] Headers completos (CSP/HSTS) na VPS — independente da Hostinger;
- [ ] Uptime Kuma + alertas Telegram;
- [ ] Backups: snapshots do provedor + restic off-site + alerta n8n.

### Fase 3 — Recursos novos (as possibilidades que você listou)
- [ ] **Pagamentos:** Mercado Pago/Stripe checkout + webhook server-side + tabela `assinaturas`; gating de features VIP por plano;
- [ ] **Upload avatar:** endpoint com validação real de imagem + imgproxy/sharp + servir via Caddy com cache;
- [ ] **Analytics:** Umami instalado + snippet no `index.html`;
- [ ] **Automações:** n8n com os workflows §4.2 (expiração de slugs primeiro — é dívida técnica atual).

### Fase 4 — Expansão (decisões futuras)
- Avaliar migração do banco (§6); mail server próprio (Postal) se volume crescer; segunda VPS/staging permanente; Kubernetes só se múltiplos apps conviverem (provavelmente desnecessário).

---

## 8. Hardening mínimo da VPS (checklist do dia 1)

Para iniciante, o Coolify já evita erros comuns; ainda assim, antes de qualquer serviço:

1. Criar usuário não-root + **SSH apenas por chave** (`PasswordAuthentication no`);
2. `ufw default deny incoming` → liberar só 80/443 (+ porta SSH alterada). **Na Oracle:** lembrar do duplo bloqueio — Security List no console **e** iptables local da imagem OCI (`/etc/iptables/rules.v4`) — ver §2.1 item 4;
3. Updates automáticos de segurança (`unattended-upgrades`);
4. Fail2ban ou CrowdSec protegendo SSH;
5. Snapshots habilitados ANTES de mexer em qualquer coisa;
6. Docker: containers sem `--privileged`, networks separadas (frontend ≠ banco), `.env` com `chmod 600`;
7. Nunca expor Postgres/n8n/Umami diretamente — só através do proxy com auth.

---

## 9. Custos Estimados (mensais) — atualizado com Oracle Always Free (§2.1)

| Item | Homelab | Produção (Oracle A1 Free) | Produção (plano pago, referência) |
|---|---|---|---|
| VPS 1 OCPU/6GB ARM | — | **R$ 0** (Always Free) | ~US$ 7–12 (Hetzner CX22/Contabo) |
| Storage Box/B2 off-site (100–250GB) | R$ 0 (HD local) | ~US$ 4–7 | ~US$ 4–7 |
| Snapshots/backups do provedor | — | R$ 0 (5 slots de volume backup free) | ~US$ 2–3 |
| Cloudflare, Coolify, n8n, Umami, Kuma, CrowdSec | Self-hosted grátis | Self-hosted grátis | Self-hosted grátis |
| **Total** | **R$ 0** | **~US$ 4–7 (R$ 25–40)** | ~US$ 18–27 (R$ 100–150) |

Com a instância Always Free, o único custo obrigatório do projeto passa a ser o backup off-site. Comparável ao que se pagaria por serviços SaaS equivalentes (analytics + automação + monitoring + backups facilmente passam de US$ 80/mês) — com controle total dos dados e custo quase zero.

---

## 10. Riscos e Mitigações honestas

| Risco | Mitigação |
|---|---|
| Curva de aprendizado Docker/Linux | Homelab primeiro; Coolify visual; snapshots antes de toda mudança |
| VPS mal mantida vira risco maior que o benefício | Checklist §8 + updates automáticos + alertas Kuma |
| API própria introduz novos bugs de auth | Reuso do JWT Supabase (auth continua madura); endpoints pequenos e testáveis; staging antes de prod |
| Dependência de 1 máquina | Backups 3-2-1 (§5) + plano de recriação documentado (IaC leve: compose no Git) |
| **Oracle: reclaim por ociosidade** (§2.1 item 5) | Stack em produção gera tráfego constante; Kuma + n8n cron mantêm atividade mínima; atenção aos e-mails de aviso |
| **Oracle: out of capacity / conta free revogada** (§2.1 itens 6–7) | Compose é portável — restore em qualquer VPS x86/ARM em ~1h usando o backup off-site; alternativa: converter para Pay As You Go mantendo consumo zero |
| Imagens Docker sem build ARM64 | Checklist multi-arch antes de adicionar serviço (§2.1 item 1); stack validada como 100% arm64 |
| Tempo de manutenção (~1–2h/mês) | n8n automatiza tarefas recorrentes; Kuma avisa antes do problema virar incidente |

---

## Conclusão

A VPS transformando o contate.site em **client-thin + API própria** não é apenas "mais um recurso": é a correção estrutural das vulnerabilidades encontradas em agosto/2026 e a plataforma que viabiliza pagamentos, uploads, analytics e automações sem refazer o front. O caminho homelab → staging → produção com a mesma stack Docker minimiza o risco para um operador iniciante, e o modelo de backups 3-2-1 garante que o "cérebro" do projeto sobreviva a qualquer desastre single-machine.

*Próximo passo sugerido: provisionar a instância Oracle A1 (Ubuntu 24.04, boot volume ~100 GB, região `sa-saopaulo-1`/`sa-vinhedo-1`) e montar o `docker-compose.yml` da Fase 0 — tudo arm64-ready. Ambos cabem no homelab deste fim de semana.*
