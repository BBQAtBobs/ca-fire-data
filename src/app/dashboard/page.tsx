import { mockUser } from "@/data/mock-user";
import {
  getDepartment,
  getTotalStations,
  formatCurrency,
  governanceColors,
} from "@/data/departments";

// ─── Change feed item ─────────────────────────────────────

function ChangeItem({
  change,
}: {
  change: (typeof mockUser.changes)[0];
}) {
  const dept = getDepartment(change.department_slug);

  return (
    <div
      className={`flex gap-4 px-5 py-4 rounded-lg transition-colors ${
        change.read
          ? "bg-white border border-stone-100"
          : "bg-amber-50/50 border border-amber-100"
      }`}
    >
      {/* Unread indicator */}
      <div className="pt-2 shrink-0">
        {!change.read ? (
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-stone-200" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <a
            href={`/departments/${change.department_slug}`}
            className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
          >
            {change.department_short}
          </a>
          <span className="text-[10px] text-stone-400">{change.date}</span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          {change.message}
        </p>
        {dept && (
          <a
            href={`/departments/${change.department_slug}`}
            className="inline-block mt-2 text-[10px] text-stone-400 hover:text-amber-700 transition-colors"
          >
            View profile →
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Compact department card ──────────────────────────────

function WatchedDepartment({ slug }: { slug: string }) {
  const dept = getDepartment(slug);
  if (!dept) return null;

  const totalStations = getTotalStations(dept);
  const app = mockUser.applications.find((a) => a.department_slug === slug);
  const mouExpiring =
    dept.mou_status === "current" && dept.mou_term?.includes("2026");

  return (
    <a
      href={`/departments/${slug}`}
      className="block bg-white rounded-lg border border-stone-200 p-4 hover:border-amber-200 hover:shadow-sm transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
            {dept.short_name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-stone-400">{dept.county} County</span>
            <span className={`badge text-[9px] px-1.5 py-0 ${governanceColors[dept.governance]}`}>
              {dept.governance_label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-semibold data-value text-stone-900">
            {formatCurrency(dept.top_step_monthly)}
            <span className="text-[10px] font-normal text-stone-400">/mo</span>
          </div>
        </div>
      </div>

      {/* Compact metrics */}
      <div className="flex items-center gap-4 text-[11px] text-stone-500 mb-2">
        <span>{totalStations} stations</span>
        <span className="text-stone-200">|</span>
        <span>{dept.retirement_system} {dept.retirement_formula_current_hire}</span>
        <span className="text-stone-200">|</span>
        <span>{dept.ems_label.split(" (")[0]}</span>
      </div>

      {/* MOU + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-400">
            MOU {dept.mou_term || "unknown"}
          </span>
          {dept.mou_status === "current" && !mouExpiring && (
            <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">current</span>
          )}
          {mouExpiring && (
            <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">expiring</span>
          )}
        </div>
        {app && (
          <span className="text-[10px] text-stone-400 italic">
            {app.notes?.split(".")[0]}
          </span>
        )}
      </div>
    </a>
  );
}

// ─── Cert urgency item ────────────────────────────────────

function CertItem({ cert }: { cert: (typeof mockUser.certifications)[0] }) {
  const urgent = cert.days_remaining >= 0 && cert.days_remaining <= 60;
  const warning = cert.days_remaining > 60 && cert.days_remaining <= 90;
  const noExpiry = cert.days_remaining < 0;

  const dotColor = noExpiry
    ? "bg-stone-300"
    : urgent
      ? "bg-red-400"
      : warning
        ? "bg-amber-400"
        : "bg-emerald-400";

  const textColor = noExpiry
    ? "text-stone-400"
    : urgent
      ? "text-red-600"
      : warning
        ? "text-amber-600"
        : "text-stone-500";

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        <span className="text-xs text-stone-700 truncate">{cert.name}</span>
      </div>
      <span className={`text-xs font-medium data-value shrink-0 ml-3 ${textColor}`}>
        {noExpiry ? "No exp." : `${cert.days_remaining}d`}
      </span>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────

export default function DashboardPage() {
  // Sort changes: unread first, then by date descending
  const sortedChanges = [...mockUser.changes].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.date.localeCompare(a.date);
  });

  const unreadCount = mockUser.changes.filter((c) => !c.read).length;

  // Sort certs: urgency first
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
      {/* ─── Urgency strip — compact, always visible ─── */}
      {urgentCerts.length > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50/60 border border-red-100">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-xs text-red-700">
            {urgentCerts.map((c, i) => (
              <span key={c.id}>
                {i > 0 && <span className="text-red-300 mx-1.5">·</span>}
                <span className="font-medium">{c.name}</span> expires in{" "}
                <span className="font-semibold">{c.days_remaining}d</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── Two-column: Feed + Sidebar ─── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* ─── Main column: Changes feed ─── */}
        <div>
          {/* Feed header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Changes
              </h2>
              {unreadCount > 0 && (
                <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Changes list */}
          <div className="space-y-3 mb-10">
            {sortedChanges.map((change) => (
              <ChangeItem key={change.id} change={change} />
            ))}

            {/* Empty state */}
            {sortedChanges.length === 0 && (
              <div className="text-center py-12 text-sm text-stone-400">
                No changes yet. Follow departments to see updates here.
              </div>
            )}
          </div>

          {/* ─── Watched departments ─── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Watching
              </h2>
              <button className="inline-flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-600 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Follow
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {mockUser.following.map((slug) => (
                <WatchedDepartment key={slug} slug={slug} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── Sidebar: At a Glance ─── */}
        <div className="space-y-5">
          {/* Certifications — compact list */}
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                Certifications
              </h3>
              <span className="text-[10px] text-stone-400">
                {mockUser.certifications.length} tracked
              </span>
            </div>
            <div className="divide-y divide-stone-50">
              {sortedCerts.map((cert) => (
                <CertItem key={cert.id} cert={cert} />
              ))}
            </div>
            <button className="mt-3 w-full py-1.5 rounded border border-dashed border-stone-200 text-[10px] text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors">
              + Add
            </button>
          </div>

          {/* Reminders status — minimal */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-stone-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[10px] text-stone-500">
              Email reminders active — 90, 60, 30 day alerts
            </span>
          </div>

          {/* Quick nav */}
          <div className="px-4 py-3 bg-white rounded-lg border border-stone-200">
            <div className="space-y-2">
              <a
                href="/compare"
                className="flex items-center gap-2 text-xs text-stone-500 hover:text-amber-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 10h4v11H3zm7-4h4v15h-4zm7-3h4v18h-4z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Compare departments
              </a>
              <a
                href="/"
                className="flex items-center gap-2 text-xs text-stone-500 hover:text-amber-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Browse all
              </a>
              <a
                href="/dashboard/settings"
                className="flex items-center gap-2 text-xs text-stone-500 hover:text-amber-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
