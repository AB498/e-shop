import { db, pool } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

/**
 * Authenticate a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} - User object or null if authentication fails
 */
export async function authenticateUser(email, password) {
  try {
    // Find user by email
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!userResults || userResults.length === 0) {
      return null;
    }

    const user = userResults[0];

    // Check if password is correct
    if (!user.password_hash) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return null;
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object|null>} - Created user or null if creation fails
 */
export async function createUser(userData) {
  try {
    // Only log in development mode
    if (1) {
      console.log('Creating user with data:', userData);
    }

    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    // Only log in development mode
    if (1) {
      console.log('Existing user check result:', existingUser);
    }

    if (existingUser && existingUser.length > 0) {
      // Only log in development mode
      if (1) {
        console.log('User with this email already exists');
      }
      return { error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    // Only log in development mode
    if (1) {
      console.log('Attempting to create user with hashed password');
    }

    // Don't specify ID - let the database auto-generate it
    const userValues = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password_hash: hashedPassword,
      phone: userData.phone || null,
      address: userData.address || null,
      city: userData.city === 'City' ? null : userData.city,
      post_code: userData.postCode || null,
      country: userData.country === 'Country' ? null : userData.country,
      region: userData.region === 'Region/State' ? null : userData.region,
      role: 'customer',
    };

    // Only log in development mode
    if (1) {
      console.log('User values to insert:', userValues);
    }

    let newUser;
    try {
      // Try to insert the user with a direct SQL query to avoid ID conflicts
      const result = await pool.query(`
        INSERT INTO users (
          first_name, last_name, email, password_hash,
          phone, address, city, post_code, country, region, role
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        ) RETURNING *
      `, [
        userValues.first_name,
        userValues.last_name,
        userValues.email,
        userValues.password_hash,
        userValues.phone,
        userValues.address,
        userValues.city,
        userValues.post_code,
        userValues.country,
        userValues.region,
        userValues.role
      ]);

      newUser = result.rows;
      console.log('User creation result:', newUser);

      if (!newUser || newUser.length === 0) {
        console.log('Failed to create user - no user returned');
        return { error: 'Failed to create user' };
      }
    } catch (insertError) {
      console.error('Error inserting user:', insertError);

      // Check if it's a duplicate key error
      if (insertError.message.includes('duplicate key')) {
        return { error: 'An account with this email already exists' };
      }

      return { error: `Database error: ${insertError.message}` };
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = newUser[0];
    return { user: userWithoutPassword };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'An error occurred while creating the user' };
  }
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export async function getUserById(id) {
  try {
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!userResults || userResults.length === 0) {
      return null;
    }

    const user = userResults[0];
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}
