// Chapters: Binary trees, Graphs (BFS / DFS).
window.CHAPTERS.push({
  id: "trees", order: 20, num: "12", group: "算法专题 Algorithms", title: "二叉树", en: "Binary trees",
  concept: String.raw`
<h2>1. 结构与术语</h2>
~~~py
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
~~~
<p>根 root、叶子 leaf（没有孩子）、深度 depth、高度 height。<b>二叉搜索树 BST</b>：左子树所有值 &lt; 根 &lt; 右子树所有值，中序遍历是升序，查找平均 O(log n)（平衡时），退化成链表时 O(n)。</p>
<p>练习题环境内置 <code>build_tree([3, 9, 20, None, None, 15, 7])</code>（层序数组 → 树）和 <code>tree_to_arr(root)</code>。</p>

<h2>2. 遍历（看动画切换四种模式）</h2>
~~~py
def preorder(root):            # 根 左 右
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def inorder(root):             # 左 根 右
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

from collections import deque
def level_order(root):         # BFS，一层一层
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):          # 当前这一层有 len(q) 个节点
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res
~~~

<h2>3. 树题的思考方式</h2>
<p>绝大多数树题都是：<b>“如果左右子树的答案已知，当前节点的答案是什么？”</b> 然后写递归。</p>
<ul>
<li>最大深度 = 1 + max(左深度, 右深度)</li>
<li>是否相同 = 根值相等 and 左相同 and 右相同</li>
<li>翻转 = 交换左右，再分别翻转</li>
</ul>
<p>需要“从上往下传信息”时（比如验证 BST 的上下界），给递归函数加参数。</p>
<div class="vocab"><div><b>root / leaf / subtree</b>根/叶/子树</div><div><b>depth / height</b>深度/高度</div><div><b>preorder / inorder / postorder</b>前/中/后序</div><div><b>level-order traversal (BFS)</b>层序</div><div><b>binary search tree (BST)</b>二叉搜索树</div><div><b>balanced</b>平衡</div></div>
`,
  anims: ["tree_traverse"],
  problems: [
    {
      id: "max-depth", title: "Maximum Depth of Binary Tree", diff: "Easy", tags: ["recursion"], short: "树的最大深度",
      en: "Return the maximum depth (number of nodes along the longest root-to-leaf path).",
      examples: "max_depth(build_tree([3, 9, 20, None, None, 15, 7])) -> 3",
      zh: "1 + max(左, 右)；空树深度 0。",
      starter: String.raw`def max_depth(root):
    pass
`,
      tests: [["max_depth(build_tree([3, 9, 20, None, None, 15, 7]))", "3"], ["max_depth(build_tree([1, None, 2]))", "2"], ["max_depth(None)", "0"], ["max_depth(build_tree([1]))", "1"]],
      hints: ["<code>if not root: return 0</code>"],
      solution: String.raw`def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
`,
      cx: "O(n) time, O(h) stack",
    },
    {
      id: "inorder", title: "Inorder Traversal (iterative)", diff: "Easy", tags: ["stack"], short: "用栈实现中序遍历（不用递归）",
      en: "Return the inorder traversal of the tree's values. Implement it iteratively with an explicit stack.",
      examples: "inorder_traversal(build_tree([1, None, 2, 3])) -> [1, 3, 2]",
      zh: "一路向左压栈；弹出一个节点访问它，再转向它的右子树。",
      starter: String.raw`def inorder_traversal(root):
    pass
`,
      tests: [["inorder_traversal(build_tree([1, None, 2, 3]))", "[1, 3, 2]"], ["inorder_traversal(build_tree([4, 2, 6, 1, 3, 5, 7]))", "[1, 2, 3, 4, 5, 6, 7]"], ["inorder_traversal(None)", "[]"]],
      hints: ["<code>while cur or st: while cur: st.append(cur); cur = cur.left</code>"],
      solution: String.raw`def inorder_traversal(root):
    res, st, cur = [], [], root
    while cur or st:
        while cur:
            st.append(cur)
            cur = cur.left
        cur = st.pop()
        res.append(cur.val)
        cur = cur.right
    return res
`,
      explain: "面试官常问“递归会有什么问题”：树很深时栈溢出。用显式栈可以避免。", cx: "O(n) time, O(h) space",
    },
    {
      id: "same-tree", title: "Same Tree", diff: "Easy", tags: ["recursion"], short: "两棵树是否完全相同",
      en: "Return True if two binary trees are structurally identical and have the same values.",
      examples: "is_same_tree(build_tree([1,2,3]), build_tree([1,2,3])) -> True",
      zh: "都空 → True；一个空 → False；值不同 → False；否则递归左右。",
      starter: String.raw`def is_same_tree(p, q):
    pass
`,
      tests: [["is_same_tree(build_tree([1,2,3]), build_tree([1,2,3]))", "True"], ["is_same_tree(build_tree([1,2]), build_tree([1,None,2]))", "False"], ["is_same_tree(None, None)", "True"], ["is_same_tree(build_tree([1,2,1]), build_tree([1,1,2]))", "False"]],
      hints: ["<code>if not p or not q: return p is q</code>"],
      solution: String.raw`def is_same_tree(p, q):
    if not p or not q:
        return p is q
    return p.val == q.val and is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)
`,
      cx: "O(n)",
    },
    {
      id: "invert-tree", title: "Invert Binary Tree", diff: "Easy", tags: ["recursion"], short: "镜像翻转二叉树",
      en: "Invert (mirror) a binary tree and return its root.",
      examples: "[4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]",
      zh: "交换左右孩子，然后递归。",
      starter: String.raw`def invert_tree(root):
    pass
`,
      tests: [["tree_to_arr(invert_tree(build_tree([4,2,7,1,3,6,9])))", "[4,7,2,9,6,3,1]"], ["tree_to_arr(invert_tree(build_tree([2,1,3])))", "[2,3,1]"], ["invert_tree(None)", "None"]],
      hints: ["<code>root.left, root.right = invert_tree(root.right), invert_tree(root.left)</code>"],
      solution: String.raw`def invert_tree(root):
    if root:
        root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root
`,
      cx: "O(n)",
    },
    {
      id: "level-order", title: "Level Order Traversal", diff: "Medium", tags: ["BFS"], short: "按层输出节点值",
      en: "Return the level order traversal as a list of levels, each level a list of values from left to right.",
      examples: "level_order(build_tree([3,9,20,None,None,15,7])) -> [[3], [9, 20], [15, 7]]",
      zh: "BFS + 每层先记下 len(q)。",
      starter: String.raw`def level_order(root):
    pass
`,
      tests: [["level_order(build_tree([3,9,20,None,None,15,7]))", "[[3], [9, 20], [15, 7]]"], ["level_order(build_tree([1]))", "[[1]]"], ["level_order(None)", "[]"], ["level_order(build_tree([1,2,3,4,None,None,5]))", "[[1],[2,3],[4,5]]"]],
      hints: ["看知识点模板。"],
      solution: String.raw`def level_order(root):
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        res.append(level)
    return res
`,
      cx: "O(n) time, O(width) space",
    },
    {
      id: "validate-bst", title: "Validate Binary Search Tree", diff: "Medium", tags: ["BST"], short: "判断是不是合法 BST",
      en: "Return True if the tree is a valid BST: every node's left subtree has only smaller values, right subtree only larger values.",
      examples: "is_valid_bst(build_tree([2, 1, 3])) -> True\nis_valid_bst(build_tree([5, 1, 4, None, None, 3, 6])) -> False",
      zh: "只比较父子是错的（[5,4,6,null,null,3,7] 中 3 在 5 的右子树里）。要向下传递上下界 (low, high)。",
      starter: String.raw`def is_valid_bst(root):
    pass
`,
      tests: [["is_valid_bst(build_tree([2, 1, 3]))", "True"], ["is_valid_bst(build_tree([5, 1, 4, None, None, 3, 6]))", "False"], ["is_valid_bst(build_tree([5, 4, 6, None, None, 3, 7]))", "False"], ["is_valid_bst(build_tree([2, 2, 2]))", "False"], ["is_valid_bst(None)", "True"]],
      hints: ["<code>def ok(node, low, high)</code>，初始 <code>ok(root, float('-inf'), float('inf'))</code>。", "或者：中序遍历必须严格递增。"],
      solution: String.raw`def is_valid_bst(root):
    def ok(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return ok(node.left, low, node.val) and ok(node.right, node.val, high)

    return ok(root, float("-inf"), float("inf"))
`,
      cx: "O(n)",
    },
    {
      id: "lca-bst", title: "Lowest Common Ancestor of a BST", diff: "Medium", tags: ["BST"], short: "BST 中两个节点的最近公共祖先",
      en: "Given a BST and two values p and q that exist in it, return the value of their lowest common ancestor.",
      examples: "lca_bst(build_tree([6,2,8,0,4,7,9,None,None,3,5]), 2, 8) -> 6\nlca_bst(..., 2, 4) -> 2",
      zh: "利用 BST 性质：两个都比当前小 → 去左边；都大 → 去右边；否则当前节点就是分叉点。",
      starter: String.raw`def lca_bst(root, p, q):
    pass
`,
      tests: [["lca_bst(build_tree([6,2,8,0,4,7,9,None,None,3,5]), 2, 8)", "6"], ["lca_bst(build_tree([6,2,8,0,4,7,9,None,None,3,5]), 2, 4)", "2"], ["lca_bst(build_tree([6,2,8,0,4,7,9,None,None,3,5]), 3, 5)", "4"], ["lca_bst(build_tree([2,1]), 2, 1)", "2"]],
      hints: ["迭代即可：<code>while root:</code>"],
      solution: String.raw`def lca_bst(root, p, q):
    while root:
        if p < root.val and q < root.val:
            root = root.left
        elif p > root.val and q > root.val:
            root = root.right
        else:
            return root.val
`,
      cx: "O(h) time, O(1) space",
    },
  ],
});

