import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  const username = `testuser_${Date.now()}`
  const password = '12345'

  test('should successfully register a new user and auto-login', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'Register', exact: true }).click()

    await page.getByPlaceholder('Username').fill(username)
    await page.getByPlaceholder('Password', { exact: true }).fill(password)
    await page.getByPlaceholder('Password again').fill(password)

    await page.locator('form').getByRole('button', { name: 'Register', exact: true }).click()

    await expect(page.getByText('Registration successful!')).toBeVisible()
    await page.getByRole('button', { name: 'Yes' }).click()

    await expect(page.getByText(`USER: ${username}`)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
  })

  test('should show error for non-matching passwords', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Register', exact: true }).click()

    await page.getByPlaceholder('Username').fill(`fail_${Date.now()}`)
    await page.getByPlaceholder('Password', { exact: true }).fill('pass1')
    await page.getByPlaceholder('Password again').fill('pass2')

    await page.locator('form').getByRole('button', { name: 'Register', exact: true }).click()

    await expect(page.getByText('Passwords do not match')).toBeVisible()
  })

  test('should allow user to login and logout', async ({ page, request }) => {
    const testUser = `testuser_${Date.now()}`
    await request.post('/api/users', {
      data: {
        username: testUser,
        password: password
      }
    })

    await page.goto('/')
    await page.getByRole('button', { name: 'Login', exact: true }).click()

    await page.getByPlaceholder('Username').fill(testUser)
    await page.getByPlaceholder('Password', { exact: true }).fill(password)
    await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click()

    await expect(page.getByText(`USER: ${testUser}`)).toBeVisible()

    await page.getByRole('button', { name: 'Logout' }).click()
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible()
  })
})
