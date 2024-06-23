import { prisma } from "@/lib/prisma"
import { imager, slash } from "@/utils"
import Image from "next/image"
import Link from "next/link"

interface Props {
  params: {
    designer: string
  }
}

export default async function Designer({ params }: Props) {
  const designer = await prisma.designer.findUnique({
    where: { slug: params.designer.toLowerCase() },
    include: { lines: { include: { fragrances: true } } },
  })
  if (!designer) throw Error("Designer not found")

  return (
    <>
      <h1>{designer.name}</h1>

      <div className="flex gap-2">
        {designer.lines.map((line, i) => {
          return (
            <Link
              href={params.designer + "/" + line.slug}
              key={i}
              className="nice border-base"
            >
              <Image
                src={imager(
                  slash(params.designer, line.slug, line.fragrances[0].slug),
                )}
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
