import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — California Fire Data",
  description:
    "How this data is collected, what sources we use, and why this project exists.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-display text-2xl sm:text-3xl text-stone-900 mb-8">
        About this project
      </h1>

      <div className="prose prose-stone prose-sm max-w-none space-y-6">
        <p className="text-stone-600 leading-relaxed">
          California Fire Data is an independent research project that builds
          structured, source-linked profiles of California fire departments from
          official public records.
        </p>

        <h2 className="font-display text-lg text-stone-900 mt-8 mb-3">
          Why this exists
        </h2>
        <p className="text-stone-600 leading-relaxed">
          Information about fire departments — salary, staffing, retirement
          systems, EMS models, operational capabilities — is public but
          fragmented across thousands of MOUs, city budgets, department websites,
          and pension system documents. There is no single place to compare
          departments side by side using standardized, sourced data.
        </p>
        <p className="text-stone-600 leading-relaxed">
          This project aims to fill that gap by extracting structured data from
          official sources and presenting it in a format that is useful for
          candidates researching departments, lateral firefighters considering a
          move, and anyone interested in how fire departments are organized and
          funded.
        </p>

        <h2 className="font-display text-lg text-stone-900 mt-8 mb-3">
          Data methodology
        </h2>
        <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 space-y-3 text-sm text-stone-600">
          <p>
            <strong className="text-stone-900">Official sources only.</strong>{" "}
            Every field is extracted from MOUs, city/district budget documents,
            department websites, county EMS agency plans, or pension system
            publications. No Wikipedia, no news articles, no forums.
          </p>
          <p>
            <strong className="text-stone-900">Blank beats guessed.</strong>{" "}
            Fields that cannot be reliably sourced are left blank rather than
            estimated. A missing value is more honest than a wrong one.
          </p>
          <p>
            <strong className="text-stone-900">
              Discrepancies are preserved.
            </strong>{" "}
            Where official sources conflict, both values are shown with the
            discrepancy noted. We do not resolve ambiguity by picking a side.
          </p>
          <p>
            <strong className="text-stone-900">Every value is dated.</strong>{" "}
            Salary schedules, staffing counts, and other time-sensitive data
            carry effective dates and source dates. &ldquo;Current&rdquo; is not a date.
          </p>
          <p>
            <strong className="text-stone-900">Source links are mandatory.</strong>{" "}
            Every department profile includes links to the original source
            documents so you can verify any value yourself.
          </p>
        </div>

        <h2 className="font-display text-lg text-stone-900 mt-8 mb-3">
          Current scope
        </h2>
        <p className="text-stone-600 leading-relaxed">
          This is a pilot covering a small number of Northern California career
          fire departments selected to span different governance structures (city
          departments, fire districts), sizes, and data availability levels. The
          goal is to validate the data model and product before expanding
          coverage.
        </p>

        <h2 className="font-display text-lg text-stone-900 mt-8 mb-3">
          Disclaimers
        </h2>
        <p className="text-sm text-stone-400 leading-relaxed">
          This is an independent project. It is not affiliated with, endorsed by,
          or connected to any fire department, city, county, district, or labor
          organization. Data reflects conditions at the time of extraction from
          source documents and may not reflect subsequent changes. This site
          should not be used as the sole basis for employment, financial, or
          legal decisions. Always verify critical information against current
          source documents.
        </p>
      </div>
    </div>
  );
}
