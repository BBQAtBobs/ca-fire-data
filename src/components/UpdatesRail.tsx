/**
 * Lightweight updates/timeline for a department.
 * Shows recent data extraction events and notable changes.
 * Quiet, supporting element.
 */

interface Update {
  date: string;
  text: string;
  source_url?: string;
}

export function UpdatesRail({
  updates,
  className = "",
}: {
  updates: Update[];
  className?: string;
}) {
  if (!updates || updates.length === 0) return null;

  return (
    <div className={`bg-white rounded-lg border border-stone-200 ${className}`}>
      <div className="px-5 py-3.5 border-b border-stone-100">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Recent Updates
        </h2>
      </div>
      <div className="p-5">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-stone-100" />

          <div className="space-y-4">
            {updates.map((update, i) => (
              <div key={i} className="flex gap-3.5 relative">
                {/* Timeline dot */}
                <div className="w-[11px] h-[11px] rounded-full border-2 border-stone-300 bg-white shrink-0 mt-0.5 relative z-10" />
                <div className="min-w-0">
                  <div className="text-[10px] text-stone-400 font-medium mb-0.5">
                    {update.date}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {update.text}
                  </p>
                  {update.source_url && (
                    <a
                      href={update.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-stone-400 hover:text-amber-700 transition-colors mt-1"
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
