import { createComponent, isServer, getRequestEvent, delegateEvents } from 'solid-js/web';
import { C as Ct$1 } from '../nitro/nitro.mjs';
import { onMount, Suspense, createSignal, onCleanup, children, createMemo, getOwner, sharedConfig, createRenderEffect, on, useContext, runWithOwner, createContext, untrack, Show, createRoot, startTransition, resetErrorBoundaries, batch, createComponent as createComponent$1 } from 'solid-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'solid-js/web/storage';
import 'seroval';
import 'seroval-plugins/web';

function bt() {
  let t = /* @__PURE__ */ new Set();
  function e(n) {
    return t.add(n), () => t.delete(n);
  }
  let r = false;
  function o(n, s) {
    if (r) return !(r = false);
    const a = { to: n, options: s, defaultPrevented: false, preventDefault: () => a.defaultPrevented = true };
    for (const i of t) i.listener({ ...a, from: i.location, retry: (l) => {
      l && (r = true), i.navigate(n, { ...s, resolve: false });
    } });
    return !a.defaultPrevented;
  }
  return { subscribe: e, confirm: o };
}
let X;
function et() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), X = window.history.state._depth;
}
isServer || et();
function Gt(t) {
  return { ...t, _depth: window.history.state && window.history.state._depth };
}
function Qt(t, e) {
  let r = false;
  return () => {
    const o = X;
    et();
    const n = o == null ? null : X - o;
    if (r) {
      r = false;
      return;
    }
    n && e(n) ? (r = true, window.history.go(-n)) : t();
  };
}
const Zt = /^(?:[a-z0-9]+:)?\/\//i, te = /^\/+|(\/)\/+$/g, vt = "http://sr";
function V(t, e = false) {
  const r = t.replace(te, "$1");
  return r ? e || /^[?#]/.test(r) ? r : "/" + r : "";
}
function K(t, e, r) {
  if (Zt.test(e)) return;
  const o = V(t), n = r && V(r);
  let s = "";
  return !n || e.startsWith("/") ? s = o : n.toLowerCase().indexOf(o.toLowerCase()) !== 0 ? s = o + n : s = n, (s || "/") + V(e, !s);
}
function ee(t, e) {
  return V(t).replace(/\/*(\*.*)?$/g, "") + V(e);
}
function Et(t) {
  const e = {};
  return t.searchParams.forEach((r, o) => {
    o in e ? Array.isArray(e[o]) ? e[o].push(r) : e[o] = [e[o], r] : e[o] = r;
  }), e;
}
function ne(t, e, r) {
  const [o, n] = t.split("/*", 2), s = o.split("/").filter(Boolean), a = s.length;
  return (i) => {
    const l = i.split("/").filter(Boolean), c = l.length - a;
    if (c < 0 || c > 0 && n === void 0 && !e) return null;
    const h = { path: a ? "" : "/", params: {} }, m = (p) => r === void 0 ? void 0 : r[p];
    for (let p = 0; p < a; p++) {
      const g = s[p], v = g[0] === ":", u = v ? l[p] : l[p].toLowerCase(), f = v ? g.slice(1) : g.toLowerCase();
      if (v && J(u, m(f))) h.params[f] = u;
      else if (v || !J(u, f)) return null;
      h.path += `/${u}`;
    }
    if (n) {
      const p = c ? l.slice(-c).join("/") : "";
      if (J(p, m(n))) h.params[n] = p;
      else return null;
    }
    return h;
  };
}
function J(t, e) {
  const r = (o) => o === t;
  return e === void 0 ? true : typeof e == "string" ? r(e) : typeof e == "function" ? e(t) : Array.isArray(e) ? e.some(r) : e instanceof RegExp ? e.test(t) : false;
}
function re(t) {
  const [e, r] = t.pattern.split("/*", 2), o = e.split("/").filter(Boolean);
  return o.reduce((n, s) => n + (s.startsWith(":") ? 2 : 3), o.length - (r === void 0 ? 0 : 1));
}
function St(t) {
  const e = /* @__PURE__ */ new Map(), r = getOwner();
  return new Proxy({}, { get(o, n) {
    return e.has(n) || runWithOwner(r, () => e.set(n, createMemo(() => t()[n]))), e.get(n)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(t());
  } });
}
function _t(t) {
  let e = /(\/?\:[^\/]+)\?/.exec(t);
  if (!e) return [t];
  let r = t.slice(0, e.index), o = t.slice(e.index + e[0].length);
  const n = [r, r += e[1]];
  for (; e = /^(\/\:[^\/]+)\?/.exec(o); ) n.push(r += e[1]), o = o.slice(e[0].length);
  return _t(o).reduce((s, a) => [...s, ...n.map((i) => i + a)], []);
}
const oe = 100, se = createContext(), It = createContext();
function ae(t, e = "") {
  const { component: r, preload: o, load: n, children: s, info: a } = t, i = !s || Array.isArray(s) && !s.length, l = { key: t, component: r, preload: o || n, info: a };
  return At(t.path).reduce((c, h) => {
    for (const m of _t(h)) {
      const p = ee(e, m);
      let g = i ? p : p.split("/*", 1)[0];
      g = g.split("/").map((v) => v.startsWith(":") || v.startsWith("*") ? v : encodeURIComponent(v)).join("/"), c.push({ ...l, originalPath: h, pattern: g, matcher: ne(g, !i, t.matchFilters) });
    }
    return c;
  }, []);
}
function ie(t, e = 0) {
  return { routes: t, score: re(t[t.length - 1]) * 1e4 - e, matcher(r) {
    const o = [];
    for (let n = t.length - 1; n >= 0; n--) {
      const s = t[n], a = s.matcher(r);
      if (!a) return null;
      o.unshift({ ...a, route: s });
    }
    return o;
  } };
}
function At(t) {
  return Array.isArray(t) ? t : [t];
}
function Rt(t, e = "", r = [], o = []) {
  const n = At(t);
  for (let s = 0, a = n.length; s < a; s++) {
    const i = n[s];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const l = ae(i, e);
      for (const c of l) {
        r.push(c);
        const h = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !h) Rt(i.children, c.pattern, r, o);
        else {
          const m = ie([...r], o.length);
          o.push(m);
        }
        r.pop();
      }
    }
  }
  return r.length ? o : o.sort((s, a) => a.score - s.score);
}
function F(t, e) {
  for (let r = 0, o = t.length; r < o; r++) {
    const n = t[r].matcher(e);
    if (n) return n;
  }
  return [];
}
function ce(t, e, r) {
  const o = new URL(vt), n = createMemo((h) => {
    const m = t();
    try {
      return new URL(m, o);
    } catch {
      return console.error(`Invalid path ${m}`), h;
    }
  }, o, { equals: (h, m) => h.href === m.href }), s = createMemo(() => n().pathname), a = createMemo(() => n().search, true), i = createMemo(() => n().hash), l = () => "", c = on(a, () => Et(n()));
  return { get pathname() {
    return s();
  }, get search() {
    return a();
  }, get hash() {
    return i();
  }, get state() {
    return e();
  }, get key() {
    return l();
  }, query: r ? r(c) : St(c) };
}
let L;
function ue() {
  return L;
}
function le(t, e, r, o = {}) {
  const { signal: [n, s], utils: a = {} } = t, i = a.parsePath || ((d) => d), l = a.renderPath || ((d) => d), c = a.beforeLeave || bt(), h = K("", o.base || "");
  if (h === void 0) throw new Error(`${h} is not a valid base path`);
  h && !n().value && s({ value: h, replace: true, scroll: false });
  const [m, p] = createSignal(false);
  let g;
  const v = (d, w) => {
    w.value === u() && w.state === y() || (g === void 0 && p(true), L = d, g = w, startTransition(() => {
      g === w && (f(g.value), b(g.state), resetErrorBoundaries(), isServer || P[1]([]));
    }).finally(() => {
      g === w && batch(() => {
        L = void 0, d === "navigate" && Vt(g), p(false), g = void 0;
      });
    }));
  }, [u, f] = createSignal(n().value), [y, b] = createSignal(n().state), R = ce(u, y, a.queryWrapper), S = [], P = createSignal(isServer ? Bt() : []), x = createMemo(() => typeof o.transformUrl == "function" ? F(e(), o.transformUrl(R.pathname)) : F(e(), R.pathname)), it = () => {
    const d = x(), w = {};
    for (let E = 0; E < d.length; E++) Object.assign(w, d[E].params);
    return w;
  }, Ot = a.paramsWrapper ? a.paramsWrapper(it, e) : St(it), ct = { pattern: h, path: () => h, outlet: () => null, resolvePath(d) {
    return K(h, d);
  } };
  return createRenderEffect(on(n, (d) => v("native", d), { defer: true })), { base: ct, location: R, params: Ot, isRouting: m, renderPath: l, parsePath: i, navigatorFactory: Dt, matches: x, beforeLeave: c, preloadRoute: Ft, singleFlight: o.singleFlight === void 0 ? true : o.singleFlight, submissions: P };
  function xt(d, w, E) {
    untrack(() => {
      if (typeof w == "number") {
        w && (a.go ? a.go(w) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const j = !w || w[0] === "?", { replace: N, resolve: T, scroll: $, state: U } = { replace: false, resolve: !j, scroll: true, ...E }, C = T ? d.resolvePath(w) : K(j && R.pathname || "", w);
      if (C === void 0) throw new Error(`Path '${w}' is not a routable path`);
      if (S.length >= oe) throw new Error("Too many redirects");
      const ut = u();
      if (C !== ut || U !== y()) if (isServer) {
        const lt = getRequestEvent();
        lt && (lt.response = { status: 302, headers: new Headers({ Location: C }) }), s({ value: C, replace: N, scroll: $, state: U });
      } else c.confirm(C, E) && (S.push({ value: ut, replace: N, scroll: $, state: y() }), v("navigate", { value: C, state: U }));
    });
  }
  function Dt(d) {
    return d = d || useContext(It) || ct, (w, E) => xt(d, w, E);
  }
  function Vt(d) {
    const w = S[0];
    w && (s({ ...d, replace: w.replace, scroll: w.scroll }), S.length = 0);
  }
  function Ft(d, w) {
    const E = F(e(), d.pathname), j = L;
    L = "preload";
    for (let N in E) {
      const { route: T, params: $ } = E[N];
      T.component && T.component.preload && T.component.preload();
      const { preload: U } = T;
      w && U && runWithOwner(r(), () => U({ params: $, location: { pathname: d.pathname, search: d.search, hash: d.hash, query: Et(d), state: null, key: "" }, intent: "preload" }));
    }
    L = j;
  }
  function Bt() {
    const d = getRequestEvent();
    return d && d.router && d.router.submission ? [d.router.submission] : [];
  }
}
function fe(t, e, r, o) {
  const { base: n, location: s, params: a } = t, { pattern: i, component: l, preload: c } = o().route, h = createMemo(() => o().path);
  l && l.preload && l.preload();
  const m = c ? c({ params: a, location: s, intent: L || "initial" }) : void 0;
  return { parent: e, pattern: i, path: h, outlet: () => l ? createComponent$1(l, { params: a, location: s, data: m, get children() {
    return r();
  } }) : r(), resolvePath(g) {
    return K(n.path(), g, h());
  } };
}
const Pt = (t) => (e) => {
  const { base: r } = e, o = children(() => e.children), n = createMemo(() => Rt(o(), e.base || ""));
  let s;
  const a = le(t, n, () => s, { base: r, singleFlight: e.singleFlight, transformUrl: e.transformUrl });
  return t.create && t.create(a), createComponent(se.Provider, { value: a, get children() {
    return createComponent(he, { routerState: a, get root() {
      return e.root;
    }, get preload() {
      return e.rootPreload || e.rootLoad;
    }, get children() {
      return [(s = getOwner()) && null, createComponent(de, { routerState: a, get branches() {
        return n();
      } })];
    } });
  } });
};
function he(t) {
  const e = t.routerState.location, r = t.routerState.params, o = createMemo(() => t.preload && untrack(() => {
    t.preload({ params: r, location: e, intent: ue() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return t.root;
  }, keyed: true, get fallback() {
    return t.children;
  }, children: (n) => createComponent(n, { params: r, location: e, get data() {
    return o();
  }, get children() {
    return t.children;
  } }) });
}
function de(t) {
  if (isServer) {
    const n = getRequestEvent();
    if (n && n.router && n.router.dataOnly) {
      pe(n, t.routerState, t.branches);
      return;
    }
    n && ((n.router || (n.router = {})).matches || (n.router.matches = t.routerState.matches().map(({ route: s, path: a, params: i }) => ({ path: s.originalPath, pattern: s.pattern, match: a, params: i, info: s.info }))));
  }
  const e = [];
  let r;
  const o = createMemo(on(t.routerState.matches, (n, s, a) => {
    let i = s && n.length === s.length;
    const l = [];
    for (let c = 0, h = n.length; c < h; c++) {
      const m = s && s[c], p = n[c];
      a && m && p.route.key === m.route.key ? l[c] = a[c] : (i = false, e[c] && e[c](), createRoot((g) => {
        e[c] = g, l[c] = fe(t.routerState, l[c - 1] || t.routerState.base, ft(() => o()[c + 1]), () => t.routerState.matches()[c]);
      }));
    }
    return e.splice(n.length).forEach((c) => c()), a && i ? a : (r = l[0], l);
  }));
  return ft(() => o() && r)();
}
const ft = (t) => () => createComponent(Show, { get when() {
  return t();
}, keyed: true, children: (e) => createComponent(It.Provider, { value: e, get children() {
  return e.outlet();
} }) });
function pe(t, e, r) {
  const o = new URL(t.request.url), n = F(r, new URL(t.router.previousUrl || t.request.url).pathname), s = F(r, o.pathname);
  for (let a = 0; a < s.length; a++) {
    (!n[a] || s[a].route !== n[a].route) && (t.router.dataOnly = true);
    const { route: i, params: l } = s[a];
    i.preload && i.preload({ params: l, location: e.location, intent: "preload" });
  }
}
function me([t, e], r, o) {
  return [t, o ? (n) => e(o(n)) : e];
}
function ge(t) {
  let e = false;
  const r = (n) => typeof n == "string" ? { value: n } : n, o = me(createSignal(r(t.get()), { equals: (n, s) => n.value === s.value && n.state === s.state }), void 0, (n) => (!e && t.set(n), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), n));
  return t.init && onCleanup(t.init((n = t.get()) => {
    e = true, o[1](r(n)), e = false;
  })), Pt({ signal: o, create: t.create, utils: t.utils });
}
function we(t, e, r) {
  return t.addEventListener(e, r), () => t.removeEventListener(e, r);
}
function ye(t, e) {
  const r = t && document.getElementById(t);
  r ? r.scrollIntoView() : e && window.scrollTo(0, 0);
}
function be(t) {
  const e = new URL(t);
  return e.pathname + e.search;
}
function ve(t) {
  let e;
  const r = { value: t.url || (e = getRequestEvent()) && be(e.request.url) || "" };
  return Pt({ signal: [() => r, (o) => Object.assign(r, o)] })(t);
}
const Ee = /* @__PURE__ */ new Map();
function Se(t = true, e = false, r = "/_server", o) {
  return (n) => {
    const s = n.base.path(), a = n.navigatorFactory(n.base);
    let i, l;
    function c(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function h(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const f = u.composedPath().find((x) => x instanceof Node && x.nodeName.toUpperCase() === "A");
      if (!f || e && !f.hasAttribute("link")) return;
      const y = c(f), b = y ? f.href.baseVal : f.href;
      if ((y ? f.target.baseVal : f.target) || !b && !f.hasAttribute("state")) return;
      const S = (f.getAttribute("rel") || "").split(/\s+/);
      if (f.hasAttribute("download") || S && S.includes("external")) return;
      const P = y ? new URL(b, document.baseURI) : new URL(b);
      if (!(P.origin !== window.location.origin || s && P.pathname && !P.pathname.toLowerCase().startsWith(s.toLowerCase()))) return [f, P];
    }
    function m(u) {
      const f = h(u);
      if (!f) return;
      const [y, b] = f, R = n.parsePath(b.pathname + b.search + b.hash), S = y.getAttribute("state");
      u.preventDefault(), a(R, { resolve: false, replace: y.hasAttribute("replace"), scroll: !y.hasAttribute("noscroll"), state: S ? JSON.parse(S) : void 0 });
    }
    function p(u) {
      const f = h(u);
      if (!f) return;
      const [y, b] = f;
      o && (b.pathname = o(b.pathname)), n.preloadRoute(b, y.getAttribute("preload") !== "false");
    }
    function g(u) {
      clearTimeout(i);
      const f = h(u);
      if (!f) return l = null;
      const [y, b] = f;
      l !== y && (o && (b.pathname = o(b.pathname)), i = setTimeout(() => {
        n.preloadRoute(b, y.getAttribute("preload") !== "false"), l = y;
      }, 20));
    }
    function v(u) {
      if (u.defaultPrevented) return;
      let f = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!f) return;
      if (!f.startsWith("https://action/")) {
        const b = new URL(f, vt);
        if (f = n.parsePath(b.pathname + b.search), !f.startsWith(r)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const y = Ee.get(f);
      if (y) {
        u.preventDefault();
        const b = new FormData(u.target, u.submitter);
        y.call({ r: n, f: u.target }, u.target.enctype === "multipart/form-data" ? b : new URLSearchParams(b));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", m), t && (document.addEventListener("mousemove", g, { passive: true }), document.addEventListener("focusin", p, { passive: true }), document.addEventListener("touchstart", p, { passive: true })), document.addEventListener("submit", v), onCleanup(() => {
      document.removeEventListener("click", m), t && (document.removeEventListener("mousemove", g), document.removeEventListener("focusin", p), document.removeEventListener("touchstart", p)), document.removeEventListener("submit", v);
    });
  };
}
function _e(t) {
  if (isServer) return ve(t);
  const e = () => {
    const o = window.location.pathname.replace(/^\/+/, "/") + window.location.search, n = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: o + window.location.hash, state: n };
  }, r = bt();
  return ge({ get: e, set({ value: o, replace: n, scroll: s, state: a }) {
    n ? window.history.replaceState(Gt(a), "", o) : window.history.pushState(a, "", o), ye(decodeURIComponent(window.location.hash.slice(1)), s), et();
  }, init: (o) => we(window, "popstate", Qt(o, (n) => {
    if (n && n < 0) return !r.confirm(n);
    {
      const s = e();
      return !r.confirm(s.value, { state: s.state });
    }
  })), create: Se(t.preload, t.explicitLinks, t.actionBase, t.transformUrl), utils: { go: (o) => window.history.go(o), beforeLeave: r } })(t);
}
const Ie = { VITE_APP_ID: "subpay", VITE_AUTH_BASE: "https://ssgloghr.com", VITE_IDSVC_URL: "https://ssgloghr.com/idsvc", VITE_SSO_CLIENT_ID: "subpay" }, q = Ie || {};
let Y = { authBase: q.VITE_AUTH_BASE || "", idsvcUrl: q.VITE_IDSVC_URL || "", appId: q.VITE_APP_ID || "", clientId: q.VITE_SSO_CLIENT_ID || "", perms: {}, callbackPath: "/callback" };
function Ae(t) {
  Y = { ...Y, ...t };
}
function nt() {
  return Y;
}
const Re = () => nt().idsvcUrl, Lt = () => nt().appId, rt = () => `idsvc_refresh_${Lt()}`;
let O = null;
const Tt = () => localStorage.getItem(rt()), Pe = (t) => {
  O = t.access, localStorage.setItem(rt(), t.refresh);
}, Le = () => {
  O = null, localStorage.removeItem(rt());
}, Te = () => !!Tt();
async function Ue(t, e) {
  const r = await fetch(`${Re()}${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), o = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(o.error || `HTTP ${r.status}`), { status: r.status });
  return o && typeof o == "object" && o.data !== void 0 ? o.data : o;
}
let D = null;
async function Ce() {
  return D || (D = (async () => {
    const t = Tt();
    if (!t) return false;
    try {
      const e = await Ue("/auth/refresh", { refresh: t, app: Lt() });
      return Pe(e), true;
    } catch (e) {
      return ((e == null ? void 0 : e.status) === 401 || (e == null ? void 0 : e.status) === 400) && Le(), false;
    } finally {
      D = null;
    }
  })(), D);
}
function Ut() {
  if (!O) return null;
  try {
    return JSON.parse(atob(O.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
function ke() {
  const t = Ut();
  return !t || t.exp * 1e3 - Date.now() < 6e4;
}
async function Oe() {
  return (!O || ke()) && await Ce(), O;
}
function xe(t) {
  if (typeof t == "boolean") return t;
  if (typeof t == "number") return t === 1;
  if (typeof t == "string") {
    const e = t.trim().toLowerCase();
    return e === "true" || e === "1" || e === "yes";
  }
  return false;
}
const ot = "ops_user", G = /* @__PURE__ */ new Set();
function Ct() {
  for (const t of G) t();
}
function De(t) {
  return G.add(t), () => G.delete(t);
}
const Ve = () => {
  try {
    return JSON.parse(localStorage.getItem(ot) || "null");
  } catch {
    return null;
  }
};
let B = Ve(), Fe = false, Be = null;
const kt = () => ({ user: B, loading: Fe, error: Be });
function je(t) {
  t && localStorage.setItem(ot, JSON.stringify(t)), B = t, Ct();
}
function Ne() {
  var _a;
  const t = Ut();
  if (!t) return false;
  const e = nt().appId, o = (((_a = t.apps) == null ? void 0 : _a[e]) || Object.values(t.apps || {})[0] || {}).scope || {}, n = o.flags || {}, s = { id: t.sub, uid: t.uid, originalUserId: t.sub, googleUid: t.sub, name: t.name || "", email: t.email || (B == null ? void 0 : B.email) || "", businessId: o.businessId || "", permissions: { ...n, isAdmin: !!t.superadmin || xe(n.isAdmin) }, superadmin: !!t.superadmin, apps: t.apps };
  return je(s), true;
}
async function $e() {
  return Te() ? navigator.onLine ? await Oe() ? (Ne(), true) : (localStorage.removeItem(ot), B = null, Ct(), false) : !!B : false;
}
const st = kt(), [fn, qe] = createSignal(st.user), [hn, Me] = createSignal(st.loading), [dn, Ke] = createSignal(st.error);
De(() => {
  const t = kt();
  qe(t.user), Me(t.loading), Ke(t.error);
});
const We = { VITE_APP_ID: "subpay", VITE_AUTH_BASE: "https://ssgloghr.com", VITE_IDSVC_URL: "https://ssgloghr.com/idsvc", VITE_SSO_CLIENT_ID: "subpay" }, M = We, He = { admin: ["*"], owner: ["*"] };
Ae({ authBase: M.VITE_AUTH_BASE, idsvcUrl: M.VITE_IDSVC_URL, appId: M.VITE_APP_ID, clientId: M.VITE_SSO_CLIENT_ID, perms: He, callbackPath: "/callback" });
const [pn, ht] = createSignal(true);
async function Je() {
  ht(true);
  try {
    await $e();
  } catch {
  } finally {
    ht(false);
  }
}
const z = (() => {
  if (typeof navigator > "u") return null;
  const t = navigator.userAgent.match(/HeliumTV\/(\d+)/);
  return t ? parseInt(t[1], 10) : null;
})();
async function Qe() {
  var _a, _b;
  if (z === null) return { status: "ok" };
  try {
    const t = await fetch(`/version.json?_=${Date.now()}`).then((e) => e.json());
    if (z < ((_a = t.minApk) != null ? _a : 0)) return { status: "required", apkUrl: t.apkUrl };
    if (z < ((_b = t.latestApk) != null ? _b : 0)) return { status: "optional", apkUrl: t.apkUrl };
  } catch {
  }
  return { status: "ok" };
}
function mn() {
  return onMount(() => {
    Je(), Qe().then((t) => {
      if (t.status === "ok") return;
      const e = window.HeliumUpdater;
      if ((e == null ? void 0 : e.install) && t.apkUrl) {
        e.install(t.apkUrl);
        return;
      }
      t.status === "required" && location.pathname !== "/update" && (location.href = "/update");
    });
  }), createComponent(_e, { root: (t) => createComponent(Suspense, { get children() {
    return t.children;
  } }), get children() {
    return createComponent(Ct$1, {});
  } });
}

export { mn as default };
//# sourceMappingURL=app-Cz9cGJ3T.mjs.map
