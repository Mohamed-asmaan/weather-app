import "./App.css"
import Header from "./components/Header/Header"
import { AppProvider } from "./context/AppProvider"
import WeatherReport from "./WeatherApi/WeatherReport"

/**
 * Weather Report Application (React + Vite).
 * Equivalent goals to Create React App: SPA with components, hooks, and API data.
 */
function App() {
  return (
    <AppProvider>
      <div className="app-shell mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-8 pt-3 sm:gap-8 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8">
        <Header />
        <WeatherReport />
      </div>
    </AppProvider>
  )
}

export default App
