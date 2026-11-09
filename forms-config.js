/* Form delivery settings. Empty endpoints fail closed: the thank-you
   is never shown until a real Formspree URL is pasted here and, for the
   newsletter, that gift's autoresponse is actually sending the file.
   Do not put a placeholder URL. Do not set a gift to true until the
   message the subscriber receives contains that gift. */
window.ARZU_FORMS = {
  contactEndpoint: "",
  newsletterEndpoints: {
    story: "",
    sample: "",
    journal: "",
    travel: ""
  },
  newsletterGiftsReady: {
    story: false,
    sample: false,
    journal: false,
    travel: false
  }
};
