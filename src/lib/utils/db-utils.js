/**
 * Database utility functions
 */

import { pool } from '../../lib/db.js';

/**
 * Resets the auto-increment sequence for a table to the maximum ID + 1
 * @param {string} tableName - The name of the table
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function resetSequence(tableName) {
  try {
    await pool.query(`
      SELECT setval(pg_get_serial_sequence('${tableName}', 'id'),
        (SELECT COALESCE(MAX(id), 0) + 1 FROM ${tableName}), false);
    `);
    console.log(`Sequence for table ${tableName} has been reset`);
    return true;
  } catch (error) {
    console.error(`Error resetting sequence for ${tableName}:`, error);
    return false;
  }
}

/**
 * Forcefully resets the auto-increment sequence for a table to a specific value
 * @param {string} tableName - The name of the table
 * @param {number} [value] - The value to set the sequence to (defaults to max ID + 1)
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function forceResetSequence(tableName, value) {
  try {
    if (value === undefined) {
      // Get the current max ID
      const result = await pool.query(`SELECT MAX(id) FROM ${tableName}`);
      value = (result.rows[0].max || 0) + 1;
    }
    
    await pool.query(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH ${value}`);
    console.log(`Forcefully reset sequence for table ${tableName} to ${value}`);
    return true;
  } catch (error) {
    console.error(`Error forcefully resetting sequence for ${tableName}:`, error);
    return false;
  }
}

/**
 * Handles a duplicate key error by attempting to fix the sequence and retrying the operation
 * @param {Error} error - The error object
 * @param {string} tableName - The name of the table
 * @param {Function} operation - The database operation to retry
 * @param {number} [maxRetries=3] - Maximum number of retry attempts
 * @returns {Promise<any>} - The result of the operation if successful
 * @throws {Error} - Rethrows the error if all retries fail
 */
export async function handleDuplicateKeyError(error, tableName, operation, maxRetries = 3) {
  if (error.code !== '23505' || !error.constraint.includes('_pkey')) {
    throw error; // Not a primary key violation, rethrow
  }
  
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      // Try to fix the sequence
      await forceResetSequence(tableName);
      
      // Wait a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Retry the operation
      return await operation();
    } catch (retryError) {
      retryCount++;
      
      if (retryCount >= maxRetries || retryError.code !== '23505') {
        throw retryError; // Max retries reached or different error, rethrow
      }
      
      console.error(`Retry ${retryCount}/${maxRetries} failed:`, retryError);
    }
  }
}
