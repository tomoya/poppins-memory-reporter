const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://ps.poppins.co.jp/nursery/login/index?redirect=%2Fnursery%2Fmypage%2FpoppinsMemory');
  await page.type('#userId', process.env.USER_ID);
  await page.type('#password', process.env.PASSWORD);
  await page.click('button[type=submit]');
  await page.waitForNavigation();
  await page.click('#previousDay');
  await page.waitForNavigation();
  const milkTime1 = await page.evaluate(() => document.querySelector('#off > tbody > tr:nth-child(5) > td:nth-child(2) > textarea').value);
  const milkTime2 = await page.evaluate(() => document.querySelector('#off > tbody > tr:nth-child(6) > td:nth-child(2) > textarea').value);
  const summary = await page.evaluate(() => document.querySelector('#off > tbody > tr:nth-child(10) > td:nth-child(2) > textarea').value);
  console.log(milkTime1);
  console.log(milkTime2);
  console.log(summary);
  await browser.close();
})();
