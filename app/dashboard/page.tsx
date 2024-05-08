import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function Settings() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className='container max-w-[100vw] mx-auto '>
      {JSON.stringify(data, null, 2)}
    </div>
  )
}