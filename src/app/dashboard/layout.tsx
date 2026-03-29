import { mockUser } from "@/data/mock-user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      {/* Dashboard header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold text-stone-900">
            Welcome back, {mockUser.name}
          </h1>
          <p className="text-sm text-stone-400">
            Watching {mockUser.following.length} departments
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
          <a
            href="/dashboard/settings"
            className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-semibold text-stone-600 hover:bg-stone-300 transition-colors"
          >
            {mockUser.name[0]}
          </a>
        </div>
      </div>

      {children}
    </div>
  );
}
