# Weather App

A React + Vite single-page app that shows current weather for a searchable city, using the [OpenWeatherMap](https://openweathermap.org/) API. The UI uses **Tailwind CSS v4** (via the Vite plugin) and **Framer Motion**.

## Links

| | |
| --- | --- |
| **Repository** | [github.com/Mohamed-asmaan/weather-app](https://github.com/Mohamed-asmaan/weather-app) |
| **Live (Vercel)** | [https://weather-app-vgrf-gw4pls2ma-mohamed-asmaans-projects.vercel.app/](https://weather-app-vgrf-gw4pls2ma-mohamed-asmaans-projects.vercel.app/) |

The production site is deployed on Vercel from this repository.

---

## What you can learn from this project

- **Vite** — fast dev server, ES modules, and an optimized production build.
- **React 19** — components, hooks, and **Context** (`AppProvider`) for shared search location and API URLs.
- **Axios** — parallel requests for geocoding and current weather.
- **Tailwind CSS v4** — `@tailwindcss/vite` in `vite.config.js` (no separate PostCSS config required for the default setup).
- **Framer Motion** — motion on the main weather panel.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node)

Check versions:

```bash
node -v
npm -v
```

---

## Get the code

```bash
git clone https://github.com/Mohamed-asmaan/weather-app.git
cd weather-app
```

---

## Install dependencies

```bash
npm install
```

---

## Run in development

```bash
npm run dev
```

Vite serves the app (default [http://localhost:5173](http://localhost:5173)) with hot reload when files change.

---

## Other scripts

| Command | Description |
| --- | --- |
| `npm run build` | Production build → output in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Production build

```bash
npm run build
```

Outputs a static site in **`dist/`** (what you deploy to Vercel, Netlify, etc.). Test it locally with:

```bash
npm run preview
```

---

## OpenWeatherMap API key

The app reads a key from `src/context/AppProvider.jsx` as `OPEN_WEATHER_KEY`.

1. Create a free account at [openweathermap.org/api](https://openweathermap.org/api) and generate a key (activation may take a short time).
2. Replace the value in `AppProvider.jsx` for local development.

**Security:** Avoid committing real keys to a public repo. Prefer a Vite env variable (e.g. `VITE_OPEN_WEATHER_KEY` in `.env`, listed in `.gitignore`) and `import.meta.env.VITE_OPEN_WEATHER_KEY`, and set the same variable in your Vercel project settings. Rotate any key that was exposed.

---

## Project layout

| Path | Role |
| --- | --- |
| `index.html` | HTML shell and root `<div id="root">` |
| `src/main.jsx` | React entry |
| `src/App.jsx` | Layout: `AppProvider`, header, `WeatherReport` |
| `src/components/Header/` | Logo, nav, city search |
| `src/context/AppProvider.jsx` | Context: location state, API URLs, OpenWeather key |
| `src/WeatherApi/WeatherReport.jsx` | Fetches geo + weather, renders dashboard |
| `src/utils/weatherUrls.js` | Helpers to build OpenWeather API URLs |
| `src/index.css` | Global styles and Tailwind import |
| `vite.config.js` | React + Tailwind Vite plugins |

---

## Deploy on Vercel

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com/), import the repo.
3. Defaults: **Build command** `npm run build`, **Output directory** `dist`.
4. Add environment variables in Vercel if you move the API key to `import.meta.env`.

---

## Teaching notes

- Use **`npm run dev`** while learning; use **`npm run build`** + **`npm run preview`** before you treat the app as “production ready.”
- Trace data flow from **search** → **Context URL updates** → **`WeatherReport`** `useEffect` + Axios → UI.
