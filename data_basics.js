// Chapters: Python warm-up & Big-O, Bit manipulation.
window.CHAPTERS.push({
  id: "python", order: 1, num: "01", group: "起步 Warm-up", title: "Python 速查 + 复杂度", en: "Python toolkit & Big-O",
  blurb: "先把手感找回来",
  concept: String.raw`
<div class="note tip"><b class="lbl">本平台怎么用</b>每章按「知识点 → 动画演示 → 练习题」排列。练习题用浏览器里的真 Python 3 运行，测试全部通过就记为完成（进度只保存在你这台浏览器里）。题面是英文，因为面试会用英文交流；建议做题时也<b>用英文边写边说</b>（think aloud）。</div>

<h2>1. 面试做题的固定流程</h2>
<p>面试官看重的不只是答案，而是你的思考过程。每道题都按这个顺序来：</p>
<ol>
<li><b>Clarify 澄清</b>：输入范围？能否为空？有没有负数/重复？返回什么？<br><i>"Can the input be empty? Are there negative numbers? Should I return the index or the value?"</i></li>
<li><b>Example 举例</b>：自己举一个普通例子和一个边界例子。</li>
<li><b>Brute force first 先说暴力解</b>：说出复杂度，再说怎么优化。<br><i>"The brute force is O(n²). We can do better with a hash map."</i></li>
<li><b>Code 写代码</b>：变量名清楚，边写边讲。</li>
<li><b>Test 测试</b>：用例子手动走一遍，再测边界（空、一个元素、全相同、极大值）。</li>
<li><b>Complexity 复杂度</b>：<i>"This runs in O(n) time and O(n) extra space."</i></li>
</ol>

<h2>2. Python 刷题必备语法</h2>
~~~py
# list
a = [3, 1, 2]
a.append(4); a.pop(); a.pop(0)      # pop() 是 O(1)，pop(0) 是 O(n)
a.sort(); b = sorted(a, reverse=True)
a[::-1]          # 反转副本      a[1:3]  切片（左闭右开）
for i, x in enumerate(a): ...        # 同时拿下标和值
for x, y in zip(a, b): ...
grid = [[0] * cols for _ in range(rows)]   # 二维数组；不要写 [[0]*cols]*rows（同一行被复制引用）

# dict / set
d = {}; d[k] = d.get(k, 0) + 1
if k in d: ...                       # O(1) 平均
s = set(); s.add(x); x in s

# 字符串（不可变！）
s.split()        # 按任意空白切分，自动去掉多余空格
" ".join(words)
s.strip(), s.lower(), s.isalnum(), s.isdigit()
ord("a") == 97;  chr(97) == "a"
parts = []; parts.append(c); "".join(parts)   # 循环里拼字符串用 list + join

# 整数
7 // 2 == 3;  -7 // 2 == -4  (向下取整！)   7 % 3 == 1
float("inf"), float("-inf")
bin(10) == "0b1010";  int("1010", 2) == 10;  hex(255) == "0xff"

# 排序 key
people.sort(key=lambda p: (-p[1], p[0]))     # 按第 2 项降序，再按第 1 项升序
~~~

~~~py
from collections import Counter, defaultdict, deque
Counter("banana")            # Counter({'a': 3, 'n': 2, 'b': 1})
Counter(words).most_common(2)
g = defaultdict(list); g[u].append(v)
q = deque([start]); q.append(x); q.popleft()  # 队列，两端 O(1)

import heapq                  # 最小堆
heapq.heappush(h, x); heapq.heappop(h); heapq.nlargest(k, nums)

import bisect                 # 有序数组二分
bisect.bisect_left(a, x)      # 第一个 >= x 的位置
~~~

<h2>3. 复杂度 Big-O</h2>
<p>Big-O 描述的是输入规模 n 变大时，运行时间（或内存）<b>增长的速度</b>，忽略常数和低阶项。</p>
<div class="tblwrap"><table>
<tr><th>复杂度</th><th>名字</th><th>典型例子</th><th>n = 10⁶ 时大约</th></tr>
<tr><td>O(1)</td><td>constant</td><td>数组下标访问、dict 查找</td><td>1</td></tr>
<tr><td>O(log n)</td><td>logarithmic</td><td>二分查找、堆 push/pop</td><td>20</td></tr>
<tr><td>O(n)</td><td>linear</td><td>遍历一遍、统计词频</td><td>10⁶</td></tr>
<tr><td>O(n log n)</td><td>linearithmic</td><td>排序（归并、快排平均、Python sort）</td><td>2×10⁷</td></tr>
<tr><td>O(n²)</td><td>quadratic</td><td>双重循环、冒泡排序</td><td>10¹² ✗ 太慢</td></tr>
<tr><td>O(2ⁿ)</td><td>exponential</td><td>枚举所有子集</td><td>只能 n ≤ 25 左右</td></tr>
</table></div>
<h3>怎么分析</h3>
<ul>
<li>顺序执行：相加，取最大的那项。O(n) + O(n log n) = O(n log n)。</li>
<li>嵌套循环：相乘。外层 n 次 × 内层 n 次 = O(n²)。</li>
<li>每次把问题规模减半：O(log n)。</li>
<li>递归：调用次数 × 每次调用的工作量。</li>
<li>空间复杂度：额外开的数组/字典/递归栈深度。</li>
</ul>
<div class="tblwrap"><table>
<tr><th>Python 操作</th><th>时间</th></tr>
<tr><td><code>list.append / pop()</code>, <code>a[i]</code></td><td>O(1)</td></tr>
<tr><td><code>list.insert(0, x) / pop(0)</code>, <code>x in list</code></td><td>O(n)</td></tr>
<tr><td><code>x in set / dict</code>, <code>d[k] = v</code></td><td>O(1) 平均</td></tr>
<tr><td><code>sorted(a)</code></td><td>O(n log n)</td></tr>
<tr><td><code>s + t</code>（字符串拼接，要复制）</td><td>O(len(s)+len(t))</td></tr>
<tr><td><code>deque.popleft()</code>, <code>heappush</code></td><td>O(1), O(log n)</td></tr>
</table></div>
<div class="note warn"><b class="lbl">HR 题第 8 问</b>"order of complexity of this algorithm" —— 统计单词：遍历字符串一次 O(n)，字典每次操作 O(1)，总 O(n)；如果还要按出现次数排序输出，加上 O(k log k)，k 是不同单词数。</div>

<h2>4. 英文表达</h2>
<div class="vocab">
<div><b>time complexity</b>时间复杂度</div><div><b>space complexity</b>空间复杂度</div>
<div><b>edge case / corner case</b>边界情况</div><div><b>brute force</b>暴力解</div>
<div><b>trade-off</b>取舍（用空间换时间）</div><div><b>in place</b>原地，不开额外数组</div>
<div><b>iterate over</b>遍历</div><div><b>off-by-one error</b>差一错误</div>
<div><b>"Let me walk through an example."</b>我用一个例子走一遍</div>
<div><b>"It scales linearly with the input size."</b>随输入线性增长</div>
</div>
`,
  anims: [],
  problems: [
    {
      id: "fizzbuzz", title: "FizzBuzz", diff: "Easy", tags: ["warm-up"], short: "热身：循环 + 取模",
      en: "Return a list of strings for numbers 1..n: \"Fizz\" if divisible by 3, \"Buzz\" if divisible by 5, \"FizzBuzz\" if divisible by both, otherwise the number itself as a string.",
      examples: "fizzbuzz(5)  ->  ['1', '2', 'Fizz', '4', 'Buzz']",
      zh: "注意先判断「同时被 3 和 5 整除」。",
      starter: String.raw`def fizzbuzz(n):
    result = []
    # your code here
    return result
`,
      tests: [["fizzbuzz(5)", "['1', '2', 'Fizz', '4', 'Buzz']"], ["fizzbuzz(15)[-1]", "'FizzBuzz'"], ["fizzbuzz(1)", "['1']"], ["fizzbuzz(0)", "[]"], ["len(fizzbuzz(100))", "100"]],
      hints: ["用 <code>i % 15 == 0</code> 先判断。"],
      solution: String.raw`def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result
`,
      explain: "条件顺序很重要：如果先判断 % 3，15 会被输出成 Fizz。", cx: "O(n) time, O(n) space for the output",
    },
    {
      id: "find-max", title: "Find Maximum (no built-in max)", diff: "Easy", tags: ["warm-up"], short: "不用 max()，自己找最大值；空列表返回 None",
      en: "Return the largest number in the list without using max(). If the list is empty, return None.",
      examples: "find_max([3, -1, 9, 2])  ->  9\nfind_max([])  ->  None",
      zh: "边界：空列表、全是负数。初始值不要写 0（全负数时会错），用第一个元素。",
      starter: String.raw`def find_max(nums):
    pass
`,
      tests: [["find_max([3, -1, 9, 2])", "9"], ["find_max([-5, -2, -9])", "-2"], ["find_max([])", "None"], ["find_max([7])", "7"]],
      hints: ["<code>best = nums[0]</code>，然后从第二个开始比较。"],
      solution: String.raw`def find_max(nums):
    if not nums:
        return None
    best = nums[0]
    for x in nums[1:]:
        if x > best:
            best = x
    return best
`,
      explain: "常见 bug：<code>best = 0</code> 在全负数时返回 0。这类“初始化值”问题也是 HR 第 5 题（未初始化变量）的同类思想。", cx: "O(n) time, O(1) space",
    },
    {
      id: "second-largest", title: "Second Largest Distinct Number", diff: "Easy", tags: ["edge cases"], short: "第二大的不同数字，不存在返回 None",
      en: "Return the second largest DISTINCT value in the list. If it does not exist, return None. Try to do it in one pass.",
      examples: "second_largest([4, 1, 4, 3])  ->  3\nsecond_largest([5, 5])  ->  None",
      zh: "一次遍历维护 first 和 second 两个变量。重复的最大值不算第二大。",
      starter: String.raw`def second_largest(nums):
    pass
`,
      tests: [["second_largest([4, 1, 4, 3])", "3"], ["second_largest([5, 5])", "None"], ["second_largest([])", "None"], ["second_largest([1, 2])", "1"], ["second_largest([-3, -1, -2])", "-2"], ["second_largest([2, 9, 9, 7, 9])", "7"]],
      hints: ["<code>first = second = None</code>。遇到 x：若 x &gt; first，则 second = first, first = x；若 first &gt; x 且 (second is None 或 x &gt; second)，更新 second。"],
      solution: String.raw`def second_largest(nums):
    first = second = None
    for x in nums:
        if first is None or x > first:
            second = first
            first = x
        elif x != first and (second is None or x > second):
            second = x
    return second
`,
      explain: "简单写法 <code>sorted(set(nums))[-2]</code> 是 O(n log n)；一次遍历是 O(n)。面试时可以先说简单写法，再给优化版。", cx: "O(n) time, O(1) space",
    },
    {
      id: "is-prime", title: "Is Prime", diff: "Easy", tags: ["math"], short: "判断质数，只需试到 √n",
      en: "Return True if n is a prime number, otherwise False.",
      examples: "is_prime(7) -> True\nis_prime(1) -> False\nis_prime(9) -> False",
      zh: "如果 n 有因子 a×b，其中一个一定 ≤ √n，所以只要试到 √n。",
      starter: String.raw`def is_prime(n):
    pass
`,
      tests: [["is_prime(2)", "True"], ["is_prime(1)", "False"], ["is_prime(0)", "False"], ["is_prime(9)", "False"], ["is_prime(97)", "True"], ["is_prime(7919)", "True"], ["is_prime(1000000007)", "True"]],
      hints: ["<code>i = 2; while i * i &lt;= n</code>"],
      solution: String.raw`def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True
`,
      cx: "O(√n) time, O(1) space",
    },
    {
      id: "fib", title: "Fibonacci (iterative)", diff: "Easy", tags: ["loop"], short: "迭代算斐波那契，避免指数级递归",
      en: "Return the n-th Fibonacci number, where fib(0) = 0, fib(1) = 1. n can be up to 90, so a naive recursive solution is too slow.",
      examples: "fib(10) -> 55",
      zh: "朴素递归 fib(n-1)+fib(n-2) 是 O(2ⁿ)。用两个变量滚动即可 O(n)。",
      starter: String.raw`def fib(n):
    pass
`,
      tests: [["fib(0)", "0"], ["fib(1)", "1"], ["fib(10)", "55"], ["fib(50)", "12586269025"], ["fib(90)", "2880067194370816120"]],
      hints: ["<code>a, b = 0, 1</code>；循环 n 次 <code>a, b = b, a + b</code>。"],
      solution: String.raw`def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
`,
      explain: "这就是最简单的动态规划：只保留最近两个状态。", cx: "O(n) time, O(1) space",
    },
  ],
});

