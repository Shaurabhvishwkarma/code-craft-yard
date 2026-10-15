import { useSyncExternalStore } from "react";

export type ProgressState = {
  solved: Record<string, number>; // slug -> timestamp
  bookmarks: string[];
  code: Record<string, string>;
  recent: { slug: string; at: number }[];
  name: string;
};

const KEY = "codemaster-hub:v1";
const EMPTY: ProgressState = { solved: {}, bookmarks: [], code: {}, recent: [], name: "" };

let state: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    /* ignore corrupted storage */
  }
}

function set(fn: (s: ProgressState) => ProgressState) {
  load();
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full */
  }
  listeners.forEach((l) => l());
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      load();
      return state;
    },
    () => EMPTY,
  );
}

export const progress = {
  toggleSolved: (slug: string) =>
    set((s) => {
      const solved = { ...s.solved };
      if (solved[slug]) delete solved[slug];
      else solved[slug] = Date.now();
      return { ...s, solved };
    }),
  markSolved: (slug: string) => set((s) => (s.solved[slug] ? s : { ...s, solved: { ...s.solved, [slug]: Date.now() } })),
  toggleBookmark: (slug: string) =>
    set((s) => ({
      ...s,
      bookmarks: s.bookmarks.includes(slug) ? s.bookmarks.filter((b) => b !== slug) : [slug, ...s.bookmarks],
    })),
  saveCode: (slug: string, code: string) => set((s) => ({ ...s, code: { ...s.code, [slug]: code } })),
  visit: (slug: string) =>
    set((s) => ({ ...s, recent: [{ slug, at: Date.now() }, ...s.recent.filter((r) => r.slug !== slug)].slice(0, 12) })),
  setName: (name: string) => set((s) => ({ ...s, name })),
  reset: () => set(() => EMPTY),
};
