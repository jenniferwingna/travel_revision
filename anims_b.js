// Animation generators, part B: binary search, sorting, recursion, trees, graphs, heap, DP.
(function (A) {
const { e, nums } = A._util;

A.bsearch = {
  title: "二分查找：每次排除一半",
  desc: "在有序数组里找 target。比较中间元素，target 更大就丢掉左半边，更小就丢掉右半边。闭区间写法：<code>while lo &lt;= hi</code>。",
  input: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91 | 23", inputLabel: "数组 | target",
  legend: [["cmp", "mid"], ["dim", "已排除"], ["found", "找到"]],
  gen(inp) {
    const [a, t] = inp.split("|");
    const arr = nums(a), target = Number(t), F = [];
    let lo = 0, hi = arr.length - 1;
    const fr = (note, mid, k) => { const hl = {}; arr.forEach((_, i) => { if (i < lo || i > hi) hl[i] = "dim"; }); if (mid !== undefined) hl[mid] = k || "cmp"; F.push({ parts: [{ t: "arr", vals: arr, hl, range: [lo, hi], ptrs: mid !== undefined ? { lo, mid, hi } : { lo, hi } }], note }); };
    fr("搜索区间 [lo, hi] = [0, " + hi + "]，target = " + target + "。");
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (arr[mid] === target) { fr("arr[" + mid + "] = " + arr[mid] + " == target，找到！比较了 " + (F.length) + " 次左右。", mid, "found"); return F; }
      if (arr[mid] < target) { fr("arr[mid] = " + arr[mid] + " &lt; " + target + " → target 在右边，<code>lo = mid + 1</code>", mid); lo = mid + 1; }
      else { fr("arr[mid] = " + arr[mid] + " &gt; " + target + " → target 在左边，<code>hi = mid - 1</code>", mid); hi = mid - 1; }
    }
    fr("lo &gt; hi，区间为空，不存在。此时 lo = " + lo + " 正好是 target 应该插入的位置。");
    return F;
  },
};

A.bsearch_answer = {
  title: "二分答案：findSmallestValueToPass（HR 真题第 9 题）",
  desc: "在 [x, y] 里找最小的、让 <code>checkPassFail(a)</code> 通过的值。前提：结果是单调的（小的都 fail，大到某个值后都 pass）。每次 measurement 很贵，二分只需 log₂(y-x) 次。",
  input: "0, 31 | 19", inputLabel: "x, y | 隐藏阈值",
  legend: [["bad", "测量 fail"], ["found", "测量 pass"], ["cmp", "本次测量"]],
  gen(inp) {
    const [r, th] = inp.split("|");
    const [x, y] = nums(r), T = Number(th);
    if (y - x > 40) throw new Error("范围请不超过 40，方便显示");
    const vals = []; for (let v = x; v <= y; v++) vals.push(v);
    const res = {}, F = [];
    let lo = x, hi = y, ans = null, calls = 0;
    const fr = (note, mid) => { const hl = {}; Object.entries(res).forEach(([v, ok]) => (hl[v - x] = ok ? "found" : "bad")); if (mid !== undefined) hl[mid - x] = "cmp"; F.push({ parts: [{ t: "arr", vals, hl, cw: 30, noIdx: true, range: lo <= hi ? [lo - x, hi - x] : null, ptrs: mid !== undefined ? { lo: lo - x, mid: mid - x, hi: hi - x } : {} }, { t: "text", text: "measurements = " + calls + "    ans = " + (ans === null ? "None" : ans) }], note }); };
    fr("不知道阈值在哪。线性扫描最坏要测 " + vals.length + " 次。");
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      calls++;
      const ok = mid >= T;
      res[mid] = ok;
      if (ok) { ans = mid; fr("check(" + mid + ") = PASS。它可能就是答案，记下 ans = " + mid + "，再去左边找更小的：<code>hi = mid - 1</code>", mid); hi = mid - 1; }
      else { fr("check(" + mid + ") = FAIL。答案一定更大：<code>lo = mid + 1</code>", mid); lo = mid + 1; }
    }
    fr("结束。最小通过值 = <b>" + ans + "</b>，只测量了 " + calls + " 次（线性要 " + (ans === null ? vals.length : ans - x + 1) + " 次）。若都不通过，返回 -1 / None。");
    return F;
  },
};