window.CHAPTERS.push({
  id: "bits", order: 10, num: "02", group: "算法专题 Algorithms", title: "位运算", en: "Bit manipulation",
  blurb: "HR 题 foo(n) 和 2 的幂都在这里",
  concept: String.raw`
<p>这家公司的题目明显偏底层（C、串口、字节）。位运算是他们最爱考的“看代码猜功能”题来源。</p>
<h2>1. 运算符</h2>
<div class="tblwrap"><table>
<tr><th>运算</th><th>含义</th><th>例子（二进制）</th></tr>
<tr><td><code>a &amp; b</code></td><td>AND：两位都是 1 才是 1</td><td>1100 &amp; 1010 = 1000</td></tr>
<tr><td><code>a | b</code></td><td>OR：有一个 1 就是 1</td><td>1100 | 1010 = 1110</td></tr>
<tr><td><code>a ^ b</code></td><td>XOR：不同为 1</td><td>1100 ^ 1010 = 0110</td></tr>
<tr><td><code>~a</code></td><td>NOT：按位取反</td><td>~0101 = 1010（8 位下）</td></tr>
<tr><td><code>a &lt;&lt; k</code></td><td>左移 = 乘 2ᵏ</td><td>0011 &lt;&lt; 2 = 1100</td></tr>
<tr><td><code>a &gt;&gt; k</code></td><td>右移 = 整除 2ᵏ</td><td>1100 &gt;&gt; 2 = 0011</td></tr>
</table></div>

<h2>2. 必背技巧</h2>
<div class="tblwrap"><table>
<tr><th>写法</th><th>作用</th></tr>
<tr><td><code>x &amp; 1</code></td><td>是否奇数（最低位）</td></tr>
<tr><td><code>(x &gt;&gt; k) &amp; 1</code></td><td>取第 k 位</td></tr>
<tr><td><code>x | (1 &lt;&lt; k)</code> / <code>x &amp; ~(1 &lt;&lt; k)</code> / <code>x ^ (1 &lt;&lt; k)</code></td><td>置 1 / 清 0 / 翻转第 k 位</td></tr>
<tr><td><code>x &amp; (x - 1)</code></td><td><b>去掉最低位的 1</b>（HR 题 foo 的核心）</td></tr>
<tr><td><code>x &amp; -x</code></td><td>只保留最低位的 1</td></tr>
<tr><td><code>x &amp; (x - 1) == 0</code></td><td>x 是 2 的幂（还要 x &gt; 0）</td></tr>
<tr><td><code>a ^ a = 0</code>, <code>a ^ 0 = a</code></td><td>成对的数异或抵消 → 找“只出现一次的数”</td></tr>
<tr><td><code>(x &gt;&gt; 8*i) &amp; 0xFF</code></td><td>取第 i 个字节</td></tr>
</table></div>

<h2>3. 补码 Two's complement（负数怎么存）</h2>
<p>32 位有符号整数中，<code>-x = ~x + 1</code>。所以 -1 是 32 个 1（0xFFFFFFFF），最高位是符号位。</p>
<ul>
<li>C 里 <code>int</code> 是固定 32 位；<code>unsigned int</code> 右移补 0，有符号负数右移通常补 1（算术右移，实现定义）。</li>
<li><b>Python 的整数没有位数上限</b>，负数相当于前面有无限个 1。所以把 C 代码翻译成 Python 时，遇到负数要手动 <code>x &amp; 0xFFFFFFFF</code> 截成 32 位，否则 <code>while n: n &amp;= n-1</code> 会死循环。</li>
</ul>

<h2>4. HR 真题拆解：foo(n)</h2>
~~~c
int foo(int n) {
    int c = 0;
    for (; n > 0; n = n & (n - 1), ++c);   // 循环体是空的，工作都在 for 的第三部分
    return c;
}
~~~
<ul>
<li><b>作用</b>：数 n 的二进制里有几个 1（population count / Hamming weight），这是 Brian Kernighan 算法。</li>
<li><b>复杂度</b>：循环次数 = 1 的个数，最多 32 次。</li>
<li><b>坑</b>：条件是 <code>n &gt; 0</code>，负数直接返回 0（-1 其实有 32 个 1）。修改方法：参数改成 <code>unsigned int</code>，条件改成 <code>n != 0</code>。</li>
<li><b>面试会让你写 main 测试</b>：选 0、1、2 的幂、全 1（255）、负数、最大值做测试用例：</li>
</ul>
~~~c
#include <stdio.h>
#include <assert.h>
int foo(unsigned int n) { int c = 0; for (; n != 0; n &= n - 1, ++c); return c; }
int main(void) {
    assert(foo(0) == 0);
    assert(foo(1) == 1);
    assert(foo(8) == 1);
    assert(foo(255) == 8);
    assert(foo(0xFFFFFFFFu) == 32);   // 原版 int + n > 0 这里会返回 0
    printf("all tests passed\n");
    return 0;
}
~~~

<h2>5. HR 题第 4 题：<code>return !(n &amp; n - 1) * n &gt; 0;</code></h2>
<p>关键是 C 的<b>运算符优先级</b>（从高到低）：一元 <code>!</code> → 乘法 <code>*</code> → 加减 <code>-</code> → 比较 <code>&gt;</code> → 相等 <code>==</code> → 按位 <code>&amp;</code>。<code>&amp;</code> 的优先级很低，但这里它在括号里。逐步看：</p>
<ol>
<li>括号内 <code>n &amp; n - 1</code>：减法优先，等于 <code>n &amp; (n-1)</code>。</li>
<li><code>!(...)</code>：是 2 的幂（或 0）时为 1，否则 0。</li>
<li><code>* n</code> 再 <code>&gt; 0</code>：排除 n = 0 和负数。</li>
</ol>
<p>结论：<b>判断 n 是否是 2 的幂</b>，是返回 1，否则 0。补全测试：</p>
~~~c
#include <stdio.h>
unsigned char foo(int n) { return !(n & n - 1) * n > 0; }
int main(void) {
    int t[] = {0, 1, 2, 3, 4, 6, 8, 1024, -8};
    for (int i = 0; i < 9; i++) printf("foo(%d) = %d\n", t[i], foo(t[i]));
    return 0;   /* 输出 0 1 1 0 1 0 1 1 0 */
}
~~~
<div class="note warn"><b class="lbl">C 优先级经典坑</b><code>if (x &amp; 1 == 0)</code> 实际是 <code>x &amp; (1 == 0)</code>，永远为 0！因为 <code>==</code> 比 <code>&amp;</code> 优先级高。位运算一律加括号。</div>

<h2>6. 英文表达</h2>
<div class="vocab">
<div><b>bitwise AND / OR / XOR</b>按位与/或/异或</div><div><b>set bit / clear bit</b>置位/清位</div>
<div><b>least significant bit (LSB)</b>最低位</div><div><b>most significant bit (MSB)</b>最高位</div>
<div><b>two's complement</b>补码</div><div><b>mask</b>掩码，如 0xFF</div>
<div><b>"It counts the number of set bits."</b></div><div><b>"n &amp; (n-1) clears the lowest set bit."</b></div>
</div>
`,
  anims: ["bits_popcount", "bits_pow2", "bits_bytes"],
  problems: [
    {
      id: "count-bits", title: "Count Set Bits (HR: foo)", diff: "Easy", tags: ["HR 真题"], short: "就是 HR 题 foo(n)：数二进制里 1 的个数",
      en: "Given a non-negative integer n, return the number of 1 bits in its binary representation. Use the n & (n - 1) trick.",
      examples: "count_bits(11)  ->  3      # 1011\ncount_bits(128) ->  1",
      zh: "把 HR 的 C 代码翻译成 Python。",
      starter: String.raw`def count_bits(n):
    c = 0
    # translate: for(; n > 0; n = n & (n - 1), ++c);
    return c
`,
      tests: [["count_bits(0)", "0"], ["count_bits(11)", "3"], ["count_bits(128)", "1"], ["count_bits(255)", "8"], ["count_bits(0x12345678)", "13"], ["count_bits(2**31 - 1)", "31"]],
      hints: ["<code>while n &gt; 0: n &amp;= n - 1; c += 1</code>"],
      solution: String.raw`def count_bits(n):
    c = 0
    while n > 0:
        n &= n - 1    # remove the lowest set bit
        c += 1
    return c
`,
      explain: "另一种写法是逐位检查 <code>c += n &amp; 1; n &gt;&gt;= 1</code>，循环次数是总位数；Kernighan 的写法循环次数只等于 1 的个数。Python 内置：<code>bin(n).count('1')</code> 或 3.10+ 的 <code>n.bit_count()</code>。",
      cx: "O(k) where k = number of set bits (≤ 32)", sayCx: "The loop runs once per set bit, so it's O(k), at most 32 iterations for a 32-bit integer.",
    },
    {
      id: "power-of-two", title: "Power of Two (HR Q4)", diff: "Easy", tags: ["HR 真题"], short: "HR 第 4 题 !(n & n-1) * n > 0 的 Python 版",
      en: "Return True if n is a power of two (1, 2, 4, 8, ...). n may be zero or negative.",
      examples: "is_power_of_two(16) -> True\nis_power_of_two(0)  -> False\nis_power_of_two(-8) -> False",
      zh: "一行即可。注意排除 0 和负数。",
      starter: String.raw`def is_power_of_two(n):
    pass
`,
      tests: [["is_power_of_two(1)", "True"], ["is_power_of_two(16)", "True"], ["is_power_of_two(0)", "False"], ["is_power_of_two(-8)", "False"], ["is_power_of_two(6)", "False"], ["is_power_of_two(2**40)", "True"]],
      hints: ["<code>n &gt; 0 and n &amp; (n - 1) == 0</code>"],
      solution: String.raw`def is_power_of_two(n):
    return n > 0 and n & (n - 1) == 0
`,
      explain: "Python 里 <code>&amp;</code> 比 <code>==</code> 优先级高（和 C 相反！），所以 <code>n &amp; (n - 1) == 0</code> 是对的。在 C 里必须写 <code>(n &amp; (n - 1)) == 0</code>。", cx: "O(1)",
    },
    {
      id: "byte-sum", title: "Sum of Bytes (HR ref Q3)", diff: "Easy", tags: ["HR 真题"], short: "把 32 位整数的 4 个字节相加：0x12345678 → 0x114",
      en: "Given an unsigned 32-bit integer x, add up its 4 bytes and return the sum. For 0x12345678 the bytes are 0x12, 0x34, 0x56, 0x78, so the result is 0x114 (= 276).",
      examples: "byte_sum(0x12345678) -> 276   # hex(276) == '0x114'\nbyte_sum(0xFFFFFFFF) -> 1020",
      zh: "用移位和掩码取字节。注意 0xFF 这种 ≥ 0x80 的字节——C 参考答案用 char* 时会被当成负数。",
      starter: String.raw`def byte_sum(x):
    total = 0
    # your code here
    return total
`,
      tests: [["byte_sum(0x12345678)", "0x114"], ["byte_sum(0)", "0"], ["byte_sum(0xFFFFFFFF)", "1020"], ["byte_sum(0x80000080)", "256"], ["hex(byte_sum(0x01020304))", "'0xa'"]],
      hints: ["<code>for i in range(4): total += (x &gt;&gt; (8 * i)) &amp; 0xFF</code>", "或者 <code>sum(x.to_bytes(4, 'little'))</code>"],
      solution: String.raw`def byte_sum(x):
    total = 0
    for i in range(4):
        total += (x >> (8 * i)) & 0xFF
    return total
`,
      explain: "C 参考答案的 bug：<code>char *p</code> 在大多数平台上是 signed char，字节 0x80~0xFF 读出来是 -128~-1。0x12345678 恰好每个字节都 &lt; 0x80 所以“碰巧正确”。修正：用 <code>unsigned char *p</code>。另外 <code>printf(\"%#x\")</code> 打印 0x114。",
      cx: "O(1) — always 4 bytes",
    },
    {
      id: "single-number", title: "Single Number", diff: "Easy", tags: ["xor"], short: "其它数都出现两次，找出只出现一次的",
      en: "Every element appears twice except for one. Find that single one in O(n) time and O(1) extra space.",
      examples: "single_number([4, 1, 2, 1, 2]) -> 4",
      zh: "a ^ a = 0，a ^ 0 = a，异或满足交换律。全部异或起来，成对的抵消了。",
      starter: String.raw`def single_number(nums):
    pass
`,
      tests: [["single_number([2, 2, 1])", "1"], ["single_number([4, 1, 2, 1, 2])", "4"], ["single_number([7])", "7"], ["single_number([-1, 5, 5])", "-1"]],
      hints: ["<code>r = 0; for x in nums: r ^= x</code>"],
      solution: String.raw`def single_number(nums):
    r = 0
    for x in nums:
        r ^= x
    return r
`,
      cx: "O(n) time, O(1) space",
    },
    {
      id: "missing-number", title: "Missing Number", diff: "Easy", tags: ["xor", "math"], short: "0..n 中缺了一个数，找出来",
      en: "nums contains n distinct numbers taken from 0, 1, 2, ..., n. Return the one that is missing.",
      examples: "missing_number([3, 0, 1]) -> 2",
      zh: "方法一：等差数列和 n(n+1)/2 减去实际和。方法二：下标和数值一起异或。",
      starter: String.raw`def missing_number(nums):
    pass
`,
      tests: [["missing_number([3, 0, 1])", "2"], ["missing_number([0, 1])", "2"], ["missing_number([9,6,4,2,3,5,7,0,1])", "8"], ["missing_number([1])", "0"]],
      hints: ["<code>n = len(nums); return n * (n + 1) // 2 - sum(nums)</code>"],
      solution: String.raw`def missing_number(nums):
    r = len(nums)
    for i, x in enumerate(nums):
        r ^= i ^ x
    return r
`,
      explain: "异或版本不会溢出（C 里求和可能溢出，这是面试可以提的点）。", cx: "O(n) time, O(1) space",
    },
    {
      id: "reverse-bits", title: "Reverse Bits (32-bit)", diff: "Easy", tags: ["shift"], short: "把 32 位无符号整数的位顺序颠倒",
      en: "Reverse the bits of a 32-bit unsigned integer.",
      examples: "reverse_bits(1)        -> 2147483648   # 0...01 -> 10...0\nreverse_bits(43261596) -> 964176192",
      zh: "循环 32 次：结果左移一位，把 n 的最低位放进来，n 右移一位。",
      starter: String.raw`def reverse_bits(n):
    pass
`,
      tests: [["reverse_bits(1)", "2147483648"], ["reverse_bits(0)", "0"], ["reverse_bits(43261596)", "964176192"], ["reverse_bits(0xFFFFFFFF)", "0xFFFFFFFF"], ["reverse_bits(0x80000000)", "1"]],
      hints: ["<code>r = (r &lt;&lt; 1) | (n &amp; 1); n &gt;&gt;= 1</code>，固定 32 次。"],
      solution: String.raw`def reverse_bits(n):
    r = 0
    for _ in range(32):
        r = (r << 1) | (n & 1)
        n >>= 1
    return r
`,
      cx: "O(32) = O(1)",
    },
    {
      id: "count-bits-32", title: "Count Bits of a Negative int", diff: "Medium", tags: ["two's complement", "debug"], short: "让 foo(n) 对负数也正确（按 32 位补码）",
      en: "Treat n as a 32-bit signed int (like C's int). Return how many 1 bits its two's complement representation has. For example -1 is 0xFFFFFFFF, which has 32 ones.\n\nThe starter code is a direct translation of the HR function. It returns 0 for negatives (C behaviour with n > 0). Fix it. Careful: in Python, simply changing the condition to `while n:` loops forever for negative n.",
      examples: "count_bits_32(-1) -> 32\ncount_bits_32(-2) -> 31\ncount_bits_32(5)  -> 2",
      zh: "这就是面试官说的“让你修改一下”。Python 整数无限位，负数要先 & 0xFFFFFFFF。",
      starter: String.raw`def count_bits_32(n):
    c = 0
    while n > 0:
        n = n & (n - 1)
        c += 1
    return c
`,
      tests: [["count_bits_32(5)", "2"], ["count_bits_32(0)", "0"], ["count_bits_32(-1)", "32"], ["count_bits_32(-2)", "31"], ["count_bits_32(-2147483648)", "1"], ["count_bits_32(2147483647)", "31"]],
      hints: ["第一行加 <code>n &amp;= 0xFFFFFFFF</code>，把 Python 的“无限位负数”截成 32 位无符号数。", "截完之后 n 一定 ≥ 0，<code>while n</code> 和 <code>while n &gt; 0</code> 都可以。"],
      solution: String.raw`def count_bits_32(n):
    n &= 0xFFFFFFFF       # view as 32-bit unsigned (two's complement)
    c = 0
    while n:
        n &= n - 1
        c += 1
    return c
`,
      explain: "C 版本的修法：<code>int foo(unsigned int n)</code> 并把条件改为 <code>n != 0</code>。调用 <code>foo(-1)</code> 时 -1 被转换为 0xFFFFFFFF，返回 32。<br>面试时这样说：<i>\"The original version uses a signed int and the condition n &gt; 0, so any negative input returns 0. Making the parameter unsigned fixes it.\"</i>",
      cx: "O(32)",
    },
    {
      id: "counting-bits", title: "Counting Bits 0..n", diff: "Medium", tags: ["dp"], short: "返回 0..n 每个数的 1 的个数，要求 O(n)",
      en: "Return a list ans of length n + 1 where ans[i] is the number of 1 bits in i. Aim for O(n) total.",
      examples: "counting_bits(5) -> [0, 1, 1, 2, 1, 2]",
      zh: "i & (i-1) 比 i 小且少一个 1，所以 ans[i] = ans[i & (i-1)] + 1。",
      starter: String.raw`def counting_bits(n):
    pass
`,
      tests: [["counting_bits(0)", "[0]"], ["counting_bits(2)", "[0, 1, 1]"], ["counting_bits(5)", "[0, 1, 1, 2, 1, 2]"], ["counting_bits(16)[-1]", "1"], ["sum(counting_bits(1023))", "5120"]],
      hints: ["也可以用 <code>ans[i] = ans[i &gt;&gt; 1] + (i &amp; 1)</code>。"],
      solution: String.raw`def counting_bits(n):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i & (i - 1)] + 1
    return ans
`,
      explain: "这是位运算 + 动态规划的结合：用已经算好的较小数的答案。", cx: "O(n) time, O(n) space",
    },
  ],
});
