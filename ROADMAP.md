# 🗺️ Roadmap: Contate.site

Este documento mapeia o desenvolvimento, as conquistas e os próximos passos estratégicos do projeto `contate.site`.

## ✅ Fases Concluídas (Fundação e UI)
- [x] **Setup de Infraestrutura:** Criação do ambiente monorepo (Frontend Vite/React + Backend PocketBase).
- [x] **Roteamento Dinâmico:** Implementação do sistema de perfis públicos (`/slug`).
- [x] **Segurança de URLs (Blocklist):** Proibição de slugs reservados (ex: `dashboard`, `admin`, `api`) via validação no Frontend e Regex básico no Backend.
- [x] **Identidade Visual Premium:** Adoção do estilo **Bento Grid** e **Glassmorphism** com gradientes de fundo malhados (Mesh Gradients) e animações responsivas.
- [x] **SEO Dinâmico e Perfiling:** Campos customizáveis de Nome, Bio, Meta Title e Meta Description conectados ao React Helmet para ricas prévias de compartilhamento web/social.
- [x] **Limpeza e Versionamento:** Extração do conhecimento de projeto (KIs) e consolidação do repositório `.git` (primeira release base).

---

## ⏳ Fase Atual (Autenticação e Prova de Titularidade)
**Foco:** Garantir que apenas os proprietários reais de um e-mail possam clamar um slug (`/nome`).

- [ ] **Implementar Login Social (Google Auth):**
  - Criar credenciais OAuth2 no **Google Cloud Console**.
  - Configurar e ativar o provedor Google no **Painel Admin do PocketBase**.
  - Refatorar a tela de Cadastro/Login (`LoginPage`, `SignupPage`) para incluir o fluxo "Continuar com o Google".
  - *Opcional:* Implementar sistema de bloqueio e remoção de contas orfãs criadas manualmente (ou forçar validação de e-mail como fallback).

---

## 🔜 Próximas Fases (Enriquecimento e Lançamento)

### 📈 Analytics e Conversão
- [ ] Monitoramento de tráfego básico (Views totais na página pública).
- [ ] Interceptação de cliques em botões de redes sociais e sites.
- [ ] Dashboard gerencial de dados para o usuário final.

### 🎨 Customização e Temas (Pro)
- [ ] Upload de Imagem de Avatar (Storage).
- [ ] Adição customizada de plano de fundo (Imagens/Gifs).
- [ ] Presets de cores temáticas prontas (Ex: Cyberpunk, Monocromático, Moderno).

### 🚀 Deploy de Produção (Híbrido)
- [ ] Pipeline final de build otimizado para produção.
- [ ] Envio das builds estáticas (`/dist`) para a infraestrutura **Hostinger** (`public_html`).
- [ ] Migração do backend local para um servidor **Pockethost** de produção e vinculação pelo arquivo `.env`.

### 💰 Sustentabilidade e Monetização
- [ ] Controle de limites: Limitar números de blocos/links por usuário "Free".
- [ ] Integração com Gateway de pagamento (Mercado Pago, Stripe) para assinatura "Pro" e desbloqueios visuais.
