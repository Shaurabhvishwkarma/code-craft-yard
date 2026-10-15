import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bookmark, CheckCircle2, ChevronLeft } from "lucide-react";
import { getQuestion, relatedQuestions } from "@/lib/questions";
import { topicName } from "@/lib/topics";
import { progress, useProgress } from "@/lib/progress";
import { DifficultyBadge, Tag } from "@/components/QuestionBits";
import { Workspace } from "@/components/Workspace";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/questions/$slug")({
  loader: ({ params }) => {
    const q = getQuestion(params.slug);
    if (!q) throw notFound();
    return q;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — C++ Practice | CodeMaster Hub` },
          { name: "description", content: loaderData.statement.slice(0, 155) },
          { property: "og:title", content: `${loaderData.title} — CodeMaster Hub` },
          { property: "og:description", content: loaderData.statement.slice(0, 155) },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Question unavailable — CodeMaster Hub" }, { name: "robots", content: "noindex" }],
  }),
  component: QuestionPage,
});

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
      <div className="mt-1.5 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

function Reveal({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-surface">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:text-primary">
        {open ? `Hide ${label.toLowerCase()}` : `Show ${label}`}
        <span className="text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="border-t border-border px-4 py-3 text-sm">{children}</div>}
    </div>
  );
}

function QuestionPage() {
  const q = Route.useLoaderData();
  const p = useProgress();
  const solved = !!p.solved[q.slug];
  const marked = p.bookmarks.includes(q.slug);
  const related = relatedQuestions(q);

  return (
    <div className="space-y-8">
      <div>
        <Link to="/topics/$topic" params={{ topic: q.topic }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> {topicName(q.topic)}
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{q.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <DifficultyBadge d={q.difficulty} />
              <span className="font-mono text-xs">#{q.id}</span>
              <span>·</span>
              <span>{q.source} ({q.license})</span>
              {q.sourceUrl && <a href={q.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Original problem</a>}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">{q.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => progress.toggleBookmark(q.slug)} aria-pressed={marked} className={cn("inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm", marked ? "border-accent/50 bg-accent/10 text-accent" : "border-border hover:bg-muted")}>
              <Bookmark className={cn("h-4 w-4", marked && "fill-accent")} /> {marked ? "Bookmarked" : "Bookmark"}
            </button>
            <button onClick={() => progress.toggleSolved(q.slug)} aria-pressed={solved} className={cn("inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm", solved ? "border-success/50 bg-success/10 text-success" : "border-border hover:bg-muted")}>
              <CheckCircle2 className="h-4 w-4" /> {solved ? "Solved" : "Mark as solved"}
            </button>
          </div>
        </div>
      </div>

      <article className="space-y-5 rounded-xl border border-border bg-card p-6">
        <Block title="Problem"><p className="whitespace-pre-line">{q.statement}</p></Block>
        <div className="grid gap-5 md:grid-cols-2">
          <Block title="Input format"><p>{q.inputFormat}</p></Block>
          <Block title="Output format"><p>{q.outputFormat}</p></Block>
        </div>
        <Block title="Constraints">
          <ul className="flex flex-wrap gap-2">{q.constraints.map((c) => <li key={c} className="rounded bg-muted px-2 py-0.5 font-mono text-sm">{c}</li>)}</ul>
        </Block>
        <div className="space-y-4">
          {q.samples.map((s, i) => (
            <div key={i}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Example {i + 1}</h3>
              <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                <pre className="rounded-lg bg-code p-3 text-sm"><span className="mb-1 block text-xs text-muted-foreground">Input</span>{s.input}</pre>
                <pre className="rounded-lg bg-code p-3 text-sm"><span className="mb-1 block text-xs text-muted-foreground">Output</span>{s.output}</pre>
              </div>
              {s.explanation && <p className="mt-2 text-sm text-muted-foreground">Explanation: {s.explanation}</p>}
            </div>
          ))}
          <p className="text-xs text-muted-foreground">+ {q.tests.length} hidden test case{q.tests.length === 1 ? "" : "s"} on submit.</p>
        </div>
      </article>

      <Workspace q={q} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Learn</h2>
        <Reveal label="Hint"><p>{q.hint}</p></Reveal>
        <Reveal label="Approach"><p>{q.approach}</p></Reveal>
        <Reveal label="C++ Solution"><pre className="overflow-auto rounded-lg bg-code p-3 text-sm">{q.solution}</pre></Reveal>
        <div className="flex flex-wrap gap-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
          <span>Time: <span className="font-mono text-primary">{q.time}</span></span>
          <span>Space: <span className="font-mono text-primary">{q.space}</span></span>
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Related questions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.slug} to="/questions/$slug" params={{ slug: r.slug }} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/50">
                <span className="font-medium">{r.title}</span>
                <DifficultyBadge d={r.difficulty} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
