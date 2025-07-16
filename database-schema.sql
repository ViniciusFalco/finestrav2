-- ========================================
-- SCHEMA DO BANCO DE DADOS - FINESTRA V2
-- ========================================

-- 1. Tabelas principais
create table if not exists accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text,
  balance numeric default 0,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  price numeric(12,2) not null default 0,
  created_at timestamp with time zone default now()
);

create table if not exists platforms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  parent_id uuid references categories(id),
  type text,
  created_at timestamp with time zone default now()
);

create table if not exists expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  description text,
  amount numeric not null,
  category_id uuid not null references categories(id),
  account_id uuid references accounts(id),
  created_at timestamp with time zone default now()
);

create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  time time not null default now(),
  product_id uuid not null references products(id),
  platform_id uuid not null references platforms(id),
  quantity integer not null default 1,
  net_amount numeric not null,
  currency text default 'BRL',
  created_at timestamp with time zone default now()
);

create table if not exists refunds (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  sale_id uuid references sales(id),
  product_id uuid not null references products(id),
  platform_id uuid not null references platforms(id),
  date date not null,
  amount numeric not null,
  created_at timestamp with time zone default now()
);

create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  goal_mode text not null,     -- 'Monetary' or 'Quantity'
  target_value numeric not null,
  period_type text not null,   -- 'Monthly' or 'Quarterly'
  start_date date not null,
  end_date date not null,
  achieved boolean default false,
  created_at timestamp with time zone default now()
);

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Accounts policies
create policy "Select own accounts" 
  on accounts for select
  using ( auth.uid() = user_id );

create policy "Insert own accounts" 
  on accounts for insert
  with check ( auth.uid() = user_id );

create policy "Update own accounts" 
  on accounts for update
  using ( auth.uid() = user_id );

create policy "Delete own accounts" 
  on accounts for delete
  using ( auth.uid() = user_id );

-- Products policies
create policy "Select own products" 
  on products for select
  using ( auth.uid() = user_id );

create policy "Insert own products" 
  on products for insert
  with check ( auth.uid() = user_id );

create policy "Update own products" 
  on products for update
  using ( auth.uid() = user_id );

create policy "Delete own products" 
  on products for delete
  using ( auth.uid() = user_id );

-- Platforms policies
create policy "Select own platforms" 
  on platforms for select
  using ( auth.uid() = user_id );

create policy "Insert own platforms" 
  on platforms for insert
  with check ( auth.uid() = user_id );

create policy "Update own platforms" 
  on platforms for update
  using ( auth.uid() = user_id );

create policy "Delete own platforms" 
  on platforms for delete
  using ( auth.uid() = user_id );

-- Categories policies
create policy "Select own categories" 
  on categories for select
  using ( auth.uid() = user_id );

create policy "Insert own categories" 
  on categories for insert
  with check ( auth.uid() = user_id );

create policy "Update own categories" 
  on categories for update
  using ( auth.uid() = user_id );

create policy "Delete own categories" 
  on categories for delete
  using ( auth.uid() = user_id );

-- Expenses policies
create policy "Select own expenses" 
  on expenses for select
  using ( auth.uid() = user_id );

create policy "Insert own expenses" 
  on expenses for insert
  with check ( auth.uid() = user_id );

create policy "Update own expenses" 
  on expenses for update
  using ( auth.uid() = user_id );

create policy "Delete own expenses" 
  on expenses for delete
  using ( auth.uid() = user_id );

-- Sales policies
create policy "Select own sales" 
  on sales for select
  using ( auth.uid() = user_id );

create policy "Insert own sales" 
  on sales for insert
  with check ( auth.uid() = user_id );

create policy "Update own sales" 
  on sales for update
  using ( auth.uid() = user_id );

create policy "Delete own sales" 
  on sales for delete
  using ( auth.uid() = user_id );

-- Refunds policies
create policy "Select own refunds" 
  on refunds for select
  using ( auth.uid() = user_id );

create policy "Insert own refunds" 
  on refunds for insert
  with check ( auth.uid() = user_id );

create policy "Update own refunds" 
  on refunds for update
  using ( auth.uid() = user_id );

create policy "Delete own refunds" 
  on refunds for delete
  using ( auth.uid() = user_id );

-- Goals policies
create policy "Select own goals" 
  on goals for select
  using ( auth.uid() = user_id );

create policy "Insert own goals" 
  on goals for insert
  with check ( auth.uid() = user_id );

create policy "Update own goals" 
  on goals for update
  using ( auth.uid() = user_id );

create policy "Delete own goals" 
  on goals for delete
  using ( auth.uid() = user_id );

-- ========================================
-- DADOS INICIAIS (OPCIONAL)
-- ========================================

-- Nota: Execute este bloco apenas se quiser dados iniciais
-- Substitua o UUID abaixo pelo ID do usuário que você criar

-- insert into categories (user_id, name, type) values
--   ('00000000-0000-0000-0000-000000000000', 'Despesas Fixas', 'Fixed'),
--   ('00000000-0000-0000-0000-000000000000', 'Despesas Variáveis', 'Variable'); 