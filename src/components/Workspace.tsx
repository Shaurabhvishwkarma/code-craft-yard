import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Check, Copy, Expand, Loader2, Minimize2, Play, RotateCcw, Send, Wand2, X } from "lucide-react";
import type { Question } from "@/lib/questions";
import { progress, useProgress } from "@/lib/progress";
import { runCode, submitCode, type RunResponse, type SubmitResponse, type ExecStatus } from "@/lib/judge.functions";
import { cn } from "@/lib/utils";

const MonacoEditor = lazy(() => import("./MonacoEditor"));

function formatCpp(src: string) {
  let depth = 0;
  return src
    .split("\n")
    .map((raw) => {
      const line = raw.trim();
      if (!line) return "";
      const opens = (line.match(/{/g) || []).length;
      const closes = (line.match(/}/g) || []).length;
      const lead = line.startsWith("}") ? 1 : 0;
      const out = "    ".repeat(Math.max(0, depth - lead)) + line;
      depth = Math.max(0, depth + opens - closes);
      return out;
    })
    .join("\n");
}

const statusColor = (s: ExecStatus) =>
  s === "Accepted" || s === "Ran" ? "text-success" : s === "Wrong Answer" || s === "Time Limit Exceeded" ? "text-medium" : "text-destructive";

const btn = "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function Workspace({ q }: { q: Question }) {
  const p = useProgress();
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState(q.starter);
  const [lang, setLang] = useState("c++17");
  const [stdin, setStdin] = useState(q.samples[0]?.input ?? "");
  const [full, setFull] = useState(false);
  const [busy, setBusy] = useState<null | "run" | "submit">(null);
  const [run, setRun] = useState<RunResponse | null>(null);
  const [sub, setSub] = useState<SubmitResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMounted(true);
    setCode(p.code[q.slug] ?? q.starter);
    setStdin(q.samples[0]?.input ?? "");
    setRun(null);
    setSub(null);
    progress.visit(q.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.slug]);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  const update = (v: string) => {
    setCode(v);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => progress.saveCode(q.slug, v), 400);
  };

  const doRun = async () => {
    setBusy("run"); setSub(null);
    try { setRun(await runCode({ data: { source: code, stdin, lang } })); }
    catch (e) { setRun({ configured: true, ok: false, message: e instanceof Error ? e.message : "Request failed." }); }
    setBusy(null);
  };
  const doSubmit = async () => {
    setBusy("submit"); setRun(null);
    try {
      const r = await submitCode({ data: { source: code, slug: q.slug, lang } });
      setSub(r);
      if (r.configured && r.ok && r.verdict === "Accepted") progress.markSolved(q.slug);
    } catch (e) { setSub({ configured: true, ok: false, message: e instanceof Error ? e.message : "Request failed." }); }
    setBusy(null);
  };

  const editorHeight = full ? "calc(100vh - 56px)" : "440px";

  return (
    <section aria-label="Code editor" className="space-y-4">
      <div className={cn("overflow-hidden rounded-xl border border-border bg-code", full && "fixed inset-0 z-50 rounded-none")}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">main.cpp</span>
            <select aria-label="C++ standard" value={lang} onChange={(e) => setLang(e.target.value)} className="h-7 rounded border border-input bg-code px-1.5 text-xs">
              <option value="c++17">C++17</option>
              <option value="c++20">C++20</option>
            </select>
          </div>
          <div className="flex items-center gap-0.5">
            <button className={btn} onClick={() => update(formatCpp(code))}><Wand2 className="h-3.5 w-3.5" />Format</button>
            <button className={btn} onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}Copy
            </button>
            <button className={btn} onClick={() => { if (confirm("Reset to starter code? Your current code will be lost.")) update(q.starter); }}><RotateCcw className="h-3.5 w-3.5" />Reset</button>
            <button className={btn} onClick={() => setFull(!full)} aria-label={full ? "Exit full screen" : "Full screen"}>
              {full ? <Minimize2 className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
        {mounted ? (
          <Suspense fallback={<div style={{ height: editorHeight }} className="p-4 font-mono text-sm text-muted-foreground">Loading editor…</div>}>
            <MonacoEditor value={code} onChange={update} height={editorHeight} />
          </Suspense>
        ) : (
          <pre style={{ height: editorHeight }} className="overflow-auto p-4 text-sm">{code}</pre>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Custom input</span>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={5}
            spellCheck={false}
            className="mt-2 w-full resize-y rounded-lg border border-input bg-code p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <div className="flex flex-col justify-end gap-2">
          <button onClick={doRun} disabled={!!busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50">
            {busy === "run" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run code
          </button>
          <button onClick={doSubmit} disabled={!!busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-primary-foreground shadow-elegant transition-opacity hover:opacity-90 disabled:opacity-50">
            {busy === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit against test cases
          </button>
          <button onClick={() => progress.toggleSolved(q.slug)} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            {p.solved[q.slug] ? "Marked as solved — undo" : "Mark as solved manually"}
          </button>
        </div>
      </div>

      <Output run={run} sub={sub} />
    </section>
  );
}

function NotConfigured({ message }: { message: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-medium/40 bg-medium/10 p-4 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-medium" />
      <div>
        <p className="font-medium text-medium">Execution not configured — your code was not run.</p>
        <p className="mt-1 text-muted-foreground">{message} <Link to="/setup" className="text-primary hover:underline">Setup guide →</Link></p>
      </div>
    </div>
  );
}

function Pre({ label, text, tone }: { label: string; text: string; tone?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <pre className={cn("mt-1.5 max-h-72 overflow-auto rounded-lg bg-code p-3 text-sm whitespace-pre-wrap", tone)}>{text || <span className="text-muted-foreground">(empty)</span>}</pre>
    </div>
  );
}

function Output({ run, sub }: { run: RunResponse | null; sub: SubmitResponse | null }) {
  const r = run ?? sub;
  if (!r) return null;
  if (!r.configured) return <NotConfigured message={r.message} />;
  if (!r.ok) return <div className="flex gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"><X className="h-4 w-4" />{r.message}</div>;

  if (run && run.configured && run.ok) {
    const x = run.result;
    return (
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className={cn("font-semibold", statusColor(x.status))}>{x.status === "Ran" ? "Executed" : x.status}</span>
          {x.time && <span className="text-muted-foreground">{x.time}s</span>}
          {x.memory != null && <span className="text-muted-foreground">{(x.memory / 1024).toFixed(1)} MB</span>}
        </div>
        {x.compileOutput && <Pre label="Compiler output" text={x.compileOutput} tone="text-destructive" />}
        {x.status !== "Compilation Error" && <Pre label="Output" text={x.stdout} />}
        {x.stderr && <Pre label="Error output" text={x.stderr} tone="text-destructive" />}
      </div>
    );
  }
  if (sub && sub.configured && sub.ok) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className={cn("text-lg font-semibold", statusColor(sub.verdict))}>{sub.verdict}</span>
          <span className="text-sm text-muted-foreground">{sub.passed} / {sub.total} test cases passed</span>
        </div>
        <ul className="space-y-2">
          {sub.results.map((t, i) => (
            <li key={i} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Test {i + 1} {t.hidden && <span className="text-xs text-muted-foreground">(hidden)</span>}</span>
                <span className={cn("font-medium", statusColor(t.status))}>{t.status}{t.time ? ` · ${t.time}s` : ""}</span>
              </div>
              {t.compileOutput && <pre className="mt-2 max-h-56 overflow-auto rounded bg-code p-2 text-xs text-destructive whitespace-pre-wrap">{t.compileOutput}</pre>}
              {!t.hidden && t.status !== "Accepted" && t.status !== "Compilation Error" && (
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <Pre label="Input" text={t.input} />
                  <Pre label="Expected" text={t.expected} />
                  <Pre label="Your output" text={t.stdout} />
                </div>
              )}
              {t.stderr && <pre className="mt-2 max-h-40 overflow-auto rounded bg-code p-2 text-xs text-destructive whitespace-pre-wrap">{t.stderr}</pre>}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}
