import {
  departments,
  getTotalStations,
  formatCurrency,
  formatNumber,
  governanceColors,
  emsColors,
} from "@/data/departments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Departments — California Fire Data",
  description:
    "Side-by-side comparison of Northern California fire department salary, staffing, retirement, and EMS models.",
};

function SortIndicator() {
  return (
    <svg
      className="inline w-3 h-3 ml-1 opacity-30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
    </svg>
  );
}

export default function ComparePage() {
  // Default sort by salary descending
  const sorted = [...departments].sort(
    (a, b) => b.top_step_monthly - a.top_step_monthly
  );

  // Find min/max for bar scaling
  const maxSalary = Math.max(...departments.map((d) => d.top_step_monthly));
  const maxStations = Math.max(...departments.map((d) => getTotalStations(d)));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl text-stone-900">
          Compare Departments
        </h1>
        <p className="mt-2 text-sm text-stone-500 max-w-xl">
          Side-by-side comparison of core fields across Northern California fire
          departments. All values sourced from official public records.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="compare-table w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="w-[220px]">
                  Department
                  <SortIndicator />
                </th>
                <th>
                  Type
                </th>
                <th>
                  Top-Step FF
                  <SortIndicator />
                </th>
                <th>
                  Stations
                  <SortIndicator />
                </th>
                <th>
                  Staffing
                  <SortIndicator />
                </th>
                <th>
                  Retirement
                </th>
                <th>
                  EMS Model
                </th>
                <th>
                  Schedule
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((dept) => {
                const totalStations = getTotalStations(dept);
                const salaryPct =
                  (dept.top_step_monthly / maxSalary) * 100;
                const stationPct = (totalStations / maxStations) * 100;

                return (
                  <tr key={dept.slug}>
                    {/* Department name */}
                    <td>
                      <a
                        href={`/departments/${dept.slug}`}
                        className="font-medium text-stone-900 hover:text-amber-700 transition-colors"
                      >
                        {dept.short_name}
                      </a>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {dept.county} County
                      </div>
                    </td>

                    {/* Governance type */}
                    <td>
                      <span
                        className={`badge ${governanceColors[dept.governance]}`}
                      >
                        {dept.governance_label}
                      </span>
                    </td>

                    {/* Salary with bar */}
                    <td>
                      <div className="data-value font-semibold text-stone-900">
                        {formatCurrency(dept.top_step_monthly)}
                        <span className="text-xs font-normal text-stone-400">
                          /mo
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 bg-stone-100 rounded-full w-24">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${salaryPct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1">
                        {dept.top_step_effective}
                      </div>
                    </td>

                    {/* Stations with bar */}
                    <td>
                      <div className="data-value font-semibold">
                        {totalStations}
                      </div>
                      <div className="mt-1.5 h-1 bg-stone-100 rounded-full w-20">
                        <div
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${stationPct}%` }}
                        />
                      </div>
                    </td>

                    {/* Staffing */}
                    <td>
                      <div className="data-value font-semibold">
                        {dept.sworn_staffing
                          ? formatNumber(dept.sworn_staffing)
                          : "—"}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5 max-w-[100px] leading-tight">
                        {dept.sworn_staffing_label.includes("authorized")
                          ? "authorized sworn"
                          : dept.sworn_staffing_label.includes("total")
                            ? "total (incl. civilian)"
                            : ""}
                      </div>
                    </td>

                    {/* Retirement */}
                    <td>
                      <div className="text-sm font-medium">
                        {dept.retirement_system}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {dept.retirement_formula_current_hire}
                      </div>
                      {dept.retirement_formula_classic &&
                        dept.retirement_formula_classic !==
                          dept.retirement_formula_current_hire && (
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            Classic: {dept.retirement_formula_classic}
                          </div>
                        )}
                    </td>

                    {/* EMS */}
                    <td>
                      <span
                        className={`badge ${emsColors[dept.ems_service_level]}`}
                      >
                        {dept.ems_label.split(" (")[0]}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td>
                      <div className="text-sm text-stone-700 max-w-[140px] leading-snug">
                        {dept.work_schedule
                          ? dept.work_schedule.split(",")[0].split("(")[0].trim()
                          : "—"}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-400 flex items-center justify-between">
          <span>
            {departments.length} departments · NorCal pilot
          </span>
          <span>
            Salary dates vary by department — check individual profiles for effective dates
          </span>
        </div>
      </div>

      {/* Visual comparison cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {/* Salary comparison */}
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="source-tag mb-4">Top-Step FF Salary</div>
          <div className="space-y-3">
            {sorted.map((dept) => {
              const pct = (dept.top_step_monthly / maxSalary) * 100;
              return (
                <div key={dept.slug}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-medium text-stone-700">
                      {dept.short_name}
                    </span>
                    <span className="text-xs data-value text-stone-500">
                      {formatCurrency(dept.top_step_monthly)}
                    </span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stations comparison */}
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="source-tag mb-4">Station Count</div>
          <div className="space-y-3">
            {[...departments]
              .sort(
                (a, b) => getTotalStations(b) - getTotalStations(a)
              )
              .map((dept) => {
                const total = getTotalStations(dept);
                const pct = (total / maxStations) * 100;
                return (
                  <div key={dept.slug}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs font-medium text-stone-700">
                        {dept.short_name}
                      </span>
                      <span className="text-xs data-value text-stone-500">
                        {total}
                      </span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full">
                      <div
                        className="h-full bg-blue-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Retirement comparison */}
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="source-tag mb-4">Retirement Systems</div>
          <div className="space-y-4">
            {sorted.map((dept) => (
              <div key={dept.slug}>
                <div className="text-xs font-medium text-stone-700 mb-1">
                  {dept.short_name}
                </div>
                <div className="text-sm font-semibold text-stone-900">
                  {dept.retirement_system}
                </div>
                <div className="text-xs text-stone-500">
                  New hire: {dept.retirement_formula_current_hire}
                </div>
                {dept.retirement_formula_classic && (
                  <div className="text-[10px] text-stone-400">
                    Classic: {dept.retirement_formula_classic}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology footnote */}
      <div className="mt-8 text-xs text-stone-400 leading-relaxed max-w-2xl">
        <p>
          Comparison fields are limited to data that is robust and consistently
          sourceable across departments. Salary effective dates vary — see
          individual department profiles for details. Staffing figures may
          represent authorized positions or total employees depending on what
          each department publishes.
        </p>
      </div>
    </div>
  );
}
