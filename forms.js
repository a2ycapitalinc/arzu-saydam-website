(function () {
  var ENDPOINT = "https://api.web3forms.com/submit";

  function isEnglish() {
    return document.documentElement.classList.contains("lang-en") || document.documentElement.lang === "en";
  }

  function language() {
    return isEnglish() ? "en" : "tr";
  }

  function optionLabel(select) {
    if (!select) return "";
    var opt = select.options[select.selectedIndex];
    return opt ? opt.textContent.trim() : "";
  }

  function text(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || "").trim() : "";
  }

  function message(kind, ok) {
    var en = isEnglish();
    if (ok) return "";
    if (kind === "newsletter") {
      return en
        ? "The signup could not be sent. Please try again."
        : "Kayıt iletilemedi. Lütfen yeniden deneyin.";
    }
    return en
      ? "The message could not be sent. Please try again."
      : "Mesaj iletilemedi. Lütfen yeniden deneyin.";
  }

  function showStatus(status, text) {
    if (!status) return;
    status.textContent = text;
    status.hidden = !text;
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var kind = form.getAttribute("data-form");
    var button = form.querySelector('[type="submit"]');
    var status = document.getElementById(form.id + "-status");
    var thanks = document.getElementById(kind === "newsletter" ? "nl-thanks" : "c-thanks");
    var bot = form.querySelector('[name="botcheck"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var email = text(form, "email");
      form.querySelector('[name="replyto"]').value = email;
      form.querySelector('[name="language"]').value = language();
      form.querySelector('[name="page_url"]').value = location.href;
      if (kind === "newsletter") {
        var gift = form.querySelector('[name="gift_id"]');
        form.querySelector('[name="gift"]').value = optionLabel(gift);
      }
      if (kind === "contact") {
        var topic = form.querySelector('[name="topic_id"]');
        form.querySelector('[name="topic"]').value = optionLabel(topic);
      }

      var payload = {};
      new FormData(form).forEach(function (value, key) {
        payload[key] = value;
      });
      if (bot && bot.checked) payload.botcheck = true;
      else delete payload.botcheck;

      if (button) button.disabled = true;
      form.setAttribute("aria-busy", "true");
      showStatus(status, "");

      fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json().then(function (data) {
          return data && typeof data === "object" ? data : { success: false };
        }, function () {
          return { success: false };
        });
      }).then(function (data) {
        if (data && data.success === true) {
          form.hidden = true;
          if (thanks) {
            thanks.hidden = false;
            thanks.style.display = "";
          }
          return;
        }
        if (button) button.disabled = false;
        form.setAttribute("aria-busy", "false");
        showStatus(status, message(kind, false));
      }, function () {
        if (button) button.disabled = false;
        form.setAttribute("aria-busy", "false");
        showStatus(status, message(kind, false));
      });
    });
  });
})();
