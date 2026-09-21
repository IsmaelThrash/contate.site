# 🛡️ Regras Obrigatórias e Registro de Features do Projeto (contate.site)

Este arquivo é lido automaticamente pela IA em todas as sessões de desenvolvimento. As diretrizes e componentes listados abaixo são **obrigatórios e invioláveis** em qualquer refatoração ou atualização de layout.

---

## 📌 1. Componentes Obrigatórios (NUNCA remover em redesigns)

- [x] **Verificador de Versão no Rodapé (`Footer`)**:
  - **Requisito**: O rodapé da aplicação MUST sempre exibir a versão `v2.1` e o hash do commit (`__COMMIT_HASH__`) com o badge escuro e o ponto verde pulsante.
  - **Motivo**: Permite auditagem visual instantânea do deploy em produção.

- [x] **Painel de Administração Sinalizado (`AdminPage.jsx`)**:
  - **Requisito**: A página de Admin MUST possuir a moldura/borda vermelha de 4px fixada no viewport (`border-red-500/80`) e o badge superior `MODO ADMINISTRADOR RESTRITO`.
  - **Motivo**: Alerta de segurança visual para prevenir ações acidentais em contas de terceiros.

- [x] **Tema Escuro Tech Dark Padrão e Nativo (`index.css`, `index.html` & `ThemeProvider.jsx`)**:
  - **Requisito**: A aplicação MUST carregar nativamente com a classe `.dark` no elemento `<html>` e com as variáveis `:root` configuradas para os tokens do tema escuro (`#080A0F` / `#0E121A` / `#1E2638`). O modo escuro é a identidade visual padrão do projeto.
  - **Motivo**: Preservar a estética SaaS moderna com alto contraste para os gradientes de Índigo & Cobalto Tech.

- [x] **Carrossel Automático na Demonstração (`HomePage.jsx`)**:
  - **Requisito**: As abas de nicho na hero section MUST alternar automaticamente a cada 3.5s, pausando ao clique do usuário.

- [x] **Logotipo Oficial e Favicon Padrão (`Versão 1A - Elo Duplo a +45°`)**:
  - **Requisito**: O logotipo e ícone oficial da marca MUST ser rigorosamente a **Versão 1A** (Dois elos tubulares paralelos inclinados a `+45°` com centros em `(35, 42)` e `(65, 58)`, conectados por uma barra horizontal central de `X=30` a `X=70` em `Y=50`).
  - **Arquivos Fonte Obrigatórios**: `apps/web/public/favicon.svg`, `favicon.svg`, `brand/logo-1a.svg` e `brand/logo-icon.svg`.
  - **Proibição Estrita**: A IA NUNCA deve alterar, distorcer, trocar ou reinventar a geometria do logo em nenhuma sessão.

- [x] **Paleta Oficial Homologada (`Cobalto Tech & Padrão Supabase`)**:
  - **Identidade da Marca**: O gradiente oficial da marca MUST ser rigorosamente o gradiente linear de Índigo Elétrico (`#6366F1`) para Cobalto Tech (`#3B82F6`) e Sky (`#38BDF8`), aplicado exclusivamente no logotipo oficial (Versão 1A) e no sufixo `.site`.
  - **Botões e CTAs Primários (Anti-IA Slop)**: Os botões de ação e conversão primários MUST ser em **Cobalto Tech Sólido** (`#2563EB` / `#1D4ED8`) com acabamento tátil de 1px (`shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]`) no padrão de alta autoridade Supabase/Linear. É estritamente proibido o uso de degradês roxos espalhafatosos e feixes metálicos passantes (`shimmer`) de IA nos botões.
  - **Fundo e Superfícies**: Padrão Tech Dark (`#080A0F` / `#0B0D13`) e superfícies (`#0E121A` / `#121620`), com suporte total a alternância para Modo Claro (`#F8FAFC`).
  - **Temas de Página Pública**: Sistema de 9 temas calibrados (`themePresets.js`) com ambient glows dinâmicos e Mini Live Preview em tempo real no Dashboard.

- [x] **Tipografia Oficial de Marca (`Sora`)**:
  - **Requisito**: O wordmark `contate.site` e títulos principais MUST usar a fonte **`Sora`** (Google Fonts) com peso `800` (ExtraBold) para máxima autoridade e harmonia com os elos tubulares do ícone.

- [x] **Copy e Headline Oficial Homologada (Opção 1 - Imutável e Obrigatória)**:
  - **Requisito**: O texto da Hero section MUST ser rigorosamente a Opção 1 homologada:
    - **Badge**: `✦ Centralize tudo o que você faz em um só lugar`
    - **H1 Linha 1**: `Seus clientes encontram tudo`
    - **H1 Linha 2 (Gradiente de Destaque)**: `em um único link na bio.`
    - **Subtítulo Oficial**: `Centralize suas redes sociais, catálogo de serviços, vídeos e formas de contato em uma página moderna criada em 2 minutos direto do celular. 100% grátis e sem complicação.`
  - **Motivo**: Preservar a identidade universal e ampla da plataforma sem limitar a marca a uma única ferramenta (como WhatsApp), garantindo autoridade máxima e ranqueamento orgânico para a palavra-chave de maior volume no Brasil ("link na bio").



---

## 🔒 2. Regras Técnicas e de Segurança

1. **Sincronização de Build para Raiz**:
   - Sempre que `npm run build` for executado, o script MUST copiar o resultado de `apps/web/dist` para a raiz do repositório (`.`), garantindo que o servidor da Hostinger entregue os assets mais recentes.
2. **Preservação de Funções de Autenticação**:
   - Manter tratamento de erros silenciosos do Supabase (OAuth/Magic Link) e unificação automática de contas.