window.CHAPTERS.push({
  id: "graphs", order: 21, num: "13", group: "算法专题 Algorithms", title: "图：BFS 与 DFS", en: "Graphs: BFS & DFS",
  concept: String.raw`
<h2>1. 图的表示</h2>
~~~py
# 邻接表 adjacency list（最常用）
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)          # 无向图加双向
# 网格 grid 本身就是图：每个格子和上下左右相连
DIRS = [(1, 0), (-1, 0), (0, 1), (0, -1)]
~~~

<h2>2. DFS vs BFS</h2>
<div class="tblwrap"><table>
<tr><th></th><th>DFS 深度优先</th><th>BFS 广度优先</th></tr>
<tr><td>数据结构</td><td>栈（或递归）</td><td>队列 deque</td></tr>
<tr><td>擅长</td><td>连通性、找所有路径、拓扑排序、判环</td><td><b>无权图最短路径</b>、按层处理</td></tr>
<tr><td>复杂度</td><td colspan="2">都是 O(V + E)；网格是 O(R × C)</td></tr>
</table></div>
~~~py
def bfs(start, target):
    q = deque([start])
    dist = {start: 0}               # 兼做 visited
    while q:
        u = q.popleft()
        if u == target:
            return dist[u]
        for v in graph[u]:
            if v not in dist:       # 入队时就标记，避免重复入队
                dist[v] = dist[u] + 1
                q.append(v)
    return -1
~~~
<div class="note warn"><b class="lbl">必须标记 visited</b>否则在有环的图里会无限循环。网格题常见做法是把访问过的 '1' 改成 '0'（“淹掉”）。</div>

<h2>3. 拓扑排序（有依赖关系的任务顺序）</h2>
<p>Kahn 算法：统计每个点的入度；入度为 0 的点入队；出队时把它指向的点入度 -1，变成 0 就入队。最后如果没处理完所有点，说明有环（循环依赖）。</p>
<p>工程联系：编译依赖、任务调度、死锁检测（等待图中有环 = 死锁）。</p>
<div class="vocab"><div><b>vertex / edge</b>顶点/边</div><div><b>adjacency list</b>邻接表</div><div><b>connected component</b>连通分量</div><div><b>visited set</b>访问标记</div><div><b>topological sort</b>拓扑排序</div><div><b>directed acyclic graph (DAG)</b>有向无环图</div></div>
`,
  anims: ["islands", "bfs_grid"],
  problems: [
    {
      id: "flood-fill", title: "Flood Fill", diff: "Easy", tags: ["DFS"], short: "像画图软件的油漆桶",
      en: "Starting from pixel (sr, sc), change its color and the color of all 4-directionally connected pixels of the same original color to new_color. Return the image.",
      examples: "flood_fill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2) -> [[2,2,2],[2,2,0],[2,0,1]]",
      zh: "如果原颜色已经等于新颜色，直接返回（否则会无限递归）。",
      starter: String.raw`def flood_fill(image, sr, sc, new_color):
    pass
`,
      tests: [["flood_fill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2)", "[[2,2,2],[2,2,0],[2,0,1]]"], ["flood_fill([[0,0,0],[0,0,0]], 0, 0, 0)", "[[0,0,0],[0,0,0]]"], ["flood_fill([[0,1],[1,0]], 0, 0, 5)", "[[5,1],[1,0]]"]],
      hints: ["<code>old = image[sr][sc]; if old == new_color: return image</code>"],
      solution: String.raw`def flood_fill(image, sr, sc, new_color):
    old = image[sr][sc]
    if old == new_color:
        return image
    R, C = len(image), len(image[0])

    def dfs(r, c):
        if r < 0 or c < 0 or r >= R or c >= C or image[r][c] != old:
            return
        image[r][c] = new_color
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    dfs(sr, sc)
    return image
`,
      cx: "O(R·C)",
    },
    {
      id: "num-islands", title: "Number of Islands", diff: "Medium", tags: ["DFS/BFS"], short: "岛屿数量（看动画）",
      en: "grid is a 2D list of '1' (land) and '0' (water). Count the islands (groups of land connected horizontally or vertically).",
      examples: "num_islands([['1','1','0'],['0','1','0'],['0','0','1']]) -> 2",
      zh: "遇到 '1' 计数 +1，然后把整座岛淹成 '0'。",
      starter: String.raw`def num_islands(grid):
    pass
`,
      tests: [["num_islands([list('11110'), list('11010'), list('11000'), list('00000')])", "1"], ["num_islands([list('11000'), list('11000'), list('00100'), list('00011')])", "3"], ["num_islands([list('0')])", "0"], ["num_islands([list('101'), list('010'), list('101')])", "5"]],
      hints: ["写 <code>sink(r, c)</code>，用栈或递归。"],
      solution: String.raw`def num_islands(grid):
    R, C = len(grid), len(grid[0])
    count = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == "1":
                count += 1
                stack = [(r, c)]
                grid[r][c] = "0"
                while stack:
                    x, y = stack.pop()
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        a, b = x + dx, y + dy
                        if 0 <= a < R and 0 <= b < C and grid[a][b] == "1":
                            grid[a][b] = "0"
                            stack.append((a, b))
    return count
`,
      explain: "用显式栈代替递归，避免大网格时递归太深。", cx: "O(R·C)",
    },
    {
      id: "shortest-path-grid", title: "Shortest Path in a Grid", diff: "Medium", tags: ["BFS"], short: "从左上到右下最少几步（0 可走 1 是墙）",
      en: "grid contains 0 (open) and 1 (wall). Moving up/down/left/right, return the minimum number of steps from (0, 0) to (R-1, C-1), or -1 if impossible. If start equals end, the answer is 0.",
      examples: "shortest_path([[0,0,0],[1,1,0],[0,0,0]]) -> 4",
      zh: "BFS 第一次到达终点就是最短。",
      starter: String.raw`def shortest_path(grid):
    pass
`,
      tests: [["shortest_path([[0,0,0],[1,1,0],[0,0,0]])", "4"], ["shortest_path([[0,1],[1,0]])", "-1"], ["shortest_path([[0]])", "0"], ["shortest_path([[1,0],[0,0]])", "-1"], ["shortest_path([[0,0,0,0],[1,1,1,0],[0,0,0,0],[0,1,1,1],[0,0,0,0]])", "13"]],
      hints: ["队列里存 <code>(r, c, dist)</code>；起点是墙直接 -1。"],
      solution: String.raw`def shortest_path(grid):
    R, C = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[R - 1][C - 1] == 1:
        return -1
    q = deque([(0, 0, 0)])
    seen = {(0, 0)}
    while q:
        r, c, d = q.popleft()
        if (r, c) == (R - 1, C - 1):
            return d
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            a, b = r + dr, c + dc
            if 0 <= a < R and 0 <= b < C and grid[a][b] == 0 and (a, b) not in seen:
                seen.add((a, b))
                q.append((a, b, d + 1))
    return -1
`,
      cx: "O(R·C)",
    },
    {
      id: "count-components", title: "Number of Connected Components", diff: "Medium", tags: ["DFS", "graph"], short: "无向图有几个连通分量",
      en: "There are n nodes labelled 0..n-1 and a list of undirected edges. Return the number of connected components.",
      examples: "count_components(5, [[0, 1], [1, 2], [3, 4]]) -> 2",
      zh: "建邻接表；从每个没访问过的点出发 DFS，计数 +1。（也可以用并查集 Union-Find。）",
      starter: String.raw`def count_components(n, edges):
    pass
`,
      tests: [["count_components(5, [[0, 1], [1, 2], [3, 4]])", "2"], ["count_components(5, [[0,1],[1,2],[2,3],[3,4]])", "1"], ["count_components(3, [])", "3"], ["count_components(4, [[0, 1], [2, 3], [1, 0]])", "2"]],
      hints: ["<code>graph = defaultdict(list)</code>；<code>seen = set()</code>。"],
      solution: String.raw`def count_components(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    seen = set()
    count = 0
    for s in range(n):
        if s in seen:
            continue
        count += 1
        stack = [s]
        seen.add(s)
        while stack:
            u = stack.pop()
            for v in graph[u]:
                if v not in seen:
                    seen.add(v)
                    stack.append(v)
    return count
`,
      cx: "O(V + E)",
    },
    {
      id: "course-schedule", title: "Course Schedule", diff: "Medium", tags: ["topological sort"], short: "有先修关系的课能否全部修完（判环）",
      en: "There are n courses 0..n-1. prerequisites[i] = [a, b] means you must take b before a. Return True if you can finish all courses (i.e. there is no cycle).",
      examples: "can_finish(2, [[1, 0]]) -> True\ncan_finish(2, [[1, 0], [0, 1]]) -> False",
      zh: "Kahn 拓扑排序：能处理完所有点就没有环。",
      starter: String.raw`def can_finish(n, prerequisites):
    pass
`,
      tests: [["can_finish(2, [[1, 0]])", "True"], ["can_finish(2, [[1, 0], [0, 1]])", "False"], ["can_finish(4, [[1,0],[2,1],[3,2]])", "True"], ["can_finish(3, [[0,1],[1,2],[2,0]])", "False"], ["can_finish(1, [])", "True"]],
      hints: ["边 b → a，<code>indeg[a] += 1</code>。"],
      solution: String.raw`def can_finish(n, prerequisites):
    graph = defaultdict(list)
    indeg = [0] * n
    for a, b in prerequisites:
        graph[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    done = 0
    while q:
        u = q.popleft()
        done += 1
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return done == n
`,
      cx: "O(V + E)",
    },
  ],
});
