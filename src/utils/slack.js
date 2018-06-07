import { IncomingWebhook } from "@slack/client";

const url = process.env.SLACK_WEBHOOK_URL;
const defaults = {
  username: "Poppins Memory Reporter"
};
if (process.env.SLACK_CHANNEL) defaults.channel = process.env.SLACK_CHANNEL;
const webhook = new IncomingWebhook(url, defaults);

export default webhook;
