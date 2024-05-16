'use server'

import { revalidateTag } from 'next/cache'

export async function autoRevalidate() {
  console.log('Auto revalidate')
  revalidateTag('/')
}
