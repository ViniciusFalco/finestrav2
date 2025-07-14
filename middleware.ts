import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  // Log de execução do middleware
  console.log('[MIDDLEWARE] Executando para:', req.nextUrl.pathname)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const all = req.cookies.getAll();
          console.log('[MIDDLEWARE] Cookies recebidos:', all);
          return all;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  console.log('[MIDDLEWARE] Sessão encontrada:', session)

  const isAuthPage = req.nextUrl.pathname.startsWith('/login')

  if (!session && !isAuthPage) {
    console.log('[MIDDLEWARE] Não autenticado, redirecionando para /login')
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (session && isAuthPage) {
    console.log('[MIDDLEWARE] Já autenticado, redirecionando para /dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  console.log('[MIDDLEWARE] Acesso liberado para', req.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 