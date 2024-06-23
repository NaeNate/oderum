import { prisma } from "@/lib/prisma"
import { cap, imager, slash } from "@/utils"
import Image from "next/image"
import Link from "next/link"

interface Props {
  params: {
    username: string
  }
}

export default async function User({ params }: Props) {
  const user = await prisma.user.findFirst({
    where: { username: { equals: params.username, mode: "insensitive" } },
    include: {
      owns: { include: { designer: true, line: true } },
      wants: { include: { designer: true, line: true } },
    },
  })
  if (!user) throw Error("User not found")

  return (
    <>
      <div className="bg-accent relative size-72 rounded-full">
        <Image
          src={imager("profile/" + user.id)}
          alt="Profile Picture"
          fill
          className="rounded-full object-cover"
        />
      </div>

      <p className="my-4 text-xl">{user.username}</p>

      {["owns", "wants"].map((list, i) => (
        <>
          <p>{cap(list)}</p>
          <div className="flex gap-2">
            {(list === "owns" ? user.owns : user.wants).map((fragrance, i) => {
              const path = slash(
                fragrance.designer.slug,
                fragrance.line.slug,
                fragrance.slug,
              )

              return (
                <Link href={"/" + path} key={i} className="nice border-base">
                  <Image
                    src={imager(path)}
                    alt="Fragrance Image"
                    width="100"
                    height="100"
                  />
                </Link>
              )
            })}
          </div>
        </>
      ))}
    </>
  )
}
