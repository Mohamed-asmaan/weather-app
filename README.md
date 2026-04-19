# Weather App

A React + Vite app that shows current weather for a searchable city using the [OpenWeatherMap](https://openweathermap.org/) API. The UI uses Tailwind CSS v4 and Framer Motion.

## Live site

**Vercel:** [https://weather-app-vgrf-gw4pls2ma-mohamed-asmaans-projects.vercel.app/](https://weather-app-vgrf-gw4pls2ma-mohamed-asmaans-projects.vercel.app/)

## Repository

[https://github.com/Mohamed-asmaan/weather-app](https://github.com/Mohamed-asmaan/weather-app)

## What this project demonstrates

- React 19 with functional components and **Context** (`AppProvider`) for shared location and API URLs
- **Axios** requests: geocoding and current weather fetched in parallel
- **Vite** for dev server, HMR, and production builds
- **Tailwind CSS** for layout and styling, with a responsive card layout

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (LTS is fine)
- npm (bundled with Node)

## Run locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mohamed-asmaan/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Open the URL printed in the terminal (usually `http://localhost:5173`).

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Dev server with hot reload           |
| `npm run build`   | Production build output in `dist/`   |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint on the project            |

## OpenWeatherMap API key

Weather data needs a valid OpenWeatherMap API key.

1. Sign up at [openweathermap.org/api](https://openweathermap.org/api) and create a key (activation can take a short time).
2. For local development, set your key in `src/context/AppProvider.jsx` as the `OPEN_WEATHER_KEY` constant.

**Important:** Do not commit private API keys to a public repository. For real deployments, store the key in environment variables (for example `VITE_OPEN_WEATHER_KEY` in a `.env` file that is listed in `.gitignore`) and read it with `import.meta.env.VITE_OPEN_WEATHER_KEY`. Rotate any key that was accidentally exposed.

## Deploy (e.g. Vercel)

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/) and connect the repository.
3. Use the default Vite settings: build command `npm run build`, output directory `dist`.
4. Add your OpenWeatherMap key in the project **Environment Variables** if you switch the code to use `import.meta.env`.

## Tech stack

- React 19, Vite 8  
- Tailwind CSS 4, Framer Motion  
- Axios  

Weather icons are loaded from OpenWeatherMap’s CDN as used in `WeatherReport.jsx`.
