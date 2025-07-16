-- ========================================
-- MIGRAÇÃO: Adicionar coluna price à tabela products
-- Data: 2025-07-14
-- ========================================

-- Adicionar coluna price à tabela products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price numeric(12,2) NOT NULL DEFAULT 0;

-- Comentário na coluna
COMMENT ON COLUMN products.price IS 'Preço unitário do produto em centavos'; 