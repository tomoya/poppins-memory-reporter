import puppeteer from "puppeteer";
import LOGIN_URL from "./constants/url";
import {
  USER_ID,
  PASSWORD,
  LOGIN_BUTTON,
  PREVIOUS_DAY_BUTTON,
  MKIL_TIME_1,
  MKIL_TIME_2,
  SUMMARY
} from "./constants/selector";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(LOGIN_URL);
  await page.type(USER_ID, process.env.USER_ID);
  await page.type(PASSWORD, process.env.PASSWORD);
  await page.click(LOGIN_BUTTON);
  await page.waitForNavigation();
  await page.click(PREVIOUS_DAY_BUTTON);
  await page.waitForNavigation();
  const getTextareaValue = selector => document.querySelector(selector).value;
  const milkTime1 = await page.evaluate(getTextareaValue, MKIL_TIME_1);
  const milkTime2 = await page.evaluate(getTextareaValue, MKIL_TIME_2);
  const summary = await page.evaluate(getTextareaValue, SUMMARY);
  console.log(milkTime1);
  console.log(milkTime2);
  console.log(summary);
  await browser.close();
})();
