'use strict';

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://www.naver.com', {
        waitUntil: 'networkidle2',
    });
    
    // 페이지 내에서 스케일 값을 동적으로 계산하고 적용하는 스크립트
    await page.evaluate(() => {
        // 동적으로 div 요소를 생성
        var div = document.createElement('div');
        div.style.width = '1in'; // CSS에서 1인치를 설정
        div.style.height = '1in';
        div.style.position = 'absolute';
        div.style.left = '-100%'; // 화면에 표시되지 않도록 설정
        document.body.appendChild(div); // 생성한 div를 문서에 추가
        var dpi = div.offsetWidth;

        
        let width;
        if (dpi === 96) {
            width = 1056; // Letter 사이즈의 너비 in pixels when using 96 DPI
        } else if (dpi === 100) {
            width = 1100; // Letter 사이즈의 너비 in pixels when using 100 DPI
        } else if (dpi === 120) {
            width = 1320; // Letter 사이즈의 너비 in pixels when using 120 DPI
        } else if (dpi === 300) {
            width = 3300; // Letter 사이즈의 너비 in pixels when using 300 DPI
        } else if (dpi === 600) {
            width = 6600; // Letter 사이즈의 너비 in pixels when using 600 DPI
        } else {
            width = 1056; // 기본값
        }

        // div의 offsetWidth, offsetHeight를 통해 DPI 계산
        

        document.body.removeChild(div); // 사용한 div 제거

        const LETTER_WIDTH_PX = width; // Letter 페이지의 너비 (인치를 픽셀로 변환, DPI 가정)
        //const pageWidth = document.documentElement.offsetWidth; // 페이지의 현재 너비
        const elements = [...document.body.getElementsByTagName('*')]; // 페이지 내 모든 요소를 가져옴
        const maxWidth = elements.reduce((max, el) => {
            // el.offsetWidth가 undefined인 경우를 대비하여 0으로 처리
            const width = el.offsetWidth || 0;
            return Math.max(max, width);
        }, 0); // 가장 넓은 요소의 너비 계산
        const scale = LETTER_WIDTH_PX / maxWidth; // 스케일 값 계산

        // 계산된 스케일 값을 페이지에 적용
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = '0 0'; // 변환 기준점을 페이지의 왼쪽 상단으로 설정
        //document.body.style.width = `${100 / scale}%`; // 스케일링 후 너비 조정
    });
    // page.pdf() is currently supported only in headless mode.
    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
    await page.pdf({
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center;"><b>지웅장</b></div>',
        footerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
        path: 'naver_pagesize.pdf',
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