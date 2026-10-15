export type Resource = {
  name: string;
  url: string;
  kind: "Practice" | "Contests" | "Learning" | "Reference" | "Dataset";
  description: string;
  topics: string[];
  difficulty: string;
};

export const RESOURCES: Resource[] = [
  { name: "LeetCode", url: "https://leetcode.com/problemset/", kind: "Practice", description: "Interview-style problems with an online judge and discussion.", topics: ["Arrays", "Strings", "DP", "Graphs", "Trees"], difficulty: "Easy / Medium / Hard labels" },
  { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/explore", kind: "Practice", description: "Articles and practice problems across DSA and C++.", topics: ["Arrays", "Recursion", "DP", "C++"], difficulty: "School → Hard labels" },
  { name: "HackerRank", url: "https://www.hackerrank.com/domains/cpp", kind: "Practice", description: "Skill tracks including a dedicated C++ domain.", topics: ["C++", "Algorithms", "Data Structures"], difficulty: "Easy / Medium / Hard" },
  { name: "HackerEarth", url: "https://www.hackerearth.com/practice/", kind: "Practice", description: "Topic-wise practice with tutorials and hiring challenges.", topics: ["Algorithms", "Data Structures", "Math"], difficulty: "Easy / Medium / Hard" },
  { name: "Codeforces", url: "https://codeforces.com/problemset", kind: "Contests", description: "Regular rated contests and a huge problem archive.", topics: ["Greedy", "Math", "DP", "Graphs"], difficulty: "Numeric rating 800–3500" },
  { name: "CodeChef", url: "https://www.codechef.com/practice", kind: "Contests", description: "Weekly Starters contests and guided practice paths.", topics: ["Greedy", "Math", "DP"], difficulty: "Difficulty rating" },
  { name: "AtCoder", url: "https://atcoder.jp/contests/", kind: "Contests", description: "High-quality weekly ABC/ARC/AGC contests.", topics: ["Math", "DP", "Graphs"], difficulty: "Contest tier + point value" },
  { name: "SPOJ", url: "https://www.spoj.com/problems/classical/", kind: "Practice", description: "Classic archive with thousands of problems.", topics: ["Graphs", "DP", "Number Theory"], difficulty: "Community-rated" },
  { name: "Kattis", url: "https://open.kattis.com/problems", kind: "Practice", description: "Problems used in ICPC contests worldwide.", topics: ["Algorithms", "Geometry", "Graphs"], difficulty: "Numeric difficulty 1–10" },
  { name: "CSES Problem Set", url: "https://cses.fi/problemset/", kind: "Practice", description: "A curated set of ~300 essential competitive programming problems.", topics: ["Sorting", "DP", "Graphs", "Trees", "Range Queries"], difficulty: "Ordered by section" },
  { name: "USACO Guide", url: "https://usaco.guide/", kind: "Learning", description: "Structured curriculum from Bronze to Platinum.", topics: ["Prefix Sums", "Graphs", "DP", "Segment Trees"], difficulty: "Bronze / Silver / Gold / Platinum" },
  { name: "Project Euler", url: "https://projecteuler.net/archives", kind: "Practice", description: "Mathematical programming challenges.", topics: ["Math", "Number Theory"], difficulty: "Percentage difficulty" },
  { name: "InterviewBit", url: "https://www.interviewbit.com/practice/", kind: "Practice", description: "Interview preparation organised by topic.", topics: ["Arrays", "Trees", "DP"], difficulty: "Topic levels" },
  { name: "LearnCpp", url: "https://www.learncpp.com/", kind: "Learning", description: "Free, thorough C++ tutorial from basics to advanced.", topics: ["C++", "OOP", "Templates"], difficulty: "Beginner → Advanced" },
  { name: "cppreference", url: "https://en.cppreference.com/w/", kind: "Reference", description: "The definitive reference for C++ language and STL.", topics: ["C++", "STL"], difficulty: "Reference" },
  { name: "GitHub: TheAlgorithms/C-Plus-Plus", url: "https://github.com/TheAlgorithms/C-Plus-Plus", kind: "Dataset", description: "Open-source (MIT) implementations of classic algorithms in C++.", topics: ["Algorithms", "Data Structures"], difficulty: "n/a" },
];
