// Runs user code in CPython (Pyodide) off the main thread so an infinite loop can be killed.
const BASE = self.location.href.replace(/[^/]*$/, "");
const CDN = "https://cdn.jsdelivr.net/npm/pyodide@0.26.4/";
let py = null;

self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === "init") {
    try {
      let cfg;
      try {
        importScripts(BASE + "pyodide/pyodide.js");
        // the stdlib zip is published as .wasm because the artifact host does not serve .zip files
        cfg = { indexURL: BASE + "pyodide/", stdLibURL: BASE + "pyodide/python_stdlib.wasm" };
      } catch (e) {
        // no bundled copy (e.g. GitHub Pages): load the same version from the CDN
        importScripts(CDN + "pyodide.js");
        cfg = { indexURL: CDN };
      }
      py = await loadPyodide(cfg);
      py.runPython(m.runner);
      self.postMessage({ type: "ready", version: py.version });
    } catch (err) {
      self.postMessage({ type: "fail", error: String(err && err.message || err) });
    }
    return;
  }
  if (m.type === "run") {
    try {
      const fn = py.globals.get("__run_all");
      const out = fn(m.code, JSON.stringify(m.cases || []));
      fn.destroy();
      self.postMessage({ type: "result", id: m.id, payload: out });
    } catch (err) {
      self.postMessage({ type: "result", id: m.id, payload: JSON.stringify({ fatal: String(err && err.message || err), stdout: "", results: [] }) });
    }
  }
};
