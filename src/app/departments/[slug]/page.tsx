import { notFound } from "next/navigation";
import {
  departments,
  getDepartment,
  getTotalStations,
  formatCurrency,
  formatNumber,
  governanceColors,
  emsColors,
} from "@/data/departments";
import type { Department, SourceLink } from "@/data/departments";

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) return { title: "Not Found" };
  return {
    title: `${dept.name} — California Fire Data`,
    description: `Salary, staffing, retirement, EMS model, and operations data for ${dept.name}. Source-linked from official public records.`,
  };
}

function DataCard({
  label,
  children,
  note,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      <div className="source-tag mb-1.5">{label}</div>
      <div>{children}</div>
      {note && (
        <p className="mt-2 text-xs text-stone-400 leading-relaxed">{note}</p>
      )}
    </div>
  );
}

function SourcePill({ source }: { source: SourceLink }) {
  const typeColors: Record<string, string> = {
    mou: "border-blue-200 text-blue-700 bg-blue-50",
    budget: "border-emerald-200 text-emerald-700 bg-emerald-50",
    salary: "border-amber-200 text-amber-700 bg-amber-50",
    retirement: "border-purple-200 text-purple-700 bg-purple-50",
    website: "border-stone-200 text-stone-600 bg-stone-50",
    careers: "border-rose-200 text-rose-700 bg-rose-50",
  };
  const color = typeColors[source.type || "website"] || typeColors.website;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-medium hover:shadow-sm transition-shadow ${color}`}
    >
      <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {source.label}
    </a>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-lg border border-stone-200">
      <div className="px-5 sm:px-6 py-3.5 border-b border-stone-100">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) notFound();

  const totalStations = getTotalStations(dept);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone-400 mb-6">
        <a href="/" className="hover:text-stone-600 transition-colors">
          Departments
        </a>
        <span className="mx-2">/</span>
        <span className="text-stone-600">{dept.short_name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`badge ${governanceColors[dept.governance]}`}>
            {dept.governance_label}
          </span>
          <span className={`badge ${emsColors[dept.ems_service_level]}`}>
            {dept.ems_label}
          </span>
          <span className="badge bg-stone-100 text-stone-600">
            {dept.county} County
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
          {dept.name}
        </h1>
        {dept.jurisdiction_note && (
          <p className="mt-2 text-sm text-stone-500 max-w-2xl leading-relaxed">
            {dept.jurisdiction_note}
          </p>
        )}
      </div>

      {/* Key metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Top-Step FF",
            value: `${formatCurrency(dept.top_step_monthly)}/mo`,
            sub: dept.top_step_effective,
          },
          {
            label: "Stations",
            value: totalStations.toString(),
            sub:
              dept.station_count.airport
                ? `${dept.station_count.city} city + ${dept.station_count.airport} airport${dept.station_count.other ? ` + ${dept.station_count.other} other` : ""}`
                : undefined,
          },
          {
            label: "Staffing",
            value: dept.sworn_staffing
              ? formatNumber(dept.sworn_staffing)
              : "—",
            sub: dept.sworn_staffing_label.includes("authorized")
              ? "authorized sworn FTEs"
              : dept.sworn_staffing_label.includes("total")
                ? "total employees"
                : undefined,
          },
          {
            label: "Retirement",
            value: dept.retirement_system,
            sub: dept.retirement_formula_current_hire,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-lg border border-stone-200 p-4"
          >
            <div className="source-tag mb-1">{metric.label}</div>
            <div className="text-lg sm:text-xl font-semibold data-value text-stone-900">
              {metric.value}
            </div>
            {metric.sub && (
              <div className="text-xs text-stone-400 mt-0.5">{metric.sub}</div>
            )}
          </div>
        ))}
      </div>

      {/* Content sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Governance & Structure */}
        <Section title="Governance & Structure">
          <div className="space-y-5">
            <DataCard label="Governance" note={dept.governance_note}>
              <div className="text-sm font-medium">{dept.governance_label}</div>
              <div className="text-sm text-stone-600 mt-1">
                {dept.jurisdiction}
              </div>
            </DataCard>

            <DataCard
              label="Battalion Structure"
              note={dept.battalion_note}
            >
              {dept.battalion_count !== undefined ? (
                <>
                  <div className="text-lg font-semibold data-value">
                    {dept.battalion_count}{" "}
                    {dept.battalion_count === 1 ? "battalion" : "battalions"}
                  </div>
                  {dept.battalion_description && (
                    <div className="text-sm text-stone-600 mt-1">
                      {dept.battalion_description}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-stone-400">Not documented</div>
              )}
            </DataCard>
          </div>
        </Section>

        {/* Operations */}
        <Section title="Suppression & Operations">
          <div className="space-y-5">
            <DataCard
              label="Stations"
              note={dept.station_count.total_note}
            >
              <div className="text-lg font-semibold data-value">
                {totalStations} stations
              </div>
              <div className="text-sm text-stone-600 mt-1">
                {[
                  dept.station_count.city &&
                    `${dept.station_count.city} city`,
                  dept.station_count.airport &&
                    `${dept.station_count.airport} airport`,
                  dept.station_count.other &&
                    `${dept.station_count.other} ${dept.station_count.other_label || "other"}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </DataCard>

            {dept.incident_volume && (
              <DataCard
                label="Call Volume"
                note={dept.incident_volume.note}
              >
                {dept.incident_volume.total ? (
                  <div className="text-lg font-semibold data-value">
                    {formatNumber(dept.incident_volume.total)}{" "}
                    <span className="text-sm font-normal text-stone-500">
                      total calls
                      {dept.incident_volume.year &&
                        ` (${dept.incident_volume.year})`}
                    </span>
                  </div>
                ) : dept.incident_volume.total_label ? (
                  <div className="text-sm font-medium">
                    {dept.incident_volume.total_label}
                  </div>
                ) : null}
                {dept.incident_volume.transports && (
                  <div className="text-sm text-stone-600 mt-1">
                    {formatNumber(dept.incident_volume.transports)} ambulance
                    transports
                  </div>
                )}
                {dept.incident_volume.ems && !dept.incident_volume.total && (
                  <div className="text-sm text-stone-600 mt-1">
                    {formatNumber(dept.incident_volume.ems)}+{" "}
                    {dept.incident_volume.ems_label || "EMS calls/year"}
                  </div>
                )}
              </DataCard>
            )}
          </div>
        </Section>

        {/* EMS */}
        <Section title="EMS Profile">
          <DataCard label="Service Level" note={dept.ems_note}>
            <div className="text-sm font-medium">{dept.ems_label}</div>
          </DataCard>
        </Section>

        {/* Compensation */}
        <Section title="Compensation & Career">
          <div className="space-y-5">
            <DataCard
              label="Top-Step Firefighter Salary"
              note={dept.top_step_note}
            >
              <div className="text-2xl font-semibold data-value text-stone-900">
                {formatCurrency(dept.top_step_monthly)}
                <span className="text-sm font-normal text-stone-400">
                  /month
                </span>
              </div>
              <div className="text-sm text-stone-600 mt-1">
                {formatCurrency(dept.top_step_annual)}/year ·{" "}
                {dept.top_step_classification}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Effective {dept.top_step_effective}
                {dept.mou_term && (
                  <>
                    {" "}
                    · MOU {dept.mou_term}
                    {dept.mou_status && (
                      <span
                        className={`ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          dept.mou_status === "current"
                            ? "bg-emerald-100 text-emerald-700"
                            : dept.mou_status === "expired"
                              ? "bg-red-100 text-red-700"
                              : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {dept.mou_status}
                      </span>
                    )}
                  </>
                )}
              </div>
            </DataCard>

            <DataCard
              label="Retirement"
              note={dept.retirement_note}
            >
              <div className="text-sm font-medium">
                {dept.retirement_system} —{" "}
                {dept.retirement_formula_current_hire}
              </div>
              {dept.retirement_formula_classic && (
                <div className="text-xs text-stone-500 mt-1">
                  Classic: {dept.retirement_formula_classic}
                </div>
              )}
            </DataCard>

            <DataCard
              label="Work Schedule"
              note={dept.work_schedule_note}
            >
              <div className="text-sm font-medium">
                {dept.work_schedule || "Not documented in public sources"}
              </div>
            </DataCard>

            <DataCard
              label="Staffing"
              note={dept.sworn_staffing_note}
            >
              <div className="text-lg font-semibold data-value">
                {dept.sworn_staffing
                  ? formatNumber(dept.sworn_staffing)
                  : "—"}
              </div>
              <div className="text-sm text-stone-600">
                {dept.sworn_staffing_label}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                Source: {dept.sworn_staffing_source}
              </div>
            </DataCard>
          </div>
        </Section>

        {/* Special Operations - only if present */}
        {dept.special_operations && dept.special_operations.length > 0 && (
          <Section title="Special Operations">
            <div className="space-y-3">
              {dept.special_operations.map((op) => (
                <div
                  key={op.name}
                  className="flex gap-3 py-2 border-b border-stone-50 last:border-0"
                >
                  <div className="text-sm font-medium text-stone-900 w-36 shrink-0">
                    {op.name}
                  </div>
                  <div className="text-sm text-stone-600">{op.detail}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Sources */}
        <Section title="Sources">
          <div className="flex flex-wrap gap-2">
            {dept.sources.map((source) => (
              <SourcePill key={source.url} source={source} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-400">
            Data extracted {dept.extracted_date}. Reflects conditions at time of
            extraction — source documents may have been updated since.
          </div>
        </Section>
      </div>
    </div>
  );
}
