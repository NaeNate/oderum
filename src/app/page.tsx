import { prisma } from "@/lib/prisma"
import { imager, slash } from "@/utils"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  const recents = await prisma.fragrance.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { designer: true, line: true },
  })

  return (
    <>
      <h1>Oderum</h1>

      <p>Recent Additions</p>
      <div className="flex gap-2">
        {recents.map((fragrance, i) => {
          const path = slash(
            fragrance.designer.slug,
            fragrance.line.slug,
            fragrance.slug,
          )

          return (
            <Link href={"/" + path} key={i} className="rounded bg-zinc-700 p-2">
              <Image
                src={imager(path)}
                alt="Fragrance Image"
                width="120"
                height="120"
              />
            </Link>
          )
        })}
      </div>
    </>
  )
}
