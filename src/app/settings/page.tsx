import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Settings from "./Settings"

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect("/")

  return <Settings />
}
