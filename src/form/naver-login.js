const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser and open a new blank page
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  // 먼저 브라우저에 빈 페이지를 로드합니다.
  await page.goto('about:blank');

  // sessionStorage 설정
  await page.evaluate(() => {
    sessionStorage.setItem('CheckupId', 437);
    sessionStorage.setItem('CheckupTitle', '2024년 상반기 천안공장 웰니스 정기검사');
    sessionStorage.setItem('CheckupEntry', {"isBP":"true","isHealth":"true"});
  });
  // Navigate the page to a URL
  await page.goto('https://lbcorporatekor-slot.azurewebsites.net/CheckupReportV2');
  
  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Type into search box
  await page.type('.devsite-search-field', 'automate beyond recorder');

  // Wait and click on first result
  const searchResultSelector = '.devsite-result-item-link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    'text/Customize and automate'
  );
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})();