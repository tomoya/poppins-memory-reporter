import { IncomingWebhook } from "@slack/client";
import POPPINS_BLUE_COLOR from "../constants/color";

const url = process.env.SLACK_WEBHOOK_URL;
const channel = process.env.SLACK_CHANNEL;
const defaults = {
  username: "Poppins Memory Reporter",
};
if (channel) defaults.channel = channel;

export const webhook = url ? new IncomingWebhook(url, defaults) : { send: () => undefined };

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
