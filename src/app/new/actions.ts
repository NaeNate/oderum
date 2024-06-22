"use server"

import { prisma } from "@/lib/prisma"
import { slash, slug } from "@/utils"
import { put } from "@vercel/blob"
import { redirect } from "next/navigation"
import sharp from "sharp"

export const createFragrance = async (
  state: { message: string; error: string },
  fd: FormData,
) => {
  const raw = Object.fromEntries(fd) as any

  const data = {
    ...raw,
    dSlug: slug(raw.designer),
    lSlug: slug(raw.line),
    fSlug: slug(raw.fragrance),
  }

  const path = slash(data.dSlug, data.lSlug, data.fSlug)

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

  const longest = Math.max(width as number, height as number)

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

  await prisma.$transaction(async (prisma) => {
    const designer = await prisma.designer.upsert({
      where: { slug: data.dSlug },
      create: { slug: data.dSlug, name: data.designer },
      update: {},
    })

    const line = await prisma.line.upsert({
      where: { slug: data.lSlug },
      create: { slug: data.lSlug, name: data.line, designerId: designer.id },
      update: {},
    })

    const fragrance = await prisma.fragrance.create({
      data: {
        slug: data.fSlug,
        name: data.fragrance,
        designerId: designer.id,
        lineId: line.id,
      },
    })

    for (const [i, layer] of data.notes.split(":").entries()) {
      for (let noteName of layer.trim().split("\n")) {
        noteName = noteName.trim()

        const parents = ["Vanilla", "Pepper", "Cedar"]
        const realNote =
          parents.find((parent) => noteName.split(" ").includes(parent)) ||
          noteName

        const note = await prisma.note.upsert({
          where: { slug: slug(realNote) },
          create: { slug: slug(realNote), name: realNote },
          update: {},
        })

        await prisma.fragranceToNote.create({
          data: {
            name: noteName,
            type: ["top", "middle", "base"][i],
            fragranceId: fragrance.id,
            noteId: note.id,
          },
        })
      }
    }
  })

  redirect("/" + path)
}
