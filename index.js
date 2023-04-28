// import modules
const puppeteer = require('puppeteer-core');
const dotenv = require('dotenv');

// configure dotenv
dotenv.config();

// web scraping function
async function run() {
    // declare browser variable
    let browser;

    // logic to scrap the web
    try {
        // connect to browser
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${process.env.BRIGHT_DATA_USERNAME}:${process.env.BRIGHT_DATA_PASSWORD}@${process.env.BRIGHT_DATA_HOST}`
        });

        // get page
        const page = await browser.newPage();

        // set timeout
        await page.setDefaultNavigationTimeout(2 * 60 * 1000);

        // website to scrap
        await page.goto('https://www.amazon.com/Best-Sellers/zgbs');

        // get carousel items
        const selector = '.a-carousel';

        // wait for selector
        await page.waitForSelector(selector);

        // get carousel items
        const items = await page.$$(selector);

        // get all items as an array
        const text = await Promise.all(items.map(async (item) => {
            return await item.evaluate((element) => element.innerText, item);
        }));

        // log text
        console.log(text);

    } catch (error) {
        console.error(error);
    } finally {
        // close browser
        await browser?.close();
    }
}

// run web scraping function
run();
