import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200">
      <div className="container-wide py-8 text-center text-sm text-slate-600">
        <p>© {new Date().getFullYear()} Insight Research Group</p>
      </div>
    </footer>
  )
}

