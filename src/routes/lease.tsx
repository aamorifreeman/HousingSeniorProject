import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Upload, Sparkles, Share2 } from "lucide-react";
import { analyzeLease, sampleLease } from "@/lib/data";
import { PageHeader, Panel, Badge } from "@/components/AppShell";

export const Route = createFileRoute("/lease")({
  head: () => ({ meta: [
    { title: "Lease Intelligence — Homebase" },
    { name: "description", content: "Upload a lease to extract key clauses, hidden fees and risks in plain language." },
    { property: "og:title", content: "Lease Intelligence — Homebase" },
    { property: "og:description", content: "Plain-language lease summaries and fee detection." },
  ] }),
  component: Lease,
});

function Lease() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyzeLease> | null>(null);
  const [shared, setShared] = useState(false);
  const run = (t: string) => { setText(t); setResult(analyzeLease(t)); setShared(false); };
  const onFile = async (f?: File) => { if (!f) return; if (f.type.startsWith("text")) run(await f.text()); else run(sampleLease); };
  const high = result?.clauses.filter((c) => c.risk === "high").length ?? 0;
  return (
    <>
      <PageHeader eyebrow="AI Lease Intelligence" title="Know what you're signing." sub="Upload or paste a lease. We pull out fees, renewal traps and risky clauses, then write a summary you can share with family." />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold"><FileText className="h-4 w-4" />Lease document</h2>
            <div className="flex gap-2">
              <label className="flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"><Upload className="h-3.5 w-3.5" />Upload<input type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} /></label>
              <button onClick={() => run(sampleLease)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">Use sample</button>
            </div>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={18} placeholder="Paste lease text here…" className="mt-4 w-full rounded-md border bg-background p-3 font-mono text-xs" />
          <button onClick={() => run(text)} disabled={!text.trim()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-50"><Sparkles className="h-4 w-4" />Analyze lease</button>
          <p className="mt-2 text-xs text-muted-foreground">Prototype: PDFs load the sample lease. Not legal advice.</p>
        </Panel>
        <div className="space-y-4">
          {!result ? <Panel><p className="text-muted-foreground">Results will appear here.</p></Panel> : (
            <>
              <Panel>
                <h2 className="font-display text-lg font-bold">Summary</h2>
                <p className="mt-2 text-sm">We found <b>{result.clauses.length}</b> key clauses, <b className="text-destructive">{high} high-risk</b>. Dollar amounts mentioned: {result.money.join(", ") || "none"}.</p>
                <button onClick={() => setShared(true)} className="mt-3 flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-muted"><Share2 className="h-4 w-4" />{shared ? "Shared with parent (view-only)" : "Share summary with parent"}</button>
              </Panel>
              {result.clauses.sort((a, b) => ["high", "medium", "low"].indexOf(a.risk) - ["high", "medium", "low"].indexOf(b.risk)).map((c) => (
                <Panel key={c.title}>
                  <div className="flex items-center justify-between"><h3 className="font-semibold">{c.title}</h3><Badge tone={c.risk === "high" ? "danger" : c.risk === "medium" ? "warning" : "muted"}>{c.risk} risk</Badge></div>
                  <p className="mt-2 rounded bg-muted p-2 font-mono text-xs">{c.text}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
                </Panel>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
