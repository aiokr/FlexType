'use server'

import {revalidateTag} from 'next/cache'

export default async function action() {
  console.log('Auto revalidate')
  revalidateTag('/')
}
