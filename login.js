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

const isQrPage = async function (page) {
  try {
    await page.waitForSelector(SELECTORS.QRCODE_PAGE, {
      timeout: 0,
    });
    return false;
  } catch (err) {
    // console.log("ERROR: ", err.message, "bye");
    throw new Error("semething went wrong with qr selector");
  }
};

const isChatPage = async function (page) {
  try {
    await page.waitForFunction(SELECTORS.INSIDE_CHAT, {
      timeout: 0,
    });
    return true;
  } catch (err) {
    // console.log("ERROR: ", err.message, "hi");
    throw new Error("something went wrong with inside chat selector");
  }
};

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

    await page.goto("https://web.whatsapp.com");
    return [browser, page];
  } catch (err) {
    console.log("ERROR: ", err.message);
    throw new Error("semething went wrong in opening whatsapp page");
  }
};

const login = async function () {
  try {
    const [browser, page] = await openWhatsAppPage(false);

    const isAuthenticated = await Promise.race([
      isQrPage(page),
      isChatPage(page),
    ]);

    console.log(isAuthenticated);

    await browser.close();

    if (isAuthenticated) {
      console.log("Logged In");
    } else {
      const [browser, page] = await openWhatsAppPage(true);
      await page.waitForFunction(SELECTORS.INSIDE_CHAT, { timeout: 60000 });
      await browser.close();
      console.log("Logged In");
    }
  } catch (err) {
    console.log(err.message);
  }
};

login();
