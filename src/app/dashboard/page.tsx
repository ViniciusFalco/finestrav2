import { redirect } from 'next/navigation'
import { getServerSupabase } from '@/lib/getServerSupabase'
export const dynamic = 'force-dynamic'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const { supabase } = getServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  console.log('Sessão SSR:', session);

  if (!session) redirect('/login')   // 🔒 redireciona se não logado

  return <DashboardClient />
} 