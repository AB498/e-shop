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
 * Check if automatic courier order creation is enabled
 * @returns {Promise<boolean>} - True if enabled, false otherwise
 */
export async function isAutoCourierOrderEnabled() {
  try {
    const value = await getSetting('auto_create_courier_order');
    return value === 'true';
  } catch (error) {
    console.error('Error checking if auto courier order is enabled:', error);
    return false; // Default to false if error
  }
}

/**
 * Check if automatic Pathao courier order creation is enabled
 * @deprecated Use isAutoCourierOrderEnabled instead
 * @returns {Promise<boolean>} - True if enabled, false otherwise
 */
export async function isAutoPathaoOrderEnabled() {
  try {
    return await isAutoCourierOrderEnabled();
  } catch (error) {
    console.error('Error checking if auto Pathao order is enabled:', error);
    return false; // Default to false if error
  }
}

/**
 * Check if automatic Steadfast courier order creation is enabled
 * @deprecated Use isAutoCourierOrderEnabled instead
 * @returns {Promise<boolean>} - True if enabled, false otherwise
 */
export async function isAutoSteadfastOrderEnabled() {
  try {
    return await isAutoCourierOrderEnabled();
  } catch (error) {
    console.error('Error checking if auto Steadfast order is enabled:', error);
    return false; // Default to false if error
  }
}

/**
 * Get the default courier provider
 * @returns {Promise<string>} - Default courier provider ('pathao' or 'steadfast')
 */
export async function getDefaultCourierProvider() {
  try {
    // Get the default courier ID
    const defaultCourierId = await getSetting('default_courier_id');

    if (!defaultCourierId) {
      console.log('Default courier ID not found, defaulting to Pathao');
      return 'pathao';
    }

    // Get the courier name from the ID
    const courierId = parseInt(defaultCourierId, 10);

    // Get the courier from the database
    const { db } = await import('@/lib/db');
    const { couriers } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');

    const courierData = await db
      .select({
        name: couriers.name,
      })
      .from(couriers)
      .where(eq(couriers.id, courierId))
      .limit(1);

    if (courierData.length > 0) {
      const courierName = courierData[0].name;
      console.log(`Found courier name: ${courierName} for ID: ${courierId}`);

      if (courierName.toLowerCase() === 'steadfast') {
        return 'steadfast';
      } else if (courierName.toLowerCase() === 'pathao') {
        return 'pathao';
      } else {
        console.log(`Unknown courier name: ${courierName}, defaulting to Pathao`);
        return 'pathao';
      }
    } else {
      console.log(`No courier found for ID: ${courierId}, defaulting to Pathao`);
      return 'pathao';
    }
  } catch (error) {
    console.error('Error getting default courier provider:', error);
    return 'pathao'; // Default to Pathao if error
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
