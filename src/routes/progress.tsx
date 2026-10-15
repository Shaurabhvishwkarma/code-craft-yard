import { createFileRoute } from "@tanstack/react-router";
import { QUESTIONS, getQuestion } from "@/lib/questions";
import { TOPICS } from "@/lib/topics";
import { useProgress } from "@/lib/progress";
import { DifficultyBadge, ProgressBar, QuestionRow } from "@/components/QuestionBits";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress — CodeMaster Hub" },
      { name: "description", content: "Topic-wise and difficulty-wise progress across your C++ practice." },
      { property: "og:title", content: "My Progress — CodeMaster Hub" },
      { property: "og:description", content: "Track solved questions by topic and difficulty." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const p = useProgress();
  const solved = Object.entries(p.solved).sort((a, b) => b[1] - a[1]).map(([s]) => getQuestion(s)).filter((q) => !!q);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="mt-1 text-muted-foreground">{solved.length} of {QUESTIONS.length} solved · stored on this device</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {(["Easy", "Medium", "Hard"] as const).map((d) => {
          const all = QUESTIONS.filter((q) => q.difficulty === d);
          const s = all.filter((q) => p.solved[q.slug]).length;
          return (
            <div key={d} className="rounded-xl border border-border bg-card p-5">
              <DifficultyBadge d={d} />
              <p className="mt-2 text-2xl font-bold">{s}<span className="text-base text-muted-foreground"> / {all.length}</span></p>
              <ProgressBar className="mt-2" value={all.length ? (s / all.length) * 100 : 0} />
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold">By topic</h2>
        <div className="space-y-3">
          {TOPICS.map((t) => {
            const all = QUESTIONS.filter((q) => q.topic === t.slug);
            const s = all.filter((q) => p.solved[q.slug]).length;
            return (
              <div key={t.slug} className="flex items-center gap-4 text-sm">
                <span className="w-48 shrink-0 truncate">{t.name}</span>
                <ProgressBar value={all.length ? (s / all.length) * 100 : 0} />
                <span className="w-12 text-right font-mono text-xs text-muted-foreground">{s}/{all.length}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="mb-3 font-semibold">Solved questions</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {solved.length ? solved.map((q) => <QuestionRow key={q.slug} q={q} />) : <p className="px-6 py-10 text-center text-muted-foreground">Nothing solved yet — pass all test cases or mark a question as solved.</p>}
        </div>
      </div>
    </div>
  );
}
