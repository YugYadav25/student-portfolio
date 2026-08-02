import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to Tasks page...");
  
  // 1. Initial State (Empty or Loaded)
  console.log("Capturing Initial State...");
  await page.goto('http://localhost:5173/tasks', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.tasks-page');
  await page.screenshot({ path: '1_Tasks_Initial.png' });
  console.log("Saved 1_Tasks_Initial.png");

  // 2. Add a new task
  console.log("Adding a new task...");
  await page.type('input[placeholder="What needs to be done?"]', 'Complete Node.js Assignment'); 
  await page.type('input[placeholder="Details (Optional)"]', 'Build REST API with Express and Middlewares'); 
  await page.click('.add-btn');
  
  // wait for the task to appear
  await page.waitForSelector('.task-item');
  await new Promise(r => setTimeout(r, 500)); // wait for animation
  
  console.log("Capturing Task Added State...");
  await page.screenshot({ path: '2_Tasks_Added.png' });
  console.log("Saved 2_Tasks_Added.png");

  // 3. Mark task as completed
  console.log("Completing the task...");
  await page.click('.task-checkbox');
  await new Promise(r => setTimeout(r, 500)); // wait for styling change
  
  console.log("Capturing Task Completed State...");
  await page.screenshot({ path: '3_Tasks_Completed.png' });
  console.log("Saved 3_Tasks_Completed.png");
  
  // 4. Delete the task
  console.log("Deleting the task...");
  await page.click('.delete-btn');
  await new Promise(r => setTimeout(r, 500)); // wait for removal
  
  console.log("Capturing Task Deleted State...");
  await page.screenshot({ path: '4_Tasks_Deleted.png' });
  console.log("Saved 4_Tasks_Deleted.png");

  await browser.close();
  console.log("Done!");
})();
