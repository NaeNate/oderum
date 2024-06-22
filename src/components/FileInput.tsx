"use client"

import { useState } from "react"

interface Props {
  required?: boolean
}

export default function FileInput({ required = false }: Props) {
  const [selected, setSelected] = useState(false)

  return (
    <>
      <label
        htmlFor="file"
        tabIndex={0}
        onKeyDown={({ key }) => {
          if (key === "Enter" || key === " ")
            (document.querySelector("#file") as any).click()
        }}
        className={
          "cursor-pointer whitespace-nowrap rounded p-2 text-center " +
          (selected ? "bg-green-500" : "bg-red-500")
        }
      >
        {selected ? "File Selected" : "Select File"}
      </label>
      <input
        type="file"
        id="file"
        name="file"
        required={required}
        onChange={() => setSelected(true)}
        className="hidden"
      />
    </>
  )
}
