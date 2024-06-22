import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import New from "./New"

export default async function NewPage() {
  const session = await auth()
  if (!session) redirect("/")

  return <New />
}
