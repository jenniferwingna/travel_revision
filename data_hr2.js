// Debug-style and serial-protocol problems for the HR chapter.
(function () {
const hr = window.CHAPTERS.find((c) => c.id === "hr");
hr.problems.push(
  {
    id: "fix-byte-sum", title: "Debug: signed char byte sum", diff: "Easy", tags: ["debug", "HR ref #3"], short: "模拟 C 的 signed char bug，改一行修好",
    en: "This Python function mimics the C reference answer that reads bytes through a plain (signed) char pointer. It returns the right answer for 0x12345678 but a wrong answer for some other inputs. Find the bug and fix it.",
    examples: "byte_sum(0x12345678) -> 0x114\nbyte_sum(0x12345680) -> 0x11C   (currently returns a wrong value)",
    zh: "先运行测试，看看哪些输入出错，再推断原因。",
    starter: String.raw`def byte_sum(x):
    total = 0
    for i in range(4):
        b = (x >> (8 * i)) & 0xFF
        if b >= 0x80:          # behaves like C's signed char
            b -= 256
        total += b
    return total
`,
    tests: [["byte_sum(0x12345678)", "0x114"], ["byte_sum(0x12345680)", "0x11C"], ["byte_sum(0xFFFFFFFF)", "1020"], ["byte_sum(0)", "0"]],
    hints: ["出错的输入都有一个字节 ≥ 0x80。", "删掉把 b 变成负数的两行（在 C 里就是把 char* 改成 unsigned char*）。"],
    solution: String.raw`def byte_sum(x):
    total = 0
    for i in range(4):
        total += (x >> (8 * i)) & 0xFF     # bytes are unsigned: 0..255
    return total
`,
    explain: "面试时这样描述：<i>\"It only fails when a byte is 0x80 or larger, which suggests a sign problem. A plain char is signed on this platform, so 0x80 is read as -128. Using unsigned char fixes it.\"</i> —— 从“哪些输入出错”推断原因，是 troubleshooting 的标准思路。",
    cx: "O(1)",
  },
  {
    id: "fix-word-freq", title: "Debug: word frequency crashes", diff: "Easy", tags: ["debug", "HR #6"], short: "两处 bug：分支写反 + split(' ')",
    en: "word_freq should return a dict of word -> count. It crashes with a KeyError, and even after that is fixed it counts empty strings when there are extra spaces. Fix it with minimal changes.",
    examples: "word_freq('the sky is the sky') -> {'the': 2, 'sky': 2, 'is': 1}\nword_freq('a  b') -> {'a': 1, 'b': 1}",
    zh: "先看报错信息里的行号。",
    starter: String.raw`def word_freq(s):
    freq = {}
    for w in s.split(" "):
        if w in freq:
            freq[w] = 1
        else:
            freq[w] += 1
    return freq
`,
    tests: [["word_freq('the sky is the sky')", "{'the': 2, 'sky': 2, 'is': 1}"], ["word_freq('a  b')", "{'a': 1, 'b': 1}"], ["word_freq('')", "{}"], ["word_freq(' x ')", "{'x': 1}"]],
    hints: ["if/else 两个分支的内容写反了。", "<code>split(\" \")</code> 遇到连续空格会产生空字符串，改成 <code>split()</code>。"],
    solution: String.raw`def word_freq(s):
    freq = {}
    for w in s.split():          # fix 2: split on any whitespace
        if w in freq:
            freq[w] += 1         # fix 1: branches were swapped
        else:
            freq[w] = 1
    return freq
`,
    cx: "O(n)",
  },
  {
    id: "fix-average", title: "Debug: average is off", diff: "Easy", tags: ["debug", "off-by-one"], short: "三处小 bug：漏掉第一个元素、整除、空列表",
    en: "average(nums) should return the mean as a float, and 0.0 for an empty list. Fix the bugs.",
    examples: "average([1, 2, 3, 4]) -> 2.5\naverage([]) -> 0.0",
    zh: "典型的 off-by-one + 整数除法 + 除以零。",
    starter: String.raw`def average(nums):
    total = 0
    for i in range(1, len(nums)):
        total += nums[i]
    return total // len(nums)
`,
    tests: [["average([1, 2, 3, 4])", "2.5", "float"], ["average([10])", "10.0", "float"], ["average([])", "0.0", "float"], ["average([-1, 1])", "0.0", "float"]],
    hints: ["<code>range(1, ...)</code> 跳过了 nums[0]。", "<code>//</code> 是整除，用 <code>/</code>。", "空列表会 ZeroDivisionError。"],
    solution: String.raw`def average(nums):
    if not nums:
        return 0.0
    total = 0
    for i in range(len(nums)):
        total += nums[i]
    return total / len(nums)
`,
    explain: "C 里的同类 bug：<code>int / int</code> 也是整除，要写 <code>(double)total / n</code>。",
    cx: "O(n)",
  },
  {
    id: "fix-remove-evens", title: "Debug: removing while iterating", diff: "Easy", tags: ["debug"], short: "遍历列表的同时删除元素",
    en: "remove_evens should return the list with all even numbers removed, keeping order. It works on some inputs but not on [2, 4, 6, 1]. Explain why, then fix it.",
    examples: "remove_evens([2, 4, 6, 1]) -> [1]",
    zh: "for 循环内部用下标前进；删掉一个元素后，后面的元素整体前移，下一个就被跳过了。",
    starter: String.raw`def remove_evens(nums):
    for x in nums:
        if x % 2 == 0:
            nums.remove(x)
    return nums
`,
    tests: [["remove_evens([2, 4, 6, 1])", "[1]"], ["remove_evens([1, 2, 3])", "[1, 3]"], ["remove_evens([])", "[]"], ["remove_evens([8, 8])", "[]"]],
    hints: ["新建一个列表：<code>[x for x in nums if x % 2 != 0]</code>", "C/C++ 里同类 bug：删除 vector 元素后迭代器失效。"],
    solution: String.raw`def remove_evens(nums):
    return [x for x in nums if x % 2 != 0]
`,
    explain: "如果必须原地修改，用读写指针（见数组章节），或者从后往前遍历删除。",
    cx: "O(n)",
  },
  {
    id: "fix-mutable-default", title: "Debug: state that grows across calls", diff: "Easy", tags: ["debug", "HR #7"], short: "Python 默认参数陷阱——“越用越大”",
    en: "make_batch(item) should return a new list containing just item each time it is called without a bucket. Instead, every call returns a longer and longer list. Fix it.",
    examples: "make_batch(1) -> [1]\nmake_batch(2) -> [2]       (currently [1, 2])",
    zh: "默认参数只在函数定义时创建一次，所有调用共享同一个列表。这和 HR 第 7 题“软件越跑越慢”的一类原因相同：某个全局/静态状态在不断增长。",
    starter: String.raw`def make_batch(item, bucket=[]):
    bucket.append(item)
    return bucket
`,
    tests: [["(make_batch(1), make_batch(2))", "([1], [2])"], ["make_batch(3, [9])", "[9, 3]"], ["len([make_batch(i) for i in range(5)][-1])", "1"]],
    hints: ["默认值用 <code>None</code>，在函数里再创建列表。"],
    solution: String.raw`def make_batch(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
`,
    explain: "联系 Q7：长期运行的程序里，静态变量、全局缓存、没清空的队列、忘记 free 的内存，都会让内存不断增长，最终导致变慢甚至崩溃。",
    cx: "O(1)",
  },
  {
    id: "missing-seq", title: "Serial: find missing sequence numbers", diff: "Easy", tags: ["HR #11", "serial"], short: "8 位序号（0..255 循环）中找丢失的包",
    en: "Each packet received over a serial link carries an 8-bit sequence number that increments by 1 and wraps from 255 to 0. Given the sequence numbers in the order received, return the list of missing numbers. Assume no gap is longer than 255.",
    examples: "missing_seq([10, 13])         -> [11, 12]\nmissing_seq([254, 255, 1])    -> [0]",
    zh: "HR 第 11 题“串口丢字节怎么检查”的一种答案：给每个包加序号，接收端检查是否连续。",
    starter: String.raw`def missing_seq(seqs):
    pass
`,
    tests: [["missing_seq([1, 2, 3])", "[]"], ["missing_seq([10, 13])", "[11, 12]"], ["missing_seq([254, 255, 1])", "[0]"], ["missing_seq([253, 2])", "[254, 255, 0, 1]"], ["missing_seq([])", "[]"]],
    hints: ["相邻两个数之间：<code>exp = (prev + 1) % 256</code>，当 <code>exp != cur</code> 时把 exp 加入结果并继续 +1。"],
    solution: String.raw`def missing_seq(seqs):
    missing = []
    for prev, cur in zip(seqs, seqs[1:]):
        exp = (prev + 1) % 256
        while exp != cur:
            missing.append(exp)
            exp = (exp + 1) % 256
    return missing
`,
    cx: "O(n + number of missing)",
  },
  {
    id: "parse-frames", title: "Serial: parse frames and resync", diff: "Medium", tags: ["HR #11", "serial", "parsing"], short: "按协议解析串口字节流，丢字节时重新同步",
    en: "A device sends frames over a serial port: [0xAA header][length L][L payload bytes][checksum], where checksum = sum(payload) & 0xFF. Bytes can be lost or corrupted, and there may be garbage before a frame.\n\nReturn the list of payloads (each a list of ints) from valid frames. When a frame is invalid (bad checksum) or incomplete, resynchronise by searching for the next 0xAA after the current header position.",
    examples: "parse_frames([0xAA, 2, 1, 2, 3])                        -> [[1, 2]]\nparse_frames([0x00, 0xAA, 1, 7, 7])                      -> [[7]]\nparse_frames([0xAA, 3, 5, 7, 0x12, 0xAA, 1, 9, 9])       -> [[9]]   # first frame lost a byte",
    zh: "这就是“怎么检测丢字节”的工程答案：帧头 + 长度 + 校验和。校验失败就丢弃这一帧，从下一个 0xAA 重新开始。",
    starter: String.raw`def parse_frames(data):
    HEADER = 0xAA
    frames = []
    i = 0
    # your code here
    return frames
`,
    tests: [["parse_frames([0xAA, 2, 1, 2, 3])", "[[1, 2]]"], ["parse_frames([0xAA, 2, 1, 2, 3, 0xAA, 1, 5, 5])", "[[1, 2], [5]]"], ["parse_frames([0x00, 0xFF, 0xAA, 1, 7, 7])", "[[7]]"], ["parse_frames([0xAA, 3, 5, 7, 0x12, 0xAA, 1, 9, 9])", "[[9]]"], ["parse_frames([0xAA, 5, 1, 2])", "[]"], ["parse_frames([0xAA, 1, 0xAA, 0xAA])", "[[170]]"], ["parse_frames([0xAA, 0, 0])", "[[]]"], ["parse_frames([])", "[]"]],
    hints: ["外层 <code>while i &lt; len(data)</code>：若 data[i] 不是 0xAA，i += 1 继续找。", "是帧头时：检查 <code>i + 2 + L &lt; len(data)</code>（完整性），再算校验和。成功 i += 3 + L；失败 i += 1（从下一个字节重新找帧头）。"],
    solution: String.raw`def parse_frames(data):
    HEADER = 0xAA
    frames = []
    i = 0
    n = len(data)
    while i < n:
        if data[i] != HEADER:
            i += 1                       # skip garbage until a header
            continue
        if i + 1 >= n:
            break                        # header but no length byte
        L = data[i + 1]
        end = i + 2 + L                  # index of the checksum byte
        if end >= n:
            i += 1                       # incomplete: try a later header
            continue
        payload = data[i + 2:end]
        if sum(payload) & 0xFF == data[end]:
            frames.append(payload)
            i = end + 1                  # jump past this frame
        else:
            i += 1                       # corrupted or lost byte: resync
    return frames
`,
    explain: "可以延伸的点：①校验和换成 CRC-16 检错能力更强；②payload 里可能出现 0xAA，需要字节填充（byte stuffing / escaping）或依赖长度字段；③加序号检测整帧丢失；④接收方 ACK/NAK，发送方超时重传。这些就是 Q11 的完整口头答案。",
    cx: "O(n) for valid streams; resync may rescan bytes, worst case O(n · 255)",
  }
);
})();
