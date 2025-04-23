import { fail } from "k6";

export async function verifyPageLoad(page, expectedElements, frontendFailures) {
    try {
        for (const selector of expectedElements) {
            await page.waitForSelector(selector, { state: 'visible', timeout: 20000 });
        }
    } catch (error) {
        await page.screenshot({ path: `failed-page-${Date.now()}.png` });
        frontendFailures.add(1);
        fail(`Browser failed to load page: ${error}`);
    }
    const isSnagPresent = await page.evaluate(() => {
        return document.body.innerText.includes('snag');
    });
    if (isSnagPresent) {
        await page.screenshot({ path: `screenshots/failed-page-${Date.now()}.png` });
        frontendFailures.add(1);
        fail('The word "snag" should not be present on the page but was found.');
    }
}