// Python test harness shared by the Pyodide worker and the Brython fallback.
window.RUNNER_PY = String.raw`
import json, sys, io, traceback, contextlib

__PRELUDE = '''
import math, collections, heapq, bisect, itertools, functools, string, re, random
from collections import Counter, defaultdict, deque, OrderedDict
from heapq import heappush, heappop, heapify, nlargest, nsmallest
from functools import lru_cache, reduce
from typing import List, Optional, Dict, Tuple

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    def __repr__(self):
        return "ListNode(%r)" % (self.val,)

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
    def __repr__(self):
        return "TreeNode(%r)" % (self.val,)

def from_arr(a):
    dummy = ListNode()
    cur = dummy
    for v in a:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def to_arr(head, limit=10000):
    out = []
    while head is not None and len(out) < limit:
        out.append(head.val)
        head = head.next
    return out

def from_arr_cycle(a, pos):
    head = from_arr(a)
    if pos < 0 or head is None:
        return head
    nodes = []
    cur = head
    while cur:
        nodes.append(cur)
        cur = cur.next
    nodes[-1].next = nodes[pos]
    return head

def build_tree(a):
    if not a or a[0] is None:
        return None
    root = TreeNode(a[0])
    q = deque([root])
    i = 1
    while q and i < len(a):
        node = q.popleft()
        if i < len(a) and a[i] is not None:
            node.left = TreeNode(a[i])
            q.append(node.left)
        i += 1
        if i < len(a) and a[i] is not None:
            node.right = TreeNode(a[i])
            q.append(node.right)
        i += 1
    return root

def tree_to_arr(root):
    out = []
    q = deque([root])
    while q:
        n = q.popleft()
        if n is None:
            out.append(None)
            continue
        out.append(n.val)
        q.append(n.left)
        q.append(n.right)
    while out and out[-1] is None:
        out.pop()
    return out

def find_node(root, val):
    if root is None or root.val == val:
        return root
    return find_node(root.left, val) or find_node(root.right, val)

def inplace(fn, arr, *rest):
    fn(arr, *rest)
    return arr

def run_ops(cls, ops, args):
    obj = cls(*args[0])
    out = [None]
    for op, a in zip(ops[1:], args[1:]):
        out.append(getattr(obj, op)(*a))
    return out

class Meter:
    """Simulates checkPassFail(a): passes when a >= threshold, and counts how many times it was called."""
    def __init__(self, threshold):
        self.threshold = threshold
        self.calls = 0
    def __call__(self, a):
        self.calls += 1
        return a >= self.threshold
'''

__H = {}
exec(__PRELUDE, __H)

def __short(s, n=400):
    return s if len(s) <= n else s[:n] + " ..."

def __fmt_exc():
    et, ev, tb = sys.exc_info()
    try:
        if isinstance(ev, SyntaxError):
            return "SyntaxError (line %s): %s\n    %s" % (ev.lineno, ev.msg, (ev.text or "").rstrip())
        frames = [f for f in traceback.extract_tb(tb) if f.filename == "solution.py"]
        lines = ["  line %d, in %s: %s" % (f.lineno, f.name, (f.line or "").strip()) for f in frames[-4:]]
        return "\n".join(lines + ["%s: %s" % (et.__name__, ev)])
    except Exception:
        return "%s: %s" % (et.__name__, ev)

def __norm(x, mode):
    if mode == "sorted":
        return sorted(x)
    if mode == "nested":
        return sorted(sorted(i) for i in x)
    if mode == "set":
        return set(x)
    return x

def __cmp(got, exp, mode):
    if mode == "float":
        return abs(got - exp) < 1e-5
    return __norm(got, mode) == __norm(exp, mode)

def __run_all(code, cases_json):
    cases = json.loads(cases_json)
    buf = io.StringIO()
    res = {"stdout": "", "results": [], "fatal": None}
    ns = dict(__H)
    ns["__name__"] = "__main__"
    with contextlib.redirect_stdout(buf):
        try:
            exec(compile(code, "solution.py", "exec"), ns)
        except BaseException:
            res["fatal"] = __fmt_exc()
        if res["fatal"] is None:
            for c in cases:
                call, exp = c[0], c[1]
                mode = c[2] if len(c) > 2 else ""
                r = {"call": call, "expect": exp}
                try:
                    expv = eval(exp, ns)
                    got = eval(call, ns)
                    r["got"] = __short(repr(got))
                    r["ok"] = bool(__cmp(got, expv, mode))
                except BaseException:
                    r["ok"] = False
                    r["err"] = __fmt_exc()
                res["results"].append(r)
    res["stdout"] = buf.getvalue()[:20000]
    return json.dumps(res)
`;
