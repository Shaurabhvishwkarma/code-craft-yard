import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookMarked, ChevronDown, Code2, Globe, LayoutDashboard, ListChecks, Menu, Settings2, TrendingUp, User, X } from "lucide-react";
import { TOPICS } from "@/lib/topics";
import { cn } from "@/lib/utils";

function NavItem({ to, params, icon, children, onClick }: { to: string; params?: Record<string, string>; icon?: ReactNode; children: ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to as "/"}
      params={params as never}
      onClick={onClick}
      activeOptions={{ exact: true }}
      className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
    >
      {icon}
      <span className="truncate">{children}</span>
    </Link>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-1 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        {title}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWorkspace = pathname.startsWith("/questions/") && pathname.length > "/questions/".length;
  const close = () => setMobileOpen(false);
  const learn = TOPICS.slice(0, 4);
  const dsa = TOPICS.slice(4);

  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto px-3 pb-6">
      <Link to="/" onClick={close} className="flex items-center gap-2.5 px-3 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-primary-foreground">
          <Code2 className="h-4.5 w-4.5" />
        </span>
        <span className="font-semibold tracking-tight">CodeMaster <span className="text-gradient">Hub</span></span>
      </Link>
      <div className="space-y-0.5">
        <NavItem to="/" icon={<LayoutDashboard className="h-4 w-4" />} onClick={close}>Dashboard</NavItem>
        <NavItem to="/questions" icon={<ListChecks className="h-4 w-4" />} onClick={close}>All Questions</NavItem>
      </div>
      <Section title="Learn C++">
        {learn.map((t) => <NavItem key={t.slug} to="/topics/$topic" params={{ topic: t.slug }} onClick={close}>{t.name}</NavItem>)}
      </Section>
      <Section title="Data Structures & Algorithms">
        {dsa.map((t) => <NavItem key={t.slug} to="/topics/$topic" params={{ topic: t.slug }} onClick={close}>{t.name}</NavItem>)}
      </Section>
      <Section title="You">
        <NavItem to="/bookmarks" icon={<BookMarked className="h-4 w-4" />} onClick={close}>Bookmarks</NavItem>
        <NavItem to="/progress" icon={<TrendingUp className="h-4 w-4" />} onClick={close}>My Progress</NavItem>
        <NavItem to="/profile" icon={<User className="h-4 w-4" />} onClick={close}>Profile</NavItem>
      </Section>
      <Section title="More">
        <NavItem to="/resources" icon={<Globe className="h-4 w-4" />} onClick={close}>External Resources</NavItem>
        <NavItem to="/setup" icon={<Settings2 className="h-4 w-4" />} onClick={close}>Execution Setup</NavItem>
      </Section>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">{nav}</aside>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/" className="font-semibold">CodeMaster <span className="text-gradient">Hub</span></Link>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="rounded-md p-2 hover:bg-muted"><Menu className="h-5 w-5" /></button>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={close} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">
            <button onClick={close} aria-label="Close menu" className="absolute right-3 top-4 rounded-md p-2 hover:bg-sidebar-accent"><X className="h-4 w-4" /></button>
            {nav}
          </aside>
        </div>
      )}
      <main className={cn("lg:pl-64", !isWorkspace && "")}>
        <div className={cn("mx-auto px-4 py-8 sm:px-6 lg:px-10", isWorkspace ? "max-w-6xl" : "max-w-6xl")}>{children}</div>
      </main>
    </div>
  );
}
