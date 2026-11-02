(function () {
"use strict";
const CH = (window.CHAPTERS || []).slice().sort((a, b) => a.order - b.order);
const ANIMS = window.ANIMS || {};
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- storage (per-viewer convenience only) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem("bbp:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("bbp:" + k, JSON.stringify(v)); } catch (e) {} },
};
let solved = store.get("solved", {});

/* ---------- syntax highlight ---------- */
const PYKW = new Set("def class return if elif else for while in not and or is None True False import from as with try except finally raise lambda yield pass break continue global nonlocal del assert".split(" "));
const CKW = new Set("int char void unsigned signed bool long short float double return if else for while do sizeof struct typedef include define static const volatile switch case break continue NULL new delete true false class public private auto extern union enum".split(" "));
function hl(src, lang) {
  const c = lang === "c";
  const kw = c ? CKW : PYKW;
  const re = c
    ? /(\/\/.*$|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?[uUlLfF]*\b)|(#\s*\w+)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/gm
    : /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|\b[rbf]?"(?:\\.|[^"\\\n])*"|\b[rbf]?'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b0x[0-9a-fA-F]+\b|\b0b[01]+\b|\b\d+(?:\.\d+)?\b)|(@\w+)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/gm;
  const sp = (k, t) => '<span class="tk-' + k + '">' + esc(t) + "</span>";
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const t = m[0];
    if (m[1]) out += sp("com", t);
    else if (m[2]) out += sp("str", t);
    else if (m[3]) out += sp("num", t);
    else if (m[4]) out += sp(c ? "kw" : "fn", t);
    else if (m[5]) out += kw.has(t) ? sp("kw", t) : sp("fn", t);
    else out += kw.has(t) ? sp("kw", t) : esc(t);
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}
function codeBlock(src, lang) {
  const l = lang === "c" || lang === "cpp" ? "c" : lang === "text" ? "text" : "py";
  const body = l === "text" ? esc(src) : hl(src, l);
  return '<pre class="code" data-lang="' + (lang || "py") + '">' + body + "</pre>";
}
// Content strings use ~~~lang ... ~~~ fences for code (template literals can't hold backticks).
function richen(html) {
  return String(html || "").replace(/~~~(\w*)\n([\s\S]*?)\n?~~~/g, (_, lang, code) => codeBlock(code.replace(/^\n+|\s+$/g, ""), lang || "py"));
}

/* ---------- text to speech for English practice ---------- */
function speak(text, rate) {
  if (!("speechSynthesis" in window)) { return false; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate || 0.95;
  const vs = window.speechSynthesis.getVoices();
  const v = vs.find((x) => /en[-_]US/i.test(x.lang) && /Samantha|Google US|Aria|Jenny/i.test(x.name)) || vs.find((x) => /^en/i.test(x.lang));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
  return true;
}
function speakButtons(text) {
  const id = "s" + Math.random().toString(36).slice(2, 8);
  speakStore[id] = text;
  return '<div class="btnrow"><button class="btn sm" data-speak="' + id + '" data-rate="0.95">朗读 Read aloud</button><button class="btn sm" data-speak="' + id + '" data-rate="0.75">慢速 Slow</button><button class="btn sm" data-stop="1">停止</button></div>';
}
const speakStore = {};
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-speak]");
  if (b) {
    const ok = speak(speakStore[b.dataset.speak], parseFloat(b.dataset.rate));
    if (!ok) b.textContent = "此浏览器不支持朗读";
  }
  if (e.target.closest("[data-stop]") && "speechSynthesis" in window) window.speechSynthesis.cancel();
});

