# 📓 DEVLOG — contate.site v2

## 2026-05-12 — Sessão de Deploy: Resolução do Deadlock do Onboarding

### Resumo
Identificamos e corrigimos o erro fatal do Onboarding que impedia o acesso ao Dashboard (loop infinito no Onboarding / tela branca). O SDK do Supabase estava causando deadlock na persistência da sessão.

---

### 🐛 Problemas Resolvidos

#### 1. Deadlock da Sessão (Web Locks API)
- **Problema:** Ao fazer login via Google OAuth, a aplicação congelava (tela branca) tentando gravar a sessão localmente.
- **Causa:** Conflitos do `localStorage` com a API nativa do Supabase GoTrue SDK (`navigator.locks`).
- **Solução:** Criada uma classe de Storage customizada em `supabaseClient.js` ignorando os locks e forçando a leitura síncrona do `localStorage`.

#### 2. Loop Infinito no Onboarding
- **Problema:** Ao escolher um slug no Onboarding, o usuário era devolvido para a própria tela de Onboarding, sem entrar no Dashboard.
- **Causa:** O salvamento forçava um Hard Reload (`window.location.href`). O contexto do React reiniciava sem o `slug` mapeado devido à lentidão do Cold Start do Supabase para baixar o perfil, ativando a proteção de rota (`ProtectedRoute`).
- **Solução:**
  - Em `AuthContext.jsx`, a leitura do perfil foi otimizada para `fetch` nativo (REST) bypassando o SDK travado.
  - O estado do usuário agora recebe *Optimistic Updates* (recebe o ID instantaneamente sem esperar o DB).
  - Em `OnboardingPage.jsx`, o uso do `navigate('/dashboard', { replace: true })` e `updateProfile()` garantem que a memória do React seja atualizada e a rota alterada sem reload.

#### 3. Deploy via FTP
- **Problema:** A `FTP-Deploy-Action` falhava repetidamente com erro `Timeout (control socket)`.
- **Causa:** O servidor do Hostinger rate-limita o FTP por excesso de conexões simultâneas quando ocorrem múltiplos pushes rápidos.
- **Solução:** Pushes foram espaçados para permitir a liberação das conexões TCP no firewall do Hostinger.

### 📁 Arquivos Modificados Nesta Sessão
| Arquivo | Tipo | O que mudou |
|---------|------|-------------|
| `apps/web/src/lib/supabaseClient.js` | FIX | Criado proxy Storage customizado |
| `apps/web/src/contexts/AuthContext.jsx` | FIX | Conversão de calls do DB para Fetch API nativo + Optimistic Update no `onAuthStateChange` |
| `apps/web/src/pages/OnboardingPage.jsx` | FIX | Remoção do `window.location.href`, adoção do `updateProfile` com redirecionamento React |
| `apps/web/src/pages/DashboardPage.jsx` | FIX | Transição das escritas e deleções de links do SDK para a Fetch API |

---

## 2026-05-11 — Sessão Completa: Supabase Auth + Google OAuth + Estabilização

### Resumo
Sessão intensiva de debugging e estabilização da autenticação com Supabase e Google OAuth.
Todas as fases do plano de implementação (1-5) foram concluídas com sucesso.

---

### 🔐 Autenticação — Problemas Resolvidos

#### 1. Login com Magic Link
- **Problema:** `Invalid supabaseUrl` ao inicializar o cliente.
- **Solução:** Criado arquivo `.env` em `apps/web/` com as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

#### 2. Login com Google OAuth (PRINCIPAL DESAFIO)
Múltiplas camadas de problemas foram identificadas e resolvidas em sequência:

| # | Problema | Causa Raiz | Solução |
|---|---------|-----------|---------|
| 1 | Erro `flowName=GeneralOAuthFlow` | Client ID errado no Supabase (estava `contate.site` em vez do ID real) | Colocado o Client ID completo do Google Cloud: `424695097438-...apps.googleusercontent.com` |
| 2 | Loop infinito: login OK mas volta pra tela de login | `redirectTo` apontava para `/dashboard` (rota protegida) que redirecionava para `/login` antes do token ser processado | Mudado `redirectTo` para `/login` + adicionado `useEffect` de redirect no `LoginPage` |
| 3 | Sessão não persistia após OAuth redirect | `supabaseClient.js` criado sem configurações de `auth` — `detectSessionInUrl` e `flowType` não estavam definidos | Configurado explicitamente `flowType: 'implicit'`, `detectSessionInUrl: true`, `persistSession: true` |
| 4 | `Unable to exchange external code` | **Chave secreta do Google OAuth estava desativada** no Google Cloud Console | Usuário ativou a chave secreta e gerou uma nova no Google Cloud Console |
| 5 | Crash do React: `Cannot destructure useAuth()` | HMR (Hot Module Reload) do Vite criava múltiplas instâncias do GoTrueClient, quebrando o AuthContext | Adicionado fallback seguro no `useAuth()` com valores default quando o contexto é `null` |

