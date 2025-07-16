import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas. Verifique o arquivo .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Executando migração...');
  
  try {
    // SQL para adicionar a coluna price
    const migrationSQL = `
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS price numeric(12,2) NOT NULL DEFAULT 0;
      
      COMMENT ON COLUMN products.price IS 'Preço unitário do produto em centavos';
    `;
    
    // Executar a migração
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Erro na migração:', error);
      
      // Tentar método alternativo
      console.log('🔄 Tentando método alternativo...');
      
      // Verificar se a coluna já existe
      const { data: columns, error: checkError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'products')
        .eq('column_name', 'price');
        
      if (checkError) {
        console.error('❌ Erro ao verificar colunas:', checkError);
        return;
      }
      
      if (columns && columns.length > 0) {
        console.log('✅ Coluna price já existe!');
      } else {
        console.log('⚠️ Coluna price não encontrada. Execute manualmente no Supabase SQL Editor:');
        console.log(migrationSQL);
      }
    } else {
      console.log('✅ Migração executada com sucesso!');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    console.log('⚠️ Execute manualmente no Supabase SQL Editor:');
    console.log(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS price numeric(12,2) NOT NULL DEFAULT 0;
      
      COMMENT ON COLUMN products.price IS 'Preço unitário do produto em centavos';
    `);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runMigration();
}

export { runMigration }; 