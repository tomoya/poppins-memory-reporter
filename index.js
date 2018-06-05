const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://ps.poppins.co.jp/nursery/login/index');
  await page.type('#userId', process.env.USER_ID);
  await page.type('#password', process.env.PASSWORD);
  await page.click('button[type=submit]');
  await page.waitForNavigation();
  await page.goto('https://ps.poppins.co.jp/nursery/mypage/poppinsMemory');
  await page.click('#previousDay');
  await page.waitForNavigation();
  const text = await page.evaluate(() => document.querySelector('#off > tbody > tr:nth-child(10) > td:nth-child(2) > textarea').value);
  console.log(text);
  await browser.close();
})();
