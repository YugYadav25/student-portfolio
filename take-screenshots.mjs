import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to projects page...");
  
  // Enable request interception just to fail the API later
  await page.setRequestInterception(true);
  let failApi = false;
  page.on('request', request => {
    if (failApi && request.url().includes('api.github.com')) {
      request.abort('failed');
    } else {
      request.continue();
    }
  });

  // 1. Loading State
  // We don't await goto fully initially, we just let it start and immediately look for spinner
  console.log("Capturing Loading State...");
  page.goto('http://localhost:5173/projects', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.spinner', { timeout: 5000 }).catch(() => {});
  await page.screenshot({ path: '1_Loading_State.png' });
  console.log("Saved 1_Loading_State.png");

  // 2. Success State
  console.log("Capturing Success State...");
  await page.waitForFunction(() => !document.querySelector('.spinner'), { timeout: 15000 }).catch(() => {});
  await page.waitForSelector('.project-card', { timeout: 15000 }).catch(() => {});
  // Give it a small delay to render images/CSS
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '2_Success_State.png' });
  console.log("Saved 2_Success_State.png");

  // 3. Search functionality
  console.log("Capturing Search State...");
  await page.type('.search-input', 'portfolio'); 
  await new Promise(r => setTimeout(r, 1000)); // wait for react update
  await page.screenshot({ path: '3_Search_State.png' });
  console.log("Saved 3_Search_State.png");
  
  // Clear search
  await page.evaluate(() => document.querySelector('.search-input').value = '');
  await page.type('.search-input', ' '); // trigger change event
  await page.keyboard.press('Backspace');
  await new Promise(r => setTimeout(r, 500));

  // 4. Error State
  console.log("Capturing Error State...");
  failApi = true;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.error-container', { timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: '4_Error_State.png' });
  console.log("Saved 4_Error_State.png");
  
  await browser.close();
  console.log("Done!");
})();
