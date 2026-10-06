import { Trophy } from "lucide-react";

type Award = { name: string; year: string };

export default function Awards({ awards }: { awards: Award[] }) {
  // no awards found, so show nothing
  if (awards.length === 0) return null;

  // newest first
  const sorted = [...awards].sort((a, b) => b.year.localeCompare(a.year));

  return (
    <section>
      <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold">
        Awards <Trophy size={32} />
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((award, index) => (
          <div
            key={index}
            className="flex items-center gap-4 rounded-xl border border-mist-600 bg-[#111827] p-4"
          >
            <Trophy className="shrink-0 text-yellow-400" />
            <div>
              <p className="font-semibold">{award.name}</p>
              {award.year && (
                <p className="font-mono text-sm text-gray-400">{award.year}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}