-- ========================================
-- VIEWS PARA DASHBOARD - FINESTRA V2
-- ========================================

-- View para vendas por plataforma (formato esperado pelo SalesByPlatformChart)
CREATE OR REPLACE VIEW sales_by_platform_view AS
SELECT 
  p.name as platform,
  COUNT(s.id) as quantity,
  COALESCE(SUM(s.net_amount), 0) as revenue,
  COALESCE(SUM(r.amount), 0) as refunds
FROM platforms p
LEFT JOIN sales s ON p.id = s.platform_id
LEFT JOIN refunds r ON p.id = r.platform_id
WHERE p.user_id = auth.uid()
GROUP BY p.id, p.name
ORDER BY revenue DESC;

-- View para vendas por dia da semana (formato esperado pelo SalesByWeekdayChart)
CREATE OR REPLACE VIEW sales_by_weekday_view AS
SELECT 
  CASE 
    WHEN EXTRACT(DOW FROM s.date) = 0 THEN 'Dom'
    WHEN EXTRACT(DOW FROM s.date) = 1 THEN 'Seg'
    WHEN EXTRACT(DOW FROM s.date) = 2 THEN 'Ter'
    WHEN EXTRACT(DOW FROM s.date) = 3 THEN 'Qua'
    WHEN EXTRACT(DOW FROM s.date) = 4 THEN 'Qui'
    WHEN EXTRACT(DOW FROM s.date) = 5 THEN 'Sex'
    WHEN EXTRACT(DOW FROM s.date) = 6 THEN 'Sáb'
  END as weekday,
  COUNT(s.id) as quantity
FROM sales s
WHERE s.user_id = auth.uid()
GROUP BY EXTRACT(DOW FROM s.date)
ORDER BY EXTRACT(DOW FROM s.date);

-- View para vendas por horário (formato esperado pelo SalesByHourChart)
CREATE OR REPLACE VIEW sales_by_hour_view AS
SELECT 
  CASE 
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 0 AND 3 THEN '00:00-03:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 4 AND 7 THEN '04:00-07:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 8 AND 11 THEN '08:00-11:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 12 AND 15 THEN '12:00-15:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 16 AND 19 THEN '16:00-19:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 20 AND 23 THEN '20:00-23:59'
  END as hour_range,
  COUNT(s.id) as quantity
FROM sales s
WHERE s.user_id = auth.uid()
GROUP BY 
  CASE 
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 0 AND 3 THEN '00:00-03:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 4 AND 7 THEN '04:00-07:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 8 AND 11 THEN '08:00-11:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 12 AND 15 THEN '12:00-15:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 16 AND 19 THEN '16:00-19:59'
    WHEN EXTRACT(HOUR FROM s.time) BETWEEN 20 AND 23 THEN '20:00-23:59'
  END
ORDER BY hour_range;

-- View para top produtos (formato esperado pelo TopProductsChart)
CREATE OR REPLACE VIEW top_products_view AS
SELECT 
  p.name as product,
  COALESCE(SUM(s.net_amount), 0) as revenue
FROM products p
LEFT JOIN sales s ON p.id = s.product_id
WHERE p.user_id = auth.uid()
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 5;

-- View para distribuição de despesas (formato esperado pelo ExpenseDistribution)
CREATE OR REPLACE VIEW expense_distribution_view AS
WITH total_expenses AS (
  SELECT COALESCE(SUM(e.amount), 0) as total
  FROM expenses e
  WHERE e.user_id = auth.uid()
)
SELECT 
  c.name as category,
  COALESCE(SUM(e.amount), 0) as amount,
  c.type,
  CASE 
    WHEN te.total > 0 THEN (COALESCE(SUM(e.amount), 0) / te.total) * 100
    ELSE 0
  END as percentage
FROM categories c
LEFT JOIN expenses e ON c.id = e.category_id
CROSS JOIN total_expenses te
WHERE c.user_id = auth.uid()
GROUP BY c.id, c.name, c.type, te.total
ORDER BY amount DESC;

-- View para resumo diário (formato esperado pelo DailyChart)
CREATE OR REPLACE VIEW daily_summary_view AS
SELECT 
  s.date,
  COALESCE(SUM(s.net_amount), 0) as revenue,
  COALESCE(SUM(e.amount), 0) as expenses,
  COALESCE(SUM(s.net_amount), 0) - COALESCE(SUM(e.amount), 0) as profit,
  COALESCE(SUM(r.amount), 0) as refunds
FROM (
  SELECT DISTINCT date FROM sales WHERE user_id = auth.uid()
  UNION
  SELECT DISTINCT date FROM expenses WHERE user_id = auth.uid()
) dates
LEFT JOIN sales s ON dates.date = s.date AND s.user_id = auth.uid()
LEFT JOIN expenses e ON dates.date = e.date AND e.user_id = auth.uid()
LEFT JOIN refunds r ON dates.date = r.date AND r.user_id = auth.uid()
GROUP BY dates.date
ORDER BY dates.date;

-- View para dados acumulados (formato esperado pelo AccumulatedChart)
CREATE OR REPLACE VIEW accumulated_summary_view AS
WITH daily_data AS (
  SELECT 
    date,
    COALESCE(SUM(net_amount), 0) as revenue,
    COALESCE(SUM(amount), 0) as expenses
  FROM (
    SELECT date, net_amount, 0 as amount FROM sales WHERE user_id = auth.uid()
    UNION ALL
    SELECT date, 0 as net_amount, amount FROM expenses WHERE user_id = auth.uid()
  ) combined
  GROUP BY date
)
SELECT 
  date,
  SUM(revenue) OVER (ORDER BY date) as cum_revenue,
  SUM(expenses) OVER (ORDER BY date) as cum_expenses,
  SUM(revenue - expenses) OVER (ORDER BY date) as cum_profit
FROM daily_data
ORDER BY date;

-- ========================================
-- POLÍTICAS RLS PARA AS VIEWS
-- ========================================

-- Políticas para sales_by_platform_view
CREATE POLICY "Select own sales by platform" 
  ON sales_by_platform_view FOR SELECT
  USING (true);

-- Políticas para sales_by_weekday_view
CREATE POLICY "Select own sales by weekday" 
  ON sales_by_weekday_view FOR SELECT
  USING (true);

-- Políticas para sales_by_hour_view
CREATE POLICY "Select own sales by hour" 
  ON sales_by_hour_view FOR SELECT
  USING (true);

-- Políticas para top_products_view
CREATE POLICY "Select own top products" 
  ON top_products_view FOR SELECT
  USING (true);

-- Políticas para expense_distribution_view
CREATE POLICY "Select own expense distribution" 
  ON expense_distribution_view FOR SELECT
  USING (true);

-- Políticas para daily_summary_view
CREATE POLICY "Select own daily summary" 
  ON daily_summary_view FOR SELECT
  USING (true);

-- Políticas para accumulated_summary_view
CREATE POLICY "Select own accumulated summary" 
  ON accumulated_summary_view FOR SELECT
  USING (true); 