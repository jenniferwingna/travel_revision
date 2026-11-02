// Chapters: Hash tables, Sliding window, Stack & queue.
window.CHAPTERS.push({
  id: "hash", order: 13, num: "05", group: "算法专题 Algorithms", title: "哈希表", en: "Hash maps & sets",
  blurb: "HR 题：词频统计",
  concept: String.raw`
<h2>1. 原理</h2>
<p>哈希表把 key 通过<b>哈希函数</b>映射成数组下标，所以查找、插入、删除<b>平均 O(1)</b>。两个 key 映射到同一位置叫<b>冲突 collision</b>，用链表（chaining）或开放寻址（open addressing）解决。冲突严重时最坏 O(n)。元素太多时会扩容（rehash），均摊仍是 O(1)。</p>
<p>Python：<code>dict</code>（key → value）和 <code>set</code>（只有 key）。key 必须是不可变的（int、str、tuple 可以；list 不行）。C++：<code>unordered_map</code>；C 没有内置，要自己写或用数组计数。</p>

<h2>2. 四种用法模式</h2>
<div class="tblwrap"><table>
<tr><th>模式</th><th>写法</th><th>典型题</th></tr>
<tr><td>计数 counting</td><td><code>cnt[x] = cnt.get(x, 0) + 1</code> / <code>Counter</code></td><td>词频、异位词、第一个不重复字符</td></tr>
<tr><td>见过没有 seen</td><td><code>if x in seen: ...; seen.add(x)</code></td><td>是否有重复</td></tr>
<tr><td>找补数 complement</td><td><code>if target - x in idx: ...</code></td><td>Two Sum</td></tr>
<tr><td>分组 grouping</td><td><code>groups[key(x)].append(x)</code></td><td>字母异位词分组</td></tr>
</table></div>

<h2>3. HR 第 8 题完整答案</h2>
~~~py
from collections import Counter

sentence = "the sky is blue and the sun is yellow"
words = sentence.split()
print(len(words))                    # 1. 单词数 9
freq = Counter(words)                # 2. 每个单词出现次数
for w, c in freq.most_common():      #    按次数降序输出
    print(w, c)
# 3. 复杂度：split 和计数都是 O(n)（n = 字符数）；most_common 排序 O(k log k)，k = 不同单词数
~~~
<p>C 语言思路（面试官可能追问）：没有内置哈希表时，单词少可以用“结构体数组 + 线性查找”O(n·k)，或自己实现哈希表（字符串哈希如 djb2：<code>h = h * 33 + c</code>，取模桶数，链表解决冲突）。也可以先排序单词再数相邻相同的，O(k log k)。</p>

<div class="vocab">
<div><b>hash function</b>哈希函数</div><div><b>collision</b>冲突</div>
<div><b>amortized O(1)</b>均摊 O(1)</div><div><b>key-value pair</b>键值对</div>
<div><b>"I'll use a hash map to store each number's index."</b></div>
<div><b>"Lookups are O(1) on average, O(n) in the worst case."</b></div>
</div>
`,
  anims: ["word_count"],
  problems: [
    {
      id: "two-sum", title: "Two Sum", diff: "Easy", tags: ["complement"], short: "最经典：哈希表一次遍历",
      en: "Return the indices [i, j] (i < j) of the two numbers in nums that add up to target. Exactly one solution exists. The list is NOT sorted.",
      examples: "two_sum([2, 7, 11, 15], 9) -> [0, 1]\ntwo_sum([3, 2, 4], 6) -> [1, 2]",
      zh: "暴力 O(n²)。用 dict 记录“值 → 下标”，对每个 x 查 target - x 是否出现过。",
      starter: String.raw`def two_sum(nums, target):
    pass
`,
      tests: [["two_sum([2, 7, 11, 15], 9)", "[0, 1]"], ["two_sum([3, 2, 4], 6)", "[1, 2]"], ["two_sum([3, 3], 6)", "[0, 1]"], ["two_sum([-3, 4, 3, 90], 0)", "[0, 2]"]],
      hints: ["先查后存：<code>if target - x in seen: return [seen[target - x], i]</code>，然后 <code>seen[x] = i</code>。先查后存能正确处理 [3, 3]。"],
      solution: String.raw`def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []
`,
      cx: "O(n) time, O(n) space", sayCx: "I trade space for time: one pass with a hash map gives O(n) time and O(n) extra space, instead of the O(n squared) brute force.",
    },
    {
      id: "word-frequency", title: "Word Frequency (HR Q8.2)", diff: "Easy", tags: ["HR 真题", "counting"], short: "返回 {单词: 次数} 字典",
      en: "Return a dict mapping each word in the sentence to how many times it appears. Words are separated by spaces.",
      examples: "word_frequency('the sky is blue and the sun is yellow')\n-> {'the': 2, 'sky': 1, 'is': 2, 'blue': 1, 'and': 1, 'sun': 1, 'yellow': 1}",
      zh: "先不用 Counter 手写一遍，再知道 Counter 一行搞定。",
      starter: String.raw`def word_frequency(sentence):
    freq = {}
    # your code here
    return freq
`,
      tests: [["word_frequency('the sky is blue and the sun is yellow')", "{'the': 2, 'sky': 1, 'is': 2, 'blue': 1, 'and': 1, 'sun': 1, 'yellow': 1}"], ["word_frequency('')", "{}"], ["word_frequency('a a a')", "{'a': 3}"], ["word_frequency('  b  a b ')", "{'b': 2, 'a': 1}"]],
      hints: ["<code>for w in sentence.split(): freq[w] = freq.get(w, 0) + 1</code>"],
      solution: String.raw`def word_frequency(sentence):
    freq = {}
    for w in sentence.split():
        freq[w] = freq.get(w, 0) + 1
    return freq
`,
      explain: "等价写法：<code>return dict(Counter(sentence.split()))</code>。追问“大小写/标点怎么办”：先 <code>lower()</code>，再用 <code>re.findall(r\"[a-z']+\", s)</code> 提取单词。",
      cx: "O(n) time, O(k) space (k distinct words)",
    },
    {
      id: "contains-duplicate", title: "Contains Duplicate", diff: "Easy", tags: ["set"], short: "是否有重复元素",
      en: "Return True if any value appears at least twice in nums.",
      examples: "contains_duplicate([1, 2, 3, 1]) -> True",
      zh: "set 记录见过的数。",
      starter: String.raw`def contains_duplicate(nums):
    pass
`,
      tests: [["contains_duplicate([1, 2, 3, 1])", "True"], ["contains_duplicate([1, 2, 3, 4])", "False"], ["contains_duplicate([])", "False"]],
      hints: ["<code>len(set(nums)) != len(nums)</code> 也行。"],
      solution: String.raw`def contains_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
`,
      cx: "O(n) time, O(n) space",
    },
    {
      id: "first-unique", title: "First Unique Character", diff: "Easy", tags: ["counting"], short: "第一个只出现一次的字符下标",
      en: "Return the index of the first non-repeating character in s, or -1 if there is none.",
      examples: "first_unique_char('leetcode') -> 0\nfirst_unique_char('loveleetcode') -> 2",
      zh: "两遍：第一遍计数，第二遍找第一个计数为 1 的。",
      starter: String.raw`def first_unique_char(s):
    pass
`,
      tests: [["first_unique_char('leetcode')", "0"], ["first_unique_char('loveleetcode')", "2"], ["first_unique_char('aabb')", "-1"], ["first_unique_char('')", "-1"]],
      hints: ["<code>cnt = Counter(s)</code>"],
      solution: String.raw`def first_unique_char(s):
    cnt = Counter(s)
    for i, ch in enumerate(s):
        if cnt[ch] == 1:
            return i
    return -1
`,
      cx: "O(n) time, O(1) space for a fixed alphabet",
    },
    {
      id: "intersection", title: "Intersection of Two Arrays", diff: "Easy", tags: ["set"], short: "两数组交集（去重、升序）",
      en: "Return the sorted list of distinct values that appear in both a and b.",
      examples: "intersection([1, 2, 2, 1], [2, 2]) -> [2]",
      zh: "set 的交集运算 &。",
      starter: String.raw`def intersection(a, b):
    pass
`,
      tests: [["intersection([1, 2, 2, 1], [2, 2])", "[2]"], ["intersection([4, 9, 5], [9, 4, 9, 8, 4])", "[4, 9]"], ["intersection([1], [])", "[]"]],
      hints: ["<code>sorted(set(a) &amp; set(b))</code>"],
      solution: String.raw`def intersection(a, b):
    return sorted(set(a) & set(b))
`,
      cx: "O(m + n) plus O(k log k) to sort the result",
    },
    {
      id: "group-anagrams", title: "Group Anagrams", diff: "Medium", tags: ["grouping"], short: "把字母异位词分到一组",
      en: "Group the strings that are anagrams of each other. Return a list of groups in any order.",
      examples: "group_anagrams(['eat','tea','tan','ate','nat','bat'])\n-> [['eat','tea','ate'], ['tan','nat'], ['bat']]",
      zh: "异位词排序后相同，用排序后的字符串（或 26 长度计数元组）作为 key。",
      starter: String.raw`def group_anagrams(strs):
    pass
`,
      tests: [["group_anagrams(['eat','tea','tan','ate','nat','bat'])", "[['eat','tea','ate'], ['tan','nat'], ['bat']]", "nested"], ["group_anagrams([''])", "[['']]", "nested"], ["group_anagrams(['a'])", "[['a']]", "nested"], ["group_anagrams(['ab', 'ba', 'abc'])", "[['ab', 'ba'], ['abc']]", "nested"]],
      hints: ["<code>groups = defaultdict(list); groups[''.join(sorted(s))].append(s)</code>"],
      solution: String.raw`def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        groups["".join(sorted(s))].append(s)
    return list(groups.values())
`,
      cx: "O(n · k log k), k = max string length",
    },
    {
      id: "top-k-words", title: "Top K Frequent Words", diff: "Medium", tags: ["HR 真题", "sorting"], short: "HR 第 8 题的扩展：按次数降序，同次数按字母序",
      en: "Given a sentence and k, return the k most frequent words. Sort by frequency (high to low); words with the same frequency are sorted alphabetically.",
      examples: "top_k_words('the sky is blue and the sun is yellow', 2) -> ['is', 'the']",
      zh: "Counter 计数后，用 key=lambda w: (-cnt[w], w) 排序。",
      starter: String.raw`def top_k_words(sentence, k):
    pass
`,
      tests: [["top_k_words('the sky is blue and the sun is yellow', 2)", "['is', 'the']"], ["top_k_words('the sky is blue and the sun is yellow', 3)", "['is', 'the', 'and']"], ["top_k_words('b a c a b a', 1)", "['a']"], ["top_k_words('x y', 5)", "['x', 'y']"]],
      hints: ["<code>sorted(cnt, key=lambda w: (-cnt[w], w))[:k]</code>"],
      solution: String.raw`def top_k_words(sentence, k):
    cnt = Counter(sentence.split())
    return sorted(cnt, key=lambda w: (-cnt[w], w))[:k]
`,
      explain: "排序 O(k' log k')，k' 是不同单词数。若单词非常多而 k 很小，可用大小为 k 的堆做到 O(n log k)（见堆一章）。", cx: "O(n + m log m), m = distinct words",
    },
    {
      id: "longest-consecutive", title: "Longest Consecutive Sequence", diff: "Medium", tags: ["set"], short: "最长连续整数序列，要求 O(n)",
      en: "Given an unsorted list of integers, return the length of the longest run of consecutive values (e.g. 1, 2, 3, 4). Must run in O(n).",
      examples: "longest_consecutive([100, 4, 200, 1, 3, 2]) -> 4",
      zh: "放进 set。只有当 x-1 不在 set 里时，x 才是一段的起点，从它往上数。每个数最多被访问两次。",
      starter: String.raw`def longest_consecutive(nums):
    pass
`,
      tests: [["longest_consecutive([100, 4, 200, 1, 3, 2])", "4"], ["longest_consecutive([0,3,7,2,5,8,4,6,0,1])", "9"], ["longest_consecutive([])", "0"], ["longest_consecutive([5])", "1"]],
      hints: ["<code>if x - 1 not in s:</code> 再 while 往上数。"],
      solution: String.raw`def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 not in s:
            y = x
            while y + 1 in s:
                y += 1
            best = max(best, y - x + 1)
    return best
`,
      cx: "O(n) time, O(n) space",
    },
    {
      id: "subarray-sum-k", title: "Subarray Sum Equals K", diff: "Medium", tags: ["prefix sum"], short: "和为 k 的连续子数组个数（前缀和 + 哈希）",
      en: "Return the number of contiguous subarrays whose sum equals k. Values can be negative.",
      examples: "subarray_sum([1, 1, 1], 2) -> 2\nsubarray_sum([1, 2, 3], 3) -> 2",
      zh: "区间和 = prefix[j] - prefix[i]。遍历时维护当前前缀和 cur，答案加上“之前有多少个前缀和等于 cur - k”。",
      starter: String.raw`def subarray_sum(nums, k):
    pass
`,
      tests: [["subarray_sum([1, 1, 1], 2)", "2"], ["subarray_sum([1, 2, 3], 3)", "2"], ["subarray_sum([1, -1, 0], 0)", "3"], ["subarray_sum([3], 2)", "0"]],
      hints: ["<code>seen = {0: 1}</code>：空前缀和为 0 出现过一次。"],
      solution: String.raw`def subarray_sum(nums, k):
    seen = {0: 1}
    cur = count = 0
    for x in nums:
        cur += x
        count += seen.get(cur - k, 0)
        seen[cur] = seen.get(cur, 0) + 1
    return count
`,
      explain: "有负数时不能用滑动窗口（窗口扩大不保证和变大），前缀和 + 哈希是通用解法。", cx: "O(n) time, O(n) space",
    },
  ],
});

