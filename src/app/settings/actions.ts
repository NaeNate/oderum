"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

export const updateUser = async (
  state: { message: string; error: string },
  fd: FormData,
) => {
  const session = await auth()

  const { username, file } = Object.fromEntries(fd) as {
    username: string
    file: File
  }

  if (username) {
    const existing = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    })

    if (existing) {
      return { message: "", error: "Username taken" }
    } else {
      await prisma.user.update({
        where: { id: session!.user.id },
        data: { username },
      })
    }
  }

  if (file.size) {
    await put("profile/" + session!.user.id, file, {
      access: "public",
      addRandomSuffix: false,
    })
  }

  return { message: "Successfully updated", error: "" }
}
