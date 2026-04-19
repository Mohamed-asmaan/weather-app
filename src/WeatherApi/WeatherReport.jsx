import { useApp } from "../context/useApp"
import { useEffect, useState } from "react"
import axios from "axios"

function errorText(err) {
  const status = err.response?.status
  const msg = err.response?.data?.message
  if (status === 404 || msg === "city not found") return "City not found. Try another spelling."
  if (status === 401) return "Invalid API key."
  if (status === 429) return "Too many requests. Wait a bit and try again."
  if (!err.response) return "Network error. Check your connection."
  if (typeof msg === "string") return msg
  return err.message || "Something went wrong."
}

function windDirectionName(deg) {
  if (deg == null || Number.isNaN(deg)) return "—"
  const names = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
  const i = Math.round((deg % 360) / 22.5) % 16
  return names[i]
}

function sunTimeUtc(seconds) {
  if (seconds == null) return "—"
  return new Date(seconds * 1000).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  })
}

function StatBox({ title, value, sub }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-sm sm:rounded-2xl sm:p-4">
      <p className="text-[9px] font-semibold uppercase tracking-wide text-white/45 sm:text-[11px] sm:tracking-wider">
        {title}
      </p>
      <p className="mt-1 text-base font-semibold leading-tight text-white sm:mt-1.5 sm:text-2xl">{value}</p>
      {sub ? (
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/40 sm:mt-1 sm:text-xs">{sub}</p>
      ) : null}
    </div>
  )
}

function WeatherReport() {
  const { W_G_U, W_C_U, setWeatherInfo, setGeoInfo } = useApp()

  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!W_G_U || !W_C_U) return

    let stopped = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const [geoRes, weatherRes] = await Promise.all([axios.get(W_G_U), axios.get(W_C_U)])
        if (stopped) return

        const geo = geoRes.data
        if (Array.isArray(geo) && geo.length === 0) {
          setError("No location found. Try another city.")
          setWeather(null)
          setGeoInfo(null)
          setWeatherInfo(null)
          return
        }

        const w = weatherRes.data
        if (w.cod != null && String(w.cod) !== "200") {
          setError(typeof w.message === "string" ? w.message : "Weather not available.")
          setWeather(null)
          setGeoInfo(null)
          setWeatherInfo(null)
          return
        }

        setGeoInfo(geo)
        setWeatherInfo(w)
        setWeather(w)
      } catch (err) {
        if (stopped) return
        setError(errorText(err))
        setWeather(null)
        setGeoInfo(null)
        setWeatherInfo(null)
      } finally {
        if (!stopped) setLoading(false)
      }
    }

    load()

    return () => {
      stopped = true
    }
  }, [W_G_U, W_C_U, setGeoInfo, setWeatherInfo])

  const w = weather
  const icon = w?.weather?.[0]?.icon
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null

  const temp = w?.main?.temp != null ? `${Math.round(w.main.temp)}°` : "—"
  const feels = w?.main?.feels_like != null ? `${Math.round(w.main.feels_like)}°` : "—"
  const humidity = w?.main?.humidity != null ? `${w.main.humidity}%` : "—"
  const pressure = w?.main?.pressure != null ? `${w.main.pressure}` : "—"
  const clouds = w?.clouds?.all != null ? `${w.clouds.all}%` : "—"
  const windKmh = w?.wind?.speed != null ? `${(w.wind.speed * 3.6).toFixed(1)} km/h` : "—"
  const windHint =
    w?.wind?.deg != null ? `${windDirectionName(w.wind.deg)} (${Math.round(w.wind.deg)}°)` : "—"
  const visKm = w?.visibility != null ? `${(w.visibility / 1000).toFixed(1)} km` : "—"
  const sunrise = w?.sys?.sunrise != null ? sunTimeUtc(w.sys.sunrise) : "—"
  const sunset = w?.sys?.sunset != null ? sunTimeUtc(w.sys.sunset) : "—"
  const rain1h = w?.rain?.["1h"] != null ? `${w.rain["1h"]} mm` : "—"
  const snow1h = w?.snow?.["1h"] != null ? `${w.snow["1h"]} mm` : "—"
  const desc = w?.weather?.[0]?.description
    ? w.weather[0].description.replace(/\b\w/g, (c) => c.toUpperCase())
    : "—"
  const mainLabel = w?.weather?.[0]?.main ?? "—"
  const coords =
    w?.coord?.lat != null && w?.coord?.lon != null ? `${w.coord.lat.toFixed(2)}, ${w.coord.lon.toFixed(2)}` : "—"

  return (
    <main className="text-white">
      {loading && (
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-8 text-center text-sm text-white/60 sm:rounded-2xl sm:px-6 sm:py-12 sm:text-base">
          Loading weather…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-3 text-sm text-red-200 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-base">
          {error}
        </div>
      )}

      {!loading && w && (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="flex flex-col gap-3 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-2 sm:gap-4">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={mainLabel}
                  className="h-12 w-12 shrink-0 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                  width={80}
                  height={80}
                />
              ) : null}
              <div className="min-w-0">
                <p className="text-[11px] text-white/50 sm:text-sm">OpenWeatherMap</p>
                <p className="mt-0.5 text-3xl font-semibold leading-none sm:mt-1 sm:text-5xl lg:text-6xl">
                  {temp}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-white/70 sm:mt-2 sm:text-base lg:text-lg">
                  {desc}
                </p>
                <p className="text-[11px] text-white/45 sm:text-sm">{mainLabel}</p>
              </div>
            </div>
          </div>

          {/* Mobile: 2 cols → sm: 3 cols → lg: 4 cols (shorter scroll, denser tiles) */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-3">
            <StatBox title="Feels like" value={feels} sub="Apparent" />
            <StatBox title="Humidity" value={humidity} sub="Relative" />
            <StatBox title="Wind" value={windKmh} sub={windHint} />
            <StatBox title="Clouds" value={clouds} sub="Coverage" />
            <StatBox title="Pressure" value={`${pressure} hPa`} sub="Sea level" />
            <StatBox title="Visibility" value={visKm} sub="Horizontal" />
            <StatBox title="Sunrise" value={sunrise} sub="UTC" />
            <StatBox title="Sunset" value={sunset} sub="UTC" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 sm:rounded-2xl sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/45 sm:text-[11px] sm:tracking-wider">
                Rain / snow (1h)
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:mt-3 sm:flex sm:flex-wrap sm:gap-6 sm:text-sm">
                <div>
                  <p className="text-[10px] text-white/40 sm:text-sm">Rain</p>
                  <p className="mt-0.5 font-medium sm:mt-1">{rain1h}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 sm:text-sm">Snow</p>
                  <p className="mt-0.5 font-medium sm:mt-1">{snow1h}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 sm:rounded-2xl sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/45 sm:text-[11px] sm:tracking-wider">
                Location
              </p>
              <p className="mt-2 text-[11px] leading-snug text-white/70 sm:mt-3 sm:text-sm">
                <span className="text-white/50">Coords </span>
                <span className="text-white">{coords}</span>
              </p>
              {w.id != null ? (
                <p className="mt-1.5 text-[10px] text-white/40 sm:mt-2 sm:text-xs">
                  City id <span className="text-white/60">#{w.id}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default WeatherReport
