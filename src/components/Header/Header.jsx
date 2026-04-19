import Logo from "./Logo"
import Nav from "./Nav"
import Search from "./Search"

function Header() {
  return (
    <header className="border-b border-white/10 pb-4 sm:pb-5">
      {/* Mobile: logo, then search. sm+: logo · nav · search with space between. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-4">
        <div className="min-w-0 shrink-0">
          <Logo />
        </div>
        <div className="hidden shrink-0 sm:block sm:px-2">
          <Nav />
        </div>
        <div className="w-full min-w-0 sm:max-w-md sm:flex-1 sm:pl-2 lg:max-w-lg">
          <Search />
        </div>
      </div>
    </header>
  )
}

export default Header
