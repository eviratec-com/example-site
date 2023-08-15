import sendEmail from './'

// ESP Site Name
const SITE_NAME = process.env.SITE_NAME

// ESP Site Domain
const SITE_DOMAIN = process.env.SITE_DOMAIN

// Email Sender
const EMAIL_SENDER = process.env.EMAIL_SENDER || `welcome@info.eviratecsocial.com`

// Email BCC Recpients
const BCC = []
if (process.env.BCC_WELCOME_EMAILS_TO_NAME) {
  BCC.push({
    displayName: process.env.BCC_WELCOME_EMAILS_TO_NAME,
    address: process.env.BCC_WELCOME_EMAILS_TO_ADDR,
  })
}

// Email Subject
const SUBJECT = `Welcome to ${SITE_NAME}!`

// HTML version of the email
const HTML_TEMPLATE = "\
<p>Hi %%DISPLAYNAME%%,</p>\
\
<p>Thanks for signing up for an Eviratec Social Platform site.</p>\
\
<p>\
  We have received your order for site:<br />\
  <code>%%SITE%%</code>\
</p>\
\
<p>At present, it usually takes about 1 - 2 business days to provision a new \
ESP Site.</p>\
\
<p>When your site is ready, you'll receive another email from us with your \
site login details.</p>\
\
<p>\
  Kind Regards,<br />\
  Eviratec Social<br />\
  Site Setup Team\
</p>\
"

// Plain text version of the email
const PLAIN_TEXT_TEMPLATE = "\
Hi %%DISPLAYNAME%%,\n\n\
\
Thanks for signing up for an Eviratec Social Platform site.\n\n\
\
We have received your order for site:\n\
%%SITE%%\n\n\
\
At present, it usually takes about 1 - 2 business days to provision a new ESP \
Site.\n\n\
\
When your site is ready, you'll receive another email from us with your site \
login details.\n\n\
\
Kind Regards,\n\
Eviratec Social\n\
Site Setup Team\
"

interface EmailAddress {
  address: string
  displayName: string
}

// Send Welcome Email (async) function
export default async function sendWelcomeEmail (
  recipient: EmailAddress,
  displayName: string,
  site: string
): Promise<boolean> {
  const html: string = wrap(HTML_TEMPLATE)
  const plainText: string = wrap(PLAIN_TEXT_TEMPLATE)

  return await sendEmail(
    [recipient],
    [...BCC],
    EMAIL_SENDER,
    SUBJECT,
    { html, plainText }
  )

  // Replace template variables
  // input: string template
  // returns string
  function wrap (input: string): string {
    let str: string = input

    const replacements: { key: string, value: string }[] = [
      { key: 'DISPLAYNAME', value: displayName, },
      { key: 'SITE', value: site, },
    ]

    for (let replacement of replacements) {
      str = str.replace(
        new RegExp(`%%${replacement.key}%%`, 'g'),
        replacement.value
      )
    }

    return str
  }
}