/* ---------- Python runtime: Pyodide worker, Brython fallback ---------- */
const RT = { state: "idle", worker: null, waiters: [], pending: new Map(), seq: 0, kind: null, err: "" };
function setPill(cls, text) {
  const p = $("#rtpill");
  p.className = "pill " + cls;
  $("#rttext").textContent = text;
}
function rtReady() {
  RT.state = "ready";
  RT.waiters.splice(0).forEach((f) => f(true));
}
function rtFail(msg) {
  RT.err = msg;
  if (RT.kind === "pyodide") { startBrython(); return; }
  RT.state = "failed";
  setPill("err", "Python 不可用");
  RT.waiters.splice(0).forEach((f) => f(false));
}
function startRuntime() {
  if (RT.state !== "idle") return;
  RT.state = "loading";
  startPyodide();
}
function startPyodide() {
  RT.kind = "pyodide";
  setPill("warn", "Python 加载中…");
  let w;
  try { w = new Worker("worker.js"); } catch (e) { rtFail(String(e)); return; }
  RT.worker = w;
  const timer = setTimeout(() => { if (RT.state === "loading") { w.terminate(); rtFail("Pyodide load timeout"); } }, 60000);
  w.onmessage = (e) => {
    const m = e.data;
    if (m.type === "ready") { clearTimeout(timer); setPill("ok", "Python " + m.version + " 就绪"); rtReady(); }
    else if (m.type === "fail") { clearTimeout(timer); w.terminate(); rtFail(m.error); }
    else if (m.type === "result") {
      const p = RT.pending.get(m.id);
      if (p) { RT.pending.delete(m.id); clearTimeout(p.t); p.resolve(JSON.parse(m.payload)); }
    }
  };
  w.onerror = (e) => { if (RT.state === "loading") { clearTimeout(timer); rtFail(e.message || "worker error"); } };
  w.postMessage({ type: "init", runner: window.RUNNER_PY });
}
function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load " + src)); document.head.appendChild(s); });
}
async function startBrython() {
  RT.kind = "brython";
  RT.state = "loading";
  setPill("warn", "备用 Python 加载中…");
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/brython@3.12.5/brython.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/brython@3.12.5/brython_stdlib.js");
    window.brython({ debug: 0 });
    window.__BRYTHON__.runPythonSource(window.RUNNER_PY + "\nfrom browser import window as __w\n__w.__bbp_run = __run_all\n", "bbp_runner");
    setPill("ok", "Python (Brython 备用) 就绪");
    rtReady();
  } catch (e) {
    RT.kind = "none";
    rtFail(String(e));
  }
}
function whenReady() {
  if (RT.state === "ready") return Promise.resolve(true);
  if (RT.state === "failed") return Promise.resolve(false);
  startRuntime();
  return new Promise((r) => RT.waiters.push(r));
}
async function runPython(code, cases) {
  const ok = await whenReady();
  if (!ok) return { fatal: "Python 运行环境加载失败：" + RT.err + "\n可以把代码复制到本地 python3 运行，答案和讲解仍可查看。", stdout: "", results: [] };
  if (RT.kind === "brython") {
    try { return JSON.parse(window.__bbp_run(code, JSON.stringify(cases || []))); }
    catch (e) { return { fatal: String(e), stdout: "", results: [] }; }
  }
  return new Promise((resolve) => {
    const id = ++RT.seq;
    const t = setTimeout(() => {
      RT.pending.delete(id);
      RT.worker.terminate();
      RT.state = "idle";
      RT.waiters = [];
      startRuntime();
      resolve({ timeout: true, fatal: "Time Limit Exceeded：运行超过 8 秒被终止。常见原因：while 循环条件永远为真（比如二分里 lo = mid 没有 +1，或忘了移动指针）。Python 正在重启…", stdout: "", results: [] });
    }, 8000);
    RT.pending.set(id, { resolve, t });
    RT.worker.postMessage({ type: "run", id, code, cases });
  });
}

/* ---------- navigation ---------- */
const allProblems = [];
CH.forEach((c) => (c.problems || []).forEach((p) => allProblems.push(c.id + "/" + p.id)));
function updateProgress() {
  const n = allProblems.filter((k) => solved[k]).length;
  $("#progtext").textContent = n + " / " + allProblems.length + " 已通过";
  $("#progbar").style.width = (allProblems.length ? (100 * n) / allProblems.length : 0) + "%";
  renderRail();
}
function chCount(c) {
  const ps = c.problems || [];
  return [ps.filter((p) => solved[c.id + "/" + p.id]).length, ps.length];
}
function renderRail() {
  const cur = route().ch;
  let html = "";
  let group = null;
  CH.forEach((c, i) => {
    if (c.group !== group) { group = c.group; html += "<h4>" + esc(group) + "</h4>"; }
    const [d, t] = chCount(c);
    html += '<a href="#' + c.id + '" class="' + (c.id === cur ? "on" : "") + '"><span class="n">' + esc(c.num || String(i).padStart(2, "0")) + "</span><span>" + esc(c.title) + "<small>" + esc(c.en) + "</small></span>" + (t ? '<span class="c' + (d === t ? " full" : "") + '">' + d + "/" + t + "</span>" : "<span></span>") + "</a>";
  });
  $("#rail").innerHTML = html;
  $("#chsel").innerHTML = CH.map((c) => '<option value="' + c.id + '"' + (c.id === cur ? " selected" : "") + ">" + esc((c.num ? c.num + " " : "") + c.title + " · " + c.en) + "</option>").join("");
}
$("#chsel").addEventListener("change", (e) => { location.hash = e.target.value; });

function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  const [ch, pid] = h.split("--");
  const c = CH.find((x) => x.id === ch) || CH[0];
  return { ch: c.id, c, pid: pid || null };
}
const tabMemory = {};
function render() {
  stopAnims();
  const r = route();
  renderRail();
  const view = $("#view");
  if (r.pid) {
    const p = (r.c.problems || []).find((x) => x.id === r.pid);
    if (p) { renderWorkspace(view, r.c, p); window.scrollTo(0, 0); return; }
  }
  renderChapter(view, r.c);
}
window.addEventListener("hashchange", render);

