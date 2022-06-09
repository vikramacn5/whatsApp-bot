const puppeteer = require("puppeteer");

const delay = (sec) =>
  new Promise((resolve, _) => setTimeout(() => resolve(), sec * 1000));

const SELECTORS = {
  LOADING: "progress",
  INSIDE_CHAT: "document.getElementsByClassName('two')[0]",
  QRCODE_PAGE: "body > div > div > .landing-wrapper",
  QRCODE_DATA: "div[data-ref]",
  QRCODE_DATA_ATTR: "data-ref",
  SEND_BUTTON: 'div:nth-child(2) > button > span[data-icon="send"]',
};

const userDataDir = "C:\\Users\\Venkat\\AppData\\Local\\Chromium\\User Data";

const openWhatsAppPage = async function (showBrowser = true) {
  try {
    const browser = await puppeteer.launch({
      headless: !showBrowser,
      userDataDir,
    });
    const page = await browser.newPage();

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"
    );

    //   await page.goto("https://web.whatsapp.com");
    return [browser, page];
  } catch (err) {
    console.log("ERROR: ", err.message);
    throw new Error("semething went wrong in opening whatsapp page");
  }
};

const sendMessage = async function (phones, message) {
  try {
    const [browser, page] = await openWhatsAppPage(false);

    console.log("SENDING...");

    for (const phone of phones) {
      await page.goto(
        `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
          message
        )}`
      );

      await page.waitForSelector(SELECTORS.LOADING, {
        hidden: true,
        timeout: 60000,
      });
      await page.waitForSelector(SELECTORS.SEND_BUTTON, { timeout: 5000 });
      await delay(1);
      await page.click(SELECTORS.SEND_BUTTON);
      await delay(2);
      console.log(`${phone} sent`);
    }

    await browser.close();
  } catch (err) {
    console.log("ERROR: ", err.message);
  }
};

sendMessage(["+918056202389", "+919677289976", "+919080916966"], "hello");
