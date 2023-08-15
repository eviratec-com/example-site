const { EmailClient, KnownEmailSendStatus } = require("@azure/communication-email");

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
const emailClient = new EmailClient(connectionString);

module.exports = async function send (
  recipientAddresses,
  bcc,
  senderAddress,
  subject,
  html,
  plainText
) {
  const POLLER_WAIT_TIME = 10

  try {
    const message = {
      senderAddress: senderAddress,
      content: {
        subject: subject,
        html: html,
        plainText: plainText,
      },
      recipients: {
        to: [...recipientAddresses],
      },
    };

    if (bcc.length > 0) {
      message.recipients.bcc = [...bcc]
    }

    const poller = await emailClient.beginSend(message);

    if (!poller.getOperationState().isStarted) {
      throw "Poller was not started."
    }

    let timeElapsed = 0;
    while (!poller.isDone()) {
      poller.poll();
      console.log("Email send polling in progress");

      await new Promise(
        resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000)
      );

      timeElapsed += 10;

      if (timeElapsed > 18 * POLLER_WAIT_TIME) {
        throw "Polling timed out.";
      }
    }

    if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
      console.log(
        `Successfully sent the email (operation id: ${poller.getResult().id})`
      );

      return true;
    }

    throw poller.getResult().error;
  }
  catch (e) {
    console.log(e);
    return false;
  }
}
