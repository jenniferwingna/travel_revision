// Chapters: Arrays & two pointers, Strings.
window.CHAPTERS.push({
  id: "arrays", order: 11, num: "03", group: "算法专题 Algorithms", title: "数组与双指针", en: "Arrays & two pointers",
  concept: String.raw`
<h2>1. 数组基础</h2>
<p>数组是一段<b>连续内存</b>：按下标访问 O(1)；在中间插入/删除要移动后面的元素，O(n)。Python 的 list 就是动态数组，末尾 append 均摊 O(1)。</p>

<h2>2. 双指针的三种形态</h2>
<div class="tblwrap"><table>
<tr><th>形态</th><th>怎么动</th><th>典型题</th></tr>
<tr><td>对撞指针 opposite ends</td><td>L 从左、R 从右，向中间靠拢</td><td>有序数组两数之和、反转数组、回文、盛水最多的容器</td></tr>
<tr><td>读写指针 read / write</td><td>read 扫描所有元素，write 只在保留元素时前进</td><td>原地去重、移动零、删除元素</td></tr>
<tr><td>快慢指针 fast / slow</td><td>一个走 1 步，一个走 2 步</td><td>链表中点、判环（见链表章）</td></tr>
</table></div>
<p>识别信号：<b>“有序数组”</b>、<b>“原地 in-place / O(1) 额外空间”</b>、<b>“成对 / 两端”</b>。</p>

<h3>对撞指针模板</h3>
~~~py
def two_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target:
            return [l, r]
        if s < target:
            l += 1          # 需要更大的和
        else:
            r -= 1          # 需要更小的和
    return []
~~~

<h3>读写指针模板</h3>
~~~py
def remove_value(nums, val):
    w = 0                       # 下一个要写入的位置
    for r in range(len(nums)):  # r 读遍所有元素
        if nums[r] != val:
            nums[w] = nums[r]
            w += 1
    return w                    # 前 w 个是保留的结果
~~~

<h2>3. 前缀和 Prefix sum</h2>
<p><code>prefix[i] = nums[0] + ... + nums[i-1]</code>，则区间和 <code>sum(nums[l..r]) = prefix[r+1] - prefix[l]</code>，查询 O(1)。</p>
~~~py
prefix = [0]
for x in nums:
    prefix.append(prefix[-1] + x)
~~~

<div class="note warn"><b class="lbl">常见 bug</b>下标越界（<code>range(len(a))</code> 和 <code>a[i+1]</code> 一起用时）、<code>while l &lt; r</code> 和 <code>l &lt;= r</code> 搞混、边遍历边删除列表元素。HR 第 6 题“给一段程序找 bug，只改一两句”最常见的就是这类 off-by-one。</div>

<div class="vocab">
<div><b>two pointers</b>双指针</div><div><b>in place, O(1) extra space</b>原地</div>
<div><b>prefix sum</b>前缀和</div><div><b>sorted in ascending order</b>升序</div>
<div><b>"The left pointer moves right when the sum is too small."</b></div>
</div>
`,
  anims: ["two_pointers"],
  problems: [
    {
      id: "reverse-array", title: "Reverse Array In Place", diff: "Easy", tags: ["two pointers"], short: "原地反转，不用 [::-1]",
      en: "Reverse the list in place (modify the input, return nothing). Do not use slicing or reverse().",
      examples: "a = [1, 2, 3, 4]; reverse_array(a); a == [4, 3, 2, 1]",
      zh: "对撞指针交换。",
      starter: String.raw`def reverse_array(nums):
    pass
`,
      tests: [["inplace(reverse_array, [1, 2, 3, 4])", "[4, 3, 2, 1]"], ["inplace(reverse_array, [1, 2, 3])", "[3, 2, 1]"], ["inplace(reverse_array, [])", "[]"], ["inplace(reverse_array, [9])", "[9]"]],
      hints: ["<code>nums[l], nums[r] = nums[r], nums[l]</code>"],
      solution: String.raw`def reverse_array(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        nums[l], nums[r] = nums[r], nums[l]
        l += 1
        r -= 1
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "two-sum-sorted", title: "Two Sum II (sorted input)", diff: "Easy", tags: ["two pointers"], short: "有序数组中找和为 target 的两个下标",
      en: "nums is sorted in ascending order. Return the 0-based indices [i, j] (i < j) of the two numbers that add up to target. Exactly one solution exists. Use O(1) extra space.",
      examples: "two_sum_sorted([2, 7, 11, 15], 9) -> [0, 1]",
      zh: "看动画「对撞双指针」。",
      starter: String.raw`def two_sum_sorted(nums, target):
    pass
`,
      tests: [["two_sum_sorted([2, 7, 11, 15], 9)", "[0, 1]"], ["two_sum_sorted([2, 3, 4], 6)", "[0, 2]"], ["two_sum_sorted([-1, 0], -1)", "[0, 1]"], ["two_sum_sorted([1, 3, 4, 6, 8, 11, 15], 26)", "[5, 6]"]],
      hints: ["和太小 → l += 1；和太大 → r -= 1。"],
      solution: String.raw`def two_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target:
            return [l, r]
        if s < target:
            l += 1
        else:
            r -= 1
    return []
`,
      explain: "为什么不会漏解：当 nums[l] + nums[r] &lt; target 时，nums[l] 和当前最大的数相加都不够，那它和任何数都不行，可以安全丢弃。", cx: "O(n) time, O(1) space",
    },
    {
      id: "remove-duplicates", title: "Remove Duplicates from Sorted Array", diff: "Easy", tags: ["read/write pointers"], short: "原地去重，返回新长度 k",
      en: "nums is sorted. Remove duplicates in place so each value appears once, keeping the relative order. Return k, the number of unique values; the first k elements of nums must hold them.",
      examples: "nums = [0,0,1,1,1,2,2,3,3,4]  ->  k = 5, nums[:5] == [0,1,2,3,4]",
      zh: "读写指针：write 指向下一个要写的位置，只有遇到新值才写。",
      starter: String.raw`def remove_duplicates(nums):
    pass
`,
      tests: [["(lambda a: (lambda k: (k, a[:k]))(remove_duplicates(a)))([0,0,1,1,1,2,2,3,3,4])", "(5, [0, 1, 2, 3, 4])"], ["(lambda a: (lambda k: (k, a[:k]))(remove_duplicates(a)))([1, 1, 2])", "(2, [1, 2])"], ["remove_duplicates([])", "0"], ["remove_duplicates([7])", "1"]],
      hints: ["<code>w = 1</code>；从 i = 1 开始，若 <code>nums[i] != nums[w-1]</code> 就写入。"],
      solution: String.raw`def remove_duplicates(nums):
    if not nums:
        return 0
    w = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[w - 1]:
            nums[w] = nums[i]
            w += 1
    return w
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "move-zeroes", title: "Move Zeroes", diff: "Easy", tags: ["read/write pointers"], short: "把 0 移到末尾，保持其它元素顺序",
      en: "Move all 0s to the end of the list in place while keeping the relative order of the non-zero elements.",
      examples: "[0, 1, 0, 3, 12]  ->  [1, 3, 12, 0, 0]",
      zh: "先把非零元素依次写到前面，剩下的位置填 0；或者遇到非零就和 write 位置交换。",
      starter: String.raw`def move_zeroes(nums):
    pass
`,
      tests: [["inplace(move_zeroes, [0, 1, 0, 3, 12])", "[1, 3, 12, 0, 0]"], ["inplace(move_zeroes, [0])", "[0]"], ["inplace(move_zeroes, [1, 2])", "[1, 2]"], ["inplace(move_zeroes, [0, 0, 1])", "[1, 0, 0]"]],
      hints: ["<code>if nums[r] != 0: nums[w], nums[r] = nums[r], nums[w]; w += 1</code>"],
      solution: String.raw`def move_zeroes(nums):
    w = 0
    for r in range(len(nums)):
        if nums[r] != 0:
            nums[w], nums[r] = nums[r], nums[w]
            w += 1
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "merge-sorted", title: "Merge Two Sorted Lists (arrays)", diff: "Easy", tags: ["two pointers"], short: "合并两个有序数组",
      en: "Given two sorted lists a and b, return a new sorted list containing all elements of both. Do not call sort().",
      examples: "merge_sorted([1, 3, 5], [2, 4]) -> [1, 2, 3, 4, 5]",
      zh: "两个指针各指一个数组，每次取较小的。这也是归并排序的核心步骤。",
      starter: String.raw`def merge_sorted(a, b):
    pass
`,
      tests: [["merge_sorted([1, 3, 5], [2, 4])", "[1, 2, 3, 4, 5]"], ["merge_sorted([], [1])", "[1]"], ["merge_sorted([1, 1], [1])", "[1, 1, 1]"], ["merge_sorted([], [])", "[]"], ["merge_sorted([5, 6], [1, 2])", "[1, 2, 5, 6]"]],
      hints: ["循环结束后别忘了把剩下的一段接上：<code>out.extend(a[i:])</code>。"],
      solution: String.raw`def merge_sorted(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out
`,
      cx: "O(m + n) time and space",
    },
    {
      id: "pivot-index", title: "Pivot Index", diff: "Easy", tags: ["prefix sum"], short: "左边元素和 = 右边元素和的位置",
      en: "Return the leftmost index i where the sum of elements strictly to the left equals the sum strictly to the right. Return -1 if none.",
      examples: "pivot_index([1, 7, 3, 6, 5, 6]) -> 3     # 1+7+3 == 5+6",
      zh: "先求总和 total；遍历时维护左边和 left，右边和 = total - left - nums[i]。",
      starter: String.raw`def pivot_index(nums):
    pass
`,
      tests: [["pivot_index([1, 7, 3, 6, 5, 6])", "3"], ["pivot_index([1, 2, 3])", "-1"], ["pivot_index([2, 1, -1])", "0"], ["pivot_index([0])", "0"]],
      hints: ["<code>if left == total - left - x: return i</code>"],
      solution: String.raw`def pivot_index(nums):
    total = sum(nums)
    left = 0
    for i, x in enumerate(nums):
        if left == total - left - x:
            return i
        left += x
    return -1
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "max-area", title: "Container With Most Water", diff: "Medium", tags: ["two pointers"], short: "两条竖线围成的最大面积",
      en: "height[i] is the height of a vertical line at x = i. Choose two lines that, together with the x-axis, hold the most water. Return the maximum area.",
      examples: "max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) -> 49",
      zh: "面积 = min(h[l], h[r]) × (r - l)。每次移动较矮的那一边：移动较高的一边只会让宽度变小、高度不会变大。",
      starter: String.raw`def max_area(height):
    pass
`,
      tests: [["max_area([1, 8, 6, 2, 5, 4, 8, 3, 7])", "49"], ["max_area([1, 1])", "1"], ["max_area([4, 3, 2, 1, 4])", "16"], ["max_area([1, 2, 1])", "2"]],
      hints: ["<code>if height[l] &lt; height[r]: l += 1 else: r -= 1</code>"],
      solution: String.raw`def max_area(height):
    l, r = 0, len(height) - 1
    best = 0
    while l < r:
        best = max(best, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "three-sum", title: "3Sum", diff: "Medium", tags: ["sort", "two pointers"], short: "所有和为 0 的三元组，不能重复",
      en: "Return all unique triplets [a, b, c] from nums such that a + b + c == 0. The order of triplets does not matter.",
      examples: "three_sum([-1, 0, 1, 2, -1, -4]) -> [[-1, -1, 2], [-1, 0, 1]]",
      zh: "先排序。固定第一个数 i，在 i 右边用对撞指针找两数之和 = -nums[i]。跳过重复值避免重复三元组。",
      starter: String.raw`def three_sum(nums):
    pass
`,
      tests: [["three_sum([-1, 0, 1, 2, -1, -4])", "[[-1, -1, 2], [-1, 0, 1]]", "nested"], ["three_sum([0, 1, 1])", "[]", "nested"], ["three_sum([0, 0, 0, 0])", "[[0, 0, 0]]", "nested"], ["three_sum([-2, 0, 1, 1, 2])", "[[-2, 0, 2], [-2, 1, 1]]", "nested"]],
      hints: ["<code>if i &gt; 0 and nums[i] == nums[i-1]: continue</code>", "找到一组后，l 和 r 都要跳过相同的值。"],
      solution: String.raw`def three_sum(nums):
    nums.sort()
    res = []
    n = len(nums)
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, n - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                l += 1
                r -= 1
                while l < r and nums[l] == nums[l - 1]:
                    l += 1
                while l < r and nums[r] == nums[r + 1]:
                    r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
    return res
`,
      cx: "O(n²) time, O(1) extra space (besides output)",
    },
    {
      id: "product-except-self", title: "Product of Array Except Self", diff: "Medium", tags: ["prefix"], short: "不用除法，求除自己外其它元素的乘积",
      en: "Return a list ans where ans[i] is the product of all elements except nums[i]. Do it in O(n) without division.",
      examples: "product_except_self([1, 2, 3, 4]) -> [24, 12, 8, 6]",
      zh: "ans[i] = 左边所有数的乘积 × 右边所有数的乘积。两次遍历：先从左算前缀积，再从右乘上后缀积。",
      starter: String.raw`def product_except_self(nums):
    pass
`,
      tests: [["product_except_self([1, 2, 3, 4])", "[24, 12, 8, 6]"], ["product_except_self([-1, 1, 0, -3, 3])", "[0, 0, 9, 0, 0]"], ["product_except_self([2, 3])", "[3, 2]"]],
      hints: ["第一遍：<code>ans[i] = prefix; prefix *= nums[i]</code>；第二遍从右往左同理乘 suffix。"],
      solution: String.raw`def product_except_self(nums):
    n = len(nums)
    ans = [1] * n
    prefix = 1
    for i in range(n):
        ans[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        ans[i] *= suffix
        suffix *= nums[i]
    return ans
`,
      cx: "O(n) time, O(1) extra space (output excluded)",
    },
    {
      id: "rotate-array", title: "Rotate Array", diff: "Medium", tags: ["reverse trick"], short: "原地向右轮转 k 步（三次反转）",
      en: "Rotate the list to the right by k steps, in place.",
      examples: "[1,2,3,4,5,6,7], k = 3  ->  [5,6,7,1,2,3,4]",
      zh: "和 HR 的“反转单词”是同一个技巧：整体反转，再分别反转前 k 个和后 n-k 个。注意 k 可能大于 n，先 k %= n。",
      starter: String.raw`def rotate(nums, k):
    pass
`,
      tests: [["inplace(rotate, [1, 2, 3, 4, 5, 6, 7], 3)", "[5, 6, 7, 1, 2, 3, 4]"], ["inplace(rotate, [-1, -100, 3, 99], 2)", "[3, 99, -1, -100]"], ["inplace(rotate, [1, 2], 5)", "[2, 1]"], ["inplace(rotate, [1], 0)", "[1]"]],
      hints: ["写一个 helper <code>rev(l, r)</code>。"],
      solution: String.raw`def rotate(nums, k):
    n = len(nums)
    k %= n

    def rev(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1

    rev(0, n - 1)
    rev(0, k - 1)
    rev(k, n - 1)
`,
      explain: "<code>nums[:] = nums[-k:] + nums[:-k]</code> 也行，但用了 O(n) 额外空间。", cx: "O(n) time, O(1) space",
    },
  ],
});

window.CHAPTERS.push({
  id: "strings", order: 12, num: "04", group: "算法专题 Algorithms", title: "字符串", en: "Strings",
  blurb: "HR 题：反转单词、数单词",
  concept: String.raw`
<h2>1. Python 字符串 vs C 字符串</h2>
<div class="tblwrap"><table>
<tr><th></th><th>Python <code>str</code></th><th>C <code>char[]</code> / <code>char*</code></th></tr>
<tr><td>可变？</td><td>不可变 immutable，每次“修改”都生成新串</td><td>数组可改；字符串字面量 <code>char *s = "..."</code> 不可改（改了是未定义行为）</td></tr>
<tr><td>长度</td><td><code>len(s)</code> O(1)</td><td>以 <code>'\0'</code> 结尾，<code>strlen</code> 要扫一遍 O(n)</td></tr>
<tr><td>原地修改</td><td>先 <code>list(s)</code>，改完 <code>"".join</code></td><td>直接改数组元素</td></tr>
</table></div>
<div class="note warn"><b class="lbl">HR 第 8 题的陷阱</b><code>char *sentence = "the sky is ..."</code> 指向只读的字符串常量。如果你在 C 里写原地修改（比如 strtok 或反转），会崩溃。要先拷贝到 <code>char buf[] = "..."</code>。</div>

<h2>2. 常用操作</h2>
~~~py
s.split()            # 'a  b c '.split() -> ['a', 'b', 'c']   任意空白，去掉空串
s.split(" ")         # 'a  b'.split(' ') -> ['a', '', 'b']    注意空串！
" ".join(reversed(words))
s[::-1]              # 反转
s.lower(), c.isalnum(), c.isalpha(), c.isdigit()
ord(c) - ord("a")    # 字母 -> 0..25，常用来开长度 26 的计数数组
~~~

<h2>3. 常见题型</h2>
<ul>
<li><b>反转类</b>：对撞指针。“反转单词顺序”= 整体反转 + 每个单词再反转（见动画）。</li>
<li><b>回文</b>：两端往中间比较；最长回文子串用“中心扩展”。</li>
<li><b>计数类</b>：异位词（anagram）、第一个不重复字符 → 计数数组 / Counter。</li>
<li><b>解析类</b>：atoi、单词统计 → 一个字符一个字符地扫描，想清楚状态（在单词里 / 在空格里）。</li>
</ul>

<h3>不用 split，手动数单词（C 风格思路）</h3>
~~~py
def count_words(s):
    count, in_word = 0, False
    for ch in s:
        if ch != " " and not in_word:   # 从空格进入单词的那一刻 +1
            count += 1
            in_word = True
        elif ch == " ":
            in_word = False
    return count
~~~

<div class="vocab">
<div><b>immutable</b>不可变</div><div><b>null terminator '\0'</b>字符串结束符</div>
<div><b>palindrome</b>回文</div><div><b>anagram</b>字母异位词</div>
<div><b>substring / subsequence</b>子串（连续）/ 子序列（可不连续）</div><div><b>whitespace</b>空白字符</div>
</div>
`,
  anims: ["reverse_words"],
  problems: [
    {
      id: "reverse-string", title: "Reverse a String", diff: "Easy", tags: ["two pointers"], short: "不用 [::-1] 反转字符串",
      en: "Return the reversed string. Do not use slicing [::-1] or reversed().",
      examples: "reverse_string('hello') -> 'olleh'",
      zh: "字符串不可变，先转 list，对撞交换，再 join。",
      starter: String.raw`def reverse_string(s):
    pass
`,
      tests: [["reverse_string('hello')", "'olleh'"], ["reverse_string('')", "''"], ["reverse_string('a')", "'a'"], ["reverse_string('ab cd')", "'dc ba'"]],
      hints: ["<code>chars = list(s)</code>"],
      solution: String.raw`def reverse_string(s):
    chars = list(s)
    l, r = 0, len(chars) - 1
    while l < r:
        chars[l], chars[r] = chars[r], chars[l]
        l += 1
        r -= 1
    return "".join(chars)
`,
      cx: "O(n) time, O(n) space (strings are immutable)",
    },
    {
      id: "reverse-words", title: "Reverse Words (HR ref Q2)", diff: "Easy", tags: ["HR 真题"], short: "\"I love China\" → \"China love I\"",
      en: "Reverse the order of the words in the string. Words are separated by one or more spaces. The result should have single spaces and no leading/trailing spaces.",
      examples: "reverse_words('I love China')       -> 'China love I'\nreverse_words('  hello   world  ')  -> 'world hello'",
      zh: "Python 一行即可；面试官可能追问“不用 split 怎么做 / C 怎么原地做”，答案见本章最后一题。",
      starter: String.raw`def reverse_words(s):
    pass
`,
      tests: [["reverse_words('I love China')", "'China love I'"], ["reverse_words('  hello   world  ')", "'world hello'"], ["reverse_words('single')", "'single'"], ["reverse_words('')", "''"], ["reverse_words('the sky is blue')", "'blue is sky the'"]],
      hints: ["<code>s.split()</code> 不带参数会自动处理多个空格。"],
      solution: String.raw`def reverse_words(s):
    return " ".join(s.split()[::-1])
`,
      explain: "用 <code>s.split(' ')</code> 会在连续空格处产生空字符串，是常见 bug。", cx: "O(n) time, O(n) space",
    },
    {
      id: "count-words", title: "Count Words (HR Q8.1)", diff: "Easy", tags: ["HR 真题"], short: "句子里有多少个单词——不许用 split",
      en: "Return the number of words in s. A word is a maximal run of non-space characters. Do NOT use split(); scan character by character (this is how you would do it in C).",
      examples: "count_words('the sky is blue and the sun is yellow') -> 9\ncount_words('   ') -> 0",
      zh: "记录状态 in_word：从空格进入单词时计数 +1。",
      starter: String.raw`def count_words(s):
    pass
`,
      tests: [["count_words('the sky is blue and the sun is yellow')", "9"], ["count_words('')", "0"], ["count_words('   ')", "0"], ["count_words('  a  b ')", "2"], ["count_words('hello')", "1"]],
      hints: ["看本章知识点里的模板。"],
      solution: String.raw`def count_words(s):
    count = 0
    in_word = False
    for ch in s:
        if ch != " ":
            if not in_word:
                count += 1
                in_word = True
        else:
            in_word = False
    return count
`,
      explain: "C 版本：<code>for (p = s; *p; p++) { if (*p != ' ' &amp;&amp; (p == s || p[-1] == ' ')) count++; }</code>", cx: "O(n) time, O(1) space",
      sayCx: "I scan the string once and keep a flag for whether I'm inside a word, so it's O(n) time and constant space.",
    },
    {
      id: "is-palindrome", title: "Valid Palindrome", diff: "Easy", tags: ["two pointers"], short: "只看字母数字、忽略大小写的回文判断",
      en: "Return True if s is a palindrome after converting to lowercase and removing all non-alphanumeric characters.",
      examples: "is_palindrome('A man, a plan, a canal: Panama') -> True\nis_palindrome('race a car') -> False",
      zh: "对撞指针，跳过非字母数字的字符。",
      starter: String.raw`def is_palindrome(s):
    pass
`,
      tests: [["is_palindrome('A man, a plan, a canal: Panama')", "True"], ["is_palindrome('race a car')", "False"], ["is_palindrome(' ')", "True"], ["is_palindrome('0P')", "False"], ["is_palindrome('ab_a')", "True"]],
      hints: ["<code>while l &lt; r and not s[l].isalnum(): l += 1</code>"],
      solution: String.raw`def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "is-anagram", title: "Valid Anagram", diff: "Easy", tags: ["counting"], short: "两个字符串是否字母异位词",
      en: "Return True if t is an anagram of s (same letters with the same counts).",
      examples: "is_anagram('anagram', 'nagaram') -> True\nis_anagram('rat', 'car') -> False",
      zh: "计数比较。Counter(s) == Counter(t)，或者长度 26 的数组。",
      starter: String.raw`def is_anagram(s, t):
    pass
`,
      tests: [["is_anagram('anagram', 'nagaram')", "True"], ["is_anagram('rat', 'car')", "False"], ["is_anagram('a', 'ab')", "False"], ["is_anagram('', '')", "True"]],
      hints: ["长度不同直接 False。"],
      solution: String.raw`def is_anagram(s, t):
    if len(s) != len(t):
        return False
    count = {}
    for ch in s:
        count[ch] = count.get(ch, 0) + 1
    for ch in t:
        if count.get(ch, 0) == 0:
            return False
        count[ch] -= 1
    return True
`,
      explain: "排序比较 <code>sorted(s) == sorted(t)</code> 是 O(n log n)；计数是 O(n)。", cx: "O(n) time, O(1) space for a fixed alphabet",
    },
    {
      id: "lcp", title: "Longest Common Prefix", diff: "Easy", tags: ["scan"], short: "一组字符串的最长公共前缀",
      en: "Return the longest common prefix of a list of strings. Return '' if there is none.",
      examples: "longest_common_prefix(['flower', 'flow', 'flight']) -> 'fl'",
      zh: "以第一个字符串为基准，逐列比较；或者不断缩短 prefix 直到所有串都以它开头。",
      starter: String.raw`def longest_common_prefix(strs):
    pass
`,
      tests: [["longest_common_prefix(['flower', 'flow', 'flight'])", "'fl'"], ["longest_common_prefix(['dog', 'racecar', 'car'])", "''"], ["longest_common_prefix(['a'])", "'a'"], ["longest_common_prefix([])", "''"], ["longest_common_prefix(['ab', 'a'])", "'a'"]],
      hints: ["<code>for i, ch in enumerate(strs[0]): for s in strs[1:]: if i == len(s) or s[i] != ch: return strs[0][:i]</code>"],
      solution: String.raw`def longest_common_prefix(strs):
    if not strs:
        return ""
    first = strs[0]
    for i, ch in enumerate(first):
        for s in strs[1:]:
            if i == len(s) or s[i] != ch:
                return first[:i]
    return first
`,
      cx: "O(total characters)",
    },
    {
      id: "compress", title: "String Compression", diff: "Easy", tags: ["run-length"], short: "aabcccccaaa → a2b1c5a3",
      en: "Compress a string using counts of repeated characters (run-length encoding). If the compressed string is not shorter than the original, return the original.",
      examples: "compress('aabcccccaaa') -> 'a2b1c5a3'\ncompress('abc') -> 'abc'",
      zh: "扫描时统计当前字符连续出现的次数；字符变化时把“字符+次数”写出去。用 list 收集，最后 join。",
      starter: String.raw`def compress(s):
    pass
`,
      tests: [["compress('aabcccccaaa')", "'a2b1c5a3'"], ["compress('abc')", "'abc'"], ["compress('')", "''"], ["compress('aaaaaaaaaaaa')", "'a12'"], ["compress('aabb')", "'aabb'"]],
      hints: ["别忘了循环结束后写出最后一段。"],
      solution: String.raw`def compress(s):
    out = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]:
            j += 1
        out.append(s[i] + str(j - i))
        i = j
    res = "".join(out)
    return res if len(res) < len(s) else s
`,
      cx: "O(n) time",
    },
    {
      id: "reverse-words-inplace", title: "Reverse Words In Place (C style)", diff: "Medium", tags: ["HR 真题", "two pointers"], short: "在字符列表上原地反转单词顺序，O(1) 额外空间",
      en: "chars is a list of single characters forming words separated by single spaces (no leading/trailing spaces). Reverse the order of the words in place, using O(1) extra space. This is exactly what the C reference answer does.",
      examples: "list('I love China')  ->  list('China love I')",
      zh: "第一步整体反转，第二步逐个单词反转。看动画「原地反转单词顺序」。",
      starter: String.raw`def reverse_words_inplace(chars):
    def swap_range(l, r):
        # reverse chars[l..r] in place
        pass

    # step 1: reverse the whole list
    # step 2: reverse each word
`,
      tests: [["''.join(inplace(reverse_words_inplace, list('I love China')))", "'China love I'"], ["''.join(inplace(reverse_words_inplace, list('the sky is blue')))", "'blue is sky the'"], ["''.join(inplace(reverse_words_inplace, list('a')))", "'a'"], ["''.join(inplace(reverse_words_inplace, list('ab cd')))", "'cd ab'"]],
      hints: ["第二步：用 start 记录单词开头，遇到空格或末尾时 swap_range(start, i - 1)，然后 start = i + 1。"],
      solution: String.raw`def reverse_words_inplace(chars):
    def swap_range(l, r):
        while l < r:
            chars[l], chars[r] = chars[r], chars[l]
            l += 1
            r -= 1

    n = len(chars)
    swap_range(0, n - 1)
    start = 0
    for i in range(n + 1):
        if i == n or chars[i] == " ":
            swap_range(start, i - 1)
            start = i + 1
`,
      explain: "C 参考答案中的 swap 用了 XOR 交换：<code>*head ^= *tail; *tail ^= *head; *head++ ^= *tail--;</code>。注意 XOR 交换在 head == tail（同一地址）时会把值变成 0，所以必须 <code>head &lt; tail</code> 才交换——参考答案的 while 条件正好保证了这一点。现代代码直接用临时变量更清晰，编译器优化后一样快。",
      cx: "O(n) time, O(1) extra space",
    },
    {
      id: "longest-palindrome", title: "Longest Palindromic Substring", diff: "Medium", tags: ["expand around center"], short: "最长回文子串，中心扩展法",
      en: "Return the longest palindromic substring of s. (Test cases have a unique answer.)",
      examples: "longest_palindrome('cbbd') -> 'bb'",
      zh: "回文以中心对称。枚举 2n-1 个中心（单个字符或两个字符之间），向两边扩展。",
      starter: String.raw`def longest_palindrome(s):
    pass
`,
      tests: [["longest_palindrome('cbbd')", "'bb'"], ["longest_palindrome('a')", "'a'"], ["longest_palindrome('forgeeksskeegfor')", "'geeksskeeg'"], ["longest_palindrome('xabacdy')", "'aba'"], ["longest_palindrome('')", "''"]],
      hints: ["写 <code>expand(l, r)</code>：当 <code>s[l] == s[r]</code> 时 l -= 1, r += 1，返回 <code>s[l+1:r]</code>。", "对每个 i 调用 expand(i, i) 和 expand(i, i+1)。"],
      solution: String.raw`def longest_palindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l + 1:r]

    best = ""
    for i in range(len(s)):
        for cand in (expand(i, i), expand(i, i + 1)):
            if len(cand) > len(best):
                best = cand
    return best
`,
      cx: "O(n²) time, O(1) extra space",
    },
    {
      id: "atoi", title: "String to Integer (atoi)", diff: "Medium", tags: ["parsing"], short: "实现 atoi：空格、符号、非数字、32 位溢出",
      en: "Convert s to a 32-bit signed integer: skip leading spaces, read an optional '+' or '-', then read digits until a non-digit. If no digits, return 0. Clamp the result to [-2**31, 2**31 - 1].",
      examples: "my_atoi('   -42') -> -42\nmy_atoi('4193 with words') -> 4193\nmy_atoi('words 987') -> 0",
      zh: "这是考察“边界情况想得全不全”的经典题，和嵌入式解析串口数据很像。",
      starter: String.raw`def my_atoi(s):
    pass
`,
      tests: [["my_atoi('42')", "42"], ["my_atoi('   -42')", "-42"], ["my_atoi('4193 with words')", "4193"], ["my_atoi('words 987')", "0"], ["my_atoi('-91283472332')", "-2147483648"], ["my_atoi('91283472332')", "2147483647"], ["my_atoi('+')", "0"], ["my_atoi('')", "0"]],
      hints: ["<code>i</code> 作为扫描下标：跳空格 → 处理符号 → 累加数字 <code>num = num * 10 + int(s[i])</code>。"],
      solution: String.raw`def my_atoi(s):
    i, n = 0, len(s)
    while i < n and s[i] == " ":
        i += 1
    sign = 1
    if i < n and s[i] in "+-":
        if s[i] == "-":
            sign = -1
        i += 1
    num = 0
    while i < n and s[i].isdigit():
        num = num * 10 + (ord(s[i]) - ord("0"))
        i += 1
    num *= sign
    return max(-2**31, min(2**31 - 1, num))
`,
      explain: "C 里要在乘 10 之前判断是否会溢出（<code>num &gt; (INT_MAX - d) / 10</code>）；Python 整数不会溢出，最后 clamp 即可。", cx: "O(n)",
    },
  ],
});
