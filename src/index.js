/* eslint no-console: 0 */
import puppeteer from "puppeteer";
import { postReport } from "./utils/slack";
import LOGIN_URL from "./constants/url";
import {
  USER_ID_INPUT,
  PASSWORD_INPUT,
  LOGIN_BUTTON,
  PREVIOUS_DAY_BUTTON,
  REPORT_DATE,
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
  LOOKING_TEXTAREA,
} from "./constants/selector";

const { USER_ID, PASSWORD, REPORT_TODAY, DEBUG } = process.env;
const isReportToday = REPORT_TODAY !== undefined;
const report = { message: null, data: null, error: null };

(async () => {
  const browser = await puppeteer.launch(
    DEBUG
      ? {
          headless: false,
          slowMo: 100,
        }
      : {
          // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-fails-due-to-sandbox-issues
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
  );
  // Don't stop process if Don't close browser
  try {
    const page = await browser.newPage();
    await page.goto(LOGIN_URL);
    await page.type(USER_ID_INPUT, USER_ID);
    await page.type(PASSWORD_INPUT, PASSWORD);
    await page.click(LOGIN_BUTTON);
    await page.waitForNavigation();
    if (!isReportToday) {
      await page.click(PREVIOUS_DAY_BUTTON);
      await page.waitForNavigation();
    }
    const getValue = selector => document.querySelector(selector).value;
    const getInnerText = selector => document.querySelector(selector).innerText;
    const reportDate = await page.evaluate(getInnerText, REPORT_DATE);
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
    const looking = await page.evaluate(getValue, LOOKING_TEXTAREA);
    if (looking === "") {
      report.message = `${reportDate}のレポートはありません`;
    } else {
      report.message = "レポートを正常に取得しました";
      report.data = {
        reportDate,
        lunchTime,
        snackTime,
        poo,
        sleepTime: `${sleepStartHour1}:${sleepStartMinute1}〜${sleepEndHour1}:${sleepEndMinute1}\n${sleepStartHour2}:${sleepStartMinute2}〜${sleepEndHour2}:${sleepEndMinute2}`,
        looking,
      };
    }
  } catch (e) {
    report.message = "次のエラーが発生しました";
    report.error = `${e}`;
  }
  await postReport(report);
  console.log(report);
  await browser.close();
})();