/* ---------- chapter view ---------- */
function chapterTabs(c) {
  const t = [];
  if (c.concept) t.push(["concept", "知识点"]);
  if (c.anims && c.anims.length) t.push(["anim", "动画演示", c.anims.length]);
  if (c.qa && c.qa.length) t.push(["qa", c.qaLabel || "问答卡", c.qa.length]);
  if (c.problems && c.problems.length) t.push(["practice", "练习题", c.problems.length]);
  if (c.kind === "playground") t.push(["play", "自由运行"]);
  return t;
}
function renderChapter(view, c) {
  const tabs = chapterTabs(c);
  let tab = tabMemory[c.id] || (tabs[0] && tabs[0][0]);
  if (!tabs.find((t) => t[0] === tab)) tab = tabs[0][0];
  view.innerHTML =
    '<div class="chhead"><span class="eyebrow">' + esc(c.eyebrow || "CHAPTER " + (c.num || "")) + "</span><h1>" + esc(c.title) + '</h1><span class="en">' + esc(c.en) + (c.blurb ? " · " + esc(c.blurb) : "") + "</span></div>" +
    '<div class="tabs" role="tablist">' + tabs.map((t) => '<button role="tab" data-tab="' + t[0] + '" class="' + (t[0] === tab ? "on" : "") + '">' + t[1] + (t[2] ? '<span class="k">' + t[2] + "</span>" : "") + "</button>").join("") + "</div>" +
    '<div id="tabbody"></div>';
  view.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { tabMemory[c.id] = b.dataset.tab; renderChapter(view, c); }));
  const body = $("#tabbody");
  if (tab === "concept") body.innerHTML = '<div class="prose">' + richen(c.concept) + "</div>";
  else if (tab === "anim") renderAnimList(body, c);
  else if (tab === "qa") renderQA(body, c);
  else if (tab === "practice") renderPracticeList(body, c);
  else if (tab === "play") renderPlayground(body);
  body.querySelectorAll("[data-goto]").forEach((a) => a.addEventListener("click", (e) => {
    const [tb] = a.dataset.goto.split(":");
    tabMemory[c.id] = tb; renderChapter(view, c); e.preventDefault();
  }));
}

function renderPracticeList(body, c) {
  const [d, t] = chCount(c);
  body.innerHTML =
    '<div class="plhead"><p>由浅入深排列。题面用英文（面试就是英文），灰字是中文提示。点击进入做题，测试全部通过即记为完成。</p><span class="pill">' + d + " / " + t + " 完成</span></div>" +
    '<div class="plist">' + c.problems.map((p) => {
      const k = c.id + "/" + p.id;
      return '<a class="prow" href="#' + c.id + "--" + p.id + '"><span class="check' + (solved[k] ? " on" : "") + '">✓</span><span><div class="t">' + esc(p.title) + '</div><div class="z">' + esc(p.short || "") + '</div></span><span class="meta">' + (p.tags || []).map((g) => '<span class="chip tag">' + esc(g) + "</span>").join("") + '<span class="chip ' + p.diff + '">' + p.diff + "</span></span></a>";
    }).join("") + "</div>";
}

function renderQA(body, c) {
  body.innerHTML = (c.qaIntro ? '<div class="prose">' + richen(c.qaIntro) + "</div>" : "") +
    '<div class="btnrow" style="margin:6px 0 14px"><button class="btn sm" id="qaopen">全部展开</button><button class="btn sm" id="qaclose">全部收起</button></div>' +
    c.qa.map((q) =>
      '<article class="qa"><div class="qhead"><h3>' + esc(q.q) + "</h3>" + (q.src ? '<span class="src">' + esc(q.src) + "</span>" : "") + "</div>" +
      (q.qzh ? '<div class="qzh">' + esc(q.qzh) + "</div>" : "") +
      (q.points ? '<details' + (q.open ? " open" : "") + '><summary>中文要点 Key points</summary><div class="inner prose">' + richen(q.points) + "</div></details>" : "") +
      (q.say ? '<details><summary>英文参考回答 Say it in English</summary><div class="inner">' + q.say.split(/\n\n+/).map((para) => '<div class="say">' + esc(para) + "</div>").join("") + speakButtons(q.say) + "</div></details>" : "") +
      (q.link ? '<p style="margin:8px 0 0;font-size:14px">' + q.link + "</p>" : "") +
      "</article>").join("");
  $("#qaopen").onclick = () => body.querySelectorAll("details").forEach((d) => (d.open = true));
  $("#qaclose").onclick = () => body.querySelectorAll("details").forEach((d) => (d.open = false));
}

/* ---------- editor ---------- */
function makeEditor(host, initial, onRun, onChange) {
  host.innerHTML = '<div class="editor"><div class="gutter" aria-hidden="true"></div><textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Python code"></textarea></div><div class="hintkeys">Tab 缩进 · Shift+Tab 反缩进 · 回车自动缩进 · ⌘/Ctrl+Enter 运行</div>';
  const ta = host.querySelector("textarea");
  const gut = host.querySelector(".gutter");
  ta.id = "ed-" + Math.random().toString(36).slice(2, 7);
  ta.value = initial;
  const lines = () => { const n = ta.value.split("\n").length; let s = ""; for (let i = 1; i <= n; i++) s += i + "\n"; gut.textContent = s; };
  const fit = () => { ta.style.height = "auto"; ta.style.height = Math.max(320, ta.scrollHeight + 4) + "px"; };
  const insert = (text) => {
    ta.focus();
    if (!document.execCommand || !document.execCommand("insertText", false, text)) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
    }
  };
  ta.addEventListener("input", () => { lines(); fit(); onChange && onChange(ta.value); });
  ta.addEventListener("scroll", () => { gut.scrollTop = ta.scrollTop; });
  ta.addEventListener("keydown", (e) => {
    const v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onRun && onRun(); return; }
    if (e.key === "Tab") {
      e.preventDefault();
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      if (s === en && !e.shiftKey) { insert("    "); return; }
      const le = v.indexOf("\n", en - 1) === -1 ? v.length : v.indexOf("\n", en - (en > s && v[en - 1] === "\n" ? 1 : 0));
      const block = v.slice(ls, le);
      const nb = e.shiftKey ? block.replace(/^ {1,4}/gm, "") : block.replace(/^/gm, "    ");
      ta.setSelectionRange(ls, le);
      insert(nb);
      ta.setSelectionRange(ls, ls + nb.length);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && s === en) {
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      const line = v.slice(ls, s);
      let ind = (line.match(/^ */) || [""])[0];
      if (/:\s*(#.*)?$/.test(line)) ind += "    ";
      e.preventDefault();
      insert("\n" + ind);
      return;
    }
    if (e.key === "Backspace" && s === en) {
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      const before = v.slice(ls, s);
      if (before.length >= 4 && /^ +$/.test(before) && before.length % 4 === 0) {
        e.preventDefault(); ta.setSelectionRange(s - 4, s); insert("");
      }
    }
  });
  lines();
  requestAnimationFrame(fit);
  return { get: () => ta.value, set: (t) => { ta.value = t; lines(); fit(); onChange && onChange(t); } };
}

