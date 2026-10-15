import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Code Execution Setup — CodeMaster Hub" },
      { name: "description", content: "How to connect a Judge0 execution service so Run and Submit work." },
      { property: "og:title", content: "Code Execution Setup — CodeMaster Hub" },
      { property: "og:description", content: "Connect Judge0 to run C++ code securely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Setup,
});

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-primary-foreground">{n}</span>
      <div className="pt-0.5 text-[15px] leading-relaxed">{children}</div>
    </li>
  );
}

function Setup() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Code execution setup</h1>
      <p className="text-muted-foreground">
        Code never runs on this website's server. Run and Submit send your code to an isolated Judge0 sandbox. Until one is connected, the editor works but shows “Execution not configured” instead of any output.
      </p>
      <ol className="space-y-5 rounded-xl border border-border bg-card p-6">
        <Step n={1}>Get a Judge0 endpoint — either the hosted <a className="text-primary hover:underline" href="https://rapidapi.com/judge0-official/api/judge0-ce" target="_blank" rel="noreferrer">Judge0 CE on RapidAPI</a> or your own self-hosted Judge0.</Step>
        <Step n={2}>Add the secret <code className="rounded bg-muted px-1.5">JUDGE0_API_URL</code> — e.g. <code className="rounded bg-muted px-1.5">https://judge0-ce.p.rapidapi.com</code>.</Step>
        <Step n={3}>Add the secret <code className="rounded bg-muted px-1.5">JUDGE0_API_KEY</code> — your RapidAPI key (or the auth token of your self-hosted instance).</Step>
        <Step n={4}>Open any question, press <b>Run code</b>, and you should see real output, time and memory.</Step>
      </ol>
      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">
        Limits per run: 2 s CPU, 5 s wall time, 256 MB memory, 64 KB source. Submissions run up to 20 test cases. C++20 requires a Judge0 instance that offers GCC 14.
      </div>
    </div>
  );
}
