-- ========================================
-- VIEWS COMPLETAS PARA DASHBOARD - FINESTRA V2
-- Execute este arquivo no Supabase SQL Editor
-- ========================================

-- 1. Adicionar coluna price à tabela products (se não existir)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price numeric(12,2) NOT NULL DEFAULT 0;

-- 2. View para vendas por plataforma
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
  AND s.date BETWEEN current_date - INTERVAL '90 days' AND current_date
GROUP BY s.platform_id, p.name, sum_r.refunds
ORDER BY revenue DESC;

-- 3. View para top produtos
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
  AND s.date BETWEEN current_date - INTERVAL '90 days' AND current_date
GROUP BY s.product_id, p.name
ORDER BY revenue DESC
LIMIT 5;

-- 4. View para vendas por dia da semana
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
    AND date BETWEEN current_date - INTERVAL '90 days' AND current_date
  GROUP BY TO_CHAR(date, 'Dy')
) subquery
ORDER BY day_order;

-- 5. View para vendas por horário
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
  AND date BETWEEN current_date - INTERVAL '90 days' AND current_date
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

-- 6. View para distribuição de despesas
DROP VIEW IF EXISTS expense_distribution;
CREATE VIEW expense_distribution AS
WITH total_expenses AS (
  SELECT COALESCE(SUM(amount), 0) AS total
  FROM expenses
  WHERE user_id = auth.uid()
    AND date BETWEEN current_date - INTERVAL '90 days' AND current_date
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
  AND e.date BETWEEN current_date - INTERVAL '90 days' AND current_date
CROSS JOIN total_expenses te
WHERE c.user_id = auth.uid()
GROUP BY c.id, c.name, c.type, te.total
ORDER BY amount DESC;

-- 7. View para resumo diário
DROP VIEW IF EXISTS daily_summary;
CREATE VIEW daily_summary AS
SELECT 
  dates.date,
  COALESCE(SUM(s.net_amount), 0) AS revenue,
  COALESCE(SUM(e.amount), 0) AS expenses,
  COALESCE(SUM(s.net_amount), 0) - COALESCE(SUM(e.amount), 0) AS profit,
  COALESCE(SUM(r.amount), 0) AS refunds
FROM (
  SELECT DISTINCT date FROM sales WHERE user_id = auth.uid()
  UNION
  SELECT DISTINCT date FROM expenses WHERE user_id = auth.uid()
) dates
LEFT JOIN sales s ON dates.date = s.date AND s.user_id = auth.uid()
LEFT JOIN expenses e ON dates.date = e.date AND e.user_id = auth.uid()
LEFT JOIN refunds r ON dates.date = r.date AND r.user_id = auth.uid()
WHERE dates.date BETWEEN current_date - INTERVAL '90 days' AND current_date
GROUP BY dates.date
ORDER BY dates.date;

-- 8. View para dados acumulados
DROP VIEW IF EXISTS accumulated_summary;
CREATE VIEW accumulated_summary AS
WITH daily_data AS (
  SELECT 
    date,
    COALESCE(SUM(net_amount), 0) AS revenue,
    COALESCE(SUM(amount), 0) AS expenses
  FROM (
    SELECT date, net_amount, 0 AS amount FROM sales WHERE user_id = auth.uid()
    UNION ALL
    SELECT date, 0 AS net_amount, amount FROM expenses WHERE user_id = auth.uid()
  ) combined
  WHERE date BETWEEN current_date - INTERVAL '90 days' AND current_date
  GROUP BY date
)
SELECT 
  date,
  SUM(revenue) OVER (ORDER BY date) AS cum_revenue,
  SUM(expenses) OVER (ORDER BY date) AS cum_expenses,
  SUM(revenue - expenses) OVER (ORDER BY date) AS cum_profit
FROM daily_data
ORDER BY date;

-- ========================================
-- NOTA: Views não precisam de políticas RLS
-- As views já filtram por auth.uid() internamente
-- ========================================

-- ========================================
-- VERIFICAÇÃO DAS VIEWS
-- ========================================

-- Teste se as views estão funcionando
SELECT 'sales_by_platform' as view_name, COUNT(*) as row_count FROM sales_by_platform
UNION ALL
SELECT 'top_products', COUNT(*) FROM top_products
UNION ALL
SELECT 'sales_by_weekday', COUNT(*) FROM sales_by_weekday
UNION ALL
SELECT 'sales_by_hour', COUNT(*) FROM sales_by_hour
UNION ALL
SELECT 'expense_distribution', COUNT(*) FROM expense_distribution
UNION ALL
SELECT 'daily_summary', COUNT(*) FROM daily_summary
UNION ALL
SELECT 'accumulated_summary', COUNT(*) FROM accumulated_summary; 