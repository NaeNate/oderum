export const slug = (text: string) =>
  text.toLowerCase().replace(/[ &]/g, "-").replace(/-+/g, "-")

export const imager = (path: string) =>
  "https://hixirnwwe5bu8kts.public.blob.vercel-storage.com/" + path

export const slash = (d: string, l: string, f: string) => d + "/" + l + "/" + f

export const cap = (word: string) =>
  word[0].toUpperCase() + word.slice(1).toLowerCase()
