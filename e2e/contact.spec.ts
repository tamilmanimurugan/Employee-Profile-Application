import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'employee-token'));
    await page.goto('/contact');
    await expect(page).toHaveURL(/contact/, { timeout: 10000 });
    await page.waitForTimeout(500);
  });

  // ── Hero section ──────────────────────────────────────────────────────────

  test('hero heading is visible', async ({ page }) => {
    await expect(page.getByText("Let's Build Something Amazing Together")).toBeVisible({ timeout: 10000 });
  });

  test('CONTACT SUPPORT badge is visible', async ({ page }) => {
    await expect(page.locator('.hero-badge')).toContainText('CONTACT SUPPORT');
  });

  test('hero description text is visible', async ({ page }) => {
    await expect(page.getByText('Have questions, feedback or project ideas')).toBeVisible();
  });

  test('Live Chat button is visible', async ({ page }) => {
    await expect(page.locator('button.primary-btn')).toContainText('Live Chat');
  });

  test('Call Us button is visible', async ({ page }) => {
    await expect(page.locator('button.secondary-btn')).toContainText('Call Us');
  });

  // ── Contact info card ─────────────────────────────────────────────────────

  test('Contact Information heading is visible', async ({ page }) => {
    await expect(page.getByText('Contact Information')).toBeVisible({ timeout: 10000 });
  });

  test('email address support@infinire.com is visible', async ({ page }) => {
    await expect(page.getByText('support@infinire.com')).toBeVisible();
  });

  test('phone number is visible', async ({ page }) => {
    await expect(page.getByText('+91 9876543210')).toBeVisible();
  });

  test('office address Chennai is visible', async ({ page }) => {
    await expect(page.getByText('Chennai, Tamil Nadu, India')).toBeVisible();
  });

  test('social icons section is visible', async ({ page }) => {
    await expect(page.locator('.social-icons')).toBeVisible();
  });

  test('Live Support section is visible', async ({ page }) => {
    await expect(page.getByText('Live Support')).toBeVisible();
  });

  test('Chat Now button is visible', async ({ page }) => {
    await expect(page.locator('.live-support button')).toContainText('Chat Now');
  });

  // ── Contact form ──────────────────────────────────────────────────────────

  test('Send Message heading is visible', async ({ page }) => {
    await expect(page.locator('.form-header h2')).toBeVisible({ timeout: 10000 });
  });

  test('Full Name input is visible', async ({ page }) => {
    await expect(page.locator('input[placeholder="Enter your name"]')).toBeVisible();
  });

  test('Email Address input is visible', async ({ page }) => {
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();
  });

  test('Subject input is visible', async ({ page }) => {
    await expect(page.locator('input[placeholder="Enter subject"]')).toBeVisible();
  });

  test('Message textarea is visible', async ({ page }) => {
    await expect(page.locator('textarea[placeholder="Write your message..."]')).toBeVisible();
  });

  test('Send Message button is visible', async ({ page }) => {
    await expect(page.locator('button.send-btn')).toBeVisible();
  });

  test('can type into Full Name input', async ({ page }) => {
    const input = page.locator('input[placeholder="Enter your name"]');
    await input.fill('Test User');
    await expect(input).toHaveValue('Test User');
  });

  test('can type into Email input', async ({ page }) => {
    const input = page.locator('input[placeholder="Enter your email"]');
    await input.fill('test@example.com');
    await expect(input).toHaveValue('test@example.com');
  });

  test('can type into Subject input', async ({ page }) => {
    const input = page.locator('input[placeholder="Enter subject"]');
    await input.fill('Test Subject');
    await expect(input).toHaveValue('Test Subject');
  });

  test('can type into Message textarea', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder="Write your message..."]');
    await textarea.fill('Hello, this is a test message.');
    await expect(textarea).toHaveValue('Hello, this is a test message.');
  });

  test('clicking Send Message shows success toast', async ({ page }) => {
    await page.evaluate(() => {
      const setInput = (sel: string, val: string) => {
        const el = document.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement;
        if (!el) return;
        const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        (Object.getOwnPropertyDescriptor(proto, 'value')!.set as Function).call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      setInput('input[placeholder="Enter your name"]', 'Test User');
      setInput('input[placeholder="Enter your email"]', 'test@example.com');
      setInput('input[placeholder="Enter subject"]', 'Test Subject');
      setInput('textarea[placeholder="Write your message..."]', 'Test message content.');
    });
    await page.locator('button.send-btn').click();
    await expect(page.locator('.success-toast')).toBeVisible({ timeout: 10000 });
  });

  test('success toast contains Message Sent Successfully', async ({ page }) => {
    await page.evaluate(() => {
      const setInput = (sel: string, val: string) => {
        const el = document.querySelector(sel) as HTMLInputElement | HTMLTextAreaElement;
        if (!el) return;
        const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        (Object.getOwnPropertyDescriptor(proto, 'value')!.set as Function).call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      setInput('input[placeholder="Enter your name"]', 'Tamil');
      setInput('input[placeholder="Enter your email"]', 'tamil@test.com');
      setInput('input[placeholder="Enter subject"]', 'Hi');
      setInput('textarea[placeholder="Write your message..."]', 'Test.');
    });
    await page.locator('button.send-btn').click();
    await expect(page.locator('.success-toast')).toContainText('Message Sent Successfully', { timeout: 10000 });
  });

  // ── FAQ section ───────────────────────────────────────────────────────────

  test('FAQ section heading is visible', async ({ page }) => {
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible({ timeout: 10000 });
  });

  test('FAQ question "How fast will support reply?" is visible', async ({ page }) => {
    await expect(page.getByText('How fast will support reply?')).toBeVisible();
  });

  test('FAQ question "Can I request custom features?" is visible', async ({ page }) => {
    await expect(page.getByText('Can I request custom features?')).toBeVisible();
  });

  test('FAQ question "Do you provide 24/7 support?" is visible', async ({ page }) => {
    await expect(page.getByText('Do you provide 24/7 support?')).toBeVisible();
  });

  test('clicking FAQ question expands the answer', async ({ page }) => {
    const faqQuestion = page.locator('.faq-question').first();
    await faqQuestion.click();
    await page.waitForTimeout(300);
    await expect(page.locator('.faq-answer').first()).toBeVisible();
  });

  test('FAQ answer contains expected text for first question', async ({ page }) => {
    await page.locator('.faq-question').first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('.faq-answer').first()).toContainText('10-30 minutes');
  });

  // ── Map section ───────────────────────────────────────────────────────────

  test('Our Location section is visible', async ({ page }) => {
    await expect(page.getByText('Our Location')).toBeVisible({ timeout: 10000 });
  });

  test('map iframe is present in DOM', async ({ page }) => {
    await expect(page.locator('iframe')).toBeAttached({ timeout: 10000 });
  });

  // ── Mobile back button ────────────────────────────────────────────────────

  test('mobile back button is visible on small screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/contact');
    await expect(page.locator('button.mob-back-icon')).toBeVisible({ timeout: 10000 });
  });

  test('mobile back button navigates back', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 680 });
    await page.goto('/settings');
    await page.goto('/contact');
    await page.locator('button.mob-back-icon').click();
    // Should go back one page in history
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/contact/);
  });

});
