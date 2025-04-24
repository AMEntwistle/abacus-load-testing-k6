import { BasePage } from './basePage.js'

export class ContractPage extends BasePage {
  constructor(page, metrics) {
    super(page, metrics)
    this.header = '.ContractDetail-top-header'
    this.contractDetails = '.ContractDetail-general-details'
    this.labelTerms = '[data-testid="labelContractTermsDetailPresentational"]'
    this.productTerms = '[data-testid="productContractTermsDetailPresentational"]'
    this.tracktTerms = '[data-testid="trackContractTermsDetailPresentational"]'
    this.mechanicalsSection = '[data-testid="contractMechanicalDeductionsCard"]'
    this.physicalReserves = '.ContractDetail-PhysicalReserve'
    this.advancesTab = '#ContractDetail-tabs-tab-advance'
    this.advanceList = '.AdvanceList'
  }

  async waitForPageLoad() {
    await this.waitForElements([
      this.header,
      this.contractDetails,
      this.labelTerms,
      this.productTerms,
      this.tracktTerms,
      this.mechanicalsSection,
      this.physicalReserves,
    ])
  }

  async goToAdvancesTab() {
    await this.page.click(this.advancesTab)
    await this.waitForElements(this.advanceList)
  }
}
