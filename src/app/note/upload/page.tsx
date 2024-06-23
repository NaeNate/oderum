"use client"

import FileInput from "@/components/FileInput"
import FormState from "@/components/FormState"
import PendingButton from "@/components/PendingButton"
import { useFormState } from "react-dom"
import { uploadNoteImage } from "./actions"

export default function Upload() {
  const [state, formAction] = useFormState(uploadNoteImage, {
    message: "",
    error: "",
  })

  return (
    <>
      <h1>Upload</h1>

      <form action={formAction} className="flex flex-col gap-2">
        <input name="note" placeholder="Note" className="input" />

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