function sortFrames(arr, steps) { return steps; }

A.bubble = {
  title: "冒泡排序 Bubble Sort",
  desc: "相邻两个比较，逆序就交换；每一轮把最大的“冒”到最后。O(n²)。加 swapped 标志后，已排好序时只需一轮 O(n)。",
  input: "5, 1, 4, 2, 8, 3", inputLabel: "数组",
  legend: [["cmp", "比较"], ["swap", "交换"], ["done", "已就位"]],
  gen(inp) {
    const a = nums(inp), n = a.length, F = [], done = new Set();
    const fr = (note, hl) => { const h = {}; done.forEach((i) => (h[i] = "done")); Object.assign(h, hl || {}); F.push({ parts: [{ t: "arr", vals: a.slice(), hl: h, bars: true }], note }); };
    fr("初始数组。");
    for (let i = 0; i < n - 1; i++) {
      let sw = false;
      for (let j = 0; j < n - 1 - i; j++) {
        if (a[j] > a[j + 1]) { fr(a[j] + " &gt; " + a[j + 1] + "，交换。", { [j]: "swap", [j + 1]: "swap" }); [a[j], a[j + 1]] = [a[j + 1], a[j]]; sw = true; }
        else fr("比较 " + a[j] + " 和 " + a[j + 1] + "，顺序正确。", { [j]: "cmp", [j + 1]: "cmp" });
      }
      done.add(n - 1 - i);
      fr("第 " + (i + 1) + " 轮结束，" + a[n - 1 - i] + " 已就位。" + (sw ? "" : " 本轮没有交换 → 已经有序，提前结束。"));
      if (!sw) break;
    }
    a.forEach((_, i) => done.add(i));
    fr("排序完成。");
    return F;
  },
};

A.quick = {
  title: "快速排序 Quick Sort（Lomuto 分区）",
  desc: "选最后一个元素作 pivot，把小于 pivot 的放左边、其余放右边，pivot 落到最终位置；再递归排左右两段。平均 O(n log n)，最坏 O(n²)（已排序 + 总选末尾）。",
  input: "7, 2, 9, 4, 1, 8, 3, 6", inputLabel: "数组",
  legend: [["active", "pivot"], ["cmp", "j 正在看的元素"], ["swap", "交换"], ["done", "已就位"]],
  gen(inp) {
    const a = nums(inp), F = [], done = new Set();
    const fr = (note, hl, range, ptrs) => { const h = {}; done.forEach((i) => (h[i] = "done")); Object.assign(h, hl || {}); F.push({ parts: [{ t: "arr", vals: a.slice(), hl: h, bars: true, range, ptrs }], note }); };
    fr("初始数组。");
    const qs = (lo, hi) => {
      if (lo > hi) return;
      if (lo === hi) { done.add(lo); fr("区间 [" + lo + "] 只有一个元素，已就位。", {}, [lo, hi]); return; }
      const p = a[hi];
      let i = lo;
      fr("排序区间 [" + lo + ", " + hi + "]，pivot = " + p + "。i 标记“小于 pivot 区”的边界。", { [hi]: "active" }, [lo, hi], { i, j: lo });
      for (let j = lo; j < hi; j++) {
        if (a[j] < p) { fr(a[j] + " &lt; " + p + "：和 a[i] 交换，i++。", { [hi]: "active", [i]: "swap", [j]: "swap" }, [lo, hi], { i, j }); [a[i], a[j]] = [a[j], a[i]]; i++; }
        else fr(a[j] + " ≥ " + p + "：留在右边。", { [hi]: "active", [j]: "cmp" }, [lo, hi], { i, j });
      }
      [a[i], a[hi]] = [a[hi], a[i]];
      done.add(i);
      fr("把 pivot 换到 i = " + i + "。左边都 &lt; " + p + "，右边都 ≥ " + p + "。", {}, [lo, hi], { i });
      qs(lo, i - 1); qs(i + 1, hi);
    };
    qs(0, a.length - 1);
    fr("排序完成。");
    return F;
  },
};

