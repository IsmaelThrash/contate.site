# 🔐 Relatório de Segurança — contate.site

**Data da análise:** 25 de agosto de 2026
**Analista:** opencode (ox-alpha) — auditoria estática de código
**Repositório:** `github.com/IsmaelThrash/contate.site` (branch `main`, commit `a82aed0`)
**Escopo:** Frontend React 18 + Vite (`apps/web`), Supabase (Auth, Postgres/RLS, REST API), migrations SQL versionadas, pipeline CI/CD (GitHub Actions → FTP Hostinger), headers de segurança e dependências npm.
**Método:** Revisão manual linha a linha do código-fonte, análise das policies RLS, `npm audit`, varredura de segredos no histórico Git, revisão de headers de segurança e do workflow de deploy.

> Este relatório sucede `relatorio-seguranca-completo-2026-07-17.md` e reavalia o status de todas as correções anteriores.

---

## 1. Resumo Executivo

O contate.site é uma SPA React (link-in-bio) com autenticação Supabase (Magic Link + Google OAuth, fluxo **PKCE**) e backend 100% serverless via Postgres + RLS. As correções do ciclo anterior (CSS injection em `cor_fundo`, validação de URLs, sanitização DOMPurify, race condition de slug, CSP) **foram implementadas corretamente**.

Porém, esta re-auditoria identificou **1 vulnerabilidade CRÍTICA nova** (escalação de privilégio por atribuição em massa na tabela `usuarios`) e **1 falha ALTA grave** (IDOR na função `claim_slug`), ambas exploráveis por qualquer usuário autenticado via chamada direta à API REST do Supabase. Além disso, há fortes indícios de que **os headers de segurança (`_headers`) não estão ativos em produção**, já que o deploy é feito por FTP para Hostinger (Apache/LiteSpeed), onde esse formato não é interpretado — e o `.htaccess` não define nenhum header.

### Score de Segurança: **5.5 / 10** ⚠️ (era 7.5 no relatório de 17/07/2026)

| # | ID | Título | Severidade |
|---|---|---|---|
| 1 | SEC-C01 | Escalação de privilégio via mass assignment (`is_admin`/`status`) | 🔴 CRÍTICO |
| 2 | SEC-A01 | IDOR em `claim_slug()` — sequestro de slug de terceiros | 🟠 ALTO |
| 3 | SEC-A02 | Headers de segurança provavelmente inativos em produção (sem HSTS) | 🟠 ALTO |
| 4 | SEC-A03 | Exposição total da tabela `usuarios` via SELECT anônimo irrestrito | 🟠 ALTO |
| 5 | SEC-M01 | 17 vulnerabilidades em dependências (DOMPurify runtime desatualizado) | 🟡 MÉDIO |
| 6 | SEC-M02 | Tokens JWT persistidos em `localStorage` | 🟡 MÉDIO |
| 7 | SEC-M03 | Magic Link sem captcha/rate-limit (enumeração e e-mail bombing) | 🟡 MÉDIO |
| 8 | SEC-M04 | Ações administrativas client-side sem trilha de auditoria | 🟡 MÉDIO |
| 9 | SEC-B01..B05 | Achados informativos/baixos (JSON-LD, dev server, FTP, storage) | 🔵 BAIXO |

---

## 2. Arquitetura Auditada

```
├── apps/web/                  SPA React 18 + Vite 7 (único app do monorepo)
│   ├── src/contexts/AuthContext.jsx    Autenticação + updateProfile (fetch direto REST)
│   ├── src/lib/supabaseClient.js       Cliente Supabase (PKCE, storage custom)
│   ├── src/pages/{Login,Dashboard,Profile,Onboarding,Admin}Page.jsx
│   ├── src/components/{LinkForm,ProfileSettings,VideoEmbed,ProtectedRoute}.jsx
│   └── .env                    VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (não commitado ✅)
├── supabase_migration_*.sql   7 migrations de schema/RLS/RPC
├── _headers                   CSP/XFO/nosniff (formato Cloudflare Pages/Netlify ⚠️)
├── .htaccess                  Apenas rewrite SPA (sem headers ⚠️)
└── .github/workflows/deploy.yml  Build → FTP Deploy para Hostinger
```

**Fluxo de dados:** Browser → Supabase REST (PostgREST) com `anon key` + JWT do usuário; autorização 100% via RLS no banco. Não há backend próprio nem Edge Functions.

