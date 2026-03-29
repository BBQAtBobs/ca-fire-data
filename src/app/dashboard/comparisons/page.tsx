import { mockUser } from "@/data/mock-user";
import { getDepartment, formatCurrency } from "@/data/departments";

export default function ComparisonsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            Saved Comparisons
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Named comparison lists you&apos;ve saved for quick access
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New comparison
        </button>
      </div>

      <div className="grid gap-4">
        {mockUser.comparisons.map((comp) => {
          const depts = comp.department_slugs
            .map(getDepartment)
            .filter(Boolean);

          return (
            <div
              key={comp.id}
              className="bg-white rounded-lg border border-stone-200"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {depts.length} departments · Created {comp.created}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/compare"
                      className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                    >
                      Open comparison →
                    </a>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {depts.map((dept) => {
                    if (!dept) return null;
                    return (
                      <div
                        key={dept.slug}
                        className="p-3 rounded border border-stone-100 bg-stone-50/50"
                      >
                        <div className="text-sm font-medium text-stone-900">
                          {dept.short_name}
                        </div>
                        <div className="text-xs text-stone-400">
                          {dept.county} County
                        </div>
                        <div className="mt-2 text-base font-semibold data-value">
                          {formatCurrency(dept.top_step_monthly)}
                          <span className="text-xs font-normal text-stone-400">
                            /mo
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