A.merge = {
  title: "归并排序 Merge Sort",
  desc: "分：一直对半切到只剩一个元素。治：把两个有序段合并成一个有序段。稳定，始终 O(n log n)，需要 O(n) 额外空间。",
  input: "38, 27, 43, 3, 9, 82, 10", inputLabel: "数组",
  legend: [["cmp", "比较的两个元素"], ["done", "合并后的有序段"]],
  gen(inp) {
    const a = nums(inp), F = [];
    const fr = (note, hl, range) => F.push({ parts: [{ t: "arr", vals: a.slice(), hl: hl || {}, bars: true, range }], note });
    fr("初始数组。");
    const ms = (lo, hi) => {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1;
      fr("拆分 [" + lo + ", " + hi + "] → [" + lo + ", " + mid + "] 和 [" + (mid + 1) + ", " + hi + "]", {}, [lo, hi]);
      ms(lo, mid); ms(mid + 1, hi);
      const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1);
      let i = 0, j = 0, k = lo;
      while (i < L.length && j < R.length) {
        fr("合并：比较左段的 " + L[i] + " 和右段的 " + R[j] + "，取较小的。", { [lo + i]: "cmp", [mid + 1 + j]: "cmp" }, [lo, hi]);
        a[k++] = L[i] <= R[j] ? L[i++] : R[j++];
      }
      while (i < L.length) a[k++] = L[i++];
      while (j < R.length) a[k++] = R[j++];
      const h = {}; for (let t = lo; t <= hi; t++) h[t] = "done";
      fr("[" + lo + ", " + hi + "] 合并完成：" + a.slice(lo, hi + 1).join(", "), h, [lo, hi]);
    };
    ms(0, a.length - 1);
    return F;
  },
};

A.cyclic = {
  title: "循环排序 Cyclic Sort（HR 参考题 1 的算法）",
  desc: "前提：数组是 0..n-1 的一个排列。值 v 应该放在下标 v。在位置 i 上，只要 a[i] != i，就把 a[i] 换到它该去的位置。每次交换至少让一个数归位，O(n)。",
  input: "3, 5, 7, 9, 1, 4, 8, 0, 2, 6", inputLabel: "0..n-1 的排列",
  legend: [["active", "当前位置 i"], ["swap", "交换目标 a[a[i]]"], ["done", "已归位"]],
  gen(inp) {
    const a = nums(inp), n = a.length, F = [];
    const sorted = a.slice().sort((x, y) => x - y);
    if (sorted.some((v, i) => v !== i)) throw new Error("必须是 0.." + (n - 1) + " 的排列（否则会死循环或越界——这正是 C 参考答案的隐患）");
    const fr = (note, hl, i) => { const h = {}; a.forEach((v, k) => { if (v === k) h[k] = "done"; }); Object.assign(h, hl || {}); F.push({ parts: [{ t: "arr", vals: a.slice(), hl: h, ptrs: i !== undefined ? { i } : null }], note }); };
    fr("绿色表示 a[k] == k 已经在正确位置。");
    for (let i = 0; i < n; i++) {
      while (a[i] !== i) {
        const v = a[i];
        fr("a[" + i + "] = " + v + "，它应该在下标 " + v + "。交换 a[" + i + "] 和 a[" + v + "]。", { [i]: "active", [v]: "swap" }, i);
        [a[i], a[v]] = [a[v], a[i]];
      }
      fr("位置 " + i + " 已正确，i++。", { [i]: "done" }, i);
    }
    fr("完成，共 O(n) 次交换。注意参考答案调用 <code>sort(nArray, 9)</code> 时 n 表示“最大值”而不是“长度”，循环 i 从 1 到 9——能工作，但很容易被误读，是个面试可以指出的点。");
    return F;
  },
};

