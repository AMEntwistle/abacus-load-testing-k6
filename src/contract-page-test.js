import { fail, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { setupTokens } from './setupToken.js';
import { executeGraphQLRequests } from "./graphqlRequests.js";
import { browser } from "k6/browser";
import { Counter, Trend } from "k6/metrics";

const GRAPHQL_URL = __ENV.GRAPHQL_URL;

// Load request variables and user data
const requestVariables = JSON.parse(open('variables/requestVariables.json'));
const users = JSON.parse(open('variables/user-data.json')).users;

const gqlTrends = {};
const gqlFailures = {};

export function setup() {
    return setupTokens(users); // Preload tokens and share with VUs
}

const queries = [
    'getContractWithAttachments',
    'getContract',
    'getTransactionTypesWithGroups',
    'getStores',
    'getContractPartyList',
    'getContractAdvancesByStatus',
    'getContractAdvancesPaid',
    'getContractAdvancesPending'
]


queries.forEach((query) => {
    gqlTrends[query] = new Trend(`gql_${query}_duration`, true);
    gqlFailures[query] = new Counter(`gql_${query}_failures`);
})

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

export function backendContractPageVisit(tokenCache) {
    const user = randomItem(users);
    const token = tokenCache[user.username].accessToken;
    const pageName = 'contractPage';
    const contractId = randomItem(requestVariables.contractId);

    const requests = {
        getContractWithAttachments: { contractId },
        getContract: { contractId, groupAdmin: 'PRESENTATIONAL' },
        getTransactionTypesWithGroups: { groupAdmin: 'PRESENTATIONAL' },
        getStores: {},
        getContractPartyList: {
            includeOnlySchedules: false,
            contractId,
            limit: 100,
            offset: 0,
            targetType: 'CONTRIBUTOR',
        },
        getContractAdvancesByStatus: { contractId, status: 'IN_REVIEW', limit: 20, offset: 0 },
        getContractAdvancesPaid: { contractId, limit: 20, offset: 0 },
        getContractAdvancesPending: { contractId, limit: 20, offset: 0 },
    };

    executeGraphQLRequests(requests, token, user, GRAPHQL_URL, gqlTrends, gqlFailures)

    sleep(Math.random() * (30 - 1) + 1);
}

export async function frontendContractPageVisit(tokenCache) {
    const user = randomItem(users);
    const pageName = 'contractPage';
    const contractId = randomItem(requestVariables.contractId);
    const page = await browser.newPage()
    // Navigate to the login page
    await page.goto('https://abacus.qaorch.com', {waitUntil: 'load'});
    // Type the username and password, then log in
    await page.type('#username', user.username); // Replace with the username
    await page.type('#password', user.password); // Replace with the password
    await page.click('button[type="submit"]'); // Click the login button
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
    try {
        for (const selector of expectedElements) {
            await page.waitForSelector(selector, { state: 'visible', timeout: 20000 });
        }
    } catch (error) {
        fail(`Browser failed to load page: ${error}`);
    }
    const isSnagPresent = await page.evaluate(() => {
        return document.body.innerText.includes('snag');
    });
    if (isSnagPresent) {
        fail('The word "snag" should not be present on the page but was found.');
    }
    console.log('page loaded successfully')
}
