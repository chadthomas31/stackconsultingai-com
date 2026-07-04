# Analytics Event Map

Stack Consulting AI loads GA4 and GTM from `app/layout.tsx`. Client components
send conversion signals through `trackConversionEvent`, which pushes events to
`window.dataLayer` only. GTM should own GA4 forwarding so conversion events do
not double-count.

## Key-Event Candidates

Mark these as GA4 key events after deploy and DebugView verification:

- `generate_lead` — contact form submitted successfully.
- `ai_assessment_callback_request` — callback request submitted from the free
  AI assessment flow.
- `site_audit_lead` — visitor submitted the site audit form and received a
  completed result.
- `phone_click` — visitor tapped a phone link.
- `book_consultation_click` — visitor clicked a booking-calendar link.

## Supporting Events

Use these for funnel reporting, not primary conversion reporting:

- `high_intent_page_view`
- `contact_cta_click`
- `cta_click`
- `email_click`
- `sms_click`
- `newsletter_signup`
- `site_audit_start`
- `site_audit_complete`
- `automation_finder_complete`
- `ai_audit_request_click`
- `ai_assessment_callback_start`

## Privacy Rules

Do not send visitor-entered names, emails, phone numbers, business names, raw
website URLs, query strings, tokens, or free-text messages to GA4/GTM. Use source,
page, category, score, grade, industry, and other non-identifying fields only.

## Deployment Check

After deploy, use GTM Preview or GA4 DebugView to confirm each key-event
candidate appears once and carries no personal data. Then mark the approved
events as key events in GA4 Admin.