/* ---------- results ---------- */
function renderResults(box, res, total) {
  let html = "";
  if (res.fatal) {
    html += '<div class="sum bad">' + (res.timeout ? "超时 Time Limit Exceeded" : "代码报错 Error") + '</div><div class="stdout err">' + esc(res.fatal) + "</div>";
  } else if (res.results && res.results.length) {
    const ok = res.results.filter((r) => r.ok).length;
    const all = ok === res.results.length;
    html += '<div class="sum ' + (all ? "ok" : "bad") + '">' + (all ? "全部通过 Accepted · " : "未全部通过 · ") + ok + " / " + res.results.length + " tests</div>";
    html += res.results.map((r) =>
      '<div class="case ' + (r.ok ? "ok" : "bad") + '"><span class="mk">' + (r.ok ? "✓" : "✗") + '</span><div class="kv"><span>call   </span>' + esc(r.call) + "\n<span>expect </span>" + esc(r.expect) + "\n<span>got    </span>" + (r.err ? '<b style="color:var(--bad)">' + esc(r.err) + "</b>" : esc(r.got)) + "</div></div>").join("");
  } else if (total === 0) {
    html += '<div class="sum info">运行完成</div>';
  }
  if (res.stdout) html += '<div style="font-size:12px;color:var(--muted);margin-top:4px">print 输出 stdout</div><div class="stdout">' + esc(res.stdout) + "</div>";
  box.innerHTML = html;
}

/* ---------- problem workspace ---------- */
function renderWorkspace(view, c, p) {
  startRuntime();
  const key = c.id + "/" + p.id;
  const saved = store.get("code:" + key, null);
  const idx = c.problems.indexOf(p);
  const next = c.problems[idx + 1];
  view.innerHTML =
    '<button class="back" id="back">← ' + esc(c.title) + " · 题目列表</button>" +
    '<div class="ws"><section class="panel ws-desc">' +
    '<div class="btnrow" style="margin-bottom:6px"><span class="chip ' + p.diff + '">' + p.diff + "</span>" + (p.tags || []).map((g) => '<span class="chip tag">' + esc(g) + "</span>").join("") + (solved[key] ? '<span class="chip Easy">已通过 ✓</span>' : "") + "</div>" +
    "<h2>" + esc(p.title) + "</h2>" +
    '<div class="stmt">' + esc(p.en) + "</div>" +
    (p.examples ? codeBlock(p.examples, "text") : "") +
    (p.zh ? '<div class="zh">' + esc(p.zh) + "</div>" : "") +
    (p.en ? speakButtons(p.en) : "") +
    '<div style="height:8px"></div>' +
    (p.hints || []).map((h, i) => "<details><summary>提示 " + (i + 1) + '</summary><div class="inner">' + richen(h) + "</div></details>").join("") +
    '<details><summary>参考答案 + 讲解 Solution</summary><div class="inner">' + codeBlock(p.solution, "py") +
    (p.explain ? '<div class="prose">' + richen(p.explain) + "</div>" : "") +
    (p.cx ? '<p><b>复杂度 Complexity:</b> <code>' + esc(p.cx) + "</code></p>" : "") +
    (p.sayCx ? '<div class="say">' + esc(p.sayCx) + "</div>" + speakButtons(p.sayCx) : "") +
    '<div class="btnrow" style="margin-top:8px"><button class="btn sm" id="loadsol">把答案放进编辑器</button></div></div></details>' +
    "</section>" +
    '<section class="panel ws-code"><div class="edhead"><span class="lang">solution.py · Python 3</span><div class="btnrow"><button class="btn sm" id="reset">重置代码</button><button class="btn primary" id="run">运行测试 Run</button></div></div>' +
    '<div id="ed"></div><div class="results" id="res"><div class="out-empty">点击「运行测试」或按 ⌘/Ctrl+Enter。可以在代码里 print() 调试，输出会显示在这里。</div></div>' +
    (next ? '<div class="btnrow" style="margin-top:12px;justify-content:flex-end"><a class="btn sm" href="#' + c.id + "--" + next.id + '">下一题：' + esc(next.title) + " →</a></div>" : "") +
    "</section></div>";
  $("#back").onclick = () => { tabMemory[c.id] = "practice"; location.hash = c.id; };
  const res = $("#res");
  const runBtn = $("#run");
  const doRun = async () => {
    runBtn.disabled = true;
    runBtn.textContent = RT.state === "ready" ? "运行中…" : "加载 Python…";
    res.innerHTML = '<div class="sum info">' + (RT.state === "ready" ? "运行中…" : "首次加载 Python 运行环境（约 10MB，之后会快很多）…") + "</div>";
    const out = await runPython(ed.get(), p.tests);
    runBtn.disabled = false;
    runBtn.textContent = "运行测试 Run";
    renderResults(res, out, p.tests.length);
    if (!out.fatal && out.results.length && out.results.every((r) => r.ok) && !solved[key]) {
      solved[key] = Date.now();
      store.set("solved", solved);
      updateProgress();
    }
  };
  const ed = makeEditor($("#ed"), saved != null ? saved : p.starter, doRun, (t) => store.set("code:" + key, t));
  runBtn.onclick = doRun;
  const confirmBtn = (btn, label, act) => {
    btn.onclick = () => {
      if (btn.dataset.armed) { act(); btn.textContent = label; delete btn.dataset.armed; return; }
      btn.dataset.armed = "1"; btn.textContent = "再点一次确认（会覆盖当前代码）";
      setTimeout(() => { if (btn.dataset.armed) { delete btn.dataset.armed; btn.textContent = label; } }, 3000);
    };
  };
  confirmBtn($("#reset"), "重置代码", () => ed.set(p.starter));
  confirmBtn($("#loadsol"), "把答案放进编辑器", () => ed.set(p.solution));
}

