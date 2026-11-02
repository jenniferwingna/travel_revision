// Animation generators, part A. Each gen(input, mode) returns frames: [{parts:[...], note:"html"}].
window.ANIMS = window.ANIMS || {};
(function (A) {
const e = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const nums = (s) => s.split(/[\s,]+/).filter(Boolean).map((x) => { const v = Number(x); if (Number.isNaN(v)) throw new Error(x + " 不是数字"); return v; });
const bin = (n, w) => (n >>> 0).toString(2).padStart(w, "0").slice(-w);
A._util = { e, nums, bin };

A.bits_popcount = {
  title: "n & (n-1)：每次消掉最低位的 1（HR 真题 foo）",
  desc: "面试给的 <code>foo(n)</code> 就是这个循环。n-1 会把最低位的 1 变成 0、它右边的 0 全变成 1；再和 n 做 AND，正好把那一个 1 抹掉。循环几次，就有几个 1。",
  input: "44", inputLabel: "n =",
  legend: [["swap", "最低位的 1（这一轮被消掉）"], ["active", "n-1 中被翻转的位"]],
  gen(inp) {
    let n = parseInt(inp, 10);
    if (!(n >= 0) || n > 65535) throw new Error("请输入 0 ~ 65535 的整数");
    const W = n > 255 ? 16 : 8, F = [];
    let c = 0;
    F.push({ parts: [{ t: "bits", rows: [{ label: "n", bits: bin(n, W), val: n }] }, { t: "text", text: "c = 0" }], note: "开始：<code>c = 0</code>。只要 <code>n &gt; 0</code> 就继续循环。" });
    while (n > 0) {
      const low = n & -n, pos = W - 1 - Math.log2(low);
      const hlN = {}; hlN[pos] = "swap";
      const hlM = {}; for (let i = pos; i < W; i++) hlM[i] = "active";
      F.push({ parts: [{ t: "bits", rows: [{ label: "n", bits: bin(n, W), val: n, hl: hlN }, { label: "n - 1", bits: bin(n - 1, W), val: n - 1, hl: hlM }] }, { t: "text", text: "c = " + c }], note: "最低位的 1 在第 " + Math.log2(low) + " 位。<code>n-1</code> 把它和右边所有位都翻转了（蓝框）。" });
      const nn = n & (n - 1);
      c++;
      F.push({ parts: [{ t: "bits", rows: [{ label: "n", bits: bin(n, W), val: n, hl: hlN }, { label: "n - 1", bits: bin(n - 1, W), val: n - 1 }, { label: "n & (n-1)", bits: bin(nn, W), val: nn, hl: { [pos]: "done" } }] }, { t: "text", text: "c = " + c }], note: "AND 之后那个 1 消失了，其它高位不变。<code>n = " + nn + "</code>，<code>c = " + c + "</code>。" });
      n = nn;
    }
    F.push({ parts: [{ t: "bits", rows: [{ label: "n", bits: bin(0, W), val: 0 }] }, { t: "text", text: "return c = " + c, c: "done" }], note: "n 变成 0，循环结束。返回 <b>" + c + "</b> = 二进制里 1 的个数（popcount / Hamming weight）。循环次数只和 1 的个数有关，比逐位检查更快。" });
    return F;
  },
};

A.bits_pow2 = {
  title: "!(n & (n-1)) && n > 0：判断 2 的幂（HR 真题第 4 题）",
  desc: "2 的幂在二进制里只有一个 1。消掉这唯一的 1 之后就是 0，所以 <code>n &amp; (n-1) == 0</code>。还要排除 n = 0。",
  input: "64", inputLabel: "n =",
  legend: [["done", "结果为 0 → 是 2 的幂"], ["bad", "结果非 0 → 不是"]],
  gen(inp) {
    const n = parseInt(inp, 10);
    if (!(n >= 0) || n > 65535) throw new Error("请输入 0 ~ 65535");
    const W = n > 255 ? 16 : 8, r = n & (n - 1), ok = r === 0 && n > 0;
    const hl = {}; for (let i = 0; i < W; i++) hl[i] = ok ? "done" : r ? "bad" : undefined;
    return [
      { parts: [{ t: "bits", rows: [{ label: "n", bits: bin(n, W), val: n }] }], note: "数一数 n 里有几个 1。" },
      { parts: [{ t: "bits", rows: [{ label: "n", bits: bin(n, W), val: n }, { label: "n - 1", bits: bin(Math.max(n - 1, 0), W), val: n - 1 }] }], note: "C 的运算符优先级：<code>-</code> 高于 <code>&amp;</code>，所以 <code>n &amp; n - 1</code> 等于 <code>n &amp; (n-1)</code>。" },
      { parts: [{ t: "bits", rows: [{ label: "n", bits: bin(n, W), val: n }, { label: "n - 1", bits: bin(Math.max(n - 1, 0), W), val: n - 1 }, { label: "n & (n-1)", bits: bin(r, W), val: r, hl }] }],
        note: "<code>n &amp; (n-1) = " + r + "</code>，<code>!(...) = " + (r ? 0 : 1) + "</code>。<code>!</code> 优先级最高，然后 <code>*</code>，最后 <code>&gt;</code>：表达式是 <code>(!(n&amp;(n-1)) * n) &gt; 0</code>。" },
      { parts: [{ t: "text", text: "(" + (r ? 0 : 1) + " * " + n + ") > 0  →  " + (ok ? 1 : 0), c: ok ? "done" : "bad" }], note: ok ? n + " 是 2 的幂，函数返回 1。" : n === 0 ? "n = 0 时 <code>!(0)=1</code>，但 <code>1*0 = 0</code> 不大于 0，返回 0。乘以 n 就是为了排除 0。" : n + " 不是 2 的幂，返回 0。" },
    ];
  },
};

A.bits_bytes = {
  title: "把一个 32 位整数的 4 个字节加起来（HR 参考题 3）",
  desc: "用 <code>(x &gt;&gt; 8*i) &amp; 0xFF</code> 依次取出每个字节。C 参考答案用 <code>char *p</code> 逐字节读内存，效果相同，但 <code>char</code> 有符号时遇到 ≥ 0x80 的字节会变成负数——这是个可以拿来问的 bug。",
  input: "0x12345678", inputLabel: "x =",
  legend: [["active", "当前取出的字节"]],
  gen(inp) {
    const x = Number(inp.trim()) >>> 0;
    if (Number.isNaN(Number(inp.trim()))) throw new Error("请输入如 0x12345678");
    const F = [];
    let sum = 0;
    const bits = bin(x, 32);
    F.push({ parts: [{ t: "bits", lw: 70, rows: [{ label: "x", bits, sep: true, val: "0x" + x.toString(16).toUpperCase() }] }, { t: "text", text: "sum = 0" }], note: "32 位 = 4 个字节，虚线是字节边界。" });
    for (let i = 0; i < 4; i++) {
      const b = (x >>> (8 * i)) & 0xff;
      sum += b;
      const hl = {}; for (let k = 32 - 8 * (i + 1); k < 32 - 8 * i; k++) hl[k] = "active";
      F.push({ parts: [{ t: "bits", lw: 70, rows: [{ label: "x", bits, sep: true, hl, val: "0x" + x.toString(16).toUpperCase() }] }, { t: "text", text: "byte" + i + " = (x >> " + 8 * i + ") & 0xFF = 0x" + b.toString(16).toUpperCase().padStart(2, "0") + "    sum = 0x" + sum.toString(16).toUpperCase() }],
        note: "第 " + i + " 个字节（从低位数）= <code>0x" + b.toString(16).padStart(2, "0") + "</code> = " + b + (b >= 0x80 ? "。<b>注意</b>：用有符号 <code>char</code> 读会得到 " + (b - 256) + "，结果就错了。" : "。") });
    }
    F.push({ parts: [{ t: "text", text: "sum = " + sum + " = 0x" + sum.toString(16).toUpperCase(), c: "done" }], note: "结果 <code>0x" + sum.toString(16) + "</code>。字节相加和大小端（endianness）无关，因为加法与顺序无关。" });
    return F;
  },
};

A.two_pointers = {
  title: "对撞双指针：有序数组找两数之和",
  desc: "数组已排序。左指针从头、右指针从尾。和太小就把左指针右移（换个更大的数），和太大就把右指针左移。每步排除一个元素，O(n)。",
  input: "1, 3, 4, 6, 8, 11, 15 | 14", inputLabel: "数组 | target",
  legend: [["cmp", "正在比较"], ["dim", "已排除"], ["found", "找到"]],
  gen(inp) {
    const [a, t] = inp.split("|");
    const arr = nums(a), target = Number(t);
    let l = 0, r = arr.length - 1;
    const F = [], dead = new Set();
    const fr = (note, extra) => { const hl = {}; dead.forEach((i) => (hl[i] = "dim")); Object.assign(hl, extra || {}); return { parts: [{ t: "arr", vals: arr, hl, ptrs: { L: l, R: r } }], note }; };
    F.push(fr("target = " + target + "。L 指向最小，R 指向最大。"));
    while (l < r) {
      const s = arr[l] + arr[r];
      if (s === target) { F.push(fr("<code>" + arr[l] + " + " + arr[r] + " = " + s + "</code> 等于 target，返回下标 [" + l + ", " + r + "]。", { [l]: "found", [r]: "found" })); return F; }
      if (s < target) { F.push(fr("<code>" + arr[l] + " + " + arr[r] + " = " + s + " &lt; " + target + "</code>：太小。arr[L] 和最大的数相加都不够，它不可能是答案 → L++", { [l]: "cmp", [r]: "cmp" })); dead.add(l); l++; }
      else { F.push(fr("<code>" + arr[l] + " + " + arr[r] + " = " + s + " &gt; " + target + "</code>：太大。arr[R] 和最小的数相加都超了 → R--", { [l]: "cmp", [r]: "cmp" })); dead.add(r); r--; }
    }
    F.push(fr("L 与 R 相遇，没有答案。"));
    return F;
  },
};

A.reverse_words = {
  title: "原地反转单词顺序（HR 参考题 2）：先整体反转，再逐词反转",
  desc: "\"I love China\" → \"China love I\"。C 参考答案的思路：第一步把整个字符串反转，第二步把每个单词再反转回来。只用 O(1) 额外空间。",
  input: "I love China", inputLabel: "句子",
  legend: [["swap", "交换"], ["win", "当前单词范围"], ["done", "完成"]],
  gen(inp) {
    const s = inp.split("");
    if (!s.length) throw new Error("请输入句子");
    const F = [];
    const show = (note, hl, range, ptrs) => F.push({ parts: [{ t: "arr", vals: s.map((c) => (c === " " ? "␣" : c)), hl: hl || {}, range, ptrs, cw: 34 }], note });
    show("原字符串。␣ 表示空格。");
    let i = 0, j = s.length - 1;
    while (i < j) { show("第一步：整体反转，交换 head 和 tail。", { [i]: "swap", [j]: "swap" }, null, { head: i, tail: j }); [s[i], s[j]] = [s[j], s[i]]; i++; j--; }
    show("整体反转完成：单词顺序对了，但每个单词的字母是倒的。", {});
    let h = 0;
    while (h < s.length) {
      while (h < s.length && s[h] === " ") h++;
      let t = h;
      while (t < s.length && s[t] !== " ") t++;
      if (h >= s.length) break;
      let a = h, b = t - 1;
      show("第二步：找到一个单词 [" + h + ", " + (t - 1) + "]。", {}, [h, t - 1]);
      while (a < b) { show("反转这个单词：交换 " + e(s[a]) + " 和 " + e(s[b]) + "。", { [a]: "swap", [b]: "swap" }, [h, t - 1], { head: a, tail: b }); [s[a], s[b]] = [s[b], s[a]]; a++; b--; }
      h = t;
    }
    const all = {}; s.forEach((_, k) => (all[k] = "done"));
    show("完成：<code>\"" + e(s.join("")) + "\"</code>。Python 一行：<code>' '.join(s.split()[::-1])</code>。", all);
    return F;
  },
};

A.sliding_window = {
  title: "滑动窗口：最长无重复字符子串",
  desc: "右指针 R 不断扩张窗口；一旦出现重复字符，左指针 L 收缩到重复字符上次出现位置的后一位。每个字符最多进出窗口一次，O(n)。",
  input: "abcabcbb", inputLabel: "s =",
  legend: [["active", "新加入的字符"], ["bad", "重复"]],
  gen(inp) {
    const s = inp.split("");
    const last = {}, F = [];
    let L = 0, best = 0, bl = 0;
    for (let R = 0; R < s.length; R++) {
      const ch = s[R];
      if (last[ch] !== undefined && last[ch] >= L) {
        F.push({ parts: [{ t: "arr", vals: s, range: [L, R - 1], hl: { [R]: "bad", [last[ch]]: "bad" }, ptrs: { L, R }, cw: 38 }, { t: "map", title: "last_seen", entries: Object.entries(last), hl: ch }, { t: "text", text: "best = " + best }], note: "'" + e(ch) + "' 已经在窗口里（下标 " + last[ch] + "）。L 跳到 " + (last[ch] + 1) + "。" });
        L = last[ch] + 1;
      }
      last[ch] = R;
      if (R - L + 1 > best) { best = R - L + 1; bl = L; }
      F.push({ parts: [{ t: "arr", vals: s, range: [L, R], hl: { [R]: "active" }, ptrs: { L, R }, cw: 38 }, { t: "map", title: "last_seen", entries: Object.entries(last), hl: ch }, { t: "text", text: "best = " + best }], note: "窗口 [" + L + ", " + R + "] = \"" + e(s.slice(L, R + 1).join("")) + "\"，长度 " + (R - L + 1) + "。" });
    }
    F.push({ parts: [{ t: "arr", vals: s, range: [bl, bl + best - 1], cw: 38 }, { t: "text", text: "answer = " + best, c: "done" }], note: "最长无重复子串：\"" + e(s.slice(bl, bl + best).join("")) + "\"，长度 " + best + "。" });
    return F;
  },
};

A.word_count = {
  title: "哈希表统计词频（HR 真题第 8 题）",
  desc: "\"the sky is blue and the sun is yellow\"：一次遍历，把每个单词作为 key，次数作为 value。每次查找/更新是平均 O(1)，整体 O(n)。",
  input: "the sky is blue and the sun is yellow", inputLabel: "句子",
  legend: [["active", "当前单词"]],
  gen(inp) {
    const w = inp.trim().split(/\s+/).filter(Boolean);
    const cnt = new Map(), F = [];
    F.push({ parts: [{ t: "arr", vals: w, cw: 64 }, { t: "map", title: "count = {}", entries: [] }], note: "先 <code>split()</code> 得到单词列表，共 " + w.length + " 个单词。" });
    w.forEach((x, i) => {
      const had = cnt.has(x);
      cnt.set(x, (cnt.get(x) || 0) + 1);
      F.push({ parts: [{ t: "arr", vals: w, cw: 64, hl: { [i]: "active" }, ptrs: { i } }, { t: "map", title: "count", entries: [...cnt.entries()], hl: x }], note: had ? "'" + e(x) + "' 已存在，次数 +1 → " + cnt.get(x) + "。" : "'" + e(x) + "' 第一次出现，放进字典，次数 1。" });
    });
    F.push({ parts: [{ t: "map", title: "result", entries: [...cnt.entries()] }, { t: "text", text: "words = " + w.length + ", unique = " + cnt.size, c: "done" }], note: "单词总数 " + w.length + "，不同单词 " + cnt.size + " 个。时间 O(n)（n 为字符数），空间 O(k)（k 为不同单词数）。若要按次数排序输出再加 O(k log k)。" });
    return F;
  },
};

A.stack_parens = {
  title: "栈：括号匹配",
  desc: "遇到左括号入栈；遇到右括号，看栈顶是不是对应的左括号。最后栈必须为空。",
  input: "{[()()]}(", inputLabel: "s =",
  legend: [["active", "当前字符"], ["found", "匹配成功"], ["bad", "失败"]],
  gen(inp) {
    const s = inp.split(""), st = [], F = [];
    const pair = { ")": "(", "]": "[", "}": "{" };
    const fr = (i, k, note) => F.push({ parts: [{ t: "arr", vals: s, hl: i >= 0 ? { [i]: k } : {}, ptrs: i >= 0 ? { i } : null, cw: 36 }, { t: "arr", title: "stack（左边是栈底，右边是栈顶）", vals: st.length ? st.slice() : ["空"], noIdx: true, cw: 36, hl: st.length ? { [st.length - 1]: "active" } : { 0: "dim" } }], note });
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if ("([{".includes(c)) { st.push(c); fr(i, "active", "'" + c + "' 是左括号 → push。"); }
      else if (pair[c]) {
        if (st.length && st[st.length - 1] === pair[c]) { fr(i, "found", "'" + c + "' 和栈顶 '" + pair[c] + "' 配对 → pop。"); st.pop(); }
        else { fr(i, "bad", "'" + c + "' 找不到配对（栈顶是 " + (st.length ? "'" + st[st.length - 1] + "'" : "空") + "）→ return False"); return F; }
      }
    }
    fr(-1, "", st.length ? "扫描结束，但栈里还剩 " + st.length + " 个左括号没配对 → False" : "扫描结束且栈为空 → <b>True</b>");
    return F;
  },
};

A.mono_stack = {
  title: "单调栈：每天要等几天才更暖和（Daily Temperatures）",
  desc: "栈里存还没找到答案的下标，对应温度从栈底到栈顶递减。新温度更高时，不断弹出栈顶并给它填答案。每个下标最多进出一次，O(n)。",
  input: "73, 74, 75, 71, 69, 72, 76, 73", inputLabel: "温度",
  legend: [["active", "今天"], ["found", "被弹出并得到答案"]],
  gen(inp) {
    const t = nums(inp), ans = t.map(() => 0), st = [], F = [];
    const fr = (i, popped, note) => { const hl = {}; if (i >= 0) hl[i] = "active"; if (popped !== undefined) hl[popped] = "found"; F.push({ parts: [{ t: "arr", vals: t, hl, ptrs: i >= 0 ? { i } : null }, { t: "arr", title: "stack（存下标；栈顶在右）", vals: st.length ? st.map((k) => k + ":" + t[k]) : ["空"], noIdx: true, cw: 58 }, { t: "arr", title: "answer", vals: ans.slice(), cw: 44 }], note }); };
    for (let i = 0; i < t.length; i++) {
      while (st.length && t[i] > t[st[st.length - 1]]) {
        const j = st.pop();
        ans[j] = i - j;
        fr(i, j, t[i] + " &gt; " + t[j] + "（第 " + j + " 天）→ 第 " + j + " 天等 " + (i - j) + " 天。弹出。");
      }
      st.push(i);
      fr(i, undefined, "把第 " + i + " 天（" + t[i] + "）压栈，等待更暖的一天。");
    }
    fr(-1, undefined, "结束。栈里剩下的天没有更暖的一天，答案保持 0。");
    return F;
  },
};

A.list_reverse = {
  title: "反转链表：prev / curr / next 三指针",
  desc: "每一步：先用 nxt 记住下一个节点，再把 curr.next 指回 prev，然后 prev、curr 都向前走一步。",
  input: "1, 2, 3, 4, 5", inputLabel: "链表",
  legend: [["active", "curr"], ["done", "已反转部分"]],
  gen(inp) {
    const v = nums(inp), n = v.length, next = v.map((_, i) => (i + 1 < n ? i + 1 : null)), F = [];
    let prev = -1, curr = 0;
    const fr = (note, nx) => { const hl = {}; for (let k = 0; k <= prev; k++) hl[k] = "done"; if (curr < n) hl[curr] = "active"; const ptrs = { prev: prev < 0 ? -1 : prev, curr: curr >= n ? n : curr }; if (nx !== undefined) ptrs.nxt = nx; F.push({ parts: [{ t: "list", vals: v, next: next.slice(), hl, ptrs }], note }); };
    fr("prev = None, curr = head。");
    while (curr < n) {
      const nx = curr + 1 < n ? curr + 1 : n;
      fr("<code>nxt = curr.next</code>（先存起来，否则改完指针就找不到后面了）", nx);
      next[curr] = prev < 0 ? null : prev;
      fr("<code>curr.next = prev</code>：节点 " + v[curr] + " 改为指向 " + (prev < 0 ? "None" : v[prev]) + "。", nx);
      prev = curr; curr = nx;
      fr("<code>prev = curr; curr = nxt</code>：两个指针前进。");
    }
    fr("curr 为 None，结束。新的头是 prev（节点 " + v[n - 1] + "）。");
    return F;
  },
};

A.list_middle = {
  title: "快慢指针：找链表中点 / 判环",
  desc: "slow 每次走 1 步，fast 每次走 2 步。fast 走到底时 slow 正好在中点。如果有环，fast 迟早追上 slow。",
  input: "1, 2, 3, 4, 5, 6, 7", inputLabel: "链表",
  legend: [["active", "slow"], ["cmp", "fast"]],
  gen(inp) {
    const v = nums(inp), n = v.length, F = [];
    let s = 0, f = 0;
    const fr = (note) => { const hl = {}; if (f < n) hl[f] = "cmp"; hl[s] = "active"; F.push({ parts: [{ t: "list", vals: v, hl, ptrs: { slow: s, fast: f >= n ? n : f } }], note }); };
    fr("slow 和 fast 都从 head 出发。");
    while (f < n && f + 1 < n) { s += 1; f += 2; fr("slow 走 1 步到 " + v[s] + "，fast 走 2 步到 " + (f < n ? v[f] : "None") + "。"); }
    fr("fast 无法再走两步。slow 停在 <b>" + v[s] + "</b>，就是中点（偶数个节点时是靠后的那个）。");
    return F;
  },
};
})(window.ANIMS);
