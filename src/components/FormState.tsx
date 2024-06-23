interface Props {
  state: { message: string; error: string }
}

export default function FormState({ state: { message, error } }: Props) {
  return (
    <>
      {message && (
        <p
        // className="text-green-500"
        >
          {message}
        </p>
      )}
      {error && (
        <p
        // className="text-red-500"
        >
          {error}
        </p>
      )}
    </>
  )
}
