import { createFileRoute } from "@tanstack/react-router";
import { listings, monthlyTotal, avgRating } from "@/lib/data";
import { PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Housing Admin Analytics — Homebase" },
    { name: "description", content: "Anonymized cost, condition and qualification-barrier trends for university housing staff." },
    { property: "og:title", content: "Housing Admin Analytics — Homebase" },
    { property: "og:description", content: "Aggregated, anonymized off-campus housing insights." },
  ] }),
  component: Admin,
});

const barriers = [["Credit check required", 62], ["Income 3× rent", 54], ["Co-signer required", 41], ["No international guarantor accepted", 18], ["Rental history needed", 33]] as const;
const costTrend = [1180, 1215, 1240, 1290, 1310, 1355];

function Admin() {
  const hoods = [...new Set(listings.map((l) => l.neighborhood))].map((h) => {
    const ls = listings.filter((l) => l.neighborhood === h);
    return { h, cost: Math.round(ls.reduce((a, l) => a + monthlyTotal(l), 0) / ls.length), rating: ls.reduce((a, l) => a + avgRating(l), 0) / ls.length, incidents: ls.reduce((a, l) => a + l.incidents.length, 0) };
  });
  const maxCost = Math.max(...hoods.map((x) => x.cost));
  const allInc = listings.flatMap((l) => l.incidents);
  const byType = ["Pests", "Outage", "Leak", "Heat/AC", "Security"].map((t) => [t, allInc.filter((i) => i.type === t).length] as const);
  return (
    <>
      <PageHeader eyebrow="Admin Analytics Dashboard" title="Off-campus housing, at a glance." sub="Aggregated and anonymized — no individual student data is ever shown." />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[["Active listings", listings.length], ["Avg true cost", `$${Math.round(listings.reduce((a, l) => a + monthlyTotal(l), 0) / listings.length)}`], ["Verified landlords", `${Math.round((listings.filter((l) => l.verifiedLandlord).length / listings.length) * 100)}%`], ["Open incidents", allInc.filter((i) => i.status !== "Resolved").length]].map(([k, v]) => (
            <Panel key={k}><p className="text-sm text-muted-foreground">{k}</p><p className="mt-1 font-display text-3xl font-bold">{v}</p></Panel>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel>
            <h2 className="font-display text-lg font-bold">True monthly cost by neighborhood</h2>
            <div className="mt-4 space-y-3">{hoods.sort((a, b) => b.cost - a.cost).map((x) => (
              <div key={x.h} className="text-sm"><div className="flex justify-between"><span>{x.h}</span><span className="font-semibold">${x.cost} · ★{x.rating.toFixed(1)}</span></div><div className="mt-1 h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${(x.cost / maxCost) * 100}%` }} /></div></div>
            ))}</div>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg font-bold">Average cost trend (semesters)</h2>
            <div className="mt-4 flex h-48 items-end gap-3">{costTrend.map((c, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1"><span className="text-xs">${c}</span><div className="w-full rounded-t bg-accent" style={{ height: `${((c - 1000) / 400) * 100}%` }} /><span className="text-xs text-muted-foreground">{["F24", "S25", "F25", "S26", "F26", "S27"][i]}</span></div>
            ))}</div>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg font-bold">Qualification barriers students hit</h2>
            <div className="mt-4 space-y-3">{barriers.map(([k, v]) => (
              <div key={k} className="text-sm"><div className="flex justify-between"><span>{k}</span><span className="font-semibold">{v}%</span></div><div className="mt-1 h-2 rounded bg-muted"><div className="h-2 rounded bg-warning" style={{ width: `${v}%` }} /></div></div>
            ))}</div>
          </Panel>
          <Panel>
            <h2 className="font-display text-lg font-bold">Condition reports by type</h2>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">{byType.map(([t, n]) => (
              <div key={t} className="rounded-lg bg-muted p-3"><div className="font-display text-2xl font-bold">{n}</div><div className="text-xs text-muted-foreground">{t}</div></div>
            ))}</div>
            <button className="mt-4 w-full rounded-md border py-2 text-sm font-semibold hover:bg-muted" onClick={() => alert("Anonymized CSV report generated (prototype).")}>Export anonymized report</button>
          </Panel>
        </div>
      </div>
    </>
  );
}
