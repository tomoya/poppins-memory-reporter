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
  POO_TIME_TEXTAREA,
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

export default async () => {
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
    await Promise.all([page.click(LOGIN_BUTTON), page.waitForNavigation()]);
    if (!isReportToday) {
      await Promise.all([page.click(PREVIOUS_DAY_BUTTON), page.waitForNavigation()]);
    }
    const getValue = selector => document.querySelector(selector).value;
    const getInnerText = selector => document.querySelector(selector).innerText;
    const [
      reportDate,
      lunchTime,
      snackTime,
      pooTime,
      sleepStartHour1,
      sleepStartMinute1,
      sleepEndHour1,
      sleepEndMinute1,
      sleepStartHour2,
      sleepStartMinute2,
      sleepEndHour2,
      sleepEndMinute2,
      looking,
    ] = await Promise.all([
      page.evaluate(getInnerText, REPORT_DATE),
      page.evaluate(getValue, LUNCH_TIME_TEXTAREA),
      page.evaluate(getValue, SNACK_TIME_TEXTAREA),
      page.evaluate(getValue, POO_TIME_TEXTAREA),
      page.evaluate(getValue, SLEEP_START_HOUR_1_INPUT),
      page.evaluate(getValue, SLEEP_START_MINUTE_1_INPUT),
      page.evaluate(getValue, SLEEP_END_HOUR_1_INPUT),
      page.evaluate(getValue, SLEEP_END_MINUTE_1_INPUT),
      page.evaluate(getValue, SLEEP_START_HOUR_2_INPUT),
      page.evaluate(getValue, SLEEP_START_MINUTE_2_INPUT),
      page.evaluate(getValue, SLEEP_END_HOUR_2_INPUT),
      page.evaluate(getValue, SLEEP_END_MINUTE_2_INPUT),
      page.evaluate(getValue, LOOKING_TEXTAREA),
    ]);
    if (looking === "") {
      report.message = `${reportDate}のレポートはありません`;
    } else {
      report.message = "レポートを正常に取得しました";
      report.data = {
        reportDate,
        lunchTime,
        snackTime,
        pooTime,
        sleepTime: `${sleepStartHour1}:${sleepStartMinute1}〜${sleepEndHour1}:${sleepEndMinute1}\n${sleepStartHour2}:${sleepStartMinute2}〜${sleepEndHour2}:${sleepEndMinute2}`,
        looking,
      };
    }
  } catch (e) {
    report.message = "次のエラーが発生しました";
    report.error = `${e}`;
  }
  await postReport(report);
  await browser.close();
  return report;
};
