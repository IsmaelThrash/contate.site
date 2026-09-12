# 📓 DEVLOG — contate.site v2

## 2026-09-11 — Migração Concluída: Self-Hosted VPS (Docker + Cloudflare)

### Resumo
Migração total da infraestrutura de backend do Supabase Cloud (EUA) para uma instância local (winbot) executando o Supabase stack via Docker Compose. Implementamos túneis reversos via Cloudflare e configuramos SMTP próprio, garantindo soberania de dados, latência zero e custo zero de cloud provider.

---

### 🛡️ O que foi feito:

#### 1. Backend Self-Hosted (Docker)
- Supabase stack (db, auth, rest, real-time) orquestrado via `docker-compose.supabase.yml` e `docker-compose.override.yml`.
- Banco de dados inicializado a partir do schema de produção via `supabase_init.sql`.

#### 2. Networking e Domínios
- Cloudflare Edge Tunnel (`cloudflared`) configurado para rotear tráfego externo para a porta 8000 (Kong/Envoy).
- DNS apontado para `api.contate.site` resolvendo diretamente para o túnel local, driblando CGNAT da operadora.

#### 3. Autenticação e Segurança (GoTrue)
- Google OAuth atualizado no GCP Console com a nova origin e callback `https://api.contate.site`.
- Servidor SMTP da Hostinger (`suporte@contate.site`) configurado no `auth` container para envio de Magic Links e Confirmações.

#### 4. Frontend e Build
- Arquivos `.env` apontando para o backend interno. Script de build empacotando e exportando o diretório `dist` para a raiz do repositório, ativando Webhooks da Hostinger.

### Resumo
Identificamos e corrigimos o erro fatal do Onboarding que impedia o acesso ao Dashboard (loop infinito no Onboarding / tela branca). O SDK do Supabase estava causando deadlock na persistÃªncia da sessÃ£o.

---

### ðŸ�› Problemas Resolvidos

#### 1. Deadlock da SessÃ£o (Web Locks API)
- **Problema:** Ao fazer login via Google OAuth, a aplicaÃ§Ã£o congelava (tela branca) tentando gravar a sessÃ£o localmente.
- **Causa:** Conflitos do `localStorage` com a API nativa do Supabase GoTrue SDK (`navigator.locks`).
- **SoluÃ§Ã£o:** Criada uma classe de Storage customizada em `supabaseClient.js` ignorando os locks e forÃ§ando a leitura sÃ­ncrona do `localStorage`.

#### 2. Loop Infinito no Onboarding
- **Problema:** Ao escolher um slug no Onboarding, o usuÃ¡rio era devolvido para a prÃ³pria tela de Onboarding, sem entrar no Dashboard.
- **Causa:** O salvamento forÃ§ava um Hard Reload (`window.location.href`). O contexto do React reiniciava sem o `slug` mapeado devido Ã  lentidÃ£o do Cold Start do Supabase para baixar o perfil, ativando a proteÃ§Ã£o de rota (`ProtectedRoute`).
- **SoluÃ§Ã£o:**
  - Em `AuthContext.jsx`, a leitura do perfil foi otimizada para `fetch` nativo (REST) bypassando o SDK travado.
  - O estado do usuÃ¡rio agora recebe *Optimistic Updates* (recebe o ID instantaneamente sem esperar o DB).
  - Em `OnboardingPage.jsx`, o uso do `navigate('/dashboard', { replace: true })` e `updateProfile()` garantem que a memÃ³ria do React seja atualizada e a rota alterada sem reload.

#### 3. Deploy via FTP
- **Problema:** A `FTP-Deploy-Action` falhava repetidamente com erro `Timeout (control socket)`.
- **Causa:** O servidor do Hostinger rate-limita o FTP por excesso de conexÃµes simultÃ¢neas quando ocorrem mÃºltiplos pushes rÃ¡pidos.
- **SoluÃ§Ã£o:** Pushes foram espaÃ§ados para permitir a liberaÃ§Ã£o das conexÃµes TCP no firewall do Hostinger.

### ðŸ“� Arquivos Modificados Nesta SessÃ£o
| Arquivo | Tipo | O que mudou |
|---------|------|-------------|
| `apps/web/src/lib/supabaseClient.js` | FIX | Criado proxy Storage customizado |
| `apps/web/src/contexts/AuthContext.jsx` | FIX | ConversÃ£o de calls do DB para Fetch API nativo + Optimistic Update no `onAuthStateChange` |
| `apps/web/src/pages/OnboardingPage.jsx` | FIX | RemoÃ§Ã£o do `window.location.href`, adoÃ§Ã£o do `updateProfile` com redirecionamento React |
| `apps/web/src/pages/DashboardPage.jsx` | FIX | TransiÃ§Ã£o das escritas e deleÃ§Ãµes de links do SDK para a Fetch API |

