import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq, desc, and, ne } from 'drizzle-orm';
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

/**
 * Get all admin users
 * @returns {Promise<Array>} - List of admin users
 */
export async function getAllAdminUsers() {
  try {
    const adminUsers = await db
      .select({
        id: users.id,
        firstName: users.first_name,
        lastName: users.last_name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        postCode: users.post_code,
        country: users.country,
        region: users.region,
        role: users.role,
        createdAt: users.created_at
      })
      .from(users)
      .where(eq(users.role, 'admin'))
      .orderBy(desc(users.created_at));

    return adminUsers.map(admin => ({
      ...admin,
      fullName: `${admin.firstName} ${admin.lastName}`,
      createdAt: admin.createdAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

/**
 * Create a new admin user
 * @param {Object} userData - Admin user data
 * @returns {Promise<Object|null>} - Created admin user or null if creation fails
 */
export async function createAdminUser(userData) {
  try {
    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser && existingUser.length > 0) {
      return { error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user with admin role
    const userValues = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password_hash: hashedPassword,
      phone: userData.phone || null,
      address: userData.address || null,
      city: userData.city || null,
      post_code: userData.postCode || null,
      country: userData.country || null,
      region: userData.region || null,
      role: 'admin', // Set role to admin
      created_at: new Date(),
      updated_at: new Date()
    };

    // Insert the new admin user
    const result = await db
      .insert(users)
      .values(userValues)
      .returning();

    if (!result.length) {
      return { error: 'Failed to create admin user' };
    }

    // Format the user data to match the expected format in the client
    return {
      user: {
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
      }
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { error: 'An error occurred while creating the admin user' };
  }
}

/**
 * Update an admin user
 * @param {number} id - Admin user ID
 * @param {Object} userData - Updated admin user data
 * @returns {Promise<Object|null>} - Updated admin user or null if update fails
 */
export async function updateAdminUser(id, userData) {
  try {
    // Check if user exists and is an admin
    const existingUser = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, 'admin')))
      .limit(1);

    if (!existingUser.length) {
      return { error: 'Admin user not found' };
    }

    // Check if email is already in use by another user
    if (userData.email !== existingUser[0].email) {
      const emailInUse = await isEmailInUse(userData.email, id);
      if (emailInUse) {
        return { error: 'Email is already in use by another user' };
      }
    }

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
      .where(and(eq(users.id, id), eq(users.role, 'admin')))
      .returning();

    if (!result.length) {
      return { error: 'Failed to update admin user' };
    }

    // Format the user data to match the expected format in the client
    return {
      user: {
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
      }
    };
  } catch (error) {
    console.error(`Error updating admin user with ID ${id}:`, error);
    return { error: 'An error occurred while updating the admin user' };
  }
}

/**
 * Delete an admin user
 * @param {number} id - Admin user ID
 * @returns {Promise<Object>} - Result of the deletion
 */
export async function deleteAdminUser(id) {
  try {
    // Check if user exists and is an admin
    const existingUser = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, 'admin')))
      .limit(1);

    if (!existingUser.length) {
      return { error: 'Admin user not found' };
    }

    // Delete user
    const result = await db.delete(users)
      .where(and(eq(users.id, id), eq(users.role, 'admin')))
      .returning({ id: users.id });

    if (!result.length) {
      return { error: 'Failed to delete admin user' };
    }

    return { success: true, message: 'Admin user deleted successfully' };
  } catch (error) {
    console.error(`Error deleting admin user with ID ${id}:`, error);
    return { error: 'An error occurred while deleting the admin user' };
  }
}
