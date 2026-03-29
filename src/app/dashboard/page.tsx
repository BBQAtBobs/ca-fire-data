import { mockUser, stageColors } from "@/data/mock-user";
import {
  getDepartment,
  getTotalStations,
  formatCurrency,
  governanceColors,
  emsColors,
} from "@/data/departments";

// ─── Alert item ────────────────────────────────────────────

function AlertItem({
  icon,
  iconColor,
  children,
  unread = false,
}: {
  icon: "change" | "cert" | "mou";
  iconColor: string;
  children: React.ReactNode;
  unread?: boolean;
}) {
  const icons = {
    change: "M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z",
    cert: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    mou: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-colors ${
        unread ? "bg-amber-50/60 border border-amber-100" : "bg-white border border-stone-100"
      }`}
    >
      <div className={`mt-0.5 shrink-0 ${iconColor}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d={icons[icon]} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0 flex-1 text-sm">{children}</div>
      {unread && <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />}
    </div>
  );
}

// ─── Department card ───────────────────────────────────────

function DepartmentCard({ slug }: { slug: string }) {
  const dept = getDepartment(slug);
  if (!dept) return null;

  const app = mockUser.applications.find((a) => a.department_slug === slug);
  const changes = mockUser.changes.filter(
    (c) => c.department_slug === slug && !c.read
  );
  const totalStations = getTotalStations(dept);

  // MOU status display
  const mouExpiring =
    dept.mou_status === "current" && dept.mou_term?.includes("2026");

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <a
              href={`/departments/${slug}`}
              className="font-display text-lg text-stone-900 hover:text-amber-700 transition-colors"
            >
              {dept.name}
            </a>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-stone-400">{dept.county} County</span>
              <span className={`badge ${governanceColors[dept.governance]}`}>
                {dept.governance_label}
              </span>
            </div>
          </div>
          {/* Status dropdown */}
          <div>
            {app ? (
              <span className={`badge ${stageColors[app.stage]}`}>
                {app.stage_label}
              </span>
            ) : (
              <span className="badge bg-stone-100 text-stone-500">Watching</span>
            )}
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-4 gap-4 py-3 border-t border-b border-stone-50">
          <div>
            <div className="source-tag mb-0.5">Salary</div>
            <div className="text-base font-semibold data-value">
              {formatCurrency(dept.top_step_monthly)}
              <span className="text-[10px] font-normal text-stone-400">/mo</span>
            </div>
          </div>
          <div>
            <div className="source-tag mb-0.5">Stations</div>
            <div className="text-base font-semibold data-value">{totalStations}</div>
          </div>
          <div>
            <div className="source-tag mb-0.5">Retirement</div>
            <div className="text-xs font-medium text-stone-700">
              {dept.retirement_system}
            </div>
            <div className="text-[10px] text-stone-400">
              {dept.retirement_formula_current_hire}
            </div>
          </div>
          <div>
            <div className="source-tag mb-0.5">EMS</div>
            <div className="text-xs font-medium text-stone-700">
              {dept.ems_label.split(" (")[0]}
            </div>
          </div>
        </div>

        {/* MOU status line */}
        <div className="mt-3 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs text-stone-500">
            MOU {dept.mou_term || "term unknown"}
          </span>
          {dept.mou_status === "current" && !mouExpiring && (
            <span className="text-[10px] font-medium text-emerald-600">current</span>
          )}
          {mouExpiring && (
            <span className="text-[10px] font-medium text-amber-600">
              expiring this year
            </span>
          )}
          {dept.mou_status === "expired" && (
            <span className="text-[10px] font-medium text-red-600">expired</span>
          )}
        </div>

        {/* Recent changes inline */}
        {changes.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {changes.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-2 px-3 py-2 rounded bg-amber-50/60 border border-amber-100"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-amber-600">{c.date}</span>
                  <p className="text-xs text-amber-800 leading-relaxed">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* App notes */}
        {app?.notes && (
          <div className="mt-3 px-3 py-2 rounded bg-stone-50 border border-stone-100">
            <p className="text-xs text-stone-500 leading-relaxed">{app.notes}</p>
            <span className="text-[10px] text-stone-400">Updated {app.updated}</span>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[10px] text-stone-400">
          Last extracted {dept.extracted_date}
        </span>
        <a
          href={`/departments/${slug}`}
          className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors"
        >
          Full profile →
        </a>
      </div>
    </div>
  );
}

// ─── Readiness sidebar ─────────────────────────────────────

function ReadinessBar({
  cert,
}: {
  cert: (typeof mockUser.certifications)[0];
}) {
  const maxDays = 365;
  const pct =
    cert.days_remaining < 0
      ? 100
      : Math.min((cert.days_remaining / maxDays) * 100, 100);
  const urgent = cert.days_remaining >= 0 && cert.days_remaining <= 60;
  const warning =
    cert.days_remaining >= 0 &&
    cert.days_remaining > 60 &&
    cert.days_remaining <= 90;

  const barColor =
    cert.days_remaining < 0
      ? "bg-stone-300"
      : urgent
        ? "bg-red-400"
        : warning
          ? "bg-amber-400"
          : "bg-emerald-400";

  const textColor =
    cert.days_remaining < 0
      ? "text-stone-400"
      : urgent
        ? "text-red-600"
        : warning
          ? "text-amber-600"
          : "text-stone-600";

  return (
    <div className="py-2.5">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium text-stone-900">{cert.name}</span>
        <span className={`text-xs font-semibold data-value ${textColor}`}>
          {cert.days_remaining < 0 ? "—" : `${cert.days_remaining}d`}
        </span>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-stone-400">{cert.issuer}</span>
        <span className="text-[10px] text-stone-400">
          {cert.days_remaining < 0
            ? "No expiration"
            : `exp ${cert.expiration_date}`}
        </span>
      </div>
    </div>
  );
}

// ─── Main dashboard ────────────────────────────────────────

export default function DashboardPage() {
  const unreadChanges = mockUser.changes.filter((c) => !c.read);
  const expiringCerts = mockUser.certifications
    .filter((c) => c.days_remaining >= 0 && c.days_remaining <= 90)
    .sort((a, b) => a.days_remaining - b.days_remaining);

  const allCertsSorted = [
    ...mockUser.certifications
      .filter((c) => c.days_remaining >= 0)
      .sort((a, b) => a.days_remaining - b.days_remaining),
    ...mockUser.certifications.filter((c) => c.days_remaining < 0),
  ];

  const hasAlerts = unreadChanges.length > 0 || expiringCerts.length > 0;

  return (
    <div>
      {/* Alerts section — only when there's something to show */}
      {hasAlerts && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Needs Attention
          </h2>
          <div className="space-y-2">
            {expiringCerts.map((cert) => (
              <AlertItem
                key={cert.id}
                icon="cert"
                iconColor={cert.days_remaining <= 60 ? "text-red-500" : "text-amber-500"}
                unread
              >
                <span className="font-medium text-stone-900">{cert.name}</span>
                {" "}expires in{" "}
                <span className={`font-semibold ${cert.days_remaining <= 60 ? "text-red-600" : "text-amber-600"}`}>
                  {cert.days_remaining} days
                </span>
                <span className="text-stone-400"> ({cert.expiration_date})</span>
              </AlertItem>
            ))}
            {unreadChanges.map((change) => (
              <AlertItem
                key={change.id}
                icon="change"
                iconColor="text-blue-500"
                unread
              >
                <span className="font-medium text-stone-900">{change.department_short}</span>
                <span className="text-stone-400 mx-1">·</span>
                <span className="text-stone-400 text-xs">{change.date}</span>
                <br />
                <span className="text-stone-600">{change.message}</span>
              </AlertItem>
            ))}
          </div>
        </section>
      )}

      {/* Two-pillar layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left: Department Watch */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Your Departments
            </h2>
            <button className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              Follow a department
            </button>
          </div>
          <div className="space-y-4">
            {mockUser.following.map((slug) => (
              <DepartmentCard key={slug} slug={slug} />
            ))}
          </div>
        </div>

        {/* Right: Readiness */}
        <div>
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Your Readiness
          </h2>

          {/* Cert timeline */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-4">
            <div className="divide-y divide-stone-50">
              {allCertsSorted.map((cert) => (
                <ReadinessBar key={cert.id} cert={cert} />
              ))}
            </div>
            <button className="mt-3 w-full py-2 rounded border border-dashed border-stone-200 text-xs text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors">
              + Add certification
            </button>
          </div>

          {/* Reminder status */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 mb-4">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="text-xs font-medium text-stone-700">
                  Email reminders active
                </div>
                <p className="text-[10px] text-stone-400 leading-relaxed mt-0.5">
                  You&apos;ll hear from us at 90, 60, and 30 days before each cert expires.
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <div className="source-tag mb-3">Quick Links</div>
            <div className="space-y-2">
              <a
                href="/compare"
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Compare departments
              </a>
              <a
                href="/"
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Browse all departments
              </a>
              <a
                href="/dashboard/settings"
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Settings & notifications
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
