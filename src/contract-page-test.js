import { sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { setupTokens } from './setupToken.js';
import { executeGraphQLRequests } from "./graphqlRequests.js";
import { browser } from "k6/browser";
import { setupMetrics } from "./setupMetrics.js";
import { verifyPageLoad } from "./frontend/verifyPageLoad.js";
import { login } from "./frontend/commonNavigation.js";

const GRAPHQL_URL = __ENV.GRAPHQL_URL;

// Load request variables and user data
const requestVariables = JSON.parse(open('variables/requestVariables.json'));
const users = JSON.parse(open('variables/user-data.json')).users;

export function setup() {
    return setupTokens(users); // Preload tokens and share with VUs
}

const requests = {
    getContractWithAttachments: {contractId: "placeholder"},
    getContract: {contractId: "placeholder", groupAdmin: 'PRESENTATIONAL'},
    getTransactionTypesWithGroups: {groupAdmin: 'PRESENTATIONAL'},
    getStores: {},
    getContractPartyList: {
        includeOnlySchedules: false,
        contractId: "placeholder",
        limit: 100,
        offset: 0,
        targetType: 'CONTRIBUTOR',
    },
    getContractAdvancesByStatus: {contractId: "placeholder", status: 'IN_REVIEW', limit: 20, offset: 0},
    getContractAdvancesPaid: {contractId: "placeholder", limit: 20, offset: 0},
    getContractAdvancesPending: {contractId: "placeholder", limit: 20, offset: 0},
};

const metrics = await setupMetrics(requests);

export const options = {
    scenarios: {
        backendContractPageVisit: {
            exec: 'backendContractPageVisit',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                {duration: '30s', target: 5},
            ]
        },
        frontendContractPageVisit: {
            exec: 'frontendContractPageVisit',
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

export async function backendContractPageVisit(tokenCache) {
    const user = randomItem(users);
    const token = tokenCache[user.username].accessToken;
    const contractId = randomItem(requestVariables.contractId);

    // Update the request variables with the selected contractId
    Object.entries(requests).forEach(([key, value]) => {
        if ('contractId' in value) {
            value.contractId = contractId;
        }
    });

    await executeGraphQLRequests(requests, token, user, GRAPHQL_URL, metrics)

    sleep(Math.random() * (30 - 1) + 1);
}

export async function frontendContractPageVisit() {
    const user = randomItem(users);
    const contractId = randomItem(requestVariables.contractId);
    const page = await browser.newPage()
    // Navigate to the login page
    await page.goto('https://abacus.qaorch.com', {waitUntil: 'load'});
    await login(page, user);
    // Perform further actions or validations
    await page.waitForSelector('.MainNavFooterUserMenu-name', {state: 'visible'});
    await page.goto(`https://abacus.qaorch.com/contract/${contractId}`, {waitUntil: 'load'});
    const expectedElements = [
        '.ContractDetail-top-header',
        '.ContractDetail-general-details',
        '[data-testid="labelContractTermsDetailPresentational"]',
        '[data-testid="productContractTermsDetailPresentational"]',
        '[data-testid="trackContractTermsDetailPresentational"]',
        '[data-testid="contractMechanicalDeductionsCard"]',
        '.ContractDetail-PhysicalReserve',
    ]
    await verifyPageLoad(page, expectedElements, metrics.frontendFailures);

}
