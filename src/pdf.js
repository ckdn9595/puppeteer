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
        path: 'naver.pdf',
        format: 'letter',
    });
    
    console.log('pdf download...');
    await browser.close();
})();