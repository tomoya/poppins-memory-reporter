import { IncomingWebhook } from "@slack/client";

const url = process.env.SLACK_WEBHOOK_URL;
const defaults = {
  channel: process.env.SLACK_CHANNEL,
  username: "Poppins Memory Bot"
};
const webhook = new IncomingWebhook(url, defaults);

export default webhook;
