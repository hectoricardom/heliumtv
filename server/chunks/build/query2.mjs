const n = process.env.API_UPSTREAM || "https://ssgloghr.com/api/query";
async function r(t) {
  const o = await t.request.text(), e = t.request.headers.get("authorization") || "", s = await fetch(n, { method: "POST", headers: { "Content-Type": "application/json", ...e ? { Authorization: e } : {} }, body: o }), a = await s.text();
  return new Response(a, { status: s.status, headers: { "Content-Type": "application/json" } });
}

export { r as POST };
//# sourceMappingURL=query2.mjs.map
