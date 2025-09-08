import { env } from '@/lib/env'

export default function Privacy() {
  if (env.PRIVACY_URL) {
    return (
      <main className="container-narrow py-20">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4">View our privacy policy at <a className="text-brand-primary underline" href={env.PRIVACY_URL}>{env.PRIVACY_URL}</a>.</p>
      </main>
    )
  }
  return (
    <main className="container-narrow py-20 prose">
      <h1>Privacy Policy (Placeholder)</h1>
      <p>We collect basic contact information submitted through this site to deliver requested resources and to follow up if you ask. We do not sell your data. You can request deletion by contacting us.</p>
      <p>Replace this page by setting the <code>PRIVACY_URL</code> environment variable to your canonical policy.</p>
    </main>
  )
}
