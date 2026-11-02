// Chapter: the questions HR sent, as code-reading cards (problems are added in data_hr2.js).
window.CHAPTERS.push({
  id: "hr", order: 2, num: "★", group: "起步 Warm-up", title: "HR 真题逐题拆解", en: "The questions HR sent",
  blurb: "看代码猜功能 · 找 bug · 写 main 测试",
  eyebrow: "PAST INTERVIEW QUESTIONS",
  qaLabel: "代码题拆解",
  qaIntro: String.raw`
<p>HR 给的题目分三类：<b>看代码说功能</b>、<b>找 bug 改一两行</b>、<b>概念问答</b>。这一页覆盖代码类；概念问答（Stack/Heap、软件变慢、IPC、串口）在「系统与 C 概念」章节；自我介绍和项目经验在「英文面试表达」章节。</p>
<div class="note tip"><b class="lbl">面试官真正想看的</b>HR 原话：<i>“這題他們預計大家不會猜到，但是他們會讓你去修改一下，或者弄個 Main function 去測試，看看你 Troubleshooting 的觸覺與能力。”</i> 所以就算一眼看不出来，也要<b>出声地</b>：①用一个小输入手动跟踪 ②写 main 跑几个边界值 ③根据输出推断功能。下面每张卡片都按这个流程写。</div>
<h3>遇到不认识的代码时，可以这样开口</h3>
~~~text
"I'm not sure yet what it does, so let me trace it with a small input."
"Let me try n = 6. In binary that's 110 ..."
"I'd like to write a quick main function and test a few edge cases: 0, 1, a power of two, a negative number."
"From these outputs it looks like it counts the number of 1 bits."
"One issue I see: for negative input, the loop condition n > 0 is false immediately, so it returns 0."
~~~
`,
  qa: [
    {
      src: "HR #4", q: "What does foo() do? int foo(int n) { int c = 0; for(; n > 0; n = n & (n - 1), ++c); return c; }", qzh: "这段程序做什么？怎么修改、怎么测试？",
      open: true,
      points: String.raw`
<p><b>先手动跟踪</b>：n = 12 = <code>1100</code>。</p>
~~~text
n = 1100, n-1 = 1011, n & (n-1) = 1000, c = 1
n = 1000, n-1 = 0111, n & (n-1) = 0000, c = 2
n = 0 -> stop, return 2       // 12 的二进制里有 2 个 1
~~~
<ul>
<li><b>功能</b>：统计二进制中 1 的个数（popcount / Hamming weight），Brian Kernighan 算法。<code>n &amp; (n-1)</code> 每次清掉最低位的 1。</li>
<li><b>复杂度</b>：循环次数 = 1 的个数（≤ 32），比逐位检查 32 次更快。</li>
<li><b>Bug / 改进</b>：参数是有符号 <code>int</code>，条件 <code>n &gt; 0</code>，负数直接返回 0，但 -1 实际有 32 个 1。改为 <code>unsigned int n</code> 和 <code>n != 0</code>。</li>
<li><b>可读性</b>：for 循环体是空的（分号结尾），容易被误读，可改写成 while。</li>
</ul>
~~~c
#include <stdio.h>

int foo(unsigned int n) {
    int c = 0;
    while (n != 0) {
        n &= n - 1;   /* clear the lowest set bit */
        ++c;
    }
    return c;
}

int main(void) {
    unsigned int tests[]    = {0, 1, 2, 3, 12, 255, 0x80000000u, 0xFFFFFFFFu};
    int          expected[] = {0, 1, 1, 2, 2,  8,   1,           32};
    int n = sizeof(tests) / sizeof(tests[0]);
    int fail = 0;
    for (int i = 0; i < n; i++) {
        int got = foo(tests[i]);
        printf("foo(0x%X) = %d %s\n", tests[i], got, got == expected[i] ? "OK" : "FAIL");
        if (got != expected[i]) fail++;
    }
    return fail;      /* 0 = all passed */
}
~~~
`,
      say: "This function counts the number of set bits in n. The expression n AND n minus one clears the lowest set bit, so the loop runs once per one-bit, and c ends up as the bit count. One problem is that n is a signed int and the loop condition is n greater than zero, so any negative input returns zero, even though minus one has thirty-two set bits. I would change the parameter to unsigned int and the condition to n not equal to zero. To test it, I would write a main function with edge cases: zero, one, a power of two, two hundred fifty-five, and all bits set.",
      link: '对应练习：<a href="#bits--count-bits">Count Set Bits</a> · <a href="#bits--count-bits-32">Count Bits of a Negative int</a> · 动画在「位运算」章节。',
    },
    {
      src: "HR ref #4", q: "Explain: unsigned char foo(int n) { return !(n & n - 1) * n > 0; }", qzh: "解释这个函数的作用（HR 说要补全代码运行看看效果）",
      points: String.raw`
<p><b>按 C 的优先级加括号</b>：<code>-</code> 高于 <code>&amp;</code>；一元 <code>!</code> 最高；<code>*</code> 高于 <code>&gt;</code>。</p>
~~~c
return ( ( !( n & (n - 1) ) ) * n ) > 0;
~~~
<ul>
<li><code>n &amp; (n-1) == 0</code> ⇔ n 最多只有一个 1 位 ⇔ n 是 2 的幂或 0。</li>
<li><code>!(...)</code> 把它变成 1 / 0；乘以 n 再判断 &gt; 0，排除了 n = 0 和负数。</li>
<li><b>功能：判断 n 是否是 2 的幂</b>，是返回 1，否则 0。</li>
<li>边界：<code>n = INT_MIN</code> 时 <code>n - 1</code> 有符号溢出，是未定义行为（UB）。</li>
<li>更清晰的写法：<code>return n &gt; 0 &amp;&amp; (n &amp; (n - 1)) == 0;</code></li>
</ul>
~~~c
#include <stdio.h>
unsigned char foo(int n) { return !(n & n - 1) * n > 0; }
int main(void) {
    for (int n = -2; n <= 17; n++)
        if (foo(n)) printf("%d ", n);
    printf("\n");          /* prints: 1 2 4 8 16 */
    return 0;
}
~~~
`,
      say: "It checks whether n is a power of two. Because subtraction binds tighter than bitwise AND, n AND n minus one is evaluated first; that is zero only when n has at most one bit set. The logical NOT turns that into one or zero, and multiplying by n and comparing with zero rules out zero and negative numbers. So it returns one for one, two, four, eight and so on, and zero otherwise. I would rewrite it as n greater than zero and n AND n minus one equals zero, with explicit parentheses, because it's much easier to read.",
      link: '对应练习：<a href="#bits--power-of-two">Power of Two</a>',
    },
    {
      src: "HR ref #3", q: "Add up each byte of an unsigned int and print in hex (0x12345678 → 0x114)", qzh: "参考答案用 char* 逐字节读——有什么问题？",
      points: String.raw`
~~~c
unsigned int x = 0x12345678;
char *p = (char *)&x;          // 把 int 的内存当成 4 个 char 来读
int sum = 0;
for (int i = 0; i < sizeof(int); i++)
    sum += *p++;
printf("sum = %#x\n", sum);    // 0x12+0x34+0x56+0x78 = 0x114
~~~
<ul>
<li><b>Bug：<code>char</code> 是否有符号由平台决定</b>（x86/ARM Linux 上通常是 signed）。字节 ≥ 0x80 时读出来是负数。0x12345678 的每个字节都 &lt; 0x80，所以“碰巧”正确；换成 0x12345680 就会少算 256。修正：<code>unsigned char *p</code>。</li>
<li><b>大小端无关</b>：小端机器内存里是 78 56 34 12，大端是 12 34 56 78，但加法结果一样。</li>
<li><code>sizeof(int)</code> 不一定是 4（虽然现在几乎都是）；用 <code>uint32_t</code> 更明确。</li>
<li>不依赖内存布局的写法：<code>for (i = 0; i &lt; 4; i++) sum += (x &gt;&gt; (8 * i)) &amp; 0xFF;</code></li>
<li><code>%#x</code> 会输出带 0x 前缀的十六进制。</li>
</ul>
`,
      say: "The function reinterprets the integer as four bytes through a char pointer and adds them up, giving 0x114 for 0x12345678. The subtle bug is that plain char is signed on most platforms, so any byte of 0x80 or above becomes negative and the sum is wrong. This example happens to work only because every byte is below 0x80. I would use an unsigned char pointer, or avoid pointer casts entirely by shifting and masking with 0xFF. Endianness doesn't affect the result because addition is order-independent.",
      link: '对应练习：<a href="#bits--byte-sum">Sum of Bytes</a> · <a href="#hr--fix-byte-sum">Debug: signed char byte sum</a>',
    },
    {
      src: "HR ref #2", q: "Print a string conversely word for word: \"I love China\" → \"China love I\"", qzh: "参考答案：先整体反转，再逐词反转；swap 用了 XOR",
      points: String.raw`
<ul>
<li><b>算法</b>：整体反转 → "anihC evol I"；再把每个单词反转 → "China love I"。O(n) 时间，O(1) 额外空间（看「字符串」章节动画）。</li>
<li><b>XOR 交换</b>：<code>*head ^= *tail; *tail ^= *head; *head++ ^= *tail--;</code>。如果 head 和 tail 指向同一个地址，结果会变成 0；参考答案的 <code>while (head &lt; tail)</code> 保证不会发生。实际开发用临时变量更清楚，编译器优化后不会更慢。</li>
<li><b>注意</b>：参考答案用 <code>char buff[N] = "I love China"</code>（可修改的数组）。如果写成 <code>char *buff = "I love China"</code>，原地修改字符串字面量是未定义行为，通常直接崩溃。</li>
<li>多个连续空格、首尾空格时要想清楚输出格式——面试时主动问一句。</li>
<li>Python：<code>" ".join(s.split()[::-1])</code></li>
</ul>
`,
      say: "The approach is to reverse the whole string first, which puts the words in the right order but with each word spelled backwards, and then reverse each word individually. That runs in linear time with constant extra space. The swap uses the XOR trick, which is only safe because the loop guarantees head is strictly less than tail; if both pointers pointed to the same byte, it would be zeroed. Also, the buffer must be a writable char array, not a pointer to a string literal.",
      link: '对应练习：<a href="#strings--reverse-words">Reverse Words</a> · <a href="#strings--reverse-words-inplace">Reverse Words In Place</a>',
    },
    {
      src: "HR ref #1", q: "Sort a given size array in ascending order (the cyclic-sort reference answer)", qzh: "参考答案能用吗？有什么局限？",
      points: String.raw`
<ul>
<li><b>它是循环排序</b>：要求数组是 0..n 的排列，值 v 放到下标 v。O(n) 时间、O(1) 空间、交换次数 ≤ n。</li>
<li><b>局限</b>：有重复值 → <code>while (a[i] != i)</code> 永远不成立 → 死循环；有超出范围的值 → <code>a[a[i]]</code> 越界写内存。所以它不是通用的 "sort a given size array"。</li>
<li><b>接口问题</b>：<code>sort(nArray, 9)</code> 的 9 是“最大值”，而 <code>print(nArray, 10)</code> 的 10 是“长度”，同一个参数名两种含义，容易出 off-by-one。</li>
<li><b>面试时可以给出通用版本</b>：插入排序（小数组）或快排/归并（大数组），或直接用 <code>qsort</code>：</li>
</ul>
~~~c
#include <stdlib.h>
int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a, y = *(const int *)b;
    return (x > y) - (x < y);      /* 不写 x - y，避免溢出 */
}
qsort(arr, size, sizeof(int), cmp_int);
~~~
`,
      say: "This is a cyclic sort. It assumes the array is a permutation of zero to n, and it keeps swapping each element into the index equal to its value, which gives linear time and constant space. The catch is that it only works for that special input: a duplicate makes the inner while loop spin forever, and an out-of-range value writes outside the array. The parameter n is also confusing, because the call passes nine, the maximum value, while the print function gets ten, the length. For a general array I would use quicksort, merge sort, or the library qsort.",
      link: '对应练习：<a href="#sorting--cyclic-sort">Cyclic Sort</a> · 动画在「排序」章节。',
    },
    {
      src: "HR #8", q: "char *sentence = \"the sky is blue and the sun is yellow\" — how many words, word counts, complexity?", qzh: "单词数 / 每个单词出现几次 / 复杂度",
      points: String.raw`
~~~py
from collections import Counter
words = sentence.split()
print(len(words))               # 9
print(Counter(words))           # the: 2, is: 2, 其它各 1
~~~
<ul>
<li><b>复杂度</b>：扫描一遍字符串 O(n)，n 为字符数；哈希表插入/查找平均 O(1)，所以总共 O(n) 时间、O(k) 空间（k = 不同单词数）。如需按次数排序输出，加 O(k log k)。</li>
<li><b>C 实现要点</b>：<code>sentence</code> 指向只读字面量，不能用会修改字符串的 <code>strtok</code>，要先拷贝到数组；或者用两个指针扫描，不修改原串。没有内置哈希表时：单词少就用“结构体数组 + 线性查找”O(n·k)，单词多就自己写哈希表或先排序再数。</li>
<li><b>可以主动问的澄清问题</b>：大小写算不算同一个词？有标点吗？输出要不要排序？</li>
</ul>
`,
      say: "There are nine words. 'The' and 'is' each appear twice, and every other word appears once. I split the sentence on whitespace and count with a hash map, so it's a single pass: O(n) time in the length of the string, and O(k) space for k distinct words. If the output needs to be sorted by frequency, that adds O(k log k). In C I would be careful that the sentence is a string literal, so I can't modify it in place with strtok; I would copy it into a buffer first or scan it with two pointers.",
      link: '对应练习：<a href="#strings--count-words">Count Words</a> · <a href="#hash--word-frequency">Word Frequency</a> · <a href="#hash--top-k-words">Top K Frequent Words</a>',
    },
    {
      src: "HR #9", q: "int findSmallestValueToPass(int x, int y) — fill in the code, given bool checkPassFail(int a)", qzh: "在 [x, y] 中找到最小的能通过测量的值",
      points: String.raw`
<p><b>先问</b>：结果是否单调（某个值之后都 pass）？测量是否很慢？都不通过返回什么？测量有没有噪声？</p>
~~~c
int findSmallestValueToPass(int x, int y) {
    int lo = x, hi = y, ans = -1;          /* -1: nothing passes */
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;      /* avoids overflow of lo + hi */
        if (checkPassFail(mid)) {
            ans = mid;
            hi = mid - 1;                  /* try smaller */
        } else {
            lo = mid + 1;
        }
    }
    return ans;
}
~~~
<ul>
<li>测量次数 O(log(y − x))；线性扫描是 O(y − x)。范围 1..1,000,000 时是 20 次 vs 最多一百万次。</li>
<li>如果不单调：只能线性扫描。如果有噪声：在边界附近重复测量取多数，或者找到后再确认一次。</li>
<li>这类场景在测试站（test station）很常见，比如找“能让设备通过的最小电压/最小增益”。</li>
</ul>
`,
      say: "First I'd confirm that the result is monotonic, meaning once a value passes, every larger value also passes, and that each measurement is expensive. If so, I binary search the range. At each step I measure the midpoint; if it passes I record it and search the lower half, otherwise I search the upper half. That takes about log base two of the range measurements instead of one per value. I compute the midpoint as lo plus half the distance to avoid integer overflow, and return minus one if nothing passes. If the measurement is noisy, I'd repeat the measurement near the boundary.",
      link: '对应练习：<a href="#bsearch--smallest-pass">findSmallestValueToPass</a> · 动画在「二分查找」章节。',
    },
  ],
  problems: [],
});
