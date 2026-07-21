const o = process.env.TV_CLAIM_UPSTREAM || "https://ssgloghr.com/sso/tv/claim";
async function a(s) {
  const e = await s.request.text(), t = await fetch(o, { method: "POST", headers: { "Content-Type": "application/json" }, body: e }), n = await t.text();
  return new Response(n, { status: t.status, headers: { "Content-Type": "application/json" } });
}

export { a as POST };
//# sourceMappingURL=claim2.mjs.map
