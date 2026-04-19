import { useApp } from "../../context/useApp"

function Logo() {
  const { weatherInfo, geoInfo } = useApp()

  const subtitle = (() => {
    if (weatherInfo?.name) {
      const country = weatherInfo.sys?.country
      const state = geoInfo?.[0]?.state
      const parts = [weatherInfo.name, state, country].filter(Boolean)
      return parts.join(" · ")
    }
    return "Search a city to load live conditions"
  })()

  return (
    <div className="min-w-0 space-y-1.5 sm:space-y-2">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-400/90" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-[11px] sm:tracking-[0.2em]">
          Live workspace
        </p>
      </div>
      <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-3xl">Weather dashboard</h1>
      <p className="max-w-xl truncate text-xs leading-relaxed text-white/55 sm:text-sm">{subtitle}</p>
    </div>
  )
}

export default Logo
