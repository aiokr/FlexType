import { auth } from "auth"

export default async function dashboard() {
  const session = await auth()
  return (
    <div>
      {session? (JSON.stringify(session, null, 2)) : "no login"}
    </div>
  )
}