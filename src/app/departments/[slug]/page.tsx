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
import type { SourceLink } from "@/data/departments";
import { CaliforniaLocator } from "@/components/CaliforniaLocator";
import { StationMap } from "@/components/StationMap";
import { UpdatesRail } from "@/components/UpdatesRail";

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) return { title: "Not Found" };
  return {
    title: `${dept.name} — California Fire Data`,
    description: `Salary, staffing, retirement, EMS model, and operations data for ${dept.name}. Source-linked from official public records.`,
  };
}

// ─── Reusable components ──────────────────────────────────

function DataCard({
  label,
  children,
  note,
}: {
  label: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div>
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
      <svg
        className="w-3 h-3 opacity-60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
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

// Social icon paths
const socialIcons: Record<string, { label: string; path: string }> = {
  website: {
    label: "Website",
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  },
  instagram: {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  facebook: {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  youtube: {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  x: {
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
};

// ─── Main page ────────────────────────────────────────────

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) notFound();

  const totalStations = getTotalStations(dept);
  const socialEntries = dept.socials
    ? (Object.entries(dept.socials).filter(
        ([, url]) => url !== undefined
      ) as [string, string][])
    : [];

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

      {/* ─── Hero: Identity + Locator ─── */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 lg:gap-12 items-start">
        {/* Left: Department identity */}
        <div className="min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
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

          {/* Department name — large serif */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-stone-900 leading-[1.1] tracking-tight">
            {dept.name}
          </h1>

          {/* Jurisdiction note */}
          {dept.jurisdiction_note && (
            <p className="mt-3 text-sm text-stone-500 max-w-2xl leading-relaxed">
              {dept.jurisdiction_note}
            </p>
          )}

          {/* Social links — inline, compact, integrated with identity */}
          {socialEntries.length > 0 && (
            <div className="mt-5 flex items-center gap-1.5">
              {socialEntries.map(([platform, url]) => {
                const icon = socialIcons[platform];
                if (!icon) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-md bg-stone-100/80 hover:bg-amber-100 flex items-center justify-center transition-colors group"
                    title={icon.label}
                  >
                    <svg
                      className="w-3 h-3 text-stone-400 group-hover:text-amber-700 transition-colors"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={icon.path} />
                    </svg>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: California locator — signature visual anchor */}
        <div className="hidden lg:flex justify-end">
          <CaliforniaLocator
            lat={dept.lat}
            lng={dept.lng}
            label={`${dept.county} County`}
            size="large"
          />
        </div>

        {/* Mobile: California locator shown as a smaller centered element */}
        <div className="lg:hidden flex justify-center -mt-2">
          <CaliforniaLocator
            lat={dept.lat}
            lng={dept.lng}
            label={`${dept.county} County`}
            className="max-w-[160px]"
          />
        </div>
      </div>

      {/* ─── Key metrics bar ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Top-Step FF",
            value: `${formatCurrency(dept.top_step_monthly)}/mo`,
            sub: dept.top_step_effective,
          },
          {
            label: "Stations",
            value: totalStations.toString(),
            sub: dept.station_count.airport
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

      {/* ─── Station map — integrated, cleaner treatment ─── */}
      {dept.stations && dept.stations.length > 0 && (
        <div className="mb-10">
          <StationMap
            stations={dept.stations}
            centerLat={dept.lat}
            centerLng={dept.lng}
            zoom={dept.stations.length <= 10 ? 12 : 11}
          />
        </div>
      )}

      {/* ─── Content sections ─── */}
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

            <DataCard label="Battalion Structure" note={dept.battalion_note}>
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

        {/* Suppression & Operations */}
        <Section title="Suppression & Operations">
          <div className="space-y-5">
            <DataCard label="Stations" note={dept.station_count.total_note}>
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
              <DataCard label="Call Volume" note={dept.incident_volume.note}>
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

        {/* EMS Profile */}
        <Section title="EMS Profile">
          <DataCard label="Service Level" note={dept.ems_note}>
            <div className="text-sm font-medium">{dept.ems_label}</div>
          </DataCard>
        </Section>

        {/* Compensation & Career */}
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
                    {" "}· MOU {dept.mou_term}
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

            <DataCard label="Retirement" note={dept.retirement_note}>
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

            <DataCard label="Work Schedule" note={dept.work_schedule_note}>
              <div className="text-sm font-medium">
                {dept.work_schedule || "Not documented in public sources"}
              </div>
            </DataCard>

            <DataCard label="Staffing" note={dept.sworn_staffing_note}>
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

        {/* Special Operations — only if present */}
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

        {/* Recent Updates — only if present */}
        {dept.updates && dept.updates.length > 0 && (
          <UpdatesRail updates={dept.updates} />
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
