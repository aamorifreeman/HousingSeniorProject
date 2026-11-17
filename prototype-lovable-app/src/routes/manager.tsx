import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Flag } from "lucide-react";
import { listings, avgRating, type Incident } from "@/lib/data";
import { PageHeader, Panel, Badge } from "@/components/AppShell";

export const Route = createFileRoute("/manager")({
  head: () => ({ meta: [
    { title: "Management Response Desk — Homebase" },
    { name: "description", content: "Property managers respond to incidents, review feedback and track sentiment." },
    { property: "og:title", content: "Management Response Desk — Homebase" },
    { property: "og:description", content: "Respond publicly to incidents and reviews." },
  ] }),
  component: Manager,
});
const statuses: Incident["status"][] = ["Reported", "Acknowledged", "In progress", "Resolved"];

function Manager() {
  const managed = listings.filter((l) => l.verifiedLandlord);
  const [id, setId] = useState(managed[1]!.id);
  const l = managed.find((x) => x.id === id)!;
  const [inc, setInc] = useState<Record<string, Incident[]>>(Object.fromEntries(managed.map((m) => [m.id, m.incidents])));
  const [flags, setFlags] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const update = (iid: string, patch: Partial<Incident>) => setInc({ ...inc, [id]: (inc[id] ?? []).map((i) => i.id === iid ? { ...i, ...patch } : i) });
  const trend = [3.2, 3.4, 3.1, 3.6, 3.8, avgRating(l)];
  return (
    <>
      <PageHeader eyebrow="Management Response Desk" title="Respond. Resolve. Rebuild trust." sub="Update incident status publicly, reply to reviews, and flag content that breaks guidelines." />
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap gap-2">{managed.map((m) => <button key={m.id} onClick={() => setId(m.id)} className={`rounded-full border px-3 py-1 text-sm ${m.id === id ? "bg-primary text-primary-foreground" : "bg-card"}`}>{m.title}</button>)}</div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Panel>
              <h2 className="font-display text-lg font-bold">Open incidents</h2>
              <div className="mt-3 space-y-3">
                {(inc[id] ?? []).length === 0 && <p className="text-sm text-muted-foreground">No incidents.</p>}
                {(inc[id] ?? []).map((i) => (
                  <div key={i.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between"><span className="text-sm font-semibold">{i.type}: {i.text}</span>
                      <select value={i.status} onChange={(e) => update(i.id, { status: e.target.value as Incident["status"] })} className="rounded border bg-card px-2 py-1 text-sm">{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
                    <div className="mt-2 flex gap-2">
                      <input value={drafts[i.id] ?? i.response ?? ""} onChange={(e) => setDrafts({ ...drafts, [i.id]: e.target.value })} placeholder="Public response…" className="flex-1 rounded border bg-background px-2 py-1 text-sm" />
                      <button onClick={() => update(i.id, { response: drafts[i.id] ?? "" })} className="rounded bg-primary px-3 text-sm font-semibold text-primary-foreground">Post</button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <h2 className="font-display text-lg font-bold">Reviews</h2>
              <div className="mt-3 space-y-3">{l.reviews.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-0">
                  <div className="text-sm"><span className="text-warning">{"★".repeat(r.rating)}</span> <span className="font-semibold">{r.anonymous ? "Anonymous" : r.author}</span><p>{r.text}</p></div>
                  <button onClick={() => setFlags(flags.includes(r.id) ? flags.filter((f) => f !== r.id) : [...flags, r.id])} className="shrink-0">{flags.includes(r.id) ? <Badge tone="danger"><Flag className="h-3 w-3" />Sent to moderation</Badge> : <Badge><Flag className="h-3 w-3" />Flag</Badge>}</button>
                </div>
              ))}</div>
              <p className="mt-2 text-xs text-muted-foreground">Managers can't see reviewer identities; flags go to Homebase moderators.</p>
            </Panel>
          </div>
          <Panel>
            <h2 className="font-display text-lg font-bold">Sentiment history</h2>
            <div className="mt-4 flex h-40 items-end gap-2">{trend.map((t, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1"><span className="text-xs">{t.toFixed(1)}</span><div className="w-full rounded-t bg-primary" style={{ height: `${(t / 5) * 100}%` }} /><span className="text-xs text-muted-foreground">{["May", "Jun", "Jul", "Aug", "Sep", "Oct"][i]}</span></div>
            ))}</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded bg-muted p-2"><div className="text-xl font-bold">{(inc[id] ?? []).filter((i) => i.status !== "Resolved").length}</div>Open</div>
              <div className="rounded bg-muted p-2"><div className="text-xl font-bold">{(inc[id] ?? []).filter((i) => i.status === "Resolved").length}</div>Resolved</div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