---

## 3. Vulnerabilidades

### 🔴 SEC-C01 — Escalação de privilégio via mass assignment (CRÍTICO)

**Localização:**
- Policy: `supabase_migration_admin.sql:25-28`
- Vetor de escrita: `apps/web/src/contexts/AuthContext.jsx:169-217`

```sql
-- Policy atual: não restringe QUAIS colunas podem ser alteradas
CREATE POLICY "usuarios_update_own" ON public.usuarios
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());
```

**Descrição:** A policy RLS valida apenas *quem* é o dono da linha, mas **não impede que o dono altere colunas privilegiadas**. Não existe trigger, constraint ou `GRANT` de coluna protegendo `is_admin` e `status`. Como toda a escrita passa pela API REST pública, qualquer usuário autenticado pode promover-se a administrador:

```bash
# PoC — qualquer conta logada:
curl -X PATCH "https://jxdupvgluypllzfupung.supabase.co/rest/v1/usuarios?id=eq.<MEU_ID>" \
  -H "apikey: <anon_key>" \
  -H "Authorization: Bearer <MEU_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"is_admin": true}'
# O WITH CHECK (auth.uid() = id ...) é satisfeito → UPDATE aceito.
```

A própria função `updateProfile` do app (`AuthContext.jsx:172-175`) monta o payload como `{ id, ...data }` com `Prefer: resolution=merge-duplicates` (upsert), confirmando que campos arbitrários chegam ao banco sem whitelist server-side.

**Impacto (máximo):**
- Auto-promoção a admin → acesso total ao Console Admin;
- Edição/exclusão do perfil e links de **qualquer usuário** (a mesma policy concede `USING is_admin()`);
- Revogação de `status=2` (suspenso) sobre si mesmo — bypass de moderação;
- Alteração de `slug` de terceiros (combinado com a policy de admin).

**Correção recomendada (defesa em profundidade, aplicar as duas):**

1. Trigger que bloqueia alteração de colunas sensíveis por não-admins:

```sql
CREATE OR REPLACE FUNCTION public.guard_usuario_columns()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NOT COALESCE(public.is_admin(), false) THEN
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin
       OR NEW.status  IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Alteracao de colunas protegidas requer perfil de administrador';
    END IF;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_guard_usuario_columns
BEFORE UPDATE ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION public.guard_usuario_columns();
```

2. Restringir a superfície de escrita do cliente: remover o upsert genérico de `updateProfile` e passar a aceitar somente os campos do formulário (`nome_exibicao`, `bio`, `meta_titulo`, `meta_descricao`, `slug`, `cor_fundo`) — nunca espalhar `...data`.

**Verificação:** Logado como usuário comum, tentar `PATCH` com `{"is_admin": true}` → deve retornar erro 400/violação de trigger.

---

### 🟠 SEC-A01 — IDOR em `claim_slug()`: manipulação de contas de terceiros (ALTO)

**Localização:** `supabase_migration_security.sql:22-38`, `supabase_migration_slug_cooldown.sql:19-66`, `supabase_migration_slug_policies.sql:23-72`

**Descrição:** `claim_slug(p_user_id, p_slug)` é `SECURITY DEFINER`, executável por qualquer usuário autenticado (`GRANT EXECUTE ... TO authenticated`), e **não valida que `p_user_id = auth.uid()`**:

```sql
CREATE OR REPLACE FUNCTION claim_slug(p_user_id uuid, p_slug text)
...
UPDATE usuarios SET slug = p_slug, status = 1 WHERE id = p_user_id;  -- sem filtro auth.uid()
```

Um atacante pode chamar `supabase.rpc('claim_slug', { p_user_id: '<VÍTIMA>', p_slug: 'lixo' })` e:

- Trocar o slug de qualquer usuário (sequestro/redirecionamento da URL pública da vítima — impacto em reputação, cartões NFC impressos, bio de redes sociais);
- Forçar `status = 1` (ativação) em contas pendentes de aprovação;
- Inserir/apagar registros de `slugs_reservados` em nome de outros usuários (a função faz `DELETE/INSERT` nessa tabela com privilégios de definer);
- Realizar enumeração de IDs de usuário (retorno `FOUND` distingue existência).

**Correção recomendada:**

