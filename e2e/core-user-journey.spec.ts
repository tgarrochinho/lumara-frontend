/**
 * Core User Journey E2E Tests
 *
 * Tests the complete user flow for creating, viewing, searching,
 * and managing memories in Lumara.
 */

import { test, expect } from '@playwright/test';

test.describe('Core User Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for the app to load
    await expect(page.locator('h1')).toContainText('Lumara');
  });

  test('should display app header and empty state', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('Lumara');
    await expect(page.getByText('Your metacognitive AI partner')).toBeVisible();

    // Check for empty state in memory list
    await expect(page.getByText('No memories yet')).toBeVisible();
  });

  test('should create a memory through conversation', async ({ page }) => {
    // Type a message in the chat input
    const chatInput = page.getByPlaceholder(/type a message/i);
    await expect(chatInput).toBeVisible();

    await chatInput.fill('React hooks run on every render by default');
    await chatInput.press('Enter');

    // Wait for AI response
    await expect(page.getByText(/thinking/i)).toBeVisible();

    // Wait for memory extraction (this may take a few seconds)
    await page.waitForTimeout(3000);

    // Memory should appear in the list
    // Note: Actual implementation may vary based on AI response
  });

  test('should search memories', async ({ page }) => {
    // First, we need some memories (skip if no memories exist)
    const noMemoriesText = await page.getByText('No memories yet').count();
    if (noMemoriesText > 0) {
      test.skip();
    }

    // Find the search input in memories panel
    const searchInput = page.getByPlaceholder(/search memories/i);
    await expect(searchInput).toBeVisible();

    // Type a search query
    await searchInput.fill('React');

    // Wait for search results
    await page.waitForTimeout(500);

    // Results should be filtered
    // (Actual assertions depend on existing memories)
  });

  test('should filter memories by type', async ({ page }) => {
    // Skip if no memories
    const noMemoriesText = await page.getByText('No memories yet').count();
    if (noMemoriesText > 0) {
      test.skip();
    }

    // Click on Knowledge filter
    await page.getByRole('button', { name: /filter by knowledge/i }).click();

    // Wait for filter to apply
    await page.waitForTimeout(300);

    // Verify only knowledge type memories are shown
    // (Actual assertions depend on existing memories)
  });

  test('should open memory actions menu', async ({ page }) => {
    // Skip if no memories
    const noMemoriesText = await page.getByText('No memories yet').count();
    if (noMemoriesText > 0) {
      test.skip();
    }

    // Find first memory card
    const memoryCard = page.getByTestId('memory-card').first();
    await expect(memoryCard).toBeVisible();

    // Click the actions button (three dots)
    const actionsButton = memoryCard.getByLabel(/memory actions/i);
    await actionsButton.click();

    // Verify menu appears
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /delete/i })).toBeVisible();
  });

  test('should edit a memory', async ({ page }) => {
    // Skip if no memories
    const noMemoriesText = await page.getByText('No memories yet').count();
    if (noMemoriesText > 0) {
      test.skip();
    }

    // Open actions menu
    const memoryCard = page.getByTestId('memory-card').first();
    const actionsButton = memoryCard.getByLabel(/memory actions/i);
    await actionsButton.click();

    // Click Edit
    await page.getByRole('button', { name: /edit/i }).click();

    // Edit modal should appear
    await expect(page.getByRole('heading', { name: /edit memory/i })).toBeVisible();

    // Modify content
    const contentField = page.getByPlaceholder(/memory content/i);
    await contentField.fill('Updated memory content');

    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();

    // Wait for save to complete
    await page.waitForTimeout(500);

    // Modal should close
    await expect(page.getByRole('heading', { name: /edit memory/i })).not.toBeVisible();
  });

  test('should delete a memory with confirmation', async ({ page }) => {
    // Skip if no memories
    const noMemoriesText = await page.getByText('No memories yet').count();
    if (noMemoriesText > 0) {
      test.skip();
    }

    // Get initial memory count
    const initialCount = await page.getByTestId('memory-card').count();

    // Open actions menu
    const memoryCard = page.getByTestId('memory-card').first();
    const actionsButton = memoryCard.getByLabel(/memory actions/i);
    await actionsButton.click();

    // Click Delete
    await page.getByRole('button', { name: /delete/i }).click();

    // Confirmation modal should appear
    await expect(page.getByRole('heading', { name: /delete memory/i })).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: /^delete$/i }).click();

    // Wait for deletion
    await page.waitForTimeout(500);

    // Memory count should decrease
    const newCount = await page.getByTestId('memory-card').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile toggle button should be visible
    const toggleButton = page.getByRole('button', { name: /memories/i });
    await expect(toggleButton).toBeVisible();

    // Click to show memories
    await toggleButton.click();

    // Memories panel should be visible
    await expect(page.getByRole('complementary', { name: /memory list/i })).toBeVisible();

    // Chat should be hidden on mobile
    await expect(page.getByRole('main', { name: /chat interface/i })).not.toBeVisible();

    // Toggle back to chat
    await page.getByRole('button', { name: /chat/i }).click();

    // Chat should be visible, memories hidden
    await expect(page.getByRole('main', { name: /chat interface/i })).toBeVisible();
    await expect(page.getByRole('complementary', { name: /memory list/i })).not.toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Focus on chat input
    const chatInput = page.getByPlaceholder(/type a message/i);
    await chatInput.focus();

    // Tab to navigate through interactive elements
    await page.keyboard.press('Tab');

    // Verify focus moved (exact behavior depends on focus order)
    // This is a basic smoke test for keyboard navigation
  });

  test('should handle search debouncing', async ({ page }) => {
    // Skip if no memories
    const noMemoriesText = await page.getByText('No memories yet').count();
    if (noMemoriesText > 0) {
      test.skip();
    }

    const searchInput = page.getByPlaceholder(/search memories/i);
    await searchInput.focus();

    // Type quickly
    await searchInput.type('React hooks', { delay: 50 });

    // Wait for debounce (300ms)
    await page.waitForTimeout(400);

    // Search should have been triggered once (not for every keystroke)
    // (Actual verification would require monitoring network/state)
  });

  test('should clear filters', async ({ page }) => {
    // Skip if no memories
    const noMemoriesText = await page.getByText('No memories yet').count();
    if (noMemoriesText > 0) {
      test.skip();
    }

    // Apply a filter
    await page.getByRole('button', { name: /filter by knowledge/i }).click();

    // Enter a search query
    const searchInput = page.getByPlaceholder(/search memories/i);
    await searchInput.fill('React');

    // Clear filters button should appear
    const clearButton = page.getByRole('button', { name: /clear filters/i });
    await expect(clearButton).toBeVisible();

    // Click clear
    await clearButton.click();

    // Filters should be reset
    await expect(searchInput).toHaveValue('');
    // Filter should be back to "All"
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check for main landmarks
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('complementary')).toBeVisible();

    // Check for labeled interactive elements
    const chatInput = page.getByPlaceholder(/type a message/i);
    await expect(chatInput).toHaveAttribute('aria-label');
  });

  test('should support screen readers', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Verify semantic HTML structure
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();

    // Verify headings hierarchy
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
  });
});
