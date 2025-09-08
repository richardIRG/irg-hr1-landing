const faqs = [
  {
    q: 'What is in the whitepaper?',
    a: 'Plain‑language summary of H.R. 1 changes, what it means in California, and five operational moves to make now.'
  },
  {
    q: 'Is this only for California providers?',
    a: 'It focuses on Medi‑Cal (CalAIM) and is most useful for ECM and Community Supports providers in California.'
  },
  {
    q: 'Do office hours include a sales pitch?',
    a: 'No. Bring a real problem. We’ll troubleshoot together and point to next steps.'
  },
  {
    q: 'How do you handle privacy?',
    a: 'We collect only basic contact info to send the whitepaper and follow up if you ask.'
  },
]

export function FAQ() {
  return (
    <section className="container-narrow py-16">
      <h2 className="text-2xl font-semibold mb-6">FAQ</h2>
      <div className="divide-y divide-slate-200">
        {faqs.map((f) => (
          <details key={f.q} className="py-4 group">
            <summary className="cursor-pointer list-none flex justify-between items-center">
              <span className="font-medium text-slate-900">{f.q}</span>
              <span className="text-slate-400 group-open:rotate-45 transition">＋</span>
            </summary>
            <p className="mt-2 text-slate-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

