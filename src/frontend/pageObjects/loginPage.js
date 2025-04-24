import { BasePage } from './abacus/basePage.js'

export class LoginPage extends BasePage {
  constructor(page, frontendFailures) {
    super(page, frontendFailures)
    this.usernameInput = '#username'
    this.passwordInput = '#password'
    this.loginButton = 'button[type="submit"]'
    this.landingPageFooter = '.MainNavFooterUserMenu-name'
  }

  async login(username, password) {
    await this.page.type(this.usernameInput, username)
    await this.page.type(this.passwordInput, password)
    await this.page.click(this.loginButton)
    await this.page.waitForSelector('.MainNavFooterUserMenu-name', { state: 'visible' })
  }
}
