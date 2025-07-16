-- Script para debug da view sales_by_hour

-- 1. Verificar se a view existe
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE viewname = 'sales_by_hour';

-- 2. Verificar dados na tabela sales
SELECT 
  COUNT(*) as total_sales,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(date) as min_date,
  MAX(date) as max_date
FROM sales;

-- 3. Verificar dados de vendas por usuário
SELECT 
  user_id,
  COUNT(*) as sales_count,
  MIN(date) as min_date,
  MAX(date) as max_date
FROM sales 
GROUP BY user_id
ORDER BY sales_count DESC;

-- 4. Verificar dados da view sales_by_hour sem filtros
SELECT * FROM sales_by_hour ORDER BY hour_range;

-- 5. Verificar dados da view sales_by_hour com filtro de data específico
SELECT * FROM sales_by_hour 
WHERE date >= '2024-01-01' AND date <= '2024-12-31'
ORDER BY hour_range;

-- 6. Verificar se há dados de vendas com horário
SELECT 
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as count
FROM sales 
WHERE created_at IS NOT NULL
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour;

-- 7. Verificar estrutura da tabela sales
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'sales'
ORDER BY ordinal_position; 