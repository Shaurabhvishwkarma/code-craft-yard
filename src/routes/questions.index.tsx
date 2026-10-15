import { createFileRoute } from "@tanstack/react-router";
import { QuestionList } from "@/components/QuestionList";
import { QUESTIONS } from "@/lib/questions";

export const Route = createFileRoute("/questions/")({
  head: () => ({
    meta: [
      { title: "All Questions — CodeMaster Hub" },
      { name: "description", content: "Search and filter every C++ and DSA practice question by topic, difficulty, tag and status." },
      { property: "og:title", content: "All Questions — CodeMaster Hub" },
      { property: "og:description", content: "Search and filter C++ & DSA practice problems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">All Questions</h1>
      <p className="mt-1 mb-6 text-muted-foreground">{QUESTIONS.length} original problems. Every filter works together.</p>
      <QuestionList />
    </div>
  ),
});
