const FORMSPREE = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/;

export function deliverForm({ endpoint, payload, honeypot, fetchImpl, kind, giftReady }) {
  if (honeypot) return Promise.resolve({ ok: false, reason: "spam" });
  if (kind === "newsletter" && !giftReady) {
    return Promise.resolve({ ok: false, reason: "gift-not-ready" });
  }
  if (!endpoint || !FORMSPREE.test(endpoint)) {
    return Promise.resolve({ ok: false, reason: "unconfigured" });
  }
  const send = fetchImpl;
  return send(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  }).then(function (res) {
    if (!res || !res.ok) return { ok: false, reason: "rejected", status: res && res.status };
    return { ok: true };
  }, function () {
    return { ok: false, reason: "network" };
  });
}

function text(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function selected(id) {
  var el = document.getElementById(id);
  if (!el) return { id: "", label: "" };
  var opt = el.options[el.selectedIndex];
  return { id: el.value, label: opt ? opt.textContent.trim() : el.value };
}

function config() {
  return window.ARZU_FORMS || {};
}

function setBusy(form, busy) {
  form.setAttribute("aria-busy", busy ? "true" : "false");
  var button = form.querySelector('[type="submit"]');
  if (button) button.disabled = busy;
}

function show(el) {
  if (el) el.hidden = false;
}
function hide(el) {
  if (el) el.hidden = true;
}

function statusMessage(reason, kind) {
  var en = document.documentElement.classList.contains("lang-en");
  if (reason === "gift-not-ready") {
    return en
      ? "This welcome gift is not set up to send yet, so the signup was not completed."
      : "Bu hoş geldin hediyesi henüz gönderilecek şekilde hazır değil, bu yüzden kayıt tamamlanmadı.";
  }
  if (reason === "unconfigured") {
    return en
      ? "This form cannot send yet. Please write to hello@arzusaydamauthor.com."
      : "Bu form henüz iletilemiyor. Lütfen hello@arzusaydamauthor.com adresine yazın.";
  }
  if (kind === "newsletter") {
    return en
      ? "The signup could not be sent. Please try again, or write to hello@arzusaydamauthor.com."
      : "Kayıt iletilemedi. Lütfen yeniden deneyin ya da hello@arzusaydamauthor.com adresine yazın.";
  }
  return en
    ? "The message could not be sent. Please try again, or write to hello@arzusaydamauthor.com."
    : "Mesaj iletilemedi. Lütfen yeniden deneyin ya da hello@arzusaydamauthor.com adresine yazın.";
}

function wire(formId, kind) {
  var form = document.getElementById(formId);
  if (!form) return;
  var status = document.getElementById(formId + "-status");
  var thanks = document.getElementById(kind === "contact" ? "c-thanks" : "nl-thanks");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    hide(status);
    var honeypot = text(kind === "contact" ? "c-company" : "nl-company");
    var email = text(kind === "contact" ? "c-email" : "nl-email");
    var cfg = config();
    var endpoint = "";
    var giftReady = false;
    var payload;
    if (kind === "contact") {
      var topic = selected("c-topic");
      endpoint = cfg.contactEndpoint || "";
      payload = {
        name: text("c-name"),
        email: email,
        topic: topic.label,
        topic_id: topic.id,
        message: text("c-msg"),
        _replyto: email,
        _subject: "Website contact: " + (topic.label || "message")
      };
    } else {
      var gift = selected("nl-gift");
      var ends = cfg.newsletterEndpoints || {};
      var ready = cfg.newsletterGiftsReady || {};
      endpoint = ends[gift.id] || "";
      giftReady = !!ready[gift.id];
      payload = {
        first_name: text("nl-name"),
        email: email,
        gift: gift.label,
        gift_id: gift.id,
        _replyto: email,
        _subject: "Newsletter signup: " + (gift.id || "gift")
      };
    }
    setBusy(form, true);
    deliverForm({
      endpoint: endpoint,
      payload: payload,
      honeypot: honeypot,
      fetchImpl: window.fetch.bind(window),
      kind: kind,
      giftReady: giftReady
    }).then(function (result) {
      setBusy(form, false);
      if (result.ok) {
        form.hidden = true;
        show(thanks);
        return;
      }
      if (status) {
        status.textContent = statusMessage(result.reason, kind);
        show(status);
      }
    });
  });
}

if (typeof document !== "undefined") {
  wire("c-form", "contact");
  wire("nl-form", "newsletter");
}