window.CHAPTERS.push({
  id: "window", order: 14, num: "06", group: "算法专题 Algorithms", title: "滑动窗口", en: "Sliding window",
  concept: String.raw`
<h2>1. 什么时候用</h2>
<p>题目问<b>连续子数组 / 子串</b>的最长、最短、最大和、满足某条件的个数时，优先想滑动窗口。窗口 [L, R]：R 向右扩张，条件被破坏时 L 向右收缩。L 和 R 都只向右走，所以总共 O(n)。</p>

<h2>2. 两种窗口</h2>
<h3>固定长度 k</h3>
~~~py
def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for r in range(k, len(nums)):
        window += nums[r] - nums[r - k]   # 进一个，出一个
        best = max(best, window)
    return best
~~~
<h3>可变长度（通用模板）</h3>
~~~py
def longest_valid(s):
    state = {}              # 窗口内的统计信息
    l = best = 0
    for r, ch in enumerate(s):
        # 1. 把 s[r] 加入窗口，更新 state
        # 2. while 窗口不合法: 移出 s[l]，l += 1
        # 3. 此时窗口合法，更新答案 best = max(best, r - l + 1)
        pass
    return best
~~~
<div class="note tip"><b class="lbl">求最短</b>把“更新答案”放在收缩的 while 循环<b>里面</b>：窗口合法时先记录长度，再尝试缩小。</div>
<div class="note warn"><b class="lbl">限制</b>窗口需要“单调性”：扩大窗口条件只会变差/变好。数组有负数时求“和 = k”不能用滑动窗口，要用前缀和 + 哈希表。</div>
<div class="vocab"><div><b>sliding window</b>滑动窗口</div><div><b>expand / shrink the window</b>扩张/收缩</div><div><b>contiguous subarray</b>连续子数组</div></div>
`,
  anims: ["sliding_window"],
  problems: [
    {
      id: "max-sum-k", title: "Maximum Sum of Subarray of Size K", diff: "Easy", tags: ["fixed window"], short: "长度为 k 的子数组最大和",
      en: "Return the maximum sum of any contiguous subarray of length k (1 <= k <= len(nums)).",
      examples: "max_sum_k([2, 1, 5, 1, 3, 2], 3) -> 9   # [5, 1, 3]",
      zh: "固定窗口：加入新元素，减去离开的元素。",
      starter: String.raw`def max_sum_k(nums, k):
    pass
`,
      tests: [["max_sum_k([2, 1, 5, 1, 3, 2], 3)", "9"], ["max_sum_k([2, 3, 4, 1, 5], 2)", "7"], ["max_sum_k([-1, -2, -3], 1)", "-1"], ["max_sum_k([5], 1)", "5"]],
      hints: ["<code>window += nums[r] - nums[r - k]</code>"],
      solution: String.raw`def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for r in range(k, len(nums)):
        window += nums[r] - nums[r - k]
        best = max(best, window)
    return best
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "max-avg-buy", title: "Best Time to Buy and Sell Stock", diff: "Easy", tags: ["one pass"], short: "一次买卖的最大利润",
      en: "prices[i] is a stock price on day i. Choose one day to buy and a later day to sell. Return the maximum profit, or 0 if no profit is possible.",
      examples: "max_profit([7, 1, 5, 3, 6, 4]) -> 5",
      zh: "遍历时维护“到目前为止的最低价”，用今天价格减去它更新答案。",
      starter: String.raw`def max_profit(prices):
    pass
`,
      tests: [["max_profit([7, 1, 5, 3, 6, 4])", "5"], ["max_profit([7, 6, 4, 3, 1])", "0"], ["max_profit([1])", "0"], ["max_profit([2, 4, 1, 7])", "6"]],
      hints: ["<code>low = min(low, p); best = max(best, p - low)</code>"],
      solution: String.raw`def max_profit(prices):
    low = float("inf")
    best = 0
    for p in prices:
        low = min(low, p)
        best = max(best, p - low)
    return best
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "longest-unique", title: "Longest Substring Without Repeating Characters", diff: "Medium", tags: ["variable window"], short: "最长无重复字符子串（看动画）",
      en: "Return the length of the longest substring of s that contains no repeated characters.",
      examples: "length_of_longest('abcabcbb') -> 3   # 'abc'\nlength_of_longest('pwwkew') -> 3     # 'wke'",
      zh: "记录每个字符最后出现的位置。遇到重复且在窗口内，L 跳到上次位置 + 1。",
      starter: String.raw`def length_of_longest(s):
    pass
`,
      tests: [["length_of_longest('abcabcbb')", "3"], ["length_of_longest('bbbbb')", "1"], ["length_of_longest('pwwkew')", "3"], ["length_of_longest('')", "0"], ["length_of_longest('abba')", "2"], ["length_of_longest('dvdf')", "3"]],
      hints: ["<code>if ch in last and last[ch] &gt;= l: l = last[ch] + 1</code>。'abba' 测试的就是 <code>&gt;= l</code> 这个条件。"],
      solution: String.raw`def length_of_longest(s):
    last = {}
    l = best = 0
    for r, ch in enumerate(s):
        if ch in last and last[ch] >= l:
            l = last[ch] + 1
        last[ch] = r
        best = max(best, r - l + 1)
    return best
`,
      cx: "O(n) time, O(min(n, alphabet)) space",
    },
    {
      id: "min-subarray-len", title: "Minimum Size Subarray Sum", diff: "Medium", tags: ["variable window"], short: "和 ≥ target 的最短子数组长度",
      en: "nums contains positive integers. Return the minimal length of a contiguous subarray whose sum is >= target, or 0 if none.",
      examples: "min_subarray_len(7, [2, 3, 1, 2, 4, 3]) -> 2   # [4, 3]",
      zh: "求最短：在收缩循环里更新答案。",
      starter: String.raw`def min_subarray_len(target, nums):
    pass
`,
      tests: [["min_subarray_len(7, [2, 3, 1, 2, 4, 3])", "2"], ["min_subarray_len(4, [1, 4, 4])", "1"], ["min_subarray_len(11, [1, 1, 1, 1, 1, 1, 1, 1])", "0"], ["min_subarray_len(15, [1, 2, 3, 4, 5])", "5"]],
      hints: ["<code>while window &gt;= target: best = min(best, r - l + 1); window -= nums[l]; l += 1</code>"],
      solution: String.raw`def min_subarray_len(target, nums):
    l = window = 0
    best = float("inf")
    for r, x in enumerate(nums):
        window += x
        while window >= target:
            best = min(best, r - l + 1)
            window -= nums[l]
            l += 1
    return 0 if best == float("inf") else best
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "char-replacement", title: "Longest Repeating Character Replacement", diff: "Medium", tags: ["variable window"], short: "最多替换 k 个字符后的最长同字母子串",
      en: "You may replace at most k characters of s (uppercase letters). Return the length of the longest substring containing a single repeated letter after the replacements.",
      examples: "character_replacement('AABABBA', 1) -> 4",
      zh: "窗口合法条件：窗口长度 - 窗口里出现最多的字母次数 ≤ k（需要替换的字符数）。",
      starter: String.raw`def character_replacement(s, k):
    pass
`,
      tests: [["character_replacement('ABAB', 2)", "4"], ["character_replacement('AABABBA', 1)", "4"], ["character_replacement('A', 0)", "1"], ["character_replacement('ABCDE', 1)", "2"]],
      hints: ["维护 <code>cnt</code> 和 <code>maxf</code>（窗口内最高频次）。<code>while (r - l + 1) - maxf &gt; k</code> 就收缩。maxf 不减小也不影响正确性。"],
      solution: String.raw`def character_replacement(s, k):
    cnt = {}
    l = maxf = best = 0
    for r, ch in enumerate(s):
        cnt[ch] = cnt.get(ch, 0) + 1
        maxf = max(maxf, cnt[ch])
        while (r - l + 1) - maxf > k:
            cnt[s[l]] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best
`,
      cx: "O(n) time, O(26) space",
    },
  ],
});

window.CHAPTERS.push({
  id: "stack", order: 15, num: "07", group: "算法专题 Algorithms", title: "栈与队列", en: "Stack & queue",
  concept: String.raw`
<h2>1. 栈 Stack：后进先出 LIFO</h2>
<p>只在一端（栈顶）进出。Python 用 list：<code>st.append(x)</code> 入栈，<code>st.pop()</code> 出栈，<code>st[-1]</code> 看栈顶，都是 O(1)。</p>
<p>典型用途：括号匹配、撤销操作、表达式求值、DFS（递归本质就是系统帮你维护的栈）、<b>单调栈</b>（找下一个更大/更小元素）。</p>
<div class="note"><b class="lbl">别和内存里的 stack 混淆</b>数据结构“栈”和 HR 第 5 题问的“栈内存 stack memory”是两个概念，但有关系：函数调用时，参数、返回地址、局部变量被压入调用栈，函数返回时弹出——正是 LIFO。递归太深会 stack overflow。</div>

<h2>2. 队列 Queue：先进先出 FIFO</h2>
<p>Python 用 <code>collections.deque</code>：<code>q.append(x)</code> 入队，<code>q.popleft()</code> 出队，都是 O(1)。<b>不要用 list.pop(0)</b>，它是 O(n)。</p>
<p>典型用途：BFS、任务调度、缓冲区（串口接收缓冲就是一个环形队列 ring buffer）。</p>

<h2>3. 单调栈模板</h2>
~~~py
def next_greater(nums):
    ans = [-1] * len(nums)
    st = []                         # 存下标，对应的值从栈底到栈顶递减
    for i, x in enumerate(nums):
        while st and nums[st[-1]] < x:
            ans[st.pop()] = x       # x 就是栈顶元素的“下一个更大元素”
        st.append(i)
    return ans
~~~

<h2>4. 环形缓冲区 Ring buffer（嵌入式常考）</h2>
~~~py
class RingBuffer:
    def __init__(self, cap):
        self.buf = [None] * cap
        self.head = self.tail = self.size = 0   # head 读，tail 写
    def put(self, x):
        if self.size == len(self.buf):
            return False                         # 满了：丢数据（串口丢字节的原因之一！）
        self.buf[self.tail] = x
        self.tail = (self.tail + 1) % len(self.buf)
        self.size += 1
        return True
    def get(self):
        if self.size == 0:
            return None
        x = self.buf[self.head]
        self.head = (self.head + 1) % len(self.buf)
        self.size -= 1
        return x
~~~
<div class="vocab"><div><b>LIFO / FIFO</b>后进先出 / 先进先出</div><div><b>push / pop / peek</b>入栈/出栈/看栈顶</div><div><b>enqueue / dequeue</b>入队/出队</div><div><b>monotonic stack</b>单调栈</div><div><b>ring buffer / circular buffer</b>环形缓冲</div><div><b>buffer overflow / overrun</b>缓冲区溢出</div></div>
`,
  anims: ["stack_parens", "mono_stack"],
  problems: [
    {
      id: "valid-parentheses", title: "Valid Parentheses", diff: "Easy", tags: ["stack"], short: "括号是否正确配对",
      en: "s contains only the characters ()[]{}. Return True if every bracket is closed by the same type in the correct order.",
      examples: "is_valid('()[]{}') -> True\nis_valid('(]') -> False\nis_valid('([)]') -> False",
      zh: "左括号入栈；右括号时栈顶必须是对应的左括号。最后栈要空。",
      starter: String.raw`def is_valid(s):
    pass
`,
      tests: [["is_valid('()[]{}')", "True"], ["is_valid('(]')", "False"], ["is_valid('([)]')", "False"], ["is_valid('{[]}')", "True"], ["is_valid('(')", "False"], ["is_valid(')')", "False"], ["is_valid('')", "True"]],
      hints: ["<code>pair = {')': '(', ']': '[', '}': '{'}</code>", "遇到右括号时先检查栈是否为空。"],
      solution: String.raw`def is_valid(s):
    pair = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in pair:
            if not st or st[-1] != pair[ch]:
                return False
            st.pop()
        else:
            st.append(ch)
    return not st
`,
      cx: "O(n) time, O(n) space",
    },
    {
      id: "queue-two-stacks", title: "Implement Queue Using Two Stacks", diff: "Easy", tags: ["design"], short: "用两个栈实现队列",
      en: "Implement class MyQueue with push(x), pop() (removes and returns the front), peek() and empty(), using only stack operations (append / pop on lists).",
      examples: "q = MyQueue(); q.push(1); q.push(2); q.peek() -> 1; q.pop() -> 1; q.empty() -> False",
      zh: "in_stack 负责入队；出队时如果 out_stack 为空，就把 in_stack 全部倒过去（顺序反转）。每个元素最多搬一次，均摊 O(1)。",
      starter: String.raw`class MyQueue:
    def __init__(self):
        pass

    def push(self, x):
        pass

    def pop(self):
        pass

    def peek(self):
        pass

    def empty(self):
        pass
`,
      tests: [["run_ops(MyQueue, ['MyQueue','push','push','peek','pop','empty'], [[],[1],[2],[],[],[]])", "[None, None, None, 1, 1, False]"], ["run_ops(MyQueue, ['MyQueue','push','pop','empty','push','push','pop','pop'], [[],[5],[],[],[6],[7],[],[]])", "[None, None, 5, True, None, None, 6, 7]"]],
      hints: ["写一个 helper <code>_move()</code>：<code>if not self.out: while self.inn: self.out.append(self.inn.pop())</code>"],
      solution: String.raw`class MyQueue:
    def __init__(self):
        self.inn = []
        self.out = []

    def push(self, x):
        self.inn.append(x)

    def _move(self):
        if not self.out:
            while self.inn:
                self.out.append(self.inn.pop())

    def pop(self):
        self._move()
        return self.out.pop()

    def peek(self):
        self._move()
        return self.out[-1]

    def empty(self):
        return not self.inn and not self.out
`,
      cx: "amortized O(1) per operation",
    },
    {
      id: "min-stack", title: "Min Stack", diff: "Medium", tags: ["design"], short: "O(1) 获取最小值的栈",
      en: "Design class MinStack with push(x), pop(), top() and get_min(), all in O(1).",
      examples: "push(-2), push(0), push(-3), get_min() -> -3, pop(), top() -> 0, get_min() -> -2",
      zh: "每个位置额外存“到这里为止的最小值”。",
      starter: String.raw`class MinStack:
    def __init__(self):
        pass

    def push(self, x):
        pass

    def pop(self):
        pass

    def top(self):
        pass

    def get_min(self):
        pass
`,
      tests: [["run_ops(MinStack, ['MinStack','push','push','push','get_min','pop','top','get_min'], [[],[-2],[0],[-3],[],[],[],[]])", "[None, None, None, None, -3, None, 0, -2]"], ["run_ops(MinStack, ['MinStack','push','push','get_min','pop','get_min'], [[],[1],[1],[],[],[]])", "[None, None, None, 1, None, 1]"]],
      hints: ["栈里存元组 <code>(x, current_min)</code>。"],
      solution: String.raw`class MinStack:
    def __init__(self):
        self.st = []                 # (value, min so far)

    def push(self, x):
        m = min(x, self.st[-1][1]) if self.st else x
        self.st.append((x, m))

    def pop(self):
        self.st.pop()

    def top(self):
        return self.st[-1][0]

    def get_min(self):
        return self.st[-1][1]
`,
      cx: "O(1) per operation, O(n) space",
    },
    {
      id: "daily-temperatures", title: "Daily Temperatures", diff: "Medium", tags: ["monotonic stack"], short: "要等几天才有更高温度（看动画）",
      en: "For each day, return how many days you have to wait until a warmer temperature. If there is none, put 0.",
      examples: "daily_temperatures([73,74,75,71,69,72,76,73]) -> [1,1,4,2,1,1,0,0]",
      zh: "单调递减栈存下标。",
      starter: String.raw`def daily_temperatures(t):
    pass
`,
      tests: [["daily_temperatures([73,74,75,71,69,72,76,73])", "[1,1,4,2,1,1,0,0]"], ["daily_temperatures([30,40,50,60])", "[1,1,1,0]"], ["daily_temperatures([30,60,90])", "[1,1,0]"], ["daily_temperatures([50])", "[0]"]],
      hints: ["看知识点里的单调栈模板，把 <code>ans[j] = x</code> 改成 <code>ans[j] = i - j</code>。"],
      solution: String.raw`def daily_temperatures(t):
    ans = [0] * len(t)
    st = []
    for i, x in enumerate(t):
        while st and t[st[-1]] < x:
            j = st.pop()
            ans[j] = i - j
        st.append(i)
    return ans
`,
      cx: "O(n) time — each index is pushed and popped once",
    },
    {
      id: "eval-rpn", title: "Evaluate Reverse Polish Notation", diff: "Medium", tags: ["stack"], short: "后缀表达式求值",
      en: "Evaluate an arithmetic expression in Reverse Polish Notation. Tokens are integers or + - * /. Division truncates toward zero.",
      examples: "eval_rpn(['2', '1', '+', '3', '*']) -> 9     # (2 + 1) * 3",
      zh: "数字入栈；遇到运算符弹出两个数（注意顺序：先弹出的是右操作数）。Python 的 // 向下取整，-7 // 2 = -4；题目要求向零截断，用 int(a / b)。",
      starter: String.raw`def eval_rpn(tokens):
    pass
`,
      tests: [["eval_rpn(['2', '1', '+', '3', '*'])", "9"], ["eval_rpn(['4', '13', '5', '/', '+'])", "6"], ["eval_rpn(['10','6','9','3','+','-11','*','/','*','17','+','5','+'])", "22"], ["eval_rpn(['7', '-2', '/'])", "-3"]],
      hints: ["<code>b = st.pop(); a = st.pop()</code>"],
      solution: String.raw`def eval_rpn(tokens):
    st = []
    for tok in tokens:
        if tok in ("+", "-", "*", "/"):
            b = st.pop()
            a = st.pop()
            if tok == "+":
                st.append(a + b)
            elif tok == "-":
                st.append(a - b)
            elif tok == "*":
                st.append(a * b)
            else:
                st.append(int(a / b))     # truncate toward zero, like C
        else:
            st.append(int(tok))
    return st[-1]
`,
      explain: "C 的整数除法向零截断（-7/2 == -3），Python 的 // 向下取整（-7//2 == -4）。翻译 C 代码时这是常见差异。", cx: "O(n)",
    },
  ],
});
