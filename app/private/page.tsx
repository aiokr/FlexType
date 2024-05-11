import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = createClient()
  const {data, error} = await supabase.auth.getUser()
  console.log(data)

  if (error || !data?.user) {
    redirect('/login')
  } else if (!data.user.user_metadata.role.includes('admin')) {
    redirect('/login/newadmin')
  } else {
    return <p>Hello {data.user.email}</p>
  }
}
