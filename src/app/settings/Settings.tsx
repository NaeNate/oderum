"use client"

import FileInput from "@/components/FileInput"
import FormState from "@/components/FormState"
import PendingButton from "@/components/PendingButton"
import { useFormState } from "react-dom"
import { updateUser } from "./actions"

export default function Settings() {
  const [state, formAction] = useFormState(updateUser, {
    message: "",
    error: "",
  })

  return (
    <>
      <h1>Settings</h1>

      <form action={formAction} className="flex flex-col gap-2">
        <input name="username" placeholder="Username" />
        <FileInput />

        <FormState state={state} />
        <PendingButton />
      </form>
    </>
  )
}
