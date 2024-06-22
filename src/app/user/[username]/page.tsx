import { prisma } from "@/lib/prisma"
import { imager } from "@/utils"
import Image from "next/image"

interface Props {
  params: {
    username: string
  }
}

export default async function User({ params }: Props) {
  const user = await prisma.user.findFirst({
    where: {
      username: { equals: params.username.toLowerCase(), mode: "insensitive" },
    },
  })
  if (!user) throw Error("User not found")

  return (
    <>
      <div className="relative size-72 rounded-full bg-zinc-700">
        <Image
          src={imager("profile/" + user.id)}
          alt="Profile Picture"
          fill
          className="rounded-full object-cover"
        />
      </div>

      <p className="my-4 text-xl">{user.username}</p>
    </>
  )
}
