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
    where: { line: { slug: params.line }, slug: params.fragrance },
    include: {
      designer: true,
      line: true,
      ownedBy: true,
      wantedBy: true,
      votes: true,
    },
  })
  if (!fragrance) throw Error("Fragrance not found")

  const session = await auth()

  return (
    <>
      <p>{fragrance.name}</p>

      <div className="flex">
        <Image
          src={imager(slash(params.designer, params.line, params.fragrance))}
          alt="Fragrance Image"
          width="300"
          height="300"
        />

        <div>
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
        </div>

        <div>
          <Lists
            fragranceId={fragrance.id}
            owned={fragrance.ownedBy.some(
              (user) => user.id === session?.user.id,
            )}
            wanted={fragrance.wantedBy.some(
              (user) => user.id === session?.user.id,
            )}
          />
        </div>

        <Vote
          fragranceId={fragrance.id}
          existing={fragrance.votes.find(
            (vote) => vote.userId === session?.user.id,
          )}
        />
      </div>
    </>
  )
}
