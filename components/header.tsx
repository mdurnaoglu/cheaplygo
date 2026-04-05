const navItems = ["Trip Planner", "Smart Trips", "How It Works", "Inspiration"];

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-6 lg:px-8">
      <div className="flex items-center text-[1.75rem] font-extrabold tracking-[-0.05em] text-slateBlue">
        cheaplygo
        <span className="ml-1 inline-block h-3 w-3 rounded-full bg-chartreuse" />
      </div>

      <nav className="hidden items-center gap-10 text-sm font-semibold text-ink/80 lg:flex">
        {navItems.map((item, index) => (
          <a
            key={item}
            href={
              item === "Trip Planner"
                ? "/planner"
                : item === "Smart Trips"
                  ? "#smart-trips"
                  : item === "How It Works"
                    ? "#how-it-works"
                    : "#inspiration"
            }
            className={`transition hover:text-ink ${
              index === 0 ? "text-ink" : ""
            }`}
          >
            <span className="relative">
              {item}
              {index === 0 ? (
                <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-chartreuse" />
              ) : null}
            </span>
          </a>
        ))}
      </nav>

      <a
        href="/planner"
        className="inline-flex items-center rounded-full bg-chartreuse px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
      >
        Plan My Trip
      </a>
    </header>
  );
}
