import { redirect } from 'next/navigation'
import { getServerSupabase } from '@/lib/getServerSupabase'
export const dynamic = 'force-dynamic'
import SalesClient from './SalesClient'

export default async function SalesPage() {
  const { supabase } = getServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return <SalesClient />
} 