/* ---------- playground ---------- */
const PLAY_DEFAULT = String.raw`# 自由练习区：随便写，点「运行」看 print 输出
def foo(n):
    c = 0
    while n > 0:
        n &= n - 1   # 每次去掉最低位的 1
        c += 1
    return c

if __name__ == "__main__":
    for x in [0, 1, 7, 8, 255, 0x12345678]:
        print(x, bin(x), "->", foo(x))
`;
function renderPlayground(body) {
  startRuntime();
  body.innerHTML = '<div class="panel" style="max-width:900px"><div class="edhead"><span class="lang">playground.py</span><div class="btnrow"><button class="btn sm" id="preset">恢复示例</button><button class="btn primary" id="prun">运行 Run</button></div></div><div id="ped"></div><div class="results" id="pres"></div></div>';
  const res = $("#pres");
  const go = async () => {
    res.innerHTML = '<div class="sum info">' + (RT.state === "ready" ? "运行中…" : "加载 Python…") + "</div>";
    renderResults(res, await runPython(ed.get(), []), 0);
  };
  const ed = makeEditor($("#ped"), store.get("code:playground", PLAY_DEFAULT), go, (t) => store.set("code:playground", t));
  $("#prun").onclick = go;
  $("#preset").onclick = () => ed.set(PLAY_DEFAULT);
}

