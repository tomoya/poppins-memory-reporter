import { IncomingWebhook } from "@slack/client";
import POPPINS_BLUE_COLOR from "../constants/color";

const url = process.env.SLACK_WEBHOOK_URL;
const defaults = {
  username: "Poppins Memory Reporter"
};
if (process.env.SLACK_CHANNEL) defaults.channel = process.env.SLACK_CHANNEL;
export const webhook = new IncomingWebhook(url, defaults);

export default webhook;

export const generateReport = ({ reportDate, lunchTime, snackTime, poo, sleepTime, looking }) => ({
  attachments: [
    {
      fallback: "poppins memory summary post",
      color: POPPINS_BLUE_COLOR,
      title: `${reportDate}のポピンズメモリー`,
      fields: [
        {
          title: "昼食",
          value: lunchTime,
          short: true
        },
        {
          title: "午後・おやつ",
          value: snackTime,
          short: true
        },
        {
          title: "排泄",
          value: poo,
          short: true
        },
        {
          title: "睡眠",
          value: sleepTime,
          short: true
        },
        {
          title: "今日の様子",
          value: looking,
          short: false
        }
      ]
    }
  ]
});
