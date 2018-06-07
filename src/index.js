import puppeteer from "puppeteer";
import LOGIN_URL from "./constants/url";
import {
  USER_ID_INPUT,
  PASSWORD_INPUT,
  LOGIN_BUTTON,
  PREVIOUS_DAY_BUTTON,
  MKIL_TIME_1_TEXTAREA,
  MKIL_TIME_2_TEXTAREA,
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
  const getTextareaValue = selector => document.querySelector(selector).value;
  const milkTime1 = await page.evaluate(getTextareaValue, MKIL_TIME_1_TEXTAREA);
  const milkTime2 = await page.evaluate(getTextareaValue, MKIL_TIME_2_TEXTAREA);
  const summary = await page.evaluate(getTextareaValue, SUMMARY_TEXTAREA);
  console.log(milkTime1);
  console.log(milkTime2);
  console.log(summary);
  await browser.close();
})();
