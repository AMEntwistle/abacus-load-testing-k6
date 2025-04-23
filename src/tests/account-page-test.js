import { sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { setupTokens } from '../setup/setupToken.js';
import { executeGraphQLRequests } from "../helpers/graphqlRequests.js";
import { browser } from "k6/browser";
import { setupMetrics } from "../setup/setupMetrics.js";
import { verifyPageLoad } from "../frontend/verifyPageLoad.js";
import { getDataTestId, login } from "../frontend/commonNavigation.js";

const GRAPHQL_URL = __ENV.GRAPHQL_URL;

// Load request variables and user data
const requestVariables = JSON.parse(open('../variables/requestVariables.json'));
const users = JSON.parse(open('../variables/user-data.json')).users;

export function setup() {
    return setupTokens(users); // Preload tokens and share with VUs
}

const requests = {
    getAccountFullDetail: {accountId: "placeholder"},
    getAccountById: {accountId: "placeholder"},
    getAccountLedgerList: {accountId: "placeholder", limit: 20, offset: 0},
    canPerform: {
        identityId: "placeholder", resourceTypeActions: [{
            action: "view",
            resourceType: "tax_info"
        }]
    },
    getNotifications: {
        identityId: "placeholder"
    }
};

const metrics = await setupMetrics(requests);

export const options = {
    scenarios: {
        backendAccountPageVisit: {
            exec: 'backendAccountPageVisit',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                {duration: '30s', target: 5},
            ]
        },
        frontendAccountPageVisit: {
            exec: 'frontendAccountPageVisit',
            executor: 'constant-vus',
            vus: 1,
            startTime: '0s',
            duration: '30s',
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        }
    },
};

export async function backendAccountPageVisit(tokenCache) {
    const user = randomItem(users);
    const token = tokenCache[user.username].accessToken;
    const accountId = randomItem(requestVariables.accountId);
    // Update the request variables with the selected AccountId
    Object.entries(requests).forEach(([key, value]) => {
        if ('accountId' in value) {
            value.accountId = accountId;
        }
        if ('identityId' in value) {
            value.identityId = user.identityId;
        }
    });

    await executeGraphQLRequests(requests, token, user, GRAPHQL_URL, metrics)

    sleep(Math.random() * (30 - 1) + 1);
}

export async function frontendAccountPageVisit() {
    const user = randomItem(users);
    const accountId = randomItem(requestVariables.accountId);
    const page = await browser.newPage()
    // Navigate to the login page
    await page.goto('https://abacus.qaorch.com', {waitUntil: 'load'});
    await login(page, user);
    // Perform further actions or validations
    await page.waitForSelector('.MainNavFooterUserMenu-name', {state: 'visible'});
    await page.goto(`https://abacus.qaorch.com/account/${accountId}`, {waitUntil: 'load'});
    const expectedElements = [
        '.AccountDetail-top-header',
        '#accountDetail-tabs-tab-account-general-info',
    ]
    await verifyPageLoad(page, expectedElements, metrics.frontendFailures);
    await page.click('#accountDetail-tabs-tab-payment-info')
    await verifyPageLoad(page, [getDataTestId('paymentGeneralDetails')], metrics.frontendFailures);
    await page.click('#accountDetail-tabs-tab-accounting')
    await verifyPageLoad(page, [getDataTestId('tabAccounting')], metrics.frontendFailures)
    await page.click('#accountDetail-tabs-tab-contracts')
    await verifyPageLoad(page, [getDataTestId('paymentDetailContracts')], metrics.frontendFailures);
}
