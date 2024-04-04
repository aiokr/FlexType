import { auth } from "auth"

// 从 authjs 获取 session
export default async function AuthSession() {
  const session: any = await auth()
  //console.log(session)
  return session
}

export const LoginUserName = async () => {
  const session: any = await auth()
  //console.log(session.user.name)
  return session.user.name
}

export const LoginUserEmail = async () => {
  const session: any = await auth()
  //console.log(session.user.email)
  return session.user.email
}

export const LoginUserAvatar = async () => {
  const session: any = await auth()
  //console.log(session.user.image)
  return session.user.image
}