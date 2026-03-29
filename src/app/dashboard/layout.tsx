import { mockUser } from "@/data/mock-user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Dashboard header — tight, operational */}
      <div className="flex items-baseline justify-between mb-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-base font-semibold text-stone-900 tracking-tight">
            {mockUser.name}
          </h1>
          <span className="text-xs text-stone-400">
            {mockUser.following.length} departments
          </span>
        </div>
        <div className="flex items-center gap-3">
          {mockUser.plan === "pro" && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
              Pro
            </span>
          )}
          <a
            href="/dashboard/settings"
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            Settings
          </a>
        </div>
      </div>

      {children}
    </div>
  );
}
