import { login, signup } from './actions'
import { Input } from '@douyinfe/semi-ui';

export default function LoginPage() {
  return (
    <div className='container max-w-[100vw] mx-auto '>
      <form className='flex flex-col items-start justify-center shadow p-5 m-6'>
        <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password" className='block text-sm font-medium leading-6 text-gray-900'>Password:</label>
        <input id="password" name="password" type="password"  required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
    </div>
  )
}