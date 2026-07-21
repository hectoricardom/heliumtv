const r = (process.env.MEDIA_UPSTREAM || "https://media.ssgloghr.com").replace(/\/$/, "");
async function h(t) {
  const n = new URL(t.request.url), s = t.request.headers.get("range"), e = await fetch(`${r}${n.pathname}${n.search}`, { headers: s ? { Range: s } : {} }), a = { "Content-Type": e.headers.get("content-type") || "application/octet-stream" };
  for (const c of ["content-length", "content-range", "accept-ranges", "cache-control"]) {
    const o = e.headers.get(c);
    o && (a[c] = o);
  }
  return new Response(e.body, { status: e.status, headers: a });
}

export { h as GET };
//# sourceMappingURL=_2...path_.mjs.map