A.subsets = {
  title: "回溯：子集的决策树",
  desc: "对每个元素做一次决定：选 / 不选。树的每一层对应一个元素，叶子就是一个子集。共 2ⁿ 个叶子。DFS 走到叶子时记录答案，然后回溯（撤销选择）。",
  input: "1, 2, 3", inputLabel: "nums（最多 4 个）",
  legend: [["active", "当前路径"], ["found", "得到一个子集"]],
  gen(inp) {
    const v = nums(inp);
    if (v.length > 4) throw new Error("最多 4 个元素");
    const n = v.length, size = Math.pow(2, n + 1) - 1, labels = new Array(size).fill(null), F = [], out = [];
    labels[0] = "[]";
    const fill = (i, d, path) => { if (d === n) return; const L = 2 * i + 1, R = 2 * i + 2; labels[L] = "[" + path.concat(v[d]).join(",") + "]"; labels[R] = "[" + path.join(",") + "]"; fill(L, d + 1, path.concat(v[d])); fill(R, d + 1, path); };
    fill(0, 0, []);
    const tags = {};
    const fr = (pathIdx, note, leaf) => { const hl = {}, ehl = {}; pathIdx.forEach((k) => { hl[k] = "active"; ehl[k] = "active"; }); if (leaf !== undefined) hl[leaf] = "found"; F.push({ parts: [{ t: "tree", vals: labels.map((x) => x), hl, ehl, tags: Object.assign({}, tags), elabel: ["选", "不选"], leafW: n >= 4 ? 58 : 70, lh: 62 }, { t: "text", text: "result = " + (out.length ? out.map((x) => "[" + x + "]").join(" ") : "[]"), s: 13 }], note }); };
    const dfs = (i, d, path, pathIdx) => {
      if (d === n) { out.push(path.join(",")); tags[i] = "#" + out.length; fr(pathIdx, "到达叶子：记录子集 <code>[" + path.join(", ") + "]</code>。然后回溯。", i); return; }
      fr(pathIdx, "第 " + (d + 1) + " 层：决定是否选 " + v[d] + "。先走“选”的分支（path.append）。");
      dfs(2 * i + 1, d + 1, path.concat(v[d]), pathIdx.concat(2 * i + 1));
      fr(pathIdx, "回溯：<code>path.pop()</code> 撤销选 " + v[d] + "，走“不选”分支。");
      dfs(2 * i + 2, d + 1, path, pathIdx.concat(2 * i + 2));
    };
    dfs(0, 0, [], [0]);
    fr([], "全部 2^" + n + " = " + out.length + " 个子集已生成。时间 O(n·2ⁿ)。");
    return F;
  },
};

