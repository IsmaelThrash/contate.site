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

- [x] **Tema Escuro Obsidian Padrão (`index.css` & `ThemeProvider.jsx`)**:
  - **Requisito**: A aplicação MUST carregar nativamente com a classe `.dark` e com as variáveis `:root` configuradas para os tokens do tema Obsidian (`#1f1f1f`).

- [x] **Carrossel Automático na Demonstração (`HomePage.jsx`)**:
  - **Requisito**: As abas de nicho na hero section MUST alternar automaticamente a cada 3.5s, pausando ao clique do usuário.

- [x] **Logotipo Oficial e Favicon Padrão (`Versão 1A - Elo Duplo a +45°`)**:
  - **Requisito**: O logotipo e ícone oficial da marca MUST ser rigorosamente a **Versão 1A** (Dois elos tubulares paralelos inclinados a `+45°` com centros em `(35, 42)` e `(65, 58)`, conectados por uma barra horizontal central de `X=30` a `X=70` em `Y=50`).
  - **Arquivos Fonte Obrigatórios**: `apps/web/public/favicon.svg`, `favicon.svg`, `brand/logo-1a.svg` e `brand/logo-icon.svg`.
  - **Proibição Estrita**: A IA NUNCA deve alterar, distorcer, trocar ou reinventar a geometria do logo em nenhuma sessão.


---

## 🔒 2. Regras Técnicas e de Segurança

1. **Sincronização de Build para Raiz**:
   - Sempre que `npm run build` for executado, o script MUST copiar o resultado de `apps/web/dist` para a raiz do repositório (`.`), garantindo que o servidor da Hostinger entregue os assets mais recentes.
2. **Preservação de Funções de Autenticação**:
   - Manter tratamento de erros silenciosos do Supabase (OAuth/Magic Link) e unificação automática de contas.
