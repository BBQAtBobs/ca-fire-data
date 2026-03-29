import { mockUser } from "@/data/mock-user";
import {
  getDepartment,
  getTotalStations,
  formatCurrency,
  governanceColors,
  emsColors,
} from "@/data/departments";

export default function FollowingPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Following</h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Departments you&apos;re tracking. You&apos;ll be notified when we detect changes.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockUser.following.map((slug) => {
          const dept = getDepartment(slug);
          if (!dept) return null;
          const totalStations = getTotalStations(dept);
          const recentChange = mockUser.changes.find(
            (c) => c.department_slug === slug && !c.read
          );

          return (
            <div
              key={slug}
              className="bg-white rounded-lg border border-stone-200"
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`badge ${governanceColors[dept.governance]}`}>
                        {dept.governance_label}
                      </span>
                      <span className={`badge ${emsColors[dept.ems_service_level]}`}>
                        {dept.ems_label}
                      </span>
                      {recentChange && (
                        <span className="badge bg-amber-100 text-amber-800 border border-amber-200">
                          New update
                        </span>
                      )}
                    </div>
                    <a
                      href={`/departments/${slug}`}
                      className="font-display text-xl text-stone-900 hover:text-amber-700 transition-colors"
                    >
                      {dept.name}
                    </a>
                    <p className="text-sm text-stone-500 mt-0.5">
                      {dept.county} County
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                    <div className="text-xl font-semibold data-value text-stone-900">
                      {formatCurrency(dept.top_step_monthly)}
                      <span className="text-xs font-normal text-stone-400">/mo</span>
                    </div>
                    <button className="text-xs text-stone-400 hover:text-red-500 transition-colors">
                      Unfollow
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
                  <div>
                    <div className="source-tag mb-0.5">Stations</div>
                    <div className="text-sm font-semibold data-value">{totalStations}</div>
                  </div>
                  <div>
                    <div className="source-tag mb-0.5">Staffing</div>
                    <div className="text-sm font-semibold data-value">
                      {dept.sworn_staffing?.toLocaleString() || "—"}
                    </div>
                  </div>
                  <div>
                    <div className="source-tag mb-0.5">Retirement</div>
                    <div className="text-sm font-medium">
                      {dept.retirement_system} — {dept.retirement_formula_current_hire}
                    </div>
                  </div>
                  <div>
                    <div className="source-tag mb-0.5">Schedule</div>
                    <div className="text-sm font-medium leading-snug">
                      {dept.work_schedule?.split(",")[0] || "—"}
                    </div>
                  </div>
                </div>

                {recentChange && (
                  <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-[10px] text-amber-600 font-medium">
                        {recentChange.date}
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {recentChange.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-5 py-3 bg-stone-50 rounded-b-lg border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Last extracted {dept.extracted_date}
                </span>
                <a
                  href={`/departments/${slug}`}
                  className="text-[11px] text-stone-400 hover:text-stone-600 transition-colors"
                >
                  View full profile →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
