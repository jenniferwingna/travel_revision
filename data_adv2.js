// Chapters: Heap / priority queue, Dynamic programming.
window.CHAPTERS.push({
  id: "heap", order: 22, num: "14", group: "算法专题 Algorithms", title: "堆与优先队列", en: "Heap & priority queue",
  concept: String.raw`
<h2>1. 堆是什么</h2>
<p>堆是一棵<b>完全二叉树</b>，用数组存：下标 i 的孩子是 <code>2i+1</code>、<code>2i+2</code>，父亲是 <code>(i-1)//2</code>。最小堆：每个父节点 ≤ 子节点，所以堆顶是最小值。</p>
<div class="tblwrap"><table>
<tr><th>操作</th><th>复杂度</th><th>Python heapq</th></tr>
<tr><td>看最小值</td><td>O(1)</td><td><code>h[0]</code></td></tr>
<tr><td>插入（上浮 sift up）</td><td>O(log n)</td><td><code>heappush(h, x)</code></td></tr>
<tr><td>弹出最小（下沉 sift down）</td><td>O(log n)</td><td><code>heappop(h)</code></td></tr>
<tr><td>把列表变成堆</td><td>O(n)</td><td><code>heapify(a)</code></td></tr>
</table></div>
<p>Python 只有最小堆。要最大堆：存 <code>-x</code>。存元组 <code>(priority, item)</code> 会按第一个元素比较。</p>

<h2>2. 什么时候用</h2>
<ul>
<li><b>Top K</b>：前 k 大 → 维护大小为 k 的<b>最小堆</b>，新元素比堆顶大就替换。O(n log k)，比全排序 O(n log n) 好，而且适合数据流。</li>
<li><b>合并 k 个有序序列</b>：堆里放每个序列的当前元素。</li>
<li><b>调度</b>：操作系统按优先级选下一个任务；定时器按到期时间排。</li>
<li><b>Dijkstra 最短路径</b>（带权图）。</li>
</ul>
~~~py
import heapq
def kth_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)        # 弹出最小的，堆里留下最大的 k 个
    return h[0]                     # 这 k 个里最小的 = 第 k 大
~~~
<div class="vocab"><div><b>min-heap / max-heap</b>最小堆/最大堆</div><div><b>priority queue</b>优先队列</div><div><b>sift up / sift down</b>上浮/下沉</div><div><b>"I keep a min-heap of size k, so it's O(n log k)."</b></div></div>
`,
  anims: ["heap"],
  problems: [
    {
      id: "last-stone", title: "Last Stone Weight", diff: "Easy", tags: ["max-heap"], short: "每次取最重的两块石头相撞",
      en: "Each turn, take the two heaviest stones x <= y and smash them: if x == y both are destroyed, otherwise a stone of weight y - x remains. Return the weight of the last stone, or 0 if none remain.",
      examples: "last_stone_weight([2, 7, 4, 1, 8, 1]) -> 1",
      zh: "最大堆：Python 存负数。",
      starter: String.raw`def last_stone_weight(stones):
    pass
`,
      tests: [["last_stone_weight([2, 7, 4, 1, 8, 1])", "1"], ["last_stone_weight([1])", "1"], ["last_stone_weight([3, 3])", "0"], ["last_stone_weight([10, 4, 2, 10])", "2"]],
      hints: ["<code>h = [-s for s in stones]; heapify(h)</code>"],
      solution: String.raw`def last_stone_weight(stones):
    h = [-s for s in stones]
    heapify(h)
    while len(h) > 1:
        y = -heappop(h)
        x = -heappop(h)
        if y != x:
            heappush(h, -(y - x))
    return -h[0] if h else 0
`,
      cx: "O(n log n)",
    },
    {
      id: "kth-largest", title: "Kth Largest Element", diff: "Medium", tags: ["min-heap of size k"], short: "第 k 大的元素",
      en: "Return the k-th largest element in the list (not the k-th distinct). Try to beat O(n log n).",
      examples: "find_kth_largest([3, 2, 1, 5, 6, 4], 2) -> 5\nfind_kth_largest([3,2,3,1,2,4,5,5,6], 4) -> 4",
      zh: "大小为 k 的最小堆。（另一种方法是快速选择 quickselect，平均 O(n)。）",
      starter: String.raw`def find_kth_largest(nums, k):
    pass
`,
      tests: [["find_kth_largest([3, 2, 1, 5, 6, 4], 2)", "5"], ["find_kth_largest([3,2,3,1,2,4,5,5,6], 4)", "4"], ["find_kth_largest([1], 1)", "1"], ["find_kth_largest([-1, -1], 2)", "-1"]],
      hints: ["看知识点模板。"],
      solution: String.raw`def find_kth_largest(nums, k):
    h = []
    for x in nums:
        heappush(h, x)
        if len(h) > k:
            heappop(h)
    return h[0]
`,
      cx: "O(n log k) time, O(k) space",
    },
    {
      id: "top-k-frequent", title: "Top K Frequent Elements", diff: "Medium", tags: ["heap", "counting"], short: "出现频率最高的 k 个数",
      en: "Return the k most frequent elements, in any order. The answer is unique.",
      examples: "top_k_frequent([1, 1, 1, 2, 2, 3], 2) -> [1, 2]",
      zh: "Counter 计数，然后 heapq.nlargest(k, cnt, key=cnt.get)；或者桶排序 O(n)。",
      starter: String.raw`def top_k_frequent(nums, k):
    pass
`,
      tests: [["top_k_frequent([1, 1, 1, 2, 2, 3], 2)", "[1, 2]", "sorted"], ["top_k_frequent([1], 1)", "[1]"], ["top_k_frequent([4, 4, 5, 5, 5, 6], 1)", "[5]"]],
      hints: ["<code>cnt = Counter(nums)</code>"],
      solution: String.raw`def top_k_frequent(nums, k):
    cnt = Counter(nums)
    return heapq.nlargest(k, cnt.keys(), key=cnt.get)
`,
      cx: "O(n log k)",
    },
    {
      id: "k-closest", title: "K Closest Points to Origin", diff: "Medium", tags: ["heap"], short: "离原点最近的 k 个点",
      en: "Return the k points closest to (0, 0) by Euclidean distance, in any order.",
      examples: "k_closest([[1, 3], [-2, 2]], 1) -> [[-2, 2]]",
      zh: "比较平方距离就够了，不用开根号。",
      starter: String.raw`def k_closest(points, k):
    pass
`,
      tests: [["k_closest([[1, 3], [-2, 2]], 1)", "[[-2, 2]]"], ["k_closest([[3, 3], [5, -1], [-2, 4]], 2)", "[[3, 3], [-2, 4]]", "sorted"], ["k_closest([[0, 1], [1, 0]], 2)", "[[0, 1], [1, 0]]", "sorted"]],
      hints: ["<code>heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)</code>"],
      solution: String.raw`def k_closest(points, k):
    return heapq.nsmallest(k, points, key=lambda p: p[0] * p[0] + p[1] * p[1])
`,
      cx: "O(n log k)",
    },
    {
      id: "merge-k-sorted", title: "Merge K Sorted Lists (arrays)", diff: "Medium", tags: ["heap"], short: "合并 k 个有序数组",
      en: "Given a list of k sorted lists, return one merged sorted list.",
      examples: "merge_k([[1, 4, 5], [1, 3, 4], [2, 6]]) -> [1, 1, 2, 3, 4, 4, 5, 6]",
      zh: "堆里放 (值, 第几个列表, 下标)。每弹出一个，就把同一列表的下一个元素放进去。",
      starter: String.raw`def merge_k(lists):
    pass
`,
      tests: [["merge_k([[1, 4, 5], [1, 3, 4], [2, 6]])", "[1, 1, 2, 3, 4, 4, 5, 6]"], ["merge_k([])", "[]"], ["merge_k([[], [1]])", "[1]"]],
      hints: ["<code>h = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]</code>"],
      solution: String.raw`def merge_k(lists):
    h = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapify(h)
    out = []
    while h:
        val, i, j = heappop(h)
        out.append(val)
        if j + 1 < len(lists[i]):
            heappush(h, (lists[i][j + 1], i, j + 1))
    return out
`,
      cx: "O(N log k), N = total elements",
    },
  ],
});