```sql
CREATE OR REPLACE FUNCTION public.claim_slug(p_user_id uuid, p_slug text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Operacao nao permitida: usuario invalido';
  END IF;
  -- ... resto da lógica atual (cooldown, anti-acumulador) ...
END; $$;
```

Alternativa mais limpa: remover o parâmetro `p_user_id` e usar `auth.uid()` diretamente no corpo.

**Verificação:** Logado como usuário A, chamar RPC com ID do usuário B → deve retornar exceção.

---

### 🟠 SEC-A02 — Headers de segurança provavelmente inativos em produção (ALTO)

**Localização:** `_headers` (raiz e `dist/`), `.htaccess`, `.github/workflows/deploy.yml:33-40`

**Descrição:** Os headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) estão definidos **exclusivamente** no arquivo `_headers` — convenção do Cloudflare Pages/Netlify. Porém o deploy é feito via `FTP-Deploy-Action` para `/domains/contate.site/public_html/` na **Hostinger (Apache/LiteSpeed)**, que ignora `_headers`. O `.htaccess` enviado junto contém apenas regras de rewrite — **nenhum header de segurança**.

Consequência real: em produção, muito provavelmente **não há CSP, XFO, nosniff, Referrer-Policy, Permissions-Policy nem HSTS ativos**. Isso anula boa parte das mitigações creditadas ao projeto desde julho.

Adicionalmente, mesmo o `_headers` ideal possui lacunas: sem `Strict-Transport-Security`, sem `base-uri`, sem `form-action`, sem `upgrade-insecure-requests`.

**Correção recomendada** — replicar todos os headers no `.htaccess` (funciona em Apache e LiteSpeed):

```apache
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.youtube.com https://player.vimeo.com https://www.tiktok.com; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
```

**Verificação:** `curl -I https://contate.site` — hoje deve exibir apenas headers padrão do servidor; após o fix, todos os acima devem aparecer.

---

### 🟠 SEC-A03 — Tabela `usuarios` totalmente legível por anônimos (ALTO)

**Localização:** `supabase_migration_rls.sql:16-19`

```sql
CREATE POLICY "usuarios_select_public" ON usuarios FOR SELECT USING (true);
```

**Descrição:** Com RLS liberado em `SELECT *` para `anon`, qualquer pessoa pode paginar **toda a base de usuários** via API REST sem autenticação, incluindo colunas internas: `id` (UUID de `auth.users`), `is_admin`, `status`, `created_at` e metadados. Não há rate limit próprio do app. Impactos: scraping massivo (LGPD — dados pessoais como nome/slug/bio associados a UUIDs de conta), reconhecimento de alvos para o SEC-C01/A01 e enumeração da estrutura organizacional do serviço.

**Correção recomendada** — privilégio de colunas (respeitado pelo PostgREST):

```sql
REVOKE ALL ON public.usuarios FROM anon;
GRANT SELECT (id, slug, nome_exibicao, bio, cor_fundo, meta_titulo, meta_descricao)
  ON public.usuarios TO anon;
GRANT SELECT * ON public.usuarios TO authenticated; -- ajustar conforme necessidade
```

Manter a policy de SELECT apenas como segunda camada. Avaliar também view `public_profiles` exposta via API com as colunas mínimas.

---

### 🟡 SEC-M01 — Dependências desatualizadas (17 avisos: 12 high, 3 moderate, 2 low)

**Evidência (`npm audit` em 25/08/2026):** `fix available via npm audit fix`.

**Destaque runtime (afeta produção):**
- `dompurify 3.4.3` — múltiplos advisories moderados (GHSA-hpcv-96wg-7vj8, GHSA-r47g-fvhr-h676, GHSA-rp9w-3fw7-7cwq, entre outros). O DOMPurify é **a única defesa XSS** dos campos user-generated (`ProfilePage.jsx:16`); mantê-lo atualizado é obrigatório. Os cenários de bypass conhecidos exigem configs avançadas (IN_PLACE/hooks/shadow root) que o app não usa hoje — risco real baixo, mas exposição desnecessária.

**Toolchain (não chegam ao bundle de produção, mas afetam dev/CI):**
- `vite/esbuild/ws/js-yaml/flatted/brace-expansion/@babel/core/ajv/yaml/launch-editor` — path traversal no dev server Windows, bypass de `server.fs.deny`, DoS, disclosure de hash NTLMv2, etc.

