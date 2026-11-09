const GIFTS = {
  story: "A short story",
  sample: "A sample chapter",
  journal: "A printable garden-journal page",
  travel: "A travel essay"
};

const TOPICS = {
  reader: "A note from a reader",
  event: "An event invitation",
  media: "A media or interview request",
  other: "Something else"
};

function text(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isEmail(value) {
  return typeof value === "string" && value.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function mailConfig(env) {
  const source = env || {};
  const notifyTo = text(source.NOTIFY_TO, 320);
  const contactTo = text(source.CONTACT_TO, 320) || notifyTo;
  return {
    from: text(source.MAIL_FROM, 320),
    notifyTo: notifyTo,
    contactTo: contactTo,
    tenant: text(source.MS_TENANT_ID, 80),
    clientId: text(source.MS_CLIENT_ID, 80),
    secret: typeof source.MS_CLIENT_SECRET === "string" ? source.MS_CLIENT_SECRET : ""
  };
}

function configReady(cfg) {
  return isEmail(cfg.from) && isEmail(cfg.notifyTo) && isEmail(cfg.contactTo) && cfg.tenant && cfg.clientId && cfg.secret;
}

function buildSubmission(body, now) {
  const kind = body && body.kind;
  const language = body && body.language === "en" ? "en" : body && body.language === "tr" ? "tr" : "";
  if (language !== "tr" && language !== "en") return { error: "invalid" };
  const email = text(body.email, 320);
  const name = text(body.name, 200);
  if (!isEmail(email)) return { error: "invalid" };
  const received = (now instanceof Date ? now : new Date(now)).toISOString();
  if (kind === "newsletter") {
    const giftId = text(body.giftId, 40);
    if (!Object.prototype.hasOwnProperty.call(GIFTS, giftId)) return { error: "invalid" };
    const giftLabel = text(body.giftLabel, 120) || GIFTS[giftId];
    return {
      submission: { kind, name, email, giftId, giftLabel, language, received }
    };
  }
  if (kind === "contact") {
    const topicId = text(body.topicId, 40);
    const message = text(body.message, 5000);
    if (!Object.prototype.hasOwnProperty.call(TOPICS, topicId) || !message) return { error: "invalid" };
    const topicLabel = text(body.topicLabel, 120) || TOPICS[topicId];
    return {
      submission: { kind, name, email, topicId, topicLabel, message, language, received }
    };
  }
  return { error: "invalid" };
}

function messageFor(submission, cfg) {
  if (submission.kind === "newsletter") {
    return {
      from: cfg.from,
      to: cfg.notifyTo,
      replyTo: submission.email,
      subject: "Newsletter signup: " + submission.giftId,
      text: [
        "Newsletter signup",
        "Name: " + (submission.name || "(not given)"),
        "Email: " + submission.email,
        "Gift: " + submission.giftLabel + " (" + submission.giftId + ")",
        "Language: " + submission.language,
        "Received: " + submission.received
      ].join("\n")
    };
  }
  return {
    from: cfg.from,
    to: cfg.contactTo,
    replyTo: submission.email,
    subject: "Website contact: " + submission.topicId,
    text: [
      "Website contact",
      "Name: " + (submission.name || "(not given)"),
      "Email: " + submission.email,
      "Topic: " + submission.topicLabel + " (" + submission.topicId + ")",
      "Language: " + submission.language,
      "Received: " + submission.received,
      "",
      submission.message
    ].join("\n")
  };
}

async function sendGraphMail({ fetchImpl, cfg, message }) {
  const tokenRes = await fetchImpl(
    "https://login.microsoftonline.com/" + encodeURIComponent(cfg.tenant) + "/oauth2/v2.0/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.secret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials"
      })
    }
  );
  if (!tokenRes || !tokenRes.ok) return { ok: false, reason: "rejected", status: tokenRes && tokenRes.status };
  const token = await tokenRes.json();
  if (!token || !token.access_token) return { ok: false, reason: "rejected" };
  const sendRes = await fetchImpl(
    "https://graph.microsoft.com/v1.0/users/" + encodeURIComponent(cfg.from) + "/sendMail",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token.access_token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: {
          subject: message.subject,
          body: { contentType: "Text", content: message.text },
          toRecipients: [{ emailAddress: { address: message.to } }],
          replyTo: [{ emailAddress: { address: message.replyTo } }]
        },
        saveToSentItems: true
      })
    }
  );
  if (!sendRes || (sendRes.status !== 202 && !sendRes.ok)) {
    return { ok: false, reason: "rejected", status: sendRes && sendRes.status };
  }
  return { ok: true };
}

async function deliverNotification({ env, body, honeypot, fetchImpl, now }) {
  if (honeypot) return { ok: false, reason: "spam" };
  const cfg = mailConfig(env);
  if (!configReady(cfg)) return { ok: false, reason: "unconfigured" };
  const built = buildSubmission(body, now || new Date());
  if (built.error) return { ok: false, reason: built.error };
  const message = messageFor(built.submission, cfg);
  let sent;
  try {
    sent = await sendGraphMail({ fetchImpl, cfg, message });
  } catch (err) {
    return { ok: false, reason: "network" };
  }
  if (!sent.ok) return sent;
  return { ok: true, giftDelivered: false, message: message };
}

module.exports = {
  GIFTS,
  TOPICS,
  mailConfig,
  buildSubmission,
  messageFor,
  deliverNotification
};
