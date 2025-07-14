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

// Dados de seed
const products = [
  { name: 'Curso de React Avançado', price: 299.90, category: 'Educação' },
  { name: 'Ebook Marketing Digital', price: 49.90, category: 'Educação' },
  { name: 'Consultoria 1h', price: 150.00, category: 'Serviços' },
  { name: 'Template WordPress', price: 89.90, category: 'Produtos Digitais' },
  { name: 'Mentoria Mensal', price: 500.00, category: 'Serviços' }
];

const platforms = [
  { name: 'Hotmart', fee_percentage: 0.15 },
  { name: 'Monetizze', fee_percentage: 0.12 },
  { name: 'Eduzz', fee_percentage: 0.10 }
];

const categories = [
  { name: 'Marketing', type: 'variable', subcategories: ['Ads', 'SEO', 'Social Media'] },
  { name: 'Infraestrutura', type: 'fixed', subcategories: ['Hosting', 'Domínios', 'Ferramentas'] },
  { name: 'Educação', type: 'variable', subcategories: ['Cursos', 'Mentoria', 'Material'] },
  { name: 'Operacional', type: 'fixed', subcategories: ['Salários', 'Escritório', 'Equipamentos'] }
];



// Função para gerar data aleatória no último mês
function getRandomDateInLastMonth(): string {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  const randomTime = lastMonth.getTime() + Math.random() * (endOfLastMonth.getTime() - lastMonth.getTime());
  const randomDate = new Date(randomTime);
  
  return randomDate.toISOString().split('T')[0];
}

// Função para gerar vendas aleatórias
async function seedSales() {
  console.log('🌱 Populando vendas...');
  
  // Usar um UUID válido para o usuário de teste
  const testUserId = '00000000-0000-0000-0000-000000000000';
  
  // Primeiro, criar produtos e plataformas
  const { data: createdProducts } = await supabase
    .from('products')
    .insert(products.map(p => ({ user_id: testUserId, name: p.name })))
    .select();
    
  const { data: createdPlatforms } = await supabase
    .from('platforms')
    .insert(platforms.map(p => ({ user_id: testUserId, name: p.name })))
    .select();
    
  if (!createdProducts || !createdPlatforms) {
    console.error('❌ Erro ao criar produtos ou plataformas');
    return;
  }
  
  const sales = [];
  const userId = testUserId; // Usuário de teste
  
  for (let i = 0; i < 100; i++) {
    const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const platform = createdPlatforms[Math.floor(Math.random() * createdPlatforms.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const netAmount = products.find(p => p.name === product.name)!.price * quantity;
    
    sales.push({
      user_id: userId,
      date: getRandomDateInLastMonth(),
      time: new Date().toTimeString().split(' ')[0],
      product_id: product.id,
      platform_id: platform.id,
      quantity,
      net_amount: netAmount,
      currency: 'BRL'
    });
  }
  
  const { error } = await supabase
    .from('sales')
    .insert(sales);
    
  if (error) {
    console.error('❌ Erro ao inserir vendas:', error);
  } else {
    console.log(`✅ ${sales.length} vendas inseridas com sucesso`);
  }
}

// Função para gerar despesas aleatórias
async function seedExpenses() {
  console.log('🌱 Populando despesas...');
  
  // Usar um UUID válido para o usuário de teste
  const testUserId = '00000000-0000-0000-0000-000000000000';
  
  // Primeiro, criar categorias
  const { data: createdCategories } = await supabase
    .from('categories')
    .insert(categories.map(c => ({ 
      user_id: testUserId, 
      name: c.name, 
      type: c.type 
    })))
    .select();
    
  if (!createdCategories) {
    console.error('❌ Erro ao criar categorias');
    return;
  }
  
  const expenses = [];
  const userId = testUserId;
  
  for (let i = 0; i < 40; i++) {
    const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    const originalCategory = categories.find(c => c.name === category.name)!;
    const subcategory = originalCategory.subcategories[Math.floor(Math.random() * originalCategory.subcategories.length)];
    const amount = Math.random() * 500 + 50; // Entre 50 e 550
    
    expenses.push({
      user_id: userId,
      date: getRandomDateInLastMonth(),
      description: `Despesa ${i + 1} - ${subcategory}`,
      amount: Math.round(amount * 100) / 100,
      category_id: category.id
    });
  }
  
  const { error } = await supabase
    .from('expenses')
    .insert(expenses);
    
  if (error) {
    console.error('❌ Erro ao inserir despesas:', error);
  } else {
    console.log(`✅ ${expenses.length} despesas inseridas com sucesso`);
  }
}

// Função para gerar reembolsos
async function seedRefunds() {
  console.log('🌱 Populando reembolsos...');
  
  // Usar um UUID válido para o usuário de teste
  const testUserId = '00000000-0000-0000-0000-000000000000';
  
  // Primeiro, buscar algumas vendas para criar reembolsos
  const { data: sales } = await supabase
    .from('sales')
    .select('id, product_id, platform_id, net_amount')
    .limit(5);
    
  if (!sales || sales.length === 0) {
    console.log('⚠️ Nenhuma venda encontrada para criar reembolsos');
    return;
  }
  
  const refunds = [];
  const userId = testUserId;
  
  for (let i = 0; i < 5; i++) {
    const sale = sales[i];
    const refundAmount = sale.net_amount * (Math.random() * 0.5 + 0.1); // 10% a 60% do valor
    
    refunds.push({
      user_id: userId,
      sale_id: sale.id,
      product_id: sale.product_id,
      platform_id: sale.platform_id,
      date: getRandomDateInLastMonth(),
      amount: Math.round(refundAmount * 100) / 100
    });
  }
  
  const { error } = await supabase
    .from('refunds')
    .insert(refunds);
    
  if (error) {
    console.error('❌ Erro ao inserir reembolsos:', error);
  } else {
    console.log(`✅ ${refunds.length} reembolsos inseridos com sucesso`);
  }
}

// Função principal
async function seedDatabase() {
  console.log('🚀 Iniciando seed do banco de dados...');
  
  try {
    await seedSales();
    await seedExpenses();
    await seedRefunds();
    
    console.log('✅ Seed concluído com sucesso!');
    console.log('📊 Dados inseridos:');
    console.log('   - 100 vendas');
    console.log('   - 40 despesas');
    console.log('   - 5 reembolsos');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase }; 