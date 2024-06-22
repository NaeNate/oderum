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
      className="rounded bg-foreground p-2 text-background disabled:cursor-not-allowed disabled:bg-zinc-300"
    >
      {text}
    </button>
  )
}
