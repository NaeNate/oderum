"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const updateVote = async (
  fragranceId: number,
  state: { message: string; error: string },
  fd: FormData,
) => {
  const session = await auth()
  if (!session) redirect("/")

  const reference = { userId: session.user.id, fragranceId }

  const { rating, longevity, sillage } = Object.fromEntries(fd) as any
  const attributes = {
    rating: parseInt(rating),
    longevity: parseInt(longevity),
    sillage: parseInt(sillage),
  }

  await prisma.vote.upsert({
    where: { userId_fragranceId: reference },
    update: attributes,
    create: { ...reference, ...attributes },
  })

  return { message: "Successfully updated", error: "" }
}

export const updateLists = async (
  fragranceId: number,
  list: string,
  current: boolean,
) => {
  const session = await auth()
  if (!session) redirect("/")

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      [list]: { [current ? "disconnect" : "connect"]: [{ id: fragranceId }] },
    },
  })
}
