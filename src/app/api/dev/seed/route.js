import { NextResponse } from 'next/server';
import { db, pool } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Import expanded seed data
import categoriesSeed from './categories-seed';
import productsSeed from './products-seed';
import usersSeed from './users-seed';
import ordersSeed from './orders-seed';
import orderItemsSeed from './order-items-seed';
import filesSeed from './files-seed';

export async function POST() {
  try {
    console.log('Starting database seeding process...');

    // Prepare to use expanded seed data

    // Drop existing tables if they exist (for clean seeding)
    console.log('Dropping existing tables if they exist...');
    try {
      // Drop tables in reverse order of dependencies using direct pool queries
      await pool.query('DROP TABLE IF EXISTS order_items CASCADE');
      await pool.query('DROP TABLE IF EXISTS orders CASCADE');
      await pool.query('DROP TABLE IF EXISTS products CASCADE');
      await pool.query('DROP TABLE IF EXISTS categories CASCADE');
      await pool.query('DROP TABLE IF EXISTS users CASCADE');
      await pool.query('DROP TABLE IF EXISTS files CASCADE');
      await pool.query('DROP TYPE IF EXISTS user_role CASCADE');
      await pool.query('DROP TYPE IF EXISTS order_status CASCADE');
    } catch (error) {
      console.error('Error dropping tables:', error);
      // Continue anyway, as some tables might not exist yet
    }

    // Create schema using direct pool queries
    console.log('Creating schema...');
    try {
      // Create enum types first
      await pool.query("CREATE TYPE user_role AS ENUM ('admin', 'customer')");
      await pool.query("CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled')");

      // Create tables
      await pool.query(`
        CREATE TABLE files (
          id SERIAL PRIMARY KEY,
          key TEXT NOT NULL,
          url TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT,
          phone TEXT,
          address TEXT,
          city TEXT,
          post_code TEXT,
          country TEXT,
          region TEXT,
          role user_role NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          image TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          sku TEXT NOT NULL UNIQUE,
          category_id INTEGER REFERENCES categories(id),
          price DECIMAL(10, 2) NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          description TEXT,
          image TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          status order_status NOT NULL DEFAULT 'pending',
          total DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          product_id INTEGER REFERENCES products(id),
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    } catch (error) {
      console.error('Error creating schema:', error);
      throw error;
    }

    // Insert sample data
    console.log('Inserting sample data...');
    try {
      // Insert categories using Drizzle ORM
      console.log('Inserting categories...');
      for (const category of categoriesSeed) {
        await db.insert(schema.categories).values(category);
      }

      // Insert users using Drizzle ORM with password hashing
      console.log('Inserting users...');
      for (const user of usersSeed) {
        try {
          // Check if user already exists
          const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, user.email))
            .limit(1);

          if (existingUser && existingUser.length > 0) {
            console.log(`User ${user.email} already exists, skipping...`);
            continue;
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(user.password, 10);

          // Create user object with hashed password - don't specify ID
          const userToInsert = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password_hash: hashedPassword,
            phone: user.phone || null,
            address: user.address || null,
            city: user.city || null,
            post_code: user.post_code || null,
            country: user.country || null,
            region: user.region || null,
            role: user.role
          };

          console.log(`Inserting user: ${user.email}`);
          await db.insert(schema.users).values(userToInsert);
        } catch (error) {
          console.error(`Error inserting user ${user.email}:`, error);
          // Continue with other users even if one fails
        }
      }

      // Insert products using Drizzle ORM
      console.log('Inserting products...');
      for (const product of productsSeed) {
        await db.insert(schema.products).values(product);
      }

      // Insert orders using Drizzle ORM
      console.log('Inserting orders...');
      for (const order of ordersSeed) {
        await db.insert(schema.orders).values(order);
      }

      // Insert order items using Drizzle ORM
      console.log('Inserting order items...');
      for (const item of orderItemsSeed) {
        await db.insert(schema.orderItems).values(item);
      }

      // Insert files using Drizzle ORM
      console.log('Inserting files...');
      for (const file of filesSeed) {
        await db.insert(schema.files).values(file);
      }
    } catch (error) {
      console.error('Error inserting sample data:', error);
      throw error;
    }

    console.log('Database seeding completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with sample data!',
      stats: {
        products: productsSeed.length,
        categories: categoriesSeed.length,
        users: usersSeed.length,
        orders: ordersSeed.length,
        orderItems: orderItemsSeed.length,
        files: filesSeed.length
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database: ' + error.message },
      { status: 500 }
    );
  }
}
