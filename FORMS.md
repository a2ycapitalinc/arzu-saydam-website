# Contact and newsletter delivery

Both forms post to the Vercel function `api/form.js`. That function sends one notification through Microsoft Graph `sendMail`, from the mailbox in `MAIL_FROM` to the address in `NOTIFY_TO`. Contact can use a different recipient with `CONTACT_TO`; when that variable is empty, contact uses `NOTIFY_TO`.

Nothing in this repository is a secret. The client id, tenant id, and client secret belong in the Vercel project environment, not in git. With those variables empty, the function refuses the submission and the page does not show a success message.

No test message is sent from this repository.

## What the visitor is told

Contact (`contact.html`) says the message was sent and that Arzu will reply. That sentence is shown only after Graph accepts the notification (`202`).

Newsletter (`newsletter.html`) still contains the sentence that the chosen gift is on its way. That sentence stays hidden. The function always returns `giftDelivered: false`, because the short story, sample chapter, journal page, and travel essay are not files in this repository and the function does not email a gift to the subscriber. After the notification is accepted, the page says the signup was received and the gift was not emailed.

## Notification contents

A newsletter notification is plain text and includes the name, email, chosen gift label and id, page language (`tr` or `en`), and the server timestamp in UTC.

A contact notification includes the name, email, topic label and id, message, page language, and the same timestamp. `Reply-To` is the address the visitor typed, so a reply from the mailbox goes to them. The `From` mailbox is still `MAIL_FROM`.

## Why Graph, not SMTP AUTH

The domain's mail is Microsoft 365. A Vercel function sends with Microsoft Graph, application permission, client credentials:

1. `POST https://login.microsoftonline.com/{MS_TENANT_ID}/oauth2/v2.0/token` with `grant_type=client_credentials` and scope `https://graph.microsoft.com/.default`.
2. `POST https://graph.microsoft.com/v1.0/users/{MAIL_FROM}/sendMail`. `202` is success.

SMTP AUTH at `smtp.office365.com:587` is the wrong default for a new function. Basic authentication for SMTP AUTH is still available only through the end of December 2026, then Microsoft disables it by default for existing tenants. Administrators can turn it back on until Microsoft announces the final removal in the second half of 2027. New tenants after that cutoff cannot use it. Many tenants also leave SMTP AUTH disabled on the mailbox. OAuth SMTP on port 587 still exists, but it is a longer-lived connection and a poorer fit for a short Vercel function than one HTTPS call. Graph is the method this function uses.

## Environment variables

Set these on the Vercel project `arzu-saydam-author` for Production. Leave them off Preview unless a preview deployment should send real mail.

| Name | Required | Purpose |
| --- | --- | --- |
| `MAIL_FROM` | yes | Mailbox Graph sends as. Use `hello@arzusaydamauthor.com`. |
| `NOTIFY_TO` | yes | Recipient for newsletter signups, and for contact when `CONTACT_TO` is empty. Use `arzusaydamauthor@gmail.com`. |
| `CONTACT_TO` | no | Contact recipient. Defaults to `NOTIFY_TO`. |
| `MS_TENANT_ID` | yes | Directory (tenant) id of the Entra app. |
| `MS_CLIENT_ID` | yes | Application (client) id. |
| `MS_CLIENT_SECRET` | yes | Client secret value. Rotate it in Entra and update Vercel. Never commit it. |

`.env.example` lists the names only.

## Owner setup

1. Confirm the mailbox `hello@arzusaydamauthor.com` exists in this Microsoft 365 tenant and is allowed to send.
2. In Microsoft Entra admin center, create an app registration in this tenant only. No redirect URI. Copy the application (client) id and the directory (tenant) id.
3. Create a client secret and copy the value once. Store it as `MS_CLIENT_SECRET` in Vercel. Do not grant the tenant-wide Graph application permission `Mail.Send`.
4. In Exchange Online PowerShell, limit that app to the one mailbox with RBAC for Applications. Use the enterprise application's object id (not the app registration object id):

   ```powershell
   Connect-ExchangeOnline
   New-ServicePrincipal -AppId "<MS_CLIENT_ID>" -ObjectId "<enterprise-app-object-id>" -DisplayName "Arzu website forms"
   New-ManagementScope -Name "Arzu website sender" -RecipientRestrictionFilter "UserPrincipalName -eq 'hello@arzusaydamauthor.com'"
   New-ManagementRoleAssignment -App "<MS_CLIENT_ID>" -Role "Application Mail.Send" -CustomResourceScope "Arzu website sender"
   ```

   The role assignment can take time to propagate. This is the current way to give an app `Application Mail.Send` for one mailbox. Do not create a new application access policy; Microsoft has replaced that with RBAC for Applications.
5. In Vercel, set `MAIL_FROM`, `NOTIFY_TO`, `MS_TENANT_ID`, `MS_CLIENT_ID`, and `MS_CLIENT_SECRET`. Set `CONTACT_TO` only if contact should go somewhere other than `NOTIFY_TO`. Redeploy after saving them.
6. Change DNS only when you are ready, and not from this repository. The SPF record is still GoDaddy-only, `v=spf1 include:secureserver.net -all`. Mail Graph sends leaves through Exchange Online, so receivers that enforce SPF will reject or spam it until the record authorizes Microsoft. For Microsoft 365 as the only sender, replace that TXT record with exactly:

   ```text
   v=spf1 include:spf.protection.outlook.com -all
   ```

   If some mail must still be sent through GoDaddy during a transition, use one TXT record, not a second SPF record:

   ```text
   v=spf1 include:spf.protection.outlook.com include:secureserver.net -all
   ```

   Keep `-all`. After Microsoft 365 is the only sender, drop `include:secureserver.net`.
7. In the Microsoft 365 Defender portal, turn on DKIM for `arzusaydamauthor.com` and publish the two selector CNAME records Microsoft shows. The notification recipient is a Gmail address, and Gmail treats unsigned custom-domain mail poorly. This repository does not change those records.
8. Do not turn the gift sentence on. It stays gated until a gift file exists and a separate message to the subscriber actually contains that gift. A notification to `NOTIFY_TO` is not the gift.

## Gifts named on the site

| Choice | Promised | In the repository |
| --- | --- | --- |
| `story` | A short story, emailed | Missing. |
| `sample` | A sample chapter of *Bahçemin Sessiz Bilgeliği* | Not a file. The foreword is only the on-page excerpt in `books.html`. |
| `journal` | A printable garden-journal page | Missing. |
| `travel` | A travel essay | Missing. |

The PDFs under `assets/` are media kits, not these gifts.
