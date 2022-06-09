const puppeteer = require("puppeteer");

const delay = (sec) =>
  new Promise((resolve, _) => setTimeout(() => resolve(), sec * 1000));

const testChrome = async function () {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"
  );
  await page.goto("https://web.whatsapp.com");
  await delay(10);
  await page.screenshot({ path: "example.png" });
  await browser.close();
};

testChrome();
