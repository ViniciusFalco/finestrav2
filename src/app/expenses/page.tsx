import { redirect } from 'next/navigation'
import { getServerSupabase } from '@/lib/getServerSupabase'
export const dynamic = 'force-dynamic'
import ExpensesClient from './ExpensesClient'

export default async function ExpensesPage() {
  const { supabase } = getServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return <ExpensesClient />
} 