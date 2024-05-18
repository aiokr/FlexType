import {redirect} from 'next/navigation'

import {createClient} from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = createClient()

  const {data, error} = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="pt-14 md:pt-0 overflow-y-auto mt-4 w-full">
      <div className="container mx-auto ">
        <section className="w-full grid grid-cols-2 md:grid-cols-4">
          <div className="border border-zinc-200 rounded-xl w-full h-36 p-4">12</div>
        </section>
      </div>
    </div>
  )
}
