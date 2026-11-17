import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home } from "lucide-react";
const nav = [
  { to: "/", label: "Find housing" },
  { to: "/roommates", label: "Roommates" },
  { to: "/lease", label: "Lease check" },
  { to: "/manager", label: "Managers" },
  { to: "/admin", label: "Admin" },
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground"><Home className="h-4 w-4" /></span>
            Homebase
          </Link>
          <nav className="flex flex-1 gap-1 overflow-x-auto text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
                className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}>{n.label}</Link>
            ))}
          </nav>
          <span className="hidden text-xs text-muted-foreground md:block">Howard University · Prototype</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="bg-hero text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl opacity-80">{sub}</p>
      </div>
    </div>
  );
}
export function Badge({ tone = "muted", children }: { tone?: "muted" | "success" | "warning" | "danger" | "primary"; children: ReactNode }) {
  const t = { muted: "bg-muted text-muted-foreground", success: "bg-success/15 text-success", warning: "bg-warning/20 text-foreground", danger: "bg-destructive/15 text-destructive", primary: "bg-primary text-primary-foreground" }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${t}`}>{children}</span>;
}
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border bg-card p-5 shadow-card ${className}`}>{children}</section>;
}
