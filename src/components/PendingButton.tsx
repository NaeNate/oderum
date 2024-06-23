"use client"

import { useFormStatus } from "react-dom"

interface Props {
  text?: string
}

export default function PendingButton({ text = "Submit" }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      disabled={pending}
      className="nice button disabled:cursor-not-allowed disabled:bg-zinc-400"
    >
      {text}
    </button>
  )
}
