<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## CodeMaster Hub
- Question bank lives in `src/lib/questions.ts` (static seed, original content); keep the `Question` shape stable so it can later move to a database.
- Guest progress (solved, bookmarks, code, recent) is stored in localStorage via `src/lib/progress.ts` (useSyncExternalStore) — never read it during SSR render.
- Code execution goes only through server functions in `src/lib/judge.functions.ts` to Judge0 using `JUDGE0_API_URL`/`JUDGE0_API_KEY`; when unset, return `configured: false` and never fake output.
- Monaco is lazy-loaded client-side only (`MonacoEditor.tsx` via React.lazy after mount).
