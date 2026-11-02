// Extra short problems for the question-bank chapter.
(function () {
const bank = window.CHAPTERS.find((c) => c.id === "bank");
const P = (o) => bank.problems.push(o);
P({
  id: "swap-xor", title: "Swap Without a Temp Variable", diff: "Easy", tags: ["bits"], short: "用 XOR 交换两个数",
  en: "Return (b, a) given (a, b), using only XOR operations on a and b — no temporary variable and no tuple swap.",
  examples: "swap_xor(3, 5) -> (5, 3)", zh: "a ^= b; b ^= a; a ^= b。",
  starter: String.raw`def swap_xor(a, b):
    # three XOR assignments, then return a, b
    return a, b
`,
  tests: [["swap_xor(3, 5)", "(5, 3)"], ["swap_xor(0, 7)", "(7, 0)"], ["swap_xor(-4, 9)", "(9, -4)"], ["swap_xor(6, 6)", "(6, 6)"]],
  hints: ["第一步后 a 存的是 a^b。"],
  solution: String.raw`def swap_xor(a, b):
    a ^= b
    b ^= a      # b = b ^ (a ^ b) = a
    a ^= b      # a = (a ^ b) ^ a = b
    return a, b
`,
  explain: "C 里如果 a 和 b 是同一个内存位置（如 <code>swap(&amp;x, &amp;x)</code>），第一步就把它变成 0。实际代码用临时变量更清楚。", cx: "O(1)",
});
P({
  id: "bit-ops", title: "Set, Clear, Toggle, Test a Bit", diff: "Easy", tags: ["bits", "registers"], short: "寄存器位操作四件套",
  en: "Implement bit_op(x, k, op) where op is 'set', 'clear', 'toggle' or 'test'. For 'test' return True/False; otherwise return the new value of x.",
  examples: "bit_op(0b1010, 0, 'set') -> 0b1011\nbit_op(0b1010, 1, 'test') -> True",
  zh: "嵌入式里配置寄存器全靠这四个操作。",
  starter: String.raw`def bit_op(x, k, op):
    pass
`,
  tests: [["bit_op(0b1010, 0, 'set')", "0b1011"], ["bit_op(0b1010, 1, 'clear')", "0b1000"], ["bit_op(0b1010, 3, 'toggle')", "0b0010"], ["bit_op(0b1010, 1, 'test')", "True"], ["bit_op(0b1010, 2, 'test')", "False"]],
  hints: ["<code>x | (1 &lt;&lt; k)</code>, <code>x &amp; ~(1 &lt;&lt; k)</code>, <code>x ^ (1 &lt;&lt; k)</code>, <code>(x &gt;&gt; k) &amp; 1 == 1</code>"],
  solution: String.raw`def bit_op(x, k, op):
    mask = 1 << k
    if op == "set":
        return x | mask
    if op == "clear":
        return x & ~mask
    if op == "toggle":
        return x ^ mask
    return (x & mask) != 0
`,
  cx: "O(1)",
});
P({
  id: "hamming", title: "Hamming Distance", diff: "Easy", tags: ["bits"], short: "两个数有几位不同",
  en: "Return the number of bit positions at which x and y differ.",
  examples: "hamming_distance(1, 4) -> 2     # 001 vs 100",
  zh: "x ^ y 中 1 的个数——复用 HR 的 foo。",
  starter: String.raw`def hamming_distance(x, y):
    pass
`,
  tests: [["hamming_distance(1, 4)", "2"], ["hamming_distance(3, 1)", "1"], ["hamming_distance(0, 0)", "0"], ["hamming_distance(255, 0)", "8"]],
  hints: ["<code>n = x ^ y</code>，然后 <code>n &amp;= n - 1</code> 计数。"],
  solution: String.raw`def hamming_distance(x, y):
    n = x ^ y
    c = 0
    while n:
        n &= n - 1
        c += 1
    return c
`,
  cx: "O(number of differing bits)",
});
P({
  id: "swap-bytes16", title: "Swap Bytes of a 16-bit Value", diff: "Easy", tags: ["bits", "endianness"], short: "0x1234 → 0x3412（大小端转换）",
  en: "Given a 16-bit unsigned value, swap its high and low bytes.",
  examples: "swap_bytes16(0x1234) -> 0x3412",
  zh: "串口/网络协议里收到的 16 位数据字节序不对时就要这样转。",
  starter: String.raw`def swap_bytes16(x):
    pass
`,
  tests: [["swap_bytes16(0x1234)", "0x3412"], ["swap_bytes16(0x00FF)", "0xFF00"], ["swap_bytes16(0xABCD)", "0xCDAB"], ["swap_bytes16(0)", "0"]],
  hints: ["<code>((x &amp; 0xFF) &lt;&lt; 8) | ((x &gt;&gt; 8) &amp; 0xFF)</code>"],
  solution: String.raw`def swap_bytes16(x):
    return ((x & 0xFF) << 8) | ((x >> 8) & 0xFF)
`,
  cx: "O(1)",
});
P({
  id: "xor-1-to-n", title: "XOR of 1..n in O(1)", diff: "Easy", tags: ["bits", "pattern"], short: "1^2^...^n 的规律",
  en: "Return 1 ^ 2 ^ ... ^ n in O(1) time (n >= 0).",
  examples: "xor_to_n(4) -> 4     # 1^2^3^4\nxor_to_n(5) -> 1",
  zh: "先写循环版本，打印 n = 1..12 的结果，找规律（这就是“写 main 测试来推断功能”的练习）。",
  starter: String.raw`def xor_to_n(n):
    pass

if __name__ == "__main__":
    r = 0
    for i in range(1, 13):
        r ^= i
        print(i, i % 4, r)
`,
  tests: [["xor_to_n(0)", "0"], ["xor_to_n(1)", "1"], ["xor_to_n(4)", "4"], ["xor_to_n(5)", "1"], ["xor_to_n(6)", "7"], ["xor_to_n(7)", "0"], ["xor_to_n(10**12)", "10**12"]],
  hints: ["看打印结果：n % 4 == 0 → n；1 → 1；2 → n + 1；3 → 0。"],
  solution: String.raw`def xor_to_n(n):
    return [n, 1, n + 1, 0][n % 4]
`,
  cx: "O(1)",
});
P({
  id: "alternating-bits", title: "Alternating Bits", diff: "Easy", tags: ["bits"], short: "二进制是否 0/1 交替（如 10101）",
  en: "Return True if the binary representation of the positive integer n has alternating bits (no two adjacent bits are equal).",
  examples: "has_alternating_bits(5) -> True    # 101\nhas_alternating_bits(7) -> False   # 111",
  zh: "交替时 n ^ (n >> 1) 全是 1；全 1 的数 y 满足 y & (y + 1) == 0。",
  starter: String.raw`def has_alternating_bits(n):
    pass
`,
  tests: [["has_alternating_bits(5)", "True"], ["has_alternating_bits(7)", "False"], ["has_alternating_bits(10)", "True"], ["has_alternating_bits(11)", "False"], ["has_alternating_bits(1)", "True"]],
  hints: ["<code>y = n ^ (n &gt;&gt; 1)</code>"],
  solution: String.raw`def has_alternating_bits(n):
    y = n ^ (n >> 1)
    return y & (y + 1) == 0
`,
  cx: "O(1)",
});
P({
  id: "reverse-number", title: "Reverse a Number", diff: "Easy", tags: ["math"], short: "123 → 321，-120 → -21",
  en: "Reverse the decimal digits of an integer, keeping the sign. Do not convert to a string.",
  examples: "reverse_number(123) -> 321\nreverse_number(-120) -> -21",
  zh: "反复 % 10 取最后一位，// 10 去掉最后一位。Python 对负数的 % 和 // 与 C 不同，先取绝对值。",
  starter: String.raw`def reverse_number(n):
    pass
`,
  tests: [["reverse_number(123)", "321"], ["reverse_number(-120)", "-21"], ["reverse_number(0)", "0"], ["reverse_number(1000)", "1"], ["reverse_number(-7)", "-7"]],
  hints: ["<code>sign = -1 if n &lt; 0 else 1; n = abs(n)</code>"],
  solution: String.raw`def reverse_number(n):
    sign = -1 if n < 0 else 1
    n = abs(n)
    r = 0
    while n:
        r = r * 10 + n % 10
        n //= 10
    return sign * r
`,
  explain: "C 版本要考虑反转后溢出 int（如 1999999999）。", cx: "O(number of digits)",
});
P({
  id: "armstrong", title: "Armstrong Number", diff: "Easy", tags: ["math"], short: "153 = 1³ + 5³ + 3³",
  en: "An Armstrong number equals the sum of its digits each raised to the power of the number of digits (e.g. 153 = 1^3 + 5^3 + 3^3). Return True if n is one.",
  examples: "is_armstrong(153) -> True\nis_armstrong(123) -> False",
  zh: "先数位数 k，再逐位求 d^k 之和。",
  starter: String.raw`def is_armstrong(n):
    pass
`,
  tests: [["is_armstrong(153)", "True"], ["is_armstrong(9474)", "True"], ["is_armstrong(123)", "False"], ["is_armstrong(0)", "True"], ["is_armstrong(10)", "False"]],
  hints: ["<code>k = len(str(n))</code>；或循环除以 10 计数。"],
  solution: String.raw`def is_armstrong(n):
    k = len(str(n))
    total, m = 0, n
    while m:
        total += (m % 10) ** k
        m //= 10
    return total == n
`,
  cx: "O(number of digits)",
});
})();
