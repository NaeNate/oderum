import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cap, imager, slash } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import Lists from "./Lists"
import Vote from "./Vote"

interface Props {
  params: {
    designer: string
    line: string
    fragrance: string
  }
}

export default async function Fragrance({ params }: Props) {
  const fragrance = await prisma.fragrance.findUnique({
    where: {
      line: { slug: params.line.toLowerCase() },
      slug: params.fragrance.toLowerCase(),
    },
    include: {
      designer: true,
      line: true,
      fragranceToNote: { include: { note: true } },
      ownedBy: true,
      wantedBy: true,
      votes: true,
    },
  })
  if (!fragrance) throw Error("Fragrance not found")

  const session = await auth()

  return (
    <>
      <h1>{fragrance.name}</h1>

      <Image
        src={imager(slash(params.designer, params.line, params.fragrance))}
        alt="Fragrance Image"
        width="300"
        height="300"
      />

      <p>
        Designer:{" "}
        <Link href={"/" + params.designer} className="underline">
          {fragrance.designer.name}
        </Link>
      </p>

      <p>
        Line:{" "}
        <Link
          href={"/" + params.designer + "/" + params.line}
          className="underline"
        >
          {fragrance.line.name}
        </Link>
      </p>

      {["rating", "longevity", "sillage"].map((attribute, i) => {
        const sum = fragrance.votes.reduce(
          (acc, vote) => acc + (vote as any)[attribute],
          0,
        )
        const average = (sum / fragrance.votes.length || 0).toFixed(2)

        return (
          <p key={i}>
            <span>{cap(attribute)}: </span>
            {average}
          </p>
        )
      })}

      {["Top", "Middle", "Base"].map((layer) => (
        <>
          <p>{layer}</p>

          <div className="flex w-1/2 justify-around">
            {fragrance.fragranceToNote.map((ftn, i) => {
              if (ftn.type !== layer.toLowerCase()) return

              return (
                <Link
                  href={"/note/" + ftn.note.slug}
                  key={i}
                  className="flex flex-col items-center p-2"
                >
                  <Image
                    src={imager("note/" + ftn.note.slug)}
                    alt="Note Image"
                    width="60"
                    height="60"
                  />
                  <p className="text-sm">{ftn.name}</p>
                </Link>
              )
            })}
          </div>
        </>
      ))}

      <Lists
        fragranceId={fragrance.id}
        owned={fragrance.ownedBy.some((user) => user.id === session?.user.id)}
        wanted={fragrance.wantedBy.some((user) => user.id === session?.user.id)}
      />

      <Vote
        fragranceId={fragrance.id}
        existing={fragrance.votes.find(
          (vote) => vote.userId === session?.user.id,
        )}
      />
    </>
  )
}