---

## 2026-05-11 â€” SessÃ£o Completa: Supabase Auth + Google OAuth + EstabilizaÃ§Ã£o

### Resumo
SessÃ£o intensiva de debugging e estabilizaÃ§Ã£o da autenticaÃ§Ã£o com Supabase e Google OAuth.
Todas as fases do plano de implementaÃ§Ã£o (1-5) foram concluÃ­das com sucesso.

---

### ðŸ”� AutenticaÃ§Ã£o â€” Problemas Resolvidos

#### 1. Login com Magic Link
- **Problema:** `Invalid supabaseUrl` ao inicializar o cliente.
- **SoluÃ§Ã£o:** Criado arquivo `.env` em `apps/web/` com as variÃ¡veis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

#### 2. Login com Google OAuth (PRINCIPAL DESAFIO)
MÃºltiplas camadas de problemas foram identificadas e resolvidas em sequÃªncia:

| # | Problema | Causa Raiz | SoluÃ§Ã£o |
|---|---------|-----------|---------|
| 1 | Erro `flowName=GeneralOAuthFlow` | Client ID errado no Supabase (estava `contate.site` em vez do ID real) | Colocado o Client ID completo do Google Cloud: `424695097438-...apps.googleusercontent.com` |
| 2 | Loop infinito: login OK mas volta pra tela de login | `redirectTo` apontava para `/dashboard` (rota protegida) que redirecionava para `/login` antes do token ser processado | Mudado `redirectTo` para `/login` + adicionado `useEffect` de redirect no `LoginPage` |
| 3 | SessÃ£o nÃ£o persistia apÃ³s OAuth redirect | `supabaseClient.js` criado sem configuraÃ§Ãµes de `auth` â€” `detectSessionInUrl` e `flowType` nÃ£o estavam definidos | Configurado explicitamente `flowType: 'implicit'`, `detectSessionInUrl: true`, `persistSession: true` |
| 4 | `Unable to exchange external code` | **Chave secreta do Google OAuth estava desativada** no Google Cloud Console | UsuÃ¡rio ativou a chave secreta e gerou uma nova no Google Cloud Console |
| 5 | Crash do React: `Cannot destructure useAuth()` | HMR (Hot Module Reload) do Vite criava mÃºltiplas instÃ¢ncias do GoTrueClient, quebrando o AuthContext | Adicionado fallback seguro no `useAuth()` com valores default quando o contexto Ã© `null` |

#### 3. Salvamento de Perfil (Dashboard)
- **Problema:** `null value in column "slug" violates not-null constraint` ao salvar cor de fundo.
- **Causa:** O `updateProfile()` usava `upsert` sem incluir o `slug` existente.
- **SoluÃ§Ã£o:** O `updateProfile` agora injeta automaticamente `currentUser.slug` no payload quando ausente.

#### 4. Busca de Perfil (404 PGRST116)
- **Problema:** `Cannot coerce the result to a single JSON object` quando perfil nÃ£o existia.
- **SoluÃ§Ã£o:** Trocado `.single()` por `.maybeSingle()` em todas as queries de perfil.

---

### ðŸŽ¨ Funcionalidades Implementadas (Fases 1-4)

#### Fase 1-3: Core, Auth, Dashboard
- Sistema de autenticaÃ§Ã£o completo (Magic Link + Google OAuth)
- Dashboard com gerenciamento de links (CRUD + Drag & Drop)
- Perfil pÃºblico em `/:slug`
- Onboarding para escolha de slug

#### Fase 4: SEO + Video Embed
- **SEO:** InjeÃ§Ã£o dinÃ¢mica de `application/ld+json` (Schema `Person`) via `react-helmet`
- **Video Embed:** Componente `VideoEmbed.jsx` com suporte a YouTube, TikTok e Vimeo (lazy-loading)
- **Ã�cones AutomÃ¡ticos:** FunÃ§Ã£o `getSocialIcon()` detecta rede social pela URL do link
- **Tipo de Bloco:** UsuÃ¡rio seleciona manualmente "Link" vs "VÃ­deo" no formulÃ¡rio

#### Fase 5: Testes e EstabilizaÃ§Ã£o
- Todas as null-safety fixes aplicadas (VideoEmbed, getSocialIcon, link.url.replace)
- Error boundaries via useAuth fallback
- Debug logging com `[Auth]` prefix para diagnÃ³stico

