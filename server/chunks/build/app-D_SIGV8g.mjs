import { createComponent, isServer, getRequestEvent, delegateEvents } from 'solid-js/web';
import { I as It$1 } from '../nitro/nitro.mjs';
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

function yt() {
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
let z;
function tt() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), z = window.history.state._depth;
}
isServer || tt();
function Yt(t) {
  return { ...t, _depth: window.history.state && window.history.state._depth };
}
function Gt(t, e) {
  let r = false;
  return () => {
    const o = z;
    tt();
    const n = o == null ? null : z - o;
    if (r) {
      r = false;
      return;
    }
    n && e(n) ? (r = true, window.history.go(-n)) : t();
  };
}
const Qt = /^(?:[a-z0-9]+:)?\/\//i, Zt = /^\/+|(\/)\/+$/g, bt = "http://sr";
function V(t, e = false) {
  const r = t.replace(Zt, "$1");
  return r ? e || /^[?#]/.test(r) ? r : "/" + r : "";
}
function W(t, e, r) {
  if (Qt.test(e)) return;
  const o = V(t), n = r && V(r);
  let s = "";
  return !n || e.startsWith("/") ? s = o : n.toLowerCase().indexOf(o.toLowerCase()) !== 0 ? s = o + n : s = n, (s || "/") + V(e, !s);
}
function te(t, e) {
  return V(t).replace(/\/*(\*.*)?$/g, "") + V(e);
}
function vt(t) {
  const e = {};
  return t.searchParams.forEach((r, o) => {
    o in e ? Array.isArray(e[o]) ? e[o].push(r) : e[o] = [e[o], r] : e[o] = r;
  }), e;
}
function ee(t, e, r) {
  const [o, n] = t.split("/*", 2), s = o.split("/").filter(Boolean), a = s.length;
  return (i) => {
    const l = i.split("/").filter(Boolean), c = l.length - a;
    if (c < 0 || c > 0 && n === void 0 && !e) return null;
    const h = { path: a ? "" : "/", params: {} }, p = (m) => r === void 0 ? void 0 : r[m];
    for (let m = 0; m < a; m++) {
      const g = s[m], v = g[0] === ":", u = v ? l[m] : l[m].toLowerCase(), f = v ? g.slice(1) : g.toLowerCase();
      if (v && J(u, p(f))) h.params[f] = u;
      else if (v || !J(u, f)) return null;
      h.path += `/${u}`;
    }
    if (n) {
      const m = c ? l.slice(-c).join("/") : "";
      if (J(m, p(n))) h.params[n] = m;
      else return null;
    }
    return h;
  };
}
function J(t, e) {
  const r = (o) => o === t;
  return e === void 0 ? true : typeof e == "string" ? r(e) : typeof e == "function" ? e(t) : Array.isArray(e) ? e.some(r) : e instanceof RegExp ? e.test(t) : false;
}
function ne(t) {
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
function Et(t) {
  let e = /(\/?\:[^\/]+)\?/.exec(t);
  if (!e) return [t];
  let r = t.slice(0, e.index), o = t.slice(e.index + e[0].length);
  const n = [r, r += e[1]];
  for (; e = /^(\/\:[^\/]+)\?/.exec(o); ) n.push(r += e[1]), o = o.slice(e[0].length);
  return Et(o).reduce((s, a) => [...s, ...n.map((i) => i + a)], []);
}
const re = 100, oe = createContext(), _t = createContext();
function se(t, e = "") {
  const { component: r, preload: o, load: n, children: s, info: a } = t, i = !s || Array.isArray(s) && !s.length, l = { key: t, component: r, preload: o || n, info: a };
  return It(t.path).reduce((c, h) => {
    for (const p of Et(h)) {
      const m = te(e, p);
      let g = i ? m : m.split("/*", 1)[0];
      g = g.split("/").map((v) => v.startsWith(":") || v.startsWith("*") ? v : encodeURIComponent(v)).join("/"), c.push({ ...l, originalPath: h, pattern: g, matcher: ee(g, !i, t.matchFilters) });
    }
    return c;
  }, []);
}
function ae(t, e = 0) {
  return { routes: t, score: ne(t[t.length - 1]) * 1e4 - e, matcher(r) {
    const o = [];
    for (let n = t.length - 1; n >= 0; n--) {
      const s = t[n], a = s.matcher(r);
      if (!a) return null;
      o.unshift({ ...a, route: s });
    }
    return o;
  } };
}
function It(t) {
  return Array.isArray(t) ? t : [t];
}
function At(t, e = "", r = [], o = []) {
  const n = It(t);
  for (let s = 0, a = n.length; s < a; s++) {
    const i = n[s];
    if (i && typeof i == "object") {
      i.hasOwnProperty("path") || (i.path = "");
      const l = se(i, e);
      for (const c of l) {
        r.push(c);
        const h = Array.isArray(i.children) && i.children.length === 0;
        if (i.children && !h) At(i.children, c.pattern, r, o);
        else {
          const p = ae([...r], o.length);
          o.push(p);
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
function ie(t, e, r) {
  const o = new URL(bt), n = createMemo((h) => {
    const p = t();
    try {
      return new URL(p, o);
    } catch {
      return console.error(`Invalid path ${p}`), h;
    }
  }, o, { equals: (h, p) => h.href === p.href }), s = createMemo(() => n().pathname), a = createMemo(() => n().search, true), i = createMemo(() => n().hash), l = () => "", c = on(a, () => vt(n()));
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
function ce() {
  return L;
}
function ue(t, e, r, o = {}) {
  const { signal: [n, s], utils: a = {} } = t, i = a.parsePath || ((d) => d), l = a.renderPath || ((d) => d), c = a.beforeLeave || yt(), h = W("", o.base || "");
  if (h === void 0) throw new Error(`${h} is not a valid base path`);
  h && !n().value && s({ value: h, replace: true, scroll: false });
  const [p, m] = createSignal(false);
  let g;
  const v = (d, w) => {
    w.value === u() && w.state === y() || (g === void 0 && m(true), L = d, g = w, startTransition(() => {
      g === w && (f(g.value), b(g.state), resetErrorBoundaries(), isServer || P[1]([]));
    }).finally(() => {
      g === w && batch(() => {
        L = void 0, d === "navigate" && kt(g), m(false), g = void 0;
      });
    }));
  }, [u, f] = createSignal(n().value), [y, b] = createSignal(n().state), R = ie(u, y, a.queryWrapper), E = [], P = createSignal(isServer ? Ft() : []), D = createMemo(() => typeof o.transformUrl == "function" ? F(e(), o.transformUrl(R.pathname)) : F(e(), R.pathname)), at = () => {
    const d = D(), w = {};
    for (let S = 0; S < d.length; S++) Object.assign(w, d[S].params);
    return w;
  }, Ot = a.paramsWrapper ? a.paramsWrapper(at, e) : St(at), it = { pattern: h, path: () => h, outlet: () => null, resolvePath(d) {
    return W(h, d);
  } };
  return createRenderEffect(on(n, (d) => v("native", d), { defer: true })), { base: it, location: R, params: Ot, isRouting: p, renderPath: l, parsePath: i, navigatorFactory: Dt, matches: D, beforeLeave: c, preloadRoute: Vt, singleFlight: o.singleFlight === void 0 ? true : o.singleFlight, submissions: P };
  function xt(d, w, S) {
    untrack(() => {
      if (typeof w == "number") {
        w && (a.go ? a.go(w) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const N = !w || w[0] === "?", { replace: j, resolve: T, scroll: $, state: C } = { replace: false, resolve: !N, scroll: true, ...S }, U = T ? d.resolvePath(w) : W(N && R.pathname || "", w);
      if (U === void 0) throw new Error(`Path '${w}' is not a routable path`);
      if (E.length >= re) throw new Error("Too many redirects");
      const ct = u();
      if (U !== ct || C !== y()) if (isServer) {
        const ut = getRequestEvent();
        ut && (ut.response = { status: 302, headers: new Headers({ Location: U }) }), s({ value: U, replace: j, scroll: $, state: C });
      } else c.confirm(U, S) && (E.push({ value: ct, replace: j, scroll: $, state: y() }), v("navigate", { value: U, state: C }));
    });
  }
  function Dt(d) {
    return d = d || useContext(_t) || it, (w, S) => xt(d, w, S);
  }
  function kt(d) {
    const w = E[0];
    w && (s({ ...d, replace: w.replace, scroll: w.scroll }), E.length = 0);
  }
  function Vt(d, w) {
    const S = F(e(), d.pathname), N = L;
    L = "preload";
    for (let j in S) {
      const { route: T, params: $ } = S[j];
      T.component && T.component.preload && T.component.preload();
      const { preload: C } = T;
      w && C && runWithOwner(r(), () => C({ params: $, location: { pathname: d.pathname, search: d.search, hash: d.hash, query: vt(d), state: null, key: "" }, intent: "preload" }));
    }
    L = N;
  }
  function Ft() {
    const d = getRequestEvent();
    return d && d.router && d.router.submission ? [d.router.submission] : [];
  }
}
function le(t, e, r, o) {
  const { base: n, location: s, params: a } = t, { pattern: i, component: l, preload: c } = o().route, h = createMemo(() => o().path);
  l && l.preload && l.preload();
  const p = c ? c({ params: a, location: s, intent: L || "initial" }) : void 0;
  return { parent: e, pattern: i, path: h, outlet: () => l ? createComponent$1(l, { params: a, location: s, data: p, get children() {
    return r();
  } }) : r(), resolvePath(g) {
    return W(n.path(), g, h());
  } };
}
const Rt = (t) => (e) => {
  const { base: r } = e, o = children(() => e.children), n = createMemo(() => At(o(), e.base || ""));
  let s;
  const a = ue(t, n, () => s, { base: r, singleFlight: e.singleFlight, transformUrl: e.transformUrl });
  return t.create && t.create(a), createComponent(oe.Provider, { value: a, get children() {
    return createComponent(fe, { routerState: a, get root() {
      return e.root;
    }, get preload() {
      return e.rootPreload || e.rootLoad;
    }, get children() {
      return [(s = getOwner()) && null, createComponent(he, { routerState: a, get branches() {
        return n();
      } })];
    } });
  } });
};
function fe(t) {
  const e = t.routerState.location, r = t.routerState.params, o = createMemo(() => t.preload && untrack(() => {
    t.preload({ params: r, location: e, intent: ce() || "initial" });
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
function he(t) {
  if (isServer) {
    const n = getRequestEvent();
    if (n && n.router && n.router.dataOnly) {
      de(n, t.routerState, t.branches);
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
      const p = s && s[c], m = n[c];
      a && p && m.route.key === p.route.key ? l[c] = a[c] : (i = false, e[c] && e[c](), createRoot((g) => {
        e[c] = g, l[c] = le(t.routerState, l[c - 1] || t.routerState.base, lt(() => o()[c + 1]), () => t.routerState.matches()[c]);
      }));
    }
    return e.splice(n.length).forEach((c) => c()), a && i ? a : (r = l[0], l);
  }));
  return lt(() => o() && r)();
}
const lt = (t) => () => createComponent(Show, { get when() {
  return t();
}, keyed: true, children: (e) => createComponent(_t.Provider, { value: e, get children() {
  return e.outlet();
} }) });
function de(t, e, r) {
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
function pe(t) {
  let e = false;
  const r = (n) => typeof n == "string" ? { value: n } : n, o = me(createSignal(r(t.get()), { equals: (n, s) => n.value === s.value && n.state === s.state }), void 0, (n) => (!e && t.set(n), sharedConfig.registry && !sharedConfig.done && (sharedConfig.done = true), n));
  return t.init && onCleanup(t.init((n = t.get()) => {
    e = true, o[1](r(n)), e = false;
  })), Rt({ signal: o, create: t.create, utils: t.utils });
}
function ge(t, e, r) {
  return t.addEventListener(e, r), () => t.removeEventListener(e, r);
}
function we(t, e) {
  const r = t && document.getElementById(t);
  r ? r.scrollIntoView() : e && window.scrollTo(0, 0);
}
function ye(t) {
  const e = new URL(t);
  return e.pathname + e.search;
}
function be(t) {
  let e;
  const r = { value: t.url || (e = getRequestEvent()) && ye(e.request.url) || "" };
  return Rt({ signal: [() => r, (o) => Object.assign(r, o)] })(t);
}
const ve = /* @__PURE__ */ new Map();
function Se(t = true, e = false, r = "/_server", o) {
  return (n) => {
    const s = n.base.path(), a = n.navigatorFactory(n.base);
    let i, l;
    function c(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function h(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const f = u.composedPath().find((D) => D instanceof Node && D.nodeName.toUpperCase() === "A");
      if (!f || e && !f.hasAttribute("link")) return;
      const y = c(f), b = y ? f.href.baseVal : f.href;
      if ((y ? f.target.baseVal : f.target) || !b && !f.hasAttribute("state")) return;
      const E = (f.getAttribute("rel") || "").split(/\s+/);
      if (f.hasAttribute("download") || E && E.includes("external")) return;
      const P = y ? new URL(b, document.baseURI) : new URL(b);
      if (!(P.origin !== window.location.origin || s && P.pathname && !P.pathname.toLowerCase().startsWith(s.toLowerCase()))) return [f, P];
    }
    function p(u) {
      const f = h(u);
      if (!f) return;
      const [y, b] = f, R = n.parsePath(b.pathname + b.search + b.hash), E = y.getAttribute("state");
      u.preventDefault(), a(R, { resolve: false, replace: y.hasAttribute("replace"), scroll: !y.hasAttribute("noscroll"), state: E ? JSON.parse(E) : void 0 });
    }
    function m(u) {
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
        const b = new URL(f, bt);
        if (f = n.parsePath(b.pathname + b.search), !f.startsWith(r)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const y = ve.get(f);
      if (y) {
        u.preventDefault();
        const b = new FormData(u.target, u.submitter);
        y.call({ r: n, f: u.target }, u.target.enctype === "multipart/form-data" ? b : new URLSearchParams(b));
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", p), t && (document.addEventListener("mousemove", g, { passive: true }), document.addEventListener("focusin", m, { passive: true }), document.addEventListener("touchstart", m, { passive: true })), document.addEventListener("submit", v), onCleanup(() => {
      document.removeEventListener("click", p), t && (document.removeEventListener("mousemove", g), document.removeEventListener("focusin", m), document.removeEventListener("touchstart", m)), document.removeEventListener("submit", v);
    });
  };
}
function Ee(t) {
  if (isServer) return be(t);
  const e = () => {
    const o = window.location.pathname.replace(/^\/+/, "/") + window.location.search, n = window.history.state && window.history.state._depth && Object.keys(window.history.state).length === 1 ? void 0 : window.history.state;
    return { value: o + window.location.hash, state: n };
  }, r = yt();
  return pe({ get: e, set({ value: o, replace: n, scroll: s, state: a }) {
    n ? window.history.replaceState(Yt(a), "", o) : window.history.pushState(a, "", o), we(decodeURIComponent(window.location.hash.slice(1)), s), tt();
  }, init: (o) => ge(window, "popstate", Gt(o, (n) => {
    if (n && n < 0) return !r.confirm(n);
    {
      const s = e();
      return !r.confirm(s.value, { state: s.state });
    }
  })), create: Se(t.preload, t.explicitLinks, t.actionBase, t.transformUrl), utils: { go: (o) => window.history.go(o), beforeLeave: r } })(t);
}
const _e = { VITE_APP_ID: "subpay", VITE_AUTH_BASE: "https://ssgloghr.com", VITE_IDSVC_URL: "https://ssgloghr.com/idsvc", VITE_SSO_CLIENT_ID: "subpay" }, q = _e || {};
let X = { authBase: q.VITE_AUTH_BASE || "", idsvcUrl: q.VITE_IDSVC_URL || "", appId: q.VITE_APP_ID || "", clientId: q.VITE_SSO_CLIENT_ID || "", perms: {}, callbackPath: "/callback" };
function Ie(t) {
  X = { ...X, ...t };
}
function et() {
  return X;
}
const Ae = () => et().idsvcUrl, Pt = () => et().appId, nt = () => `idsvc_refresh_${Pt()}`;
let x = null;
const Lt = () => localStorage.getItem(nt()), Re = (t) => {
  x = t.access, localStorage.setItem(nt(), t.refresh);
}, Pe = () => {
  x = null, localStorage.removeItem(nt());
}, Le = () => !!Lt();
async function Te(t, e) {
  const r = await fetch(`${Ae()}${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), o = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(o.error || `HTTP ${r.status}`), { status: r.status });
  return o && typeof o == "object" && o.data !== void 0 ? o.data : o;
}
let k = null;
async function Ce() {
  return k || (k = (async () => {
    const t = Lt();
    if (!t) return false;
    try {
      const e = await Te("/auth/refresh", { refresh: t, app: Pt() });
      return Re(e), true;
    } catch (e) {
      return ((e == null ? void 0 : e.status) === 401 || (e == null ? void 0 : e.status) === 400) && Pe(), false;
    } finally {
      k = null;
    }
  })(), k);
}
function Tt() {
  if (!x) return null;
  try {
    return JSON.parse(atob(x.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
function Ue() {
  const t = Tt();
  return !t || t.exp * 1e3 - Date.now() < 6e4;
}
async function Oe() {
  return (!x || Ue()) && await Ce(), x;
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
const rt = "ops_user", Y = /* @__PURE__ */ new Set();
function Ct() {
  for (const t of Y) t();
}
function De(t) {
  return Y.add(t), () => Y.delete(t);
}
const ke = () => {
  try {
    return JSON.parse(localStorage.getItem(rt) || "null");
  } catch {
    return null;
  }
};
let B = ke(), Ve = false, Fe = null;
const Ut = () => ({ user: B, loading: Ve, error: Fe });
function Be(t) {
  t && localStorage.setItem(rt, JSON.stringify(t)), B = t, Ct();
}
function Ne() {
  var _a;
  const t = Tt();
  if (!t) return false;
  const e = et().appId, o = (((_a = t.apps) == null ? void 0 : _a[e]) || Object.values(t.apps || {})[0] || {}).scope || {}, n = o.flags || {}, s = { id: t.sub, uid: t.uid, originalUserId: t.sub, googleUid: t.sub, name: t.name || "", email: t.email || (B == null ? void 0 : B.email) || "", businessId: o.businessId || "", permissions: { ...n, isAdmin: !!t.superadmin || xe(n.isAdmin) }, superadmin: !!t.superadmin, apps: t.apps };
  return Be(s), true;
}
async function je() {
  return Le() ? navigator.onLine ? await Oe() ? (Ne(), true) : (localStorage.removeItem(rt), B = null, Ct(), false) : !!B : false;
}
const ot = Ut(), [un, $e] = createSignal(ot.user), [ln, qe] = createSignal(ot.loading), [fn, Me] = createSignal(ot.error);
De(() => {
  const t = Ut();
  $e(t.user), qe(t.loading), Me(t.error);
});
const We = { VITE_APP_ID: "subpay", VITE_AUTH_BASE: "https://ssgloghr.com", VITE_IDSVC_URL: "https://ssgloghr.com/idsvc", VITE_SSO_CLIENT_ID: "subpay" }, M = We, Ke = { admin: ["*"], owner: ["*"] };
Ie({ authBase: M.VITE_AUTH_BASE, idsvcUrl: M.VITE_IDSVC_URL, appId: M.VITE_APP_ID, clientId: M.VITE_SSO_CLIENT_ID, perms: Ke, callbackPath: "/callback" });
const [hn, ft] = createSignal(true);
async function He() {
  ft(true);
  try {
    await je();
  } catch {
  } finally {
    ft(false);
  }
}
function dn() {
  return onMount(() => {
    He();
  }), createComponent(Ee, { root: (t) => createComponent(Suspense, { get children() {
    return t.children;
  } }), get children() {
    return createComponent(It$1, {});
  } });
}

export { dn as default };
//# sourceMappingURL=app-D_SIGV8g.mjs.map
