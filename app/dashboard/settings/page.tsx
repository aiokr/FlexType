import Link from 'next/link'

export default async function Settings() {
  return (
    <div>
      <div className='text-xl font-bold'>对外 API</div>
      <Link href={'/flex/flow'} target={'_blank'} className='text-blue-500'>照片流 Flow: /flex/flow </Link>
    </div>
  )
}