---

### ðŸ“� Arquivos Modificados Nesta SessÃ£o

| Arquivo | Tipo | O que mudou |
|---------|------|-------------|
| `apps/web/src/lib/supabaseClient.js` | CONFIG | Adicionado `auth: { flowType, detectSessionInUrl, persistSession }` |
| `apps/web/src/contexts/AuthContext.jsx` | CORE | Reescrito: `useAuth` com fallback, `onAuthStateChange` como handler primÃ¡rio, `updateProfile` com slug injection, `maybeSingle()` |
| `apps/web/src/pages/LoginPage.jsx` | PAGE | Redirect se autenticado, detecÃ§Ã£o de erros OAuth via URL params, toast de vinculaÃ§Ã£o de contas, texto informativo |
| `apps/web/src/pages/ProfilePage.jsx` | PAGE | Null-safety em `getSocialIcon()` e `link.url.replace()` |
| `apps/web/src/pages/OnboardingPage.jsx` | PAGE | Removido campo `email` do payload de `updateProfile` |
| `apps/web/src/components/VideoEmbed.jsx` | COMPONENT | Null-safety em parsers de URL (YouTube, Vimeo, TikTok) |
| `apps/web/src/components/LinkForm.jsx` | COMPONENT | SeleÃ§Ã£o manual de tipo (link/video) |
| `apps/web/.env` | CONFIG | VariÃ¡veis do Supabase |

---

### âš™ï¸� ConfiguraÃ§Ãµes Externas NecessÃ¡rias

#### Supabase Dashboard
#### Supabase Auth (GoTrue / URL Configuration)
- **Site URL:** `https://contate.site`
- **Redirect URLs (Allow List):** `https://contate.site/*`, `https://contate.site/**`, `https://www.contate.site/*`, `http://localhost:3000/*`, `http://localhost:3000/**`

#### Google Cloud Console
- **OAuth Client:** `contate-site-auth` — Status: **Ativado**
- **Callback URL:** `https://api.contate.site/auth/v1/callback`
- **Origens autorizadas:** `https://contate.site`, `https://www.contate.site`, `http://localhost:3000`

---

### ðŸš€ PrÃ³ximos Passos
1. Deploy em produÃ§Ã£o (Hostinger ou Vercel)
2. Atualizar URLs do OAuth para domÃ­nio de produÃ§Ã£o
3. Refinamento visual do perfil pÃºblico
4. Implementar upload de avatar via Supabase Storage
5. Analytics bÃ¡sico (contagem de cliques nos links)

## Regras do Projeto
- **GitHub Workflow**: Após cada atualização ou correção de bug concluída, o agente DEVE fazer o commit e o push automático para o GitHub.

## 📝 Pendências / Tech Debt
- **Gerenciamento de Secrets**: Atualmente, o arquivo `.env` do Supabase no servidor `winbot` está sendo sincronizado manualmente com o script standalone `sync-env-to-winbot.ps1`. No futuro (quando a aplicação crescer ou por segurança), é altamente recomendado migrar para um gerenciador de secrets self-hosted open source (ex: **Infisical**) rodando na mesma infraestrutura, eliminando a necessidade deste sync manual de arquivos.

---

### 🎨 Revisão e Reorganização da Dashboard (v2.1)
- **Slug Fixo & Imutável**: Removido campo de edição de slug do formulário; slug agora é exclusivamente exibido no card lateral "Seu Link Exclusivo" com etiqueta de fixo.
- **Declaração de Titularidade**: Inserido callout de responsabilidade jurídica atestando que o usuário deve ser o legítimo titular ou representante autorizado caso o perfil represente marcas comerciais ou empresas.
- **Limpeza de Histórico de Slugs**: Removidas referências a histórico, cofre de 30 dias de reservas e RPCs não utilizadas no frontend.
- **Fluxo Integrado de Conteúdo**: O bloco **Meus Links** foi posicionado imediatamente abaixo de **Nome de Exibição & Bio**, permitindo acesso e reordenação instantânea sem rolagem.
- **SEO & Segurança Modular**: Módulo de SEO alocado abaixo dos links; Zona de Segurança com exclusão de conta alocada de forma minimalista e discreta no rodapé.
- **Aparência Básica Corrigida**: Cores refatoradas para paleta HEX de alta fidelidade (`#080A0F`, `#0B132B`, `#0F172A`, `#062016`, `#1C0B14`, `#140B24`), com feedback por toast em tempo real e renderização fiel na página pública `ProfilePage.jsx`.
