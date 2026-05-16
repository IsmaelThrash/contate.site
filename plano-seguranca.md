# 🔒 Plano de Remediação de Segurança — contate.site
> Baseado no Relatório de Auditoria da Qwen · 15 de Maio de 2026
> Projeto: Vite + React + Supabase · Repositório: github.com/IsmaelThrash/contate.site

---

## 👥 Personas Envolvidas

| Persona | Papel |
|---|---|
| **🛡️ Rex** | Security Engineer — lidera correções de auth, XSS e injeção |
| **⚙️ Orion** | Backend/Database Engineer — RLS, constraints e validações no Supabase |
| **🎨 Lyra** | Frontend Engineer — sanitização de inputs, validações de UI, iframes |
| **🔭 Astra** | PM / Orquestradora — define prioridades, valida entregas, fecha fases |

---

## 📊 Visão Geral das Vulnerabilidades

| # | Severidade | Problema | Persona |
|---|---|---|---|
| 1 | 🔴 CRÍTICO | Race condition em slugs | Orion |
| 2 | 🔴 CRÍTICO | Token exposto no localStorage | Rex |
| 3 | 🔴 CRÍTICO | URLs sem validação de protocolo | Lyra |
| 4 | 🟠 ALTO | XSS via campos de perfil | Lyra + Orion |
| 5 | 🟠 ALTO | Iframe sem sandbox | Lyra |
| 6 | 🟠 ALTO | Auth flowType `implicit` obsoleto | Rex |
| 7 | 🟡 MÉDIO | Timeout de auth renderizando estado null | Rex |
| 8 | 🟡 MÉDIO | Upsert envia dados desnecessários | Orion |
| 9 | 🟡 MÉDIO | Validação de slug só no frontend | Orion |
| 10 | 🟢 BAIXO | console.log em produção | Lyra |
| 11 | 🟢 BAIXO | Falta de CSP headers | Rex |
| 12 | 🟢 BAIXO | Input de avatar órfão no DOM | Lyra |

---

## ⚡ PARTE 1 — Correções Críticas de Auth e Injeção
> **Persona Líder:** Rex (Security Engineer)
> **Suporte:** Orion (Database)
> **Prazo estimado:** 1 sessão intensa (~2-3h)
> **Branch:** `fix/security-critical`

### 🎯 Objetivo
Eliminar os 3 vetores críticos que podem causar escalada de privilégios, XSS armazenado ou corrida de dados no banco.

---

### Tarefa 1.1 — Rex: Migrar auth para `flowType: 'pkce'`
**Arquivo:** `src/lib/supabaseClient.js:26`

**Problema:** `flowType: 'implicit'` expõe tokens de acesso na URL, ficam no histórico do navegador e no header `Referer`.

**Ação:**
```js
// ANTES
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { flowType: 'implicit' }
})

// DEPOIS
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
  }
})
```

**Critério de aceite:** Fluxo de login Google OAuth funciona sem erros. Token não aparece na URL após redirect.

---

### Tarefa 1.2 — Rex: Remover leitura manual do localStorage para tokens
**Arquivo:** `src/context/AuthContext.jsx:130`

**Problema:** Código faz `localStorage.getItem('sb-*-auth-token')` e usa o valor raw em requests `fetch`. Um XSS poderia sobrescrever esse valor.

**Ação:**
```js
// REMOVER isto:
const token = localStorage.getItem(`sb-${PROJECT_REF}-auth-token`)
const parsed = JSON.parse(token)
const accessToken = parsed?.access_token

// SUBSTITUIR por:
const { data: { session } } = await supabase.auth.getSession()
const accessToken = session?.access_token
```

**Critério de aceite:** Nenhuma leitura direta do localStorage para fins de autenticação. Todas as chamadas usam `supabase.auth.getSession()`.

---

### Tarefa 1.3 — Lyra: Validar protocolo de URLs no LinkForm
**Arquivo:** `src/components/LinkForm.jsx`

