# Supabase Schema (v2.1 - Atualizado com Segurança)

Este documento descreve as tabelas, restrições e políticas que precisam estar ativas no painel do Supabase para o funcionamento seguro do contate.site.

## 1. Tabela: `usuarios`
Gerencia os dados de perfil e configurações globais de cada usuário.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, referencia `auth.users.id` (Relacionamento com Auth) |
| `slug` | `text` | Nome de usuário único para a URL (ex: `/advogadojoao`). Único (`UNIQUE`) |
| `nome_exibicao` | `text` | Nome que aparecerá no topo do perfil |
| `avatar` | `text` | Nome do arquivo no bucket `avatars` ou URL HTTPS segura (OAuth/Gravatar) |
| `bio` | `text` | Texto descritivo curto |
| `cor_fundo` | `text` | Hex (`#fff`), HSL (`hsl(...)`) ou RGB (`rgb(...)`) validado via constraint `cor_fundo_check` |
| `status` | `integer` | Status da conta: `0` (Aguardando ativação), `1` (Ativo), `2` (Inativo/Suspenso). Constraint `status_check` |
| `is_admin` | `boolean` | Define se o usuário tem acesso ao Console Admin |
| `meta_titulo` | `text` | Para injeção no React Helmet (SEO) |
| `meta_descricao`| `text` | Para injeção no React Helmet (SEO) |
| `created_at` | `timestamp`| Data de criação |

## 2. Bucket de Storage: `avatars`
Armazena as fotos de perfil dos usuários em alta definição (WebP/JPEG/PNG).
- **Público:** Sim (`public = true`)
- **Limite por arquivo:** 5 MB (`5242880` bytes)
- **MIME Types Permitidos:** `image/png`, `image/jpeg`, `image/webp`, `image/gif`
- **Políticas RLS:**
  - Leitura pública irrestrita: `bucket_id = 'avatars'`
  - Upload e exclusão restritos ao dono da pasta: `(storage.foldername(name))[1] = auth.uid()::text`

## 3. Tabela: `slugs_reservados`
Cofre de segurança de retenção temporária (cooldown de 30 dias) de slugs alterados.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `slug` | `text` | Slug mantido em reserva |
| `usuario_id` | `uuid` | Foreign Key -> `usuarios.id` |
| `liberado_em` | `timestamp`| Data/hora em que a reserva expira |

**Políticas RLS (`slugs_reservados`):**
- `SELECT`: `auth.uid() = usuario_id` (`Permitir leitura ao dono do slug reservado`)
- `INSERT`: `auth.uid() = usuario_id` (`slugs_reservados_insert_own`)
- `DELETE`: `auth.uid() = usuario_id` (`slugs_reservados_delete_own`)

## 3. Tabela: `blocos_links`
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

## 4. Função RPC: `public.is_admin()`
Função com privilégios `SECURITY DEFINER` para revalidação do status de admin:
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid() AND is_admin = true
  );
$$;
```

---

## 5. Módulo Contate TV (Vitrine Digital & Menu Boards)

Gerencia painéis digitais, lojas/unidades, playlists e pareamento dinâmico via Smart TV.

### 5.1. Tabela: `tv_unidades`
Lojas físicas ou unidades de franquia.
- `id` (`uuid`, PK)
- `usuario_id` (`uuid`, FK -> `usuarios.id`)
- `nome` (`text`)
- `endereco` (`text`)
- `created_at` (`timestamptz`)

### 5.2. Tabela: `tv_playlists`
Coleções de slides / carrosséis temáticos.
- `id` (`uuid`, PK)
- `usuario_id` (`uuid`, FK -> `usuarios.id`)
- `nome` (`text`)
- `descricao` (`text`)
- `duracao_padrao_segundos` (`integer`, default 8)
- `ativo` (`boolean`, default true)

### 5.3. Tabela: `tv_slides`
Slides individuais de cada playlist (banners prontos ou cartazes de oferta).
- `id` (`uuid`, PK)
- `playlist_id` (`uuid`, FK -> `tv_playlists.id` com `CASCADE`)
- `tipo` (`text`, `'banner'` ou `'produto'`)
- `imagem_url` (`text`)
- `titulo` (`text`)
- `descricao` (`text`)
- `preco` (`text`)
- `badge_promocional` (`text`)
- `duracao_segundos` (`integer`)
- `ordem` (`integer`)
- `ativo` (`boolean`, default true)

### 5.4. Tabela: `telas_tv`
Aparelhos físicos pareados (Smart TVs, totens, monitores).
- `id` (`uuid`, PK)
- `usuario_id` (`uuid`, FK -> `usuarios.id`)
- `unidade_id` (`uuid`, FK -> `tv_unidades.id`)
- `nome` (`text`)
- `setor` (`text`, ex: "Sobremesas", "Bar", "Balcão")
- `device_token` (`text`, UNIQUE)
- `orientacao` (`text`, `'horizontal'` ou `'vertical'`)
- `ticker_texto` (`text`)
- `versao_conteudo` (`integer`)
- `ultima_atividade` (`timestamptz`)

### 5.5. Tabela: `tela_tv_playlists`
Associação N:N entre telas e múltiplas playlists combinadas.
- `tela_id` (`uuid`, FK -> `telas_tv.id`)
- `playlist_id` (`uuid`, FK -> `tv_playlists.id`)
- `ordem` (`integer`)

### 5.6. Tabela: `tv_sessoes_pareamento`
Sessões de pareamento temporárias (TTL de 15 minutos).
- `id` (`uuid`, PK)
- `codigo_pin` (`text`, UNIQUE)
- `device_token` (`text`)
- `status` (`text`, `'aguardando'` | `'conectado'` | `'expirado'`)
- `tela_id` (`uuid`)
- `expires_at` (`timestamptz`)

### 5.7. Funções RPC
- `public.tv_gerar_sessao_pareamento()`: Gera PIN de 6 caracteres e device token para a TV.
- `public.tv_confirmar_pareamento(...)`: Valida o PIN e conecta a TV à conta do lojista.
- `public.tv_obter_slides_tela(p_device_token)`: Entrega a playlist compilada para a Smart TV.
- `public.tv_disparar_atualizacao(p_tela_id, ...)`: Envia sinal de sincronização instantânea em lote.

