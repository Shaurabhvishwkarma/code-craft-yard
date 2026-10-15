import { createFileRoute } from "@tanstack/react-router";
import { progress, useProgress } from "@/lib/progress";
import { QUESTIONS } from "@/lib/questions";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CodeMaster Hub" },
      { name: "description", content: "Your guest profile and saved practice data." },
      { property: "og:title", content: "Profile — CodeMaster Hub" },
      { property: "og:description", content: "Your guest profile on CodeMaster Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const p = useProgress();
  const solved = QUESTIONS.filter((q) => p.solved[q.slug]).length;
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">You're practising as a guest. Everything is saved in this browser only.</p>
        <label className="mt-4 block">
          <span className="text-sm font-medium">Display name</span>
          <input value={p.name} onChange={(e) => progress.setName(e.target.value)} placeholder="Your name" className="mt-1.5 h-10 w-full rounded-md border border-input bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <dl className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div><dt className="text-xs text-muted-foreground">Solved</dt><dd className="text-2xl font-bold">{solved}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Bookmarks</dt><dd className="text-2xl font-bold">{p.bookmarks.length}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Saved drafts</dt><dd className="text-2xl font-bold">{Object.keys(p.code).length}</dd></div>
        </dl>
      </div>
      <button
        onClick={() => confirm("Clear all solved questions, bookmarks and saved code on this device?") && progress.reset()}
        className="rounded-md border border-destructive/50 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
      >
        Reset local progress
      </button>
    </div>
  );
}
