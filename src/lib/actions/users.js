import { db } from '@/lib/db';
import { users, orders, wishlistItems, productReviews } from '@/db/schema';
import { eq, desc, and, ne, sql } from 'drizzle-orm';
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

    // Check for foreign key relationships
    // 1. Check for orders
    const ordersCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders)
      .where(eq(orders.user_id, id));

    const totalOrders = ordersCount[0]?.count || 0;
    if (totalOrders > 0) {
      return { error: `Cannot delete admin user with ${totalOrders} orders. Orders are historical records and cannot be deleted.` };
    }

    // 2. Check for wishlist items
    const wishlistCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(wishlistItems)
      .where(eq(wishlistItems.user_id, id));

    const totalWishlistItems = wishlistCount[0]?.count || 0;

    // 3. Check for product reviews
    const reviewsCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(productReviews)
      .where(eq(productReviews.user_id, id));

    const totalReviews = reviewsCount[0]?.count || 0;

    // Use a transaction to delete related data and the user
    return await db.transaction(async (tx) => {
      console.log(`Deleting admin user with ID ${id}...`);

      // Delete wishlist items if any exist
      if (totalWishlistItems > 0) {
        console.log(`Deleting ${totalWishlistItems} wishlist items for user ID ${id}...`);
        await tx
          .delete(wishlistItems)
          .where(eq(wishlistItems.user_id, id));
      }

      // Delete product reviews if any exist
      if (totalReviews > 0) {
        console.log(`Deleting ${totalReviews} product reviews for user ID ${id}...`);
        await tx
          .delete(productReviews)
          .where(eq(productReviews.user_id, id));
      }

      // Delete the admin user
      const result = await tx.delete(users)
        .where(and(eq(users.id, id), eq(users.role, 'admin')))
        .returning({ id: users.id });

      if (!result.length) {
        throw new Error('Failed to delete admin user');
      }

      console.log(`Admin user deletion successful for ID ${id}`);
      return { success: true, message: 'Admin user deleted successfully' };
    });
  } catch (error) {
    console.error(`Error deleting admin user with ID ${id}:`, error);
    return { error: error.message || 'An error occurred while deleting the admin user' };
  }
}