**Problema:** Aceita `javascript:alert(1)` ou `data:text/html,...` como URL válida, viabilizando XSS armazenado.

**Ação:**
```js
// Adicionar validação antes do submit:
function isUrlSegura(url) {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// No handler de submit:
if (!isUrlSegura(formData.url)) {
  setError('URL inválida. Use apenas http:// ou https://')
  return
}
```

**Critério de aceite:** Tentar salvar `javascript:alert(1)` retorna erro de validação. URLs HTTP/HTTPS são aceitas normalmente.

---

### Tarefa 1.4 — Orion: Adicionar UNIQUE constraint no slug + tratamento de erro
**Supabase:** SQL Migration

**Problema:** Não há constraint única no banco. A race condition entre o check de disponibilidade e o insert permite slugs duplicados.

**SQL a executar no Supabase:**
```sql
-- Garantir constraint única (verificar se já existe)
ALTER TABLE profiles ADD CONSTRAINT profiles_slug_unique UNIQUE (slug);

-- Função auxiliar para registro atômico de slug
CREATE OR REPLACE FUNCTION claim_slug(p_user_id uuid, p_slug text)
RETURNS boolean AS $$
BEGIN
  UPDATE profiles SET slug = p_slug WHERE id = p_user_id AND slug IS NULL;
  RETURN FOUND;
EXCEPTION
  WHEN unique_violation THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Frontend (OnboardingPage.jsx):**
```js
// Substituir o check + update separados por uma chamada atômica:
const { data, error } = await supabase.rpc('claim_slug', {
  p_user_id: currentUser.id,
  p_slug: slug
})

if (!data) {
  setError('Este slug já foi escolhido. Tente outro.')
  return
}
```

**Critério de aceite:** Dois usuários tentando registrar o mesmo slug simultaneamente — apenas um deve conseguir. O segundo recebe erro amigável.

---

### ✅ Checklist Parte 1
- [ ] PKCE ativado e testado no fluxo OAuth
- [ ] localStorage removido do AuthContext
- [ ] Validação de URL no LinkForm
- [ ] UNIQUE constraint criada no banco
- [ ] Função `claim_slug` criada e testada
- [ ] PR revisado e aprovado por Astra
- [ ] Deploy em staging validado

---

## 🛡️ PARTE 2 — Correções de Severidade Alta (XSS e Iframes)
> **Persona Líder:** Lyra (Frontend Engineer)
> **Suporte:** Orion (RLS Policies)
> **Prazo estimado:** 1 sessão (~2h)
> **Branch:** `fix/security-high`

### 🎯 Objetivo
Fechar os vetores de XSS via campos de perfil e blindar os embeds de vídeo contra clickjacking.

---

### Tarefa 2.1 — Lyra: Sanitizar campos de perfil com DOMPurify
**Arquivos:** `src/pages/ProfilePage.jsx`, `src/pages/ProfileSettings.jsx`

**Instalação:**
```bash
npm install dompurify
```

**Uso nos campos renderizados:**
```js
import DOMPurify from 'dompurify'

// Para campos exibidos no DOM (texto puro, sem HTML):
const bioSegura = DOMPurify.sanitize(perfil.bio, { ALLOWED_TAGS: [] })
const nomeSeguro = DOMPurify.sanitize(perfil.nome_exibicao, { ALLOWED_TAGS: [] })

// Para React Helmet:
<title>{DOMPurify.sanitize(perfil.meta_titulo, { ALLOWED_TAGS: [] })}</title>
```

**Critério de aceite:** Injetar `<script>alert(1)</script>` em qualquer campo de perfil — a string deve ser neutralizada na exibição.

---

### Tarefa 2.2 — Lyra: Adicionar `sandbox` nos iframes de vídeo
**Arquivo:** `src/components/VideoEmbed.jsx`

**Ação:**
```jsx
// ANTES:
<iframe src={embedUrl} allowFullScreen />

// DEPOIS:
<iframe
  src={embedUrl}
  sandbox="allow-scripts allow-same-origin allow-presentation"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  loading="lazy"
  title="Vídeo incorporado"
