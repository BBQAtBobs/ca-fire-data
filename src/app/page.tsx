import {
  departments,
  getTotalStations,
  formatCurrency,
  governanceColors,
  emsColors,
} from "@/data/departments";

function StationDots({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap gap-[3px]">
      {Array.from({ length: Math.min(count, 50) }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
      ))}
    </div>
  );
}

export default function Home() {
  const sorted = [...departments].sort(
    (a, b) => b.top_step_monthly - a.top_step_monthly
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            California Fire
            <br />
            Department Data
          </h1>
          <p className="mt-4 text-stone-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Structured profiles of Northern California fire departments, built
            from official public records. Compare salary, staffing, retirement,
            EMS models, and operations — all source-linked.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <a
              href="/compare"
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium bg-amber-400 text-stone-900 rounded hover:bg-amber-300 transition-colors"
            >
              Compare departments
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <span className="text-xs text-stone-500">
              {departments.length} departments · NorCal pilot
            </span>
          </div>
        </div>
        {/* Decorative grid */}
        <div className="absolute inset-0 z-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>
      </section>

      {/* Department cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
            Departments
          </h2>
          <span className="text-xs text-stone-400">
            Sorted by top-step firefighter salary
          </span>
        </div>

        <div className="grid gap-4">
          {sorted.map((dept) => {
            const totalStations = getTotalStations(dept);
            return (
              <a
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                className="group block bg-white rounded-lg border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all"
              >
                <div className="p-5 sm:p-6">
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`badge ${governanceColors[dept.governance]}`}
                        >
                          {dept.governance_label}
                        </span>
                        <span
                          className={`badge ${emsColors[dept.ems_service_level]}`}
                        >
                          {dept.ems_label}
                        </span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl text-stone-900 group-hover:text-amber-700 transition-colors leading-tight">
                        {dept.name}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">
                        {dept.county} County
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-2xl font-semibold text-stone-900 data-value">
                        {formatCurrency(dept.top_step_monthly)}
                        <span className="text-sm font-normal text-stone-400">
                          /mo
                        </span>
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Top-step FF · {dept.top_step_effective}
                      </div>
                    </div>
                  </div>

                  {/* Data grid */}
                  <div className="mt-5 pt-5 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
                    <div>
                      <div className="source-tag mb-1">Stations</div>
                      <div className="text-lg font-semibold data-value">
                        {totalStations}
                      </div>
                      <div className="mt-1.5">
                        <StationDots count={totalStations} />
                      </div>
                    </div>

                    <div>
                      <div className="source-tag mb-1">Staffing</div>
                      <div className="text-lg font-semibold data-value">
                        {dept.sworn_staffing
                          ? dept.sworn_staffing.toLocaleString()
                          : "—"}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {dept.sworn_staffing_label.includes("authorized")
                          ? "authorized"
                          : dept.sworn_staffing_label.includes("total")
                            ? "total (incl. civilian)"
                            : ""}
                      </div>
                    </div>

                    <div>
                      <div className="source-tag mb-1">Retirement</div>
                      <div className="text-sm font-medium">
                        {dept.retirement_system}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {dept.retirement_formula_current_hire}
                      </div>
                    </div>

                    <div>
                      <div className="source-tag mb-1">Schedule</div>
                      <div className="text-sm font-medium leading-snug">
                        {dept.work_schedule
                          ? dept.work_schedule.split(",")[0]
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-3 bg-stone-50 rounded-b-lg border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {dept.sources.length} official sources
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Extracted {dept.extracted_date}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Methodology */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="rounded-lg bg-white border border-stone-200 p-6 sm:p-8">
          <h2 className="font-display text-lg text-stone-900 mb-3">
            About this data
          </h2>
          <div className="text-sm text-stone-600 leading-relaxed space-y-3 max-w-2xl">
            <p>
              Every field is extracted from official public sources — MOUs, city
              and district budget documents, department websites, and pension
              system publications. Each value links back to its source.
            </p>
            <p>
              Fields that cannot be reliably sourced are left blank rather than
              estimated. Where official sources conflict, both values are
              preserved with the discrepancy noted.
            </p>
            <p className="text-stone-400">
              This is a pilot covering Northern California career fire
              departments. Data reflects conditions at time of extraction and may
              not reflect changes since the source document was published.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
