import puppeteer from "puppeteer";
import webhook from "./utils/slack";
import LOGIN_URL from "./constants/url";
import {
  USER_ID_INPUT,
  PASSWORD_INPUT,
  LOGIN_BUTTON,
  PREVIOUS_DAY_BUTTON,
  LUNCH_TIME_TEXTAREA,
  SNACK_TIME_TEXTAREA,
  POO_TEXTAREA,
  SLEEP_START_HOUR_1_INPUT,
  SLEEP_START_MINUTE_1_INPUT,
  SLEEP_END_HOUR_1_INPUT,
  SLEEP_END_MINUTE_1_INPUT,
  SLEEP_START_HOUR_2_INPUT,
  SLEEP_START_MINUTE_2_INPUT,
  SLEEP_END_HOUR_2_INPUT,
  SLEEP_END_MINUTE_2_INPUT,
  LOOKING_TEXTAREA
} from "./constants/selector";
import POPPINS_BLUE_COLOR from "./constants/color";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(LOGIN_URL);
  await page.type(USER_ID_INPUT, process.env.USER_ID);
  await page.type(PASSWORD_INPUT, process.env.PASSWORD);
  await page.click(LOGIN_BUTTON);
  await page.waitForNavigation();
  if (!process.env.REPORT_TODAY) {
    await page.click(PREVIOUS_DAY_BUTTON);
    await page.waitForNavigation();
  }
  const getValue = selector => document.querySelector(selector).value;
  const lunchTime = await page.evaluate(getValue, LUNCH_TIME_TEXTAREA);
  const snackTime = await page.evaluate(getValue, SNACK_TIME_TEXTAREA);
  const poo = await page.evaluate(getValue, POO_TEXTAREA);
  const sleepStartHour1 = await page.evaluate(getValue, SLEEP_START_HOUR_1_INPUT);
  const sleepStartMinute1 = await page.evaluate(getValue, SLEEP_START_MINUTE_1_INPUT);
  const sleepEndHour1 = await page.evaluate(getValue, SLEEP_END_HOUR_1_INPUT);
  const sleepEndMinute1 = await page.evaluate(getValue, SLEEP_END_MINUTE_1_INPUT);
  const sleepStartHour2 = await page.evaluate(getValue, SLEEP_START_HOUR_2_INPUT);
  const sleepStartMinute2 = await page.evaluate(getValue, SLEEP_START_MINUTE_2_INPUT);
  const sleepEndHour2 = await page.evaluate(getValue, SLEEP_END_HOUR_2_INPUT);
  const sleepEndMinute2 = await page.evaluate(getValue, SLEEP_END_MINUTE_2_INPUT);
  const looing = await page.evaluate(getValue, LOOKING_TEXTAREA);
  if (looing === "") {
    await webhook.send("レポートはありません");
  } else {
    const IncomingWebhookSendArguments = {
      attachments: [
        {
          fallback: "poppins memory summary post",
          color: POPPINS_BLUE_COLOR,
          title: "Today's Poppins Memory",
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
              value: `${sleepStartHour1}:${sleepStartMinute1}〜${sleepEndHour1}:${sleepEndMinute1}\n${sleepStartHour2}:${sleepStartMinute2}〜${sleepEndHour2}:${sleepEndMinute2}`,
              short: true
            },
            {
              title: "今日の様子",
              value: looing,
              short: false
            }
          ]
        }
      ]
    };
    await webhook.send(IncomingWebhookSendArguments);
  }
  await browser.close();
})();