const SAMPLE_TREE = "4, 2, 6, 1, 3, 5, 7";
A.tree_traverse = {
  title: "二叉树遍历：前序 / 中序 / 后序 / 层序",
  desc: "前序 根-左-右；中序 左-根-右（BST 中序是升序）；后序 左-右-根；层序用队列一层一层访问（BFS）。数组按层序给出，null 表示空节点。",
  input: SAMPLE_TREE, inputLabel: "层序数组",
  modes: [["pre", "前序 Preorder"], ["in", "中序 Inorder"], ["post", "后序 Postorder"], ["bfs", "层序 BFS"]],
  legend: [["active", "正在访问"], ["done", "已访问"]],
  gen(inp, mode) {
    const vals = inp.split(/[\s,]+/).filter(Boolean).map((x) => (x === "null" || x === "None" ? null : Number(x)));
    if (vals.length > 15) throw new Error("最多 15 个位置");
    const order = [];
    const ok = (i) => i < vals.length && vals[i] !== null;
    const dfs = (i) => { if (!ok(i)) return; if (mode === "pre") order.push(i); dfs(2 * i + 1); if (mode === "in") order.push(i); dfs(2 * i + 2); if (mode === "post") order.push(i); };
    if (mode === "bfs") { const q = ok(0) ? [0] : []; while (q.length) { const i = q.shift(); order.push(i); if (ok(2 * i + 1)) q.push(2 * i + 1); if (ok(2 * i + 2)) q.push(2 * i + 2); } }
    else dfs(0);
    const names = { pre: "前序", in: "中序", post: "后序", bfs: "层序" };
    const F = [{ parts: [{ t: "tree", vals }, { t: "text", text: "output = []" }], note: names[mode || "pre"] + "遍历开始。" }];
    order.forEach((idx, k) => {
      const hl = {}, tags = {};
      order.slice(0, k).forEach((j, m) => { hl[j] = "done"; tags[j] = m + 1; });
      hl[idx] = "active"; tags[idx] = k + 1;
      F.push({ parts: [{ t: "tree", vals, hl, tags }, { t: "text", text: "output = [" + order.slice(0, k + 1).map((j) => vals[j]).join(", ") + "]" }], note: "访问 " + vals[idx] + "（第 " + (k + 1) + " 个）。蓝色数字是访问顺序。" });
    });
    return F;
  },
};

const GRID0 = "11000\n11010\n00100\n00011";
A.islands = {
  title: "网格 DFS：岛屿数量（flood fill）",
  desc: "扫描每个格子；遇到还没访问过的陆地 1，岛屿数 +1，然后从这里 DFS/BFS 把整座岛“淹掉”（标记为已访问），避免重复计数。",
  input: "11000/11010/00100/00011", inputLabel: "网格（行用 / 分隔）",
  legend: [["active", "当前格子"], ["found", "已淹没的陆地"]],
  gen(inp) {
    const g = inp.trim().split(/[\/\n]/).map((r) => r.trim().split(""));
    const R = g.length, C = g[0].length, seen = {}, F = [];
    let count = 0;
    const fr = (note, cur) => { const hl = {}; Object.keys(seen).forEach((k) => (hl[k] = "found")); if (cur) hl[cur] = "active"; F.push({ parts: [{ t: "grid", vals: g.map((r) => r.slice()), hl, colorOf: (v) => (v === "1" ? "var(--amber-soft)" : null) }, { t: "text", text: "islands = " + count }], note }); };
    fr("黄色是陆地 1，白色是水 0。");
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      if (g[r][c] === "1" && !seen[r + "," + c]) {
        count++;
        fr("(" + r + "," + c + ") 是新的陆地 → 岛屿数 = " + count + "，开始 DFS 淹没整座岛。", r + "," + c);
        const st = [[r, c]];
        seen[r + "," + c] = 1;
        while (st.length) {
          const [x, y] = st.pop();
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const a = x + dx, b = y + dy; if (a >= 0 && b >= 0 && a < R && b < C && g[a][b] === "1" && !seen[a + "," + b]) { seen[a + "," + b] = 1; st.push([a, b]); } });
          fr("访问 (" + x + "," + y + ")，把上下左右相连的陆地加入栈。", x + "," + y);
        }
      }
    }
    fr("扫描完成，共 <b>" + count + "</b> 个岛屿。时间 O(R·C)。");
    return F;
  },
};

