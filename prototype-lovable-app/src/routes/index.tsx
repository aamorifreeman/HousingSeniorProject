import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, Bus, Star, AlertTriangle, MapPin, Sparkles } from "lucide-react";
import { listings, monthlyTotal, matchScore, defaultPrefs, avgRating, type Prefs } from "@/lib/data";
import { PageHeader, Badge, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Find Off-Campus Housing — Homebase" },
    { name: "description", content: "Search verified listings near Howard with true monthly costs, commute times and AI match scores." },
    { property: "og:title", content: "Find Off-Campus Housing — Homebase" },
    { property: "og:description", content: "Verified listings, true costs, commute scores and AI matches." },
  ] }),
  component: Index,
});

function Slider({ label, value, min, max, step = 1, onChange, fmt }: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; fmt?: (n: number) => string }) {
  return (
    <label className="block text-sm">
      <div className="flex justify-between"><span className="font-medium">{label}</span><span className="text-muted-foreground">{fmt ? fmt(value) : value}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-1 w-full accent-[var(--primary)]" />
    </label>
  );
}

function Index() {
  const [p, setP] = useState<Prefs>(defaultPrefs);
  const [hood, setHood] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<"match" | "cost" | "commute">("match");
  const [hover, setHover] = useState<string | null>(null);
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setP((s) => ({ ...s, [k]: v }));
  const hoods = ["All", ...new Set(listings.map((l) => l.neighborhood))];
  const results = useMemo(() => listings
    .filter((l) => hood === "All" || l.neighborhood === hood)
    .filter((l) => !verifiedOnly || l.verifiedLandlord)
    .filter((l) => monthlyTotal(l) <= p.budget + 400)
    .map((l) => ({ l, m: matchScore(l, p), total: monthlyTotal(l) }))
    .sort((a, b) => sort === "match" ? b.m.score - a.m.score : sort === "cost" ? a.total - b.total : a.l.transitMin - b.l.transitMin), [p, hood, verifiedOnly, sort]);

  return (
    <>
      <PageHeader eyebrow="Verified Listing Marketplace" title="Housing near the Yard, priced honestly." sub="Every listing shows its true monthly cost, commute to campus, and a match score based on what matters to you." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <Panel>
            <h2 className="font-display text-lg font-bold">Filters</h2>
            <div className="mt-4 space-y-4">
              <Slider label="Monthly budget (all-in)" value={p.budget} min={800} max={2500} step={25} onChange={(v) => set("budget", v)} fmt={(v) => `$${v}`} />
              <Slider label="Max commute to campus" value={p.maxCommute} min={5} max={45} onChange={(v) => set("maxCommute", v)} fmt={(v) => `${v} min`} />
              <label className="block text-sm font-medium">Neighborhood
                <select value={hood} onChange={(e) => setHood(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5">{hoods.map((h) => <option key={h}>{h}</option>)}</select>
              </label>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} /> Verified landlords only</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={p.mustFurnished} onChange={(e) => set("mustFurnished", e.target.checked)} /> Must be furnished</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={p.mustPets} onChange={(e) => set("mustPets", e.target.checked)} /> Pet friendly</label>
              </div>
            </div>
          </Panel>
          <Panel>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Sparkles className="h-4 w-4 text-accent" /> What matters most</h2>
            <p className="mt-1 text-xs text-muted-foreground">Weights tune your AI match scores.</p>
            <div className="mt-4 space-y-3">
              <Slider label="Low cost" value={p.wCost} min={0} max={5} onChange={(v) => set("wCost", v)} />
              <Slider label="Short commute" value={p.wCommute} min={0} max={5} onChange={(v) => set("wCommute", v)} />
              <Slider label="Quiet area" value={p.wQuiet} min={0} max={5} onChange={(v) => set("wQuiet", v)} />
              <Slider label="Building condition" value={p.wCondition} min={0} max={5} onChange={(v) => set("wCondition", v)} />
            </div>
          </Panel>
        </aside>

        <div className="space-y-6">
          <Panel className="p-0 overflow-hidden">
            <div className="relative h-64 bg-secondary">
              <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 50 H100 M50 0 V100 M0 20 L100 80 M20 0 L80 100" stroke="var(--muted-foreground)" strokeWidth="0.4" fill="none" />
                <path d="M10 10 Q50 60 95 30" stroke="var(--success)" strokeWidth="1" fill="none" />
                <path d="M5 90 Q45 45 90 15" stroke="var(--warning)" strokeWidth="1" fill="none" />
              </svg>
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "47%", top: "48%" }}>
                <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-card">Howard University</div>
              </div>
              {results.map(({ l, total }) => (
                <Link key={l.id} to="/listing/$id" params={{ id: l.id }} onMouseEnter={() => setHover(l.id)} onMouseLeave={() => setHover(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-bold shadow-card transition ${hover === l.id ? "z-10 scale-110 bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
                  style={{ left: `${l.x}%`, top: `${l.y}%` }}>${total}</Link>
              ))}
              <div className="absolute bottom-2 left-3 flex gap-3 text-xs text-muted-foreground"><span>— Metro Green</span><span>— Metro Red</span><span>Geospatial Commute view</span></div>
            </div>
          </Panel>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{results.length} homes</p>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-md border bg-card px-2 py-1 text-sm">
              <option value="match">Best match</option><option value="cost">Lowest true cost</option><option value="commute">Shortest commute</option>
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {results.map(({ l, m, total }) => {
              const open = l.incidents.filter((i) => i.status !== "Resolved").length;
              return (
                <Link key={l.id} to="/listing/$id" params={{ id: l.id }} onMouseEnter={() => setHover(l.id)} onMouseLeave={() => setHover(null)}
                  className="group overflow-hidden rounded-xl border bg-card shadow-card transition hover:-translate-y-0.5">
                  <div className="relative h-44 overflow-hidden">
                    <img src={l.image} alt={l.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                    <div className={`absolute right-3 top-3 rounded-lg px-2.5 py-1 text-sm font-bold shadow-card ${m.blockers.length ? "bg-card text-muted-foreground" : "bg-primary text-primary-foreground"}`}>{m.score}% match</div>
                    {l.verifiedLandlord && <div className="absolute left-3 top-3 rounded-full bg-card"><Badge tone="success"><ShieldCheck className="h-3 w-3" />Verified</Badge></div>}
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-display text-lg font-bold">{l.title}</h3>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{l.neighborhood} · {l.layout}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div><div className="text-2xl font-bold">${total}<span className="text-sm font-normal text-muted-foreground">/mo all-in</span></div><div className="text-xs text-muted-foreground">${l.rent} rent + ${total - l.rent} costs</div></div>
                      <div className="text-right text-sm"><div className="flex items-center justify-end gap-1"><Bus className="h-3.5 w-3.5" />{l.transitMin} min</div><div className="flex items-center justify-end gap-1 text-muted-foreground"><Star className="h-3.5 w-3.5" />{avgRating(l).toFixed(1)}</div></div>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {m.blockers.map((b) => <li key={b} className="text-destructive">✕ {b}</li>)}
                      {m.reasons.slice(0, 2).map((r) => <li key={r}>• {r}</li>)}
                    </ul>
                    {open > 0 && <Badge tone="warning"><AlertTriangle className="h-3 w-3" />{open} open issue{open > 1 ? "s" : ""}</Badge>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
