# Contact and newsletter delivery

The thank-you on each form stays hidden until Formspree accepts the submission. With the endpoints in `forms-config.js` left blank, submitting shows an error and does not claim the message or the gift was sent.

## What the pages promise

Contact (`contact.html`) tells the sender the message was sent and that Arzu will reply. That sentence is shown only after Formspree returns success. Formspree must email `hello@arzusaydamauthor.com`.

Newsletter (`newsletter.html`) tells the sender the chosen gift is already on its way. That sentence stays hidden until both of these are true:

1. The matching `newsletterEndpoints` URL is a real `https://formspree.io/f/…` form.
2. `newsletterGiftsReady` for that gift is `true`.

Do not set a gift to `true` until an email you send yourself from that form contains the gift. A signup notification to Arzu is not the gift.

## Gifts named on the site

| Choice | Promised | In the repository |
| --- | --- | --- |
| `story` | A short story, emailed | Missing. No story file. |
| `sample` | A sample chapter of *Bahçemin Sessiz Bilgeliği* | Not a file. The foreword is only the on-page excerpt in `books.html` (`#sample`). |
| `journal` | A printable garden-journal page | Missing. |
| `travel` | A travel essay | Missing. The blog notes are not packaged as this gift. |

The homepage also mentions a free short story. That file is not in the repo either. The PDFs under `assets/` are media kits, not these gifts.

## Owner setup

1. Create the Formspree account and forms yourself. This repository does not contain a form id.
2. Contact: one form. Set the notification address to `hello@arzusaydamauthor.com`. Paste `https://formspree.io/f/yourId` into `contactEndpoint`.
3. Newsletter: one form per gift (`story`, `sample`, `journal`, `travel`), because a single autoresponse sends the same email to every subscriber. Point each `newsletterEndpoints` entry at its form.
4. On each newsletter form, turn on the submitter autoresponse only when the body or attachment is that gift. Then set that gift's `newsletterGiftsReady` flag to `true`.
5. In Formspree, keep spam filtering on. The site also drops submissions that fill the hidden `_gotcha` field and does not show the thank-you for those.
6. Confirm `hello@arzusaydamauthor.com` receives mail. DNS already points MX at Microsoft 365. SPF is `v=spf1 include:secureserver.net -all`, which hard-fails senders other than GoDaddy. Update SPF before anyone sends as `@arzusaydamauthor.com` from Microsoft or Formspree.
7. Deploy only after those values are real. Do not commit a placeholder URL.

No test submission is made from this repository.
