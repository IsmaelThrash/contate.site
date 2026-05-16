# 🔒 Relatório de Auditoria de Segurança — contate.site

**Data:** 15 de Maio de 2026
**Escopo:** Análise estática do código-fonte (Frontend React + Supabase)
**Repositório:** https://github.com/IsmaelThrash/contate.site

---

## 🔴 CRÍTICO

### 1. Race Condition na criação de slugs
- **Localização:** `OnboardingPage.jsx` e `HomePage.jsx`
- **Descrição:** A verificação de disponibilidade do slug é feita com um `fetch` separado do `updateProfile`. Entre o check e o create, outro usuário pode reivindicar o mesmo slug.
- **Impacto:** Conflito de dados, possível sobrescrita ou erro de integridade.
- **Fix:** Use constraint única no banco de dados + trate o erro de duplicata no backend.

### 2. Token exposto no localStorage com manipulação direta
- **Localização:** `AuthContext.jsx:130`
- **Descrição:** O código busca manualmente o token no localStorage (`sb-*-auth-token`) e o usa em requests `fetch` raw. Se um atacante injetar um token falso no localStorage, pode fazer requests como outro usuário.
- **Impacto:** Possível escalada de privilégios ou acesso não autorizado se combinado com XSS.
- **Fix:** Use sempre `supabase.auth.getSession()` para obter tokens válidos e seguros.

### 3. Falta de validação de URLs nos links
- **Localização:** `LinkForm.jsx`
- **Descrição:** O formulário aceita qualquer string como URL sem validação de protocolo. Permite esquemas perigosos como `javascript:alert(1)` ou `data:text/html,...`.
- **Impacto:** XSS armazenado via link malicioso.
- **Fix:** Valide que URLs começam estritamente com `http://` ou `https://` antes de salvar.

---

## 🟠 ALTO

### 4. XSS via campos de perfil
- **Localização:** `ProfilePage.jsx`, `ProfileSettings.jsx`
- **Descrição:** Campos como `meta_titulo`, `nome_exibicao`, `bio` são renderizados diretamente no DOM e no `React Helmet`. Se o Supabase RLS não sanitizar, um usuário pode injetar scripts.
- **Impacto:** Cross-Site Scripting (XSS) refletido/armazenado.
- **Fix:** Sanitize inputs no frontend (ex: DOMPurify) + RLS policies no Supabase que validam conteúdo.

### 5. Iframe embed sem sandbox
- **Localização:** `VideoEmbed.jsx`
- **Descrição:** Iframes para YouTube/Vimeo/TikTok são renderizados sem o atributo `sandbox`. Se a regex de extração de ID falhar ou for bypassada, pode carregar conteúdo arbitrário.
- **Impacto:** Clickjacking ou execução de scripts maliciosos no iframe.
- **Fix:** Adicione `sandbox="allow-scripts allow-same-origin"` nos iframes.

### 6. Auth flowType `implicit` obsoleto
- **Localização:** `supabaseClient.js:26`
- **Descrição:** Uso de `flowType: 'implicit'`. Este flow é considerado inseguro pois expõe tokens na URL.
- **Impacto:** Vazamento de tokens via referer header ou histórico do navegador.
- **Fix:** Mude para `flowType: 'pkce'`.

---

## 🟡 MÉDIO

### 7. Fallback de timeout de 3s no Auth
- **Localização:** `AuthContext.jsx:72`
- **Descrição:** Força `loading = false` após 3s mesmo sem resposta do Supabase. Pode renderizar conteúdo autenticado com `currentUser = null`.
- **Impacto:** Estado inconsistente, possível bypass de rotas protegidas em condições de rede lenta.
- **Fix:** Aumente o timeout ou trate o estado de fallback de forma mais segura.

### 8. Drag-and-drop envia dados completos no upsert
- **Localização:** `DashboardPage.jsx:118`
- **Descrição:** Ao reordenar, envia `usuario_id`, `titulo`, `url`, `tipo`, `ativo` no upsert. Se RLS não validar, um usuário pode modificar links de outros.
- **Impacto:** Modificação não autorizada de dados.
- **Fix:** No upsert, envie apenas `{ id, ordem }`. O backend deve validar `usuario_id` via sessão.

### 9. Validação de slug apenas no frontend
- **Localização:** `OnboardingPage.jsx`
- **Descrição:** Validação de slug via regex e blocklist ocorre apenas no cliente. Nada impede um request direto à API com slug malicioso.
- **Impacto:** Criação de slugs reservados ou maliciosos via API direta.
- **Fix:** Validação obrigatória no backend (Supabase RLS ou database constraint).

---

## 🟢 BAIXO

### 10. Informações sensíveis em console.log
- **Descrição:** Vários `console.error` espalhados podem vazar dados ou stack traces em produção.
- **Fix:** Remova logs sensíveis ou use logger condicional (`if (import.meta.env.DEV)`).

### 11. Falta de CSP headers
- **Descrição:** Como SPA estática, depende dos headers do servidor (Hostinger) para Content Security Policy.
- **Fix:** Configure CSP headers no servidor para prevenir XSS e injeção de recursos.

### 12. Avatar upload comentado (TODO)
- **Localização:** `ProfileSettings.jsx:62`
- **Descrição:** Upload de avatar desabilitado mas o input de file ainda existe no DOM.
- **Fix:** Remova o input ou implemente com validação de tipo/tamanho.

---

## ✅ Pontos Positivos Encontrados

- ✅ Magic link (sem senha) — reduz risco de credential stuffing
- ✅ `rel="noopener noreferrer"` nos links externos
- ✅ Reserved slugs blocklist implementada
- ✅ ProtectedRoute para rotas autenticadas
- ✅ `.gitignore` correto para `.env` e arquivos sensíveis
- ✅ Uso de `react-helmet` para SEO dinâmico

---

*Relatório gerado automaticamente para análise de IA.*
