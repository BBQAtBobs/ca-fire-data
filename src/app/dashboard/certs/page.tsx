import { mockUser } from "@/data/mock-user";

function progressColor(days: number): string {
  if (days < 0) return "bg-stone-300"; // no expiration
  if (days <= 30) return "bg-red-500";
  if (days <= 60) return "bg-red-400";
  if (days <= 90) return "bg-amber-400";
  return "bg-emerald-400";
}

function statusLabel(days: number): { text: string; color: string } {
  if (days < 0) return { text: "No expiration", color: "text-stone-400" };
  if (days <= 30) return { text: "Expiring soon", color: "text-red-600" };
  if (days <= 60) return { text: "Expiring soon", color: "text-red-500" };
  if (days <= 90) return { text: "Renew soon", color: "text-amber-600" };
  return { text: "Active", color: "text-emerald-600" };
}

export default function CertsPage() {
  const withExpiration = mockUser.certifications
    .filter((c) => c.days_remaining >= 0)
    .sort((a, b) => a.days_remaining - b.days_remaining);
  const noExpiration = mockUser.certifications.filter(
    (c) => c.days_remaining < 0
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            Certifications
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Track your certifications and get reminders before they expire
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Add certification
        </button>
      </div>

      {/* Expiration timeline */}
      <section className="bg-white rounded-lg border border-stone-200 mb-6">
        <div className="px-5 py-3.5 border-b border-stone-100">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Expiration Timeline
          </h3>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {withExpiration.map((cert) => {
              const maxDays = 365;
              const pct = Math.min(
                (cert.days_remaining / maxDays) * 100,
                100
              );
              const status = statusLabel(cert.days_remaining);

              return (
                <div key={cert.id}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-stone-900">
                        {cert.name}
                      </span>
                      <span className="text-xs text-stone-400 ml-2">
                        {cert.issuer}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${status.color}`}>
                        {cert.days_remaining}d remaining
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${progressColor(cert.days_remaining)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 w-20 text-right shrink-0">
                      exp {cert.expiration_date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cert detail cards */}
      <section className="bg-white rounded-lg border border-stone-200 mb-6">
        <div className="px-5 py-3.5 border-b border-stone-100">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            All Certifications
          </h3>
        </div>
        <div className="divide-y divide-stone-50">
          {[...withExpiration, ...noExpiration].map((cert) => {
            const status = statusLabel(cert.days_remaining);
            return (
              <div key={cert.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-900">
                      {cert.name}
                    </span>
                    <span className={`text-[10px] font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {cert.issuer} · Issued {cert.issued_date}
                  </div>
                </div>
                <div className="text-right">
                  {cert.days_remaining >= 0 ? (
                    <>
                      <div className={`text-sm font-semibold data-value ${
                        cert.days_remaining <= 90 ? "text-amber-600" : "text-stone-700"
                      }`}>
                        {cert.days_remaining} days
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {cert.expiration_date}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-stone-400">No expiration</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reminder settings callout */}
      <div className="rounded-lg bg-stone-50 border border-stone-200 p-5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-stone-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div className="text-sm font-medium text-stone-900">
              Email reminders active
            </div>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
              You&apos;ll receive email reminders at 90, 60, and 30 days before each
              certification expires. Manage in{" "}
              <a
                href="/dashboard/settings"
                className="text-amber-700 hover:text-amber-900 transition-colors"
              >
                Settings
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
