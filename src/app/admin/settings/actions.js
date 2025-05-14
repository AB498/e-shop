'use server';

import { updateSetting } from '@/lib/actions/settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Update a setting (server action)
 * @param {string} key - Setting key
 * @param {string} value - Setting value
 * @returns {Promise<{success: boolean, error?: string}>} - Result object
 */
export async function updateSettingAction(key, value) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate required fields
    if (!key || value === undefined) {
      return { success: false, error: 'Key and value are required' };
    }

    console.log(`Server action: Updating setting ${key} to ${value}`);

    // Update setting
    const result = await updateSetting(key, value);
    
    if (!result) {
      return { success: false, error: 'Failed to update setting' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateSettingAction:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred'
    };
  }
}
