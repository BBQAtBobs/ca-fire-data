import { mockUser, stageOrder, stageColors } from "@/data/mock-user";

export default function ApplicationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">
            Applications
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Track your fire department application progress
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Add application
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {stageOrder.map((stage) => {
          const apps = mockUser.applications.filter((a) => a.stage === stage);
          const stageLabel = stage.charAt(0).toUpperCase() + stage.slice(1);

          return (
            <div key={stage} className="min-w-0">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`w-2 h-2 rounded-full ${stageColors[stage].split(" ")[0]}`} />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider truncate">
                  {stageLabel}
                </span>
                {apps.length > 0 && (
                  <span className="text-[10px] text-stone-400 font-medium">
                    {apps.length}
                  </span>
                )}
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[120px]">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg border border-stone-200 p-3 hover:shadow-sm hover:border-stone-300 transition-all cursor-grab"
                  >
                    <a
                      href={`/departments/${app.department_slug}`}
                      className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                    >
                      {app.department_short}
                    </a>
                    {app.notes && (
                      <p className="text-xs text-stone-500 mt-1.5 leading-relaxed line-clamp-3">
                        {app.notes}
                      </p>
                    )}
                    <div className="text-[10px] text-stone-400 mt-2">
                      {app.updated}
                    </div>
                  </div>
                ))}

                {apps.length === 0 && (
                  <div className="rounded-lg border border-dashed border-stone-200 p-4 flex items-center justify-center">
                    <span className="text-xs text-stone-300">
                      Drop here
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* List view */}
      <section className="bg-white rounded-lg border border-stone-200">
        <div className="px-5 py-3.5 border-b border-stone-100">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            All Applications
          </h3>
        </div>
        <div className="divide-y divide-stone-50">
          {mockUser.applications.map((app) => (
            <div
              key={app.id}
              className="px-5 py-4 flex items-start justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={`/departments/${app.department_slug}`}
                    className="text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                  >
                    {app.department_name}
                  </a>
                  <span className={`badge ${stageColors[app.stage]}`}>
                    {app.stage_label}
                  </span>
                </div>
                {app.notes && (
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {app.notes}
                  </p>
                )}
              </div>
              <div className="text-xs text-stone-400 shrink-0 ml-4">
                Updated {app.updated}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
