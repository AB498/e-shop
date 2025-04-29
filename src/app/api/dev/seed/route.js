import { NextResponse } from 'next/server';
import { db, pool } from '@/lib/db';
import * as schema from '@/db/schema';

// Sample data for seeding
const sampleProducts = [
  {
    id: 1,
    name: 'Organic Bananas',
    sku: 'FRUIT-001',
    category_id: 1, // Fruits
    price: 2.99,
    stock: 150,
    description: 'Fresh organic bananas from local farms.',
    image: '/images/product-image.png'
  },
  {
    id: 2,
    name: 'Fresh Strawberries',
    sku: 'FRUIT-002',
    category_id: 1, // Fruits
    price: 4.99,
    stock: 100,
    description: 'Sweet and juicy strawberries, perfect for desserts.',
    image: '/images/product-image.png'
  },
  {
    id: 3,
    name: 'Avocado',
    sku: 'FRUIT-003',
    category_id: 1, // Fruits
    price: 1.99,
    stock: 75,
    description: 'Ripe avocados, ready to eat.',
    image: '/images/product-image.png'
  },
  {
    id: 4,
    name: 'Whole Milk',
    sku: 'DAIRY-001',
    category_id: 3, // Dairy
    price: 3.49,
    stock: 50,
    description: 'Fresh whole milk from local dairy farms.',
    image: '/images/product-image.png'
  },
  {
    id: 5,
    name: 'Greek Yogurt',
    sku: 'DAIRY-002',
    category_id: 3, // Dairy
    price: 5.99,
    stock: 40,
    description: 'Creamy Greek yogurt, high in protein.',
    image: '/images/product-image.png'
  },
  {
    id: 6,
    name: 'Sourdough Bread',
    sku: 'BAKERY-001',
    category_id: 4, // Bakery
    price: 4.49,
    stock: 30,
    description: 'Freshly baked sourdough bread.',
    image: '/images/product-image.png'
  },
  {
    id: 7,
    name: 'Chocolate Croissant',
    sku: 'BAKERY-002',
    category_id: 4, // Bakery
    price: 2.99,
    stock: 25,
    description: 'Buttery croissant with chocolate filling.',
    image: '/images/product-image.png'
  },
  {
    id: 8,
    name: 'Sparkling Water',
    sku: 'BEVERAGE-001',
    category_id: 5, // Beverages
    price: 1.49,
    stock: 100,
    description: 'Refreshing sparkling water.',
    image: '/images/product-image.png'
  },
  {
    id: 9,
    name: 'Orange Juice',
    sku: 'BEVERAGE-002',
    category_id: 5, // Beverages
    price: 3.99,
    stock: 60,
    description: 'Freshly squeezed orange juice.',
    image: '/images/product-image.png'
  },
  {
    id: 10,
    name: 'Salmon Fillet',
    sku: 'SEAFOOD-001',
    category_id: 7, // Seafood
    price: 12.99,
    stock: 20,
    description: 'Fresh salmon fillet, perfect for grilling.',
    image: '/images/product-image.png'
  }
];

const sampleCategories = [
  { id: 1, name: 'Fruits', slug: 'fruits', image: '/images/vegetables-icon.png' },
  { id: 2, name: 'Vegetables', slug: 'vegetables', image: '/images/vegetables-icon.png' },
  { id: 3, name: 'Dairy', slug: 'dairy', image: '/images/dairy-icon.png' },
  { id: 4, name: 'Bakery', slug: 'bakery', image: '/images/bakery-icon.png' },
  { id: 5, name: 'Beverages', slug: 'beverages', image: '/images/beverages-icon.png' },
  { id: 6, name: 'Meat', slug: 'meat', image: '/images/meat-icon.png' },
  { id: 7, name: 'Seafood', slug: 'seafood', image: '/images/seafood-icon.png' }
];

const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password_hash: '$2b$10$6KVNn1LpPDmfgqT.Vp8YXO9AwqMxJ7hA.KqvQGsAycGwJ1VbZwMHO', // password: password123
    role: 'customer'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password_hash: '$2b$10$6KVNn1LpPDmfgqT.Vp8YXO9AwqMxJ7hA.KqvQGsAycGwJ1VbZwMHO', // password: password123
    role: 'customer'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@example.com',
    password_hash: '$2b$10$6KVNn1LpPDmfgqT.Vp8YXO9AwqMxJ7hA.KqvQGsAycGwJ1VbZwMHO', // password: password123
    role: 'admin'
  }
];

const sampleOrders = [
  {
    id: 1,
    user_id: 1,
    status: 'delivered',
    total: 35.96,
    created_at: new Date('2023-06-15')
  },
  {
    id: 2,
    user_id: 2,
    status: 'processing',
    total: 29.95,
    created_at: new Date('2023-06-16')
  },
  {
    id: 3,
    user_id: 1,
    status: 'shipped',
    total: 24.96,
    created_at: new Date('2023-06-17')
  }
];

const sampleOrderItems = [
  // Order 1 items
  { order_id: 1, product_id: 1, quantity: 2, price: 2.99 },
  { order_id: 1, product_id: 4, quantity: 1, price: 3.49 },
  { order_id: 1, product_id: 6, quantity: 1, price: 4.49 },
  { order_id: 1, product_id: 9, quantity: 2, price: 3.99 },

  // Order 2 items
  { order_id: 2, product_id: 2, quantity: 1, price: 4.99 },
  { order_id: 2, product_id: 5, quantity: 1, price: 5.99 },
  { order_id: 2, product_id: 8, quantity: 2, price: 1.49 },
  { order_id: 2, product_id: 7, quantity: 3, price: 2.99 },

  // Order 3 items
  { order_id: 3, product_id: 3, quantity: 2, price: 1.99 },
  { order_id: 3, product_id: 10, quantity: 1, price: 12.99 },
  { order_id: 3, product_id: 8, quantity: 4, price: 1.49 }
];

export async function POST() {
  try {
    console.log('Starting database seeding process...');

    // Create a sample file record
    const sampleFile = {
      key: 'sample-seed-file',
      url: 'https://example.com/sample-file.jpg'
    };

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
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT,
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
      for (const category of sampleCategories) {
        await db.insert(schema.categories).values(category);
      }

      // Insert users using Drizzle ORM
      console.log('Inserting users...');
      for (const user of sampleUsers) {
        await db.insert(schema.users).values(user);
      }

      // Insert products using Drizzle ORM
      console.log('Inserting products...');
      for (const product of sampleProducts) {
        await db.insert(schema.products).values(product);
      }

      // Insert orders using Drizzle ORM
      console.log('Inserting orders...');
      for (const order of sampleOrders) {
        await db.insert(schema.orders).values(order);
      }

      // Insert order items using Drizzle ORM
      console.log('Inserting order items...');
      for (const item of sampleOrderItems) {
        await db.insert(schema.orderItems).values(item);
      }

      // Insert sample file using Drizzle ORM
      console.log('Inserting sample file...');
      await db.insert(schema.files).values(sampleFile);
    } catch (error) {
      console.error('Error inserting sample data:', error);
      throw error;
    }

    console.log('Database seeding completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with sample data!',
      stats: {
        products: sampleProducts.length,
        categories: sampleCategories.length,
        users: sampleUsers.length,
        orders: sampleOrders.length,
        orderItems: sampleOrderItems.length,
        files: 1
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
