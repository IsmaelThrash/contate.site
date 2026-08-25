# Contate.site: Link-in-Bio & Digital Business Card Platform

Bem-vindo ao repositório oficial do `contate.site`. Uma alternativa elegante e de alto desempenho a agregadores de links tradicionais. Desenhado para conversão, branding pessoal, e extrema flexibilidade arquitetônica.

## 🌟 O que é o projeto?
O `contate.site` centraliza todos os ecossistemas digitais de um usuário sob uma única e elegante URL (`seudominio.com/:slug`). Com um painel para gestão de links, design focado em Glassmorphism/Bento Grid e otimização em tempo real de metadados.

## 🚀 Arquitetura (Hybrid Deployment)

O sistema foi desenhado para baixo custo inicial e alta escalabilidade:

- **Frontend (Hostinger)**: Desenvolvido em **React + Vite + TailwindCSS**. Todo o ambiente do cliente é gerado de forma estática interativa e será hospedado em um ambiente de baixo custo (Apache/Nginx Shared Hosting via Hostinger's `public_html`).
- **Backend (Supabase)**: Desenvolvido com **Supabase**. Atua como banco de dados em tempo real, backend-as-a-service e painel administrativo (Auth, PostgreSQL, Row Level Security).

```mermaid
graph TD
    User((Visitante)) -->|Acessa :slug| Frontend[React Single Page App]
    Frontend -->|Busca dados| Backend[(Supabase Backend)]
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
- **Autenticação Segura:** Criação de conta via E-mail/Senha com validação de robustez.
- **Reserva de Slugs (Blocklist):** URLs do sistema (`/dashboard`, `/login`, etc.) são travadas para evitar roubo de nomes.
- **SEO Dinâmico:** Cada usuário personaliza como o seu card aparece no Google, Twitter, LinkedIn e WhatsApp, via componentes React Helmet.

## 🛠 Como rodar localmente

### 1. Configure o Backend (Supabase)
1. Crie um projeto no Supabase e configure as variáveis de ambiente em `apps/web/.env` (veja `.env.example` ou siga o padrão).
2. Execute os arquivos SQL de migração disponíveis na raiz do projeto (`supabase_migration_*.sql`) no painel SQL Editor do Supabase para criar as tabelas e políticas de segurança.

### 2. Inicie o Frontend (Vite/React)
1. Em outro terminal, na raiz do repositório, rode: `npm install`
2. Rode o servidor de dev: `npm run dev --prefix apps/web`
   - O web-app estará disponível em: `http://localhost:3000`

## 👥 Especialistas

As diretrizes do projeto foram estabelecidas através da colaboração (via *Google Antigravity*):
- **Estrategista**: Direcionou pesquisa, competitividade, modelos híbridos de hospedagem e priorizações (como SEO Dinâmico vs Analytics Inicial).
- **Designer**: Arquitetura do Bento Grid, Mesh Gradients de Background, Efeitos Visuais.
- **Arquiteto**: Modelagem do banco relacional, scripts SQL de Row Level Security (RLS), configuração da autenticação via Supabase e gestão customizável de sessões.
