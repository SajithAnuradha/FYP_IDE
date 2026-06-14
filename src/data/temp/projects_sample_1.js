export const projects = [
  {
    id: 1,
    name: "Sqrt",
    fileName: "Sqrt.java",
    category: "Math",
    difficulty: "Easy",
    description: "Computes the integer square root of a non-negative integer.",
    functionInfo: {
      name: "sqrt",
      signature: "public static int sqrt(int x)",
      description:
        "Returns the floor value of the square root of a non-negative integer. For example, sqrt(10) returns 3 and sqrt(16) returns 4.",
      parameters: [{ name: "x", type: "int", description: "Non-negative integer input" }],
      returns: { type: "int", description: "Floor of the square root" },
      timeComplexity: "O(√n)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 5: The loop uses '<' instead of '<=', so perfect squares return one less than the correct square root.",
      bugLine: 5,
    },
    synthesizedFeedback:
      "The loop should continue while the next square is less than or equal to the input. Using only '<' skips exact perfect-square matches, causing values like 16 to return 3 instead of 4.",
    buggyCode: `public class Sqrt {

    public static int sqrt(int x) {
        int r = 0;

        while ((r + 1) * (r + 1) < x) {  // BUG: should be <= x
            r++;
        }

        return r;
    }

    public static void main(String[] args) {
        System.out.println(sqrt(16));
    }
}`,
    fixedCode: `public class Sqrt {

    public static int sqrt(int x) {
        int r = 0;

        while ((r + 1) * (r + 1) <= x) {  // FIXED
            r++;
        }

        return r;
    }

    public static void main(String[] args) {
        System.out.println(sqrt(16));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Square root of 0",
        input: "x=0",
        expected: "0",
        buggyOutput: "0",
        runnerMain: `    System.out.println(Sqrt.sqrt(0));`,
      },
      {
        id: 2,
        description: "Square root of non-perfect square",
        input: "x=10",
        expected: "3",
        buggyOutput: "3",
        runnerMain: `    System.out.println(Sqrt.sqrt(10));`,
      },
      {
        id: 3,
        description: "Square root of perfect square",
        input: "x=16",
        expected: "4",
        buggyOutput: "3",
        runnerMain: `    System.out.println(Sqrt.sqrt(16));`,
      },
      {
        id: 4,
        description: "Square root of 1",
        input: "x=1",
        expected: "1",
        buggyOutput: "0",
        runnerMain: `    System.out.println(Sqrt.sqrt(1));`,
      },
    ],
  },

  {
    id: 2,
    name: "ValidParenthesization",
    fileName: "ValidParenthesization.java",
    category: "Strings",
    difficulty: "Easy",
    description: "Checks whether a string has valid balanced parentheses.",
    functionInfo: {
      name: "isValidParenthesization",
      signature: "public static boolean isValidParenthesization(String s)",
      description:
        "Checks whether every opening parenthesis has a matching closing parenthesis and no closing parenthesis appears before its matching opening parenthesis.",
      parameters: [{ name: "s", type: "String", description: "Input parenthesis string" }],
      returns: { type: "boolean", description: "true if the parenthesization is valid, false otherwise" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 10: When depth becomes negative, the function returns true instead of false.",
      bugLine: 10,
    },
    synthesizedFeedback:
      "If the depth becomes negative, a closing parenthesis appeared before a matching opening parenthesis. That state is invalid, so the function should return false instead of true.",
    buggyCode: `public class ValidParenthesization {

    public static boolean isValidParenthesization(String s) {
        int depth = 0;

        for (char c : s.toCharArray()) {
            if (c == '(') depth++;
            else if (c == ')') depth--;

            if (depth < 0) return true;  // BUG: should return false
        }

        return depth == 0;
    }

    public static void main(String[] args) {
        System.out.println(isValidParenthesization("())"));
    }
}`,
    fixedCode: `public class ValidParenthesization {

    public static boolean isValidParenthesization(String s) {
        int depth = 0;

        for (char c : s.toCharArray()) {
            if (c == '(') depth++;
            else if (c == ')') depth--;

            if (depth < 0) return false;  // FIXED
        }

        return depth == 0;
    }

    public static void main(String[] args) {
        System.out.println(isValidParenthesization("())"));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Valid simple parentheses",
        input: "\"()\"",
        expected: "true",
        buggyOutput: "true",
        runnerMain: `    System.out.println(ValidParenthesization.isValidParenthesization("()"));`,
      },
      {
        id: 2,
        description: "Valid nested parentheses",
        input: "\"(())\"",
        expected: "true",
        buggyOutput: "true",
        runnerMain: `    System.out.println(ValidParenthesization.isValidParenthesization("(())"));`,
      },
      {
        id: 3,
        description: "Missing closing parenthesis",
        input: "\"(()\"",
        expected: "false",
        buggyOutput: "false",
        runnerMain: `    System.out.println(ValidParenthesization.isValidParenthesization("(()"));`,
      },
      {
        id: 4,
        description: "Closing parenthesis appears too early",
        input: "\")(\"",
        expected: "false",
        buggyOutput: "true",
        runnerMain: `    System.out.println(ValidParenthesization.isValidParenthesization(")("));`,
      },
    ],
  },

  {
    id: 3,
    name: "ToBase",
    fileName: "ToBase.java",
    category: "Math",
    difficulty: "Easy",
    description: "Converts a decimal integer into a string representation in another base.",
    functionInfo: {
      name: "toBase",
      signature: "public static String toBase(int n, int base)",
      description:
        "Converts a non-negative integer to the given base using repeated division and remainder extraction.",
      parameters: [
        { name: "n", type: "int", description: "Non-negative integer to convert" },
        { name: "base", type: "int", description: "Target base between 2 and 36" },
      ],
      returns: { type: "String", description: "String representation of n in the target base" },
      timeComplexity: "O(log n)",
      spaceComplexity: "O(log n)",
      bugDescription: "Line 9: Uses n / base to choose the digit instead of n % base.",
      bugLine: 9,
    },
    synthesizedFeedback:
      "Each output digit in base conversion comes from the remainder of dividing by the base. The quotient is used only to reduce the number for the next iteration.",
    buggyCode: `public class ToBase {

    public static String toBase(int n, int base) {
        String digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        if (n == 0) return "0";

        String result = "";
        while (n > 0) {
            result = digits.charAt(n / base) + result;  // BUG: should use n % base
            n = n / base;
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(toBase(5, 2));
    }
}`,
    fixedCode: `public class ToBase {

    public static String toBase(int n, int base) {
        String digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        if (n == 0) return "0";

        String result = "";
        while (n > 0) {
            result = digits.charAt(n % base) + result;  // FIXED
            n = n / base;
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(toBase(5, 2));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Convert zero",
        input: "n=0, base=2",
        expected: "0",
        buggyOutput: "0",
        runnerMain: `    System.out.println(ToBase.toBase(0, 2));`,
      },
      {
        id: 2,
        description: "Convert 5 to binary",
        input: "n=5, base=2",
        expected: "101",
        buggyOutput: "012",
        runnerMain: `    System.out.println(ToBase.toBase(5, 2));`,
      },
      {
        id: 3,
        description: "Convert 255 to hexadecimal",
        input: "n=255, base=16",
        expected: "FF",
        buggyOutput: "0F",
        runnerMain: `    System.out.println(ToBase.toBase(255, 16));`,
      },
      {
        id: 4,
        description: "Convert 10 to decimal string",
        input: "n=10, base=10",
        expected: "10",
        buggyOutput: "01",
        runnerMain: `    System.out.println(ToBase.toBase(10, 10));`,
      },
    ],
  },

  {
    id: 4,
    name: "FindFirstInSorted",
    fileName: "FindFirstInSorted.java",
    category: "Searching",
    difficulty: "Medium",
    description: "Finds the first occurrence of a target value in a sorted array.",
    functionInfo: {
      name: "findFirstInSorted",
      signature: "public static int findFirstInSorted(int[] arr, int target)",
      description:
        "Uses binary search to find the first index where target appears in a sorted array with possible duplicate values.",
      parameters: [
        { name: "arr", type: "int[]", description: "Sorted integer array" },
        { name: "target", type: "int", description: "Target value to search for" },
      ],
      returns: { type: "int", description: "First index of target, or -1 if not found" },
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 12: After finding the target, it searches right instead of left, returning the last occurrence.",
      bugLine: 12,
    },
    synthesizedFeedback:
      "When the target is found, store the current index but continue searching the left half. Searching the right half finds the last occurrence instead of the first.",
    buggyCode: `public class FindFirstInSorted {

    public static int findFirstInSorted(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        int result = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (arr[mid] == target) {
                result = mid;
                low = mid + 1;  // BUG: should search left side
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return result;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 2, 2, 3};
        System.out.println(findFirstInSorted(arr, 2));
    }
}`,
    fixedCode: `public class FindFirstInSorted {

    public static int findFirstInSorted(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        int result = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (arr[mid] == target) {
                result = mid;
                high = mid - 1;  // FIXED
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return result;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 2, 2, 3};
        System.out.println(findFirstInSorted(arr, 2));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Unique target value",
        input: "arr=[1,2,3,4,5], target=3",
        expected: "2",
        buggyOutput: "2",
        runnerMain: `    System.out.println(FindFirstInSorted.findFirstInSorted(new int[]{1, 2, 3, 4, 5}, 3));`,
      },
      {
        id: 2,
        description: "Duplicate target values",
        input: "arr=[1,2,2,2,3], target=2",
        expected: "1",
        buggyOutput: "3",
        runnerMain: `    System.out.println(FindFirstInSorted.findFirstInSorted(new int[]{1, 2, 2, 2, 3}, 2));`,
      },
      {
        id: 3,
        description: "All values are target",
        input: "arr=[5,5,5,5], target=5",
        expected: "0",
        buggyOutput: "3",
        runnerMain: `    System.out.println(FindFirstInSorted.findFirstInSorted(new int[]{5, 5, 5, 5}, 5));`,
      },
      {
        id: 4,
        description: "Target not found",
        input: "arr=[1,3,5,7], target=4",
        expected: "-1",
        buggyOutput: "-1",
        runnerMain: `    System.out.println(FindFirstInSorted.findFirstInSorted(new int[]{1, 3, 5, 7}, 4));`,
      },
    ],
  },

  {
    id: 5,
    name: "MaxSublistSum",
    fileName: "MaxSublistSum.java",
    category: "Dynamic Programming",
    difficulty: "Medium",
    description: "Finds the maximum sum of any contiguous subarray.",
    functionInfo: {
      name: "maxSublistSum",
      signature: "public static int maxSublistSum(int[] arr)",
      description:
        "Uses Kadane's algorithm to compute the maximum contiguous subarray sum. Empty subarray is allowed, so all-negative arrays return 0.",
      parameters: [{ name: "arr", type: "int[]", description: "Input integer array" }],
      returns: { type: "int", description: "Maximum contiguous subarray sum" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 8: The recurrence subtracts the current value instead of adding it.",
      bugLine: 8,
    },
    synthesizedFeedback:
      "Kadane's algorithm extends the current subarray by adding the current element. Subtracting the element reverses the accumulation and breaks normal positive-sum cases.",
    buggyCode: `public class MaxSublistSum {

    public static int maxSublistSum(int[] arr) {
        int maxEndingHere = 0;
        int maxSoFar = 0;

        for (int x : arr) {
            maxEndingHere = Math.max(0, maxEndingHere - x);  // BUG: should add x
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }

        return maxSoFar;
    }

    public static void main(String[] args) {
        System.out.println(maxSublistSum(new int[]{1, 2, 3}));
    }
}`,
    fixedCode: `public class MaxSublistSum {

    public static int maxSublistSum(int[] arr) {
        int maxEndingHere = 0;
        int maxSoFar = 0;

        for (int x : arr) {
            maxEndingHere = Math.max(0, maxEndingHere + x);  // FIXED
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }

        return maxSoFar;
    }

    public static void main(String[] args) {
        System.out.println(maxSublistSum(new int[]{1, 2, 3}));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Empty array",
        input: "arr=[]",
        expected: "0",
        buggyOutput: "0",
        runnerMain: `    System.out.println(MaxSublistSum.maxSublistSum(new int[]{}));`,
      },
      {
        id: 2,
        description: "Positive values",
        input: "arr=[1,2,3]",
        expected: "6",
        buggyOutput: "0",
        runnerMain: `    System.out.println(MaxSublistSum.maxSublistSum(new int[]{1, 2, 3}));`,
      },
      {
        id: 3,
        description: "Mixed values",
        input: "arr=[-2,3,4,-1]",
        expected: "7",
        buggyOutput: "3",
        runnerMain: `    System.out.println(MaxSublistSum.maxSublistSum(new int[]{-2, 3, 4, -1}));`,
      },
      {
        id: 4,
        description: "Zero values",
        input: "arr=[0,0,0]",
        expected: "0",
        buggyOutput: "0",
        runnerMain: `    System.out.println(MaxSublistSum.maxSublistSum(new int[]{0, 0, 0}));`,
      },
    ],
  },

  {
    id: 6,
    name: "Sieve",
    fileName: "Sieve.java",
    category: "Number Theory",
    difficulty: "Medium",
    description: "Generates all prime numbers up to n using the Sieve of Eratosthenes.",
    functionInfo: {
      name: "sieve",
      signature: "public static boolean[] sieve(int n)",
      description:
        "Returns a boolean array where index i is true if i is prime. Marks multiples of each prime as non-prime.",
      parameters: [{ name: "n", type: "int", description: "Upper bound for prime generation" }],
      returns: { type: "boolean[]", description: "Boolean prime table from 0 to n" },
      timeComplexity: "O(n log log n)",
      spaceComplexity: "O(n)",
      bugDescription: "Line 13: Marks prime[p] as false instead of marking the multiple prime[i].",
      bugLine: 13,
    },
    synthesizedFeedback:
      "The inner loop iterates over multiples of p. The value that should be marked non-prime is the current multiple i, not the prime base p itself.",
    buggyCode: `public class Sieve {

    public static boolean[] sieve(int n) {
        boolean[] prime = new boolean[n + 1];
        java.util.Arrays.fill(prime, true);

        if (n >= 0) prime[0] = false;
        if (n >= 1) prime[1] = false;

        for (int p = 2; p * p <= n; p++) {
            if (prime[p]) {
                for (int i = p * p; i <= n; i += p) {
                    prime[p] = false;  // BUG: should mark prime[i]
                }
            }
        }

        return prime;
    }

    public static void main(String[] args) {
        boolean[] prime = sieve(10);
        for (int i = 0; i < prime.length; i++) {
            if (prime[i]) System.out.print(i + " ");
        }
    }
}`,
    fixedCode: `public class Sieve {

    public static boolean[] sieve(int n) {
        boolean[] prime = new boolean[n + 1];
        java.util.Arrays.fill(prime, true);

        if (n >= 0) prime[0] = false;
        if (n >= 1) prime[1] = false;

        for (int p = 2; p * p <= n; p++) {
            if (prime[p]) {
                for (int i = p * p; i <= n; i += p) {
                    prime[i] = false;  // FIXED
                }
            }
        }

        return prime;
    }

    public static void main(String[] args) {
        boolean[] prime = sieve(10);
        for (int i = 0; i < prime.length; i++) {
            if (prime[i]) System.out.print(i + " ");
        }
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Primes up to 2",
        input: "n=2",
        expected: "[2]",
        buggyOutput: "[2]",
        runnerMain: `
    boolean[] prime = Sieve.sieve(2);
    java.util.List<Integer> out = new java.util.ArrayList<>();
    for (int i = 0; i < prime.length; i++) if (prime[i]) out.add(i);
    System.out.println(out);`,
      },
      {
        id: 2,
        description: "Primes up to 3",
        input: "n=3",
        expected: "[2, 3]",
        buggyOutput: "[2, 3]",
        runnerMain: `
    boolean[] prime = Sieve.sieve(3);
    java.util.List<Integer> out = new java.util.ArrayList<>();
    for (int i = 0; i < prime.length; i++) if (prime[i]) out.add(i);
    System.out.println(out);`,
      },
      {
        id: 3,
        description: "Primes up to 5",
        input: "n=5",
        expected: "[2, 3, 5]",
        buggyOutput: "[3, 4, 5]",
        runnerMain: `
    boolean[] prime = Sieve.sieve(5);
    java.util.List<Integer> out = new java.util.ArrayList<>();
    for (int i = 0; i < prime.length; i++) if (prime[i]) out.add(i);
    System.out.println(out);`,
      },
      {
        id: 4,
        description: "Primes up to 10",
        input: "n=10",
        expected: "[2, 3, 5, 7]",
        buggyOutput: "[4, 5, 6, 7, 8, 9, 10]",
        runnerMain: `
    boolean[] prime = Sieve.sieve(10);
    java.util.List<Integer> out = new java.util.ArrayList<>();
    for (int i = 0; i < prime.length; i++) if (prime[i]) out.add(i);
    System.out.println(out);`,
      },
    ],
  },

  {
    id: 7,
    name: "PowerSet",
    fileName: "PowerSet.java",
    category: "Combinatorics",
    difficulty: "Medium",
    description: "Generates the power set of a list of integers.",
    functionInfo: {
      name: "powerset",
      signature: "public static java.util.List<java.util.List<Integer>> powerset(java.util.List<Integer> set)",
      description:
        "Builds all subsets by copying each existing subset and adding the current item to create new subsets.",
      parameters: [{ name: "set", type: "List<Integer>", description: "Input list of integers" }],
      returns: { type: "List<List<Integer>>", description: "All subsets of the input set" },
      timeComplexity: "O(2^n)",
      spaceComplexity: "O(2^n)",
      bugDescription: "Line 13: Adds the old subset again instead of adding the newly created subset.",
      bugLine: 13,
    },
    synthesizedFeedback:
      "After copying an existing subset and adding the current item, the algorithm should append that new subset. Re-adding the old subset creates duplicates and loses the newly added item.",
    buggyCode: `public class PowerSet {

    public static java.util.List<java.util.List<Integer>> powerset(java.util.List<Integer> set) {
        java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
        result.add(new java.util.ArrayList<>());

        for (int item : set) {
            int size = result.size();
            for (int i = 0; i < size; i++) {
                java.util.List<Integer> subset = new java.util.ArrayList<>(result.get(i));
                subset.add(item);
                result.add(result.get(i));  // BUG: should add subset
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(powerset(java.util.List.of(1, 2)));
    }
}`,
    fixedCode: `public class PowerSet {

    public static java.util.List<java.util.List<Integer>> powerset(java.util.List<Integer> set) {
        java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
        result.add(new java.util.ArrayList<>());

        for (int item : set) {
            int size = result.size();
            for (int i = 0; i < size; i++) {
                java.util.List<Integer> subset = new java.util.ArrayList<>(result.get(i));
                subset.add(item);
                result.add(subset);  // FIXED
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(powerset(java.util.List.of(1, 2)));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Power set of empty set",
        input: "[]",
        expected: "[[]]",
        buggyOutput: "[[]]",
        runnerMain: `    System.out.println(PowerSet.powerset(java.util.List.of()));`,
      },
      {
        id: 2,
        description: "Power set of one element",
        input: "[1]",
        expected: "[[], [1]]",
        buggyOutput: "[[], []]",
        runnerMain: `    System.out.println(PowerSet.powerset(java.util.List.of(1)));`,
      },
      {
        id: 3,
        description: "Power set of two elements",
        input: "[1,2]",
        expected: "[[], [1], [2], [1, 2]]",
        buggyOutput: "[[], [], [], []]",
        runnerMain: `    System.out.println(PowerSet.powerset(java.util.List.of(1, 2)));`,
      },
      {
        id: 4,
        description: "Power set size for three elements",
        input: "[1,2,3]",
        expected: "8",
        buggyOutput: "8",
        runnerMain: `    System.out.println(PowerSet.powerset(java.util.List.of(1, 2, 3)).size());`,
      },
    ],
  },

  {
    id: 8,
    name: "NextPalindrome",
    fileName: "NextPalindrome.java",
    category: "Strings",
    difficulty: "Medium",
    description: "Finds the next palindrome number greater than the given number.",
    functionInfo: {
      name: "nextPalindrome",
      signature: "public static int nextPalindrome(int n)",
      description:
        "Increments the input number until it finds the next number whose string representation is equal to its reverse.",
      parameters: [{ name: "n", type: "int", description: "Input integer" }],
      returns: { type: "int", description: "Next palindrome greater than n" },
      timeComplexity: "O(k * d)",
      spaceComplexity: "O(d)",
      bugDescription: "Line 9: Uses reference comparison with != instead of checking string content using equals().",
      bugLine: 9,
    },
    synthesizedFeedback:
      "Java strings should be compared by content using equals(). The function should return when the string equals its reverse, not when the two string objects are different references.",
    buggyCode: `public class NextPalindrome {

    public static int nextPalindrome(int n) {
        n++;

        while (true) {
            String s = Integer.toString(n);
            String rev = new StringBuilder(s).reverse().toString();

            if (s != rev) return n;  // BUG: should use s.equals(rev)
            n++;
        }
    }

    public static void main(String[] args) {
        System.out.println(nextPalindrome(123));
    }
}`,
    fixedCode: `public class NextPalindrome {

    public static int nextPalindrome(int n) {
        n++;

        while (true) {
            String s = Integer.toString(n);
            String rev = new StringBuilder(s).reverse().toString();

            if (s.equals(rev)) return n;  // FIXED
            n++;
        }
    }

    public static void main(String[] args) {
        System.out.println(nextPalindrome(123));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Next palindrome after 10",
        input: "n=10",
        expected: "11",
        buggyOutput: "11",
        runnerMain: `    System.out.println(NextPalindrome.nextPalindrome(10));`,
      },
      {
        id: 2,
        description: "Next palindrome after 9",
        input: "n=9",
        expected: "11",
        buggyOutput: "10",
        runnerMain: `    System.out.println(NextPalindrome.nextPalindrome(9));`,
      },
      {
        id: 3,
        description: "Next palindrome after 123",
        input: "n=123",
        expected: "131",
        buggyOutput: "124",
        runnerMain: `    System.out.println(NextPalindrome.nextPalindrome(123));`,
      },
      {
        id: 4,
        description: "Next palindrome after 808",
        input: "n=808",
        expected: "818",
        buggyOutput: "809",
        runnerMain: `    System.out.println(NextPalindrome.nextPalindrome(808));`,
      },
    ],
  },

  {
    id: 9,
    name: "LcsLength",
    fileName: "LcsLength.java",
    category: "Dynamic Programming",
    difficulty: "Hard",
    description: "Computes the length of the longest common subsequence between two strings.",
    functionInfo: {
      name: "lcsLength",
      signature: "public static int lcsLength(String a, String b)",
      description:
        "Uses dynamic programming to compute the length of the longest sequence that appears in both strings in the same relative order.",
      parameters: [
        { name: "a", type: "String", description: "First string" },
        { name: "b", type: "String", description: "Second string" },
      ],
      returns: { type: "int", description: "Length of the longest common subsequence" },
      timeComplexity: "O(mn)",
      spaceComplexity: "O(mn)",
      bugDescription: "Line 13: Uses Math.min when characters do not match. LCS should keep the maximum of the two subproblems.",
      bugLine: 13,
    },
    synthesizedFeedback:
      "When characters do not match, LCS should choose the longer subsequence from excluding one character from either string. Therefore the recurrence must use Math.max, not Math.min.",
    buggyCode: `public class LcsLength {

    public static int lcsLength(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]);  // BUG: should use max
                }
            }
        }

        return dp[a.length()][b.length()];
    }

    public static void main(String[] args) {
        System.out.println(lcsLength("abcde", "ace"));
    }
}`,
    fixedCode: `public class LcsLength {

    public static int lcsLength(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);  // FIXED
                }
            }
        }

        return dp[a.length()][b.length()];
    }

    public static void main(String[] args) {
        System.out.println(lcsLength("abcde", "ace"));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Identical strings",
        input: "a=\"abc\", b=\"abc\"",
        expected: "3",
        buggyOutput: "3",
        runnerMain: `    System.out.println(LcsLength.lcsLength("abc", "abc"));`,
      },
      {
        id: 2,
        description: "No common subsequence",
        input: "a=\"abc\", b=\"def\"",
        expected: "0",
        buggyOutput: "0",
        runnerMain: `    System.out.println(LcsLength.lcsLength("abc", "def"));`,
      },
      {
        id: 3,
        description: "Common subsequence ace",
        input: "a=\"abcde\", b=\"ace\"",
        expected: "3",
        buggyOutput: "1",
        runnerMain: `    System.out.println(LcsLength.lcsLength("abcde", "ace"));`,
      },
      {
        id: 4,
        description: "Classic LCS example",
        input: "a=\"AGGTAB\", b=\"GXTXAYB\"",
        expected: "4",
        buggyOutput: "1",
        runnerMain: `    System.out.println(LcsLength.lcsLength("AGGTAB", "GXTXAYB"));`,
      },
    ],
  },

  {
    id: 10,
    name: "LevenshteinDistance",
    fileName: "LevenshteinDistance.java",
    category: "Dynamic Programming",
    difficulty: "Hard",
    description: "Computes the edit distance between two strings.",
    functionInfo: {
      name: "levenshtein",
      signature: "public static int levenshtein(String a, String b)",
      description:
        "Computes the minimum number of insertions, deletions, and substitutions needed to transform one string into another.",
      parameters: [
        { name: "a", type: "String", description: "Source string" },
        { name: "b", type: "String", description: "Target string" },
      ],
      returns: { type: "int", description: "Minimum edit distance" },
      timeComplexity: "O(mn)",
      spaceComplexity: "O(mn)",
      bugDescription: "Line 12: Substitution cost is always 1, even when the characters are equal.",
      bugLine: 12,
    },
    synthesizedFeedback:
      "Matching characters should not increase the edit distance. The substitution cost should be 0 when the two current characters are equal and 1 otherwise.",
    buggyCode: `public class LevenshteinDistance {

    public static int levenshtein(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = 1;  // BUG: should be 0 when characters are equal

                dp[i][j] = Math.min(
                    Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost
                );
            }
        }

        return dp[a.length()][b.length()];
    }

    public static void main(String[] args) {
        System.out.println(levenshtein("kitten", "sitting"));
    }
}`,
    fixedCode: `public class LevenshteinDistance {

    public static int levenshtein(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;  // FIXED

                dp[i][j] = Math.min(
                    Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                    dp[i - 1][j - 1] + cost
                );
            }
        }

        return dp[a.length()][b.length()];
    }

    public static void main(String[] args) {
        System.out.println(levenshtein("kitten", "sitting"));
    }
}`,
    testCases: [
      {
        id: 1,
        description: "Completely different strings",
        input: "a=\"abc\", b=\"def\"",
        expected: "3",
        buggyOutput: "3",
        runnerMain: `    System.out.println(LevenshteinDistance.levenshtein("abc", "def"));`,
      },
      {
        id: 2,
        description: "Empty source string",
        input: "a=\"\", b=\"abc\"",
        expected: "3",
        buggyOutput: "3",
        runnerMain: `    System.out.println(LevenshteinDistance.levenshtein("", "abc"));`,
      },
      {
        id: 3,
        description: "Identical strings",
        input: "a=\"abc\", b=\"abc\"",
        expected: "0",
        buggyOutput: "3",
        runnerMain: `    System.out.println(LevenshteinDistance.levenshtein("abc", "abc"));`,
      },
      {
        id: 4,
        description: "Classic edit distance example",
        input: "a=\"kitten\", b=\"sitting\"",
        expected: "3",
        buggyOutput: "7",
        runnerMain: `    System.out.println(LevenshteinDistance.levenshtein("kitten", "sitting"));`,
      },
    ],
  },
];