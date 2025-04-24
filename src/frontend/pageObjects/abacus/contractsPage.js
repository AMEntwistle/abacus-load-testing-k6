import { getDataTestId } from '../../commonNavigation.js'
import { BasePage } from './basePage.js'

export class ContractsPage extends BasePage {
  constructor(page, metrics) {
    super(page, metrics)
    this.contractSearchInput = getDataTestId('searchFieldInput')
    this.resultsTable = getDataTestId('contractGridTable')
    this.url = 'https://abacus.qaorch.com/contracts'
  }
  async waitForPageLoad() {
    const expectedElements = [this.contractSearchInput, this.resultsTable]
    await this.waitForElements(expectedElements)
    await this.waitForLoader()
  }
  async search(searchTerm) {
    await this.page.type(this.contractSearchInput, searchTerm)
    await this.waitForLoaderToExist()
    await this.waitForLoader()
  }
  async selectContract(contractId) {
    await this.page.click(`a[href="/contract/${contractId}"]`)
  }
}
