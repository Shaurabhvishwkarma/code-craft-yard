export type TopicSlug =
  | "fundamentals" | "loops" | "patterns" | "recursion" | "arrays" | "strings"
  | "searching-sorting" | "linked-lists" | "stacks-queues" | "trees" | "graphs"
  | "dp" | "greedy" | "backtracking" | "stl-oop" | "competitive";

export const TOPICS: { slug: TopicSlug; name: string; blurb: string }[] = [
  { slug: "fundamentals", name: "C++ Fundamentals", blurb: "I/O, variables, operators and conditionals." },
  { slug: "loops", name: "Loop Practice", blurb: "for, while and number-based challenges." },
  { slug: "patterns", name: "Pattern Printing", blurb: "Stars, numbers, pyramids and triangles." },
  { slug: "recursion", name: "Recursion", blurb: "Think in smaller subproblems." },
  { slug: "arrays", name: "Arrays", blurb: "Traversal, prefix sums, two pointers, sliding window." },
  { slug: "strings", name: "Strings", blurb: "Character manipulation and hashing." },
  { slug: "searching-sorting", name: "Searching & Sorting", blurb: "Binary search and classic sorts." },
  { slug: "linked-lists", name: "Linked Lists", blurb: "Nodes, pointers and reversal." },
  { slug: "stacks-queues", name: "Stacks & Queues", blurb: "LIFO, FIFO and monotonic structures." },
  { slug: "trees", name: "Trees & BST", blurb: "Traversals, heights and binary search trees." },
  { slug: "graphs", name: "Graph Algorithms", blurb: "BFS, DFS, shortest paths and components." },
  { slug: "dp", name: "Dynamic Programming", blurb: "Memoisation and tabulation." },
  { slug: "greedy", name: "Greedy Algorithms", blurb: "Locally optimal choices." },
  { slug: "backtracking", name: "Backtracking", blurb: "Explore, choose, un-choose." },
  { slug: "stl-oop", name: "C++ STL & OOP", blurb: "vector, map, set, classes and more." },
  { slug: "competitive", name: "Competitive Programming", blurb: "Bit tricks, number theory, fast I/O." },
];

export const topicName = (slug: string) => TOPICS.find((t) => t.slug === slug)?.name ?? slug;
