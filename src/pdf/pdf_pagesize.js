'use strict';

const puppeteer = require('puppeteer');
const bodyWidth = 1500;
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [`--window-size=${bodyWidth},1100`],
    });
    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:5500/src/screen/longPage.html', {
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
        document.body.removeChild(div);
        
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
        
       

        const LETTER_WIDTH_PX = width; // Letter 페이지의 너비 (인치를 픽셀로 변환, DPI 가정) + margin 양쪽 계산
        //const pageWidth = document.documentElement.offsetWidth; // 페이지의 현재 너비
        // const elements = [...document.body.getElementsByTagName('*')]; // 페이지 내 모든 요소를 가져옴
        // const maxWidth = elements.reduce((max, el) => {
        //     const width = el.offsetWidth || 0;
        //     return Math.max(max, width);
        // }, 0); // 가장 넓은 요소의 너비 계산
        const bodyOffsetWidth = document.body.offsetWidth;
        const scale = LETTER_WIDTH_PX / bodyOffsetWidth * 0.9; // maxWidth * 0.7; // 스케일 값 계산
        //const scale = 0.5;
        // 계산된 스케일 값을 페이지에 적용
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = '0 0'; // 변환 기준점을 페이지의 왼쪽 상단으로 설정

        //컴포넌트 페이지 안짤리고 한 페이지에 인쇄되도록 높이를 확인해 css 조절
        const pageHeight = 11 * dpi / scale;  //letter의 세로 크기는 11인치
        const components = document.querySelectorAll('.component');

        let accumulatedHeight = 0;

        components.forEach((component, index) => {
            const componentHeight = component.offsetHeight;

            // 현재 컴포넌트를 추가했을 때 페이지 높이를 초과하는지 검사
            if (accumulatedHeight + componentHeight > pageHeight) {
                // 페이지 높이를 초과하면 이전 컴포넌트에 페이지 브레이크를 적용
                if(index >= 1){
                    components[index - 1].style.pageBreakAfter = "always";
                    components[index - 1].style.breakAfter = "page";
                }
                accumulatedHeight = componentHeight; // 누적 높이 초기화
            } else {
                accumulatedHeight += componentHeight;
            }
        });

        document.body.style.width = `${100 / scale}%`; // 스케일링 후 너비 조정으로 원래의 페이지 비율을 유지
    });
    // page.pdf() is currently supported only in headless mode.
    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
    await page.pdf({
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center;"><b>지웅장</b></div>',
        footerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>',
        path: 'naver_pagesize1.pdf',
        format: 'letter',
        printBackground: true,
        margin: {
            top: "30px",
            bottom: "30px",
             right: "0px",
             left: "0px"
        },
        height: "1600px"
    });
    
    console.log('pdf download...');
    await browser.close();
})();