window.CHAPTERS.push({
  id: "dp", order: 23, num: "15", group: "算法专题 Algorithms", title: "动态规划", en: "Dynamic programming",
  concept: String.raw`
<h2>1. 什么时候是 DP</h2>
<p>问题可以拆成<b>重叠的子问题</b>，并且大问题的最优解由子问题的最优解组成（最优子结构）。关键词：“有多少种方法”、“最少/最多”、“能否做到”。</p>

<h2>2. 四步法（每题都这样想）</h2>
<ol>
<li><b>状态定义</b>：<code>dp[i]</code> 代表什么？（用中文说清楚，最重要的一步）</li>
<li><b>转移方程</b>：<code>dp[i]</code> 怎么由更小的状态算出来？</li>
<li><b>初始值 base case</b>：<code>dp[0]</code>、<code>dp[1]</code> 是多少？</li>
<li><b>计算顺序与答案</b>：从小到大填表，答案在哪个格子？</li>
</ol>

<h2>3. 经典题的状态和转移</h2>
<div class="tblwrap"><table>
<tr><th>题</th><th>状态</th><th>转移</th></tr>
<tr><td>爬楼梯</td><td>dp[i] = 到第 i 阶的方法数</td><td>dp[i-1] + dp[i-2]</td></tr>
<tr><td>打家劫舍</td><td>dp[i] = 前 i 间房最多偷多少</td><td>max(dp[i-1], dp[i-2] + nums[i])</td></tr>
<tr><td>最大子数组和</td><td>cur = 以 i 结尾的最大和</td><td>max(nums[i], cur + nums[i])</td></tr>
<tr><td>零钱兑换</td><td>dp[a] = 凑出 a 的最少硬币</td><td>min(dp[a - c] + 1)</td></tr>
<tr><td>最长递增子序列</td><td>dp[i] = 以 i 结尾的 LIS 长度</td><td>max(dp[j] + 1), j &lt; i 且 nums[j] &lt; nums[i]</td></tr>
<tr><td>不同路径</td><td>dp[r][c] = 走到 (r,c) 的路径数</td><td>dp[r-1][c] + dp[r][c-1]</td></tr>
<tr><td>LCS</td><td>dp[i][j] = a[:i] 和 b[:j] 的 LCS</td><td>相等: 左上+1；否则 max(上, 左)</td></tr>
</table></div>

<h2>4. 自顶向下 vs 自底向上</h2>
~~~py
# 自顶向下：递归 + 记忆化（好想）
@lru_cache(maxsize=None)
def rob_from(i):
    if i >= len(nums):
        return 0
    return max(rob_from(i + 1), nums[i] + rob_from(i + 2))

# 自底向上：填表（没有递归栈，可以压缩空间）
def rob(nums):
    prev2 = prev1 = 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1
~~~
<div class="vocab"><div><b>overlapping subproblems</b>重叠子问题</div><div><b>optimal substructure</b>最优子结构</div><div><b>state / transition</b>状态/转移</div><div><b>top-down / bottom-up</b>自顶向下/自底向上</div><div><b>"dp of i represents ..."</b>“dp[i] 表示……”</div></div>
`,
  anims: ["dp_stairs", "kadane", "dp_coin", "dp_lcs"],
  problems: [
    {
      id: "climb-stairs-dp", title: "Climbing Stairs (bottom-up)", diff: "Easy", tags: ["1D DP"], short: "用 O(1) 空间写爬楼梯",
      en: "You can climb 1 or 2 steps. Return the number of distinct ways to reach step n (n >= 1). Use O(1) extra space.",
      examples: "climb(5) -> 8",
      zh: "只保留前两个状态。",
      starter: String.raw`def climb(n):
    pass
`,
      tests: [["climb(1)", "1"], ["climb(2)", "2"], ["climb(5)", "8"], ["climb(45)", "1836311903"]],
      hints: ["<code>a, b = 1, 1; for _ in range(n): a, b = b, a + b</code>"],
      solution: String.raw`def climb(n):
    a, b = 1, 1          # ways(0), ways(1)
    for _ in range(n - 1):
        a, b = b, a + b
    return b
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "max-subarray", title: "Maximum Subarray (Kadane)", diff: "Medium", tags: ["1D DP"], short: "最大连续子数组和（看动画）",
      en: "Return the largest sum of a non-empty contiguous subarray.",
      examples: "max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) -> 6    # [4, -1, 2, 1]",
      zh: "cur = max(x, cur + x)；best 记录最大值。全是负数时答案是最大的那个负数。",
      starter: String.raw`def max_subarray(nums):
    pass
`,
      tests: [["max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])", "6"], ["max_subarray([1])", "1"], ["max_subarray([5, 4, -1, 7, 8])", "23"], ["max_subarray([-3, -1, -2])", "-1"]],
      hints: ["初始 <code>cur = best = nums[0]</code>，不要初始化为 0。"],
      solution: String.raw`def max_subarray(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "house-robber", title: "House Robber", diff: "Medium", tags: ["1D DP"], short: "不能偷相邻两家，最多偷多少",
      en: "Each house has some money. You cannot rob two adjacent houses. Return the maximum amount you can rob.",
      examples: "rob([2, 7, 9, 3, 1]) -> 12    # 2 + 9 + 1",
      zh: "对第 i 家：不偷 → dp[i-1]；偷 → dp[i-2] + nums[i]。",
      starter: String.raw`def rob(nums):
    pass
`,
      tests: [["rob([1, 2, 3, 1])", "4"], ["rob([2, 7, 9, 3, 1])", "12"], ["rob([])", "0"], ["rob([5])", "5"], ["rob([2, 1, 1, 2])", "4"]],
      hints: ["<code>prev2, prev1 = prev1, max(prev1, prev2 + x)</code>"],
      solution: String.raw`def rob(nums):
    prev2 = prev1 = 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "coin-change", title: "Coin Change", diff: "Medium", tags: ["1D DP"], short: "凑出金额的最少硬币数（看动画）",
      en: "Given coin denominations (unlimited supply) and an amount, return the fewest coins that make up the amount, or -1 if impossible.",
      examples: "coin_change([1, 2, 5], 11) -> 3    # 5 + 5 + 1\ncoin_change([2], 3) -> -1",
      zh: "dp[a] = min(dp[a - c] + 1)。贪心是错的：coins = [1, 3, 4], amount = 6。",
      starter: String.raw`def coin_change(coins, amount):
    pass
`,
      tests: [["coin_change([1, 2, 5], 11)", "3"], ["coin_change([2], 3)", "-1"], ["coin_change([1], 0)", "0"], ["coin_change([1, 3, 4], 6)", "2"], ["coin_change([186, 419, 83, 408], 6249)", "20"]],
      hints: ["<code>dp = [0] + [float('inf')] * amount</code>"],
      solution: String.raw`def coin_change(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1
`,
      cx: "O(amount × len(coins))",
    },
    {
      id: "unique-paths", title: "Unique Paths", diff: "Medium", tags: ["2D DP"], short: "网格从左上到右下的路径数",
      en: "A robot starts at the top-left of an m x n grid and can only move right or down. How many unique paths lead to the bottom-right corner?",
      examples: "unique_paths(3, 7) -> 28",
      zh: "第一行第一列都是 1；其它格子 = 上 + 左。可以压缩成一维数组。",
      starter: String.raw`def unique_paths(m, n):
    pass
`,
      tests: [["unique_paths(3, 7)", "28"], ["unique_paths(3, 2)", "3"], ["unique_paths(1, 1)", "1"], ["unique_paths(10, 10)", "48620"]],
      hints: ["<code>dp = [[1] * n for _ in range(m)]</code>"],
      solution: String.raw`def unique_paths(m, n):
    row = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            row[c] += row[c - 1]     # row[c] (from above) + row[c-1] (from left)
    return row[-1]
`,
      cx: "O(m·n) time, O(n) space",
    },
    {
      id: "lis", title: "Longest Increasing Subsequence", diff: "Medium", tags: ["1D DP"], short: "最长严格递增子序列长度",
      en: "Return the length of the longest strictly increasing subsequence (not necessarily contiguous).",
      examples: "length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]) -> 4    # [2, 3, 7, 101]",
      zh: "O(n²)：dp[i] = 以 nums[i] 结尾的 LIS 长度。进阶 O(n log n)：维护 tails 数组 + 二分。",
      starter: String.raw`def length_of_lis(nums):
    pass
`,
      tests: [["length_of_lis([10, 9, 2, 5, 3, 7, 101, 18])", "4"], ["length_of_lis([0, 1, 0, 3, 2, 3])", "4"], ["length_of_lis([7, 7, 7])", "1"], ["length_of_lis([])", "0"]],
      hints: ["<code>for i: for j &lt; i: if nums[j] &lt; nums[i]: dp[i] = max(dp[i], dp[j] + 1)</code>"],
      solution: String.raw`def length_of_lis(nums):
    tails = []            # tails[k] = smallest tail of an increasing subsequence of length k+1
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
`,
      explain: "面试先写 O(n²) 版本就够了：<code>dp = [1]*n</code>，双重循环。tails 版本是加分项：tails 始终有序，每个数用二分找到替换位置。", cx: "O(n log n) (or O(n²) simple DP)",
    },
    {
      id: "lcs", title: "Longest Common Subsequence", diff: "Medium", tags: ["2D DP"], short: "两个字符串的最长公共子序列（看动画）",
      en: "Return the length of the longest common subsequence of strings a and b.",
      examples: "lcs('abcde', 'ace') -> 3",
      zh: "dp 表多开一行一列表示空串。",
      starter: String.raw`def lcs(a, b):
    pass
`,
      tests: [["lcs('abcde', 'ace')", "3"], ["lcs('abc', 'abc')", "3"], ["lcs('abc', 'def')", "0"], ["lcs('ABCBDAB', 'BDCABA')", "4"], ["lcs('', 'a')", "0"]],
      hints: ["<code>dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]</code>"],
      solution: String.raw`def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
`,
      explain: "LCS 是 diff 工具（比较两个文件差异）的核心算法。", cx: "O(m·n) time and space",
    },
    {
      id: "word-break", title: "Word Break", diff: "Medium", tags: ["1D DP"], short: "字符串能否拆成字典里的单词",
      en: "Return True if s can be split into a sequence of one or more words from word_dict (words may be reused).",
      examples: "word_break('leetcode', ['leet', 'code']) -> True\nword_break('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']) -> False",
      zh: "dp[i] = s[:i] 能否拆分。dp[i] 为真当且仅当存在 j，dp[j] 为真且 s[j:i] 在字典里。",
      starter: String.raw`def word_break(s, word_dict):
    pass
`,
      tests: [["word_break('leetcode', ['leet', 'code'])", "True"], ["word_break('applepenapple', ['apple', 'pen'])", "True"], ["word_break('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])", "False"], ["word_break('', ['a'])", "True"]],
      hints: ["<code>words = set(word_dict); dp = [True] + [False] * len(s)</code>"],
      solution: String.raw`def word_break(s, word_dict):
    words = set(word_dict)
    dp = [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]
`,
      cx: "O(n²) substring checks",
    },
  ],
});
