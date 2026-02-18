import { test, expect } from '@playwright/test'

test('smoke: landing to login', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Chatter')).toBeVisible()
  await page.getByRole('link', { name: 'Sign in' }).click()
  await expect(page.getByText('Welcome back')).toBeVisible()
})