/>
```

**Reforçar a extração de ID para não aceitar URLs arbitrárias:**
```js
function extrairIdYoutube(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Se ID for null, não renderizar o iframe
```

**Critério de aceite:** URL arbitrária não gera iframe. Atributo `sandbox` presente no DOM. Vídeos legítimos continuam funcionando.

---

### Tarefa 2.3 — Orion: Revisar RLS Policies para perfis
**Supabase:** Verificar e reforçar policies existentes

```sql
-- Policy: usuário só pode atualizar seus próprios dados
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: leitura pública de perfis (para a página pública /slug)
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT
  USING (true);
```

**Critério de aceite:** Usuário A não consegue sobrescrever perfil do usuário B via chamada direta à API.

---

### ✅ Checklist Parte 2
- [ ] DOMPurify instalado e aplicado em ProfilePage e ProfileSettings
- [ ] React Helmet recebe apenas texto puro sanitizado
- [ ] Iframes com `sandbox` e regex de validação de ID
- [ ] RLS policies revisadas para tabela `profiles`
- [ ] Teste manual: injetar `<script>` em bio e verificar output
- [ ] PR revisado por Astra

---

## ⚙️ PARTE 3 — Correções de Severidade Média (Estado e Backend)
> **Persona Líder:** Orion (Backend/Database Engineer)
> **Suporte:** Rex (Auth)
> **Prazo estimado:** 1 sessão (~1.5h)
> **Branch:** `fix/security-medium`

### 🎯 Objetivo
Fechar brechas de estado inconsistente no auth, excesso de dados no upsert e validação fraca de slugs.

---

### Tarefa 3.1 — Rex: Tratar timeout do AuthContext de forma segura
**Arquivo:** `src/context/AuthContext.jsx:72`

**Problema:** Após 3s sem resposta do Supabase, o loading é forçado para `false` com `currentUser = null`, podendo renderizar rotas protegidas.

**Ação:**
```js
// ANTES (perigoso):
setTimeout(() => setLoading(false), 3000)

// DEPOIS:
const timeoutId = setTimeout(() => {
  console.warn('[Auth] Timeout — redirecionando para login')
  setCurrentUser(null)
  setLoading(false)
  setAuthError('Sessão expirada. Faça login novamente.')
}, 8000) // Aumentado para 8s para redes lentas

// Limpar timeout quando auth responder normalmente:
return () => clearTimeout(timeoutId)
```

**Critério de aceite:** Em rede lenta (DevTools → Slow 3G), usuário não vê conteúdo protegido. É redirecionado ao login com mensagem.

---

### Tarefa 3.2 — Orion: Minimizar dados no upsert de reordenação
**Arquivo:** `src/pages/DashboardPage.jsx:118`

**Ação:**
```js
// ANTES — envia todos os campos:
const updates = links.map((link, index) => ({
  id: link.id,
  usuario_id: link.usuario_id,
  titulo: link.titulo,
  url: link.url,
  tipo: link.tipo,
  ativo: link.ativo,
  ordem: index
}))

// DEPOIS — apenas o necessário:
const updates = links.map((link, index) => ({
  id: link.id,
  ordem: index
}))

await supabase.from('links').upsert(updates)
```

**RLS complementar no Supabase:**
```sql
CREATE POLICY "links_update_own" ON links
  FOR UPDATE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);
```

**Critério de aceite:** Request de reordenação contém apenas `{id, ordem}`. Tentativa de modificar link de outro usuário retorna 403.

---

### Tarefa 3.3 — Orion: Validação de slug no backend
**Supabase:** Check Constraint

```sql
ALTER TABLE profiles ADD CONSTRAINT slug_format_check
  CHECK (
    slug ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'
    AND slug NOT IN (
      'admin', 'api', 'app', 'auth', 'blog', 'cadastro',
      'contato', 'dashboard', 'entrar', 'home', 'login',
      'logout', 'onboarding', 'perfil', 'planos', 'pricing',
      'profile', 'settings', 'signup', 'suporte', 'www'
    )
  );
