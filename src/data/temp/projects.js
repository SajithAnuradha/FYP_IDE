export const projects = [
  {
    id: 1,
    name: "BubbleSort",
    fileName: "BubbleSort.java",
    category: "Sorting",
    difficulty: "Easy",
    description: "Sorts an array using the bubble sort algorithm by repeatedly swapping adjacent elements.",
    functionInfo: {
      name: "bubbleSort",
      signature: "public static void bubbleSort(int[] arr)",
      description:
        "Sorts an integer array in ascending order using the bubble sort algorithm. Compares adjacent elements and swaps them if they are in wrong order. Repeats until no swaps occur.",
      parameters: [{ name: "arr", type: "int[]", description: "The integer array to be sorted in-place" }],
      returns: { type: "void", description: "Array is modified in-place" },
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 10: The swap is broken — arr[j+1] is assigned arr[j] (already overwritten) instead of the saved temp variable.",
      bugLine: 10,
    },
    buggyCode: `public class BubbleSort {

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = arr[j];  // BUG: should be temp
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        for (int num : arr) System.out.print(num + " ");
    }
}`,
    fixedCode: `public class BubbleSort {

    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;  // FIXED
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        for (int num : arr) System.out.print(num + " ");
    }
}`,
    testCases: [
      {
        id: 1, description: "Sort mixed array",
        input: "[64, 34, 25, 12, 22, 11, 90]",
        expected: "[11, 12, 22, 25, 34, 64, 90]",
        buggyOutput: "[11, 11, 11, 11, 11, 11, 11]",
        runnerMain: `
    int[] arr = {64, 34, 25, 12, 22, 11, 90};
    BubbleSort.bubbleSort(arr);
    System.out.println(java.util.Arrays.toString(arr));`,
      },
      {
        id: 2, description: "Sort reverse-sorted array",
        input: "[5, 4, 3, 2, 1]",
        expected: "[1, 2, 3, 4, 5]",
        buggyOutput: "[1, 1, 1, 1, 1]",
        runnerMain: `
    int[] arr = {5, 4, 3, 2, 1};
    BubbleSort.bubbleSort(arr);
    System.out.println(java.util.Arrays.toString(arr));`,
      },
      {
        id: 3, description: "Sort single element",
        input: "[42]",
        expected: "[42]",
        buggyOutput: "[42]",
        runnerMain: `
    int[] arr = {42};
    BubbleSort.bubbleSort(arr);
    System.out.println(java.util.Arrays.toString(arr));`,
      },
      {
        id: 4, description: "Sort two elements",
        input: "[3, 1]",
        expected: "[1, 3]",
        buggyOutput: "[1, 1]",
        runnerMain: `
    int[] arr = {3, 1};
    BubbleSort.bubbleSort(arr);
    System.out.println(java.util.Arrays.toString(arr));`,
      },
    ],
  },

  {
    id: 2,
    name: "BinarySearch",
    fileName: "BinarySearch.java",
    category: "Searching",
    difficulty: "Easy",
    description: "Searches for a target value in a sorted array using binary search.",
    functionInfo: {
      name: "binarySearch",
      signature: "public static int binarySearch(int[] arr, int target)",
      description:
        "Performs binary search on a sorted integer array to find the index of the target value. Divides the search space in half at each step for O(log n) performance.",
      parameters: [
        { name: "arr", type: "int[]", description: "Sorted integer array to search in" },
        { name: "target", type: "int", description: "The value to search for" },
      ],
      returns: { type: "int", description: "Index of target if found, -1 otherwise" },
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 4: right is initialized to arr.length causing ArrayIndexOutOfBoundsException. Should be arr.length - 1.",
      bugLine: 4,
    },
    buggyCode: `public class BinarySearch {

    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length;  // BUG: should be arr.length - 1

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 3, 4, 10, 40};
        System.out.println(binarySearch(arr, 10));
    }
}`,
    fixedCode: `public class BinarySearch {

    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;  // FIXED

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 3, 4, 10, 40};
        System.out.println(binarySearch(arr, 10));
    }
}`,
    testCases: [
      {
        id: 1, description: "Find existing element (index 3)",
        input: "arr=[2,3,4,10,40], target=10",
        expected: "3",
        buggyOutput: "ArrayIndexOutOfBoundsException",
        runnerMain: `
    int[] arr = {2, 3, 4, 10, 40};
    System.out.println(BinarySearch.binarySearch(arr, 10));`,
      },
      {
        id: 2, description: "Find first element (index 0)",
        input: "arr=[1,3,5,7,9], target=1",
        expected: "0",
        buggyOutput: "ArrayIndexOutOfBoundsException",
        runnerMain: `
    int[] arr = {1, 3, 5, 7, 9};
    System.out.println(BinarySearch.binarySearch(arr, 1));`,
      },
      {
        id: 3, description: "Find last element (index 4)",
        input: "arr=[1,3,5,7,9], target=9",
        expected: "4",
        buggyOutput: "ArrayIndexOutOfBoundsException",
        runnerMain: `
    int[] arr = {1, 3, 5, 7, 9};
    System.out.println(BinarySearch.binarySearch(arr, 9));`,
      },
      {
        id: 4, description: "Target larger than all elements",
        input: "arr=[1,3,5,7,9], target=10",
        expected: "-1",
        buggyOutput: "ArrayIndexOutOfBoundsException",
        runnerMain: `
    int[] arr = {1, 3, 5, 7, 9};
    System.out.println(BinarySearch.binarySearch(arr, 10));`,
      },
    ],
  },

  {
    id: 3,
    name: "Fibonacci",
    fileName: "Fibonacci.java",
    category: "Dynamic Programming",
    difficulty: "Easy",
    description: "Computes Fibonacci numbers using dynamic programming.",
    functionInfo: {
      name: "fibonacci",
      signature: "public static int fibonacci(int n)",
      description:
        "Computes the nth Fibonacci number using bottom-up dynamic programming. Stores intermediate results to avoid redundant calculations.",
      parameters: [{ name: "n", type: "int", description: "Position in the Fibonacci sequence (0-indexed)" }],
      returns: { type: "int", description: "The nth Fibonacci number" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      bugDescription: "Line 8: dp[1] is initialized to 0 instead of 1, causing all Fibonacci numbers > 0 to be incorrect.",
      bugLine: 8,
    },
    buggyCode: `public class Fibonacci {

    public static int fibonacci(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;

        int[] dp = new int[n + 1];
        dp[0] = 0;
        dp[1] = 0;  // BUG: should be dp[1] = 1

        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }

        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println("Fibonacci(10) = " + fibonacci(10));
    }
}`,
    fixedCode: `public class Fibonacci {

    public static int fibonacci(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;

        int[] dp = new int[n + 1];
        dp[0] = 0;
        dp[1] = 1;  // FIXED

        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }

        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println("Fibonacci(10) = " + fibonacci(10));
    }
}`,
    testCases: [
      {
        id: 1, description: "Fibonacci(10)",
        input: "n=10",
        expected: "55",
        buggyOutput: "0",
        runnerMain: `    System.out.println(Fibonacci.fibonacci(10));`,
      },
      {
        id: 2, description: "Fibonacci(6)",
        input: "n=6",
        expected: "8",
        buggyOutput: "0",
        runnerMain: `    System.out.println(Fibonacci.fibonacci(6));`,
      },
      {
        id: 3, description: "Fibonacci(1) — base case",
        input: "n=1",
        expected: "1",
        buggyOutput: "1",
        runnerMain: `    System.out.println(Fibonacci.fibonacci(1));`,
      },
      {
        id: 4, description: "Fibonacci(0) — base case",
        input: "n=0",
        expected: "0",
        buggyOutput: "0",
        runnerMain: `    System.out.println(Fibonacci.fibonacci(0));`,
      },
    ],
  },

  {
    id: 4,
    name: "LinkedListReverse",
    fileName: "LinkedListReverse.java",
    category: "Data Structures",
    difficulty: "Medium",
    description: "Reverses a singly linked list in-place.",
    functionInfo: {
      name: "reverse",
      signature: "public Node reverse(Node head)",
      description:
        "Reverses a singly linked list iteratively by re-pointing each node's next pointer to the previous node. Uses three pointers: prev, current, and next.",
      parameters: [{ name: "head", type: "Node", description: "Head node of the linked list to reverse" }],
      returns: { type: "Node", description: "New head of the reversed linked list" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 9: prev is initialized to current instead of null, creating a circular reference.",
      bugLine: 9,
    },
    buggyCode: `public class LinkedListReverse {

    static class Node {
        int data;
        Node next;
        Node(int data) { this.data = data; }
    }

    public Node reverse(Node head) {
        Node prev = head;  // BUG: should be null
        Node current = head;
        Node next = null;

        while (current != null) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        LinkedListReverse ll = new LinkedListReverse();
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        System.out.println("done");
    }
}`,
    fixedCode: `public class LinkedListReverse {

    static class Node {
        int data;
        Node next;
        Node(int data) { this.data = data; }
    }

    public Node reverse(Node head) {
        Node prev = null;  // FIXED
        Node current = head;
        Node next = null;

        while (current != null) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        LinkedListReverse ll = new LinkedListReverse();
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        System.out.println("done");
    }
}`,
    testCases: [
      {
        id: 1, description: "Reverse 1→2→3→4",
        input: "1->2->3->4",
        expected: "4->3->2->1",
        buggyOutput: "4->3->2->1->1->1->1->1 (cycle)",
        runnerMain: `
    LinkedListReverse ll = new LinkedListReverse();
    LinkedListReverse.Node h = new LinkedListReverse.Node(1);
    h.next = new LinkedListReverse.Node(2);
    h.next.next = new LinkedListReverse.Node(3);
    h.next.next.next = new LinkedListReverse.Node(4);
    LinkedListReverse.Node r = ll.reverse(h);
    if (r == null) { System.out.println("null"); return; }
    StringBuilder sb = new StringBuilder();
    int guard = 0;
    while (r != null && guard++ < 8) {
        if (sb.length() > 0) sb.append("->");
        sb.append(r.data);
        r = r.next;
    }
    System.out.println(sb.toString());`,
      },
      {
        id: 2, description: "Reverse single node",
        input: "1",
        expected: "1",
        buggyOutput: "1->1->1->1 (cycle)",
        runnerMain: `
    LinkedListReverse ll = new LinkedListReverse();
    LinkedListReverse.Node h = new LinkedListReverse.Node(1);
    LinkedListReverse.Node r = ll.reverse(h);
    if (r == null) { System.out.println("null"); return; }
    StringBuilder sb = new StringBuilder();
    int guard = 0;
    while (r != null && guard++ < 4) {
        if (sb.length() > 0) sb.append("->");
        sb.append(r.data);
        r = r.next;
    }
    System.out.println(sb.toString());`,
      },
      {
        id: 3, description: "Reverse 5→3→1",
        input: "5->3->1",
        expected: "1->3->5",
        buggyOutput: "1->3->5->5->5->5->5->5 (cycle)",
        runnerMain: `
    LinkedListReverse ll = new LinkedListReverse();
    LinkedListReverse.Node h = new LinkedListReverse.Node(5);
    h.next = new LinkedListReverse.Node(3);
    h.next.next = new LinkedListReverse.Node(1);
    LinkedListReverse.Node r = ll.reverse(h);
    if (r == null) { System.out.println("null"); return; }
    StringBuilder sb = new StringBuilder();
    int guard = 0;
    while (r != null && guard++ < 8) {
        if (sb.length() > 0) sb.append("->");
        sb.append(r.data);
        r = r.next;
    }
    System.out.println(sb.toString());`,
      },
      {
        id: 4, description: "Reverse null list",
        input: "null",
        expected: "null",
        buggyOutput: "null",
        runnerMain: `
    LinkedListReverse ll = new LinkedListReverse();
    LinkedListReverse.Node r = ll.reverse(null);
    System.out.println(r == null ? "null" : String.valueOf(r.data));`,
      },
    ],
  },

  {
    id: 5,
    name: "StackImplementation",
    fileName: "StackImplementation.java",
    category: "Data Structures",
    difficulty: "Easy",
    description: "A stack implementation using an array with push, pop and peek operations.",
    functionInfo: {
      name: "pop",
      signature: "public int pop()",
      description:
        "Removes and returns the top element from the stack. Should decrement the size counter after removing the element to keep the stack state consistent.",
      parameters: [],
      returns: { type: "int", description: "The top element that was removed" },
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      bugDescription: "Line 24: Missing size-- after pop. Stack size never decreases, causing stale data to be returned.",
      bugLine: 24,
    },
    buggyCode: `public class StackImplementation {

    private int[] stack;
    private int size;
    private int capacity;

    public StackImplementation(int capacity) {
        this.capacity = capacity;
        this.stack = new int[capacity];
        this.size = 0;
    }

    public void push(int element) {
        if (size >= capacity) {
            throw new RuntimeException("Stack Overflow");
        }
        stack[size++] = element;
    }

    public int pop() {
        if (size == 0) {
            throw new RuntimeException("Stack Underflow");
        }
        int top = stack[size - 1];
        stack[size - 1] = 0;
        // BUG: missing size--
        return top;
    }

    public int peek() {
        if (size == 0) throw new RuntimeException("Stack is empty");
        return stack[size - 1];
    }

    public boolean isEmpty() { return size == 0; }

    public static void main(String[] args) {
        StackImplementation s = new StackImplementation(5);
        s.push(10); s.push(20); s.push(30);
        System.out.println(s.pop());
    }
}`,
    fixedCode: `public class StackImplementation {

    private int[] stack;
    private int size;
    private int capacity;

    public StackImplementation(int capacity) {
        this.capacity = capacity;
        this.stack = new int[capacity];
        this.size = 0;
    }

    public void push(int element) {
        if (size >= capacity) {
            throw new RuntimeException("Stack Overflow");
        }
        stack[size++] = element;
    }

    public int pop() {
        if (size == 0) {
            throw new RuntimeException("Stack Underflow");
        }
        int top = stack[size - 1];
        stack[size - 1] = 0;
        size--;  // FIXED
        return top;
    }

    public int peek() {
        if (size == 0) throw new RuntimeException("Stack is empty");
        return stack[size - 1];
    }

    public boolean isEmpty() { return size == 0; }

    public static void main(String[] args) {
        StackImplementation s = new StackImplementation(5);
        s.push(10); s.push(20); s.push(30);
        System.out.println(s.pop());
    }
}`,
    testCases: [
      {
        id: 1, description: "Push 3, pop 1, then peek",
        input: "push(10,20,30) pop() peek()",
        expected: "pop=30, peek=20",
        buggyOutput: "pop=30, peek=30",
        runnerMain: `
    StackImplementation s = new StackImplementation(5);
    s.push(10); s.push(20); s.push(30);
    int popped = s.pop();
    int peeked = s.peek();
    System.out.println("pop=" + popped + ", peek=" + peeked);`,
      },
      {
        id: 2, description: "isEmpty after push then pop",
        input: "push(5) pop() isEmpty()",
        expected: "true",
        buggyOutput: "false",
        runnerMain: `
    StackImplementation s = new StackImplementation(5);
    s.push(5);
    s.pop();
    System.out.println(s.isEmpty());`,
      },
      {
        id: 3, description: "Two sequential pops",
        input: "push(1,2) pop() pop()",
        expected: "2, 1",
        buggyOutput: "2, 2",
        runnerMain: `
    StackImplementation s = new StackImplementation(5);
    s.push(1); s.push(2);
    System.out.println(s.pop() + ", " + s.pop());`,
      },
      {
        id: 4, description: "Pop then push to capacity",
        input: "push(5 items) pop() push(1 more)",
        expected: "ok",
        buggyOutput: "StackOverflow",
        runnerMain: `
    StackImplementation s = new StackImplementation(5);
    s.push(1); s.push(2); s.push(3); s.push(4); s.push(5);
    s.pop();
    try {
        s.push(6);
        System.out.println("ok");
    } catch (RuntimeException e) {
        System.out.println("StackOverflow");
    }`,
      },
    ],
  },

  {
    id: 6,
    name: "PalindromeCheck",
    fileName: "PalindromeCheck.java",
    category: "Strings",
    difficulty: "Easy",
    description: "Checks whether a given string is a palindrome.",
    functionInfo: {
      name: "isPalindrome",
      signature: "public static boolean isPalindrome(String s)",
      description:
        "Checks if a string reads the same forwards and backwards. Creates the reversed string and compares it against the original using equals().",
      parameters: [{ name: "s", type: "String", description: "The string to check for palindrome property" }],
      returns: { type: "boolean", description: "true if the string is a palindrome, false otherwise" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      bugDescription: "Line 9: Uses == operator for String comparison instead of .equals(), causing reference comparison instead of content comparison.",
      bugLine: 9,
    },
    buggyCode: `public class PalindromeCheck {

    public static boolean isPalindrome(String s) {
        if (s == null || s.isEmpty()) return true;

        StringBuilder sb = new StringBuilder(s);
        String reversed = sb.reverse().toString();

        return s == reversed;  // BUG: should use .equals()
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("hello"));
    }
}`,
    fixedCode: `public class PalindromeCheck {

    public static boolean isPalindrome(String s) {
        if (s == null || s.isEmpty()) return true;

        StringBuilder sb = new StringBuilder(s);
        String reversed = sb.reverse().toString();

        return s.equals(reversed);  // FIXED
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("hello"));
    }
}`,
    testCases: [
      {
        id: 1, description: "\"racecar\" is palindrome",
        input: "racecar",
        expected: "true",
        buggyOutput: "false",
        runnerMain: `    System.out.println(PalindromeCheck.isPalindrome("racecar"));`,
      },
      {
        id: 2, description: "\"hello\" is not palindrome",
        input: "hello",
        expected: "false",
        buggyOutput: "false",
        runnerMain: `    System.out.println(PalindromeCheck.isPalindrome("hello"));`,
      },
      {
        id: 3, description: "\"madam\" is palindrome",
        input: "madam",
        expected: "true",
        buggyOutput: "false",
        runnerMain: `    System.out.println(PalindromeCheck.isPalindrome("madam"));`,
      },
      {
        id: 4, description: "Empty string is palindrome",
        input: "",
        expected: "true",
        buggyOutput: "true",
        runnerMain: `    System.out.println(PalindromeCheck.isPalindrome(""));`,
      },
    ],
  },

  {
    id: 7,
    name: "StringReversal",
    fileName: "StringReversal.java",
    category: "Strings",
    difficulty: "Easy",
    description: "Reverses a string by swapping characters in-place using a character array.",
    functionInfo: {
      name: "reverseString",
      signature: "public static String reverseString(String s)",
      description:
        "Reverses a string by converting it to a char array and swapping characters from both ends towards the center. The loop should iterate only to the middle of the array.",
      parameters: [{ name: "s", type: "String", description: "The string to reverse" }],
      returns: { type: "String", description: "The reversed string" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      bugDescription: "Line 7: Loop condition is i < chars.length instead of i < chars.length/2, causing the string to be reversed twice (back to original).",
      bugLine: 7,
    },
    buggyCode: `public class StringReversal {

    public static String reverseString(String s) {
        if (s == null || s.isEmpty()) return s;

        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; i++) {  // BUG: should be chars.length/2
            char temp = chars[i];
            chars[i] = chars[chars.length - 1 - i];
            chars[chars.length - 1 - i] = temp;
        }
        return new String(chars);
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`,
    fixedCode: `public class StringReversal {

    public static String reverseString(String s) {
        if (s == null || s.isEmpty()) return s;

        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length / 2; i++) {  // FIXED
            char temp = chars[i];
            chars[i] = chars[chars.length - 1 - i];
            chars[chars.length - 1 - i] = temp;
        }
        return new String(chars);
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`,
    testCases: [
      {
        id: 1, description: "Reverse \"hello\"",
        input: "hello",
        expected: "olleh",
        buggyOutput: "hello",
        runnerMain: `    System.out.println(StringReversal.reverseString("hello"));`,
      },
      {
        id: 2, description: "Reverse \"OpenAI\"",
        input: "OpenAI",
        expected: "IAnepO",
        buggyOutput: "OpenAI",
        runnerMain: `    System.out.println(StringReversal.reverseString("OpenAI"));`,
      },
      {
        id: 3, description: "Reverse \"abcde\"",
        input: "abcde",
        expected: "edcba",
        buggyOutput: "abcde",
        runnerMain: `    System.out.println(StringReversal.reverseString("abcde"));`,
      },
      {
        id: 4, description: "Reverse single char",
        input: "a",
        expected: "a",
        buggyOutput: "a",
        runnerMain: `    System.out.println(StringReversal.reverseString("a"));`,
      },
    ],
  },

  {
    id: 8,
    name: "FactorialCalculator",
    fileName: "FactorialCalculator.java",
    category: "Recursion",
    difficulty: "Easy",
    description: "Calculates the factorial of a number using recursion.",
    functionInfo: {
      name: "factorial",
      signature: "public static long factorial(int n)",
      description:
        "Computes n! recursively. The base case for n=0 must return 1 (not 0), since 0! is defined as 1. The recursive case multiplies n by factorial(n-1).",
      parameters: [{ name: "n", type: "int", description: "Non-negative integer whose factorial to compute" }],
      returns: { type: "long", description: "n! (n factorial)" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) call stack",
      bugDescription: "Line 4: Base case returns 0 instead of 1. Since factorial multiplies, returning 0 makes all results 0.",
      bugLine: 4,
    },
    buggyCode: `public class FactorialCalculator {

    public static long factorial(int n) {
        if (n == 0) return 0;  // BUG: should return 1
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
    fixedCode: `public class FactorialCalculator {

    public static long factorial(int n) {
        if (n == 0) return 1;  // FIXED: 0! = 1
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
    testCases: [
      {
        id: 1, description: "factorial(5)",
        input: "n=5",
        expected: "120",
        buggyOutput: "0",
        runnerMain: `    System.out.println(FactorialCalculator.factorial(5));`,
      },
      {
        id: 2, description: "factorial(0) — base case",
        input: "n=0",
        expected: "1",
        buggyOutput: "0",
        runnerMain: `    System.out.println(FactorialCalculator.factorial(0));`,
      },
      {
        id: 3, description: "factorial(7)",
        input: "n=7",
        expected: "5040",
        buggyOutput: "0",
        runnerMain: `    System.out.println(FactorialCalculator.factorial(7));`,
      },
      {
        id: 4, description: "factorial(1)",
        input: "n=1",
        expected: "1",
        buggyOutput: "0",
        runnerMain: `    System.out.println(FactorialCalculator.factorial(1));`,
      },
    ],
  },

  {
    id: 9,
    name: "MergeSortedArrays",
    fileName: "MergeSortedArrays.java",
    category: "Arrays",
    difficulty: "Medium",
    description: "Merges two sorted arrays into one sorted array.",
    functionInfo: {
      name: "merge",
      signature: "public static int[] merge(int[] a, int[] b)",
      description:
        "Merges two sorted integer arrays into a single sorted array. Uses three pointers to iterate through both arrays simultaneously, always taking the smaller current element.",
      parameters: [
        { name: "a", type: "int[]", description: "First sorted array" },
        { name: "b", type: "int[]", description: "Second sorted array" },
      ],
      returns: { type: "int[]", description: "New sorted array containing all elements from a and b" },
      timeComplexity: "O(m + n)",
      spaceComplexity: "O(m + n)",
      bugDescription: "Line 18: Missing j++ when b[j] is chosen — the j pointer never advances, causing an infinite loop.",
      bugLine: 18,
    },
    buggyCode: `public class MergeSortedArrays {

    public static int[] merge(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;

        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                result[k++] = a[i++];
            } else {
                result[k++] = b[j];  // BUG: missing j++
            }
        }

        while (i < a.length) result[k++] = a[i++];
        while (j < b.length) result[k++] = b[j++];

        return result;
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5};
        int[] b = {2, 4, 6};
        System.out.println(java.util.Arrays.toString(merge(a, b)));
    }
}`,
    fixedCode: `public class MergeSortedArrays {

    public static int[] merge(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;

        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                result[k++] = a[i++];
            } else {
                result[k++] = b[j++];  // FIXED
            }
        }

        while (i < a.length) result[k++] = a[i++];
        while (j < b.length) result[k++] = b[j++];

        return result;
    }

    public static void main(String[] args) {
        int[] a = {1, 3, 5};
        int[] b = {2, 4, 6};
        System.out.println(java.util.Arrays.toString(merge(a, b)));
    }
}`,
    testCases: [
      {
        id: 1, description: "Merge [1,3,5] and [2,4,6]",
        input: "a=[1,3,5], b=[2,4,6]",
        expected: "[1, 2, 3, 4, 5, 6]",
        buggyOutput: "Infinite loop",
        runnerMain: `
    int[] result = MergeSortedArrays.merge(new int[]{1, 3, 5}, new int[]{2, 4, 6});
    System.out.println(java.util.Arrays.toString(result));`,
      },
      {
        id: 2, description: "Merge [1,2] and [3,4]",
        input: "a=[1,2], b=[3,4]",
        expected: "[1, 2, 3, 4]",
        buggyOutput: "[1, 2, 3, 4]",
        runnerMain: `
    int[] result = MergeSortedArrays.merge(new int[]{1, 2}, new int[]{3, 4});
    System.out.println(java.util.Arrays.toString(result));`,
      },
      {
        id: 3, description: "One empty array",
        input: "a=[], b=[1,2,3]",
        expected: "[1, 2, 3]",
        buggyOutput: "[1, 2, 3]",
        runnerMain: `
    int[] result = MergeSortedArrays.merge(new int[]{}, new int[]{1, 2, 3});
    System.out.println(java.util.Arrays.toString(result));`,
      },
      {
        id: 4, description: "Single elements",
        input: "a=[5], b=[3]",
        expected: "[3, 5]",
        buggyOutput: "Infinite loop",
        runnerMain: `
    int[] result = MergeSortedArrays.merge(new int[]{5}, new int[]{3});
    System.out.println(java.util.Arrays.toString(result));`,
      },
    ],
  },

  {
    id: 10,
    name: "TwoSum",
    fileName: "TwoSum.java",
    category: "Arrays",
    difficulty: "Medium",
    description: "Finds two indices in an array whose values sum to a target using a HashMap.",
    functionInfo: {
      name: "twoSum",
      signature: "public static int[] twoSum(int[] nums, int target)",
      description:
        "Uses a HashMap to find two numbers that add up to the target. For each element, checks if its complement (target - nums[i]) already exists in the map. Returns their indices.",
      parameters: [
        { name: "nums", type: "int[]", description: "Array of integers" },
        { name: "target", type: "int", description: "The target sum to achieve" },
      ],
      returns: { type: "int[]", description: "Array of two indices [i, j] where nums[i] + nums[j] == target" },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      bugDescription: "Line 9: Complement is computed as nums[i] - target instead of target - nums[i], finding wrong pairs.",
      bugLine: 9,
    },
    buggyCode: `import java.util.HashMap;

public class TwoSum {

    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = nums[i] - target;  // BUG: should be target - nums[i]

            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(java.util.Arrays.toString(result));
    }
}`,
    fixedCode: `import java.util.HashMap;

public class TwoSum {

    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];  // FIXED

            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(java.util.Arrays.toString(result));
    }
}`,
    testCases: [
      {
        id: 1, description: "nums=[2,7,11,15], target=9",
        input: "[2,7,11,15], target=9",
        expected: "[0, 1]",
        buggyOutput: "[]",
        runnerMain: `
    int[] result = TwoSum.twoSum(new int[]{2, 7, 11, 15}, 9);
    System.out.println(java.util.Arrays.toString(result));`,
      },
      {
        id: 2, description: "nums=[3,2,4], target=6",
        input: "[3,2,4], target=6",
        expected: "[1, 2]",
        buggyOutput: "[]",
        runnerMain: `
    int[] result = TwoSum.twoSum(new int[]{3, 2, 4}, 6);
    System.out.println(java.util.Arrays.toString(result));`,
      },
      {
        id: 3, description: "nums=[3,3], target=6",
        input: "[3,3], target=6",
        expected: "[0, 1]",
        buggyOutput: "[]",
        runnerMain: `
    int[] result = TwoSum.twoSum(new int[]{3, 3}, 6);
    System.out.println(java.util.Arrays.toString(result));`,
      },
      {
        id: 4, description: "nums=[1,2,3], target=10 — no solution",
        input: "[1,2,3], target=10",
        expected: "[]",
        buggyOutput: "[]",
        runnerMain: `
    int[] result = TwoSum.twoSum(new int[]{1, 2, 3}, 10);
    System.out.println(java.util.Arrays.toString(result));`,
      },
    ],
  },
];
