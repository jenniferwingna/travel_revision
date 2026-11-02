// Chapters: Linked list, Binary search.
window.CHAPTERS.push({
  id: "linkedlist", order: 16, num: "08", group: "算法专题 Algorithms", title: "链表", en: "Linked list",
  concept: String.raw`
<h2>1. 结构</h2>
<p>每个节点存一个值和指向下一个节点的指针。节点散落在堆内存里（C 里用 malloc 分配），所以不能按下标随机访问（O(n)），但在已知位置插入/删除只改指针，O(1)。</p>
~~~py
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
~~~
~~~c
struct Node { int val; struct Node *next; };
struct Node *n = malloc(sizeof(struct Node));   // 在堆上分配，用完要 free
~~~
<p>练习题环境里已经内置了 <code>ListNode</code>，以及测试用的 <code>from_arr([1,2,3])</code>（数组 → 链表）和 <code>to_arr(head)</code>（链表 → 数组）。</p>

<h2>2. 三大技巧</h2>
<ul>
<li><b>Dummy 头节点</b>：<code>dummy = ListNode(0, head)</code>，避免单独处理“删除/插入头节点”的情况，最后返回 <code>dummy.next</code>。</li>
<li><b>三指针反转</b>：prev / curr / nxt（见动画）。</li>
<li><b>快慢指针</b>：找中点、判环、找倒数第 k 个（快指针先走 k 步）。</li>
</ul>
~~~py
def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next      # 1. 先记住下一个
        curr.next = prev     # 2. 反转指针
        prev = curr          # 3. 两个指针前进
        curr = nxt
    return prev
~~~
<div class="note warn"><b class="lbl">常见 bug</b>访问 <code>node.next.val</code> 前没检查 <code>node.next</code> 是否为 None（C 里就是空指针解引用 → segmentation fault）；改指针顺序错了导致链表“断掉”；C 里删除节点忘了 free 导致内存泄漏（HR 第 7 题“软件越跑越慢”的经典原因）。</div>
<div class="vocab"><div><b>node / pointer / reference</b>节点/指针/引用</div><div><b>dummy head / sentinel</b>哑节点</div><div><b>null pointer dereference</b>空指针解引用</div><div><b>cycle detection (Floyd's)</b>判环</div></div>
`,
  anims: ["list_reverse", "list_middle"],
  problems: [
    {
      id: "reverse-list", title: "Reverse Linked List", diff: "Easy", tags: ["pointers"], short: "反转单链表（看动画）",
      en: "Reverse a singly linked list and return the new head.",
      examples: "1 -> 2 -> 3 -> 4 -> 5   =>   5 -> 4 -> 3 -> 2 -> 1",
      zh: "prev / curr / nxt 三指针。",
      starter: String.raw`def reverse_list(head):
    pass
`,
      tests: [["to_arr(reverse_list(from_arr([1, 2, 3, 4, 5])))", "[5, 4, 3, 2, 1]"], ["to_arr(reverse_list(from_arr([1, 2])))", "[2, 1]"], ["to_arr(reverse_list(from_arr([])))", "[]"]],
      hints: ["看知识点里的模板。"],
      solution: String.raw`def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
`,
      explain: "递归写法：<code>if not head or not head.next: return head; p = reverse_list(head.next); head.next.next = head; head.next = None; return p</code>，但递归要 O(n) 栈空间。", cx: "O(n) time, O(1) space",
    },
    {
      id: "middle-node", title: "Middle of the Linked List", diff: "Easy", tags: ["fast/slow"], short: "找中点；偶数个返回第二个中点",
      en: "Return the middle node of the list. If there are two middle nodes, return the second one.",
      examples: "[1,2,3,4,5] -> node 3\n[1,2,3,4,5,6] -> node 4",
      zh: "slow 一步，fast 两步。",
      starter: String.raw`def middle_node(head):
    pass
`,
      tests: [["middle_node(from_arr([1, 2, 3, 4, 5])).val", "3"], ["middle_node(from_arr([1, 2, 3, 4, 5, 6])).val", "4"], ["middle_node(from_arr([1])).val", "1"]],
      hints: ["<code>while fast and fast.next:</code>"],
      solution: String.raw`def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "merge-two-lists", title: "Merge Two Sorted Lists", diff: "Easy", tags: ["dummy head"], short: "合并两个有序链表",
      en: "Merge two sorted linked lists into one sorted list and return its head.",
      examples: "1->2->4 + 1->3->4  =>  1->1->2->3->4->4",
      zh: "dummy 头节点 + tail 指针，每次接上较小的节点。",
      starter: String.raw`def merge_two_lists(a, b):
    pass
`,
      tests: [["to_arr(merge_two_lists(from_arr([1, 2, 4]), from_arr([1, 3, 4])))", "[1, 1, 2, 3, 4, 4]"], ["to_arr(merge_two_lists(from_arr([]), from_arr([0])))", "[0]"], ["to_arr(merge_two_lists(from_arr([]), from_arr([])))", "[]"]],
      hints: ["结束时 <code>tail.next = a or b</code>。"],
      solution: String.raw`def merge_two_lists(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
`,
      cx: "O(m + n) time, O(1) space",
    },
    {
      id: "has-cycle", title: "Linked List Cycle", diff: "Easy", tags: ["fast/slow"], short: "判断链表有没有环",
      en: "Return True if the linked list has a cycle. Use O(1) memory.",
      examples: "from_arr_cycle([3, 2, 0, -4], 1)  ->  True   (tail links back to index 1)",
      zh: "Floyd 判环：快慢指针如果相遇就有环；fast 走到 None 就没有。用 set 记录访问过的节点也行，但是 O(n) 空间。",
      starter: String.raw`def has_cycle(head):
    pass
`,
      tests: [["has_cycle(from_arr_cycle([3, 2, 0, -4], 1))", "True"], ["has_cycle(from_arr_cycle([1, 2], 0))", "True"], ["has_cycle(from_arr([1, 2, 3]))", "False"], ["has_cycle(None)", "False"]],
      hints: ["在循环里移动后比较 <code>if slow is fast: return True</code>。"],
      solution: String.raw`def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
`,
      explain: "为什么一定相遇：进入环后，fast 每步比 slow 多走 1，两者距离每步缩小 1，最终变 0。", cx: "O(n) time, O(1) space",
    },
    {
      id: "remove-nth", title: "Remove Nth Node From End", diff: "Medium", tags: ["fast/slow", "dummy head"], short: "删除倒数第 n 个节点，一次遍历",
      en: "Remove the n-th node from the end of the list and return the head. Do it in one pass.",
      examples: "[1,2,3,4,5], n = 2  ->  [1,2,3,5]",
      zh: "fast 先走 n 步，然后 fast、slow 一起走；fast 到末尾时 slow 在待删节点前一个。用 dummy 处理删除头节点的情况。",
      starter: String.raw`def remove_nth_from_end(head, n):
    pass
`,
      tests: [["to_arr(remove_nth_from_end(from_arr([1, 2, 3, 4, 5]), 2))", "[1, 2, 3, 5]"], ["to_arr(remove_nth_from_end(from_arr([1]), 1))", "[]"], ["to_arr(remove_nth_from_end(from_arr([1, 2]), 2))", "[2]"], ["to_arr(remove_nth_from_end(from_arr([1, 2]), 1))", "[1]"]],
      hints: ["slow 和 fast 都从 dummy 开始；fast 先走 n 步；然后 <code>while fast.next</code>。"],
      solution: String.raw`def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next
`,
      cx: "O(L) time, O(1) space",
    },
    {
      id: "add-two-numbers", title: "Add Two Numbers", diff: "Medium", tags: ["carry"], short: "链表逆序存数字，求和",
      en: "Two non-negative integers are stored as linked lists with digits in reverse order (ones digit first). Return their sum as a linked list in the same format.",
      examples: "2->4->3 + 5->6->4  =>  7->0->8     (342 + 465 = 807)",
      zh: "模拟竖式加法，维护进位 carry。循环条件：a 或 b 或 carry 还有。",
      starter: String.raw`def add_two_numbers(a, b):
    pass
`,
      tests: [["to_arr(add_two_numbers(from_arr([2, 4, 3]), from_arr([5, 6, 4])))", "[7, 0, 8]"], ["to_arr(add_two_numbers(from_arr([0]), from_arr([0])))", "[0]"], ["to_arr(add_two_numbers(from_arr([9, 9, 9, 9]), from_arr([9, 9])))", "[8, 9, 0, 0, 1]"]],
      hints: ["<code>s = carry + (a.val if a else 0) + (b.val if b else 0); carry, d = divmod(s, 10)</code>"],
      solution: String.raw`def add_two_numbers(a, b):
    dummy = tail = ListNode()
    carry = 0
    while a or b or carry:
        s = carry
        if a:
            s += a.val
            a = a.next
        if b:
            s += b.val
            b = b.next
        carry, d = divmod(s, 10)
        tail.next = ListNode(d)
        tail = tail.next
    return dummy.next
`,
      cx: "O(max(m, n))",
    },
  ],
});

window.CHAPTERS.push({
  id: "bsearch", order: 17, num: "09", group: "算法专题 Algorithms", title: "二分查找", en: "Binary search",
  blurb: "HR 题：findSmallestValueToPass",
  concept: String.raw`
<h2>1. 核心思想</h2>
<p>只要能根据中间位置的信息<b>排除一半</b>，就能二分。n = 10⁹ 也只需 30 次。前提不一定是“有序数组”，更本质的是<b>单调性</b>：存在一个分界点，左边都满足 A、右边都满足 B。</p>

<h2>2. 两个模板（背下来）</h2>
<h3>模板 A：找某个确切值（闭区间）</h3>
~~~py
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1          # 闭区间 [lo, hi]
    while lo <= hi:                     # 区间非空
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
~~~
<h3>模板 B：找第一个满足条件的位置（lower bound）</h3>
~~~py
def first_true(lo, hi, ok):            # 假设 ok 是 F F F T T T 这样单调的
    ans = None
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if ok(mid):
            ans = mid                   # mid 可能是答案，记下来
            hi = mid - 1                # 继续往左找更小的
        else:
            lo = mid + 1
    return ans
~~~

<h2>3. HR 第 9 题：findSmallestValueToPass</h2>
~~~c
int findSmallestValueToPass(int x, int y) {
    // fill in code here
}
bool checkPassFail(int a) {
    // do measurement
    // return measurement pass or fail
}
~~~
<p><b>先问清楚（Clarify）</b>，这道题的关键在于提问：</p>
<ul>
<li>"Is the pass/fail result monotonic? Once a value passes, do all larger values pass too?" —— 单调才能二分。</li>
<li>"Is the measurement expensive?" —— 是的（真实测量要时间），所以要<b>尽量少调用</b> checkPassFail。</li>
<li>"What should I return if nothing in [x, y] passes?" —— 约定返回 -1 或 y+1。</li>
<li>"Is the measurement noisy?" —— 如果测量有噪声，边界附近可能需要重复测量或多次投票确认。</li>
</ul>
~~~c
int findSmallestValueToPass(int x, int y) {
    int lo = x, hi = y, ans = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;      // 不写 (lo + hi) / 2，防止整数溢出
        if (checkPassFail(mid)) {
            ans = mid;                     // 通过：记录，往左找更小
            hi = mid - 1;
        } else {
            lo = mid + 1;                  // 失败：答案在右边
        }
    }
    return ans;                            // -1 表示区间内没有通过的值
}
~~~
<p>调用次数 O(log(y - x))。如果不单调，只能从 x 线性扫描到 y，O(y - x)。</p>

<div class="note warn"><b class="lbl">二分最常见的 bug（HR 第 6 题 debug 很可能考）</b>
<ol><li><code>lo = mid</code>（没 +1）→ 当 hi = lo + 1 时 mid 一直等于 lo，<b>死循环</b>。</li>
<li><code>while lo &lt; hi</code> 配 <code>hi = mid - 1</code> → 漏掉最后一个元素。</li>
<li><code>mid = (lo + hi) / 2</code> 在 C 里 lo + hi 可能溢出 int。</li></ol></div>
<div class="vocab"><div><b>monotonic</b>单调的</div><div><b>search space</b>搜索空间</div><div><b>lower bound</b>第一个 ≥ x 的位置</div><div><b>integer overflow</b>整数溢出</div><div><b>"Each step halves the search space, so it's O(log n)."</b></div></div>
`,
  anims: ["bsearch", "bsearch_answer"],
  problems: [
    {
      id: "binary-search", title: "Binary Search", diff: "Easy", tags: ["template"], short: "标准二分",
      en: "nums is sorted in ascending order. Return the index of target, or -1 if it is not present. Must be O(log n).",
      examples: "binary_search([-1, 0, 3, 5, 9, 12], 9) -> 4",
      zh: "模板 A。",
      starter: String.raw`def binary_search(nums, target):
    pass
`,
      tests: [["binary_search([-1, 0, 3, 5, 9, 12], 9)", "4"], ["binary_search([-1, 0, 3, 5, 9, 12], 2)", "-1"], ["binary_search([5], 5)", "0"], ["binary_search([], 1)", "-1"], ["binary_search(list(range(0, 2000000, 2)), 1999998)", "999999"]],
      hints: ["<code>while lo &lt;= hi</code>，<code>lo = mid + 1</code> / <code>hi = mid - 1</code>。"],
      solution: String.raw`def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
      cx: "O(log n) time, O(1) space",
    },
    {
      id: "smallest-pass", title: "findSmallestValueToPass (HR Q9)", diff: "Easy", tags: ["HR 真题", "binary search on answer"], short: "最少的测量次数找到最小通过值",
      en: "check(a) performs an expensive measurement and returns True (pass) or False (fail). Results are monotonic: if a passes, every larger value passes. Return the smallest value in [x, y] that passes, or -1 if none does.\n\nThe tests count your calls: you must use at most about log2(y - x) + 2 measurements.",
      examples: "check = Meter(777)        # passes when a >= 777 (hidden from you)\nfind_smallest_pass(1, 10**6, check) -> 777, with <= 22 calls",
      zh: "模板 B。线性扫描会超出调用次数限制。",
      starter: String.raw`def find_smallest_pass(x, y, check):
    # check(a) -> True / False
    pass
`,
      tests: [["(lambda m: (find_smallest_pass(1, 10**6, m), m.calls <= 22))(Meter(777))", "(777, True)"], ["(lambda m: (find_smallest_pass(0, 100, m), m.calls <= 9))(Meter(0))", "(0, True)"], ["(lambda m: (find_smallest_pass(0, 100, m), m.calls <= 9))(Meter(100))", "(100, True)"], ["(lambda m: find_smallest_pass(0, 100, m))(Meter(500))", "-1"], ["(lambda m: find_smallest_pass(5, 5, m))(Meter(3))", "5"]],
      hints: ["<code>if check(mid): ans = mid; hi = mid - 1 else: lo = mid + 1</code>"],
      solution: String.raw`def find_smallest_pass(x, y, check):
    lo, hi, ans = x, y, -1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if check(mid):
            ans = mid          # passes: remember it, look for a smaller one
            hi = mid - 1
        else:
            lo = mid + 1       # fails: the answer must be larger
    return ans
`,
      explain: "面试时边写边说：<i>\"Since the measurement is expensive and the result is monotonic, I'll binary search on the value. Each measurement halves the range, so I need about log2(y − x) measurements instead of y − x.\"</i>",
      cx: "O(log(y - x)) measurements", sayCx: "Because pass or fail is monotonic, I can binary search the range. That needs only about log base two of (y minus x) measurements, which matters because each measurement is expensive.",
    },
    {
      id: "search-insert", title: "Search Insert Position", diff: "Easy", tags: ["lower bound"], short: "找到 target 或它应插入的位置",
      en: "nums is sorted with distinct values. Return the index of target if found; otherwise the index where it would be inserted to keep the order.",
      examples: "search_insert([1, 3, 5, 6], 5) -> 2\nsearch_insert([1, 3, 5, 6], 2) -> 1\nsearch_insert([1, 3, 5, 6], 7) -> 4",
      zh: "就是第一个 ≥ target 的位置。模板 A 结束时 lo 就是答案。",
      starter: String.raw`def search_insert(nums, target):
    pass
`,
      tests: [["search_insert([1, 3, 5, 6], 5)", "2"], ["search_insert([1, 3, 5, 6], 2)", "1"], ["search_insert([1, 3, 5, 6], 7)", "4"], ["search_insert([1, 3, 5, 6], 0)", "0"], ["search_insert([], 3)", "0"]],
      hints: ["循环结束后 <code>return lo</code>。"],
      solution: String.raw`def search_insert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo
`,
      explain: "Python 内置：<code>bisect.bisect_left(nums, target)</code>。", cx: "O(log n)",
    },
    {
      id: "my-sqrt", title: "Integer Square Root", diff: "Easy", tags: ["binary search on answer"], short: "不用 sqrt，求 ⌊√x⌋",
      en: "Return the floor of the square root of a non-negative integer x, without using any built-in power or sqrt function.",
      examples: "my_sqrt(8) -> 2\nmy_sqrt(16) -> 4",
      zh: "找最大的 m 使 m*m ≤ x —— 二分答案。",
      starter: String.raw`def my_sqrt(x):
    pass
`,
      tests: [["my_sqrt(0)", "0"], ["my_sqrt(1)", "1"], ["my_sqrt(8)", "2"], ["my_sqrt(16)", "4"], ["my_sqrt(2147395599)", "46339"]],
      hints: ["<code>if mid * mid &lt;= x: ans = mid; lo = mid + 1</code>"],
      solution: String.raw`def my_sqrt(x):
    lo, hi, ans = 0, x, 0
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if mid * mid <= x:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
`,
      cx: "O(log x)",
    },
    {
      id: "search-range", title: "First and Last Position", diff: "Medium", tags: ["lower bound"], short: "有序数组中 target 的起止下标",
      en: "nums is sorted (may contain duplicates). Return [first, last] index of target, or [-1, -1]. Must be O(log n).",
      examples: "search_range([5, 7, 7, 8, 8, 10], 8) -> [3, 4]",
      zh: "两次二分：找第一个 ≥ target，和第一个 ≥ target+1 的位置减 1。",
      starter: String.raw`def search_range(nums, target):
    pass
`,
      tests: [["search_range([5, 7, 7, 8, 8, 10], 8)", "[3, 4]"], ["search_range([5, 7, 7, 8, 8, 10], 6)", "[-1, -1]"], ["search_range([], 0)", "[-1, -1]"], ["search_range([2, 2, 2], 2)", "[0, 2]"]],
      hints: ["写 <code>lower(t)</code> 返回第一个 ≥ t 的下标。"],
      solution: String.raw`def search_range(nums, target):
    def lower(t):
        lo, hi = 0, len(nums)
        while lo < hi:                 # half-open [lo, hi)
            mid = (lo + hi) // 2
            if nums[mid] < t:
                lo = mid + 1
            else:
                hi = mid
        return lo

    first = lower(target)
    if first == len(nums) or nums[first] != target:
        return [-1, -1]
    return [first, lower(target + 1) - 1]
`,
      explain: "这里用了半开区间 [lo, hi) 写法：<code>while lo &lt; hi</code> 配 <code>hi = mid</code>。两种写法都行，但同一个函数里不要混用。", cx: "O(log n)",
    },
    {
      id: "search-rotated", title: "Search in Rotated Sorted Array", diff: "Medium", tags: ["binary search"], short: "旋转过的有序数组中查找",
      en: "A sorted array of distinct values was rotated at some pivot (e.g. [0,1,2,4,5,6,7] became [4,5,6,7,0,1,2]). Return the index of target or -1, in O(log n).",
      examples: "search_rotated([4, 5, 6, 7, 0, 1, 2], 0) -> 4",
      zh: "mid 把数组分成两半，至少有一半是有序的。判断 target 是否在有序的那半里，决定往哪边走。",
      starter: String.raw`def search_rotated(nums, target):
    pass
`,
      tests: [["search_rotated([4, 5, 6, 7, 0, 1, 2], 0)", "4"], ["search_rotated([4, 5, 6, 7, 0, 1, 2], 3)", "-1"], ["search_rotated([1], 0)", "-1"], ["search_rotated([3, 1], 1)", "1"], ["search_rotated([5, 1, 3], 5)", "0"]],
      hints: ["<code>if nums[lo] &lt;= nums[mid]:</code> 左半有序；再判断 <code>nums[lo] &lt;= target &lt; nums[mid]</code>。"],
      solution: String.raw`def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:                 # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                     # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
`,
      cx: "O(log n)",
    },
    {
      id: "fix-bsearch", title: "Debug: Binary Search That Hangs", diff: "Medium", tags: ["HR 真题", "debug"], short: "HR 第 6 题风格：改一两行修好 bug",
      en: "The function below should return the index of the first element >= target in a sorted list (or len(nums) if none). It sometimes loops forever and sometimes returns a wrong index. Fix it by changing as few lines as possible.",
      examples: "first_ge([1, 3, 5, 7], 4) -> 2\nfirst_ge([1, 3, 5, 7], 8) -> 4",
      zh: "先自己读代码找问题，再运行测试。超时说明有死循环（平台 8 秒自动终止）。",
      starter: String.raw`def first_ge(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid
        else:
            hi = mid
    return lo
`,
      tests: [["first_ge([1, 3, 5, 7], 4)", "2"], ["first_ge([1, 3, 5, 7], 8)", "4"], ["first_ge([1, 3, 5, 7], 0)", "0"], ["first_ge([1, 3, 5, 7], 7)", "3"], ["first_ge([], 1)", "0"], ["first_ge([2, 2, 2], 2)", "0"]],
      hints: ["Bug 1：<code>lo = mid</code> 应该是 <code>lo = mid + 1</code>（nums[mid] &lt; target，mid 不可能是答案）。", "Bug 2：答案可能是 len(nums)（全部都小于 target），所以 hi 初始应为 <code>len(nums)</code>（半开区间）。"],
      solution: String.raw`def first_ge(nums, target):
    lo, hi = 0, len(nums)          # fix 2: answer can be len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1           # fix 1: mid is not the answer, skip it
        else:
            hi = mid
    return lo
`,
      explain: "Debug 的说话方式：<i>\"Let me trace it with lo = 0, hi = 1. mid is 0; if nums[0] &lt; target, lo stays 0, so the loop never ends. Since nums[mid] is smaller than the target, mid can't be the answer, so it should be lo = mid + 1.\"</i> —— 用一个最小的例子手动跟踪，是面试官想看的 troubleshooting 能力。",
      cx: "O(log n)",
    },
  ],
});
