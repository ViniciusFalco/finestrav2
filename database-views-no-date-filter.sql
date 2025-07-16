-- ========================================
-- VIEWS SEM FILTRO DE DATA - PARA TESTE
-- Execute este arquivo no Supabase SQL Editor
-- ========================================

-- 1. View para vendas por plataforma (sem filtro de data)
DROP VIEW IF EXISTS sales_by_platform;
CREATE VIEW sales_by_platform AS
SELECT
  s.platform_id,
  p.name                               AS platform,
  COUNT(*)                             AS quantity,
  SUM(s.net_amount)                    AS revenue,
  COALESCE(sum_r.refunds, 0)           AS refunds,
  MIN(s.date)                          AS date
FROM sales s
JOIN platforms p ON p.id = s.platform_id
LEFT JOIN (
  SELECT platform_id, SUM(amount) refunds
  FROM refunds
  GROUP BY platform_id
) sum_r ON sum_r.platform_id = s.platform_id
WHERE s.user_id = auth.uid()
GROUP BY s.platform_id, p.name, sum_r.refunds
ORDER BY revenue DESC;

-- 2. View para top produtos (sem filtro de data)
DROP VIEW IF EXISTS top_products;
CREATE VIEW top_products AS
SELECT
  s.product_id,
  p.name          AS product,
  SUM(s.net_amount) AS revenue,
  MIN(s.date)     AS date
FROM sales s
JOIN products p ON p.id = s.product_id
WHERE s.user_id = auth.uid()
GROUP BY s.product_id, p.name
ORDER BY revenue DESC
LIMIT 5;

-- 3. View para vendas por dia da semana (sem filtro de data)
DROP VIEW IF EXISTS sales_by_weekday;
CREATE VIEW sales_by_weekday AS
SELECT
  weekday,
  quantity,
  revenue,
  date
FROM (
  SELECT
    TO_CHAR(date, 'Dy')  AS weekday,
    COUNT(*)             AS quantity,
    SUM(net_amount)      AS revenue,
    MIN(date)            AS date,
    CASE TO_CHAR(date, 'Dy')
      WHEN 'Seg' THEN 1
      WHEN 'Ter' THEN 2
      WHEN 'Qua' THEN 3
      WHEN 'Qui' THEN 4
      WHEN 'Sex' THEN 5
      WHEN 'Sáb' THEN 6
      WHEN 'Dom' THEN 7
    END AS day_order
  FROM sales
  WHERE user_id = auth.uid()
  GROUP BY TO_CHAR(date, 'Dy')
) subquery
ORDER BY day_order;

-- 4. View para vendas por horário (sem filtro de data)
DROP VIEW IF EXISTS sales_by_hour;
CREATE VIEW sales_by_hour AS
SELECT
  CASE 
    WHEN EXTRACT(HOUR FROM time) BETWEEN 0 AND 3 THEN '00:00-03:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 4 AND 7 THEN '04:00-07:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 8 AND 11 THEN '08:00-11:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 12 AND 15 THEN '12:00-15:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 16 AND 19 THEN '16:00-19:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 20 AND 23 THEN '20:00-23:59'
  END AS hour_range,
  COUNT(*) AS quantity,
  MIN(date) AS date
FROM sales
WHERE user_id = auth.uid()
GROUP BY 
  CASE 
    WHEN EXTRACT(HOUR FROM time) BETWEEN 0 AND 3 THEN '00:00-03:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 4 AND 7 THEN '04:00-07:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 8 AND 11 THEN '08:00-11:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 12 AND 15 THEN '12:00-15:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 16 AND 19 THEN '16:00-19:59'
    WHEN EXTRACT(HOUR FROM time) BETWEEN 20 AND 23 THEN '20:00-23:59'
  END
ORDER BY hour_range;

-- 5. View para distribuição de despesas (sem filtro de data)
DROP VIEW IF EXISTS expense_distribution;
CREATE VIEW expense_distribution AS
WITH total_expenses AS (
  SELECT COALESCE(SUM(amount), 0) AS total
  FROM expenses
  WHERE user_id = auth.uid()
)
SELECT
  c.name AS category,
  COALESCE(SUM(e.amount), 0) AS amount,
  c.type,
  CASE 
    WHEN te.total > 0 THEN (COALESCE(SUM(e.amount), 0) / te.total) * 100
    ELSE 0
  END AS percentage,
  MIN(e.date) AS date
FROM categories c
LEFT JOIN expenses e ON c.id = e.category_id 
  AND e.user_id = auth.uid()
CROSS JOIN total_expenses te
WHERE c.user_id = auth.uid()
GROUP BY c.id, c.name, c.type, te.total
ORDER BY amount DESC;

-- Teste se as views agora retornam dados
SELECT 'sales_by_platform' as view_name, COUNT(*) as row_count FROM sales_by_platform
UNION ALL
SELECT 'top_products', COUNT(*) FROM top_products
UNION ALL
SELECT 'sales_by_weekday', COUNT(*) FROM sales_by_weekday
UNION ALL
SELECT 'sales_by_hour', COUNT(*) FROM sales_by_hour
UNION ALL
SELECT 'expense_distribution', COUNT(*) FROM expense_distribution; 