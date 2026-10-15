import { createFileRoute } from "@tanstack/react-router";
import { QuestionList } from "@/components/QuestionList";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — CodeMaster Hub" },
      { name: "description", content: "Your saved C++ and DSA questions." },
      { property: "og:title", content: "Bookmarks — CodeMaster Hub" },
      { property: "og:description", content: "Your saved C++ and DSA questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
      <p className="mt-1 mb-6 text-muted-foreground">Saved on this device.</p>
      <QuestionList only="bookmarks" />
    </div>
  ),
});
