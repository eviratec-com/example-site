import send from '@/send-email'

interface HtmlEmailContent {
  html: string
  plainText: string
}

interface EmailAddress {
  address: string
  displayName: string
}

export default async function sendEmail (
  recipients: EmailAddress[],
  bcc: EmailAddress[],
  sender: string,
  subject: string,
  content: HtmlEmailContent
): Promise<boolean> {
  try {
    await send(
      recipients,
      bcc,
      sender,
      subject,
      content.html,
      content.plainText
    )

    return true
  }
  catch (err) {
    console.log('functions/email/send')
    console.log(err)
    return false
  }
}
