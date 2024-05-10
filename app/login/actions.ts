'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGithub() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
  return { data, error }
}

// link github account
export async function linkWithGithub() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'github',
  })
  console.log(data)
  redirect(data.url)
  return { data, error }
}

export async function unLinkWithGithub() {
  const supabase = createClient()
  const {
    data: { identities },
  } = await supabase.auth.getUserIdentities()

  // find the github identity linked to the user
  const githubIdentity = identities.find((identity) => identity.provider === 'github')

  // unlink the github identity from the user
  const { data, error } = await supabase.auth.unlinkIdentity(githubIdentity)

  console.log(data)
  return { data, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
}
