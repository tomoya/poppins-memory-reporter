import { IncomingWebhook } from "@slack/client";
import POPPINS_BLUE_COLOR from "../constants/color";

const { SLACK_WEBHOOK_URL, SLACK_CHANNEL } = process.env;
const defaults = {
  username: "Poppins Memory Reporter",
};
if (SLACK_CHANNEL) defaults.channel = SLACK_CHANNEL;

export const webhook = SLACK_WEBHOOK_URL ? new IncomingWebhook(SLACK_WEBHOOK_URL, defaults) : { send: () => undefined };

export default webhook;

export const generateAttachments = ({ reportDate, lunchTime, snackTime, poo, sleepTime, looking }) => ({
  attachments: [
    {
      fallback: "poppins memory summary post",
      color: POPPINS_BLUE_COLOR,
      title: `${reportDate}のポピンズメモリー`,
      fields: [
        {
          title: "昼食",
          value: lunchTime,
          short: true,
        },
        {
          title: "午後・おやつ",
          value: snackTime,
          short: true,
        },
        {
          title: "排泄",
          value: poo,
          short: true,
        },
        {
          title: "睡眠",
          value: sleepTime,
          short: true,
        },
        {
          title: "今日の様子",
          value: looking,
          short: false,
        },
      ],
    },
  ],
});
