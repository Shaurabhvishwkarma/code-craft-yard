import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, PlayCircle } from "lucide-react";
import { QUESTIONS, dailyQuestion, getQuestion } from "@/lib/questions";
import { TOPICS } from "@/lib/topics";
import { useProgress } from "@/lib/progress";
import { DifficultyBadge, ProgressBar, QuestionRow } from "@/components/QuestionBits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeMaster Hub — C++ & DSA Practice Dashboard" },
      { name: "description", content: "Learn C++, practise DSA questions and run your code right below every problem." },
      { property: "og:title", content: "CodeMaster Hub — C++ & DSA Practice" },
      { property: "og:description", content: "Learn. Code. Debug. Master DSA. An in-browser C++ editor under every problem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const p = useProgress();
  const solvedCount = QUESTIONS.filter((q) => p.solved[q.slug]).length;
  const daily = dailyQuestion()!;
  const recent = p.recent.map((r) => getQuestion(r.slug)).filter(Boolean).slice(0, 4);
  const continueQ = recent[0] ?? QUESTIONS.find((q) => !p.solved[q.slug]) ?? QUESTIONS[0]!;
  const byDiff = (["Easy", "Medium", "Hard"] as const).map((d) => {
    const all = QUESTIONS.filter((q) => q.difficulty === d);
    return { d, total: all.length, solved: all.filter((q) => p.solved[q.slug]).length };
  });

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card bg-glow p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">CodeMaster Hub</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Learn. Code. Debug. <span className="text-gradient">Master DSA.</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          {QUESTIONS.length} original C++ problems across {TOPICS.length} topics — each with a code editor, sample tests, hints and a full solution right on the page.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/questions/$slug" params={{ slug: continueQ.slug }} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 font-semibold text-primary-foreground shadow-elegant hover:opacity-90">
            <PlayCircle className="h-4.5 w-4.5" /> {recent.length ? "Continue practising" : "Start practising"}
          </Link>
          <Link to="/questions" className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-muted">
            Browse all questions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Solved</p>
          <p className="mt-1 text-3xl font-bold">{solvedCount}<span className="text-lg text-muted-foreground"> / {QUESTIONS.length}</span></p>
          <ProgressBar className="mt-3" value={(solvedCount / QUESTIONS.length) * 100} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">By difficulty</p>
          <div className="mt-2 space-y-2">
            {byDiff.map((x) => (
              <div key={x.d} className="flex items-center gap-3 text-sm">
                <span className="w-16"><DifficultyBadge d={x.d} /></span>
                <ProgressBar value={x.total ? (x.solved / x.total) * 100 : 0} />
                <span className="w-12 text-right font-mono text-xs text-muted-foreground">{x.solved}/{x.total}</span>
              </div>
            ))}
          </div>
        </div>
        <Link to="/questions/$slug" params={{ slug: daily.slug }} className="group rounded-xl border border-accent/40 bg-accent/10 p-5 transition-colors hover:bg-accent/15">
          <p className="flex items-center gap-1.5 text-sm text-accent"><Flame className="h-4 w-4" /> Daily challenge</p>
          <p className="mt-2 text-lg font-semibold group-hover:text-primary">{daily.title}</p>
          <div className="mt-2"><DifficultyBadge d={daily.difficulty} /></div>
        </Link>
      </section>

      {recent.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Recently practised</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {recent.map((q) => q && <QuestionRow key={q.slug} q={q} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Topics</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => {
            const all = QUESTIONS.filter((q) => q.topic === t.slug);
            const s = all.filter((q) => p.solved[q.slug]).length;
            return (
              <Link key={t.slug} to="/topics/$topic" params={{ topic: t.slug }} className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50">
                <div className="flex items-center justify-between">
                  <p className="font-medium group-hover:text-primary">{t.name}</p>
                  <span className="font-mono text-xs text-muted-foreground">{s}/{all.length}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                <ProgressBar className="mt-3" value={all.length ? (s / all.length) * 100 : 0} />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
