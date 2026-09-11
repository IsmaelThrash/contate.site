# Contate.site: Link-in-Bio & Digital Business Card Platform

Bem-vindo ao repositório oficial do `contate.site`. Uma alternativa elegante e de alto desempenho a agregadores de links tradicionais. Desenhado para conversão, branding pessoal, e extrema flexibilidade arquitetônica.

## 🌟 O que é o projeto?
O `contate.site` centraliza todos os ecossistemas digitais de um usuário sob uma única e elegante URL (`seudominio.com/:slug`). Com um painel para gestão de links, design focado em Glassmorphism/Bento Grid e otimização em tempo real de metadados.

## 🚀 Arquitetura (Self-Hosted Hybrid Deployment)

O sistema foi desenhado visando **soberania de dados, baixo custo e alta segurança**:

- **Frontend (Hostinger)**: Desenvolvido em **React + Vite + TailwindCSS**. Todo o ambiente do cliente é gerado de forma estática interativa. O deploy é feito automaticamente para a Hostinger (`public_html`) sempre que o script `npm run build` faz o output para a raiz e recebe push via GitHub.
- **Backend (Supabase Self-Hosted)**: O stack completo do **Supabase** (Postgres, GoTrue, PostgREST, Realtime) roda em um servidor local via **Docker Compose**. A comunicação com o mundo externo (Frontend) ocorre via **Cloudflare Edge Tunnels** (`api.contate.site`), blindando o servidor local e contornando CGNAT sem custos adicionais de nuvem.

```mermaid
graph TD
    User((Visitante)) -->|Acessa :slug| Frontend[React Single Page App na Hostinger]
    Frontend -->|Busca dados| CF[Cloudflare Tunnel api.contate.site]
    CF -->|Túnel Seguro| Backend[(Supabase Self-Hosted Local)]
    Backend -->|Valida Auth / RLS| DB[PostgreSQL Data]
    DB -. Retorna -> Frontend
```

## 🎨 Identidade Visual Oficial
- **Logotipo (Versão 1A)**: O Elo Duplo a `+45°`, representando conectividade, rapidez e unificação de canais de contato.
- **Paleta Cromática (Índigo & Cobalto Tech)**:
  - Gradiente de Marca: `#6366F1` (Índigo Elétrico) ➔ `#3B82F6` (Cobalto Tech) ➔ `#38BDF8` (Sky)
  - Fundo & Superfícies: Obsidian Dark (`#080A0F` / `#0E121A`)
- **Tipografia**: **`Sora`** (Google Fonts) para Wordmark e Títulos de Alta Conversão, e **`Inter`** para corpo e UI.

## ✨ Funcionalidades Core
- **Bento Grid & Glassmorphism Design:** Experiência visual imersiva e responsiva.
- **Autenticação Segura (Supabase GoTrue):** Criação de conta via E-mail/Senha, Google OAuth e SMTP próprio para Magic Links.
- **Reserva de Slugs e Prevenção IDOR:** Slugs do sistema são travados, e funções PL/pgSQL RPC garantem cooldown na troca e impedem concorrência.
- **SEO Dinâmico:** Cada usuário personaliza como o seu card aparece no Google, Twitter, LinkedIn e WhatsApp, via componentes React Helmet.

## 🛠 Como rodar localmente (Desenvolvimento)

### 1. Inicie o Backend Local (Supabase Self-Hosted)
1. Na raiz do projeto, instancie o backend com o Docker: `docker compose up -d`
2. Configure as variáveis em `apps/web/.env` apontando para os serviços locais ou seu túnel Cloudflare configurado.

### 2. Inicie o Frontend (Vite/React)
1. Instale as dependências: `npm install`
2. Rode o servidor de dev: `npm run dev`
   - O web-app estará disponível em: `http://localhost:3000`
