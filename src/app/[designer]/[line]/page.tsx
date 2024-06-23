import { prisma } from "@/lib/prisma"
import { imager, slash } from "@/utils"
import Image from "next/image"
import Link from "next/link"

interface Props {
  params: {
    designer: string
    line: string
  }
}

export default async function Line({ params }: Props) {
  const line = await prisma.line.findUnique({
    where: { slug: params.line.toLowerCase() },
    include: { fragrances: true },
  })
  if (!line) throw Error("Line not found")

  return (
    <>
      <h1>{line.name}</h1>

      <div className="flex gap-2">
        {line.fragrances.map((fragrance, i) => {
          const path = slash(params.designer, params.line, fragrance.slug)

          return (
            <Link href={"/" + path} key={i} className="nice border-base">
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
