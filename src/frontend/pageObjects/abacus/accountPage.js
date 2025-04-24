import { BasePage } from './basePage.js'
import { getDataTestId } from '../../commonNavigation.js'

export class AccountPage extends BasePage {
  constructor(page, metrics) {
    super(page, metrics)
    this.header = '.AccountDetail-top-header'
    this.generalDetails = getDataTestId('accountGeneralDetails')
    this.paymentInfoTab = '#accountDetail-tabs-tab-payment-info'
    this.paymentGeneralDetails = getDataTestId('paymentGeneralDetails')
    this.accountingTab = '#accountDetail-tabs-tab-accounting'
    this.accountindDetails = getDataTestId('tabAccounting')
    this.contractsTab = '#accountDetail-tabs-tab-contracts'
    this.contractsDetails = getDataTestId('paymentDetailContracts')
  }

  async waitForPageLoad() {
    const expectedElements = [this.generalDetails, this.header]
    await this.waitForElements(expectedElements)
    await this.waitForLoaderToExist()
    await this.waitForLoader()
  }

  async goToPaymentInfoTab() {
    await this.page.click(this.paymentInfoTab)
    await this.waitForElements(this.paymentGeneralDetails)
  }

  async goToAccountingTab() {
    await this.page.click(this.accountingTab)
    await this.waitForElements(this.accountindDetails)
  }

  async goToContractsTab() {
    await this.page.click(this.contractsTab)
    await this.waitForElements(this.contractsDetails)
  }
}
