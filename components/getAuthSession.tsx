import { createClient } from '@/utils/supabase/server'

// 从 authjs 获取 session
export default async function AuthSession() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data
}

export async function LoginUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export const LoginUserName = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.email
}

export const LoginUserEmail = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.email
}

export const LoginUserAvatar = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.email
}