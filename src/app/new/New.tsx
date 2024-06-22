"use client"

import FileInput from "@/components/FileInput"
import FormState from "@/components/FormState"
import PendingButton from "@/components/PendingButton"
import { useFormState } from "react-dom"
import { createFragrance } from "./actions"

export default function New() {
  const [state, formAction] = useFormState(createFragrance, {
    message: "",
    error: "",
  })

  return (
    <>
      <h1>New</h1>

      <form action={formAction} className="flex flex-col gap-2">
        <input name="designer" placeholder="Designer" className="input" />
        <input name="line" placeholder="Line" className="input" />
        <input name="fragrance" placeholder="Fragrance" className="input" />
        <textarea
          name="notes"
          placeholder="Notes"
          className="input h-[25rem]"
        />

        <div className="flex gap-2">
          <input name="url" placeholder="URL" className="input w-full" />
          <FileInput />
        </div>

        <FormState state={state} />
        <PendingButton />
      </form>
    </>
  )
}
