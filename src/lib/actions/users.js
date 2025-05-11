import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<object|null>} - User object or null if not found
 */
export async function getUserById(id) {
  try {
    const result = await db
      .select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        post_code: users.post_code,
        country: users.country,
        region: users.region,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!result.length) {
      return null;
    }

    // Format the user data to match the expected format in the client
    return {
      id: result[0].id,
      firstName: result[0].first_name,
      lastName: result[0].last_name,
      email: result[0].email,
      phone: result[0].phone,
      address: result[0].address,
      city: result[0].city,
      postCode: result[0].post_code,
      country: result[0].country,
      region: result[0].region,
      role: result[0].role,
      createdAt: result[0].created_at,
      updatedAt: result[0].updated_at,
    };
  } catch (error) {
    console.error(`Error getting user with ID ${id}:`, error);
    return null;
  }
}

/**
 * Update user profile
 * @param {number} id - User ID
 * @param {object} userData - Updated user data
 * @returns {Promise<object|null>} - Updated user object or null if update fails
 */
export async function updateUserProfile(id, userData) {
  try {
    // Prepare update data
    const updateData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone: userData.phone || null,
      address: userData.address || null,
      city: userData.city || null,
      post_code: userData.postCode || null,
      country: userData.country || null,
      region: userData.region || null,
      updated_at: new Date(),
    };

    // If password is provided, hash it and add to update data
    if (userData.password && userData.password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(userData.password, 10);
    }

    // Update user
    const result = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        post_code: users.post_code,
        country: users.country,
        region: users.region,
        role: users.role,
        updated_at: users.updated_at,
      });

    if (!result.length) {
      return null;
    }

    // Format the user data to match the expected format in the client
    return {
      id: result[0].id,
      firstName: result[0].first_name,
      lastName: result[0].last_name,
      email: result[0].email,
      phone: result[0].phone,
      address: result[0].address,
      city: result[0].city,
      postCode: result[0].post_code,
      country: result[0].country,
      region: result[0].region,
      role: result[0].role,
      updatedAt: result[0].updated_at,
    };
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
}

/**
 * Check if email is already in use by another user
 * @param {string} email - Email to check
 * @param {number} excludeUserId - User ID to exclude from the check
 * @returns {Promise<boolean>} - True if email is already in use, false otherwise
 */
export async function isEmailInUse(email, excludeUserId = null) {
  try {
    let query = db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    // If excludeUserId is provided, exclude that user from the check
    if (excludeUserId) {
      query = query.where(eq(users.id, excludeUserId).not());
    }

    const result = await query.limit(1);
    return result.length > 0;
  } catch (error) {
    console.error(`Error checking if email ${email} is in use:`, error);
    return true; // Assume email is in use to prevent potential issues
  }
}
