import Link from 'next/link'
import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'

export default async function Settings() {
  const supabase = createClient()

  const {data, error} = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
      <div className="text-xl font-bold">对外 API</div>
      <Link href={'/flex/flow'} target={'_blank'} className="text-blue-500">
        照片流 Flow: /flex/flow{' '}
      </Link>
    </div>
  )
}
