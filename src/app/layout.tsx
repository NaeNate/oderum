import "@/styles/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Footer from "./Footer"
import Navbar from "./Navbar"

export const metadata: Metadata = {
  title: "Oderum",
}

const inter = Inter({ subsets: ["latin"] })

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <Navbar />
        <div className="bg-accent h-[2px]" />
        <main className="mx-auto my-4 w-3/5 flex-grow">{children}</main>
        <div className="bg-accent h-[2px]" />
        <Footer />
      </body>
    </html>
  )
}