A.bfs_grid = {
  title: "BFS：网格最短路径",
  desc: "BFS 按“距离”一圈一圈向外扩展，所以第一次到达终点时就是最短步数（每步代价相同时）。# 是墙。",
  input: "S..#..../.#.#.##./.#...#../...#.#.E", inputLabel: "地图（/ 分隔行）",
  legend: [["active", "当前出队"], ["found", "已访问（数字=步数）"]],
  gen(inp) {
    const rows = inp.trim().split("/").map((r) => r.split(""));
    const R = rows.length, C = rows[0].length, dist = {}, F = [];
    let s, t;
    rows.forEach((r, i) => r.forEach((ch, j) => { if (ch === "S") s = [i, j]; if (ch === "E") t = [i, j]; }));
    if (!s || !t) throw new Error("需要 S 和 E");
    const view = (cur) => { const hl = {}; Object.keys(dist).forEach((k) => (hl[k] = "found")); if (cur) hl[cur] = "active"; return { t: "grid", cw: 36, vals: rows.map((r, i) => r.map((ch, j) => (ch === "#" ? "#" : dist[i + "," + j] !== undefined && ch !== "S" && ch !== "E" ? dist[i + "," + j] : ch === "." ? "" : ch))), hl, colorOf: (v) => (v === "#" ? "var(--line)" : null) }; };
    const q = [s]; dist[s.join(",")] = 0;
    F.push({ parts: [view(s.join(","))], note: "从 S 出发，距离 0，放入队列。" });
    let level = -1;
    while (q.length) {
      const [x, y] = q.shift(), d = dist[x + "," + y];
      if (x === t[0] && y === t[1]) { F.push({ parts: [view(x + "," + y)], note: "到达 E！最短步数 = <b>" + d + "</b>。" }); return F; }
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const a = x + dx, b = y + dy, k = a + "," + b; if (a >= 0 && b >= 0 && a < R && b < C && rows[a][b] !== "#" && dist[k] === undefined) { dist[k] = d + 1; q.push([a, b]); } });
      if (d !== level) { level = d; F.push({ parts: [view(x + "," + y)], note: "扩展距离为 " + d + " 的格子，邻居标记为 " + (d + 1) + "。" }); }
    }
    F.push({ parts: [view()], note: "队列空了，E 不可达，返回 -1。" });
    return F;
  },
};

A.heap = {
  title: "最小堆：push 上浮 / pop 下沉",
  desc: "堆是用数组存的完全二叉树：下标 i 的孩子是 2i+1 和 2i+2，父亲是 (i-1)//2。最小堆保证父 ≤ 子，所以堆顶永远是最小值。push/pop 都是 O(log n)。Python：<code>heapq</code>。",
  input: "5, 3, 8, 1, 9, 2", inputLabel: "依次 push，然后 pop 两次",
  legend: [["active", "移动中的元素"], ["cmp", "比较对象"]],
  gen(inp) {
    const xs = nums(inp).slice(0, 10), h = [], F = [];
    const fr = (note, hl) => F.push({ parts: [{ t: "tree", vals: h.length ? h.slice() : ["空"], hl: hl || {} }, { t: "arr", title: "底层数组", vals: h.length ? h.slice() : ["空"], hl: hl || {} }], note });
    xs.forEach((x) => {
      h.push(x);
      let i = h.length - 1;
      fr("push " + x + "：先放到数组末尾（树的最后一个位置）。", { [i]: "active" });
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (h[p] > h[i]) { fr(h[i] + " &lt; 父亲 " + h[p] + "，上浮交换。", { [i]: "active", [p]: "cmp" }); [h[p], h[i]] = [h[i], h[p]]; i = p; }
        else { fr(h[i] + " ≥ 父亲 " + h[p] + "，停止。", { [i]: "active", [p]: "cmp" }); break; }
      }
    });
    for (let r = 0; r < 2 && h.length; r++) {
      const top = h[0];
      fr("pop：取出堆顶最小值 " + top + "，把最后一个元素移到堆顶。", { 0: "active" });
      const last = h.pop();
      if (h.length) {
        h[0] = last;
        let i = 0;
        fr(last + " 放到堆顶，开始下沉。", { 0: "active" });
        for (;;) {
          const l = 2 * i + 1, rr = 2 * i + 2;
          let m = i;
          if (l < h.length && h[l] < h[m]) m = l;
          if (rr < h.length && h[rr] < h[m]) m = rr;
          if (m === i) { fr(h[i] + " 不大于孩子，停止。", { [i]: "active" }); break; }
          fr(h[i] + " 比较小的孩子 " + h[m] + " 大，下沉交换。", { [i]: "active", [m]: "cmp" });
          [h[i], h[m]] = [h[m], h[i]]; i = m;
        }
      }
    }
    fr("完成。Top K 问题常用大小为 k 的堆：O(n log k)。");
    return F;
  },
};

