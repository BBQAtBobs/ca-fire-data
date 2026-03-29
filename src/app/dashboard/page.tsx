import { mockUser } from "@/data/mock-user";
import {
  getDepartment,
  getTotalStations,
  formatCurrency,
} from "@/data/departments";

// ─── Main dashboard ───────────────────────────────────────

export default function DashboardPage() {
  const sortedChanges = [...mockUser.changes].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.date.localeCompare(a.date);
  });

  const unreadCount = mockUser.changes.filter((c) => !c.read).length;

  const sortedCerts = [
    ...mockUser.certifications
      .filter((c) => c.days_remaining >= 0)
      .sort((a, b) => a.days_remaining - b.days_remaining),
    ...mockUser.certifications.filter((c) => c.days_remaining < 0),
  ];

  const urgentCerts = mockUser.certifications.filter(
    (c) => c.days_remaining >= 0 && c.days_remaining <= 90
  );

  return (
    <div>
      {/* ━━━ Urgency bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {urgentCerts.length > 0 && (
        <div className="mb-10 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-red-600">
              Action needed
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {urgentCerts.map((c) => (
              <div key={c.id} className="flex items-baseline gap-2">
                <span className="text-sm text-stone-900 font-medium">{c.name}</span>
                <span className="text-xs text-stone-400">expires</span>
                <span className="text-sm font-semibold data-value text-red-600">
                  {c.days_remaining}d
                </span>
                <span className="text-xs text-stone-400">
                  ({c.expiration_date})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ Changes feed ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="mb-12">
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Changes
          </h2>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold data-value text-amber-600">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="divide-y divide-stone-100">
          {sortedChanges.map((change) => {
            return (
              <div
                key={change.id}
                className={`py-4 first:pt-0 ${!change.read ? "" : "opacity-60"}`}
              >
                <div className="flex items-baseline gap-3">
                  {!change.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 translate-y-[1px]" />
                  )}
                  <a
                    href={`/departments/${change.department_slug}`}
                    className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                  >
                    {change.department_short}
                  </a>
                  <span className="text-[11px] text-stone-400 data-value">
                    {change.date}
                  </span>
                </div>
                <p className={`text-[13px] text-stone-600 leading-relaxed mt-1 ${!change.read ? "ml-[14px]" : ""}`}>
                  {change.message}
                </p>
              </div>
            );
          })}
        </div>

        {sortedChanges.length === 0 && (
          <p className="text-sm text-stone-400 py-8">
            No changes yet. Follow departments to see updates here.
          </p>
        )}
      </section>

      {/* ━━━ Departments table ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Watching
          </h2>
          <button className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors">
            + Follow
          </button>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_100px_60px_100px_120px] gap-4 pb-2 border-b border-stone-200 text-[10px] font-medium uppercase tracking-wider text-stone-400">
          <span>Department</span>
          <span className="text-right">Salary</span>
          <span className="text-right">Stations</span>
          <span>Retirement</span>
          <span>MOU</span>
        </div>

        {/* Department rows */}
        <div className="divide-y divide-stone-100">
          {mockUser.following.map((slug) => {
            const dept = getDepartment(slug);
            if (!dept) return null;

            const totalStations = getTotalStations(dept);
            const app = mockUser.applications.find(
              (a) => a.department_slug === slug
            );
            const mouExpiring =
              dept.mou_status === "current" && dept.mou_term?.includes("2026");

            return (
              <a
                key={slug}
                href={`/departments/${slug}`}
                className="block group"
              >
                {/* Desktop row */}
                <div className="hidden sm:grid grid-cols-[1fr_100px_60px_100px_120px] gap-4 py-3.5 items-baseline group-hover:bg-stone-50/50 -mx-3 px-3 rounded transition-colors">
                  <div>
                    <span className="text-sm font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                      {dept.short_name}
                    </span>
                    <span className="text-xs text-stone-400 ml-2">
                      {dept.county}
                    </span>
                    {app && (
                      <span className="text-[10px] text-stone-400 italic ml-2">
                        — {app.notes?.split(".")[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold data-value text-stone-900 text-right">
                    {formatCurrency(dept.top_step_monthly)}
                  </span>
                  <span className="text-sm data-value text-stone-700 text-right">
                    {totalStations}
                  </span>
                  <div>
                    <span className="text-xs text-stone-700">
                      {dept.retirement_system}
                    </span>
                    <span className="text-[10px] text-stone-400 ml-1">
                      {dept.retirement_formula_current_hire}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {dept.mou_status === "current" && !mouExpiring && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                    {mouExpiring && (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                    {dept.mou_status === "expired" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                    <span className="text-xs text-stone-500 truncate">
                      {mouExpiring ? "Exp. 2026" : dept.mou_status || "—"}
                    </span>
                  </div>
                </div>

                {/* Mobile row */}
                <div className="sm:hidden py-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-semibold text-stone-900">
                        {dept.short_name}
                      </span>
                      <span className="text-xs text-stone-400 ml-2">
                        {dept.county}
                      </span>
                    </div>
                    <span className="text-sm font-semibold data-value text-stone-900">
                      {formatCurrency(dept.top_step_monthly)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                    <span>{totalStations} stations</span>
                    <span>{dept.retirement_system} {dept.retirement_formula_current_hire}</span>
                    <span className="flex items-center gap-1">
                      {mouExpiring ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      )}
                      MOU {mouExpiring ? "exp. 2026" : dept.mou_status}
                    </span>
                  </div>
                  {app && (
                    <p className="text-[11px] text-stone-400 italic mt-1">
                      {app.notes?.split(".")[0]}
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ━━━ Certifications ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Certifications
          </h2>
          <button className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors">
            + Add
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {sortedCerts.map((cert) => {
            const urgent =
              cert.days_remaining >= 0 && cert.days_remaining <= 60;
            const warning =
              cert.days_remaining > 60 && cert.days_remaining <= 90;
            const noExpiry = cert.days_remaining < 0;

            const countdownColor = noExpiry
              ? "text-stone-300"
              : urgent
                ? "text-red-600 font-semibold"
                : warning
                  ? "text-amber-600 font-semibold"
                  : "text-stone-500";

            return (
              <div
                key={cert.id}
                className="flex items-baseline justify-between py-2.5"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="text-sm text-stone-900">{cert.name}</span>
                  <span className="text-[11px] text-stone-400 truncate">
                    {cert.issuer}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 shrink-0 ml-4">
                  {!noExpiry && (
                    <span className="text-[11px] text-stone-400 data-value">
                      {cert.expiration_date}
                    </span>
                  )}
                  <span className={`text-sm data-value ${countdownColor}`}>
                    {noExpiry ? "—" : `${cert.days_remaining}d`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-stone-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Email reminders active at 90, 60, 30 days
        </div>
      </section>

      {/* ━━━ Footer nav ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="pt-6 border-t border-stone-100 flex gap-6 text-xs text-stone-400">
        <a href="/compare" className="hover:text-stone-600 transition-colors">
          Compare
        </a>
        <a href="/" className="hover:text-stone-600 transition-colors">
          Browse
        </a>
        <a
          href="/dashboard/settings"
          className="hover:text-stone-600 transition-colors"
        >
          Settings
        </a>
      </div>
    </div>
  );
}
