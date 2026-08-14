import { test, expect } from '@playwright/test'

test.describe('App Navigation', () => {
  test('should display home page welcome message', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /WELCOME\/\/TO MY-CV/i })).toBeVisible()
  })

  test('should navigate to projects page successfully', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Projects', exact: true }).click()
    await expect(page.getByRole('heading', { name: /PROJECTS\/\/SHOWCASE/i })).toBeVisible()
  })

  test('should navigate to skills page successfully', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Skills', exact: true }).click()
    await expect(page.getByRole('heading', { name: /SKILLS\/\/SHOWCASE/i })).toBeVisible()
  })

  test('should navigate to guestbook page successfully', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Guestbook', exact: true }).click()
    await expect(page.getByRole('heading', { name: /GUESTBOOK\/\/TRANSMISSIONS/i })).toBeVisible()
  })
})
