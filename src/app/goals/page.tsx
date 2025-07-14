import { redirect } from 'next/navigation'
import { getServerSupabase } from '@/lib/getServerSupabase'
export const dynamic = 'force-dynamic'
import GoalsClient from './GoalsClient'

export default async function GoalsPage() {
  const { supabase } = getServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return <GoalsClient />
} 