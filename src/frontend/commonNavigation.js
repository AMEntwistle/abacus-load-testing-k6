export async function login(page, user) {
  // Type the username and password, then log in
  await page.type('#username', user.username) // Replace with the username
  await page.type('#password', user.password) // Replace with the password
  await page.click('button[type="submit"]') // Click the login button
}

export function getDataTestId(id) {
  return `[data-testid="${id}"]`
}
