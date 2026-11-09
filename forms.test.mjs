import test from "node:test";
import assert from "node:assert/strict";
import { deliverForm } from "./forms.mjs";

const endpoint = "https://formspree.io/f/abc123";

test("missing endpoint does not call the network and is not a success", async () => {
  let called = false;
  const result = await deliverForm({
    endpoint: "",
    payload: { email: "a@b.co" },
    honeypot: "",
    kind: "contact",
    giftReady: false,
    fetchImpl: () => { called = true; return Promise.resolve({ ok: true }); }
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "unconfigured");
  assert.equal(called, false);
});

test("a non-Formspree URL is refused", async () => {
  let called = false;
  const result = await deliverForm({
    endpoint: "https://example.com/collect",
    payload: {},
    honeypot: "",
    kind: "contact",
    fetchImpl: () => { called = true; return Promise.resolve({ ok: true }); }
  });
  assert.equal(result.reason, "unconfigured");
  assert.equal(called, false);
});

test("newsletter gift that is not ready is not submitted", async () => {
  let called = false;
  const result = await deliverForm({
    endpoint: endpoint,
    payload: { gift_id: "story" },
    honeypot: "",
    kind: "newsletter",
    giftReady: false,
    fetchImpl: () => { called = true; return Promise.resolve({ ok: true }); }
  });
  assert.equal(result.reason, "gift-not-ready");
  assert.equal(called, false);
});

test("honeypot is not submitted and is not a success", async () => {
  let called = false;
  const result = await deliverForm({
    endpoint: endpoint,
    payload: { email: "a@b.co" },
    honeypot: "spam company",
    kind: "contact",
    fetchImpl: () => { called = true; return Promise.resolve({ ok: true }); }
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "spam");
  assert.equal(called, false);
});

test("accepted response is the only success", async () => {
  const result = await deliverForm({
    endpoint: endpoint,
    payload: { name: "Arzu", email: "a@b.co", message: "Hello" },
    honeypot: "",
    kind: "contact",
    fetchImpl: (url, init) => {
      assert.equal(url, endpoint);
      assert.equal(init.method, "POST");
      assert.equal(init.headers.Accept, "application/json");
      const body = JSON.parse(init.body);
      assert.equal(body.email, "a@b.co");
      assert.equal(body._replyto, undefined);
      return Promise.resolve({ ok: true, status: 200 });
    }
  });
  assert.deepEqual(result, { ok: true });
});

test("rejected response is not a success", async () => {
  const result = await deliverForm({
    endpoint: endpoint,
    payload: { email: "a@b.co" },
    honeypot: "",
    kind: "contact",
    fetchImpl: () => Promise.resolve({ ok: false, status: 422 })
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "rejected");
  assert.equal(result.status, 422);
});

test("network failure is not a success", async () => {
  const result = await deliverForm({
    endpoint: endpoint,
    payload: {},
    honeypot: "",
    kind: "newsletter",
    giftReady: true,
    fetchImpl: () => Promise.reject(new Error("offline"))
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "network");
});
