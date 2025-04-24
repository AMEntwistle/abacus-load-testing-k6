import { getDataTestId } from '../../commonNavigation.js'
import { BasePage } from './basePage.js'

export class AccountsPage extends BasePage {
  constructor(page, metrics) {
    super(page, metrics)
    this.url = 'https://abacus.qaorch.com/accounts'
    this.accountSearchInput = getDataTestId('searchFieldInput')
    this.resultsTable = '.AccountList-table'
  }

  async waitForPageLoad() {
    const expectedElements = [this.accountSearchInput, this.resultsTable]
    await this.waitForElements(expectedElements)
    await this.waitForLoader()
  }

  async search(searchTerm) {
    await this.page.type(this.accountSearchInput, searchTerm)
    await this.waitForLoaderToExist()
    await this.waitForLoader()
  }

  async selectAccount(accountId) {
    await this.page.click(`a[href="/account/${accountId}"]`)
  }
}
