import { auth, signIn, signOut } from "@/lib/auth"
import { imager } from "@/utils"
import Image from "next/image"
import Link from "next/link"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="flex h-20 items-center border-2 border-solid border-background border-b-zinc-700 px-4">
      <Link href="/" className="text-3xl">
        Oderum
      </Link>

      <div className="ml-auto flex items-center gap-4">
        {session && (
          <Link
            href={"/user/" + session.user.username}
            className="relative size-12 rounded-full bg-zinc-700"
          >
            <Image
              src={imager("profile/" + session.user.id)}
              alt="Profile Picture"
              fill
              className="rounded-full"
            />
          </Link>
        )}

        <form
          action={async () => {
            "use server"
            session ? await signOut() : await signIn()
          }}
        >
          <button className="rounded-full bg-zinc-700 px-4 py-2 text-lg">
            {session ? "Sign Out" : "Sign In"}
          </button>
        </form>
      </div>
    </nav>
  )
}
