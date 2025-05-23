// noinspection NpmUsedModulesInstalled
import { sleep } from 'k6'
// noinspection JSFileReferences
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js'
// noinspection NpmUsedModulesInstalled
import { browser } from 'k6/browser'
import { setupTokens } from '../../setup/setupToken.js'
import { executeGraphQLRequests } from '../../helpers/graphqlRequests.js'
import { setupMetrics } from '../../setup/setupMetrics.js'
import { LoginPage } from '../../frontend/pageObjects/loginPage.js'
import { ContractsPage } from '../../frontend/pageObjects/abacus/contractsPage.js'
import { ContractPage } from '../../frontend/pageObjects/abacus/contractPage.js'
import { createBackendScenario, createFrontendScenario } from '../../setup/scenarioDetails.js'

const GRAPHQL_URL = __ENV.GRAPHQL_URL
const application = 'abacus'

// Load request variables and user data
const requestVariables = JSON.parse(open('../../variables/requestVariables.json'))
const users = JSON.parse(open('../../variables/user-data.json')).users

export function setup() {
  return setupTokens(users) // Preload tokens and share with VUs
}

const contractsPageRequests = {
  getContractsList: {
    limit: 20,
    offset: 0,
    searchTerm: '',
    accountIds: null,
  },
  getAccountsList: {
    skipContracts: true,
    limit: 300,
    offset: 0,
    searchTerm: '',
  },
}

const searchRequest = {
  getContractsList: {
    limit: 20,
    offset: 0,
    searchTerm: 'placeholder',
    accountIds: null,
  },
}

const contractPageRequests = {
  getContractWithAttachments: { contractId: 'placeholder' },
  getContract: { contractId: 'placeholder', groupAdmin: 'PRESENTATIONAL' },
  getTransactionTypesWithGroups: { groupAdmin: 'PRESENTATIONAL' },
  getStores: {},
  getContractPartyList: {
    includeOnlySchedules: false,
    contractId: 'placeholder',
    limit: 100,
    offset: 0,
    targetType: 'CONTRIBUTOR',
  },
  getContractAdvancesByStatus: { contractId: 'placeholder', status: 'IN_REVIEW', limit: 20, offset: 0 },
  getContractAdvancesPaid: { contractId: 'placeholder', limit: 20, offset: 0 },
  getContractAdvancesPending: { contractId: 'placeholder', limit: 20, offset: 0 },
}

const metrics = await setupMetrics({
  ...contractPageRequests,
  ...searchRequest,
  ...contractsPageRequests,
})

export const options = {
  scenarios: {
    backendContractSearchAndVisit: createBackendScenario('backendContractSearchAndVisit'),
    frontendContractSearchAndVisit: createFrontendScenario('frontendContractSearchAndVisit'),
  },
}

export async function backendContractSearchAndVisit(tokenCache) {
  const user = randomItem(users)
  const token = tokenCache[user.username].accessToken
  const contractId = randomItem(requestVariables.contractId)

  // Land on contracts page
  await executeGraphQLRequests(contractsPageRequests, application, token, user, GRAPHQL_URL, metrics)
  // Perform search
  searchRequest.getContractsList.searchTerm = `${contractId}`
  await executeGraphQLRequests(searchRequest, application, token, user, GRAPHQL_URL, metrics)
  // Perform contract page visit
  // Update the request variables with the selected contractId
  Object.values(contractPageRequests).forEach((value) => {
    if ('contractId' in value) {
      value.contractId = contractId
    }
  })

  await executeGraphQLRequests(contractPageRequests, application, token, user, GRAPHQL_URL, metrics)

  sleep(Math.random() * (30 - 1) + 1)
}

export async function frontendContractSearchAndVisit() {
  const user = randomItem(users)
  const contractId = randomItem(requestVariables.contractId)
  const page = await browser.newPage()
  // Navigate to the login page
  await page.goto('https://abacus.qaorch.com', { waitUntil: 'load' })
  const loginPage = new LoginPage(page, metrics)
  await loginPage.login(user.username, user.password)
  const contractsPage = new ContractsPage(page, metrics)
  await contractsPage.goTo()
  await contractsPage.waitForPageLoad()
  await contractsPage.search(contractId)
  await contractsPage.selectContract(contractId)
  const contractPage = new ContractPage(page, metrics)
  await contractPage.waitForPageLoad()
  await contractPage.goToAdvancesTab()
}
