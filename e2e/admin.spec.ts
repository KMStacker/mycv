import { test, expect, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('Admin Dashboard Flow', () => {
  let sharedPage: Page
  const adminUsername = 'admin'
  if (!process.env.ADMIN_PSW) {
    throw new Error('ADMIN_PSW environment variable is missing')
  }
  const adminPassword: string = process.env.ADMIN_PSW
  const title = `Project_${Date.now()}`
  const description = `Description_${Date.now()}`
  const technologies = `Technologies_${Date.now()}`
  const githubUrl = `Url_${Date.now()}`

  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage()
  })

  test.afterAll(async () => {
    try {
      await sharedPage.goto('/admin')
      const projectItem = sharedPage.locator('li').filter({ hasText: title })
      if (await projectItem.isVisible()) {
        await projectItem.getByRole('button', { name: 'Delete' }).click()
      }
    } catch (error) {
      console.error('Cleanup error in E2E spec:', error)
    } finally {
      await sharedPage.close()
    }
  })

  test('should log in successfully as admin', async () => {
    await sharedPage.goto('/')
    await sharedPage.getByRole('button', { name: 'Login', exact: true }).click()
    await sharedPage.getByPlaceholder('Username').fill(adminUsername)
    await sharedPage.getByPlaceholder('Password', { exact: true }).fill(adminPassword)
    await sharedPage.locator('form').getByRole('button', { name: 'Login', exact: true }).click()
    await expect(sharedPage.getByText(`Welcome, ${adminUsername}!`)).toBeVisible()
  })

  test('should navigate to admin page and create a new project', async () => {
    await sharedPage.getByRole('link', { name: 'Admin', exact: true }).click()
    await sharedPage.getByRole('button', { name: 'Add new project' }).click()
    await sharedPage.locator('input[name="title"]').fill(title)
    await sharedPage.locator('input[name="description"]').fill(description)
    await sharedPage.locator('input[name="technologies"]').fill(technologies)
    await sharedPage.locator('input[name="githubUrl"]').fill(githubUrl)
    await sharedPage.getByRole('button', { name: 'Add project' }).click()
  })

  test('should display the created project on public projects page', async () => {
    await sharedPage.getByRole('link', { name: 'Projects', exact: true }).click()
    const projectHeading = sharedPage.getByRole('heading', { name: title })
    for (let i = 0; i < 10; i++) {
      if (await projectHeading.isVisible()) {
        break
      }
      await sharedPage.getByRole('button', { name: '→' }).click()
    }

    await expect(projectHeading).toBeVisible()
  })

  test('should automatically display project details in the showcase card', async () => {
    await expect(sharedPage.getByText(description)).toBeVisible()
    await expect(sharedPage.getByText(technologies)).toBeVisible()
    await expect(sharedPage.getByRole('link', { name: 'View in GitHub' })).toBeVisible()
  })
})
