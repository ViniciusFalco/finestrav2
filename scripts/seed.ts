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

// Função para obter ou criar usuário de teste
async function getOrCreateTestUser(): Promise<string> {
  console.log('🔍 Verificando usuário de teste...');
  
  try {
    // 1. Tentar buscar um usuário existente pelo email
    const { data: existingUser, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
      console.error('❌ Erro ao buscar usuários:', searchError);
    } else if (existingUser.users && existingUser.users.length > 0) {
      // Buscar pelo email real do usuário
      const testUser = existingUser.users.find(u => u.email === 'viniciusasso@gmail.com');
      if (testUser) {
        console.log('✅ Usando usuário existente:', testUser.id);
        return testUser.id;
      }
    }
    
    // 2. Se não existir, criar um novo usuário
    console.log('👤 Criando novo usuário de teste...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'viniciusasso@gmail.com',
      password: '123456',
      email_confirm: true
    });
    
    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError);
      throw new Error('Não foi possível criar usuário de teste');
    }
    
    if (!newUser.user?.id) {
      throw new Error('Usuário criado mas ID não encontrado');
    }
    
    console.log('✅ Novo usuário criado:', newUser.user.id);
    return newUser.user.id;
    
  } catch (error: unknown) {
    // Se o erro for de email já existente, tentar buscar o usuário
    const errorMessage = error instanceof Error ? error.message : '';
    const errorCode = (error as { code?: string })?.code;
    
    if (errorMessage.includes('already been registered') || errorCode === 'email_exists') {
      console.log('🔄 Usuário já existe, buscando...');
      
      const { data: existingUser, error: searchError } = await supabase.auth.admin.listUsers();
      
      if (searchError) {
        console.error('❌ Erro ao buscar usuários:', searchError);
        throw new Error('Não foi possível buscar usuário existente');
      }
      
      const testUser = existingUser.users?.find(u => u.email === 'viniciusasso@gmail.com');
      if (testUser) {
        console.log('✅ Usando usuário existente:', testUser.id);
        return testUser.id;
      }
    }
    
    throw error;
  }
}

// Função para gerar data aleatória nos últimos 7 dias
function getRandomDateInLastWeek(): string {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  const randomTime = sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime());
  const randomDate = new Date(randomTime);
  
  return randomDate.toISOString().split('T')[0];
}

// Função para gerar hora aleatória
function getRandomTime(): string {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para gerar vendas aleatórias
async function seedSales(testUserId: string) {
  console.log('🌱 Populando vendas...');
  
  // Primeiro, verificar se já existem produtos e plataformas
  const { data: existingProducts } = await supabase
    .from('products')
    .select('id, name')
    .eq('user_id', testUserId)
    .limit(5);
    
  const { data: existingPlatforms } = await supabase
    .from('platforms')
    .select('id, name')
    .eq('user_id', testUserId)
    .limit(5);

  let createdProducts = existingProducts;
  let createdPlatforms = existingPlatforms;
  
  // Se não existem produtos, criar novos
  if (!existingProducts || existingProducts.length === 0) {
    console.log('📦 Criando produtos...');
    const { data: newProducts, error: prodError } = await supabase
      .from('products')
      .insert(products.map(({ name }) => ({ name, user_id: testUserId })))
      .select();
      
    if (prodError) {
      console.error('❌ Erro ao criar produtos:', prodError);
      return;
    }
    createdProducts = newProducts;
  }
  
  // Se não existem plataformas, criar novas
  if (!existingPlatforms || existingPlatforms.length === 0) {
    console.log('🌐 Criando plataformas...');
    const { data: newPlatforms, error: platError } = await supabase
      .from('platforms')
      .insert(platforms.map(p => ({ name: p.name, user_id: testUserId })))
      .select();
      
    if (platError) {
      console.error('❌ Erro ao criar plataformas:', platError);
      return;
    }
    createdPlatforms = newPlatforms;
  }
    
  if (!createdProducts || !createdPlatforms) {
    console.error('❌ Erro ao obter produtos ou plataformas');
    return;
  }
  
  const sales = [];
  
  // Gerar 20 vendas nos últimos 7 dias
  for (let i = 0; i < 20; i++) {
    const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const platform = createdPlatforms[Math.floor(Math.random() * createdPlatforms.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const netAmount = products.find(p => p.name === product.name)?.price || 100 * quantity;
    
    sales.push({
      user_id: testUserId,
      date: getRandomDateInLastWeek(),
      time: getRandomTime(),
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
async function seedExpenses(testUserId: string) {
  console.log('🌱 Populando despesas...');
  
  // Primeiro, verificar se já existem categorias
  const { data: existingCategories } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('user_id', testUserId)
    .limit(10);
    
  let createdCategories = existingCategories;
  
  // Se não existem categorias, criar novas
  if (!existingCategories || existingCategories.length === 0) {
    console.log('📂 Criando categorias...');
    const { data: newCategories, error: catError } = await supabase
      .from('categories')
      .insert(categories.map(({ name, type }) => ({ name, type, user_id: testUserId })))
      .select();
      
    if (catError) {
      console.error('❌ Erro ao criar categorias:', catError);
      return;
    }
    createdCategories = newCategories;
  }
    
  if (!createdCategories) {
    console.error('❌ Erro ao obter categorias');
    return;
  }
  
  const expenses = [];
  
  // Gerar 10 despesas nos últimos 7 dias
  for (let i = 0; i < 10; i++) {
    const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    const originalCategory = categories.find(c => c.name === category.name);
    const subcategory = originalCategory?.subcategories[Math.floor(Math.random() * originalCategory.subcategories.length)] || 'Geral';
    const amount = Math.random() * 500 + 50; // Entre 50 e 550
    
    expenses.push({
      user_id: testUserId,
      date: getRandomDateInLastWeek(),
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
async function seedRefunds(testUserId: string) {
  console.log('🌱 Populando reembolsos...');
  
  // Primeiro, buscar algumas vendas para criar reembolsos
  const { data: sales } = await supabase
    .from('sales')
    .select('id, product_id, platform_id, net_amount')
    .eq('user_id', testUserId)
    .limit(3);
    
  if (!sales || sales.length === 0) {
    console.log('⚠️ Nenhuma venda encontrada para criar reembolsos');
    return;
  }
  
  const refunds = [];
  
  for (let i = 0; i < 3; i++) {
    const sale = sales[i];
    const refundAmount = sale.net_amount * (Math.random() * 0.5 + 0.1); // 10% a 60% do valor
    
    refunds.push({
      user_id: testUserId,
      sale_id: sale.id,
      product_id: sale.product_id,
      platform_id: sale.platform_id,
      date: getRandomDateInLastWeek(),
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
    // Obter ou criar usuário de teste
    const testUserId = await getOrCreateTestUser();
    
    await seedSales(testUserId);
    await seedExpenses(testUserId);
    await seedRefunds(testUserId);
    
    console.log('✅ Seed concluído com sucesso!');
    console.log('📊 Dados inseridos:');
    console.log('   - 20 vendas (últimos 7 dias)');
    console.log('   - 10 despesas (últimos 7 dias)');
    console.log('   - 3 reembolsos (últimos 7 dias)');
    console.log('📅 Período: Últimos 7 dias');
    console.log('👤 Usuário de teste:', testUserId);
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase }; 