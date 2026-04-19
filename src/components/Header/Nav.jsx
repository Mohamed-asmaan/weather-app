function Nav() {
  return (
    <nav
      className="hidden items-center gap-1 rounded-xl border border-white/15 bg-black/15 p-1 sm:flex"
      aria-label="Dashboard sections"
    >
      <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white">Overview</span>
      <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/45">Conditions</span>
      <span className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/45">Insights</span>
    </nav>
  )
}

export default Nav
