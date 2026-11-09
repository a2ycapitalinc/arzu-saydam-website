const { deliverNotification } = require("../lib/notify");

function readBody(req) {
  const raw = req.body;
  if (raw && typeof raw === "object") return raw;
  if (typeof raw === "string") {
    if (raw.length > 20000) return { tooLarge: true };
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }
  return {};
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, reason: "method" });
    return;
  }
  const body = readBody(req);
  if (!body || body.tooLarge) {
    res.status(422).json({ ok: false, reason: "invalid", giftDelivered: false });
    return;
  }
  const result = await deliverNotification({
    env: process.env,
    body: body,
    honeypot: body.company || body._gotcha || "",
    fetchImpl: globalThis.fetch,
    now: new Date()
  });
  const payload = { ok: !!result.ok, reason: result.reason || null, giftDelivered: false };
  res.status(result.ok ? 200 : 422).json(payload);
};
