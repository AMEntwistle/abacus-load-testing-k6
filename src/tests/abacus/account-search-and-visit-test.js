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
import { AccountsPage } from '../../frontend/pageObjects/abacus/accountsPage.js'
import { AccountPage } from '../../frontend/pageObjects/abacus/accountPage.js'
import { createBackendScenario, createFrontendScenario } from '../../setup/scenarioDetails.js'

const GRAPHQL_URL = __ENV.GRAPHQL_URL
const application = 'abacus'

// Load request variables and user data
const requestVariables = JSON.parse(open('../../variables/requestVariables.json'))
const users = JSON.parse(open('../../variables/user-data.json')).users

export function setup() {
  return setupTokens(users) // Preload tokens and share with VUs
}

const accountsPageRequests = {
  getAccountsList: {
    skipContracts: true,
    limit: 300,
    offset: 0,
    searchTerm: '',
  },
}

const searchRequest = {
  getAccountsList: {
    skipContracts: true,
    limit: 300,
    offset: 0,
    searchTerm: 'placeholder',
  },
}

const accountPageRequests = {
  getAccountFullDetail: { accountId: 'placeholder' },
  getAccountById: { accountId: 'placeholder' },
  getAccountLedgerList: { accountId: 'placeholder', limit: 20, offset: 0 },
  canPerform: {
    identityId: 'placeholder',
    resourceTypeActions: [
      {
        action: 'view',
        resourceType: 'tax_info',
      },
    ],
  },
  getNotifications: {
    identityId: 'placeholder',
  },
}

const metrics = await setupMetrics({
  ...accountPageRequests,
  ...searchRequest,
  ...accountsPageRequests,
})

export const options = {
  scenarios: {
    backendAccountSearchAndVisit: createBackendScenario('backendAccountSearchAndVisit'),
    frontendAccountSearchAndVisit: createFrontendScenario('frontendAccountSearchAndVisit'),
  },
}

export async function backendAccountSearchAndVisit(tokenCache) {
  const user = randomItem(users)
  const token = tokenCache[user.username].accessToken
  const accountId = randomItem(requestVariables.accountId)

  // Land on accounts page
  await executeGraphQLRequests(accountsPageRequests, application, token, user, GRAPHQL_URL, metrics)
  // Perform search
  searchRequest.getAccountsList.searchTerm = `${accountId}`
  await executeGraphQLRequests(searchRequest, application, token, user, GRAPHQL_URL, metrics)
  // Perform account page visit
  // Update the request variables with the selected accountId
  Object.values(accountPageRequests).forEach((value) => {
    if ('accountId' in value) {
      value.accountId = accountId
    }
  })

  await executeGraphQLRequests(accountPageRequests, application, token, user, GRAPHQL_URL, metrics)

  sleep(Math.random() * (30 - 1) + 1)
}

export async function frontendAccountSearchAndVisit() {
  const user = randomItem(users)
  const accountId = randomItem(requestVariables.accountId)
  const page = await browser.newPage()
  // Navigate to the login page
  await page.goto('https://abacus.qaorch.com', { waitUntil: 'load' })
  const loginPage = new LoginPage(page, metrics)
  await loginPage.login(user.username, user.password)
  const accountsPage = new AccountsPage(page, metrics)
  await accountsPage.goTo()
  await accountsPage.waitForPageLoad()
  await accountsPage.search(accountId)
  await accountsPage.selectAccount(accountId)
  const accountPage = new AccountPage(page, metrics)
  await accountPage.goToPaymentInfoTab()
  await accountPage.goToAccountingTab()
  await accountPage.goToContractsTab()
}
