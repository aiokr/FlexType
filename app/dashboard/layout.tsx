import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="dashboard-container mt-4">
      {children}
    </div>
  )
}