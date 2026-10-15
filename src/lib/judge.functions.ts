import { createServerFn } from "@tanstack/react-start";
import { getQuestion } from "./questions";

export type ExecStatus =
  | "Accepted" | "Wrong Answer" | "Compilation Error" | "Runtime Error"
  | "Time Limit Exceeded" | "Ran" | "Internal Error";

export type ExecResult = {
  status: ExecStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  time: string | null;
  memory: number | null;
};

export type RunResponse =
  | { configured: false; message: string }
  | { configured: true; ok: false; message: string }
  | { configured: true; ok: true; result: ExecResult };

export type SubmitResponse =
  | { configured: false; message: string }
  | { configured: true; ok: false; message: string }
  | {
      configured: true; ok: true; verdict: ExecStatus; passed: number; total: number;
      results: (ExecResult & { input: string; expected: string; hidden: boolean })[];
    };

// Judge0 language ids: 54 = C++ (GCC 9.2, C++17 default); 105 = C++ (GCC 14.1) on newer Judge0 CE instances
const LANGS: Record<string, number> = { "c++17": 54, "c++20": 105 };
const MAX_SOURCE = 64 * 1024;
const MAX_INPUT = 64 * 1024;

const b64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
};
const unb64 = (s: string | null | undefined) => {
  if (!s) return "";
  const bin = atob(s);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

export const normalize = (s: string) => s.replace(/\r/g, "").split("\n").map((l) => l.trimEnd()).join("\n").trim();

function config() {
  const url = process.env["JUDGE0_API_URL"];
  const key = process.env["JUDGE0_API_KEY"];
  if (!url) return null;
  return { url: url.replace(/\/$/, ""), key };
}

const NOT_CONFIGURED =
  "Code execution is not configured yet. Add a Judge0 endpoint (JUDGE0_API_URL and JUDGE0_API_KEY) to enable Run and Submit.";

async function execute(cfg: { url: string; key?: string | undefined }, source: string, stdin: string, lang: string): Promise<ExecResult> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cfg.key) {
    if (cfg.url.includes("rapidapi")) {
      headers["X-RapidAPI-Key"] = cfg.key;
      headers["X-RapidAPI-Host"] = new URL(cfg.url).host;
    } else {
      headers["X-Auth-Token"] = cfg.key;
    }
  }
  const res = await fetch(`${cfg.url}/submissions?base64_encoded=true&wait=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      language_id: LANGS[lang] ?? 54,
      source_code: b64(source),
      stdin: b64(stdin),
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
    }),
  });
  if (res.status === 429) throw new Error("The execution service is rate-limiting requests. Please wait a moment and try again.");
  if (!res.ok) throw new Error(`Execution service returned ${res.status}.`);
  const j = (await res.json()) as {
    status?: { id: number }; stdout?: string; stderr?: string; compile_output?: string; time?: string; memory?: number; message?: string;
  };
  const id = j.status?.id ?? 13;
  const status: ExecStatus =
    id === 3 ? "Ran" : id === 5 ? "Time Limit Exceeded" : id === 6 ? "Compilation Error" : id >= 7 && id <= 12 ? "Runtime Error" : id === 4 ? "Wrong Answer" : "Internal Error";
  return {
    status,
    stdout: unb64(j.stdout),
    stderr: unb64(j.stderr) || (status === "Internal Error" ? unb64(j.message) : ""),
    compileOutput: unb64(j.compile_output),
    time: j.time ?? null,
    memory: j.memory ?? null,
  };
}

type RunInput = { source: string; stdin: string; lang: string };
const validateRun = (d: RunInput): RunInput => {
  if (typeof d?.source !== "string" || d.source.length > MAX_SOURCE) throw new Error("Source code is missing or too large.");
  return { source: d.source, stdin: String(d.stdin ?? "").slice(0, MAX_INPUT), lang: d.lang === "c++20" ? "c++20" : "c++17" };
};

export const runCode = createServerFn({ method: "POST" })
  .inputValidator(validateRun)
  .handler(async ({ data }): Promise<RunResponse> => {
    const cfg = config();
    if (!cfg) return { configured: false, message: NOT_CONFIGURED };
    try {
      return { configured: true, ok: true, result: await execute(cfg, data.source, data.stdin, data.lang) };
    } catch (e) {
      return { configured: true, ok: false, message: e instanceof Error ? e.message : "Execution failed." };
    }
  });

type SubmitInput = { source: string; slug: string; lang: string };
export const submitCode = createServerFn({ method: "POST" })
  .inputValidator((d: SubmitInput): SubmitInput => {
    if (typeof d?.source !== "string" || d.source.length > MAX_SOURCE) throw new Error("Source code is missing or too large.");
    if (typeof d.slug !== "string") throw new Error("Unknown question.");
    return { source: d.source, slug: d.slug, lang: d.lang === "c++20" ? "c++20" : "c++17" };
  })
  .handler(async ({ data }): Promise<SubmitResponse> => {
    const cfg = config();
    if (!cfg) return { configured: false, message: NOT_CONFIGURED };
    const q = getQuestion(data.slug);
    if (!q) return { configured: true, ok: false, message: "Unknown question." };
    const cases = [
      ...q.samples.map((t) => ({ ...t, hidden: false })),
      ...q.tests.map((t) => ({ ...t, hidden: true })),
    ].slice(0, 20);
    const results: (ExecResult & { input: string; expected: string; hidden: boolean })[] = [];
    try {
      for (const c of cases) {
        const r = await execute(cfg, data.source, c.input, data.lang);
        if (r.status === "Ran") r.status = normalize(r.stdout) === normalize(c.output) ? "Accepted" : "Wrong Answer";
        results.push({ ...r, input: c.hidden ? "" : c.input, expected: c.hidden ? "" : c.output, hidden: c.hidden, stdout: c.hidden && r.status !== "Accepted" ? "" : r.stdout });
        if (r.status === "Compilation Error") break;
      }
    } catch (e) {
      return { configured: true, ok: false, message: e instanceof Error ? e.message : "Execution failed." };
    }
    const passed = results.filter((r) => r.status === "Accepted").length;
    const firstBad = results.find((r) => r.status !== "Accepted");
    return { configured: true, ok: true, verdict: firstBad ? firstBad.status : "Accepted", passed, total: cases.length, results };
  });
