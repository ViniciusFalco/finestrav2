-- Corrigir a view sales_by_hour

-- 1. Dropar a view existente se houver
DROP VIEW IF EXISTS sales_by_hour;

-- 2. Criar a view corrigida usando o campo 'time'
CREATE VIEW sales_by_hour AS
WITH hour_ranges AS (
  SELECT 
    CASE 
      WHEN EXTRACT(HOUR FROM time) BETWEEN 0 AND 5 THEN '00:00 - 05:59'
      WHEN EXTRACT(HOUR FROM time) BETWEEN 6 AND 11 THEN '06:00 - 11:59'
      WHEN EXTRACT(HOUR FROM time) BETWEEN 12 AND 17 THEN '12:00 - 17:59'
      WHEN EXTRACT(HOUR FROM time) BETWEEN 18 AND 23 THEN '18:00 - 23:59'
    END as hour_range,
    COUNT(*) as quantity,
    date
  FROM sales 
  WHERE time IS NOT NULL
  GROUP BY 
    CASE 
      WHEN EXTRACT(HOUR FROM time) BETWEEN 0 AND 5 THEN '00:00 - 05:59'
      WHEN EXTRACT(HOUR FROM time) BETWEEN 6 AND 11 THEN '06:00 - 11:59'
      WHEN EXTRACT(HOUR FROM time) BETWEEN 12 AND 17 THEN '12:00 - 17:59'
      WHEN EXTRACT(HOUR FROM time) BETWEEN 18 AND 23 THEN '18:00 - 23:59'
    END,
    date
)
SELECT 
  hour_range,
  quantity,
  date
FROM hour_ranges
ORDER BY 
  CASE hour_range
    WHEN '00:00 - 05:59' THEN 1
    WHEN '06:00 - 11:59' THEN 2
    WHEN '12:00 - 17:59' THEN 3
    WHEN '18:00 - 23:59' THEN 4
  END;

-- 3. Verificar se a view foi criada corretamente
SELECT * FROM sales_by_hour ORDER BY hour_range;

-- 4. Verificar se há dados na tabela sales com time
SELECT 
  COUNT(*) as total_sales,
  COUNT(time) as sales_with_time,
  COUNT(*) - COUNT(time) as sales_without_time
FROM sales;

-- 5. Verificar alguns exemplos de dados de vendas
SELECT 
  id,
  date,
  time,
  created_at,
  quantity,
  net_amount
FROM sales 
LIMIT 5; 