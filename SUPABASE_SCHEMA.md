# Supabase Schema (v2)

Este documento descreve as tabelas que precisam ser criadas no painel do Supabase para o funcionamento do contate.site.

## 1. Tabela: `usuarios`
Gerencia os dados de perfil e configurações globais de cada usuário.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, referencia `auth.users.id` (Relacionamento com Auth) |
| `slug` | `text` | Nome de usuário único para a URL (ex: `/advogadojoao`) |
| `nome_exibicao` | `text` | Nome que aparecerá no topo do perfil |
| `bio` | `text` | Texto descritivo curto |
| `cor_fundo` | `text` | Hex ou identificador do tema/cor escolhida |
| `meta_titulo` | `text` | Para injeção no React Helmet (SEO) |
| `meta_descricao`| `text` | Para injeção no React Helmet (SEO) |
| `created_at` | `timestamp`| Data de criação |

## 2. Tabela: `blocos_links`
Armazena todos os links e widgets criados pelo usuário para o seu grid.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `usuario_id` | `uuid` | Foreign Key -> `usuarios.id` |
| `tipo` | `text` | `link`, `video`, `texto`, `imagem` (Define o componente React) |
| `titulo` | `text` | Título do bloco |
| `url` | `text` | URL de destino ou URL do embed (YouTube/TikTok) |
| `ordem` | `integer`| Número para ordenar os blocos no Bento Grid |
| `ativo` | `boolean`| Se o bloco está visível no perfil público |

## 3. Tabela: `paginas` (Futuro - Landing Pages Estáticas)
Tabela projetada para o recurso avançado de Landing Pages.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `usuario_id` | `uuid` | Foreign Key -> `usuarios.id` |
| `slug_pagina` | `text` | Ex: `/advogadojoao/consultoria` |
| `conteudo_html` | `text` | Estrutura ou JSON de blocos para renderização estática |
| `tipo_template` | `text` | Identificador do layout base |
