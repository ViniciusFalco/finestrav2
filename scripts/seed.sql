-- ========================================
-- SCRIPT DE SEED - FINESTRA V2
-- ========================================

-- Usuário de teste (substitua pelo UUID real do seu usuário)
-- Você pode encontrar o UUID do seu usuário no Supabase Dashboard > Authentication > Users

-- 1. Inserir categorias
INSERT INTO categories (user_id, name, type) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Marketing', 'variable'),
  ('00000000-0000-0000-0000-000000000000', 'Infraestrutura', 'fixed'),
  ('00000000-0000-0000-0000-000000000000', 'Educação', 'variable'),
  ('00000000-0000-0000-0000-000000000000', 'Operacional', 'fixed');

-- 2. Inserir produtos
INSERT INTO products (user_id, name) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Curso de React Avançado'),
  ('00000000-0000-0000-0000-000000000000', 'Ebook Marketing Digital'),
  ('00000000-0000-0000-0000-000000000000', 'Consultoria 1h'),
  ('00000000-0000-0000-0000-000000000000', 'Template WordPress'),
  ('00000000-0000-0000-0000-000000000000', 'Mentoria Mensal');

-- 3. Inserir plataformas
INSERT INTO platforms (user_id, name) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Hotmart'),
  ('00000000-0000-0000-0000-000000000000', 'Monetizze'),
  ('00000000-0000-0000-0000-000000000000', 'Eduzz');

-- 4. Inserir contas
INSERT INTO accounts (user_id, name, type, balance, description) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Conta Principal', 'checking', 5000.00, 'Conta bancária principal'),
  ('00000000-0000-0000-0000-000000000000', 'Cartão de Crédito', 'credit', 0.00, 'Cartão de crédito pessoal'),
  ('00000000-0000-0000-0000-000000000000', 'Poupança', 'savings', 10000.00, 'Conta poupança');

-- 5. Inserir vendas (100 vendas aleatórias no último mês)
-- Nota: Este é um exemplo com algumas vendas. Para 100 vendas, você pode usar um loop ou inserir manualmente

INSERT INTO sales (user_id, date, time, product_id, platform_id, quantity, net_amount, currency) 
SELECT 
  '00000000-0000-0000-0000-000000000000' as user_id,
  (CURRENT_DATE - INTERVAL '1 month' + (random() * INTERVAL '1 month'))::date as date,
  (CURRENT_TIME + (random() * INTERVAL '1 day'))::time as time,
  p.id as product_id,
  pl.id as platform_id,
  (random() * 2 + 1)::int as quantity,
  CASE p.name
    WHEN 'Curso de React Avançado' THEN 299.90
    WHEN 'Ebook Marketing Digital' THEN 49.90
    WHEN 'Consultoria 1h' THEN 150.00
    WHEN 'Template WordPress' THEN 89.90
    WHEN 'Mentoria Mensal' THEN 500.00
  END * (random() * 2 + 1)::int as net_amount,
  'BRL' as currency
FROM products p
CROSS JOIN platforms pl
CROSS JOIN generate_series(1, 20) -- 20 vendas por combinação produto/plataforma = 100 vendas
WHERE p.user_id = '00000000-0000-0000-0000-000000000000'
  AND pl.user_id = '00000000-0000-0000-0000-000000000000';

-- 6. Inserir despesas (40 despesas aleatórias)
INSERT INTO expenses (user_id, date, description, amount, category_id)
SELECT 
  '00000000-0000-0000-0000-000000000000' as user_id,
  (CURRENT_DATE - INTERVAL '1 month' + (random() * INTERVAL '1 month'))::date as date,
  'Despesa ' || generate_series || ' - ' || 
  CASE (generate_series % 4)
    WHEN 0 THEN 'Ads'
    WHEN 1 THEN 'Hosting'
    WHEN 2 THEN 'Cursos'
    WHEN 3 THEN 'Salários'
  END as description,
  (random() * 500 + 50)::numeric(10,2) as amount,
  c.id as category_id
FROM categories c
CROSS JOIN generate_series(1, 40)
WHERE c.user_id = '00000000-0000-0000-0000-000000000000';

-- 7. Inserir reembolsos (5 reembolsos)
INSERT INTO refunds (user_id, sale_id, product_id, platform_id, date, amount)
SELECT 
  '00000000-0000-0000-0000-000000000000' as user_id,
  s.id as sale_id,
  s.product_id,
  s.platform_id,
  (s.date + INTERVAL '1 day')::date as date,
  (s.net_amount * (random() * 0.5 + 0.1))::numeric(10,2) as amount
FROM sales s
WHERE s.user_id = '00000000-0000-0000-0000-000000000000'
LIMIT 5;

-- 8. Inserir metas
INSERT INTO goals (user_id, name, goal_mode, target_value, period_type, start_date, end_date, achieved)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'Meta de Vendas Mensal', 'Monetary', 15000.00, 'Monthly', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE, false),
  ('00000000-0000-0000-0000-000000000000', 'Meta de Clientes', 'Quantity', 50, 'Monthly', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE, false);

-- ========================================
-- INSTRUÇÕES DE USO
-- ========================================

-- 1. Substitua '00000000-0000-0000-0000-000000000000' pelo UUID real do seu usuário
-- 2. Execute este script no SQL Editor do Supabase Dashboard
-- 3. Verifique se os dados foram inseridos corretamente

-- Para encontrar seu UUID:
-- SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com'; 