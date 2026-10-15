import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ALL_TAGS, DIFF_ORDER, QUESTIONS, type Question } from "@/lib/questions";
import { TOPICS, type TopicSlug } from "@/lib/topics";
import { useProgress } from "@/lib/progress";
import { QuestionRow } from "./QuestionBits";

const PAGE = 15;
const selectCls = "h-9 rounded-md border border-input bg-surface px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function QuestionList({ fixedTopic, only }: { fixedTopic?: TopicSlug; only?: "bookmarks" }) {
  const p = useProgress();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string>(fixedTopic ?? "all");
  const [diff, setDiff] = useState("all");
  const [tag, setTag] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list: Question[] = QUESTIONS.filter((x) => {
      if (only === "bookmarks" && !p.bookmarks.includes(x.slug)) return false;
      if (topic !== "all" && x.topic !== topic) return false;
      if (diff !== "all" && x.difficulty !== diff) return false;
      if (tag !== "all" && !x.tags.includes(tag)) return false;
      if (status === "solved" && !p.solved[x.slug]) return false;
      if (status === "unsolved" && p.solved[x.slug]) return false;
      if (status === "bookmarked" && !p.bookmarks.includes(x.slug)) return false;
      if (needle && !(`${x.title} ${x.tags.join(" ")} ${x.statement} ${x.id}`.toLowerCase().includes(needle))) return false;
      return true;
    });
    if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "difficulty") list = [...list].sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);
    if (sort === "newest") list = [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    return list;
  }, [q, topic, diff, tag, status, sort, p, only]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PAGE, cur * PAGE);
  const dirty = q || (!fixedTopic && topic !== "all") || diff !== "all" || tag !== "all" || status !== "all" || sort !== "default";
  const reset = () => { setQ(""); if (!fixedTopic) setTopic("all"); setDiff("all"); setTag("all"); setStatus("all"); setSort("default"); setPage(1); };
  const on = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1); };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">Search questions</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => on(setQ)(e.target.value)}
            placeholder="Search by title, tag, keyword or ID…"
            className="h-9 w-full rounded-md border border-input bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        {!fixedTopic && (
          <select aria-label="Topic" className={selectCls} value={topic} onChange={(e) => on(setTopic)(e.target.value)}>
            <option value="all">All topics</option>
            {TOPICS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        )}
        <select aria-label="Difficulty" className={selectCls} value={diff} onChange={(e) => on(setDiff)(e.target.value)}>
          <option value="all">Any difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <select aria-label="Tag" className={selectCls} value={tag} onChange={(e) => on(setTag)(e.target.value)}>
          <option value="all">Any tag</option>
          {ALL_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select aria-label="Status" className={selectCls} value={status} onChange={(e) => on(setStatus)(e.target.value)}>
          <option value="all">Any status</option><option value="solved">Solved</option><option value="unsolved">Unsolved</option><option value="bookmarked">Bookmarked</option>
        </select>
        <select aria-label="Sort" className={selectCls} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sort: Default</option><option value="title">Title</option><option value="difficulty">Difficulty</option><option value="newest">Newest</option>
        </select>
        {dirty && (
          <button onClick={reset} className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{filtered.length} question{filtered.length === 1 ? "" : "s"}</p>
      <div className="mt-2 overflow-hidden rounded-xl border border-border bg-card">
        {shown.length ? shown.map((x) => <QuestionRow key={x.slug} q={x} />) : (
          <div className="px-6 py-14 text-center">
            <p className="font-medium">{only === "bookmarks" && !p.bookmarks.length ? "No bookmarks yet" : "No questions match these filters"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {only === "bookmarks" && !p.bookmarks.length ? "Tap the bookmark icon on any question to save it here." : "Try removing a filter or searching for something else."}
            </p>
          </div>
        )}
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="rounded-md border border-border px-3 py-1.5 hover:bg-muted disabled:opacity-40">Previous</button>
          <span className="px-2 text-muted-foreground">Page {cur} of {pages}</span>
          <button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="rounded-md border border-border px-3 py-1.5 hover:bg-muted disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
