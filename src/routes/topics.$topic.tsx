import { createFileRoute, notFound } from "@tanstack/react-router";
import { QuestionList } from "@/components/QuestionList";
import { TOPICS } from "@/lib/topics";
import { QUESTIONS } from "@/lib/questions";

export const Route = createFileRoute("/topics/$topic")({
  loader: ({ params }) => {
    const t = TOPICS.find((x) => x.slug === params.topic);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} Practice — CodeMaster Hub` },
          { name: "description", content: `${loaderData.blurb} C++ practice problems with an in-browser editor.` },
          { property: "og:title", content: `${loaderData.name} — CodeMaster Hub` },
          { property: "og:description", content: loaderData.blurb },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Topic not found — CodeMaster Hub" }, { name: "robots", content: "noindex" }],
  }),
  component: TopicPage,
});

function TopicPage() {
  const t = Route.useLoaderData();
  const count = QUESTIONS.filter((q) => q.topic === t.slug).length;
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Topic</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{t.name}</h1>
      <p className="mt-1 mb-6 text-muted-foreground">{t.blurb} · {count} question{count === 1 ? "" : "s"}</p>
      <QuestionList key={t.slug} fixedTopic={t.slug} />
    </div>
  );
}
