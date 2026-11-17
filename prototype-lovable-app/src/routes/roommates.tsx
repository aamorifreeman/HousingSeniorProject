import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, AlertTriangle, Check, Lock } from "lucide-react";
import { roommates, roommateScore, factors, type Me } from "@/lib/data";
import { PageHeader, Panel, Badge } from "@/components/AppShell";

export const Route = createFileRoute("/roommates")({
  head: () => ({ meta: [
    { title: "Roommate Matcher — Homebase" },
    { name: "description", content: "Find compatible roommates with weighted lifestyle scoring and conflict forecasts." },
    { property: "og:title", content: "Roommate Matcher — Homebase" },
    { property: "og:description", content: "Compatibility scoring, conflict forecasting and group optimization." },
  ] }),
  component: Roommates,
});

function Roommates() {
  const [me, setMe] = useState<Me>({ sleep: 3, clean: 4, social: 3, guests: 2, noise: 2, budget: 1200 });
  const [group, setGroup] = useState<string[]>([]);
  const [showNames, setShowNames] = useState(false);
  const ranked = useMemo(() => roommates.map((r) => ({ r, ...roommateScore(me, r) })).sort((a, b) => b.score - a.score), [me]);
  const groupScore = useMemo(() => {
    const members = roommates.filter((r) => group.includes(r.id));
    if (members.length < 2) return null;
    let sum = 0, n = 0;
    for (let i = 0; i < members.length; i++) for (let j = i + 1; j < members.length; j++) { const { id, name, major, year, bio, ...a } = members[i]!; sum += roommateScore(a, members[j]!).score; n++; }
    return Math.round(sum / n);
  }, [group]);
  const bestTrio = useMemo(() => {
    let best = { ids: [] as string[], s: 0 };
    for (let i = 0; i < ranked.length; i++) for (let j = i + 1; j < ranked.length; j++) {
      const a = ranked[i]!, b = ranked[j]!; const { id, name, major, year, bio, ...am } = a.r;
      const s = (a.score + b.score + roommateScore(am, b.r).score) / 3;
      if (s > best.s) best = { ids: [a.r.id, b.r.id], s };
    }
    return best;
  }, [ranked]);

  return (
    <>
      <PageHeader eyebrow="Algorithmic Roommate Matcher" title="Live with people who fit." sub="Tell us how you live. We weigh sleep, cleanliness, social energy and budget — and forecast where conflict could happen." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <Panel>
            <h2 className="font-display text-lg font-bold">Your lifestyle</h2>
            <div className="mt-4 space-y-4">
              {factors.map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="font-medium">{f.label}</span>
                  <input type="range" min={1} max={5} value={me[f.key]} onChange={(e) => setMe({ ...me, [f.key]: +e.target.value })} className="w-full accent-[var(--primary)]" />
                  <div className="flex justify-between text-xs text-muted-foreground"><span>{f.low}</span><span>{f.high}</span></div>
                </label>
              ))}
              <label className="block text-sm"><span className="font-medium">Budget: ${me.budget}/mo</span>
                <input type="range" min={800} max={2000} step={50} value={me.budget} onChange={(e) => setMe({ ...me, budget: +e.target.value })} className="w-full accent-[var(--primary)]" /></label>
            </div>
          </Panel>
          <Panel>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Users className="h-4 w-4" />Your group</h2>
            {group.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Add people to see group harmony.</p> : (
              <>
                <div className="mt-2 flex flex-wrap gap-1">{group.map((id) => <Badge key={id} tone="primary">{roommates.find((r) => r.id === id)?.name}</Badge>)}</div>
                {groupScore !== null && <p className="mt-3 text-sm">Group harmony between members: <b>{groupScore}%</b></p>}
              </>
            )}
            <button onClick={() => setGroup(bestTrio.ids)} className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground">Optimize a 3-person group</button>
            <p className="mt-1 text-xs text-muted-foreground">Best trio including you: {Math.round(bestTrio.s)}% avg.</p>
          </Panel>
          <Panel>
            <label className="flex items-start gap-2 text-sm"><Lock className="mt-0.5 h-4 w-4" /><span className="flex-1">Show full names before mutual match</span><input type="checkbox" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} /></label>
          </Panel>
        </aside>
        <div className="grid gap-4 md:grid-cols-2">
          {ranked.map(({ r, score, conflicts, strengths }) => {
            const inGroup = group.includes(r.id);
            return (
              <Panel key={r.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold">{showNames ? r.name : r.name.split(" ")[0] + " ·"}</h3>
                    <p className="text-sm text-muted-foreground">{r.year} · {r.major} · ${r.budget}/mo</p>
                  </div>
                  <div className={`grid h-14 w-14 place-items-center rounded-full text-lg font-bold ${score >= 80 ? "bg-success/15 text-success" : score >= 60 ? "bg-warning/20" : "bg-destructive/15 text-destructive"}`}>{score}</div>
                </div>
                <p className="mt-2 text-sm">{r.bio}</p>
                <ul className="mt-3 space-y-1 text-xs">
                  {strengths.map((s) => <li key={s} className="flex items-center gap-1 text-success"><Check className="h-3 w-3" />{s}</li>)}
                  {conflicts.map((c) => <li key={c} className="flex items-center gap-1 text-destructive"><AlertTriangle className="h-3 w-3" />{c}</li>)}
                </ul>
                <button onClick={() => setGroup(inGroup ? group.filter((g) => g !== r.id) : [...group, r.id])} className={`mt-4 w-full rounded-md border py-1.5 text-sm font-semibold ${inGroup ? "bg-secondary" : "hover:bg-muted"}`}>{inGroup ? "Remove from group" : "Add to group"}</button>
              </Panel>
            );
          })}
        </div>
      </div>
    </>
  );
}
