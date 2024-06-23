import { prisma } from "@/lib/prisma"
import { imager } from "@/utils"
import Image from "next/image"

interface Props {
  params: {
    note: string
  }
}

export default async function Note({ params }: Props) {
  const note = await prisma.note.findUnique({
    where: { slug: params.note.toLowerCase() },
  })
  if (!note) throw Error("Note not found")

  return (
    <>
      <h1>{note.name}</h1>

      <Image
        src={imager("note/" + note.slug)}
        alt="Fragrance Image"
        width="300"
        height="300"
      />
    </>
  )
}
