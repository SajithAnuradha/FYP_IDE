export const projects = [
  {
    id: 1,
    name: "SlidingWindowMaximum",
    fileName: "SlidingWindowMaximum.java",
    category: "Arrays",
    difficulty: "Medium",
    description: "Computes the maximum value in every sliding window of size k.",
    functionInfo: {
      name: "maxSlidingWindow",
      signature: "public static int[] maxSlidingWindow(int[] nums, int k)",
      description:
        "Uses a deque of indices to maintain candidates for the maximum value in each window. Older indices must be removed when they fall outside the current window.",
      parameters: [
        { name: "nums", type: "int[]", description: "Input integer array" },
        { name: "k", type: "int", description: "Sliding window size" },
      ],
      returns: { type: "int[]", description: "Maximum value for each sliding window" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(k)",
      bugDescription:
        "The stale-index removal condition uses '<' instead of '<=', allowing an index just outside the window to remain.",
      bugLine: 11,
    },
    synthesizedFeedback:
      "The algorithm is almost correct, but one old index can remain in the deque after it has already moved out of the current window. Re-check the boundary condition used when removing expired indices.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch handles normal increasing and decreasing windows, but fails when the previous maximum is exactly one position outside the current window.",
      },
      {
        iteration: 2,
        feedback:
          "Focus on the condition that removes stale deque indices. The index at i-k is no longer inside the current window and must be removed.",
      },
      {
        iteration: 3,
        feedback:
          "Use an inclusive stale-index check so that indices less than or equal to i-k are removed before reading the window maximum.",
      },
    ],
    buggyCode: `public class SlidingWindowMaximum {

    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums.length == 0 || k == 0) return new int[0];

        int[] result = new int[nums.length - k + 1];
        java.util.Deque<Integer> deque = new java.util.ArrayDeque<>();

        for (int i = 0; i < nums.length; i++) {
            while (!deque.isEmpty() && deque.peekFirst() < i - k) {
                deque.pollFirst();
            }

            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }

            deque.offerLast(i);

            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }

        return result;
    }
}`,
    fixedCode: `public class SlidingWindowMaximum {

    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums.length == 0 || k == 0) return new int[0];

        int[] result = new int[nums.length - k + 1];
        java.util.Deque<Integer> deque = new java.util.ArrayDeque<>();

        for (int i = 0; i < nums.length; i++) {
            while (!deque.isEmpty() && deque.peekFirst() <= i - k) {
                deque.pollFirst();
            }

            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }

            deque.offerLast(i);

            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }

        return result;
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Standard mixed array",
        input: "nums=[1,3,-1,-3,5,3,6,7], k=3",
        expected: "[3, 3, 5, 5, 6, 7]",
        buggyOutput: "[3, 3, 5, 5, 6, 7]",
        runnerMain: `
    int[] out = SlidingWindowMaximum.maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3);
    System.out.println(java.util.Arrays.toString(out));`,
      },
      {
        id: 2,
        description: "Expired maximum at boundary",
        input: "nums=[9,1,2,3], k=3",
        expected: "[9, 3]",
        buggyOutput: "[9, 9]",
        runnerMain: `
    int[] out = SlidingWindowMaximum.maxSlidingWindow(new int[]{9,1,2,3}, 3);
    System.out.println(java.util.Arrays.toString(out));`,
      },
      {
        id: 3,
        description: "Window size one",
        input: "nums=[4,2,7], k=1",
        expected: "[4, 2, 7]",
        buggyOutput: "[4, 4, 7]",
        runnerMain: `
    int[] out = SlidingWindowMaximum.maxSlidingWindow(new int[]{4,2,7}, 1);
    System.out.println(java.util.Arrays.toString(out));`,
      },
      {
        id: 4,
        description: "Strictly increasing values",
        input: "nums=[1,2,3,4], k=2",
        expected: "[2, 3, 4]",
        buggyOutput: "[2, 3, 4]",
        runnerMain: `
    int[] out = SlidingWindowMaximum.maxSlidingWindow(new int[]{1,2,3,4}, 2);
    System.out.println(java.util.Arrays.toString(out));`,
      },
    ],
  },

  {
    id: 2,
    name: "DijkstraShortestPath",
    fileName: "DijkstraShortestPath.java",
    category: "Graphs",
    difficulty: "Hard",
    description: "Finds shortest paths from a source node in a weighted directed graph.",
    functionInfo: {
      name: "shortestPath",
      signature: "public static int shortestPath(int[][] graph, int source, int target)",
      description:
        "Uses Dijkstra's algorithm over an adjacency matrix. A value of 0 means no edge except on the diagonal.",
      parameters: [
        { name: "graph", type: "int[][]", description: "Weighted adjacency matrix" },
        { name: "source", type: "int", description: "Source node" },
        { name: "target", type: "int", description: "Target node" },
      ],
      returns: { type: "int", description: "Shortest distance from source to target, or -1 if unreachable" },
      timeComplexity: "O(V²)",
      spaceComplexity: "O(V)",
      bugDescription:
        "The algorithm marks a node as visited when it is first discovered instead of when its minimum distance is finalized.",
      bugLine: 29,
    },
    synthesizedFeedback:
      "The algorithm works for simple graphs but fails when a shorter path to an already discovered node appears later. In Dijkstra's algorithm, a node should only be finalized after it is selected as the current minimum-distance node.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch passes direct-edge cases but fails when a node is first reached through an expensive path and later through a cheaper path.",
      },
      {
        iteration: 2,
        feedback:
          "Do not treat a node as finalized merely because it was discovered. Discovery and finalization are different states in Dijkstra's algorithm.",
      },
      {
        iteration: 3,
        feedback:
          "Move the visited update to the point where the node is selected as the unvisited node with minimum distance.",
      },
    ],
    buggyCode: `public class DijkstraShortestPath {

    public static int shortestPath(int[][] graph, int source, int target) {
        int n = graph.length;
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];

        java.util.Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        for (int step = 0; step < n; step++) {
            int u = -1;
            int best = Integer.MAX_VALUE;

            for (int i = 0; i < n; i++) {
                if (!visited[i] && dist[i] < best) {
                    best = dist[i];
                    u = i;
                }
            }

            if (u == -1) break;

            for (int v = 0; v < n; v++) {
                if (graph[u][v] > 0 && !visited[v]) {
                    int candidate = dist[u] + graph[u][v];
                    if (candidate < dist[v]) {
                        dist[v] = candidate;
                        visited[v] = true;
                    }
                }
            }
        }

        return dist[target] == Integer.MAX_VALUE ? -1 : dist[target];
    }
}`,
    fixedCode: `public class DijkstraShortestPath {

    public static int shortestPath(int[][] graph, int source, int target) {
        int n = graph.length;
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];

        java.util.Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        for (int step = 0; step < n; step++) {
            int u = -1;
            int best = Integer.MAX_VALUE;

            for (int i = 0; i < n; i++) {
                if (!visited[i] && dist[i] < best) {
                    best = dist[i];
                    u = i;
                }
            }

            if (u == -1) break;
            visited[u] = true;

            for (int v = 0; v < n; v++) {
                if (graph[u][v] > 0 && !visited[v]) {
                    int candidate = dist[u] + graph[u][v];
                    if (candidate < dist[v]) {
                        dist[v] = candidate;
                    }
                }
            }
        }

        return dist[target] == Integer.MAX_VALUE ? -1 : dist[target];
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Simple direct path",
        input: "0->1 weight 5",
        expected: "5",
        buggyOutput: "5",
        runnerMain: `
    int[][] g = {
        {0,5},
        {0,0}
    };
    System.out.println(DijkstraShortestPath.shortestPath(g, 0, 1));`,
      },
      {
        id: 2,
        description: "Cheaper path discovered later",
        input: "0->1=10, 0->2=1, 2->1=1",
        expected: "2",
        buggyOutput: "10",
        runnerMain: `
    int[][] g = {
        {0,10,1},
        {0,0,0},
        {0,1,0}
    };
    System.out.println(DijkstraShortestPath.shortestPath(g, 0, 1));`,
      },
      {
        id: 3,
        description: "Unreachable target",
        input: "target unreachable",
        expected: "-1",
        buggyOutput: "-1",
        runnerMain: `
    int[][] g = {
        {0,2,0},
        {0,0,0},
        {0,0,0}
    };
    System.out.println(DijkstraShortestPath.shortestPath(g, 0, 2));`,
      },
      {
        id: 4,
        description: "Multi-hop cheaper route",
        input: "0->1=8, 0->2=2, 2->3=2, 3->1=1",
        expected: "5",
        buggyOutput: "8",
        runnerMain: `
    int[][] g = {
        {0,8,2,0},
        {0,0,0,0},
        {0,0,0,2},
        {0,1,0,0}
    };
    System.out.println(DijkstraShortestPath.shortestPath(g, 0, 1));`,
      },
    ],
  },

  {
    id: 3,
    name: "MinWindowSubstring",
    fileName: "MinWindowSubstring.java",
    category: "Strings",
    difficulty: "Hard",
    description: "Finds the smallest substring of s that contains all characters of t.",
    functionInfo: {
      name: "minWindow",
      signature: "public static String minWindow(String s, String t)",
      description:
        "Uses a sliding window with frequency maps to find the minimum-length substring of s containing every required character from t.",
      parameters: [
        { name: "s", type: "String", description: "Search string" },
        { name: "t", type: "String", description: "Required characters" },
      ],
      returns: { type: "String", description: "Minimum valid window, or empty string if no window exists" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) for ASCII character set",
      bugDescription:
        "The shrinking loop uses left < right, preventing valid single-character windows from being processed.",
      bugLine: 30,
    },
    synthesizedFeedback:
      "The window logic is mostly correct, but the algorithm fails when the best valid window has length one. Re-check the condition used before shrinking and recording a valid window.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch works for normal multi-character windows but still fails when s and t are both one character.",
      },
      {
        iteration: 2,
        feedback:
          "A valid window can exist even when left and right point to the same index. The shrink condition should allow that case.",
      },
      {
        iteration: 3,
        feedback:
          "Use only the validity condition to control shrinking; do not require left to be strictly less than right.",
      },
    ],
    buggyCode: `public class MinWindowSubstring {

    public static String minWindow(String s, String t) {
        if (s.length() == 0 || t.length() == 0) return "";

        int[] need = new int[128];
        int[] window = new int[128];
        int required = 0;

        for (char c : t.toCharArray()) {
            if (need[c] == 0) required++;
            need[c]++;
        }

        int formed = 0;
        int left = 0;
        int bestLen = Integer.MAX_VALUE;
        int bestStart = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window[c]++;

            if (need[c] > 0 && window[c] == need[c]) {
                formed++;
            }

            while (formed == required && left < right) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }

                char remove = s.charAt(left);
                window[remove]--;

                if (need[remove] > 0 && window[remove] < need[remove]) {
                    formed--;
                }

                left++;
            }
        }

        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
    fixedCode: `public class MinWindowSubstring {

    public static String minWindow(String s, String t) {
        if (s.length() == 0 || t.length() == 0) return "";

        int[] need = new int[128];
        int[] window = new int[128];
        int required = 0;

        for (char c : t.toCharArray()) {
            if (need[c] == 0) required++;
            need[c]++;
        }

        int formed = 0;
        int left = 0;
        int bestLen = Integer.MAX_VALUE;
        int bestStart = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window[c]++;

            if (need[c] > 0 && window[c] == need[c]) {
                formed++;
            }

            while (formed == required) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }

                char remove = s.charAt(left);
                window[remove]--;

                if (need[remove] > 0 && window[remove] < need[remove]) {
                    formed--;
                }

                left++;
            }
        }

        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Classic minimum window",
        input: "s=\"ADOBECODEBANC\", t=\"ABC\"",
        expected: "BANC",
        buggyOutput: "BANC",
        runnerMain: `    System.out.println(MinWindowSubstring.minWindow("ADOBECODEBANC", "ABC"));`,
      },
      {
        id: 2,
        description: "Single-character exact window",
        input: "s=\"a\", t=\"a\"",
        expected: "a",
        buggyOutput: "",
        runnerMain: `    System.out.println(MinWindowSubstring.minWindow("a", "a"));`,
      },
      {
        id: 3,
        description: "No valid window",
        input: "s=\"a\", t=\"aa\"",
        expected: "",
        buggyOutput: "",
        runnerMain: `    System.out.println(MinWindowSubstring.minWindow("a", "aa"));`,
      },
      {
        id: 4,
        description: "Best window length one inside larger string",
        input: "s=\"ba\", t=\"a\"",
        expected: "a",
        buggyOutput: "ba",
        runnerMain: `    System.out.println(MinWindowSubstring.minWindow("ba", "a"));`,
      },
    ],
  },

  {
    id: 4,
    name: "LRUCache",
    fileName: "LRUCache.java",
    category: "Data Structures",
    difficulty: "Hard",
    description: "Implements a least recently used cache with get and put operations.",
    functionInfo: {
      name: "LRUCache",
      signature: "public LRUCache(int capacity), public int get(int key), public void put(int key, int value)",
      description:
        "Uses LinkedHashMap access order to evict the least recently used key when capacity is exceeded.",
      parameters: [
        { name: "capacity", type: "int", description: "Maximum cache size" },
        { name: "key", type: "int", description: "Cache key" },
        { name: "value", type: "int", description: "Cache value" },
      ],
      returns: { type: "int", description: "Value for get, or -1 if key does not exist" },
      timeComplexity: "O(1)",
      spaceComplexity: "O(capacity)",
      bugDescription:
        "The LinkedHashMap is created in insertion-order mode instead of access-order mode, so recently accessed keys are not refreshed.",
      bugLine: 8,
    },
    synthesizedFeedback:
      "Eviction works for simple insertion-only cases, but fails after a get operation. Accessing a key should make it recently used, otherwise the cache evicts the wrong key.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch passes capacity overflow cases but fails when get is called before inserting another key.",
      },
      {
        iteration: 2,
        feedback:
          "The cache order must change on access, not only on insertion. Re-check how the map maintains ordering.",
      },
      {
        iteration: 3,
        feedback:
          "Configure the underlying map to maintain access order so get operations update recency.",
      },
    ],
    buggyCode: `public class LRUCache {

    private final int capacity;
    private final java.util.LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new java.util.LinkedHashMap<Integer, Integer>(capacity, 0.75f, false);
    }

    public int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        map.put(key, value);

        if (map.size() > capacity) {
            Integer firstKey = map.keySet().iterator().next();
            map.remove(firstKey);
        }
    }
}`,
    fixedCode: `public class LRUCache {

    private final int capacity;
    private final java.util.LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new java.util.LinkedHashMap<Integer, Integer>(capacity, 0.75f, true);
    }

    public int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        map.put(key, value);

        if (map.size() > capacity) {
            Integer firstKey = map.keySet().iterator().next();
            map.remove(firstKey);
        }
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Simple put and get",
        input: "put(1,10), get(1)",
        expected: "10",
        buggyOutput: "10",
        runnerMain: `
    LRUCache c = new LRUCache(2);
    c.put(1, 10);
    System.out.println(c.get(1));`,
      },
      {
        id: 2,
        description: "Eviction without prior access",
        input: "put(1), put(2), put(3), get(1)",
        expected: "-1",
        buggyOutput: "-1",
        runnerMain: `
    LRUCache c = new LRUCache(2);
    c.put(1, 10);
    c.put(2, 20);
    c.put(3, 30);
    System.out.println(c.get(1));`,
      },
      {
        id: 3,
        description: "Access should refresh recency",
        input: "put(1), put(2), get(1), put(3), get(1)",
        expected: "10",
        buggyOutput: "-1",
        runnerMain: `
    LRUCache c = new LRUCache(2);
    c.put(1, 10);
    c.put(2, 20);
    c.get(1);
    c.put(3, 30);
    System.out.println(c.get(1));`,
      },
      {
        id: 4,
        description: "Accessed key should survive eviction",
        input: "put(1), put(2), get(1), put(3), get(2)",
        expected: "-1",
        buggyOutput: "20",
        runnerMain: `
    LRUCache c = new LRUCache(2);
    c.put(1, 10);
    c.put(2, 20);
    c.get(1);
    c.put(3, 30);
    System.out.println(c.get(2));`,
      },
    ],
  },

  {
    id: 5,
    name: "WildcardMatcher",
    fileName: "WildcardMatcher.java",
    category: "Dynamic Programming",
    difficulty: "Hard",
    description: "Matches a string against a wildcard pattern containing ? and *.",
    functionInfo: {
      name: "isMatch",
      signature: "public static boolean isMatch(String s, String p)",
      description:
        "Uses dynamic programming where ? matches one character and * matches zero or more characters.",
      parameters: [
        { name: "s", type: "String", description: "Input string" },
        { name: "p", type: "String", description: "Wildcard pattern" },
      ],
      returns: { type: "boolean", description: "true if the pattern matches the whole string" },
      timeComplexity: "O(mn)",
      spaceComplexity: "O(mn)",
      bugDescription:
        "The '*' transition does not allow '*' to match zero characters.",
      bugLine: 17,
    },
    synthesizedFeedback:
      "The matcher works for many patterns, but fails when '*' needs to represent an empty sequence. A wildcard star must support both consuming a character and consuming nothing.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch handles '*' as one or more characters, but still fails when the star should match zero characters.",
      },
      {
        iteration: 2,
        feedback:
          "For '*', the DP transition should combine two possibilities: skip the star or use it to consume one more character.",
      },
      {
        iteration: 3,
        feedback:
          "The zero-character case depends on the previous pattern column, not the previous string row.",
      },
    ],
    buggyCode: `public class WildcardMatcher {

    public static boolean isMatch(String s, String p) {
        boolean[][] dp = new boolean[s.length() + 1][p.length() + 1];
        dp[0][0] = true;

        for (int j = 1; j <= p.length(); j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 1; j <= p.length(); j++) {
                char pc = p.charAt(j - 1);

                if (pc == '*') {
                    dp[i][j] = dp[i - 1][j];
                } else if (pc == '?' || pc == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }

        return dp[s.length()][p.length()];
    }
}`,
    fixedCode: `public class WildcardMatcher {

    public static boolean isMatch(String s, String p) {
        boolean[][] dp = new boolean[s.length() + 1][p.length() + 1];
        dp[0][0] = true;

        for (int j = 1; j <= p.length(); j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 1; j <= p.length(); j++) {
                char pc = p.charAt(j - 1);

                if (pc == '*') {
                    dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
                } else if (pc == '?' || pc == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }

        return dp[s.length()][p.length()];
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Exact match",
        input: "s=\"abc\", p=\"abc\"",
        expected: "true",
        buggyOutput: "true",
        runnerMain: `    System.out.println(WildcardMatcher.isMatch("abc", "abc"));`,
      },
      {
        id: 2,
        description: "Question mark match",
        input: "s=\"abc\", p=\"a?c\"",
        expected: "true",
        buggyOutput: "true",
        runnerMain: `    System.out.println(WildcardMatcher.isMatch("abc", "a?c"));`,
      },
      {
        id: 3,
        description: "Star matches zero characters",
        input: "s=\"abc\", p=\"ab*c\"",
        expected: "true",
        buggyOutput: "false",
        runnerMain: `    System.out.println(WildcardMatcher.isMatch("abc", "ab*c"));`,
      },
      {
        id: 4,
        description: "Star bridges middle section",
        input: "s=\"adceb\", p=\"*a*b\"",
        expected: "true",
        buggyOutput: "false",
        runnerMain: `    System.out.println(WildcardMatcher.isMatch("adceb", "*a*b"));`,
      },
    ],
  },

  {
    id: 6,
    name: "WeightedIntervalScheduler",
    fileName: "WeightedIntervalScheduler.java",
    category: "Dynamic Programming",
    difficulty: "Hard",
    description: "Computes the maximum total profit from non-overlapping weighted intervals.",
    functionInfo: {
      name: "maxProfit",
      signature: "public static int maxProfit(int[][] jobs)",
      description:
        "Each job is represented as [start, end, profit]. The function chooses non-overlapping jobs with maximum total profit.",
      parameters: [{ name: "jobs", type: "int[][]", description: "Array of jobs [start, end, profit]" }],
      returns: { type: "int", description: "Maximum total profit" },
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      bugDescription:
        "The binary search treats jobs ending exactly at the next job's start as incompatible.",
      bugLine: 29,
    },
    synthesizedFeedback:
      "The scheduler works for clearly separated intervals, but fails when one job ends exactly when another begins. Those jobs should be compatible because they do not overlap.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch improves overlapping cases but still rejects back-to-back jobs where end time equals start time.",
      },
      {
        iteration: 2,
        feedback:
          "In interval scheduling, [1,3] and [3,5] are compatible if end time is exclusive or touching intervals are allowed.",
      },
      {
        iteration: 3,
        feedback:
          "Update the compatibility check to include equality between previous end time and current start time.",
      },
    ],
    buggyCode: `public class WeightedIntervalScheduler {

    public static int maxProfit(int[][] jobs) {
        java.util.Arrays.sort(jobs, java.util.Comparator.comparingInt(a -> a[1]));

        int n = jobs.length;
        int[] dp = new int[n];

        for (int i = 0; i < n; i++) {
            int include = jobs[i][2];
            int prev = findPrevious(jobs, i);

            if (prev != -1) {
                include += dp[prev];
            }

            int exclude = i == 0 ? 0 : dp[i - 1];
            dp[i] = Math.max(include, exclude);
        }

        return n == 0 ? 0 : dp[n - 1];
    }

    private static int findPrevious(int[][] jobs, int index) {
        int low = 0;
        int high = index - 1;
        int result = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (jobs[mid][1] < jobs[index][0]) {
                result = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return result;
    }
}`,
    fixedCode: `public class WeightedIntervalScheduler {

    public static int maxProfit(int[][] jobs) {
        java.util.Arrays.sort(jobs, java.util.Comparator.comparingInt(a -> a[1]));

        int n = jobs.length;
        int[] dp = new int[n];

        for (int i = 0; i < n; i++) {
            int include = jobs[i][2];
            int prev = findPrevious(jobs, i);

            if (prev != -1) {
                include += dp[prev];
            }

            int exclude = i == 0 ? 0 : dp[i - 1];
            dp[i] = Math.max(include, exclude);
        }

        return n == 0 ? 0 : dp[n - 1];
    }

    private static int findPrevious(int[][] jobs, int index) {
        int low = 0;
        int high = index - 1;
        int result = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (jobs[mid][1] <= jobs[index][0]) {
                result = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return result;
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Clearly separated jobs",
        input: "[[1,2,10],[3,4,20]]",
        expected: "30",
        buggyOutput: "30",
        runnerMain: `
    int[][] jobs = {{1,2,10},{3,4,20}};
    System.out.println(WeightedIntervalScheduler.maxProfit(jobs));`,
      },
      {
        id: 2,
        description: "Back-to-back jobs should both be selected",
        input: "[[1,3,20],[3,5,30]]",
        expected: "50",
        buggyOutput: "30",
        runnerMain: `
    int[][] jobs = {{1,3,20},{3,5,30}};
    System.out.println(WeightedIntervalScheduler.maxProfit(jobs));`,
      },
      {
        id: 3,
        description: "Overlapping jobs choose better one",
        input: "[[1,4,50],[2,5,60]]",
        expected: "60",
        buggyOutput: "60",
        runnerMain: `
    int[][] jobs = {{1,4,50},{2,5,60}};
    System.out.println(WeightedIntervalScheduler.maxProfit(jobs));`,
      },
      {
        id: 4,
        description: "Chain of touching intervals",
        input: "[[1,2,5],[2,3,6],[3,4,7]]",
        expected: "18",
        buggyOutput: "12",
        runnerMain: `
    int[][] jobs = {{1,2,5},{2,3,6},{3,4,7}};
    System.out.println(WeightedIntervalScheduler.maxProfit(jobs));`,
      },
    ],
  },

  {
    id: 7,
    name: "CourseSchedule",
    fileName: "CourseSchedule.java",
    category: "Graphs",
    difficulty: "Hard",
    description: "Determines whether all courses can be completed given prerequisite pairs.",
    functionInfo: {
      name: "canFinish",
      signature: "public static boolean canFinish(int numCourses, int[][] prerequisites)",
      description:
        "Uses DFS cycle detection over a directed graph. A cycle means the course plan is impossible.",
      parameters: [
        { name: "numCourses", type: "int", description: "Number of courses" },
        { name: "prerequisites", type: "int[][]", description: "Pairs [course, prerequisite]" },
      ],
      returns: { type: "boolean", description: "true if all courses can be completed" },
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
      bugDescription:
        "The DFS marks a node as fully visited before exploring its neighbors, hiding cycles in the recursion stack.",
      bugLine: 28,
    },
    synthesizedFeedback:
      "The graph traversal works for acyclic chains but misses cycles. DFS needs to distinguish nodes currently in the recursion stack from nodes that are fully processed.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch passes simple dependency chains but still returns true for a two-node cycle.",
      },
      {
        iteration: 2,
        feedback:
          "A node should not be marked as completely processed before all of its outgoing edges are checked.",
      },
      {
        iteration: 3,
        feedback:
          "Use three states: unvisited, visiting, and visited. Only convert visiting to visited after DFS over neighbors succeeds.",
      },
    ],
    buggyCode: `public class CourseSchedule {

    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        java.util.List<java.util.List<Integer>> graph = new java.util.ArrayList<>();

        for (int i = 0; i < numCourses; i++) {
            graph.add(new java.util.ArrayList<>());
        }

        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
        }

        int[] state = new int[numCourses];

        for (int i = 0; i < numCourses; i++) {
            if (!dfs(i, graph, state)) return false;
        }

        return true;
    }

    private static boolean dfs(int node, java.util.List<java.util.List<Integer>> graph, int[] state) {
        if (state[node] == 1) return false;
        if (state[node] == 2) return true;

        state[node] = 2;

        for (int next : graph.get(node)) {
            if (!dfs(next, graph, state)) return false;
        }

        return true;
    }
}`,
    fixedCode: `public class CourseSchedule {

    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        java.util.List<java.util.List<Integer>> graph = new java.util.ArrayList<>();

        for (int i = 0; i < numCourses; i++) {
            graph.add(new java.util.ArrayList<>());
        }

        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
        }

        int[] state = new int[numCourses];

        for (int i = 0; i < numCourses; i++) {
            if (!dfs(i, graph, state)) return false;
        }

        return true;
    }

    private static boolean dfs(int node, java.util.List<java.util.List<Integer>> graph, int[] state) {
        if (state[node] == 1) return false;
        if (state[node] == 2) return true;

        state[node] = 1;

        for (int next : graph.get(node)) {
            if (!dfs(next, graph, state)) return false;
        }

        state[node] = 2;
        return true;
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Simple acyclic dependency",
        input: "numCourses=2, prerequisites=[[1,0]]",
        expected: "true",
        buggyOutput: "true",
        runnerMain: `
    int[][] p = {{1,0}};
    System.out.println(CourseSchedule.canFinish(2, p));`,
      },
      {
        id: 2,
        description: "Two-node cycle",
        input: "numCourses=2, prerequisites=[[1,0],[0,1]]",
        expected: "false",
        buggyOutput: "true",
        runnerMain: `
    int[][] p = {{1,0},{0,1}};
    System.out.println(CourseSchedule.canFinish(2, p));`,
      },
      {
        id: 3,
        description: "Long acyclic chain",
        input: "0->1->2->3",
        expected: "true",
        buggyOutput: "true",
        runnerMain: `
    int[][] p = {{1,0},{2,1},{3,2}};
    System.out.println(CourseSchedule.canFinish(4, p));`,
      },
      {
        id: 4,
        description: "Three-node cycle",
        input: "0->1->2->0",
        expected: "false",
        buggyOutput: "true",
        runnerMain: `
    int[][] p = {{1,0},{2,1},{0,2}};
    System.out.println(CourseSchedule.canFinish(3, p));`,
      },
    ],
  },

  {
    id: 8,
    name: "ExpressionEvaluator",
    fileName: "ExpressionEvaluator.java",
    category: "Parsing",
    difficulty: "Hard",
    description: "Evaluates arithmetic expressions containing +, -, *, / and spaces.",
    functionInfo: {
      name: "calculate",
      signature: "public static int calculate(String s)",
      description:
        "Evaluates a basic arithmetic expression with operator precedence. Multiplication and division must be applied before addition and subtraction.",
      parameters: [{ name: "s", type: "String", description: "Arithmetic expression string" }],
      returns: { type: "int", description: "Evaluated integer result" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      bugDescription:
        "The evaluator treats '-' like '+', pushing positive numbers instead of negative numbers.",
      bugLine: 24,
    },
    synthesizedFeedback:
      "The parser respects multiplication and division, but subtraction behaves like addition. Check how the previous operator affects the number pushed into the stack.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch passes expressions with only addition and multiplication, but fails when subtraction appears.",
      },
      {
        iteration: 2,
        feedback:
          "Subtraction should not be delayed as a positive value. It should contribute a negative value to the final sum.",
      },
      {
        iteration: 3,
        feedback:
          "When the previous sign is '-', push -num onto the stack instead of num.",
      },
    ],
    buggyCode: `public class ExpressionEvaluator {

    public static int calculate(String s) {
        java.util.Stack<Integer> stack = new java.util.Stack<>();
        int num = 0;
        char sign = '+';

        for (int i = 0; i <= s.length(); i++) {
            char c = i == s.length() ? '+' : s.charAt(i);

            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            }

            if ((!Character.isDigit(c) && c != ' ') || i == s.length()) {
                if (sign == '+') {
                    stack.push(num);
                } else if (sign == '-') {
                    stack.push(num);
                } else if (sign == '*') {
                    stack.push(stack.pop() * num);
                } else if (sign == '/') {
                    stack.push(stack.pop() / num);
                }

                sign = c;
                num = 0;
            }
        }

        int result = 0;
        while (!stack.isEmpty()) {
            result += stack.pop();
        }

        return result;
    }
}`,
    fixedCode: `public class ExpressionEvaluator {

    public static int calculate(String s) {
        java.util.Stack<Integer> stack = new java.util.Stack<>();
        int num = 0;
        char sign = '+';

        for (int i = 0; i <= s.length(); i++) {
            char c = i == s.length() ? '+' : s.charAt(i);

            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            }

            if ((!Character.isDigit(c) && c != ' ') || i == s.length()) {
                if (sign == '+') {
                    stack.push(num);
                } else if (sign == '-') {
                    stack.push(-num);
                } else if (sign == '*') {
                    stack.push(stack.pop() * num);
                } else if (sign == '/') {
                    stack.push(stack.pop() / num);
                }

                sign = c;
                num = 0;
            }
        }

        int result = 0;
        while (!stack.isEmpty()) {
            result += stack.pop();
        }

        return result;
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Addition and multiplication",
        input: "\"3+2*2\"",
        expected: "7",
        buggyOutput: "7",
        runnerMain: `    System.out.println(ExpressionEvaluator.calculate("3+2*2"));`,
      },
      {
        id: 2,
        description: "Subtraction",
        input: "\"10-3\"",
        expected: "7",
        buggyOutput: "13",
        runnerMain: `    System.out.println(ExpressionEvaluator.calculate("10-3"));`,
      },
      {
        id: 3,
        description: "Subtraction with multiplication",
        input: "\"14-3*2\"",
        expected: "8",
        buggyOutput: "20",
        runnerMain: `    System.out.println(ExpressionEvaluator.calculate("14-3*2"));`,
      },
      {
        id: 4,
        description: "Division only",
        input: "\"8/2+3\"",
        expected: "7",
        buggyOutput: "7",
        runnerMain: `    System.out.println(ExpressionEvaluator.calculate("8/2+3"));`,
      },
    ],
  },

  {
    id: 9,
    name: "CsvParser",
    fileName: "CsvParser.java",
    category: "Strings",
    difficulty: "Hard",
    description: "Parses one CSV row into fields while supporting quoted commas.",
    functionInfo: {
      name: "parseLine",
      signature: "public static java.util.List<String> parseLine(String line)",
      description:
        "Splits a CSV line by commas, but commas inside double quotes must remain part of the current field.",
      parameters: [{ name: "line", type: "String", description: "Single CSV row" }],
      returns: { type: "List<String>", description: "Parsed CSV fields" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      bugDescription:
        "The parser toggles quote state for every double quote, including escaped double quotes inside quoted fields.",
      bugLine: 13,
    },
    synthesizedFeedback:
      "The parser works for simple quoted commas, but fails when a quoted field contains an escaped quote. Two consecutive double quotes inside a quoted field represent one literal quote, not quote-state toggling.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch handles commas inside quotes but still breaks on doubled quotes inside quoted fields.",
      },
      {
        iteration: 2,
        feedback:
          "Inside a quoted field, two consecutive quote characters should append one quote to the field and skip the second quote.",
      },
      {
        iteration: 3,
        feedback:
          "Only toggle quote state when the quote is not part of an escaped quote pair.",
      },
    ],
    buggyCode: `public class CsvParser {

    public static java.util.List<String> parseLine(String line) {
        java.util.List<String> fields = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }

        fields.add(current.toString());
        return fields;
    }
}`,
    fixedCode: `public class CsvParser {

    public static java.util.List<String> parseLine(String line) {
        java.util.List<String> fields = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"' && inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                current.append('"');
                i++;
            } else if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }

        fields.add(current.toString());
        return fields;
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Simple CSV",
        input: "\"a,b,c\"",
        expected: "[a, b, c]",
        buggyOutput: "[a, b, c]",
        runnerMain: `    System.out.println(CsvParser.parseLine("a,b,c"));`,
      },
      {
        id: 2,
        description: "Quoted comma",
        input: "\"a,\\\"b,c\\\",d\"",
        expected: "[a, b,c, d]",
        buggyOutput: "[a, b,c, d]",
        runnerMain: `    System.out.println(CsvParser.parseLine("a,\\"b,c\\",d"));`,
      },
      {
        id: 3,
        description: "Escaped quote inside quoted field",
        input: "\"\\\"a\\\"\\\"b\\\",c\"",
        expected: "[a\"b, c]",
        buggyOutput: "[ab, c]",
        runnerMain: `    System.out.println(CsvParser.parseLine("\\"a\\"\\"b\\",c"));`,
      },
      {
        id: 4,
        description: "Quoted comma and escaped quote",
        input: "\"x,\\\"y\\\"\\\",z\\\",q\"",
        expected: "[x, y\",z, q]",
        buggyOutput: "[x, y,z, q]",
        runnerMain: `    System.out.println(CsvParser.parseLine("x,\\"y\\"\\",z\\",q"));`,
      },
    ],
  },

  {
    id: 10,
    name: "MedianSortedArrays",
    fileName: "MedianSortedArrays.java",
    category: "Searching",
    difficulty: "Hard",
    description: "Finds the median of two sorted arrays.",
    functionInfo: {
      name: "findMedian",
      signature: "public static double findMedian(int[] a, int[] b)",
      description:
        "Uses binary search partitioning to compute the median of two sorted arrays in logarithmic time.",
      parameters: [
        { name: "a", type: "int[]", description: "First sorted array" },
        { name: "b", type: "int[]", description: "Second sorted array" },
      ],
      returns: { type: "double", description: "Median value of the combined sorted arrays" },
      timeComplexity: "O(log(min(m,n)))",
      spaceComplexity: "O(1)",
      bugDescription:
        "For odd total length, the algorithm returns the maximum left value instead of the minimum right value.",
      bugLine: 25,
    },
    synthesizedFeedback:
      "The partition logic is almost correct, but odd-length combined arrays return the wrong side of the partition. The median for odd length should be the first value on the right side after a valid partition.",
    feedbackIterations: [
      {
        iteration: 1,
        feedback:
          "The patch passes even-length arrays but fails when the total number of elements is odd.",
      },
      {
        iteration: 2,
        feedback:
          "After a valid partition, the left side contains one fewer element than the right side for this implementation.",
      },
      {
        iteration: 3,
        feedback:
          "For odd total length, return min(minRightA, minRightB), not max(maxLeftA, maxLeftB).",
      },
    ],
    buggyCode: `public class MedianSortedArrays {

    public static double findMedian(int[] a, int[] b) {
        if (a.length > b.length) return findMedian(b, a);

        int m = a.length;
        int n = b.length;
        int total = m + n;
        int half = total / 2;

        int low = 0;
        int high = m;

        while (low <= high) {
            int i = low + (high - low) / 2;
            int j = half - i;

            int maxLeftA = i == 0 ? Integer.MIN_VALUE : a[i - 1];
            int minRightA = i == m ? Integer.MAX_VALUE : a[i];
            int maxLeftB = j == 0 ? Integer.MIN_VALUE : b[j - 1];
            int minRightB = j == n ? Integer.MAX_VALUE : b[j];

            if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
                if (total % 2 == 1) {
                    return Math.max(maxLeftA, maxLeftB);
                }

                return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0;
            } else if (maxLeftA > minRightB) {
                high = i - 1;
            } else {
                low = i + 1;
            }
        }

        return 0.0;
    }
}`,
    fixedCode: `public class MedianSortedArrays {

    public static double findMedian(int[] a, int[] b) {
        if (a.length > b.length) return findMedian(b, a);

        int m = a.length;
        int n = b.length;
        int total = m + n;
        int half = total / 2;

        int low = 0;
        int high = m;

        while (low <= high) {
            int i = low + (high - low) / 2;
            int j = half - i;

            int maxLeftA = i == 0 ? Integer.MIN_VALUE : a[i - 1];
            int minRightA = i == m ? Integer.MAX_VALUE : a[i];
            int maxLeftB = j == 0 ? Integer.MIN_VALUE : b[j - 1];
            int minRightB = j == n ? Integer.MAX_VALUE : b[j];

            if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
                if (total % 2 == 1) {
                    return Math.min(minRightA, minRightB);
                }

                return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0;
            } else if (maxLeftA > minRightB) {
                high = i - 1;
            } else {
                low = i + 1;
            }
        }

        return 0.0;
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Even combined length",
        input: "a=[1,2], b=[3,4]",
        expected: "2.5",
        buggyOutput: "2.5",
        runnerMain: `    System.out.println(MedianSortedArrays.findMedian(new int[]{1,2}, new int[]{3,4}));`,
      },
      {
        id: 2,
        description: "Odd combined length",
        input: "a=[1,3], b=[2]",
        expected: "2.0",
        buggyOutput: "1.0",
        runnerMain: `    System.out.println(MedianSortedArrays.findMedian(new int[]{1,3}, new int[]{2}));`,
      },
      {
        id: 3,
        description: "Odd length with separated arrays",
        input: "a=[1,2], b=[3,4,5]",
        expected: "3.0",
        buggyOutput: "2.0",
        runnerMain: `    System.out.println(MedianSortedArrays.findMedian(new int[]{1,2}, new int[]{3,4,5}));`,
      },
      {
        id: 4,
        description: "Even length with empty first array",
        input: "a=[], b=[1,2]",
        expected: "1.5",
        buggyOutput: "1.5",
        runnerMain: `    System.out.println(MedianSortedArrays.findMedian(new int[]{}, new int[]{1,2}));`,
      },
    ],
  },
];