/* ---------- animation player ---------- */
const COLORS = { cmp: "var(--amber)", swap: "var(--copper)", done: "var(--good)", active: "var(--blue)", found: "var(--good)", bad: "var(--bad)", win: "var(--accent)", dim: "var(--line)" };
const SOFT = { cmp: "var(--amber-soft)", swap: "var(--bad-soft)", done: "var(--good-soft)", active: "var(--accent-soft)", found: "var(--good-soft)", bad: "var(--bad-soft)", win: "var(--accent-soft)", dim: "var(--sunk)" };
const T = (x, y, s, o = {}) => '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="middle" style="fill:' + (o.c || "var(--ink)") + ";font:" + (o.w || 500) + " " + (o.s || 14) + "px " + (o.f || "var(--f-mono)") + '">' + esc(s) + "</text>";
const R = (x, y, w, h, fill, stroke, rx = 5, sw = 1.5) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" style="fill:' + fill + ";stroke:" + stroke + ";stroke-width:" + sw + '"/>';
const ARROW = (x1, y1, x2, y2, col) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:' + col + ';stroke-width:1.8" marker-end="url(#ah)"/>';

function drawArr(cp) {
  const vals = cp.vals || [];
  const cw = cp.cw || (vals.some((v) => String(v).length > 3) ? 58 : 44);
  const bars = cp.bars;
  const mx = bars ? Math.max(1, ...vals.map((v) => Math.abs(+v) || 0)) : 1;
  const top = (cp.title ? 22 : 0) + (cp.noIdx ? 0 : 16);
  const ch = bars ? 130 : 44;
  let s = "";
  if (cp.title) s += T(0, 9, cp.title, { a: "start", s: 12, c: "var(--muted)", f: "var(--f-body)" });
  if (cp.range) { const [l, r] = cp.range; if (r >= l) s += R(l * cw - 3, top - 4, (r - l + 1) * cw + 6, ch + 8, "var(--accent-soft)", "var(--accent)", 7, 1); }
  vals.forEach((v, i) => {
    const k = cp.hl && cp.hl[i];
    const x = i * cw;
    if (!cp.noIdx) s += T(x + cw / 2, top - 8, String(cp.idx ? cp.idx[i] : i), { s: 10, c: "var(--muted)" });
    if (bars) {
      const h = Math.max(4, (Math.abs(+v) / mx) * (ch - 20));
      s += R(x + 4, top + ch - h, cw - 8, h, k ? COLORS[k] : "var(--line)", "transparent", 3, 0);
      s += T(x + cw / 2, top + ch - h - 9, String(v), { s: 12 });
    } else {
      s += R(x + 2, top, cw - 4, ch, k ? SOFT[k] : "var(--surface)", k ? COLORS[k] : "var(--line)", 6, k ? 2.2 : 1.2);
      s += T(x + cw / 2, top + ch / 2 + 1, v === null || v === undefined ? "" : String(v), { s: String(v).length > 4 ? 11 : 15, w: 600, c: k === "dim" ? "var(--muted)" : "var(--ink)" });
    }
  });
  let h = top + ch;
  if (cp.ptrs) {
    const at = {};
    Object.entries(cp.ptrs).forEach(([name, i]) => { if (i === null || i === undefined || i < -1 || i > vals.length) return; (at[i] = at[i] || []).push(name); });
    let maxRows = 0;
    Object.entries(at).forEach(([i, names]) => {
      const x = +i * cw + cw / 2;
      s += ARROW(x, h + 22, x, h + 6, "var(--blue)");
      names.forEach((nm, j) => (s += T(x, h + 32 + j * 15, nm, { s: 12, w: 600, c: "var(--blue)" })));
      maxRows = Math.max(maxRows, names.length);
    });
    h += maxRows ? 28 + maxRows * 15 : 0;
  }
  return { svg: s, w: Math.max(vals.length * cw, cp.title ? cp.title.length * 7 : 0), h: h + 4 };
}
function drawBits(cp) {
  const cw = 24, lw = cp.lw || 150;
  let s = "", y = 0;
  cp.rows.forEach((row) => {
    s += T(0, y + 14, row.label || "", { a: "start", s: 13, c: "var(--muted)" });
    row.bits.split("").forEach((b, i) => {
      const k = row.hl && row.hl[i];
      s += R(lw + i * cw + 1, y, cw - 2, 28, k ? SOFT[k] : b === "1" ? "var(--accent-soft)" : "var(--surface)", k ? COLORS[k] : "var(--line)", 4, k ? 2 : 1);
      s += T(lw + i * cw + cw / 2, y + 15, b, { s: 14, w: 600, c: b === "1" ? "var(--ink)" : "var(--muted)" });
      if (row.sep && (i + 1) % 8 === 0 && i < row.bits.length - 1) s += '<line x1="' + (lw + (i + 1) * cw) + '" y1="' + (y - 3) + '" x2="' + (lw + (i + 1) * cw) + '" y2="' + (y + 31) + '" style="stroke:var(--copper);stroke-width:1.5;stroke-dasharray:3 2"/>';
    });
    if (row.val !== undefined) s += T(lw + row.bits.length * cw + 12, y + 14, String(row.val), { a: "start", s: 13, w: 600 });
    y += 36;
  });
  const maxLen = Math.max(...cp.rows.map((r) => r.bits.length));
  return { svg: s, w: lw + maxLen * cw + 150, h: y };
}
function drawMap(cp) {
  const entries = cp.entries || [];
  let s = cp.title ? T(0, 9, cp.title, { a: "start", s: 12, c: "var(--muted)", f: "var(--f-body)" }) : "";
  let x = 0, y = cp.title ? 22 : 0;
  const maxW = cp.maxW || 640;
  entries.forEach(([k, v]) => {
    const txt = String(k) + " : " + String(v);
    const w = txt.length * 8.4 + 18;
    if (x + w > maxW && x > 0) { x = 0; y += 36; }
    const on = cp.hl === k;
    s += R(x, y, w, 28, on ? "var(--amber-soft)" : "var(--surface)", on ? "var(--amber)" : "var(--line)", 5, on ? 2 : 1);
    s += T(x + w / 2, y + 15, txt, { s: 13, w: on ? 700 : 500 });
    x += w + 8;
  });
  if (!entries.length) s += T(0, y + 14, "{ }", { a: "start", s: 13, c: "var(--muted)" });
  return { svg: s, w: maxW, h: y + 32 };
}
function drawList(cp) {
  const nw = 50, gap = 40, y = 26;
  let s = "";
  const n = cp.vals.length;
  cp.vals.forEach((v, i) => {
    const x = i * (nw + gap);
    const k = cp.hl && cp.hl[i];
    s += R(x, y, nw, 40, k ? SOFT[k] : "var(--surface)", k ? COLORS[k] : "var(--line)", 20, k ? 2.2 : 1.2);
    s += T(x + nw / 2, y + 21, String(v), { s: 15, w: 600 });
    const nx = cp.next ? cp.next[i] : i + 1 < n ? i + 1 : null;
    if (nx === null || nx === undefined) {
      if (!cp.next || cp.next[i] === null) s += T(x + nw + 14, y + (cp.next && i > 0 && cp.next[i] === null ? 21 : 21), "∅", { s: 14, c: "var(--muted)" });
    } else if (nx === i + 1) s += ARROW(x + nw + 2, y + 14, x + nw + gap - 4, y + 14, "var(--ink)");
    else if (nx === i - 1) s += ARROW(x - 2, y + 28, x - gap + 4, y + 28, "var(--copper)");
    else {
      const tx = nx * (nw + gap) + nw / 2, fx = x + nw / 2;
      s += '<path d="M' + fx + " " + (y + 40) + " C " + fx + " " + (y + 90) + ", " + tx + " " + (y + 90) + ", " + tx + " " + (y + 44) + '" style="fill:none;stroke:var(--copper);stroke-width:1.8" marker-end="url(#ah)"/>';
    }
  });
  let h = y + 44;
  if (cp.ptrs) {
    const at = {};
    Object.entries(cp.ptrs).forEach(([nm, i]) => { if (i === null || i === undefined) return; (at[i] = at[i] || []).push(nm); });
    Object.entries(at).forEach(([i, names]) => {
      const x = +i * (nw + gap) + nw / 2;
      const isNull = +i >= n || +i < 0;
      const px = isNull ? (+i < 0 ? -gap / 2 : n * (nw + gap) - gap / 2) : x;
      s += T(px, 10, names.join(" / ") + (isNull ? " = None" : ""), { s: 12, w: 600, c: "var(--blue)" });
    });
  }
  // shift right so a pointer parked at "None" before the head (prev = -1) stays visible
  return { svg: '<g transform="translate(46,0)">' + s + "</g>", w: n * (nw + gap) + 86, h };
}
function drawTree(cp) {
  const vals = cp.vals;
  const depth = Math.max(1, Math.ceil(Math.log2(vals.length + 1)));
  const leafW = cp.leafW || 46;
  const W = Math.max(Math.pow(2, depth - 1) * leafW, 200);
  const lh = cp.lh || 64;
  const pos = (i) => { const d = Math.floor(Math.log2(i + 1)); const k = i - (Math.pow(2, d) - 1); return [((k + 0.5) * W) / Math.pow(2, d), 22 + d * lh]; };
  let s = "";
  vals.forEach((v, i) => {
    if (v === null || v === undefined || i === 0) return;
    const p = Math.floor((i - 1) / 2);
    if (vals[p] === null || vals[p] === undefined) return;
    const [x1, y1] = pos(p), [x2, y2] = pos(i);
    const ek = cp.ehl && cp.ehl[i];
    s += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:' + (ek ? COLORS[ek] : "var(--line)") + ";stroke-width:" + (ek ? 3 : 1.5) + '"/>';
    if (cp.elabel) { const lb = i % 2 === 1 ? cp.elabel[0] : cp.elabel[1]; s += T((x1 + x2) / 2 + (i % 2 ? -10 : 10), (y1 + y2) / 2 - 4, lb, { s: 10, c: "var(--muted)" }); }
  });
  const r = cp.r || 18;
  vals.forEach((v, i) => {
    if (v === null || v === undefined) return;
    const [x, y] = pos(i);
    const k = cp.hl && cp.hl[i];
    const label = String(v);
    if (label.length > 3) s += R(x - label.length * 4.2 - 6, y - 14, label.length * 8.4 + 12, 28, k ? SOFT[k] : "var(--surface)", k ? COLORS[k] : "var(--line)", 8, k ? 2.2 : 1.2);
    else s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + (k ? SOFT[k] : "var(--surface)") + ";stroke:" + (k ? COLORS[k] : "var(--line)") + ";stroke-width:" + (k ? 2.4 : 1.2) + '"/>';
    s += T(x, y + 1, label, { s: label.length > 3 ? 11 : 14, w: 600 });
    if (cp.tags && cp.tags[i] !== undefined) s += T(x, y + r + 11, String(cp.tags[i]), { s: 11, w: 700, c: "var(--blue)" });
  });
  return { svg: s, w: W, h: 22 + (depth - 1) * lh + 40 };
}
function drawGrid(cp) {
  const g = cp.vals;
  const cw = cp.cw || 38;
  const ox = cp.rowLabels ? 46 : 0, oy = cp.colLabels ? 24 : 0;
  let s = cp.title ? T(0, -12, cp.title, { a: "start", s: 12, c: "var(--muted)", f: "var(--f-body)" }) : "";
  if (cp.colLabels) cp.colLabels.forEach((l, j) => (s += T(ox + j * cw + cw / 2, 10, String(l), { s: 12, c: "var(--muted)", w: 600 })));
  g.forEach((row, i) => {
    if (cp.rowLabels) s += T(ox - 10, oy + i * cw + cw / 2, String(cp.rowLabels[i]), { a: "end", s: 12, c: "var(--muted)", w: 600 });
    row.forEach((v, j) => {
      const k = cp.hl && cp.hl[i + "," + j];
      const base = cp.colorOf ? cp.colorOf(v) : null;
      s += R(ox + j * cw + 1, oy + i * cw + 1, cw - 2, cw - 2, k ? SOFT[k] : base || "var(--surface)", k ? COLORS[k] : "var(--line)", 4, k ? 2.2 : 1);
      if (v !== null && v !== undefined && v !== "") s += T(ox + j * cw + cw / 2, oy + i * cw + cw / 2 + 1, String(v), { s: String(v).length > 2 ? 11 : 13, w: 600, c: "var(--ink)" });
    });
  });
  if (cp.arrows) cp.arrows.forEach(([r1, c1, r2, c2]) => (s += ARROW(ox + c1 * cw + cw / 2, oy + r1 * cw + cw / 2, ox + c2 * cw + cw / 2 + (c2 > c1 ? -10 : c2 < c1 ? 10 : 0), oy + r2 * cw + cw / 2 + (r2 > r1 ? -10 : r2 < r1 ? 10 : 0), "var(--copper)")));
  return { svg: s, w: ox + (g[0] ? g[0].length : 0) * cw, h: oy + g.length * cw + 4, yoff: cp.title ? 22 : 0 };
}
function drawText(cp) {
  return { svg: T(0, 12, cp.text, { a: "start", s: cp.s || 14, w: 600, c: cp.c ? COLORS[cp.c] || cp.c : "var(--ink)" }), w: cp.text.length * 8.6, h: 26 };
}
const DRAW = { arr: drawArr, bits: drawBits, map: drawMap, list: drawList, tree: drawTree, grid: drawGrid, text: drawText };
function drawFrame(f) {
  let y = 0, w = 0, body = "";
  (f.parts || []).forEach((cp) => {
    const r = DRAW[cp.t](cp);
    const yo = r.yoff || 0;
    body += '<g transform="translate(' + (cp.x || 0) + "," + (y + yo) + ')">' + r.svg + "</g>";
    y += r.h + yo + (cp.gap === undefined ? 18 : cp.gap);
    w = Math.max(w, r.w + (cp.x || 0));
  });
  const pad = 14;
  return '<svg width="' + (w + pad * 2) + '" height="' + (y + pad) + '" viewBox="' + -pad + " " + -pad + " " + (w + pad * 2) + " " + (y + pad) + '" role="img"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--ink)"/></marker></defs>' + body + "</svg>";
}

const live = [];
function stopAnims() { live.splice(0).forEach((a) => clearInterval(a.timer)); }
function renderAnimList(body, c) {
  body.innerHTML = c.anims.map((id, i) => '<div class="anim" id="an' + i + '"></div>').join("") || "<p>本章没有动画。</p>";
  c.anims.forEach((id, i) => mountAnim($("#an" + i, body), id));
}
function mountAnim(el, id) {
  const A = ANIMS[id];
  if (!A) { el.innerHTML = "<p>Missing animation " + esc(id) + "</p>"; return; }
  const st = { frames: [], i: 0, timer: null, speed: 900 };
  live.push(st);
  el.innerHTML =
    "<h3>" + esc(A.title) + '</h3><p class="desc">' + A.desc + "</p>" +
    '<div class="ctrl">' +
    (A.input !== undefined ? '<label>' + esc(A.inputLabel || "输入") + ' <input type="text" class="ain" value="' + esc(A.input) + '"></label>' : "") +
    (A.modes ? '<select class="amode" aria-label="mode">' + A.modes.map((m) => '<option value="' + m[0] + '">' + esc(m[1]) + "</option>").join("") + "</select>" : "") +
    (A.input !== undefined || A.modes ? '<button class="btn sm abuild">生成</button>' : "") +
    '<button class="btn sm" data-a="first" aria-label="first">⏮</button><button class="btn sm" data-a="prev" aria-label="previous">◀ 上一步</button><button class="btn sm primary" data-a="play">▶ 播放</button><button class="btn sm" data-a="next" aria-label="next">下一步 ▶</button>' +
    '<label>速度 <select class="aspeed"><option value="1500">慢</option><option value="900" selected>中</option><option value="450">快</option></select></label>' +
    '<span class="step"></span></div>' +
    '<div class="stage"></div><div class="caption"></div>' +
    (A.legend ? '<div class="legend">' + A.legend.map(([k, txt]) => '<span><i style="background:' + COLORS[k] + '"></i>' + esc(txt) + "</span>").join("") + "</div>" : "");
  const stage = $(".stage", el), cap = $(".caption", el), stepEl = $(".step", el), playBtn = $('[data-a="play"]', el);
  const show = () => {
    const f = st.frames[st.i];
    if (!f) return;
    stage.innerHTML = drawFrame(f);
    cap.innerHTML = f.note || "";
    stepEl.textContent = "step " + (st.i + 1) + " / " + st.frames.length;
  };
  const pause = () => { clearInterval(st.timer); st.timer = null; playBtn.textContent = "▶ 播放"; };
  const play = () => {
    if (st.i >= st.frames.length - 1) st.i = 0;
    playBtn.textContent = "⏸ 暂停";
    clearInterval(st.timer);
    st.timer = setInterval(() => { if (st.i < st.frames.length - 1) { st.i++; show(); } else pause(); }, st.speed);
  };
  const build = () => {
    pause();
    try {
      const inp = $(".ain", el), mode = $(".amode", el);
      st.frames = A.gen(inp ? inp.value : undefined, mode ? mode.value : undefined);
    } catch (e) {
      st.frames = [{ parts: [{ t: "text", text: "输入格式不对：" + e.message, c: "bad" }], note: "请按示例格式输入。" }];
    }
    st.i = 0; show();
  };
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]");
    if (e.target.closest(".abuild")) { build(); return; }
    if (!b) return;
    const a = b.dataset.a;
    if (a === "play") { st.timer ? pause() : play(); return; }
    pause();
    if (a === "first") st.i = 0;
    if (a === "prev") st.i = Math.max(0, st.i - 1);
    if (a === "next") st.i = Math.min(st.frames.length - 1, st.i + 1);
    show();
  });
  $(".aspeed", el).addEventListener("change", (e) => { st.speed = +e.target.value; if (st.timer) play(); });
  const inp = $(".ain", el);
  if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") build(); });
  const mode = $(".amode", el);
  if (mode) mode.addEventListener("change", build);
  build();
}

/* ---------- boot ---------- */
updateProgress();
render();
})();
