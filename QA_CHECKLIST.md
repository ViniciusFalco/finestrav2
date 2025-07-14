# 📋 Checklist de QA - Finestra V2

## 🚀 Sprint 7: QA Final + Seed Dataset

### ✅ **Dados de Seed**
- [ ] Executar script SQL no Supabase Dashboard
- [ ] Verificar inserção de 5 produtos
- [ ] Verificar inserção de 3 plataformas  
- [ ] Verificar inserção de 4 categorias
- [ ] Verificar inserção de 100 vendas
- [ ] Verificar inserção de 40 despesas
- [ ] Verificar inserção de 5 reembolsos
- [ ] Verificar inserção de 2 metas

---

## 🔐 **Testes de Autenticação**

### Login e Navegação
- [ ] Login com credenciais válidas
- [ ] Redirecionamento para dashboard após login
- [ ] Logout funcionando corretamente
- [ ] Proteção de rotas (usuário não logado)
- [ ] Navegação entre páginas funcionando

### Segurança RLS
- [ ] Usuário A não consegue acessar dados do Usuário B
- [ ] Políticas RLS bloqueando acesso não autorizado
- [ ] Dados isolados por usuário

---

## 📊 **Testes do Dashboard**

### Gráficos e Visualizações
- [ ] DailyChart carregando dados corretamente
- [ ] AccumulatedChart mostrando valores acumulados
- [ ] BalanceChart (Receita vs Despesa) com barras visíveis
- [ ] ExpenseDistribution com distribuição de despesas
- [ ] TopProductsChart mostrando produtos mais vendidos
- [ ] SalesByPlatformChart com vendas por plataforma
- [ ] SalesByWeekdayChart com vendas por dia da semana
- [ ] SalesByHourChart com vendas por hora

### Filtros e Interatividade
- [ ] Filtro de período funcionando
- [ ] Filtro de produtos funcionando
- [ ] Atualização dos gráficos ao mudar filtros
- [ ] Cards de resumo atualizando com filtros

### Cards de Resumo
- [ ] Receita total calculada corretamente
- [ ] Despesas totais calculadas corretamente
- [ ] Lucro calculado corretamente
- [ ] Reembolsos mostrados corretamente

---

## 💰 **Testes CRUD - Despesas**

### Criar Despesa
- [ ] Formulário de criação carregando
- [ ] Validação de campos obrigatórios
- [ ] Seleção de categoria funcionando
- [ ] Inserção no banco de dados
- [ ] Atualização dos gráficos após criação

### Editar Despesa
- [ ] Botão de editar funcionando
- [ ] Formulário preenchido com dados atuais
- [ ] Atualização no banco de dados
- [ ] Atualização dos gráficos após edição

### Excluir Despesa
- [ ] Confirmação de exclusão
- [ ] Remoção do banco de dados
- [ ] Atualização dos gráficos após exclusão

### Tabela de Despesas
- [ ] Listagem de todas as despesas
- [ ] Paginação funcionando
- [ ] Ordenação por colunas
- [ ] Filtros de busca

---

## 🛒 **Testes CRUD - Vendas**

### Criar Venda
- [ ] Formulário de criação carregando
- [ ] Validação de campos obrigatórios
- [ ] Seleção de produto funcionando
- [ ] Seleção de plataforma funcionando
- [ ] Inserção no banco de dados
- [ ] Atualização dos gráficos após criação

### Editar Venda
- [ ] Botão de editar funcionando
- [ ] Formulário preenchido com dados atuais
- [ ] Atualização no banco de dados
- [ ] Atualização dos gráficos após edição

### Excluir Venda
- [ ] Confirmação de exclusão
- [ ] Remoção do banco de dados
- [ ] Atualização dos gráficos após exclusão

### Tabela de Vendas
- [ ] Listagem de todas as vendas
- [ ] Paginação funcionando
- [ ] Ordenação por colunas
- [ ] Filtros de busca

---

## 🎯 **Testes - Metas**

### Criar Meta
- [ ] Formulário de criação carregando
- [ ] Seleção de tipo de meta (Monetária/Quantidade)
- [ ] Seleção de período (Mensal/Trimestral)
- [ ] Validação de datas
- [ ] Inserção no banco de dados

### Editar Meta
- [ ] Formulário de edição funcionando
- [ ] Atualização no banco de dados

### Excluir Meta
- [ ] Confirmação de exclusão
- [ ] Remoção do banco de dados

---

## 📱 **Testes de Responsividade**

### Mobile (320px - 768px)
- [ ] Layout adaptado para mobile
- [ ] Menu de navegação responsivo
- [ ] Gráficos redimensionados corretamente
- [ ] Tabelas com scroll horizontal
- [ ] Formulários adaptados
- [ ] Botões e elementos clicáveis

### Tablet (768px - 1024px)
- [ ] Layout intermediário funcionando
- [ ] Gráficos bem dimensionados
- [ ] Navegação otimizada

### Desktop (1024px+)
- [ ] Layout completo funcionando
- [ ] Gráficos em tamanho ideal
- [ ] Todas as funcionalidades acessíveis

---

## 🔌 **Testes de Webhooks**

### Webhook de Vendas
- [ ] Endpoint `/api/webhook/sale` respondendo
- [ ] Validação de `x-webhook-secret` funcionando
- [ ] Rejeição de secret incorreto
- [ ] Inserção de venda no banco
- [ ] Resposta de sucesso

### Webhook de Reembolsos
- [ ] Endpoint `/api/webhook/refund` respondendo
- [ ] Validação de `x-webhook-secret` funcionando
- [ ] Rejeição de secret incorreto
- [ ] Inserção de reembolso no banco
- [ ] Atualização da venda relacionada

### Testes de Segurança
- [ ] Webhook rejeita requisições sem secret
- [ ] Webhook rejeita secret incorreto
- [ ] Validação de campos obrigatórios
- [ ] Tratamento de erros adequado

---

## 🐛 **Bugs Encontrados**

### Issues para Criar no GitHub
- [ ] Bug 1: [Descrição do bug]
- [ ] Bug 2: [Descrição do bug]
- [ ] Bug 3: [Descrição do bug]

### Melhorias Identificadas
- [ ] Melhoria 1: [Descrição da melhoria]
- [ ] Melhoria 2: [Descrição da melhoria]

---

## 📝 **Notas de Teste**

### Ambiente de Teste
- **URL**: http://localhost:3000
- **Usuário**: [email do usuário de teste]
- **Data**: [data dos testes]

### Observações
- [ ] Observação 1
- [ ] Observação 2
- [ ] Observação 3

---

## ✅ **Status Final**

- [ ] **Todos os testes passaram**
- [ ] **Bugs reportados no GitHub**
- [ ] **Melhorias documentadas**
- [ ] **Sprint 7 concluído com sucesso**

---

## 🚀 **Próximos Passos**

1. Executar script SQL no Supabase
2. Fazer login e testar todas as funcionalidades
3. Documentar bugs encontrados
4. Criar issues no GitHub
5. Commit final: `chore: add seed script & QA notes` 