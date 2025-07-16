-- ========================================
-- MIGRAÇÃO: Adicionar coluna price à tabela products
-- Data: 2025-07-14
-- Execute este script no Supabase SQL Editor
-- ========================================

-- Adicionar coluna price à tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price numeric(12,2) NOT NULL DEFAULT 0;

-- Comentário na coluna
COMMENT ON COLUMN products.price IS 'Preço unitário do produto em centavos';

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'price'; 