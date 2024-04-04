'use strict';

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://naver.com', {
        waitUntil: 'networkidle2',
    });
   
    // page.pdf() is currently supported only in headless mode.
    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
    await page.pdf({
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center;"><b>지웅장</b></div>',
        footerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
        path: 'naver_HeaderFooter.pdf',
        format: 'letter',
        margin: {
            top: "50px",
            bottom: "50px",
            right: "30px",
            left: "30px"
        },
    });
    
    console.log('pdf download...');
    await browser.close();
})();