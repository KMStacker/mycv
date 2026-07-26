import { test, expect } from '@playwright/test'

test.describe('Guestbook Flow', () => {
  test('should prompt for login if unauthenticated', async ({ page }) => {
    await page.goto('/guestbook')

    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Leave comment as guest' })).toBeVisible()
  })

  test('should allow authenticated user to post a comment', async ({ page, request }) => {
    const username = `testuser_${Date.now()}`
    const password = '12345'

    await request.post('/api/users', {
      data: { username, password }
    })

    await page.goto('/')
    await page.getByRole('button', { name: 'Login', exact: true }).click()
    await page.getByPlaceholder('Username').fill(username)
    await page.getByPlaceholder('Password', { exact: true }).fill(password)
    await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click()

    await page.getByRole('link', { name: 'Guestbook' }).click()

    const uniqueComment = `This is an e2e test comment ${Date.now()}`
    await page.getByPlaceholder('Write a comment...').fill(uniqueComment)
    await page.getByRole('button', { name: 'Post' }).click()

    const commentListItem = page.locator('li').filter({ hasText: uniqueComment })
    await expect(commentListItem).toContainText(username)
    await expect(commentListItem).toContainText(uniqueComment)
  })
})
