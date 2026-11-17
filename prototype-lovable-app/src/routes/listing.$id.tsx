import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ShieldAlert, Star, Bus, Footprints, Sparkles, ArrowLeft, Share2, AlertTriangle } from "lucide-react";
import { getListing, avgRating, summarizeReviews, matchScore, defaultPrefs, type Review, type Incident } from "@/lib/data";
import { Badge, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/listing/$id")({
  loader: ({ params }) => { const l = getListing(params.id); if (!l) throw notFound(); return l; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Listing"} — Homebase` },
    { name: "description", content: `True cost, commute, reviews and incidents for ${loaderData?.title}.` },
    { property: "og:title", content: `${loaderData?.title} — Homebase` },
    { property: "og:description", content: "Verified listing with true cost breakdown and resident reviews." },
    ...(loaderData ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : []),
  ] }),
  component: ListingPage,
});

const statusTone = { Reported: "danger", Acknowledged: "warning", "In progress": "warning", Resolved: "success" } as const;

function ListingPage() {
  const l = Route.useLoaderData();
  const [parking, setParking] = useState(false);
  const [transit, setTransit] = useState(l.walkMin > 10);
  const [renters, setRenters] = useState(true);
  const [reviews, setReviews] = useState<Review[]>(l.reviews);
  const [incidents, setIncidents] = useState<Incident[]>(l.incidents);
  const [form, setForm] = useState({ rating: 5, text: "", anonymous: true });
  const [inc, setInc] = useState<{ type: Incident["type"]; text: string }>({ type: "Pests", text: "" });
  const [shared, setShared] = useState(false);
  const m = matchScore(l, defaultPrefs);
  const transitCost = transit ? 64 : 0;
  const items = [
    ["Rent", l.rent], ["Utilities (est.)", l.utilities], ["Amenity / recurring fees", l.amenityFee],
    ["Renter's insurance", renters ? l.insurance : 0], ["Metro / bus pass", transitCost], ["Parking", parking ? l.parking : 0],
  ] as const;
  const monthly = items.reduce((a, [, v]) => a + v, 0);
  const s = summarizeReviews({ ...l, reviews });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />All listings</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl shadow-card"><img src={l.image} alt={l.title} className="h-80 w-full object-cover" /></div>
          <div>
            <div className="flex flex-wrap gap-2">
              {l.verifiedLandlord ? <Badge tone="success"><ShieldCheck className="h-3 w-3" />Identity verified</Badge> : <Badge tone="danger"><ShieldAlert className="h-3 w-3" />Unverified poster</Badge>}
              {l.verifiedOwnership && <Badge tone="success"><ShieldCheck className="h-3 w-3" />Ownership verified</Badge>}
              <Badge>Available {new Date(l.available).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</Badge>
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold">{l.title}</h1>
            <p className="text-muted-foreground">{l.address} · {l.neighborhood} · {l.layout} · Listed by {l.landlord}</p>
            <div className="mt-3 flex flex-wrap gap-2">{l.vibe.map((v) => <Badge key={v} tone="muted">{v}</Badge>)}<Badge>{l.laundry} laundry</Badge>{l.furnished && <Badge>Furnished</Badge>}{l.petFriendly && <Badge>Pets OK</Badge>}</div>
          </div>

          <Panel>
            <h2 className="font-display text-xl font-bold">Commute to campus</h2>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-muted p-3"><Bus className="mx-auto h-5 w-5" /><div className="mt-1 text-2xl font-bold">{l.transitMin}m</div><div className="text-xs text-muted-foreground">{l.transitLine}</div></div>
              <div className="rounded-lg bg-muted p-3"><Footprints className="mx-auto h-5 w-5" /><div className="mt-1 text-2xl font-bold">{l.walkMin}m</div><div className="text-xs text-muted-foreground">Walking</div></div>
              <div className="rounded-lg bg-muted p-3"><div className="text-xs text-muted-foreground">8am class score</div><div className="mt-1 text-2xl font-bold">{Math.max(1, 10 - Math.round(l.transitMin / 4))}/10</div><div className="text-xs text-muted-foreground">{l.milesToCampus} mi away</div></div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold">Resident reviews</h2><div className="flex items-center gap-1 text-lg font-bold"><Star className="h-5 w-5 fill-warning text-warning" />{avgRating({ ...l, reviews }).toFixed(1)}</div></div>
            <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm">
              <p className="flex items-center gap-1 font-semibold"><Sparkles className="h-4 w-4 text-accent" />AI summary · {s.sentiment}</p>
              <p className="mt-1 text-muted-foreground">Residents highlight {s.pos.length ? s.pos.join(", ") : "few standout positives"}. Common concerns: {s.neg.length ? s.neg.join(", ") : "none reported"}. Based on {reviews.length} verified-tenant reviews.</p>
            </div>
            <div className="mt-4 space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between text-sm"><span className="font-semibold">{r.anonymous ? "Anonymous resident" : r.author} {r.verified && <Badge tone="success">Verified tenant</Badge>}</span><span className="text-warning">{"★".repeat(r.rating)}<span className="text-border">{"★".repeat(5 - r.rating)}</span></span></div>
                  <p className="mt-1 text-sm">{r.text}</p>
                </div>
              ))}
            </div>
            <form className="mt-4 space-y-2 rounded-lg bg-muted p-4" onSubmit={(e) => { e.preventDefault(); if (!form.text.trim()) return; setReviews([{ id: crypto.randomUUID(), author: "You", anonymous: form.anonymous, rating: form.rating, text: form.text, date: new Date().toISOString(), verified: true }, ...reviews]); setForm({ ...form, text: "" }); }}>
              <p className="text-sm font-semibold">Write a review</p>
              <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })} className={`text-xl ${n <= form.rating ? "text-warning" : "text-border"}`}>★</button>)}</div>
              <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="What should future tenants know?" className="w-full rounded-md border bg-card p-2 text-sm" rows={2} />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />Post anonymously (identity stays verified privately)</label>
                <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">Post</button>
              </div>
            </form>
          </Panel>

          <Panel>
            <h2 className="font-display text-xl font-bold">Incident log</h2>
            <p className="text-sm text-muted-foreground">Structured reports of pests, outages and repairs, with public manager responses.</p>
            <div className="mt-4 space-y-2">
              {incidents.length === 0 && <p className="text-sm text-muted-foreground">No incidents reported.</p>}
              {incidents.map((i) => (
                <div key={i.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center justify-between"><span className="font-semibold"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />{i.type}: {i.text}</span><Badge tone={statusTone[i.status]}>{i.status}</Badge></div>
                  {i.response && <p className="mt-1 text-muted-foreground">Manager: {i.response}</p>}
                </div>
              ))}
            </div>
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!inc.text.trim()) return; setIncidents([{ id: crypto.randomUUID(), type: inc.type, text: inc.text, date: new Date().toISOString(), status: "Reported" }, ...incidents]); setInc({ ...inc, text: "" }); }}>
              <select value={inc.type} onChange={(e) => setInc({ ...inc, type: e.target.value as Incident["type"] })} className="rounded-md border bg-card px-2 text-sm">{["Pests", "Outage", "Leak", "Heat/AC", "Security"].map((t) => <option key={t}>{t}</option>)}</select>
              <input value={inc.text} onChange={(e) => setInc({ ...inc, text: e.target.value })} placeholder="Describe the issue" className="flex-1 rounded-md border bg-card px-2 py-1.5 text-sm" />
              <button className="rounded-md bg-accent px-3 text-sm font-semibold text-accent-foreground">Report</button>
            </form>
          </Panel>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Panel>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total Cost Calculator</p>
            <div className="mt-2 text-4xl font-bold">${monthly}<span className="text-base font-normal text-muted-foreground">/mo</span></div>
            <div className="mt-4 space-y-1.5 text-sm">{items.map(([k, v]) => <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span>${v}</span></div>)}</div>
            <div className="mt-4 space-y-2 border-t pt-3 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={transit} onChange={(e) => setTransit(e.target.checked)} />I'll buy a transit pass</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} />I need parking (${l.parking})</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={renters} onChange={(e) => setRenters(e.target.checked)} />Renter's insurance</label>
            </div>
            <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between font-semibold"><span>Due at move-in</span><span>${l.deposit + l.appFee + l.rent}</span></div>
              <div className="text-xs text-muted-foreground">Deposit ${l.deposit} + app fee ${l.appFee} + first month</div>
              <div className="mt-2 flex justify-between font-semibold"><span>12-month total</span><span>${(monthly * 12 + l.appFee).toLocaleString()}</span></div>
            </div>
          </Panel>
          <Panel>
            <p className="flex items-center gap-1 text-sm font-semibold"><Sparkles className="h-4 w-4 text-accent" />{m.score}% match for you</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{[...m.blockers.map((b) => "✕ " + b), ...m.reasons.map((r) => "• " + r)].map((r) => <li key={r}>{r}</li>)}</ul>
          </Panel>
          <button onClick={() => setShared(true)} className="flex w-full items-center justify-center gap-2 rounded-lg border bg-card py-2.5 text-sm font-semibold hover:bg-muted"><Share2 className="h-4 w-4" />{shared ? "Read-only link sent to parent/guardian" : "Share summary with family"}</button>
        </aside>
      </div>
    </div>
  );
}
