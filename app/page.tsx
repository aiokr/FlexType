import Image from "next/image";

import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  return (
    <main className="container">
      <p>HomePage</p>
      {JSON.stringify(data, null, 2)}
    </main>
  );
}
