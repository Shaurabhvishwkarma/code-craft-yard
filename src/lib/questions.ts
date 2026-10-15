import type { TopicSlug } from "./topics";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type TestCase = { input: string; output: string; explanation?: string };

export type Question = {
  id: number;
  slug: string;
  title: string;
  topic: TopicSlug;
  difficulty: Difficulty;
  tags: string[];
  source: string; // "CodeMaster Hub (original)"
  sourceUrl?: string;
  license: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  samples: TestCase[];
  tests: TestCase[]; // hidden tests (samples are also judged)
  hint: string;
  approach: string;
  solution: string;
  time: string;
  space: string;
  starter: string;
  addedAt: string;
};

const STARTER = `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Write your solution here

    return 0;
}
`;

const wrap = (body: string) => `#include <bits/stdc++.h>
using namespace std;

${body.trim()}
`;

type Seed = Omit<Question, "id" | "source" | "license" | "starter" | "addedAt"> & { starter?: string };

const seeds: Seed[] = [
  // ---------- Fundamentals ----------
  {
    slug: "sum-of-two-numbers", title: "Sum of Two Numbers", topic: "fundamentals", difficulty: "Easy",
    tags: ["io", "math"],
    statement: "Read two integers A and B and print their sum.",
    inputFormat: "A single line with two integers A and B.", outputFormat: "Print A + B.",
    constraints: ["-10^9 ≤ A, B ≤ 10^9"],
    samples: [{ input: "3 5", output: "8", explanation: "3 + 5 = 8" }],
    tests: [{ input: "-4 4", output: "0" }, { input: "1000000000 1000000000", output: "2000000000" }],
    hint: "The sum can exceed the range of int.", approach: "Use long long for both values and print the sum.",
    solution: wrap(`int main(){ long long a,b; cin>>a>>b; cout<<a+b<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  {
    slug: "even-or-odd", title: "Even or Odd", topic: "fundamentals", difficulty: "Easy", tags: ["conditionals", "math"],
    statement: "Given an integer N, print \"Even\" if it is even, otherwise print \"Odd\".",
    inputFormat: "A single integer N.", outputFormat: "Even or Odd.", constraints: ["-10^9 ≤ N ≤ 10^9"],
    samples: [{ input: "4", output: "Even" }, { input: "7", output: "Odd" }],
    tests: [{ input: "0", output: "Even" }, { input: "-3", output: "Odd" }],
    hint: "Use the modulo operator.", approach: "N % 2 == 0 means even. Be careful: -3 % 2 is -1 in C++.",
    solution: wrap(`int main(){ long long n; cin>>n; cout<<(n%2==0?"Even":"Odd")<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  {
    slug: "largest-of-three", title: "Largest of Three", topic: "fundamentals", difficulty: "Easy", tags: ["conditionals"],
    statement: "Given three integers, print the largest one.",
    inputFormat: "Three integers a b c.", outputFormat: "The maximum value.", constraints: ["-10^9 ≤ a, b, c ≤ 10^9"],
    samples: [{ input: "3 9 2", output: "9" }], tests: [{ input: "-1 -5 -3", output: "-1" }, { input: "7 7 7", output: "7" }],
    hint: "Compare pairwise, or use std::max.", approach: "max({a, b, c}) returns the largest from an initializer list.",
    solution: wrap(`int main(){ long long a,b,c; cin>>a>>b>>c; cout<<max({a,b,c})<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  // ---------- Loops ----------
  {
    slug: "print-1-to-n", title: "Print 1 to N", topic: "loops", difficulty: "Easy", tags: ["for-loop"],
    statement: "Print all integers from 1 to N separated by spaces.",
    inputFormat: "A single integer N.", outputFormat: "Numbers 1..N on one line separated by a space.", constraints: ["1 ≤ N ≤ 1000"],
    samples: [{ input: "5", output: "1 2 3 4 5" }], tests: [{ input: "1", output: "1" }, { input: "3", output: "1 2 3" }],
    hint: "A for loop from 1 to N inclusive.", approach: "Loop i = 1..N, print i followed by a space (except after the last).",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=1;i<=n;i++) cout<<i<<(i==n?"\\n":" "); }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "print-n-to-1", title: "Print N to 1", topic: "loops", difficulty: "Easy", tags: ["for-loop"],
    statement: "Print all integers from N down to 1 separated by spaces.",
    inputFormat: "A single integer N.", outputFormat: "Numbers N..1 separated by a space.", constraints: ["1 ≤ N ≤ 1000"],
    samples: [{ input: "4", output: "4 3 2 1" }], tests: [{ input: "1", output: "1" }, { input: "6", output: "6 5 4 3 2 1" }],
    hint: "Count downwards.", approach: "Loop i = N down to 1.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=n;i>=1;i--) cout<<i<<(i==1?"\\n":" "); }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "sum-of-natural-numbers", title: "Sum of First N Natural Numbers", topic: "loops", difficulty: "Easy", tags: ["math", "for-loop"],
    statement: "Print the sum 1 + 2 + ... + N.",
    inputFormat: "A single integer N.", outputFormat: "The sum.", constraints: ["1 ≤ N ≤ 10^6"],
    samples: [{ input: "5", output: "15", explanation: "1+2+3+4+5 = 15" }], tests: [{ input: "1", output: "1" }, { input: "1000000", output: "500000500000" }],
    hint: "The answer may not fit in int.", approach: "Either loop and accumulate in long long, or use N*(N+1)/2.",
    solution: wrap(`int main(){ long long n; cin>>n; cout<<n*(n+1)/2<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  {
    slug: "multiplication-table", title: "Multiplication Table", topic: "loops", difficulty: "Easy", tags: ["for-loop"],
    statement: "Print the multiplication table of N from 1 to 10 in the format `N x i = value`, one per line.",
    inputFormat: "A single integer N.", outputFormat: "10 lines.", constraints: ["1 ≤ N ≤ 1000"],
    samples: [{ input: "2", output: "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20" }],
    tests: [{ input: "1", output: "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10" }],
    hint: "Loop i from 1 to 10.", approach: "Print N, \" x \", i, \" = \", N*i on each line.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=1;i<=10;i++) cout<<n<<" x "<<i<<" = "<<n*i<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  {
    slug: "factorial-iterative", title: "Factorial", topic: "loops", difficulty: "Easy", tags: ["math", "for-loop"],
    statement: "Print N! (N factorial).",
    inputFormat: "A single integer N.", outputFormat: "N!", constraints: ["0 ≤ N ≤ 20"],
    samples: [{ input: "5", output: "120" }], tests: [{ input: "0", output: "1" }, { input: "20", output: "2432902008176640000" }],
    hint: "0! is 1. 20! fits in long long.", approach: "Multiply an accumulator by 1..N.",
    solution: wrap(`int main(){ int n; cin>>n; long long f=1; for(int i=2;i<=n;i++) f*=i; cout<<f<<"\\n"; }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "count-and-sum-digits", title: "Count and Sum of Digits", topic: "loops", difficulty: "Easy", tags: ["digits", "while-loop"],
    statement: "Given a non-negative integer N, print the number of digits and the sum of its digits separated by a space.",
    inputFormat: "A single integer N.", outputFormat: "count sum", constraints: ["0 ≤ N ≤ 10^18"],
    samples: [{ input: "4096", output: "4 19" }], tests: [{ input: "0", output: "1 0" }, { input: "999", output: "3 27" }],
    hint: "Use n % 10 and n / 10.", approach: "Extract the last digit repeatedly. Handle 0 separately (1 digit).",
    solution: wrap(`int main(){ long long n; cin>>n; if(n==0){cout<<"1 0\\n";return 0;} int c=0; long long s=0; while(n){s+=n%10;n/=10;c++;} cout<<c<<" "<<s<<"\\n"; }`), time: "O(log N)", space: "O(1)",
  },
  {
    slug: "reverse-a-number", title: "Reverse a Number", topic: "loops", difficulty: "Easy", tags: ["digits"],
    statement: "Reverse the digits of a non-negative integer N. Leading zeros in the result are dropped.",
    inputFormat: "A single integer N.", outputFormat: "The reversed number.", constraints: ["0 ≤ N ≤ 10^9"],
    samples: [{ input: "1234", output: "4321" }, { input: "1200", output: "21" }], tests: [{ input: "0", output: "0" }, { input: "7", output: "7" }],
    hint: "Build the answer as rev = rev*10 + digit.", approach: "Pop digits from N and push them onto rev.",
    solution: wrap(`int main(){ long long n,r=0; cin>>n; while(n){r=r*10+n%10;n/=10;} cout<<r<<"\\n"; }`), time: "O(log N)", space: "O(1)",
  },
  {
    slug: "palindrome-number", title: "Palindrome Number", topic: "loops", difficulty: "Easy", tags: ["digits"],
    statement: "Print \"Yes\" if N reads the same backwards, otherwise \"No\".",
    inputFormat: "A single integer N.", outputFormat: "Yes or No.", constraints: ["0 ≤ N ≤ 10^9"],
    samples: [{ input: "121", output: "Yes" }, { input: "123", output: "No" }], tests: [{ input: "0", output: "Yes" }, { input: "1221", output: "Yes" }, { input: "10", output: "No" }],
    hint: "Compare N with its reverse.", approach: "Reverse N into a separate variable and compare.",
    solution: wrap(`int main(){ long long n,r=0; cin>>n; long long m=n; while(m){r=r*10+m%10;m/=10;} cout<<(r==n?"Yes":"No")<<"\\n"; }`), time: "O(log N)", space: "O(1)",
  },
  {
    slug: "primes-in-range", title: "Primes up to N", topic: "loops", difficulty: "Medium", tags: ["prime", "sieve", "math"],
    statement: "Print all prime numbers ≤ N separated by spaces. If there are none print -1.",
    inputFormat: "A single integer N.", outputFormat: "Primes separated by spaces, or -1.", constraints: ["1 ≤ N ≤ 10^6"],
    samples: [{ input: "10", output: "2 3 5 7" }], tests: [{ input: "1", output: "-1" }, { input: "2", output: "2" }, { input: "30", output: "2 3 5 7 11 13 17 19 23 29" }],
    hint: "Trial division up to √i, or the Sieve of Eratosthenes.", approach: "Mark multiples of each prime p starting at p*p as composite.",
    solution: wrap(`int main(){ int n; cin>>n; vector<bool> c(n+1,false); vector<int> p; for(int i=2;i<=n;i++){ if(!c[i]){p.push_back(i); for(long long j=1LL*i*i;j<=n;j+=i) c[j]=true;} } if(p.empty()){cout<<-1<<"\\n";return 0;} for(size_t i=0;i<p.size();i++) cout<<p[i]<<(i+1==p.size()?"\\n":" "); }`), time: "O(N log log N)", space: "O(N)",
  },
  {
    slug: "armstrong-number", title: "Armstrong Number", topic: "loops", difficulty: "Easy", tags: ["digits", "math"],
    statement: "A number with d digits is an Armstrong number if the sum of each digit raised to the power d equals the number. Print \"Yes\" or \"No\".",
    inputFormat: "A single integer N.", outputFormat: "Yes or No.", constraints: ["1 ≤ N ≤ 10^9"],
    samples: [{ input: "153", output: "Yes", explanation: "1³ + 5³ + 3³ = 153" }], tests: [{ input: "9474", output: "Yes" }, { input: "100", output: "No" }, { input: "5", output: "Yes" }],
    hint: "First count digits, then sum powers.", approach: "Use integer exponentiation to avoid floating-point errors from pow().",
    solution: wrap(`int main(){ long long n; cin>>n; int d=to_string(n).size(); long long s=0,m=n; while(m){ long long x=m%10,p=1; for(int i=0;i<d;i++) p*=x; s+=p; m/=10;} cout<<(s==n?"Yes":"No")<<"\\n"; }`), time: "O(d²)", space: "O(1)",
  },
  {
    slug: "fibonacci-series", title: "Fibonacci Series", topic: "loops", difficulty: "Easy", tags: ["fibonacci"],
    statement: "Print the first N Fibonacci numbers starting from 0 1.",
    inputFormat: "A single integer N.", outputFormat: "N numbers separated by spaces.", constraints: ["1 ≤ N ≤ 90"],
    samples: [{ input: "7", output: "0 1 1 2 3 5 8" }], tests: [{ input: "1", output: "0" }, { input: "2", output: "0 1" }],
    hint: "Keep only the last two values.", approach: "a=0, b=1; print a, then (a, b) = (b, a+b).",
    solution: wrap(`int main(){ int n; cin>>n; long long a=0,b=1; for(int i=0;i<n;i++){ cout<<a<<(i+1==n?"\\n":" "); long long c=a+b; a=b; b=c; } }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "gcd-and-lcm", title: "GCD and LCM", topic: "loops", difficulty: "Easy", tags: ["math", "gcd"],
    statement: "Print the GCD and LCM of two positive integers A and B separated by a space.",
    inputFormat: "Two integers A B.", outputFormat: "gcd lcm", constraints: ["1 ≤ A, B ≤ 10^9"],
    samples: [{ input: "12 18", output: "6 36" }], tests: [{ input: "7 13", output: "1 91" }, { input: "1000000000 999999999", output: "1 999999999000000000" }],
    hint: "Euclid: gcd(a, b) = gcd(b, a % b).", approach: "lcm = a / gcd * b — divide first to avoid overflow.",
    solution: wrap(`int main(){ long long a,b; cin>>a>>b; long long x=a,y=b; while(y){ long long t=x%y; x=y; y=t;} cout<<x<<" "<<a/x*b<<"\\n"; }`), time: "O(log min(A,B))", space: "O(1)",
  },
  {
    slug: "divisors-of-n", title: "All Divisors of N", topic: "loops", difficulty: "Medium", tags: ["math", "divisors"],
    statement: "Print all divisors of N in increasing order, separated by spaces.",
    inputFormat: "A single integer N.", outputFormat: "Divisors in ascending order.", constraints: ["1 ≤ N ≤ 10^12"],
    samples: [{ input: "12", output: "1 2 3 4 6 12" }], tests: [{ input: "1", output: "1" }, { input: "49", output: "1 7 49" }],
    hint: "Divisors come in pairs (i, N/i).", approach: "Loop i up to √N; collect small and large divisors separately, then merge.",
    solution: wrap(`int main(){ long long n; cin>>n; vector<long long> a,b; for(long long i=1;i*i<=n;i++) if(n%i==0){ a.push_back(i); if(i!=n/i) b.push_back(n/i);} reverse(b.begin(),b.end()); for(auto x:b) a.push_back(x); for(size_t i=0;i<a.size();i++) cout<<a[i]<<(i+1==a.size()?"\\n":" "); }`), time: "O(√N)", space: "O(√N)",
  },
  // ---------- Patterns ----------
  {
    slug: "solid-square", title: "Solid Square", topic: "patterns", difficulty: "Easy", tags: ["stars", "nested-loops"],
    statement: "Print an N×N square of `*` characters.", inputFormat: "A single integer N.", outputFormat: "N lines of N stars.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "3", output: "***\n***\n***" }], tests: [{ input: "1", output: "*" }, { input: "2", output: "**\n**" }],
    hint: "Two nested loops.", approach: "Outer loop over rows, inner loop prints N stars, then a newline.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=0;i<n;i++){ for(int j=0;j<n;j++) cout<<'*'; cout<<"\\n"; } }`), time: "O(N²)", space: "O(1)",
  },
  {
    slug: "hollow-square", title: "Hollow Square", topic: "patterns", difficulty: "Easy", tags: ["stars", "nested-loops"],
    statement: "Print an N×N hollow square: only the border is `*`, the inside is spaces.", inputFormat: "A single integer N.", outputFormat: "N lines.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "4", output: "****\n*  *\n*  *\n****" }], tests: [{ input: "1", output: "*" }, { input: "3", output: "***\n* *\n***" }],
    hint: "A cell is on the border if it's in the first/last row or column.", approach: "Print '*' when i==0 || i==n-1 || j==0 || j==n-1, else ' '.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=0;i<n;i++){ for(int j=0;j<n;j++) cout<<((i==0||i==n-1||j==0||j==n-1)?'*':' '); cout<<"\\n"; } }`), time: "O(N²)", space: "O(1)",
  },
  {
    slug: "right-triangle", title: "Right-Angled Triangle", topic: "patterns", difficulty: "Easy", tags: ["stars", "triangle"],
    statement: "Print a left-aligned right triangle of height N where row i has i stars.", inputFormat: "A single integer N.", outputFormat: "N lines.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "3", output: "*\n**\n***" }], tests: [{ input: "1", output: "*" }, { input: "4", output: "*\n**\n***\n****" }],
    hint: "Inner loop runs i times.", approach: "For i = 1..N print i stars.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=1;i<=n;i++){ cout<<string(i,'*')<<"\\n"; } }`), time: "O(N²)", space: "O(N)",
  },
  {
    slug: "inverted-triangle", title: "Inverted Right Triangle", topic: "patterns", difficulty: "Easy", tags: ["stars", "triangle"],
    statement: "Print an inverted right triangle: the first row has N stars, the last has 1.", inputFormat: "A single integer N.", outputFormat: "N lines.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "3", output: "***\n**\n*" }], tests: [{ input: "1", output: "*" }],
    hint: "Count down.", approach: "For i = N..1 print i stars.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=n;i>=1;i--) cout<<string(i,'*')<<"\\n"; }`), time: "O(N²)", space: "O(N)",
  },
  {
    slug: "star-pyramid", title: "Star Pyramid", topic: "patterns", difficulty: "Medium", tags: ["stars", "pyramid"],
    statement: "Print a centred pyramid of height N. Row i (1-indexed) has N−i leading spaces followed by 2i−1 stars. Do not print trailing spaces.",
    inputFormat: "A single integer N.", outputFormat: "N lines.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "3", output: "  *\n ***\n*****" }], tests: [{ input: "1", output: "*" }, { input: "2", output: " *\n***" }],
    hint: "Spaces first, then stars.", approach: "Row i: print (N - i) spaces, then (2i - 1) stars.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=1;i<=n;i++) cout<<string(n-i,' ')<<string(2*i-1,'*')<<"\\n"; }`), time: "O(N²)", space: "O(N)",
  },
  {
    slug: "diamond-pattern", title: "Diamond", topic: "patterns", difficulty: "Medium", tags: ["stars", "pyramid"],
    statement: "Print a diamond of 2N−1 rows: a pyramid of height N followed by an inverted pyramid of height N−1.",
    inputFormat: "A single integer N.", outputFormat: "2N−1 lines.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "2", output: " *\n***\n *" }], tests: [{ input: "1", output: "*" }, { input: "3", output: "  *\n ***\n*****\n ***\n  *" }],
    hint: "Reuse the pyramid logic twice.", approach: "Print rows 1..N then N-1..1 using the pyramid formula.",
    solution: wrap(`int main(){ int n; cin>>n; auto row=[&](int i){ cout<<string(n-i,' ')<<string(2*i-1,'*')<<"\\n"; }; for(int i=1;i<=n;i++) row(i); for(int i=n-1;i>=1;i--) row(i); }`), time: "O(N²)", space: "O(N)",
  },
  {
    slug: "floyds-triangle", title: "Floyd's Triangle", topic: "patterns", difficulty: "Easy", tags: ["numbers", "triangle"],
    statement: "Print Floyd's triangle with N rows: consecutive numbers starting at 1, row i contains i numbers separated by spaces.",
    inputFormat: "A single integer N.", outputFormat: "N lines.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "3", output: "1\n2 3\n4 5 6" }], tests: [{ input: "1", output: "1" }, { input: "4", output: "1\n2 3\n4 5 6\n7 8 9 10" }],
    hint: "Keep a running counter outside the loops.", approach: "Counter k starts at 1 and increments after each printed number.",
    solution: wrap(`int main(){ int n,k=1; cin>>n; for(int i=1;i<=n;i++){ for(int j=1;j<=i;j++) cout<<k++<<(j==i?"\\n":" "); } }`), time: "O(N²)", space: "O(1)",
  },
  {
    slug: "pascals-triangle", title: "Pascal's Triangle", topic: "patterns", difficulty: "Medium", tags: ["numbers", "combinatorics"],
    statement: "Print the first N rows of Pascal's triangle (left-aligned, numbers separated by spaces).",
    inputFormat: "A single integer N.", outputFormat: "N lines.", constraints: ["1 ≤ N ≤ 30"],
    samples: [{ input: "4", output: "1\n1 1\n1 2 1\n1 3 3 1" }], tests: [{ input: "1", output: "1" }, { input: "5", output: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1" }],
    hint: "C(i, j+1) = C(i, j) * (i - j) / (j + 1).", approach: "Compute each row from the binomial recurrence.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=0;i<n;i++){ long long c=1; for(int j=0;j<=i;j++){ cout<<c<<(j==i?"\\n":" "); c=c*(i-j)/(j+1);} } }`), time: "O(N²)", space: "O(1)",
  },
  {
    slug: "binary-triangle", title: "0–1 Triangle", topic: "patterns", difficulty: "Easy", tags: ["numbers", "triangle"],
    statement: "Print a triangle of N rows where cell (i, j) (1-indexed) is 1 if i+j is even, otherwise 0. Separate values with spaces.",
    inputFormat: "A single integer N.", outputFormat: "N lines.", constraints: ["1 ≤ N ≤ 50"],
    samples: [{ input: "3", output: "1\n0 1\n1 0 1" }], tests: [{ input: "1", output: "1" }, { input: "4", output: "1\n0 1\n1 0 1\n0 1 0 1" }],
    hint: "Parity of i + j.", approach: "Print (i + j) % 2 == 0 ? 1 : 0.",
    solution: wrap(`int main(){ int n; cin>>n; for(int i=1;i<=n;i++) for(int j=1;j<=i;j++) cout<<((i+j)%2==0)<<(j==i?"\\n":" "); }`), time: "O(N²)", space: "O(1)",
  },
  // ---------- Recursion ----------
  {
    slug: "recursive-factorial", title: "Factorial using Recursion", topic: "recursion", difficulty: "Easy", tags: ["recursion", "math"],
    statement: "Compute N! using a recursive function.", inputFormat: "A single integer N.", outputFormat: "N!", constraints: ["0 ≤ N ≤ 20"],
    samples: [{ input: "4", output: "24" }], tests: [{ input: "0", output: "1" }, { input: "15", output: "1307674368000" }],
    hint: "Base case: 0! = 1.", approach: "fact(n) = n * fact(n - 1).",
    solution: wrap(`long long f(int n){ return n<=1?1:n*f(n-1); }\nint main(){ int n; cin>>n; cout<<f(n)<<"\\n"; }`), time: "O(N)", space: "O(N) stack",
  },
  {
    slug: "recursive-power", title: "Fast Power", topic: "recursion", difficulty: "Medium", tags: ["recursion", "divide-and-conquer"],
    statement: "Compute A^B modulo 1,000,000,007 recursively.", inputFormat: "Two integers A B.", outputFormat: "A^B mod 1e9+7", constraints: ["0 ≤ A ≤ 10^9", "0 ≤ B ≤ 10^18"],
    samples: [{ input: "2 10", output: "1024" }], tests: [{ input: "5 0", output: "1" }, { input: "2 1000000006", output: "1" }],
    hint: "A^B = (A^(B/2))² · (A if B is odd).", approach: "Halve the exponent each call so depth is O(log B).",
    solution: wrap(`const long long M=1e9+7;\nlong long p(long long a,long long b){ if(b==0) return 1; long long h=p(a,b/2); h=h*h%M; return b%2? h*(a%M)%M : h; }\nint main(){ long long a,b; cin>>a>>b; cout<<p(a,b)<<"\\n"; }`), time: "O(log B)", space: "O(log B)",
  },
  {
    slug: "nth-fibonacci-recursive", title: "N-th Fibonacci Number", topic: "recursion", difficulty: "Easy", tags: ["recursion", "fibonacci", "memoization"],
    statement: "Print F(N) where F(0)=0, F(1)=1 and F(n)=F(n−1)+F(n−2).", inputFormat: "A single integer N.", outputFormat: "F(N)", constraints: ["0 ≤ N ≤ 90"],
    samples: [{ input: "10", output: "55" }], tests: [{ input: "0", output: "0" }, { input: "90", output: "2880067194370816120" }],
    hint: "Plain recursion is exponential for N = 90 — memoise.", approach: "Store computed values in an array.",
    solution: wrap(`long long memo[91]; bool seen[91];\nlong long F(int n){ if(n<2) return n; if(seen[n]) return memo[n]; seen[n]=true; return memo[n]=F(n-1)+F(n-2); }\nint main(){ int n; cin>>n; cout<<F(n)<<"\\n"; }`), time: "O(N)", space: "O(N)",
  },
  {
    slug: "reverse-string-recursive", title: "Reverse a String Recursively", topic: "recursion", difficulty: "Easy", tags: ["recursion", "strings"],
    statement: "Reverse the given word using recursion.", inputFormat: "A single word S.", outputFormat: "S reversed.", constraints: ["1 ≤ |S| ≤ 1000"],
    samples: [{ input: "hello", output: "olleh" }], tests: [{ input: "a", output: "a" }, { input: "racecar", output: "racecar" }],
    hint: "Swap the ends, recurse on the middle.", approach: "rev(s, l, r): if l >= r return; swap(s[l], s[r]); rev(s, l+1, r-1).",
    solution: wrap(`void rev(string&s,int l,int r){ if(l>=r) return; swap(s[l],s[r]); rev(s,l+1,r-1); }\nint main(){ string s; cin>>s; rev(s,0,(int)s.size()-1); cout<<s<<"\\n"; }`), time: "O(N)", space: "O(N) stack",
  },
  {
    slug: "check-array-sorted", title: "Is the Array Sorted?", topic: "recursion", difficulty: "Easy", tags: ["recursion", "arrays"],
    statement: "Check recursively whether an array is sorted in non-decreasing order. Print \"Yes\" or \"No\".",
    inputFormat: "First line N, second line N integers.", outputFormat: "Yes or No.", constraints: ["1 ≤ N ≤ 1000"],
    samples: [{ input: "5\n1 2 2 4 9", output: "Yes" }], tests: [{ input: "3\n3 2 1", output: "No" }, { input: "1\n7", output: "Yes" }],
    hint: "An array of size ≤ 1 is sorted.", approach: "sorted(i) = a[i] <= a[i+1] && sorted(i+1).",
    solution: wrap(`vector<int> a; bool ok(int i){ if(i+1>=(int)a.size()) return true; return a[i]<=a[i+1] && ok(i+1); }\nint main(){ int n; cin>>n; a.resize(n); for(auto&x:a) cin>>x; cout<<(ok(0)?"Yes":"No")<<"\\n"; }`), time: "O(N)", space: "O(N)",
  },
  {
    slug: "tower-of-hanoi", title: "Tower of Hanoi", topic: "recursion", difficulty: "Medium", tags: ["recursion", "classic"],
    statement: "Move N disks from rod A to rod C using rod B. Print each move as `X Y` (move top disk from X to Y), one per line.",
    inputFormat: "A single integer N.", outputFormat: "2^N − 1 lines.", constraints: ["1 ≤ N ≤ 10"],
    samples: [{ input: "2", output: "A B\nA C\nB C" }], tests: [{ input: "1", output: "A C" }, { input: "3", output: "A C\nA B\nC B\nA C\nB A\nB C\nA C" }],
    hint: "Move N−1 disks out of the way first.", approach: "hanoi(n, from, to, via) = hanoi(n-1, from, via, to); move; hanoi(n-1, via, to, from).",
    solution: wrap(`void h(int n,char f,char t,char v){ if(!n) return; h(n-1,f,v,t); cout<<f<<" "<<t<<"\\n"; h(n-1,v,t,f); }\nint main(){ int n; cin>>n; h(n,'A','C','B'); }`), time: "O(2^N)", space: "O(N)",
  },
  {
    slug: "generate-subsequences", title: "All Subsequences", topic: "recursion", difficulty: "Medium", tags: ["recursion", "subsets"],
    statement: "Print every non-empty subsequence of string S in lexicographic order, one per line.",
    inputFormat: "A single word S of distinct lowercase letters.", outputFormat: "2^|S| − 1 lines, sorted.", constraints: ["1 ≤ |S| ≤ 12"],
    samples: [{ input: "abc", output: "a\nab\nabc\nac\nb\nbc\nc" }], tests: [{ input: "z", output: "z" }],
    hint: "Each character is either taken or skipped.", approach: "Recurse with include/exclude choices, collect results, then sort.",
    solution: wrap(`string s; vector<string> r; void g(int i,string cur){ if(i==(int)s.size()){ if(!cur.empty()) r.push_back(cur); return;} g(i+1,cur+s[i]); g(i+1,cur); }\nint main(){ cin>>s; g(0,""); sort(r.begin(),r.end()); for(auto&x:r) cout<<x<<"\\n"; }`), time: "O(2^N · N)", space: "O(2^N · N)",
  },
  // ---------- Arrays ----------
  {
    slug: "array-max-min", title: "Maximum and Minimum", topic: "arrays", difficulty: "Easy", tags: ["arrays", "traversal"],
    statement: "Print the maximum and minimum element of an array, separated by a space.",
    inputFormat: "First line N, second line N integers.", outputFormat: "max min", constraints: ["1 ≤ N ≤ 10^5", "|a[i]| ≤ 10^9"],
    samples: [{ input: "5\n3 -1 9 4 0", output: "9 -1" }], tests: [{ input: "1\n5", output: "5 5" }],
    hint: "One pass is enough.", approach: "Track the running max and min.",
    solution: wrap(`int main(){ int n; cin>>n; long long mx=LLONG_MIN,mn=LLONG_MAX; for(int i=0;i<n;i++){ long long x; cin>>x; mx=max(mx,x); mn=min(mn,x);} cout<<mx<<" "<<mn<<"\\n"; }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "reverse-array", title: "Reverse an Array", topic: "arrays", difficulty: "Easy", tags: ["arrays", "two-pointers"],
    statement: "Reverse the array in place and print it.", inputFormat: "First line N, second line N integers.", outputFormat: "Reversed array.", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "4\n1 2 3 4", output: "4 3 2 1" }], tests: [{ input: "1\n9", output: "9" }],
    hint: "Swap from both ends.", approach: "Two pointers l=0, r=n-1, swap and move inward.",
    solution: wrap(`int main(){ int n; cin>>n; vector<int> a(n); for(auto&x:a) cin>>x; for(int l=0,r=n-1;l<r;l++,r--) swap(a[l],a[r]); for(int i=0;i<n;i++) cout<<a[i]<<(i+1==n?"\\n":" "); }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "two-sum-sorted", title: "Pair with Target Sum (Sorted)", topic: "arrays", difficulty: "Medium", tags: ["two-pointers", "arrays"],
    statement: "Given a sorted array and a target T, print \"Yes\" if two different elements sum to T, otherwise \"No\".",
    inputFormat: "First line N T, second line N sorted integers.", outputFormat: "Yes or No.", constraints: ["2 ≤ N ≤ 10^5"],
    samples: [{ input: "5 9\n1 2 4 5 7", output: "Yes", explanation: "2 + 7 = 9" }], tests: [{ input: "3 100\n1 2 3", output: "No" }, { input: "2 4\n2 2", output: "Yes" }],
    hint: "Move the pointer that makes the sum closer to T.", approach: "If a[l]+a[r] < T move l right, if greater move r left.",
    solution: wrap(`int main(){ int n; long long t; cin>>n>>t; vector<long long> a(n); for(auto&x:a) cin>>x; int l=0,r=n-1; while(l<r){ long long s=a[l]+a[r]; if(s==t){cout<<"Yes\\n";return 0;} if(s<t) l++; else r--; } cout<<"No\\n"; }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "max-subarray-sum", title: "Maximum Subarray Sum (Kadane)", topic: "arrays", difficulty: "Medium", tags: ["kadane", "dp", "arrays"],
    statement: "Print the largest sum of a non-empty contiguous subarray.", inputFormat: "First line N, second line N integers.", outputFormat: "The maximum sum.", constraints: ["1 ≤ N ≤ 10^5", "|a[i]| ≤ 10^9"],
    samples: [{ input: "8\n-2 1 -3 4 -1 2 1 -5", output: "6", explanation: "[4, -1, 2, 1] sums to 6" }], tests: [{ input: "3\n-5 -2 -9", output: "-2" }],
    hint: "Either extend the previous subarray or start fresh.", approach: "cur = max(a[i], cur + a[i]); best = max(best, cur).",
    solution: wrap(`int main(){ int n; cin>>n; long long cur=0,best=LLONG_MIN; for(int i=0;i<n;i++){ long long x; cin>>x; cur=max(x,cur+x); best=max(best,cur);} cout<<best<<"\\n"; }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "max-sum-window-k", title: "Max Sum of Window K", topic: "arrays", difficulty: "Medium", tags: ["sliding-window"],
    statement: "Print the maximum sum of any contiguous subarray of exactly K elements.", inputFormat: "First line N K, second line N integers.", outputFormat: "The maximum window sum.", constraints: ["1 ≤ K ≤ N ≤ 10^5"],
    samples: [{ input: "6 3\n2 1 5 1 3 2", output: "9", explanation: "[5, 1, 3]" }], tests: [{ input: "3 3\n1 2 3", output: "6" }, { input: "4 1\n-1 -2 -3 -4", output: "-1" }],
    hint: "Slide: add the new element, drop the oldest.", approach: "Maintain the sum of the current window in O(1) per step.",
    solution: wrap(`int main(){ int n,k; cin>>n>>k; vector<long long> a(n); for(auto&x:a) cin>>x; long long s=0; for(int i=0;i<k;i++) s+=a[i]; long long b=s; for(int i=k;i<n;i++){ s+=a[i]-a[i-k]; b=max(b,s);} cout<<b<<"\\n"; }`), time: "O(N)", space: "O(N)",
  },
  // ---------- Strings ----------
  {
    slug: "string-palindrome", title: "Valid Palindrome", topic: "strings", difficulty: "Easy", tags: ["strings", "two-pointers"],
    statement: "Print \"Yes\" if the word reads the same forwards and backwards (case-sensitive), else \"No\".", inputFormat: "A single word S.", outputFormat: "Yes or No.", constraints: ["1 ≤ |S| ≤ 10^5"],
    samples: [{ input: "level", output: "Yes" }], tests: [{ input: "ab", output: "No" }, { input: "x", output: "Yes" }],
    hint: "Compare S with its reverse.", approach: "Two pointers from both ends.",
    solution: wrap(`int main(){ string s; cin>>s; string r(s.rbegin(),s.rend()); cout<<(s==r?"Yes":"No")<<"\\n"; }`), time: "O(N)", space: "O(N)",
  },
  {
    slug: "count-vowels", title: "Count Vowels", topic: "strings", difficulty: "Easy", tags: ["strings", "counting"],
    statement: "Count the vowels (a, e, i, o, u — either case) in a line of text.", inputFormat: "A single line of text.", outputFormat: "The vowel count.", constraints: ["1 ≤ length ≤ 10^5"],
    samples: [{ input: "Hello World", output: "3" }], tests: [{ input: "rhythm", output: "0" }, { input: "AEIOU aeiou", output: "10" }],
    hint: "Read the whole line with getline.", approach: "Lower-case each character and check membership.",
    solution: wrap(`int main(){ string s; getline(cin,s); int c=0; for(char ch:s){ char x=tolower(ch); if(string("aeiou").find(x)!=string::npos) c++; } cout<<c<<"\\n"; }`), time: "O(N)", space: "O(N)",
  },
  {
    slug: "valid-anagram", title: "Valid Anagram", topic: "strings", difficulty: "Easy", tags: ["hashing", "strings"],
    statement: "Given two lowercase words, print \"Yes\" if one is an anagram of the other.", inputFormat: "Two words on one line.", outputFormat: "Yes or No.", constraints: ["1 ≤ |A|, |B| ≤ 10^5"],
    samples: [{ input: "listen silent", output: "Yes" }], tests: [{ input: "rat car", output: "No" }, { input: "a ab", output: "No" }],
    hint: "Count letter frequencies.", approach: "Use an int[26] array: +1 for A, −1 for B, then check all zeros.",
    solution: wrap(`int main(){ string a,b; cin>>a>>b; if(a.size()!=b.size()){cout<<"No\\n";return 0;} int c[26]={}; for(char x:a) c[x-'a']++; for(char x:b) c[x-'a']--; for(int v:c) if(v){cout<<"No\\n";return 0;} cout<<"Yes\\n"; }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "longest-unique-substring", title: "Longest Substring Without Repeats", topic: "strings", difficulty: "Medium", tags: ["sliding-window", "hashing"],
    statement: "Print the length of the longest substring of S with all distinct characters.", inputFormat: "A single word S.", outputFormat: "The length.", constraints: ["1 ≤ |S| ≤ 10^5"],
    samples: [{ input: "abcabcbb", output: "3" }], tests: [{ input: "bbbbb", output: "1" }, { input: "pwwkew", output: "3" }],
    hint: "Remember the last index of each character.", approach: "Move the left edge past the previous occurrence when a repeat appears.",
    solution: wrap(`int main(){ string s; cin>>s; vector<int> last(256,-1); int l=0,b=0; for(int r=0;r<(int)s.size();r++){ unsigned char c=s[r]; if(last[c]>=l) l=last[c]+1; last[c]=r; b=max(b,r-l+1);} cout<<b<<"\\n"; }`), time: "O(N)", space: "O(1)",
  },
  // ---------- Searching & Sorting ----------
  {
    slug: "binary-search", title: "Binary Search", topic: "searching-sorting", difficulty: "Easy", tags: ["binary-search"],
    statement: "Given a sorted array of distinct integers and a target X, print its 0-based index or -1 if absent.",
    inputFormat: "First line N X, second line N sorted integers.", outputFormat: "Index or -1.", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "6 7\n1 3 5 7 9 11", output: "3" }], tests: [{ input: "3 4\n1 2 3", output: "-1" }, { input: "1 5\n5", output: "0" }],
    hint: "Halve the search range each step.", approach: "lo=0, hi=n-1; compare a[mid] with X.",
    solution: wrap(`int main(){ int n; long long x; cin>>n>>x; vector<long long> a(n); for(auto&v:a) cin>>v; int lo=0,hi=n-1; while(lo<=hi){ int m=lo+(hi-lo)/2; if(a[m]==x){cout<<m<<"\\n";return 0;} if(a[m]<x) lo=m+1; else hi=m-1;} cout<<-1<<"\\n"; }`), time: "O(log N)", space: "O(1)",
  },
  {
    slug: "bubble-sort", title: "Sort an Array", topic: "searching-sorting", difficulty: "Easy", tags: ["sorting"],
    statement: "Sort the array in ascending order. Try implementing bubble, insertion or merge sort yourself.",
    inputFormat: "First line N, second line N integers.", outputFormat: "Sorted array.", constraints: ["1 ≤ N ≤ 1000"],
    samples: [{ input: "5\n5 1 4 2 8", output: "1 2 4 5 8" }], tests: [{ input: "1\n3", output: "3" }, { input: "4\n-1 -1 0 -5", output: "-5 -1 -1 0" }],
    hint: "Bubble sort: repeatedly swap adjacent out-of-order pairs.", approach: "After pass i, the i largest elements are in place.",
    solution: wrap(`int main(){ int n; cin>>n; vector<int> a(n); for(auto&x:a) cin>>x; for(int i=0;i<n;i++) for(int j=0;j+1<n-i;j++) if(a[j]>a[j+1]) swap(a[j],a[j+1]); for(int i=0;i<n;i++) cout<<a[i]<<(i+1==n?"\\n":" "); }`), time: "O(N²)", space: "O(1)",
  },
  {
    slug: "first-last-occurrence", title: "First and Last Occurrence", topic: "searching-sorting", difficulty: "Medium", tags: ["binary-search"],
    statement: "In a sorted array, print the first and last 0-based index of X, or `-1 -1`.", inputFormat: "First line N X, second line N sorted integers.", outputFormat: "first last", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "7 2\n1 2 2 2 3 4 5", output: "1 3" }], tests: [{ input: "3 9\n1 2 3", output: "-1 -1" }],
    hint: "lower_bound and upper_bound.", approach: "first = lower_bound; last = upper_bound − 1.",
    solution: wrap(`int main(){ int n; long long x; cin>>n>>x; vector<long long> a(n); for(auto&v:a) cin>>v; auto l=lower_bound(a.begin(),a.end(),x); if(l==a.end()||*l!=x){cout<<"-1 -1\\n";return 0;} auto u=upper_bound(a.begin(),a.end(),x); cout<<(l-a.begin())<<" "<<(u-a.begin()-1)<<"\\n"; }`), time: "O(log N)", space: "O(1)",
  },
  // ---------- Linked Lists ----------
  {
    slug: "reverse-linked-list", title: "Reverse a Linked List", topic: "linked-lists", difficulty: "Easy", tags: ["linked-list", "pointers"],
    statement: "Build a singly linked list from N values, reverse it by re-linking nodes, then print it.",
    inputFormat: "First line N, second line N integers.", outputFormat: "Reversed list values.", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "5\n1 2 3 4 5", output: "5 4 3 2 1" }], tests: [{ input: "1\n42", output: "42" }],
    hint: "Track prev, curr and next.", approach: "Iteratively point each node's next to the previous node.",
    solution: wrap(`struct Node{int v; Node* nx; Node(int x):v(x),nx(nullptr){}};\nint main(){ int n; cin>>n; Node* h=nullptr,*t=nullptr; for(int i=0;i<n;i++){int x;cin>>x; Node* d=new Node(x); if(!h) h=t=d; else {t->nx=d;t=d;}} Node* p=nullptr; while(h){ Node* q=h->nx; h->nx=p; p=h; h=q;} bool f=true; for(Node* c=p;c;c=c->nx){ cout<<(f?"":" ")<<c->v; f=false;} cout<<"\\n"; }`), time: "O(N)", space: "O(1) extra",
  },
  {
    slug: "middle-of-linked-list", title: "Middle of a Linked List", topic: "linked-lists", difficulty: "Easy", tags: ["linked-list", "fast-slow-pointers"],
    statement: "Print the middle node's value. If there are two middles, print the second.", inputFormat: "First line N, second line N integers.", outputFormat: "Middle value.", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "5\n1 2 3 4 5", output: "3" }, { input: "4\n1 2 3 4", output: "3" }], tests: [{ input: "1\n7", output: "7" }],
    hint: "Fast pointer moves 2 steps, slow moves 1.", approach: "When fast reaches the end, slow is at the middle.",
    solution: wrap(`struct Node{int v; Node* nx;};\nint main(){ int n; cin>>n; Node* h=nullptr,*t=nullptr; for(int i=0;i<n;i++){int x;cin>>x; Node* d=new Node{x,nullptr}; if(!h) h=t=d; else {t->nx=d;t=d;}} Node *s=h,*f=h; while(f&&f->nx){ s=s->nx; f=f->nx->nx;} cout<<s->v<<"\\n"; }`), time: "O(N)", space: "O(1)",
  },
  // ---------- Stacks & Queues ----------
  {
    slug: "balanced-parentheses", title: "Balanced Brackets", topic: "stacks-queues", difficulty: "Easy", tags: ["stack"],
    statement: "Given a string of ()[]{} characters, print \"Yes\" if it is balanced.", inputFormat: "A single string S.", outputFormat: "Yes or No.", constraints: ["1 ≤ |S| ≤ 10^5"],
    samples: [{ input: "{[()]}", output: "Yes" }, { input: "([)]", output: "No" }], tests: [{ input: "((", output: "No" }, { input: "()[]{}", output: "Yes" }],
    hint: "Push opens, pop on closes.", approach: "A close must match the stack top; the stack must be empty at the end.",
    solution: wrap(`int main(){ string s; cin>>s; stack<char> st; for(char c:s){ if(c=='('||c=='['||c=='{') st.push(c); else { if(st.empty()){cout<<"No\\n";return 0;} char o=st.top(); st.pop(); if((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{')){cout<<"No\\n";return 0;} } } cout<<(st.empty()?"Yes":"No")<<"\\n"; }`), time: "O(N)", space: "O(N)",
  },
  {
    slug: "next-greater-element", title: "Next Greater Element", topic: "stacks-queues", difficulty: "Medium", tags: ["monotonic-stack"],
    statement: "For each element, print the next element to its right that is strictly greater, or -1.", inputFormat: "First line N, second line N integers.", outputFormat: "N values.", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "4\n4 5 2 25", output: "5 25 25 -1" }], tests: [{ input: "3\n3 2 1", output: "-1 -1 -1" }],
    hint: "Traverse from the right with a decreasing stack.", approach: "Pop everything ≤ current; the top is the answer; push current.",
    solution: wrap(`int main(){ int n; cin>>n; vector<long long> a(n),r(n); for(auto&x:a) cin>>x; stack<long long> st; for(int i=n-1;i>=0;i--){ while(!st.empty()&&st.top()<=a[i]) st.pop(); r[i]=st.empty()?-1:st.top(); st.push(a[i]);} for(int i=0;i<n;i++) cout<<r[i]<<(i+1==n?"\\n":" "); }`), time: "O(N)", space: "O(N)",
  },
  // ---------- Trees ----------
  {
    slug: "bst-inorder", title: "BST Insert and Inorder", topic: "trees", difficulty: "Medium", tags: ["bst", "traversal"],
    statement: "Insert N distinct values into an empty BST in the given order, then print the inorder traversal.", inputFormat: "First line N, second line N distinct integers.", outputFormat: "Inorder traversal.", constraints: ["1 ≤ N ≤ 10^4"],
    samples: [{ input: "5\n50 30 70 20 40", output: "20 30 40 50 70" }], tests: [{ input: "1\n9", output: "9" }],
    hint: "Inorder traversal of a BST is sorted.", approach: "Recursive insert; recursive inorder (left, node, right).",
    solution: wrap(`struct N{int v; N*l=nullptr,*r=nullptr; N(int x):v(x){}};\nN* ins(N* t,int x){ if(!t) return new N(x); if(x<t->v) t->l=ins(t->l,x); else t->r=ins(t->r,x); return t; }\nvector<int> out; void in(N* t){ if(!t) return; in(t->l); out.push_back(t->v); in(t->r); }\nint main(){ int n; cin>>n; N* root=nullptr; for(int i=0;i<n;i++){int x;cin>>x; root=ins(root,x);} in(root); for(size_t i=0;i<out.size();i++) cout<<out[i]<<(i+1==out.size()?"\\n":" "); }`), time: "O(N log N) avg", space: "O(N)",
  },
  {
    slug: "bst-height", title: "Height of a BST", topic: "trees", difficulty: "Medium", tags: ["bst", "recursion"],
    statement: "Insert N distinct values into a BST in order and print its height (number of nodes on the longest root-to-leaf path).", inputFormat: "First line N, second line N integers.", outputFormat: "Height.", constraints: ["1 ≤ N ≤ 2000"],
    samples: [{ input: "5\n50 30 70 20 40", output: "3" }], tests: [{ input: "3\n1 2 3", output: "3" }, { input: "1\n5", output: "1" }],
    hint: "height(null) = 0.", approach: "height(t) = 1 + max(height(left), height(right)).",
    solution: wrap(`struct N{int v; N*l=nullptr,*r=nullptr; N(int x):v(x){}};\nN* ins(N* t,int x){ if(!t) return new N(x); if(x<t->v) t->l=ins(t->l,x); else t->r=ins(t->r,x); return t; }\nint h(N* t){ return t? 1+max(h(t->l),h(t->r)) : 0; }\nint main(){ int n; cin>>n; N* r=nullptr; for(int i=0;i<n;i++){int x;cin>>x; r=ins(r,x);} cout<<h(r)<<"\\n"; }`), time: "O(N²) worst", space: "O(N)",
  },
  // ---------- Graphs ----------
  {
    slug: "count-connected-components", title: "Connected Components", topic: "graphs", difficulty: "Medium", tags: ["dfs", "bfs", "dsu"],
    statement: "Given an undirected graph with N vertices (1..N) and M edges, print the number of connected components.", inputFormat: "First line N M, then M lines u v.", outputFormat: "Number of components.", constraints: ["1 ≤ N ≤ 10^5", "0 ≤ M ≤ 2·10^5"],
    samples: [{ input: "5 3\n1 2\n2 3\n4 5", output: "2" }], tests: [{ input: "3 0", output: "3" }, { input: "1 0", output: "1" }],
    hint: "Start a traversal from every unvisited vertex.", approach: "Each new BFS/DFS start is a new component.",
    solution: wrap(`int main(){ int n,m; cin>>n>>m; vector<vector<int>> g(n+1); for(int i=0;i<m;i++){int u,v;cin>>u>>v; g[u].push_back(v); g[v].push_back(u);} vector<bool> vis(n+1); int c=0; for(int s=1;s<=n;s++){ if(vis[s]) continue; c++; queue<int> q; q.push(s); vis[s]=true; while(!q.empty()){int u=q.front();q.pop(); for(int v:g[u]) if(!vis[v]){vis[v]=true;q.push(v);}} } cout<<c<<"\\n"; }`), time: "O(N + M)", space: "O(N + M)",
  },
  {
    slug: "shortest-path-unweighted", title: "Shortest Path (BFS)", topic: "graphs", difficulty: "Medium", tags: ["bfs", "shortest-path"],
    statement: "In an unweighted undirected graph, print the minimum number of edges from vertex 1 to vertex N, or -1.", inputFormat: "First line N M, then M lines u v.", outputFormat: "Distance or -1.", constraints: ["2 ≤ N ≤ 10^5"],
    samples: [{ input: "4 4\n1 2\n2 4\n1 3\n3 4", output: "2" }], tests: [{ input: "3 1\n1 2", output: "-1" }],
    hint: "BFS explores in layers of equal distance.", approach: "dist[1] = 0; dist[v] = dist[u] + 1 on first visit.",
    solution: wrap(`int main(){ int n,m; cin>>n>>m; vector<vector<int>> g(n+1); for(int i=0;i<m;i++){int u,v;cin>>u>>v; g[u].push_back(v); g[v].push_back(u);} vector<int> d(n+1,-1); queue<int> q; q.push(1); d[1]=0; while(!q.empty()){int u=q.front();q.pop(); for(int v:g[u]) if(d[v]<0){d[v]=d[u]+1;q.push(v);}} cout<<d[n]<<"\\n"; }`), time: "O(N + M)", space: "O(N + M)",
  },
  // ---------- DP ----------
  {
    slug: "climbing-stairs", title: "Climbing Stairs", topic: "dp", difficulty: "Easy", tags: ["dp", "fibonacci"],
    statement: "You can climb 1 or 2 steps at a time. Print the number of distinct ways to reach step N.", inputFormat: "A single integer N.", outputFormat: "Number of ways.", constraints: ["1 ≤ N ≤ 80"],
    samples: [{ input: "3", output: "3", explanation: "1+1+1, 1+2, 2+1" }], tests: [{ input: "1", output: "1" }, { input: "10", output: "89" }],
    hint: "ways(n) = ways(n-1) + ways(n-2).", approach: "Bottom-up with two variables.",
    solution: wrap(`int main(){ int n; cin>>n; long long a=1,b=1; for(int i=2;i<=n;i++){ long long c=a+b; a=b; b=c;} cout<<b<<"\\n"; }`), time: "O(N)", space: "O(1)",
  },
  {
    slug: "knapsack-01", title: "0/1 Knapsack", topic: "dp", difficulty: "Hard", tags: ["dp", "knapsack"],
    statement: "Given N items with weights and values and a capacity W, print the maximum total value without exceeding W (each item at most once).",
    inputFormat: "First line N W, then N lines weight value.", outputFormat: "Maximum value.", constraints: ["1 ≤ N ≤ 100", "1 ≤ W ≤ 10^5"],
    samples: [{ input: "3 50\n10 60\n20 100\n30 120", output: "220" }], tests: [{ input: "1 5\n10 100", output: "0" }],
    hint: "dp[w] = best value with capacity w.", approach: "Iterate w downwards per item so each item is used once.",
    solution: wrap(`int main(){ int n,W; cin>>n>>W; vector<long long> dp(W+1,0); for(int i=0;i<n;i++){ int w; long long v; cin>>w>>v; for(int c=W;c>=w;c--) dp[c]=max(dp[c],dp[c-w]+v);} cout<<dp[W]<<"\\n"; }`), time: "O(N·W)", space: "O(W)",
  },
  {
    slug: "longest-common-subsequence", title: "Longest Common Subsequence", topic: "dp", difficulty: "Medium", tags: ["dp", "strings"],
    statement: "Print the length of the longest common subsequence of two words.", inputFormat: "Two words A B.", outputFormat: "LCS length.", constraints: ["1 ≤ |A|, |B| ≤ 2000"],
    samples: [{ input: "abcde ace", output: "3" }], tests: [{ input: "abc def", output: "0" }],
    hint: "Compare the last characters.", approach: "dp[i][j] = dp[i-1][j-1]+1 if equal, else max(dp[i-1][j], dp[i][j-1]).",
    solution: wrap(`int main(){ string a,b; cin>>a>>b; int n=a.size(),m=b.size(); vector<vector<int>> d(n+1,vector<int>(m+1)); for(int i=1;i<=n;i++) for(int j=1;j<=m;j++) d[i][j]= a[i-1]==b[j-1]? d[i-1][j-1]+1 : max(d[i-1][j],d[i][j-1]); cout<<d[n][m]<<"\\n"; }`), time: "O(N·M)", space: "O(N·M)",
  },
  // ---------- Greedy ----------
  {
    slug: "activity-selection", title: "Activity Selection", topic: "greedy", difficulty: "Medium", tags: ["greedy", "intervals"],
    statement: "Given N activities with start and end times, print the maximum number of non-overlapping activities (an activity may start when another ends).",
    inputFormat: "First line N, then N lines start end.", outputFormat: "Maximum count.", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "4\n1 3\n2 4\n3 5\n0 7", output: "2" }], tests: [{ input: "1\n0 1", output: "1" }],
    hint: "Pick the activity that finishes earliest.", approach: "Sort by end time and greedily take compatible activities.",
    solution: wrap(`int main(){ int n; cin>>n; vector<pair<long long,long long>> a(n); for(auto&p:a) cin>>p.second>>p.first; sort(a.begin(),a.end()); long long last=LLONG_MIN; int c=0; for(auto&[e,s]:a) if(s>=last){c++; last=e;} cout<<c<<"\\n"; }`), time: "O(N log N)", space: "O(N)",
  },
  {
    slug: "min-coins-greedy", title: "Minimum Coins (Indian Currency)", topic: "greedy", difficulty: "Easy", tags: ["greedy"],
    statement: "Using denominations 1, 2, 5, 10, 20, 50, 100, 200, 500, 2000, print the minimum number of notes/coins to make amount V.",
    inputFormat: "A single integer V.", outputFormat: "Minimum count.", constraints: ["1 ≤ V ≤ 10^9"],
    samples: [{ input: "121", output: "3", explanation: "100 + 20 + 1" }], tests: [{ input: "1", output: "1" }, { input: "2999", output: "10" }],
    hint: "This denomination system is canonical, so greedy works.", approach: "Take as many of the largest denomination as possible, then move down.",
    solution: wrap(`int main(){ long long v; cin>>v; int d[]={2000,500,200,100,50,20,10,5,2,1}; long long c=0; for(int x:d){ c+=v/x; v%=x;} cout<<c<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  // ---------- Backtracking ----------
  {
    slug: "n-queens-count", title: "N-Queens (Count)", topic: "backtracking", difficulty: "Hard", tags: ["backtracking", "recursion"],
    statement: "Print the number of ways to place N non-attacking queens on an N×N board.", inputFormat: "A single integer N.", outputFormat: "Number of solutions.", constraints: ["1 ≤ N ≤ 10"],
    samples: [{ input: "4", output: "2" }], tests: [{ input: "1", output: "1" }, { input: "8", output: "92" }, { input: "3", output: "0" }],
    hint: "Place one queen per row; track used columns and diagonals.", approach: "Backtrack row by row using three boolean arrays.",
    solution: wrap(`int n,cnt=0; vector<bool> col,d1,d2;\nvoid go(int r){ if(r==n){cnt++;return;} for(int c=0;c<n;c++){ if(col[c]||d1[r+c]||d2[r-c+n]) continue; col[c]=d1[r+c]=d2[r-c+n]=true; go(r+1); col[c]=d1[r+c]=d2[r-c+n]=false; } }\nint main(){ cin>>n; col.assign(n,false); d1.assign(2*n,false); d2.assign(2*n+1,false); go(0); cout<<cnt<<"\\n"; }`), time: "O(N!)", space: "O(N)",
  },
  {
    slug: "string-permutations", title: "All Permutations", topic: "backtracking", difficulty: "Medium", tags: ["backtracking", "permutations"],
    statement: "Print all permutations of a word with distinct letters, in lexicographic order, one per line.", inputFormat: "A single word S.", outputFormat: "|S|! lines.", constraints: ["1 ≤ |S| ≤ 8"],
    samples: [{ input: "abc", output: "abc\nacb\nbac\nbca\ncab\ncba" }], tests: [{ input: "a", output: "a" }],
    hint: "Choose an unused character for each position.", approach: "Sort first, then backtrack with a used[] array (or use next_permutation).",
    solution: wrap(`int main(){ string s; cin>>s; sort(s.begin(),s.end()); do cout<<s<<"\\n"; while(next_permutation(s.begin(),s.end())); }`), time: "O(N · N!)", space: "O(N)",
  },
  // ---------- STL & OOP ----------
  {
    slug: "word-frequency-map", title: "Word Frequency", topic: "stl-oop", difficulty: "Easy", tags: ["map", "stl"],
    statement: "Read N words and print each distinct word with its count, in alphabetical order, one `word count` per line.",
    inputFormat: "First line N, second line N words.", outputFormat: "Distinct words sorted.", constraints: ["1 ≤ N ≤ 10^5"],
    samples: [{ input: "5\napple bat apple cat bat", output: "apple 2\nbat 2\ncat 1" }], tests: [{ input: "1\nz", output: "z 1" }],
    hint: "std::map keeps keys sorted.", approach: "Increment map[word] for each word, then iterate.",
    solution: wrap(`int main(){ int n; cin>>n; map<string,int> m; for(int i=0;i<n;i++){ string w; cin>>w; m[w]++; } for(auto&[k,v]:m) cout<<k<<" "<<v<<"\\n"; }`), time: "O(N log N)", space: "O(N)",
  },
  {
    slug: "distinct-elements-set", title: "Count Distinct Elements", topic: "stl-oop", difficulty: "Easy", tags: ["set", "stl"],
    statement: "Print the number of distinct values in the array.", inputFormat: "First line N, second line N integers.", outputFormat: "Distinct count.", constraints: ["1 ≤ N ≤ 2·10^5"],
    samples: [{ input: "5\n2 3 2 2 3", output: "2" }], tests: [{ input: "3\n1 2 3", output: "3" }],
    hint: "A set ignores duplicates.", approach: "Insert all values into std::set and print its size.",
    solution: wrap(`int main(){ int n; cin>>n; set<long long> s; for(int i=0;i<n;i++){ long long x; cin>>x; s.insert(x);} cout<<s.size()<<"\\n"; }`), time: "O(N log N)", space: "O(N)",
  },
  {
    slug: "rectangle-class", title: "Rectangle Class", topic: "stl-oop", difficulty: "Easy", tags: ["oop", "class"],
    statement: "Implement a class Rectangle with a constructor (length, width) and member functions area() and perimeter(). Print area and perimeter separated by a space.",
    inputFormat: "Two integers L W.", outputFormat: "area perimeter", constraints: ["1 ≤ L, W ≤ 10^4"],
    samples: [{ input: "3 4", output: "12 14" }], tests: [{ input: "1 1", output: "1 4" }],
    hint: "Keep data members private.", approach: "Store L and W; area = L*W; perimeter = 2*(L+W).",
    solution: wrap(`class Rectangle{ long long l,w; public: Rectangle(long long a,long long b):l(a),w(b){} long long area() const{return l*w;} long long perimeter() const{return 2*(l+w);} };\nint main(){ long long a,b; cin>>a>>b; Rectangle r(a,b); cout<<r.area()<<" "<<r.perimeter()<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  // ---------- Competitive ----------
  {
    slug: "count-set-bits", title: "Count Set Bits", topic: "competitive", difficulty: "Easy", tags: ["bit-manipulation"],
    statement: "Print the number of 1-bits in the binary representation of N.", inputFormat: "A single integer N.", outputFormat: "Set bit count.", constraints: ["0 ≤ N ≤ 10^18"],
    samples: [{ input: "13", output: "3", explanation: "13 = 1101₂" }], tests: [{ input: "0", output: "0" }, { input: "1023", output: "10" }],
    hint: "n & (n − 1) removes the lowest set bit.", approach: "Repeat until n becomes 0, or use __builtin_popcountll.",
    solution: wrap(`int main(){ unsigned long long n; cin>>n; cout<<__builtin_popcountll(n)<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  {
    slug: "power-of-two", title: "Power of Two", topic: "competitive", difficulty: "Easy", tags: ["bit-manipulation"],
    statement: "Print \"Yes\" if N is a power of two, otherwise \"No\".", inputFormat: "A single integer N.", outputFormat: "Yes or No.", constraints: ["1 ≤ N ≤ 10^18"],
    samples: [{ input: "16", output: "Yes" }, { input: "18", output: "No" }], tests: [{ input: "1", output: "Yes" }],
    hint: "Powers of two have exactly one set bit.", approach: "N > 0 && (N & (N − 1)) == 0.",
    solution: wrap(`int main(){ long long n; cin>>n; cout<<((n>0&&(n&(n-1))==0)?"Yes":"No")<<"\\n"; }`), time: "O(1)", space: "O(1)",
  },
  {
    slug: "prefix-sum-queries", title: "Range Sum Queries", topic: "competitive", difficulty: "Medium", tags: ["prefix-sum", "fast-io"],
    statement: "Given an array and Q queries (l, r) with 1-based inclusive bounds, print the sum of each range on its own line.",
    inputFormat: "N Q, then N integers, then Q lines l r.", outputFormat: "Q lines.", constraints: ["1 ≤ N, Q ≤ 2·10^5"],
    samples: [{ input: "5 3\n1 2 3 4 5\n1 3\n2 5\n4 4", output: "6\n14\n4" }], tests: [{ input: "1 1\n-7\n1 1", output: "-7" }],
    hint: "Precompute prefix sums.", approach: "sum(l, r) = p[r] − p[l − 1].",
    solution: wrap(`int main(){ ios::sync_with_stdio(false); cin.tie(nullptr); int n,q; cin>>n>>q; vector<long long> p(n+1); for(int i=1;i<=n;i++){ long long x; cin>>x; p[i]=p[i-1]+x;} while(q--){ int l,r; cin>>l>>r; cout<<p[r]-p[l-1]<<"\\n"; } }`), time: "O(N + Q)", space: "O(N)",
  },
];

export const QUESTIONS: Question[] = seeds.map((s, i) => ({
  ...s,
  id: 1001 + i,
  source: "CodeMaster Hub",
  license: "Original content",
  starter: s.starter ?? STARTER,
  addedAt: new Date(Date.UTC(2026, 0, 1 + i)).toISOString(),
}));

export const getQuestion = (slug: string) => QUESTIONS.find((q) => q.slug === slug);
export const ALL_TAGS = Array.from(new Set(QUESTIONS.flatMap((q) => q.tags))).sort();
export const DIFF_ORDER: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

export function relatedQuestions(q: Question, n = 4) {
  return QUESTIONS.filter((x) => x.slug !== q.slug && (x.topic === q.topic || x.tags.some((t) => q.tags.includes(t)))).slice(0, n);
}

export function dailyQuestion(date = new Date()) {
  const key = Number(`${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}`);
  return QUESTIONS[(key * 2654435761) % QUESTIONS.length >>> 0] ?? QUESTIONS[0];
}
