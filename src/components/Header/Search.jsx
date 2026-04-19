import { useApp } from "../../context/useApp"
import {
  buildCurrentWeatherUrl,
  buildCurrentWeatherLatLonUrl,
  buildGeoUrl,
  buildGeoSuggestUrl,
  buildReverseGeoUrl,
} from "../../utils/weatherUrls"
import axios from "axios"
import { useEffect, useState } from "react"

/** One line of text for a city in the dropdown (name, state, country). */
function cityLine(item) {
  const parts = [item.name, item.state, item.country].filter(Boolean)
  return parts.join(", ")
}

const pillBtn =
  "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-white/45 transition hover:text-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"

function Search() {
  const {
    loc,
    setloc,
    OPEN_WEATHER_KEY,
    OPEN_WEATHER_CURRENT_URL,
    OPEN_WEATHER_GEO_URL,
    setwgu,
    setwcu,
  } = useApp()

  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [noResults, setNoResults] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  // Load city ideas from OpenWeather while you type (waits 400ms after you stop typing).
  useEffect(() => {
    const text = loc.trim()
    if (!inputFocused || text.length < 2) {
      setSuggestions([])
      setSuggestionsLoading(false)
      setNoResults(false)
      return
    }

    setNoResults(false)
    let cancelled = false
    let timerId
    let abortController

    timerId = setTimeout(async () => {
      abortController = new AbortController()
      setSuggestionsLoading(true)
      setSuggestions([])

      const url = buildGeoSuggestUrl(text, OPEN_WEATHER_KEY, OPEN_WEATHER_GEO_URL, 5)

      try {
        const response = await axios.get(url, { signal: abortController.signal })
        if (cancelled) return
        const list = Array.isArray(response.data) ? response.data : []
        setSuggestions(list)
        setNoResults(list.length === 0)
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return
        if (cancelled) return
        setSuggestions([])
        setNoResults(true)
      } finally {
        if (!cancelled) setSuggestionsLoading(false)
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timerId)
      if (abortController) abortController.abort()
    }
  }, [loc, inputFocused, OPEN_WEATHER_KEY, OPEN_WEATHER_GEO_URL])

  const showDropdown =
    inputFocused &&
    loc.trim().length >= 2 &&
    (suggestionsLoading || suggestions.length > 0 || noResults)

  function searchByCityName(cityText) {
    const text = (cityText ?? loc).trim()
    if (!text) return
    setloc(text)
    setwcu(buildCurrentWeatherUrl(text, OPEN_WEATHER_KEY, OPEN_WEATHER_CURRENT_URL))
    setwgu(buildGeoUrl(text, OPEN_WEATHER_KEY, OPEN_WEATHER_GEO_URL))
    setSuggestions([])
    setNoResults(false)
  }

  function pickCityFromList(item) {
    const text = cityLine(item)
    setloc(text)
    setwcu(buildCurrentWeatherLatLonUrl(item.lat, item.lon, OPEN_WEATHER_KEY, OPEN_WEATHER_CURRENT_URL))
    setwgu(buildReverseGeoUrl(item.lat, item.lon, OPEN_WEATHER_KEY))
    setSuggestions([])
    setNoResults(false)
  }

  function onFormSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const cityField = new FormData(form).get("city")
    const cityText = typeof cityField === "string" ? cityField : loc
    searchByCityName(cityText)
  }

  return (
    <div className="relative z-20 w-full max-w-full overflow-visible lg:max-w-md">
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl sm:rounded-3xl sm:border-white/25 sm:bg-white/12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/35" />

        <form
          className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:flex sm:flex-row sm:items-center sm:gap-x-4 sm:gap-y-0 sm:px-4 sm:py-3"
          onSubmit={onFormSubmit}
        >
          <div className="flex min-w-0 items-center gap-2 sm:min-w-0 sm:flex-1 sm:gap-3">
            <svg
              className="h-4 w-4 shrink-0 text-white/65 sm:h-5 sm:w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20L16.5 16.5" strokeLinecap="round" />
            </svg>

            <label htmlFor="city-search" className="sr-only">
              City
            </label>
            <input
              id="city-search"
              name="city"
              type="text"
              value={loc}
              placeholder="City…"
              autoComplete="off"
              enterKeyHint="search"
              onChange={(e) => setloc(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => {
                setInputFocused(false)
                setSuggestions([])
              }}
              className="h-9 min-w-0 flex-1 bg-transparent py-1 text-xs leading-snug text-white outline-none placeholder:text-white/40 sm:h-11 sm:py-0 sm:text-sm sm:leading-normal sm:placeholder:text-white/45"
            />
          </div>

          <div className="flex shrink-0 flex-row flex-wrap items-center justify-end gap-2.5 sm:justify-start sm:gap-3">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setloc("")}
              className={`${pillBtn} ${
                loc.trim()
                  ? "pointer-events-none opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                  : "invisible pointer-events-none"
              }`}
            >
              Close
            </button>
            <button type="submit" className={`shrink-0 ${pillBtn}`}>
              Search
            </button>
          </div>
        </form>
      </div>

      {showDropdown && (
        <ul
          id="city-suggest-list"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-white/15 bg-zinc-950/95 py-1.5 shadow-xl backdrop-blur-md sm:left-auto sm:right-0 sm:mt-2 sm:min-w-full sm:rounded-2xl sm:py-2"
        >
          {suggestionsLoading && (
            <li className="px-3 py-2.5 text-sm text-white/50 sm:px-4 sm:py-3">Searching…</li>
          )}
          {!suggestionsLoading && noResults && suggestions.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-white/50 sm:px-4 sm:py-3">No cities found</li>
          )}
          {suggestions.map((item, index) => (
            <li key={`${item.lat}-${item.lon}-${index}`}>
              <button
                type="button"
                className="flex w-full px-3 py-2.5 text-left text-sm text-white/85 hover:bg-white/8 sm:px-4 sm:py-3"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickCityFromList(item)}
              >
                <span className="truncate">{cityLine(item)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Search
