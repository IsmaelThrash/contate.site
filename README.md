# Contate.site: Link-in-Bio & Digital Business Card Platform

Bem-vindo ao repositório oficial do `contate.site`. Uma alternativa elegante e de alto desempenho a agregadores de links tradicionais. Desenhado para conversão, branding pessoal, e extrema flexibilidade arquitetônica.

## 🌟 O que é o projeto?
O `contate.site` centraliza todos os ecossistemas digitais de um usuário sob uma única e elegante URL (`seudominio.com/:slug`). Com um painel para gestão de links, design focado em Glassmorphism/Bento Grid e otimização em tempo real de metadados.

## 🚀 Arquitetura (Hybrid Deployment)

O sistema foi desenhado para baixo custo inicial e alta escalabilidade:

- **Frontend (Hostinger)**: Desenvolvido em **React + Vite + TailwindCSS**. Todo o ambiente do cliente é gerado de forma estática interativa e será hospedado em um ambiente de baixo custo (Apache/Nginx Shared Hosting via Hostinger's `public_html`).
- **Backend (Pockethost/PocketBase)**: Desenvolvido com **PocketBase**. Atua como banco de dados em tempo real, backend-as-a-service e painel administrativo (Auth, Collections, Data Rules). Deploy efetuado no Pockethost.io.

```mermaid
graph TD
    User((Visitante)) -->|Acessa :slug| Frontend[React Single Page App]
    Frontend -->|Busca dados REST API| Backend[(PocketBase Backend)]
    Backend -->|Valida Auth / Regras| DB[SQLite Data]
    DB -. Retorna -> Frontend
```

## ✨ Funcionalidades Core
- **Bento Grid & Glassmorphism Design:** Experiência visual imersiva e responsiva.
- **Autenticação Segura:** Criação de conta via E-mail/Senha com validação de robustez.
- **Reserva de Slugs (Blocklist):** URLs do sistema (`/dashboard`, `/login`, etc.) são travadas para evitar roubo de nomes.
- **SEO Dinâmico:** Cada usuário personaliza como o seu card aparece no Google, Twitter, LinkedIn e WhatsApp, via componentes React Helmet.

## 🛠 Como rodar localmente

### 1. Inicie o Backend (PocketBase)
1. Navegue até a pasta: `cd apps/pocketbase`
2. Aplique as migrações (se for a primeira vez): `./pocketbase migrate up`
3. Rode o servidor Web API (o terminal ficará preso no log de acesso): `./pocketbase serve`
   - Painel Admin: `http://localhost:8090/_/`

### 2. Inicie o Frontend (Vite/React)
1. Em outro terminal, na raiz do repositório, rode: `npm install`
2. Rode o servidor de dev: `npm run dev --prefix apps/web`
   - O web-app estará disponível em: `http://localhost:3000`

## 👥 Especialistas

As diretrizes do projeto foram estabelecidas através da colaboração (via *Google Antigravity*):
- **Estrategista**: Direcionou pesquisa, competitividade, modelos híbridos de hospedagem e priorizações (como SEO Dinâmico vs Analytics Inicial).
- **Designer**: Arquitetura do Bento Grid, Mesh Gradients de Background, Efeitos Visuais.
- **Arquiteto**: Modelagem de migrações (`pb_migrations`), lógica JWT/Session via PocketBase, `AuthContext.jsx` customizável.
