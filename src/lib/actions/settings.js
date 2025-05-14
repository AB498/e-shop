'use server';

import { db } from '@/lib/db';
import { settings } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Get all settings
 * @returns {Promise<Array>} - Array of settings
 */
export async function getAllSettings() {
  try {
    const allSettings = await db
      .select()
      .from(settings)
      .orderBy(settings.key);

    return allSettings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
}

/**
 * Get a setting by key
 * @param {string} key - Setting key
 * @returns {Promise<string|null>} - Setting value or null if not found
 */
export async function getSetting(key) {
  try {
    const setting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    return setting.length > 0 ? setting[0].value : null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

/**
 * Update a setting
 * @param {string} key - Setting key
 * @param {string} value - Setting value
 * @param {string} description - Optional description for new settings
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function updateSetting(key, value, description = '') {
  'use server';

  try {
    console.log(`Updating setting ${key} to ${value}`);

    // Check if setting exists
    const existingSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existingSetting.length === 0) {
      console.log(`Setting ${key} not found, creating it...`);

      // Create the setting if it doesn't exist
      if (key === 'sslcommerz_enabled') {
        // For SSLCommerz setting, use a specific description
        await createSettingIfNotExists(key, value, 'Enable SSLCommerz payment gateway');
      } else {
        // For other settings, use the provided description or a generic one
        await createSettingIfNotExists(key, value, description || `Setting for ${key}`);
      }

      return true;
    }

    // Update setting
    await db
      .update(settings)
      .set({
        value: value.toString(),
        updated_at: new Date()
      })
      .where(eq(settings.key, key));

    console.log(`Successfully updated setting ${key} to ${value}`);
    return true;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }
}

/**
 * Check if automatic Pathao courier order creation is enabled
 * @returns {Promise<boolean>} - True if enabled, false otherwise
 */
export async function isAutoPathaoOrderEnabled() {
  try {
    const value = await getSetting('auto_create_pathao_order');
    return value === 'true';
  } catch (error) {
    console.error('Error checking if auto Pathao order is enabled:', error);
    return true; // Default to true if error
  }
}

/**
 * Create a setting if it doesn't exist
 * @param {string} key - Setting key
 * @param {string} value - Setting value
 * @param {string} description - Setting description
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function createSettingIfNotExists(key, value, description) {
  'use server';

  try {
    console.log(`Checking if setting ${key} exists...`);

    // Check if setting exists
    const existingSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existingSetting.length > 0) {
      console.log(`Setting ${key} already exists.`);
      return true;
    }

    console.log(`Creating setting ${key} with value ${value}...`);

    // Get the highest ID currently in the settings table
    const maxIdResult = await db
      .select({ maxId: sql`MAX(id)` })
      .from(settings);

    const nextId = maxIdResult[0]?.maxId ? Number(maxIdResult[0].maxId) + 1 : 1;
    console.log(`Using next ID: ${nextId} for new setting`);

    // Create setting with explicit ID
    await db
      .insert(settings)
      .values({
        id: nextId,
        key,
        value: value.toString(),
        description,
        created_at: new Date(),
        updated_at: new Date()
      });

    console.log(`Successfully created setting ${key} with ID ${nextId}.`);
    return true;
  } catch (error) {
    console.error(`Error creating setting ${key}:`, error);
    return false;
  }
}
