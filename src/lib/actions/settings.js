'use server';

import { db } from '@/lib/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function updateSetting(key, value) {
  try {
    // Check if setting exists
    const existingSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    
    if (existingSetting.length === 0) {
      console.error(`Setting ${key} not found`);
      return false;
    }
    
    // Update setting
    await db
      .update(settings)
      .set({
        value: value.toString(),
        updated_at: new Date()
      })
      .where(eq(settings.key, key));
    
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
