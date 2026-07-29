# Supabase Schema (v2.1 - Atualizado com Segurança)

Este documento descreve as tabelas, restrições e políticas que precisam estar ativas no painel do Supabase para o funcionamento seguro do contate.site.

## 1. Tabela: `usuarios`
Gerencia os dados de perfil e configurações globais de cada usuário.

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, referencia `auth.users.id` (Relacionamento com Auth) |
| `slug` | `text` | Nome de usuário único para a URL (ex: `/advogadojoao`). Único (`UNIQUE`) |
| `nome_exibicao` | `text` | Nome que aparecerá no topo do perfil |
| `bio` | `text` | Texto descritivo curto |
| `cor_fundo` | `text` | Hex (`#fff`), HSL (`hsl(...)`) ou RGB (`rgb(...)`) validado via constraint `cor_fundo_check` |
| `status` | `integer` | Status da conta: `0` (Aguardando ativação), `1` (Ativo), `2` (Inativo/Suspenso). Constraint `status_check` |
| `is_admin` | `boolean` | Define se o usuário tem acesso ao Console Admin |
| `meta_titulo` | `text` | Para injeção no React Helmet (SEO) |
| `meta_descricao`| `text` | Para injeção no React Helmet (SEO) |
| `created_at` | `timestamp`| Data de criação |

## 2. Tabela: `slugs_reservados`
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