**Correção:** `npm audit fix` (todas têm patch disponível); elevar `dompurify` para `^3.4.13` e pinar revisões com `package-lock.json` no CI. Adicionar `npm audit --audit-level=high` como step bloqueante no `deploy.yml`.

---

### 🟡 SEC-M02 — Sessão persistida em `localStorage` (MÉDIO)

**Localização:** `src/lib/supabaseClient.js:8-35`

Os JWTs de acesso e refresh ficam em `localStorage` (via `customStorage`). Qualquer XSS bem-sucedido teria acesso aos tokens (ao contrário de cookies `HttpOnly`). É tradeoff conhecido do supabase-js; mitigações: manter CSP estrita (ver SEC-A02), avaliar `@supabase/ssr` com cookies `HttpOnly` quando houver backend/proxy, e garantir refresh token rotation habilitado no painel Supabase (já é padrão).

---

### 🟡 SEC-M03 — Magic Link sem captcha nem rate-limit aplicacional (MÉDIO)

**Localização:** `AuthContext.jsx:131-145`, `LoginPage.jsx:59-80`

`signInWithOtp` sem proteção permite abuso para *e-mail bombing* (spam de link para vítimas) e confirmação de quais e-mails possuem conta conforme mensagens de erro. **Correção:** habilitar CAPTCHA (hCaptcha/Turnstile) no Supabase Auth → Authentication → Providers, e configurar rate limits de OTP no painel. O fluxo PKCE + `emailRedirectTo` fixo estão corretos (sem open redirect).

---

### 🟡 SEC-M04 — Operações administrativas client-side sem auditoria (MÉDIO)

**Localização:** `AdminPage.jsx:87-204`, `supabase_migration_admin.sql:25-34`

Promoção/revogação de admin, edição e exclusão de usuários são feitas pelo browser com a anon key. Além de ampliar o raio do SEC-C01, não há trilha de auditoria (quem fez o quê, quando). **Correção:** mover essas ações para uma Edge Function com `service_role` + verificação `is_admin()` server-side, gravando em tabela `admin_audit_log (actor_id, target_id, action, created_at)`; restringir as policies `OR public.is_admin()` apenas ao necessário.

---

### 🔵 Achados Baixos / Informativos

| ID | Achado | Localização | Recomendação |
|---|---|---|---|
| SEC-B01 | JSON-LD montado com dados do usuário sem escape `\u003c` | `ProfilePage.jsx:158-177` | `JSON.stringify(jsonLd).replace(/</g,'\\u003c')` (defesa em profundidade contra quebra de contexto `<script>`) |
| SEC-B02 | E-mail pessoal do admin hardcoded em migration versionada | `supabase_migration_admin.sql:41` | Remover do repo (usar variável/documento separado) se o repositório for público |
| SEC-B03 | Caminho local do desenvolvedor no build (`C:\Users\Ismael\...git.exe`) e dev server com `cors: true`, `allowedHosts: true` | `vite.config.js:8,24-28` | Usar apenas `git`; restringir CORS/hosts em dev |
| SEC-B04 | Campo `avatar` usado em produção mas ausente do schema documentado; bucket/policies de Storage não versionados no repo | `ProfilePage.jsx:166,199` | Versionar políticas do bucket `avatars` em migration; validar tipo/tamanho no upload |
| SEC-B05 | Deploy FTP com `dangerous-clean-slate: true` e protocolo FTP (texto plano) | `.github/workflows/deploy.yml:41-48` | Migrar para SFTP (`protocol: sftp`), portar para SSH key, e considerar remover `dangerous-clean-slate` |
| SEC-B06 | `window.open(publicUrl, '_blank')` sem `noopener` | `DashboardPage.jsx:332` | Usar `window.open(url, '_blank', 'noopener,noreferrer')` |

---

## 4. Matriz OWASP Top 10 (2021)

| Categoria | Status | Observações |
|---|---|---|
| A01 Broken Access Control | 🔴 Falho | SEC-C01 (mass assignment), SEC-A01 (IDOR), SEC-A03 |
| A02 Cryptographic Failures | 🟢 OK | HTTPS, PKCE, sem segredos no código; tokens em localStorage (M02) |
| A03 Injection | 🟢 OK | Sem SQL dinâmico; XSS mitigado por DOMPurify + React (manter M01 em dia); cores validadas client+banco |
| A04 Insecure Design | 🟠 Parcial | Admin client-side sem auditoria; ativação por status trivialmente reversível |
| A05 Security Misconfiguration | 🟠 Parcial | SEC-A02 (headers provavelmente inertes em prod) |
| A06 Vulnerable Components | 🟡 Pendente | SEC-M01 — patches disponíveis |
| A07 Auth Failures | 🟡 Parcial | PKCE OK; falta captcha/rate limit (M03) |
| A08 Integrity Failures | 🟢 OK | CI usa secrets do GitHub; lockfile presente |
| A09 Logging & Monitoring | 🟡 Parcial | Logger silencioso em prod; sem audit trail administrativo |
| A10 SSRF | 🟢 N/A | SPA sem fetch server-side |

