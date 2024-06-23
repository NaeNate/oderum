"use client"

import FormState from "@/components/FormState"
import PendingButton from "@/components/PendingButton"
import { cap } from "@/utils"
import type { Vote } from "@prisma/client"
import { useState } from "react"
import { useFormState } from "react-dom"
import { updateVote } from "./actions"

interface Props {
  fragranceId: number
  existing?: Vote
}

export default function Vote({ fragranceId, existing }: Props) {
  const [attributes, setAttributes] = useState<{ [k: string]: number }>({
    rating: existing?.rating || 3,
    longevity: existing?.longevity || 3,
    sillage: existing?.sillage || 3,
  })

  const updateVoteWithFragranceId = updateVote.bind(null, fragranceId)
  const [state, formAction] = useFormState(updateVoteWithFragranceId, {
    message: "",
    error: "",
  })

  return (
    <>
      <form action={formAction}>
        {["rating", "longevity", "sillage"].map((attribute, i) => (
          <div key={i}>
            <p className="text-center">{cap(attribute)}</p>

            <input
              type="range"
              name={attribute}
              min="1"
              max="5"
              value={attributes[attribute]}
              onChange={(e) =>
                setAttributes({
                  ...attributes,
                  [attribute]: parseInt(e.target.value),
                })
              }
            />
          </div>
        ))}

        <FormState state={state} />
        <PendingButton />
      </form>
    </>
  )
}
