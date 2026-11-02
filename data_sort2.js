// Chapters: Sorting, Recursion & backtracking.
window.CHAPTERS.push({
  id: "sorting", order: 18, num: "10", group: "算法专题 Algorithms", title: "排序", en: "Sorting",
  blurb: "HR 参考题 1：Sort a given size array",
  concept: String.raw`
<h2>1. 要会的排序算法</h2>
<div class="tblwrap"><table>
<tr><th>算法</th><th>平均</th><th>最坏</th><th>额外空间</th><th>稳定</th><th>一句话</th></tr>
<tr><td>冒泡 Bubble</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>是</td><td>相邻比较交换，大的往后冒</td></tr>
<tr><td>选择 Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>否</td><td>每轮选最小的放到前面</td></tr>
<tr><td>插入 Insertion</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>是</td><td>像理扑克牌；几乎有序时接近 O(n)</td></tr>
<tr><td>归并 Merge</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>是</td><td>对半分，再合并两个有序段</td></tr>
<tr><td>快排 Quick</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) 栈</td><td>否</td><td>选 pivot 分区，递归两边</td></tr>
<tr><td>堆排 Heap</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>否</td><td>建堆，反复取堆顶</td></tr>
<tr><td>计数 Counting</td><td>O(n + k)</td><td>O(n + k)</td><td>O(k)</td><td>是</td><td>值域小（k）时数每个值出现几次</td></tr>
</table></div>
<p><b>稳定 stable</b>：相等元素排序后保持原来的相对顺序。Python 的 <code>sorted</code> / <code>list.sort</code> 是 Timsort（归并 + 插入），稳定，O(n log n)。C 标准库是 <code>qsort</code>。</p>
<p>基于比较的排序下界是 O(n log n)。要更快，只能利用数据特点（计数排序、基数排序、循环排序）。</p>

<h2>2. HR 参考题 1 分析</h2>
~~~c
void sort(int a[], int n) {
    int i, t;
    for (i = 1; i < n + 1; ++i) {
        while (a[i] != i) {
            t = a[a[i]];
            a[a[i]] = a[i];
            a[i] = t;
        }
    }
}
int main() {
    int nArray[10] = {3, 5, 7, 9, 1, 4, 8, 0, 2, 6};
    sort(nArray, 9);
    print(nArray, 10);
}
~~~
<p>这是<b>循环排序 cyclic sort</b>（见动画）：数组是 0..9 的排列，值 v 应该放在下标 v，不停把 a[i] 换到它该去的位置。O(n) 时间，O(1) 空间。</p>
<p><b>面试可以指出的问题</b>（展示你的代码审查能力）：</p>
<ol>
<li><b>只适用于 0..n 的排列</b>。有重复值 → <code>while</code> 死循环；有值 ≥ 数组长度或负数 → 数组越界。题目说的是 "sort a given size array"，一般数组要用通用排序。</li>
<li>参数 <code>n</code> 的含义混乱：调用时传 9（最大值），而 <code>print</code> 传 10（长度）。循环 <code>i</code> 从 1 到 9，跳过了 0（能工作是因为其他都归位后 0 自然在 a[0]）。更清晰的写法是 <code>for (i = 0; i &lt; size; ++i)</code>，传长度 10。</li>
<li>交换写法 <code>t = a[a[i]]; a[a[i]] = a[i]; a[i] = t;</code> 是正确的，但顺序不能改：如果先改 <code>a[i]</code>，<code>a[a[i]]</code> 的下标就变了。</li>
</ol>

<h2>3. 模板</h2>
~~~py
def quick_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)
~~~
<div class="vocab"><div><b>stable sort</b>稳定排序</div><div><b>pivot / partition</b>基准 / 分区</div><div><b>divide and conquer</b>分治</div><div><b>ascending / descending</b>升序/降序</div><div><b>"Quicksort degrades to O(n²) on already-sorted input if we always pick the last element."</b></div></div>
`,
  anims: ["bubble", "quick", "merge", "cyclic"],
  problems: [
    {
      id: "bubble-sort", title: "Bubble Sort", diff: "Easy", tags: ["O(n²)"], short: "手写冒泡排序（带提前结束）",
      en: "Sort the list in ascending order in place using bubble sort. Stop early if a pass makes no swaps. Do not call sort().",
      examples: "[5, 1, 4, 2, 8] -> [1, 2, 4, 5, 8]",
      zh: "外层 n-1 轮，内层比较相邻元素；每轮最大的会冒到最后。",
      starter: String.raw`def bubble_sort(nums):
    pass
`,
      tests: [["inplace(bubble_sort, [5, 1, 4, 2, 8])", "[1, 2, 4, 5, 8]"], ["inplace(bubble_sort, [])", "[]"], ["inplace(bubble_sort, [2, 2, 1])", "[1, 2, 2]"], ["inplace(bubble_sort, [-1, -5, 3])", "[-5, -1, 3]"]],
      hints: ["<code>for j in range(n - 1 - i)</code>：最后 i 个已经排好。"],
      solution: String.raw`def bubble_sort(nums):
    n = len(nums)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = True
        if not swapped:
            break
`,
      cx: "O(n²) worst, O(n) best (already sorted), O(1) space",
    },
    {
      id: "insertion-sort", title: "Insertion Sort", diff: "Easy", tags: ["O(n²)"], short: "插入排序",
      en: "Sort the list in ascending order in place using insertion sort.",
      examples: "[4, 3, 2, 10, 12, 1, 5, 6] -> [1, 2, 3, 4, 5, 6, 10, 12]",
      zh: "把 nums[i] 取出来，前面比它大的元素都往后挪一位，然后放进空位。",
      starter: String.raw`def insertion_sort(nums):
    pass
`,
      tests: [["inplace(insertion_sort, [4, 3, 2, 10, 12, 1, 5, 6])", "[1, 2, 3, 4, 5, 6, 10, 12]"], ["inplace(insertion_sort, [1])", "[1]"], ["inplace(insertion_sort, [3, 3, 1])", "[1, 3, 3]"]],
      hints: ["<code>key = nums[i]; j = i - 1; while j &gt;= 0 and nums[j] &gt; key: nums[j+1] = nums[j]; j -= 1</code>"],
      solution: String.raw`def insertion_sort(nums):
    for i in range(1, len(nums)):
        key = nums[i]
        j = i - 1
        while j >= 0 and nums[j] > key:
            nums[j + 1] = nums[j]
            j -= 1
        nums[j + 1] = key
`,
      cx: "O(n²) worst, O(n) nearly sorted, O(1) space, stable",
    },
    {
      id: "cyclic-sort", title: "Cyclic Sort (HR ref Q1)", diff: "Easy", tags: ["HR 真题"], short: "0..n-1 的排列，O(n) 原地排序",
      en: "nums is a permutation of 0..n-1. Sort it in place in O(n) time with O(1) extra space by placing each value v at index v.",
      examples: "[3, 5, 7, 9, 1, 4, 8, 0, 2, 6] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]",
      zh: "HR C 参考答案的 Python 版（修正为用长度 n、从 0 开始）。",
      starter: String.raw`def cyclic_sort(nums):
    pass
`,
      tests: [["inplace(cyclic_sort, [3, 5, 7, 9, 1, 4, 8, 0, 2, 6])", "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]"], ["inplace(cyclic_sort, [0])", "[0]"], ["inplace(cyclic_sort, [1, 0])", "[0, 1]"], ["inplace(cyclic_sort, [2, 0, 1])", "[0, 1, 2]"]],
      hints: ["<code>for i in range(n): while nums[i] != i: v = nums[i]; nums[i], nums[v] = nums[v], nums[i]</code>", "Python 元组交换的坑：<code>nums[i], nums[nums[i]] = nums[nums[i]], nums[i]</code> 是<b>错的</b>——左边从左到右赋值，nums[i] 先被改了，nums[nums[i]] 的下标就变了。先存 v = nums[i]。"],
      solution: String.raw`def cyclic_sort(nums):
    for i in range(len(nums)):
        while nums[i] != i:
            v = nums[i]
            nums[i], nums[v] = nums[v], nums[i]
`,
      explain: "每次交换至少让一个数归位，总交换次数 ≤ n，所以虽然是双重循环也是 O(n)。追问“有重复/范围外的值怎么办”：加判断 <code>if v &lt; 0 or v &gt;= n or nums[v] == v: break</code>，或者改用通用排序。", cx: "O(n) time, O(1) space",
    },
    {
      id: "merge-sort", title: "Merge Sort", diff: "Medium", tags: ["divide & conquer"], short: "手写归并排序，返回新列表",
      en: "Return a new sorted list using merge sort. Do not call sort() or sorted().",
      examples: "merge_sort([38, 27, 43, 3, 9, 82, 10]) -> [3, 9, 10, 27, 38, 43, 82]",
      zh: "递归：len ≤ 1 直接返回；对半分别排序；再合并（双指针）。",
      starter: String.raw`def merge_sort(nums):
    pass
`,
      tests: [["merge_sort([38, 27, 43, 3, 9, 82, 10])", "[3, 9, 10, 27, 38, 43, 82]"], ["merge_sort([])", "[]"], ["merge_sort([1])", "[1]"], ["merge_sort([5, -1, 5, 0])", "[-1, 0, 5, 5]"], ["merge_sort(list(range(2000, 0, -1)))", "list(range(1, 2001))"]],
      hints: ["<code>mid = len(nums) // 2; left = merge_sort(nums[:mid]); right = merge_sort(nums[mid:])</code>"],
      solution: String.raw`def merge_sort(nums):
    if len(nums) <= 1:
        return nums[:]
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:       # <= keeps it stable
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out
`,
      explain: "递归深度 log n，每层合并总共 O(n)，所以 O(n log n)。", cx: "O(n log n) time, O(n) space",
    },
    {
      id: "quick-sort", title: "Quick Sort", diff: "Medium", tags: ["divide & conquer"], short: "原地快速排序",
      en: "Sort the list in place using quicksort. The tests include an already-sorted list of 2000 items, so consider a random pivot to avoid the O(n²) worst case and deep recursion.",
      examples: "[7, 2, 9, 4, 1] -> [1, 2, 4, 7, 9]",
      zh: "Lomuto 分区（看动画）。随机选 pivot：先把随机位置和末尾交换。",
      starter: String.raw`import random

def quick_sort(nums):
    def sort(lo, hi):
        pass
    sort(0, len(nums) - 1)
`,
      tests: [["inplace(quick_sort, [7, 2, 9, 4, 1])", "[1, 2, 4, 7, 9]"], ["inplace(quick_sort, [])", "[]"], ["inplace(quick_sort, [3, 3, 3, 1])", "[1, 3, 3, 3]"], ["inplace(quick_sort, list(range(2000)))", "list(range(2000))"], ["inplace(quick_sort, [5, -2, 8, 0, -2])", "[-2, -2, 0, 5, 8]"]],
      hints: ["<code>p = random.randint(lo, hi); nums[p], nums[hi] = nums[hi], nums[p]</code>，再做 Lomuto 分区。"],
      solution: String.raw`import random

def quick_sort(nums):
    def sort(lo, hi):
        if lo >= hi:
            return
        p = random.randint(lo, hi)
        nums[p], nums[hi] = nums[hi], nums[p]
        pivot, i = nums[hi], lo
        for j in range(lo, hi):
            if nums[j] < pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[hi] = nums[hi], nums[i]
        sort(lo, i - 1)
        sort(i + 1, hi)
    sort(0, len(nums) - 1)
`,
      explain: "固定选末尾为 pivot 时，已排序输入每次只分出 1 个元素，递归深度 n → O(n²)，Python 还会 RecursionError。全是相同元素时 Lomuto 也会退化，可以用三路分区（Dutch flag）解决。", cx: "O(n log n) average, O(n²) worst",
    },
    {
      id: "sort-colors", title: "Sort Colors (Dutch National Flag)", diff: "Medium", tags: ["three pointers"], short: "一次遍历排序 0/1/2",
      en: "nums contains only 0, 1 and 2. Sort it in place in one pass with O(1) extra space.",
      examples: "[2, 0, 2, 1, 1, 0] -> [0, 0, 1, 1, 2, 2]",
      zh: "三个指针：low 左边全是 0，high 右边全是 2，mid 扫描。遇 0 和 low 交换（low++、mid++）；遇 2 和 high 交换（high--，mid 不动）；遇 1 mid++。",
      starter: String.raw`def sort_colors(nums):
    pass
`,
      tests: [["inplace(sort_colors, [2, 0, 2, 1, 1, 0])", "[0, 0, 1, 1, 2, 2]"], ["inplace(sort_colors, [2, 0, 1])", "[0, 1, 2]"], ["inplace(sort_colors, [0])", "[0]"], ["inplace(sort_colors, [2, 2, 0, 0])", "[0, 0, 2, 2]"]],
      hints: ["和 high 交换后 mid 不前进：换过来的数还没检查。"],
      solution: String.raw`def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 2:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
        else:
            mid += 1
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "merge-intervals", title: "Merge Intervals", diff: "Medium", tags: ["sort + scan"], short: "合并重叠区间",
      en: "Given a list of intervals [start, end], merge all overlapping intervals and return them sorted by start.",
      examples: "[[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]",
      zh: "按 start 排序；当前区间的 start ≤ 上一个结果的 end 就合并（更新 end 为较大值），否则新开一个。",
      starter: String.raw`def merge_intervals(intervals):
    pass
`,
      tests: [["merge_intervals([[1,3],[2,6],[8,10],[15,18]])", "[[1,6],[8,10],[15,18]]"], ["merge_intervals([[1,4],[4,5]])", "[[1,5]]"], ["merge_intervals([[1,4],[2,3]])", "[[1,4]]"], ["merge_intervals([])", "[]"], ["merge_intervals([[5,6],[1,2]])", "[[1,2],[5,6]]"]],
      hints: ["<code>intervals.sort(key=lambda x: x[0])</code>"],
      solution: String.raw`def merge_intervals(intervals):
    res = []
    for s, e in sorted(intervals, key=lambda x: x[0]):
        if res and s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res
`,
      cx: "O(n log n) for sorting",
    },
  ],
});

window.CHAPTERS.push({
  id: "recursion", order: 19, num: "11", group: "算法专题 Algorithms", title: "递归与回溯", en: "Recursion & backtracking",
  concept: String.raw`
<h2>1. 递归三要素</h2>
<ol>
<li><b>定义</b>：函数返回什么（用一句话说清楚）。</li>
<li><b>Base case 终止条件</b>：最小的问题直接返回。忘了写 → 无限递归 → stack overflow（Python 报 RecursionError，默认深度约 1000）。</li>
<li><b>递推</b>：假设子问题已经解决，怎么组合成当前答案。</li>
</ol>
~~~py
def power(x, n):              # 快速幂：x^n
    if n == 0:
        return 1               # base case
    half = power(x, n // 2)    # 子问题
    return half * half * (x if n % 2 else 1)
~~~
<p>每次递归调用都会在<b>调用栈</b>上压一个栈帧（参数、局部变量、返回地址）——这就是 HR 第 5 题的 stack。递归深度 = 栈空间复杂度。</p>

<h2>2. 记忆化 Memoization</h2>
<p>朴素递归斐波那契 fib(n) = fib(n-1) + fib(n-2) 会重复计算，O(2ⁿ)。把算过的结果存起来，每个子问题只算一次 → O(n)。这就是自顶向下的动态规划。</p>
~~~py
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
~~~

<h2>3. 回溯模板</h2>
<p>回溯 = 在决策树上做 DFS：做选择 → 递归 → <b>撤销选择</b>。用于“列出所有组合/排列/子集/方案”。</p>
~~~py
def backtrack(path, choices):
    if 满足结束条件:
        result.append(path[:])      # 一定要拷贝！path 后面还会被修改
        return
    for c in choices:
        if 不合法: continue          # 剪枝 pruning
        path.append(c)              # 做选择
        backtrack(path, 新的choices)
        path.pop()                  # 撤销选择
~~~
<div class="note warn"><b class="lbl">最常见 bug</b><code>result.append(path)</code> 没有拷贝，最后 result 里全是同一个（空的）列表。</div>
<div class="vocab"><div><b>base case</b>终止条件</div><div><b>call stack / stack frame</b>调用栈/栈帧</div><div><b>memoization</b>记忆化</div><div><b>backtracking</b>回溯</div><div><b>pruning</b>剪枝</div><div><b>stack overflow</b>栈溢出</div></div>
`,
  anims: ["subsets"],
  problems: [
    {
      id: "factorial", title: "Factorial (recursive)", diff: "Easy", tags: ["recursion"], short: "递归求阶乘",
      en: "Return n! recursively. 0! = 1.",
      examples: "factorial(5) -> 120",
      zh: "base case：n ≤ 1 返回 1。",
      starter: String.raw`def factorial(n):
    pass
`,
      tests: [["factorial(0)", "1"], ["factorial(1)", "1"], ["factorial(5)", "120"], ["factorial(20)", "2432902008176640000"]],
      hints: ["<code>return n * factorial(n - 1)</code>"],
      solution: String.raw`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
`,
      cx: "O(n) time, O(n) stack",
    },
    {
      id: "climb-memo", title: "Climbing Stairs (memoized)", diff: "Easy", tags: ["memoization"], short: "一次爬 1 或 2 阶，有几种方法",
      en: "You can climb 1 or 2 steps at a time. How many distinct ways are there to reach step n? n can be up to 80.",
      examples: "climb_stairs(3) -> 3     # 1+1+1, 1+2, 2+1",
      zh: "ways(n) = ways(n-1) + ways(n-2)。不加记忆化 n=80 会超时。",
      starter: String.raw`def climb_stairs(n):
    pass
`,
      tests: [["climb_stairs(1)", "1"], ["climb_stairs(2)", "2"], ["climb_stairs(3)", "3"], ["climb_stairs(10)", "89"], ["climb_stairs(80)", "37889062373143906"]],
      hints: ["用 <code>@lru_cache(maxsize=None)</code> 装饰一个内部函数，或者自己用 dict 存。"],
      solution: String.raw`def climb_stairs(n):
    memo = {0: 1, 1: 1}

    def ways(k):
        if k not in memo:
            memo[k] = ways(k - 1) + ways(k - 2)
        return memo[k]

    return ways(n)
`,
      cx: "O(n) time, O(n) space",
    },
    {
      id: "subsets", title: "Subsets", diff: "Medium", tags: ["backtracking"], short: "所有子集（看动画决策树）",
      en: "Return all possible subsets of a list of distinct integers, in any order.",
      examples: "subsets([1, 2, 3]) -> [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]",
      zh: "每个元素选或不选。",
      starter: String.raw`def subsets(nums):
    res = []
    # your code here
    return res
`,
      tests: [["subsets([1, 2, 3])", "[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]", "nested"], ["subsets([0])", "[[], [0]]", "nested"], ["len(subsets(list(range(10))))", "1024"]],
      hints: ["<code>def dfs(i, path): if i == len(nums): res.append(path[:]); return</code>；然后选 nums[i] 递归、pop、不选递归。"],
      solution: String.raw`def subsets(nums):
    res = []

    def dfs(i, path):
        if i == len(nums):
            res.append(path[:])
            return
        path.append(nums[i])     # choose nums[i]
        dfs(i + 1, path)
        path.pop()               # undo
        dfs(i + 1, path)         # skip nums[i]

    dfs(0, [])
    return res
`,
      explain: "位运算写法：<code>for mask in range(1 &lt;&lt; n)</code>，第 i 位为 1 就选 nums[i]。和第 2 章呼应。", cx: "O(n · 2ⁿ)",
    },
    {
      id: "permutations", title: "Permutations", diff: "Medium", tags: ["backtracking"], short: "全排列",
      en: "Return all permutations of a list of distinct integers, in any order.",
      examples: "permute([1, 2, 3]) -> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      zh: "用 used 数组标记哪些数已经在 path 里。",
      starter: String.raw`def permute(nums):
    pass
`,
      tests: [["permute([1, 2, 3])", "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", "sorted"], ["permute([0, 1])", "[[0,1],[1,0]]", "sorted"], ["permute([1])", "[[1]]"], ["len(permute([1,2,3,4,5,6]))", "720"]],
      hints: ["<code>for i in range(n): if used[i]: continue</code>"],
      solution: String.raw`def permute(nums):
    res, path = [], []
    used = [False] * len(nums)

    def dfs():
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i, x in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(x)
            dfs()
            path.pop()
            used[i] = False

    dfs()
    return res
`,
      cx: "O(n · n!)",
    },
    {
      id: "combination-sum", title: "Combination Sum", diff: "Medium", tags: ["backtracking"], short: "可重复使用的数字凑出 target",
      en: "Given distinct positive candidates and a target, return all unique combinations that sum to target. A number may be used unlimited times. Combinations are lists in non-decreasing order; the list of combinations may be in any order.",
      examples: "combination_sum([2, 3, 6, 7], 7) -> [[2, 2, 3], [7]]",
      zh: "传 start 下标避免 [2,3] 和 [3,2] 重复；可以重复使用所以递归时仍从 i 开始。剩余为负时剪枝。",
      starter: String.raw`def combination_sum(candidates, target):
    pass
`,
      tests: [["combination_sum([2, 3, 6, 7], 7)", "[[2, 2, 3], [7]]", "sorted"], ["combination_sum([2, 3, 5], 8)", "[[2,2,2,2],[2,3,3],[3,5]]", "sorted"], ["combination_sum([2], 1)", "[]"]],
      hints: ["先排序 candidates；<code>dfs(start, remain, path)</code>；<code>if c &gt; remain: break</code>。"],
      solution: String.raw`def combination_sum(candidates, target):
    candidates = sorted(candidates)
    res = []

    def dfs(start, remain, path):
        if remain == 0:
            res.append(path[:])
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remain:
                break                 # sorted, so later ones are bigger too
            path.append(c)
            dfs(i, remain - c, path)  # i, not i + 1: reuse allowed
            path.pop()

    dfs(0, target, [])
    return res
`,
      cx: "exponential; pruning keeps it small in practice",
    },
    {
      id: "generate-parentheses", title: "Generate Parentheses", diff: "Medium", tags: ["backtracking"], short: "生成 n 对合法括号",
      en: "Return all combinations of n pairs of well-formed parentheses, in any order.",
      examples: "generate_parenthesis(3) -> ['((()))', '(()())', '(())()', '()(())', '()()()']",
      zh: "左括号数 < n 时可以加 '('；右括号数 < 左括号数时可以加 ')'。",
      starter: String.raw`def generate_parenthesis(n):
    pass
`,
      tests: [["generate_parenthesis(3)", "['((()))', '(()())', '(())()', '()(())', '()()()']", "sorted"], ["generate_parenthesis(1)", "['()']"], ["len(generate_parenthesis(5))", "42"]],
      hints: ["<code>dfs(s, open_count, close_count)</code>"],
      solution: String.raw`def generate_parenthesis(n):
    res = []

    def dfs(s, op, cl):
        if len(s) == 2 * n:
            res.append(s)
            return
        if op < n:
            dfs(s + "(", op + 1, cl)
        if cl < op:
            dfs(s + ")", op, cl + 1)

    dfs("", 0, 0)
    return res
`,
      explain: "这里用字符串拼接产生新串，所以不需要手动“撤销”。", cx: "O(4ⁿ / √n) — the Catalan number",
    },
  ],
});
