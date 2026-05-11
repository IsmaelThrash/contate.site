# Instruções de Teste - Contate.site (V2 Supabase)

Este documento foi criado para guiar o processo de testes manuais e garantir que a migração da Fase 2 (PocketBase para Supabase) e a refatoração da Fase 3 foram concluídas com sucesso e não introduziram regressões.

## 1. Testes de Autenticação (Magic Link)

**Objetivo:** Garantir que o sistema de login utilizando o Magic Link do Supabase está funcionando e gerando sessões corretamente.

- [ ] **Acesso à tela de Login:** Navegue até a página `/login`.
- [ ] **Envio do Magic Link:** Insira um e-mail válido (preferencialmente um que você tenha acesso rápido) e submeta. Verifique se aparece o aviso de "Verifique seu email".
- [ ] **Recebimento e Clique:** Acesse o seu e-mail, clique no link de login mágico fornecido.
- [ ] **Redirecionamento:** Verifique se, após o clique, você é corretamente direcionado para o `/dashboard`.
- [ ] **Sessão Persistente:** Recarregue a página (`F5`) no `/dashboard` e certifique-se de que a sessão continua ativa e não redireciona você de volta para a tela de login.
- [ ] **Logout:** Clique em "Sair" e confirme se você é direcionado para a página inicial ou tela de login, perdendo o acesso ao `/dashboard`.

## 2. Testes do Painel (Dashboard) e Banco de Dados

**Objetivo:** Validar o CRUD (Criar, Ler, Atualizar, Deletar) de Links e o funcionamento do contexto Auth com Supabase.

- [ ] **Carregamento Inicial:** Ao acessar o Dashboard, os links já cadastrados devem carregar corretamente. A tela de *loading* deve ser exibida e, depois, substituída pela lista ou estado vazio ("Nenhum link ainda").
- [ ] **Criação de Link:**
  - Clique em "Adicionar Link".
  - Preencha o título e a URL.
  - Salve e observe se o link aparece no final da lista automaticamente.
- [ ] **Edição de Link:**
  - Clique no ícone de lápis de um link.
  - Altere o título e/ou URL e salve.
  - Verifique se a mudança se reflete na lista de links instantaneamente.
- [ ] **Exclusão de Link:**
  - Clique na lixeira e confirme a exclusão.
  - O link deve desaparecer da lista.

## 3. Testes do Drag-and-Drop (Performance da Refatoração)

**Objetivo:** Validar se a nossa refatoração do `SortableLink` (`React.memo` + `useCallback`) removeu as re-renderizações desnecessárias e se o Supabase está salvando a ordem final.

- [ ] **Movimentação (Visual):** Arraste um link para o topo ou para o meio da lista. O movimento deve ser suave. Note a ausência de travamentos.
- [ ] **Salvamento de Ordem:** Solte o link em uma nova posição. Observe se aparece um pequeno spinner ou indicador de "Salvando..." (graças à variável `savingOrder`).
- [ ] **Persistência da Ordem:** Recarregue a página (`F5`) no `/dashboard`. Os links devem carregar exatamente na ordem em que foram deixados após o reordenamento.

## 4. Testes de Customização e Visuais

**Objetivo:** Garantir que o perfil reflete o esquema de cores escolhido via Design Tokens base.

- [ ] **Troca de Cores no Dashboard:** No final da página do Dashboard, selecione uma "Cor de Fundo Principal" diferente. O botão ou os fundos que utilizam a variável `primary` devem alterar imediatamente no sistema localmente e salvar no Supabase.
- [ ] **Acesso ao Perfil Público:** Clique em "Ver minha página" (que deve apontar para `/seu-slug`).
- [ ] **Visualização Pública:** No perfil público, os links exibidos devem bater com a lista do seu painel e estar na exata mesma ordem. As cores definidas no painel devem estar sendo refletidas.

---
**Dica de Depuração:** Em caso de erro na obtenção de dados ou falhas ao salvar, verifique o Console do navegador (`F12` -> `Console`) e a aba de Network para analisar os pacotes e respostas de erro que retornam da API do Supabase.
