'use client'

import { useState, useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient.browser'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = supabaseBrowser()

  useEffect(() => {
    // Debug: verificar se o Supabase está sendo inicializado
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    console.log('Supabase client:', supabase)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Tentando autenticar...', { email, isSignUp })

    try {
      if (isSignUp) {
        console.log('Tentando signup...')
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        console.log('Signup result:', { error })
        if (error) throw error
        alert('Verifique seu email para confirmar o cadastro!')
      } else {
        console.log('Tentando signin...')
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        console.log('Signin result:', { error })
        if (error) throw error
        console.log('Login bem-sucedido, redirecionando...')
        router.push('/dashboard')
      }
    } catch (error: unknown) {
      console.error('Erro na autenticação:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="space-y-1">
          <h1 className="mb-6 text-3xl font-bold text-center text-primary-600">Finestra</h1>
          <CardTitle className="text-2xl font-bold text-center text-neutral-900">
            {isSignUp ? 'Criar conta' : 'Entrar na sua conta'}
          </CardTitle>
          <CardDescription className="text-center text-neutral-600">
            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              {isSignUp ? 'Faça login' : 'Cadastre-se'}
            </button>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-4" onSubmit={handleAuth}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Carregando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
            </Button>
            <Button
              variant="link"
              disabled
              onClick={() => {}}
              className="w-full"
            >
              Esqueci a senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 