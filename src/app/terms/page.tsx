import { env } from '@/lib/env'

export default function Terms() {
  if (env.TERMS_URL) {
    return (
      <main className="container-narrow py-20">
        <h1 className="text-3xl font-semibold">Terms</h1>
        <p className="mt-4">View our terms at <a className="text-brand-primary underline" href={env.TERMS_URL}>{env.TERMS_URL}</a>.</p>
      </main>
    )
  }
  return (
    <main className="container-narrow py-20 prose">
      <h1>Terms (Placeholder)</h1>
      <p>This site is provided for informational purposes only. Use of resources is at your own discretion. By submitting the form, you consent to receive the whitepaper and occasional updates.</p>
      <p>Replace this page by setting the <code>TERMS_URL</code> environment variable to your canonical page.</p>
    </main>
  )
}
