import { sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { setupTokens } from './setupToken.js';
import { executeGraphQLRequests } from "./graphqlRequests.js";

const GRAPHQL_URL = __ENV.GRAPHQL_URL;

// Load request variables and user data
const requestVariables = JSON.parse(open('variables/requestVariables.json'));
const users = JSON.parse(open('variables/user-data.json')).users;

export function setup() {
    return setupTokens(users); // Preload tokens and share with VUs
}

export const options = {
    scenarios: {
        backendContractPageVisit: {
            exec: 'backendContractPageVisit',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 20 },
                { duration: '10s', target: 20 }
            ],
        }
    },
};

export function backendContractPageVisit(tokenCache) {
    const user = randomItem(users);
    const token = tokenCache[user.username];
    const pageName = 'contractPage';
    const contractId = randomItem(requestVariables.contractId);

    const requests = [
        { queryFile: 'getContractWithAttachments', variables: { contractId } },
        { queryFile: 'getContract', variables: { contractId, groupAdmin: 'PRESENTATIONAL' } },
        { queryFile: 'getTransactionTypesWithGroups', variables: { groupAdmin: 'PRESENTATIONAL' } },
        { queryFile: 'getStores', variables: {} },
        {
            queryFile: 'getContractPartyList',
            variables: {
                includeOnlySchedules: false,
                contractId,
                limit: 100,
                offset: 0,
                targetType: 'CONTRIBUTOR',
            },
        },
        {
            queryFile: 'getContractAdvancesByStatus',
            variables: { contractId, status: 'IN_REVIEW', limit: 20, offset: 0 },
        },
        {
            queryFile: 'getContractAdvancesPaid',
            variables: { contractId, limit: 20, offset: 0 },
        },
        {
            queryFile: 'getContractAdvancesPending',
            variables: { contractId, limit: 20, offset: 0 },
        },
    ];

    executeGraphQLRequests(requests, token, user, GRAPHQL_URL)

    sleep(1);
}