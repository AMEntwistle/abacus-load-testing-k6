import { verifyPageLoad } from "../../verifyPageLoad.js";

export class BasePage {
    constructor(page) {
        this.page = page;
        this.url = null;
    }
    async waitForElements(expectedElements) {
        if (Array.isArray(expectedElements))
            await verifyPageLoad(this.page, expectedElements);
        else
            await verifyPageLoad(this.page, [expectedElements]);
    }
    async goTo() {
        await this.page.goto(this.url, { waitUntil: 'load' });
    }

    async waitForLoader() {
        await this.page.waitForFunction(
            () => !document.querySelector('.SkeletonLoader'),
            { timeout: 20000 } // Waits up to 20 seconds
        );
    }
    async waitForLoaderToExist() {
        await this.page.waitForSelector('.SkeletonLoader', { state: 'visible' });
    }
}