import { mockUser, stageColors } from "@/data/mock-user";
import { getDepartment, formatCurrency } from "@/data/departments";

function ChangeCard({
  change,
}: {
  change: (typeof mockUser.changes)[0];
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        change.read
          ? "border-stone-100 bg-white"
          : "border-amber-200 bg-amber-50/50"
      }`}
    >
      {!change.read && (
        <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <a
            href={`/departments/${change.department_slug}`}
            className="text-xs font-semibold text-stone-900 hover:text-amber-700 transition-colors"
          >
            {change.department_short}
          </a>
          <span className="text-[10px] text-stone-400">{change.date}</span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          {change.message}
        </p>
      </div>
    </div>
  );
}

function CertCountdown({
  cert,
}: {
  cert: (typeof mockUser.certifications)[0];
}) {
  if (cert.days_remaining < 0) return null; // no expiration

  const urgent = cert.days_remaining <= 60;
  const warning = cert.days_remaining <= 90 && cert.days_remaining > 60;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-stone-900">{cert.name}</div>
        <div className="text-xs text-stone-400">{cert.issuer}</div>
      </div>
      <div className="text-right">
        <div
          className={`text-sm font-semibold data-value ${
            urgent
              ? "text-red-600"
              : warning
                ? "text-amber-600"
                : "text-stone-600"
          }`}
        >
          {cert.days_remaining}d
        </div>
        <div className="text-[10px] text-stone-400">
          {cert.expiration_date}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const unreadChanges = mockUser.changes.filter((c) => !c.read);
  const expiringCerts = mockUser.certifications
    .filter((c) => c.days_remaining > 0 && c.days_remaining <= 180)
    .sort((a, b) => a.days_remaining - b.days_remaining);
  const activeApps = mockUser.applications.filter(
    (a) => a.stage !== "researching"
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column: Changes + Applications */}
      <div className="lg:col-span-2 space-y-6">
        {/* Recent Changes */}
        <section className="bg-white rounded-lg border border-stone-200">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Recent Changes
            </h2>
            {unreadChanges.length > 0 && (
              <span className="badge bg-amber-100 text-amber-800">
                {unreadChanges.length} new
              </span>
            )}
          </div>
          <div className="p-4 space-y-2">
            {mockUser.changes.map((change) => (
              <ChangeCard key={change.id} change={change} />
            ))}
          </div>
        </section>

        {/* Following */}
        <section className="bg-white rounded-lg border border-stone-200">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Following
            </h2>
            <a
              href="/dashboard/following"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="p-4 grid gap-3 sm:grid-cols-3">
            {mockUser.following.map((slug) => {
              const dept = getDepartment(slug);
              if (!dept) return null;
              return (
                <a
                  key={slug}
                  href={`/departments/${slug}`}
                  className="group p-4 rounded-lg border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all"
                >
                  <div className="text-sm font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                    {dept.short_name}
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {dept.county} County
                  </div>
                  <div className="mt-3 text-lg font-semibold data-value text-stone-900">
                    {formatCurrency(dept.top_step_monthly)}
                    <span className="text-xs font-normal text-stone-400">
                      /mo
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {dept.retirement_system} · {dept.retirement_formula_current_hire}
                  </div>
                </a>
              );
            })}
            <button className="p-4 rounded-lg border border-dashed border-stone-200 hover:border-stone-300 transition-colors flex flex-col items-center justify-center text-stone-400 hover:text-stone-600">
              <svg
                className="w-5 h-5 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-medium">Follow</span>
            </button>
          </div>
        </section>

        {/* Active Applications */}
        <section className="bg-white rounded-lg border border-stone-200">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Applications
            </h2>
            <a
              href="/dashboard/applications"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="divide-y divide-stone-50">
            {mockUser.applications.map((app) => (
              <div key={app.id} className="px-5 py-4 flex items-start justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={`/departments/${app.department_slug}`}
                      className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                    >
                      {app.department_short}
                    </a>
                    <span className={`badge ${stageColors[app.stage]}`}>
                      {app.stage_label}
                    </span>
                  </div>
                  {app.notes && (
                    <p className="text-xs text-stone-500 leading-relaxed max-w-md">
                      {app.notes}
                    </p>
                  )}
                </div>
                <div className="text-[10px] text-stone-400 shrink-0 ml-4">
                  Updated {app.updated}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right column: Certs + Comparisons */}
      <div className="space-y-6">
        {/* Cert expirations */}
        <section className="bg-white rounded-lg border border-stone-200">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Upcoming Expirations
            </h2>
            <a
              href="/dashboard/certs"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              All certs →
            </a>
          </div>
          <div className="p-4">
            {expiringCerts.length > 0 ? (
              expiringCerts.map((cert) => (
                <CertCountdown key={cert.id} cert={cert} />
              ))
            ) : (
              <p className="text-sm text-stone-400 py-2">
                No certs expiring in the next 180 days
              </p>
            )}
          </div>
        </section>

        {/* Saved comparisons */}
        <section className="bg-white rounded-lg border border-stone-200">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Saved Comparisons
            </h2>
            <a
              href="/dashboard/comparisons"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="p-4 space-y-2">
            {mockUser.comparisons.map((comp) => (
              <a
                key={comp.id}
                href="/compare"
                className="block p-3 rounded-lg border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all"
              >
                <div className="text-sm font-medium text-stone-900">
                  {comp.name}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  {comp.department_slugs.length} departments · Created{" "}
                  {comp.created}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Quick stats */}
        <section className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="source-tag mb-3">Your Activity</div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-stone-600">Departments followed</span>
              <span className="text-sm font-semibold data-value">{mockUser.following.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-600">Active applications</span>
              <span className="text-sm font-semibold data-value">{activeApps.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-600">Certifications tracked</span>
              <span className="text-sm font-semibold data-value">{mockUser.certifications.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-stone-600">Saved comparisons</span>
              <span className="text-sm font-semibold data-value">{mockUser.comparisons.length}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
