import { mockUser } from "@/data/mock-user";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/following", label: "Following", icon: "heart" },
  { href: "/dashboard/comparisons", label: "Comparisons", icon: "columns" },
  { href: "/dashboard/certs", label: "Certifications", icon: "shield" },
  { href: "/dashboard/applications", label: "Applications", icon: "clipboard" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

function NavIcon({ icon }: { icon: string }) {
  const paths: Record<string, string> = {
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z",
    columns: "M12 3v18M3 3h18v18H3z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  };
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d={paths[icon] || paths.grid} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Dashboard header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">
            Welcome back, {mockUser.name}
          </h1>
          <p className="text-sm text-stone-400">
            {mockUser.following.length} departments followed ·{" "}
            {mockUser.applications.filter((a) => a.stage !== "researching").length} active applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          {mockUser.plan === "pro" ? (
            <span className="badge bg-amber-100 text-amber-800 border border-amber-200">
              Pro
            </span>
          ) : (
            <a
              href="/dashboard/settings"
              className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
            >
              Upgrade to Pro
            </a>
          )}
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-semibold text-stone-600">
            {mockUser.name[0]}
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex gap-1 mb-8 overflow-x-auto pb-1 border-b border-stone-200">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-t transition-colors whitespace-nowrap"
          >
            <NavIcon icon={item.icon} />
            {item.label}
          </a>
        ))}
      </nav>

      {children}
    </div>
  );
}