A.dp_stairs = {
  title: "一维 DP：爬楼梯 dp[i] = dp[i-1] + dp[i-2]",
  desc: "到第 i 阶，最后一步要么从 i-1 跨 1 阶，要么从 i-2 跨 2 阶。把小问题的答案存在表里，不重复计算。",
  input: "8", inputLabel: "n =",
  legend: [["active", "正在计算"], ["cmp", "依赖的两个状态"]],
  gen(inp) {
    const n = parseInt(inp, 10);
    if (!(n >= 1 && n <= 20)) throw new Error("1~20");
    const dp = new Array(n + 1).fill(null), F = [];
    dp[0] = 1; dp[1] = 1;
    F.push({ parts: [{ t: "arr", vals: dp.slice(), title: "dp[i] = 走到第 i 阶的方法数" }], note: "base case：dp[0] = 1（站在地面算一种），dp[1] = 1。" });
    for (let i = 2; i <= n; i++) {
      F.push({ parts: [{ t: "arr", vals: dp.slice(), title: "dp", hl: { [i]: "active", [i - 1]: "cmp", [i - 2]: "cmp" } }], note: "dp[" + i + "] = dp[" + (i - 1) + "] + dp[" + (i - 2) + "] = " + dp[i - 1] + " + " + dp[i - 2] });
      dp[i] = dp[i - 1] + dp[i - 2];
      F.push({ parts: [{ t: "arr", vals: dp.slice(), title: "dp", hl: { [i]: "done" } }], note: "dp[" + i + "] = " + dp[i] + "。" });
    }
    F.push({ parts: [{ t: "arr", vals: dp.slice(), title: "dp" }, { t: "text", text: "answer = dp[" + n + "] = " + dp[n], c: "done" }], note: "O(n) 时间。只用到前两个值，所以空间可以优化到 O(1)。" });
    return F;
  },
};

A.dp_coin = {
  title: "一维 DP：零钱兑换 Coin Change（最少硬币数）",
  desc: "dp[a] = 凑出金额 a 的最少硬币数。对每种硬币 c：dp[a] = min(dp[a], dp[a-c] + 1)。",
  input: "1, 2, 5 | 11", inputLabel: "coins | amount",
  legend: [["active", "dp[a]"], ["cmp", "dp[a-c]"]],
  gen(inp) {
    const [cs, am] = inp.split("|");
    const coins = nums(cs), amount = Number(am);
    if (!(amount >= 0 && amount <= 20)) throw new Error("amount 0~20");
    const INF = "∞", dp = new Array(amount + 1).fill(Infinity), F = [];
    dp[0] = 0;
    const show = () => dp.map((v) => (v === Infinity ? INF : v));
    F.push({ parts: [{ t: "arr", vals: show(), title: "dp[a]，coins = [" + coins.join(", ") + "]" }], note: "dp[0] = 0，其它先设为 ∞（凑不出来）。" });
    for (let a = 1; a <= amount; a++) {
      coins.forEach((c) => {
        if (c <= a && dp[a - c] + 1 < dp[a]) {
          dp[a] = dp[a - c] + 1;
          F.push({ parts: [{ t: "arr", vals: show(), title: "dp", hl: { [a]: "active", [a - c]: "cmp" } }], note: "金额 " + a + "：用一枚 " + c + "，剩下 " + (a - c) + " 需要 " + dp[a - c] + " 枚 → dp[" + a + "] = " + dp[a] + "。" });
        }
      });
    }
    F.push({ parts: [{ t: "arr", vals: show(), title: "dp" }, { t: "text", text: "answer = " + (dp[amount] === Infinity ? -1 : dp[amount]), c: "done" }], note: "时间 O(amount × len(coins))。注意贪心（先拿最大面值）在某些硬币组合下是错的，例如 coins=[1,3,4], amount=6：贪心 4+1+1=3 枚，DP 得 3+3=2 枚。" });
    return F;
  },
};

