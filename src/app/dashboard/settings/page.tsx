import { mockUser } from "@/data/mock-user";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-stone-900 mb-6">Settings</h2>

      {/* Plan */}
      <section className="bg-white rounded-lg border border-stone-200 mb-6">
        <div className="px-5 py-3.5 border-b border-stone-100">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Plan
          </h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-900">
                  Pro Plan
                </span>
                <span className="badge bg-amber-100 text-amber-800 border border-amber-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                $9/month · Renews April 15, 2026
              </p>
            </div>
            <button className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
              Manage billing
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="text-xs font-medium text-stone-500 mb-2">
              Pro includes:
            </div>
            <ul className="space-y-1.5">
              {[
                "Unlimited department follows",
                "Unlimited saved comparisons",
                "Certification tracker with email reminders",
                "Application tracker",
                "Change alerts (weekly digest)",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-stone-600">
                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="bg-white rounded-lg border border-stone-200 mb-6">
        <div className="px-5 py-3.5 border-b border-stone-100">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Account
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Name
            </label>
            <div className="text-sm text-stone-900">{mockUser.name}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              Email
            </label>
            <div className="text-sm text-stone-900">{mockUser.email}</div>
          </div>
        </div>
      </section>

      {/* Notification preferences */}
      <section className="bg-white rounded-lg border border-stone-200 mb-6">
        <div className="px-5 py-3.5 border-b border-stone-100">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Notifications
          </h3>
        </div>
        <div className="divide-y divide-stone-50">
          {[
            {
              title: "Department change alerts",
              description:
                "Get notified when we extract new data for departments you follow",
              enabled: true,
            },
            {
              title: "Certification expiration reminders",
              description: "Email reminders at 90, 60, and 30 days before expiration",
              enabled: true,
            },
            {
              title: "Weekly digest",
              description:
                "Summary of all changes to your followed departments, sent every Monday",
              enabled: false,
            },
          ].map((pref) => (
            <div
              key={pref.title}
              className="px-5 py-4 flex items-start justify-between"
            >
              <div>
                <div className="text-sm font-medium text-stone-900">
                  {pref.title}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  {pref.description}
                </p>
              </div>
              <div
                className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${
                  pref.enabled ? "bg-amber-400" : "bg-stone-200"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    pref.enabled ? "left-4" : "left-0.5"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-lg border border-stone-200 p-5">
        <div className="text-xs font-medium text-stone-400 mb-3">
          Account actions
        </div>
        <div className="flex gap-3">
          <button className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
            Export my data
          </button>
          <span className="text-stone-200">·</span>
          <button className="text-xs text-stone-400 hover:text-red-500 transition-colors">
            Delete account
          </button>
        </div>
      </section>
    </div>
  );
}
