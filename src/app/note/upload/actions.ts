"use server"

import { slug } from "@/utils"
import { put } from "@vercel/blob"
import { redirect } from "next/navigation"
import sharp from "sharp"

export const uploadNoteImage = async (
  state: { message: string; error: string },
  fd: FormData,
) => {
  const raw = Object.fromEntries(fd) as any

  const data = {
    ...raw,
    nSlug: slug(raw.note),
  }

  const path = "note/" + data.nSlug

  let file

  if (data.file.size) {
    file = data.file
  } else {
    const blob = await fetch(data.url).then((res) => res.blob())
    file = new File([blob], "image", { type: blob.type })

    if (blob.type.split("/")[0] !== "image") {
      return { message: "", error: "Image fetch failed" }
    }
  }

  const form = new FormData()
  form.append("image_file", file)

  const removed = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: { "x-api-key": process.env.PHOTOROOM! },
    body: form,
  }).then((res) => res.arrayBuffer())

  const { width, height } = await sharp(removed)
    .trim()
    .toBuffer()
    .then((buffer) => sharp(buffer).metadata())

  const longest = Math.min(Math.max(width as number, height as number), 1200)

  const squared = await sharp(removed)
    .trim()
    .resize(longest, longest, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp()
    .toBuffer()

  const { output } = await fetch("https://api.tinify.com/shrink", {
    method: "POST",
    headers: { Authorization: "Basic " + btoa("api:" + process.env.TINIFY!) },
    body: new File([squared], "image"),
  }).then((res) => res.json())

  const final = new File(
    [await fetch(output.url).then((res) => res.blob())],
    "image",
    { type: "image/webp" },
  )

  await put(path, final, {
    access: "public",
    addRandomSuffix: false,
  })

  redirect("/" + path)
}
