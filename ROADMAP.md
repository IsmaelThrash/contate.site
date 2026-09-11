# 🗺️ Roadmap: Contate.site

Este documento mapeia o desenvolvimento, as conquistas e os próximos passos estratégicos do projeto `contate.site`.

## ✅ Fases Concluídas (Fundação e UI)
- [x] **Setup de Infraestrutura:** Criação do ambiente monorepo (Frontend Vite/React + Backend Supabase).
- [x] **Roteamento Dinâmico:** Implementação do sistema de perfis públicos (`/slug`).
- [x] **Segurança de URLs (Blocklist):** Proibição de slugs reservados (ex: `dashboard`, `admin`, `api`) via validação no Frontend e Regex básico no Backend.
- [x] **Identidade Visual Premium:** Adoção do estilo **Bento Grid** e **Glassmorphism** com gradientes de fundo malhados (Mesh Gradients) e animações responsivas.
- [x] **SEO Dinâmico e Perfiling:** Campos customizáveis de Nome, Bio, Meta Title e Meta Description conectados ao React Helmet para ricas prévias de compartilhamento web/social.

## ✅ Fase de Autenticação e Segurança
- [x] **Login e Controle de Acesso:** Implementação de JWT via Supabase Auth.
- [x] **Login Social:** Integração do Google OAuth2.
- [x] **Segurança do Banco de Dados (RLS):** Criação de políticas RLS para garantir que usuários só alterem seus próprios perfis.
- [x] **Proteção contra IDOR/Concorrência:** Sistema anti-sequestro de slugs usando funções PL/pgSQL RPC (`claim_slug`) e cooldown de 30 dias para reciclagem.

## ✅ Fase de Deploy e Infraestrutura Soberana (Self-Hosted)
- [x] **Migração de Cloud para VPS:** Abandono do modelo DBaaS (Supabase Cloud) para instanciar o Supabase Stack via Docker (`winbot`).
- [x] **Networking Local (Tunnels):** Configuração de Cloudflare Edge Tunnels (`cloudflared`) servindo a API publicamente via `api.contate.site`.
- [x] **Serviço de Email Nativo:** SMTP da Hostinger integrado ao GoTrue para Magic Links e recuperações de conta.
- [x] **Frontend na Hostinger:** Script de build automático para a Hostinger, permitindo push-to-deploy via GitHub.

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

### 💰 Sustentabilidade e Monetização
- [ ] Controle de limites: Limitar números de blocos/links por usuário "Free".
- [ ] Integração com Gateway de pagamento (Mercado Pago, Stripe) para assinatura "Pro" e desbloqueios visuais.