#### 3. Salvamento de Perfil (Dashboard)
- **Problema:** `null value in column "slug" violates not-null constraint` ao salvar cor de fundo.
- **Causa:** O `updateProfile()` usava `upsert` sem incluir o `slug` existente.
- **Solução:** O `updateProfile` agora injeta automaticamente `currentUser.slug` no payload quando ausente.

#### 4. Busca de Perfil (404 PGRST116)
- **Problema:** `Cannot coerce the result to a single JSON object` quando perfil não existia.
- **Solução:** Trocado `.single()` por `.maybeSingle()` em todas as queries de perfil.

---

### 🎨 Funcionalidades Implementadas (Fases 1-4)

#### Fase 1-3: Core, Auth, Dashboard
- Sistema de autenticação completo (Magic Link + Google OAuth)
- Dashboard com gerenciamento de links (CRUD + Drag & Drop)
- Perfil público em `/:slug`
- Onboarding para escolha de slug

#### Fase 4: SEO + Video Embed
- **SEO:** Injeção dinâmica de `application/ld+json` (Schema `Person`) via `react-helmet`
- **Video Embed:** Componente `VideoEmbed.jsx` com suporte a YouTube, TikTok e Vimeo (lazy-loading)
- **Ícones Automáticos:** Função `getSocialIcon()` detecta rede social pela URL do link
- **Tipo de Bloco:** Usuário seleciona manualmente "Link" vs "Vídeo" no formulário

#### Fase 5: Testes e Estabilização
- Todas as null-safety fixes aplicadas (VideoEmbed, getSocialIcon, link.url.replace)
- Error boundaries via useAuth fallback
- Debug logging com `[Auth]` prefix para diagnóstico

---

### 📁 Arquivos Modificados Nesta Sessão

| Arquivo | Tipo | O que mudou |
|---------|------|-------------|
| `apps/web/src/lib/supabaseClient.js` | CONFIG | Adicionado `auth: { flowType, detectSessionInUrl, persistSession }` |
| `apps/web/src/contexts/AuthContext.jsx` | CORE | Reescrito: `useAuth` com fallback, `onAuthStateChange` como handler primário, `updateProfile` com slug injection, `maybeSingle()` |
| `apps/web/src/pages/LoginPage.jsx` | PAGE | Redirect se autenticado, detecção de erros OAuth via URL params, toast de vinculação de contas, texto informativo |
| `apps/web/src/pages/ProfilePage.jsx` | PAGE | Null-safety em `getSocialIcon()` e `link.url.replace()` |
| `apps/web/src/pages/OnboardingPage.jsx` | PAGE | Removido campo `email` do payload de `updateProfile` |
| `apps/web/src/components/VideoEmbed.jsx` | COMPONENT | Null-safety em parsers de URL (YouTube, Vimeo, TikTok) |
| `apps/web/src/components/LinkForm.jsx` | COMPONENT | Seleção manual de tipo (link/video) |
| `apps/web/.env` | CONFIG | Variáveis do Supabase |

---

### ⚙️ Configurações Externas Necessárias

#### Supabase Dashboard
- **Authentication > Providers > Google:** Ativado com Client ID e Client Secret corretos
- **Authentication > URL Configuration:**
  - Site URL: `http://localhost:3000/`
  - Redirect URLs: `http://localhost:3000/*`, `http://localhost:3000/**`
- **Authentication > Sign In / Providers:**
  - Allow manual linking: **OFF** (vinculação automática de contas)
  - Confirm email: **ON**

#### Google Cloud Console
- **OAuth Client:** `contate-site-auth` — Status: **Ativado**
- **Callback URL:** `https://jxdupvgluypllzfupung.supabase.co/auth/v1/callback`
- **Origens autorizadas:** `http://localhost:3000`

---

### 🚀 Próximos Passos
1. Deploy em produção (Hostinger ou Vercel)
2. Atualizar URLs do OAuth para domínio de produção
3. Refinamento visual do perfil público
4. Implementar upload de avatar via Supabase Storage
5. Analytics básico (contagem de cliques nos links)

## Regras do Projeto
- **GitHub Workflow**: Ap�s cada atualiza��o ou corre��o de bug conclu�da, o agente DEVE fazer o commit e o push autom�tico para o GitHub.
