"use client"

import { useState } from "react"
import { updateLists } from "./actions"

interface Props {
  fragranceId: number
  owned: boolean
  wanted: boolean
}

export default function Lists({ fragranceId, owned: x, wanted: y }: Props) {
  const [owned, setOwned] = useState(x)
  const [wanted, setWanted] = useState(y)

  return (
    <>
      <button
        onClick={async () => {
          setOwned(!owned)
          await updateLists(fragranceId, "owns", owned)
        }}
        className={"button " + (owned && "bg-green-500")}
      >
        Own
      </button>

      <button
        onClick={async () => {
          setWanted(!wanted)
          await updateLists(fragranceId, "wants", wanted)
        }}
        className={"button " + (wanted && "bg-green-500")}
      >
        Want
      </button>
    </>
  )
}
