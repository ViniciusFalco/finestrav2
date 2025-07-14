import { redirect } from 'next/navigation'
import { getServerSupabase } from '@/lib/getServerSupabase'
export const dynamic = 'force-dynamic'
import CategoriesClient from './CategoriesClient'

export default async function CategoriesPage() {
  const { supabase } = getServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return <CategoriesClient />
} 