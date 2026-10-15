import { Link } from "@tanstack/react-router";
import { Bookmark, CheckCircle2 } from "lucide-react";
import type { Difficulty, Question } from "@/lib/questions";
import { topicName } from "@/lib/topics";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const diffClass: Record<Difficulty, string> = {
  Easy: "text-easy bg-easy/10 border-easy/30",
  Medium: "text-medium bg-medium/10 border-medium/30",
  Hard: "text-hard bg-hard/10 border-hard/30",
};

export function DifficultyBadge({ d }: { d: Difficulty }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", diffClass[d])}>{d}</span>;
}

export function Tag({ children }: { children: string }) {
  return <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{children}</span>;
}

export function QuestionRow({ q }: { q: Question }) {
  const p = useProgress();
  const solved = !!p.solved[q.slug];
  const marked = p.bookmarks.includes(q.slug);
  return (
    <Link
      to="/questions/$slug"
      params={{ slug: q.slug }}
      className="group flex items-center gap-4 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-muted/50"
    >
      <CheckCircle2 className={cn("h-4.5 w-4.5 shrink-0", solved ? "text-success" : "text-border")} aria-label={solved ? "Solved" : "Unsolved"} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">#{q.id}</span>
          <span className="truncate font-medium group-hover:text-primary">{q.title}</span>
          {marked && <Bookmark className="h-3.5 w-3.5 fill-accent text-accent" />}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{topicName(q.topic)}</span>
          {q.tags.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>
      <DifficultyBadge d={q.difficulty} />
    </Link>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