A.dp_lcs = {
  title: "二维 DP：最长公共子序列 LCS",
  desc: "dp[i][j] = a 的前 i 个字符和 b 的前 j 个字符的 LCS 长度。字符相等：dp[i-1][j-1] + 1；不等：max(上, 左)。",
  input: "ABCBDAB | BDCABA", inputLabel: "a | b",
  legend: [["active", "dp[i][j]"], ["cmp", "依赖格"]],
  gen(inp) {
    const [a, b] = inp.split("|").map((x) => x.trim());
    if (a.length > 9 || b.length > 9) throw new Error("每个字符串最多 9 个字符");
    const m = a.length, n = b.length, dp = [], F = [];
    for (let i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(i === 0 ? 0 : null).map((v, j) => (j === 0 ? 0 : v)));
    const part = (hl) => ({ t: "grid", vals: dp.map((r) => r.map((v) => (v === null ? "" : v))), hl, rowLabels: ["∅"].concat(a.split("")), colLabels: ["∅"].concat(b.split("")) });
    F.push({ parts: [part({})], note: "第 0 行和第 0 列是空串，LCS = 0。" });
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; F.push({ parts: [part({ [i + "," + j]: "active", [i - 1 + "," + (j - 1)]: "cmp" })], note: "a[" + (i - 1) + "] = b[" + (j - 1) + "] = '" + e(a[i - 1]) + "'：左上 + 1 = " + dp[i][j] }); }
      else { dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); F.push({ parts: [part({ [i + "," + j]: "active", [i - 1 + "," + j]: "cmp", [i + "," + (j - 1)]: "cmp" })], note: "'" + e(a[i - 1]) + "' ≠ '" + e(b[j - 1]) + "'：取 max(上 " + dp[i - 1][j] + ", 左 " + dp[i][j - 1] + ") = " + dp[i][j] }); }
    }
    F.push({ parts: [part({ [m + "," + n]: "done" }), { t: "text", text: "LCS length = " + dp[m][n], c: "done" }], note: "右下角就是答案。O(m·n) 时间和空间。" });
    return F;
  },
};

A.kadane = {
  title: "Kadane：最大子数组和",
  desc: "cur = 以当前元素结尾的最大和。如果之前的 cur 是负数，就丢掉它从当前元素重新开始：cur = max(x, cur + x)。",
  input: "-2, 1, -3, 4, -1, 2, 1, -5, 4", inputLabel: "数组",
  legend: [["active", "当前元素"]],
  gen(inp) {
    const a = nums(inp), F = [];
    let cur = a[0], best = a[0], s = 0, bs = 0, be = 0;
    F.push({ parts: [{ t: "arr", vals: a, range: [0, 0], hl: { 0: "active" } }, { t: "text", text: "cur = " + cur + "   best = " + best }], note: "从第一个元素开始。" });
    for (let i = 1; i < a.length; i++) {
      let note;
      if (cur + a[i] < a[i]) { cur = a[i]; s = i; note = "之前的和是负数，拖后腿 → 从 " + a[i] + " 重新开始。"; }
      else { cur += a[i]; note = "接上 " + a[i] + "，cur = " + cur + "。"; }
      if (cur > best) { best = cur; bs = s; be = i; note += " 刷新 best = " + best + "。"; }
      F.push({ parts: [{ t: "arr", vals: a, range: [s, i], hl: { [i]: "active" } }, { t: "text", text: "cur = " + cur + "   best = " + best }], note });
    }
    F.push({ parts: [{ t: "arr", vals: a, range: [bs, be] }, { t: "text", text: "answer = " + best, c: "done" }], note: "最大子数组是下标 [" + bs + ", " + be + "]，和 = " + best + "。O(n) 时间 O(1) 空间。" });
    return F;
  },
};
})(window.ANIMS);
