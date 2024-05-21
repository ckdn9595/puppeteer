'use strict';

const puppeteer = require('puppeteer');
const HeaderTemplate = `
<div style="width: 100%; height: 65px; background-color: #4b4f5a; font-size: 18px; text-align: center; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 0px 0px 12px 12px;">
  <b>2024년 상반기 본사 웰니스 정기검사 결과리포트</b>
</div>`;
const FooterTemplate = `
<div style="width: 100%; height: 30px; background-color: #4b4f5a; display: flex; align-items: center; justify-content: center;">
  <span style="color: #fff;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;
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
    const scale = await page.evaluate(() => {
        const LETTER_WIDTH_INCHES = 8.5;
        const LETTER_HEIGHT_INCHES = 11;

        // 동적으로 div 요소를 생성
        var div = document.createElement('div');
        div.style.width = '1in'; // CSS에서 1인치를 설정
        div.style.height = '1in';
        div.style.position = 'absolute';
        document.body.appendChild(div); // 생성한 div를 문서에 추가
        var dpi = div.offsetWidth;
        document.body.removeChild(div);
        
        const letterWidthPx = LETTER_WIDTH_INCHES * dpi;
        const letterHeightPx = LETTER_HEIGHT_INCHES * dpi;

        const bodyOffsetWidth = document.body.offsetWidth;
        const scale = letterWidthPx / bodyOffsetWidth; // maxWidth * 0.7; // 스케일 값 계산
        //const scale = 0.5;
        // 계산된 스케일 값을 페이지에 적용
        // document.body.style.transform = `scale(${scale})`;
        // document.body.style.transformOrigin = '0 0'; // 변환 기준점을 페이지의 왼쪽 상단으로 설정

        //컴포넌트 페이지 안짤리고 한 페이지에 인쇄되도록 높이를 확인해 css 조절
        const components = document.querySelectorAll('.component');

        let accumulatedHeight = 0;

        components.forEach((component, index) => {
            const componentHeight = component.offsetHeight * scale;
            // 현재 컴포넌트를 추가했을 때 페이지 높이를 초과하는지 검사
            if (accumulatedHeight + componentHeight > letterHeightPx) {
                components[index].style.breakBefore = "page";
                accumulatedHeight = componentHeight; // 누적 높이 초기화
            } else {
                accumulatedHeight += componentHeight;
            }
        });

        // document.body.style.width = `${100 / scale}%`; // 스케일링 후 너비 조정으로 원래의 페이지 비율을 유지
        return scale;
    });
    // page.pdf() is currently supported only in headless mode.
    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
    await page.pdf({
        displayHeaderFooter: true,
        headerTemplate: HeaderTemplate,
        footerTemplate: FooterTemplate,
        path: 'naver_pagesize1.pdf',
        format: 'letter',
        printBackground: true,
        margin: {
            top: "30px",
            bottom: "30px",
             right: "0px",
             left: "0px"
        },
        scale: scale
    });
    
    await browser.close();
})();