function text(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function language() {
  return document.documentElement.lang === "en" ? "en" : "tr";
}

function optionLabel(select) {
  if (!select) return "";
  var opt = select.options[select.selectedIndex];
  if (!opt) return "";
  var en = document.documentElement.classList.contains("lang-en");
  var labeled = opt.getAttribute(en ? "data-label-en" : "data-label-tr");
  return (labeled || opt.textContent || "").trim();
}

function setBusy(form, busy) {
  form.setAttribute("aria-busy", busy ? "true" : "false");
  var button = form.querySelector('[type="submit"]');
  if (button) button.disabled = busy;
}

function show(el) {
  if (!el) return;
  el.hidden = false;
  el.style.display = "";
}

function hide(el) {
  if (!el) return;
  el.hidden = true;
}

function statusMessage(reason, kind) {
  var en = document.documentElement.classList.contains("lang-en");
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

function postForm(payload) {
  return fetch("/api/form", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload)
  }).then(function (res) {
    return res.json().then(function (data) {
      return data && typeof data === "object" ? data : { ok: false, reason: "rejected" };
    }, function () {
      return { ok: false, reason: "rejected", status: res.status };
    });
  }, function () {
    return { ok: false, reason: "network" };
  });
}

function wire(formId, kind) {
  var form = document.getElementById(formId);
  if (!form) return;
  var status = document.getElementById(formId + "-status");
  var thanks = document.getElementById(kind === "contact" ? "c-thanks" : "nl-thanks");
  var received = document.getElementById("nl-received");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    hide(status);
    var honeypot = text(kind === "contact" ? "c-company" : "nl-company");
    var payload;
    if (kind === "contact") {
      var topic = document.getElementById("c-topic");
      payload = {
        kind: "contact",
        name: text("c-name"),
        email: text("c-email"),
        topicId: topic ? topic.value : "",
        topicLabel: optionLabel(topic),
        message: text("c-msg"),
        language: language(),
        company: honeypot
      };
    } else {
      var gift = document.getElementById("nl-gift");
      payload = {
        kind: "newsletter",
        name: text("nl-name"),
        email: text("nl-email"),
        giftId: gift ? gift.value : "",
        giftLabel: optionLabel(gift),
        language: language(),
        company: honeypot
      };
    }
    setBusy(form, true);
    postForm(payload).then(function (result) {
      setBusy(form, false);
      if (result && result.ok && kind === "contact") {
        form.hidden = true;
        show(thanks);
        return;
      }
      if (result && result.ok && result.giftDelivered === true) {
        form.hidden = true;
        show(thanks);
        return;
      }
      if (result && result.ok && kind === "newsletter") {
        form.hidden = true;
        show(received);
        return;
      }
      if (status) {
        status.textContent = statusMessage(result && result.reason, kind);
        show(status);
      }
    });
  });
}

if (typeof document !== "undefined") {
  wire("c-form", "contact");
  wire("nl-form", "newsletter");
}
