import { createServerClient } from '@supabase/ssr'

export { createServerClient };
// O uso correto é feito diretamente nos Server Components/API/Middleware
// Exemplo:
// const supabase = createServerClient(url, key, { cookies: { getAll, setAll } }) 