```

**Critério de aceite:** `curl -X PATCH` diretamente na API do Supabase tentando definir slug `admin` retorna erro de constraint.

---

### ✅ Checklist Parte 3
- [ ] AuthContext timeout aumentado para 8s com redirecionamento seguro
- [ ] Upsert de reordenação envia apenas `{id, ordem}`
- [ ] RLS policy de update para `links` criada
- [ ] Check constraint de formato de slug criada no banco
- [ ] Blocklist de slugs reservados no banco
- [ ] Teste com Postman verificando 403 para outro usuário
- [ ] PR revisado por Astra

---

## 🧹 PARTE 4 — Hardening Final e Limpeza
> **Persona Líder:** Lyra (Frontend) + Rex (Infra)
> **Prazo estimado:** 0.5 sessão (~1h)
> **Branch:** `fix/security-hardening`

### 🎯 Objetivo
Remover ruído de produção, configurar CSP e limpar código órfão.

---

### Tarefa 4.1 — Lyra: Logger condicional (remover logs em produção)

**Criar `src/lib/logger.js`:**
```js
const isDev = import.meta.env.DEV

export const logger = {
  log: (...args) => isDev && console.log(...args),
  warn: (...args) => isDev && console.warn(...args),
  error: (...args) => isDev && console.error(...args),
}
```

**Substituir** todos os `console.*` pelo `logger` importado em todos os arquivos.

**Critério de aceite:** Em build de produção, nenhum log sensível aparece no DevTools.

---

### Tarefa 4.2 — Rex: Configurar CSP Headers na Hostinger

**Arquivo `public/_headers`:**
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.youtube.com https://player.vimeo.com https://www.tiktok.com; connect-src 'self' https://*.supabase.co; object-src 'none'
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Critério de aceite:** `securityheaders.com` dá nota A ou B para contate.site.

---

### Tarefa 4.3 — Lyra: Remover input de avatar órfão
**Arquivo:** `src/pages/ProfileSettings.jsx:62`

Remover completamente o `<input type="file" />` comentado/inutilizado.

**Critério de aceite:** Nenhum `<input type="file">` no DOM sem handler funcional.

---

### ✅ Checklist Parte 4
- [ ] `src/lib/logger.js` criado
- [ ] Todos os console.* substituídos pelo logger
- [ ] CSP headers configurados na Hostinger
- [ ] securityheaders.com retorna nota A ou B
- [ ] Input de avatar removido
- [ ] Build de produção sem erros
- [ ] Deploy final validado
- [ ] **Commit de documentação:** `git add` no plano de segurança + relatório da Qwen + commit assinado `docs: security audit remediation plan (Qwen 2026-05-15)`

---

## 🗓️ Sequência de Execução Recomendada

```
Parte 1 → Parte 2 → Parte 3 → Parte 4
(Crítico)  (Alto)    (Médio)   (Hardening)
  Rex+Orion  Lyra+Orion  Orion+Rex  Lyra+Rex
  ~2-3h      ~2h         ~1.5h      ~1h
```

---

## 📏 Critérios de Conclusão Geral (DoD)

- [ ] Todas as 12 vulnerabilidades endereçadas
- [ ] Zero leitura direta do localStorage para auth
- [ ] DOMPurify aplicado em todos os pontos de output de dados do usuário
- [ ] Constraint única + função atômica para slugs
- [ ] RLS validada para `profiles` e `links`
- [ ] CSP headers ativos em produção
- [ ] Logger condicional sem leaks em produção
- [ ] Relatório de re-auditoria solicitado à Qwen após deploy final
- [ ] **Git:** commit com plano de segurança (`plano-seguranca.md`) e relatório original (`relatorio seguranca contate-site.md`) no repositório do projeto

---

*Plano gerado por Astra + Rex + Lyra + Orion · Antigravity · 2026-05-16*