---

## 5. Pontos Positivos (mantidos e verificados)

- ✅ Fluxo OAuth **PKCE** + troca de código com limpeza de URL (`AuthContext.jsx:73-84`);
- ✅ Nenhuma leitura manual de localStorage para auth; sessão via `onAuthStateChange`;
- ✅ Sanitização DOMPurify (`ALLOWED_TAGS: []`) em todos os campos user-generated públicos (`ProfilePage.jsx:16`);
- ✅ Validação dupla de `cor_fundo` (client `isValidColor` + constraint `cor_fundo_check` no banco);
- ✅ URLs de links validadas contra esquema `http/https` (`LinkForm.jsx:15-22`); iframes de vídeo com domínios fixos + `sandbox` + fallback seguro (`VideoEmbed.jsx`);
- ✅ `claim_slug` atômico + `UNIQUE(slug)` + blocklist de slugs via constraint no banco (`slug_format_check`);
- ✅ Cofre de slugs (cooldown 30 dias) com RLS restrita ao dono;
- ✅ `.env` fora do Git; nenhum `service_role`/segredo no repositório nem no histórico analisado;
- ✅ CI injeta segredos via GitHub Secrets; logger suprime logs em produção;
- ✅ `rel="noopener noreferrer"` nos links externos renderizados.

---

## 6. Plano de Remediação Priorizado

| Prioridade | Ação | Esforço | Referência |
|---|---|---|---|
| P0 (imediato) | Aplicar trigger `guard_usuario_columns` + whitelist de campos em `updateProfile` | ~1h | SEC-C01 |
| P0 (imediato) | Corrigir `claim_slug` com validação `auth.uid()` | ~30min | SEC-A01 |
| P1 (esta semana) | Replicar headers no `.htaccess` (+HSTS, base-uri, form-action) e validar com `curl -I` | ~1h | SEC-A02 |
| P1 (esta semana) | `REVOKE/GRANT` de colunas em `usuarios`; revisar exposição anon | ~1h | SEC-A03 |
| P1 (esta semana) | `npm audit fix`; bump `dompurify ^3.4.13`; gate `npm audit` no CI | ~1h | SEC-M01 |
| P2 (próximas 2 semanas) | Captcha + rate limit no Auth; revisar rate limits do painel Supabase | ~2h | SEC-M03 |
| P2 | Edge Function admin + tabela `admin_audit_log` | ~4-6h | SEC-M04/C01 |
| P2 | Avaliar `@supabase/ssr` (cookies HttpOnly) na roadmap | médio prazo | SEC-M02 |
| P3 | Itens SEC-B01..B06 | ~2h somadas | Baixos |

**Re-teste sugerido:** após P0/P1, repetir os três testes de verificação indicados nas seções 3 (PoC curl do C01, RPC cross-user do A01 e inspeção de headers) — todos devem falhar/retornar erro.

---

## 7. Conclusão

O projeto evoluiu bem desde julho (sanitização, PKCE, constraints de banco e validações client+server nos campos de conteúdo estão sólidos). Contudo, o modelo "RLS como única fronteira" foi aplicado de forma incompleta: as policies garantem *posse da linha*, mas não *integridade de colunas* nem *identidade do chamador em funções definer* — resultando na escalação crítica SEC-C01 e no IDOR SEC-A01, ambos exploráveis por qualquer conta gratuita em minutos. Recomenda-se tratar P0 ainda hoje e revalidar os headers em produção, cujo arquivo atual só funcionaria em hospedagens Cloudflare/Netlify — não na Hostinger utilizada.

---
*Relatório gerado estaticamente em 25/08/2026. Análise baseada no commit `a82aed0`. Testes dinâmicos (exploits reais contra produção) não foram executados — as PoCs devem ser validadas primeiro em ambiente de staging.*
