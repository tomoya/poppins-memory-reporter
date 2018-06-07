import puppeteer from "puppeteer";
import webhook from "./utils/slack";
import LOGIN_URL from "./constants/url";
import {
  USER_ID_INPUT,
  PASSWORD_INPUT,
  LOGIN_BUTTON,
  PREVIOUS_DAY_BUTTON,
  MKIL_TIME_1_TEXTAREA,
  MKIL_TIME_2_TEXTAREA,
  POO_TEXTAREA,
  SLEEP_START_HOUR_1_INPUT,
  SLEEP_START_MINUTE_1_INPUT,
  SLEEP_END_HOUR_1_INPUT,
  SLEEP_END_MINUTE_1_INPUT,
  SLEEP_START_HOUR_2_INPUT,
  SLEEP_START_MINUTE_2_INPUT,
  SLEEP_END_HOUR_2_INPUT,
  SLEEP_END_MINUTE_2_INPUT,
  SUMMARY_TEXTAREA
} from "./constants/selector";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(LOGIN_URL);
  await page.type(USER_ID_INPUT, process.env.USER_ID);
  await page.type(PASSWORD_INPUT, process.env.PASSWORD);
  await page.click(LOGIN_BUTTON);
  await page.waitForNavigation();
  await page.click(PREVIOUS_DAY_BUTTON);
  await page.waitForNavigation();
  const getValue = selector => document.querySelector(selector).value;
  const milkTime1 = await page.evaluate(getValue, MKIL_TIME_1_TEXTAREA);
  const milkTime2 = await page.evaluate(getValue, MKIL_TIME_2_TEXTAREA);
  const poo = await page.evaluate(getValue, POO_TEXTAREA);
  const sleepStartHour1 = await page.evaluate(getValue, SLEEP_START_HOUR_1_INPUT);
  const sleepStartMinute1 = await page.evaluate(getValue, SLEEP_START_MINUTE_1_INPUT);
  const sleepEndHour1 = await page.evaluate(getValue, SLEEP_END_HOUR_1_INPUT);
  const sleepEndMinute1 = await page.evaluate(getValue, SLEEP_END_MINUTE_1_INPUT);
  const sleepStartHour2 = await page.evaluate(getValue, SLEEP_START_HOUR_2_INPUT);
  const sleepStartMinute2 = await page.evaluate(getValue, SLEEP_START_MINUTE_2_INPUT);
  const sleepEndHour2 = await page.evaluate(getValue, SLEEP_END_HOUR_2_INPUT);
  const sleepEndMinute2 = await page.evaluate(getValue, SLEEP_END_MINUTE_2_INPUT);
  const summary = await page.evaluate(getValue, SUMMARY_TEXTAREA);
  const IncomingWebhookSendArguments = {
    attachments: [
      {
        fallback: "poppins memory summary post",
        color: "#36a64f",
        title: "Today's Poppins Memory",
        fields: [
          {
            title: "昼食",
            value: milkTime1,
            short: true
          },
          {
            title: "午後・おやつ",
            value: milkTime2,
            short: true
          },
          {
            title: "排泄",
            value: poo,
            short: true
          },
          {
            title: "睡眠",
            value: `${sleepStartHour1}:${sleepStartMinute1}〜${sleepEndHour1}:${sleepEndMinute1}\n${sleepStartHour2}:${sleepStartMinute2}〜${sleepEndHour2}:${sleepEndMinute2}`,
            short: true
          },
          {
            title: "今日の様子",
            value: summary,
            short: false
          }
        ]
      }
    ]
  };
  await webhook.send(IncomingWebhookSendArguments);
  await browser.close();
})();
