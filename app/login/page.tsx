import { login, signup } from './actions'
import { Input } from '@douyinfe/semi-ui';

export default function LoginPage() {
  return (
    <div className='container max-w-[100vw] mx-auto '>
      <form className='flex flex-col items-start justify-center shadow p-5 m-6 gap-3'>
        <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>Email:</label>
        <input id="email" name="email" type="email" required className='text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded-lg shadow-sm' />
        <label htmlFor="password" className='block text-sm font-medium leading-6 text-gray-900'>Password:</label>
        <input id="password" name="password" type="password" required className='text-sm leading-5 w-full py-2 px-3 border-2 text-slate-500 rounded-lg shadow-sm' />
        <button formAction={login} className='text-sm text-center leading-5 w-full py-2 text-white bg-sky-500 rounded-lg shadow-sm hover:shadow-lg transition-all'>Log in</button>
        <button formAction={signup} className='text-sm text-center leading-5 w-full py-2 text-white bg-gray-300 rounded-lg shadow-sm transition-all' disabled>Sign up</button>
      </form>
    </div>
  )
}