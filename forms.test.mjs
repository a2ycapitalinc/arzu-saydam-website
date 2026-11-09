import test from "node:test";
import assert from "node:assert/strict";
import { deliverNotification } from "./lib/notify.js";

const env = {
  MAIL_FROM: "hello@arzusaydamauthor.com",
  NOTIFY_TO: "arzusaydamauthor@gmail.com",
  MS_TENANT_ID: "tenant-id",
  MS_CLIENT_ID: "client-id",
  MS_CLIENT_SECRET: "test-secret"
};

const when = new Date("2026-11-09T17:00:00.000Z");

function graphFetch(capture) {
  return async function (url, init) {
    capture.push({ url, init });
    if (String(url).includes("/oauth2/v2.0/token")) {
      return { ok: true, status: 200, json: async () => ({ access_token: "token-value" }) };
    }
    return { ok: true, status: 202, json: async () => ({}) };
  };
}

test("missing mail configuration does not call the network", async () => {
  let called = false;
  const result = await deliverNotification({
    env: {},
    body: { kind: "contact", email: "a@b.co", topicId: "reader", message: "Hello", language: "en" },
    honeypot: "",
    now: when,
    fetchImpl: () => { called = true; }
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "unconfigured");
  assert.equal(called, false);
});

test("honeypot is not sent", async () => {
  let called = false;
  const result = await deliverNotification({
    env,
    body: { kind: "newsletter", email: "a@b.co", giftId: "story", language: "tr" },
    honeypot: "filled",
    now: when,
    fetchImpl: () => { called = true; }
  });
  assert.equal(result.reason, "spam");
  assert.equal(called, false);
});

test("newsletter mail goes from MAIL_FROM to NOTIFY_TO with the signup details", async () => {
  const calls = [];
  const result = await deliverNotification({
    env,
    body: {
      kind: "newsletter",
      name: "Ada",
      email: "ada@example.com",
      giftId: "story",
      giftLabel: "A short story",
      language: "en"
    },
    honeypot: "",
    now: when,
    fetchImpl: graphFetch(calls)
  });
  assert.equal(result.ok, true);
  assert.equal(result.giftDelivered, false);
  assert.equal(calls.length, 2);
  const tokenBody = calls[0].init.body;
  assert.equal(tokenBody.get("grant_type"), "client_credentials");
  assert.equal(tokenBody.get("client_id"), "client-id");
  assert.equal(tokenBody.get("scope"), "https://graph.microsoft.com/.default");
  assert.equal(calls[1].url, "https://graph.microsoft.com/v1.0/users/hello%40arzusaydamauthor.com/sendMail");
  const sent = JSON.parse(calls[1].init.body);
  assert.equal(sent.message.toRecipients[0].emailAddress.address, "arzusaydamauthor@gmail.com");
  assert.equal(sent.message.replyTo[0].emailAddress.address, "ada@example.com");
  assert.match(sent.message.body.content, /Name: Ada/);
  assert.match(sent.message.body.content, /Email: ada@example.com/);
  assert.match(sent.message.body.content, /Gift: A short story \(story\)/);
  assert.match(sent.message.body.content, /Language: en/);
  assert.match(sent.message.body.content, /Received: 2026-11-09T17:00:00.000Z/);
  assert.equal(calls[1].init.headers.Authorization, "Bearer token-value");
});

test("contact uses CONTACT_TO when set and NOTIFY_TO otherwise", async () => {
  const calls = [];
  await deliverNotification({
    env: Object.assign({}, env, { CONTACT_TO: "press@example.com" }),
    body: {
      kind: "contact",
      name: "Ada",
      email: "ada@example.com",
      topicId: "media",
      topicLabel: "A media or interview request",
      message: "Hello from the site",
      language: "tr"
    },
    honeypot: "",
    now: when,
    fetchImpl: graphFetch(calls)
  });
  const sent = JSON.parse(calls[1].init.body);
  assert.equal(sent.message.toRecipients[0].emailAddress.address, "press@example.com");
  assert.match(sent.message.body.content, /Topic: A media or interview request \(media\)/);
  assert.match(sent.message.body.content, /Language: tr/);
  assert.match(sent.message.body.content, /Hello from the site/);

  const fallback = [];
  await deliverNotification({
    env,
    body: {
      kind: "contact",
      name: "Ada",
      email: "ada@example.com",
      topicId: "reader",
      message: "A note",
      language: "en"
    },
    honeypot: "",
    now: when,
    fetchImpl: graphFetch(fallback)
  });
  const fallbackSent = JSON.parse(fallback[1].init.body);
  assert.equal(fallbackSent.message.toRecipients[0].emailAddress.address, "arzusaydamauthor@gmail.com");
});

test("a rejected Graph response is not a success and does not claim a gift was sent", async () => {
  const result = await deliverNotification({
    env,
    body: { kind: "newsletter", email: "ada@example.com", giftId: "journal", language: "en" },
    honeypot: "",
    now: when,
    fetchImpl: async (url) => {
      if (String(url).includes("token")) return { ok: true, status: 200, json: async () => ({ access_token: "token-value" }) };
      return { ok: false, status: 403, json: async () => ({}) };
    }
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "rejected");
  assert.equal(result.giftDelivered, undefined);
});

test("network failure is not a success", async () => {
  const result = await deliverNotification({
    env,
    body: { kind: "contact", email: "ada@example.com", topicId: "other", message: "Hi", language: "en" },
    honeypot: "",
    now: when,
    fetchImpl: () => Promise.reject(new Error("offline"))
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "network");
});
