import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { RESOURCES } from "@/lib/resources";
import { Tag } from "@/components/QuestionBits";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "External Coding Resources — CodeMaster Hub" },
      { name: "description", content: "A directory of LeetCode, Codeforces, CSES, cppreference and more for C++ and DSA practice." },
      { property: "og:title", content: "External Coding Resources — CodeMaster Hub" },
      { property: "og:description", content: "Where to practise C++ and DSA beyond CodeMaster Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Resources,
});

const TOPIC_LIST = Array.from(new Set(RESOURCES.flatMap((r) => r.topics))).sort();
const KINDS = Array.from(new Set(RESOURCES.map((r) => r.kind)));

function Resources() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [kind, setKind] = useState("all");
  const list = useMemo(
    () =>
      RESOURCES.filter(
        (r) =>
          (topic === "all" || r.topics.includes(topic)) &&
          (kind === "all" || r.kind === kind) &&
          `${r.name} ${r.description} ${r.topics.join(" ")}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, topic, kind],
  );
  const sel = "h-9 rounded-md border border-input bg-surface px-2.5 text-sm";
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">External Resources</h1>
      <p className="mt-1 text-muted-foreground">Official links only. We link out rather than copying anyone's problem statements.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <label className="relative min-w-56 flex-1">
          <span className="sr-only">Search resources</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search platforms…" className="h-9 w-full rounded-md border border-input bg-surface pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <select aria-label="Type" className={sel} value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="all">All types</option>{KINDS.map((k) => <option key={k}>{k}</option>)}
        </select>
        <select aria-label="Topic" className={sel} value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="all">All topics</option>{TOPIC_LIST.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {list.map((r) => (
          <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold group-hover:text-primary">{r.name}</p>
                <p className="text-xs text-accent">{r.kind}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{r.topics.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            <p className="mt-3 text-xs text-muted-foreground">Difficulty: {r.difficulty}</p>
          </a>
        ))}
        {!list.length && <p className="text-muted-foreground">No resources match.</p>}
      </div>
    </div>
  );
}
