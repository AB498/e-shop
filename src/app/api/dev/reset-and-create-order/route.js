import { NextResponse } from 'next/server';
import { db, pool } from '@/lib/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { resetSequence } from '@/lib/utils/db-utils';
import { createAutomaticCourierOrder } from '@/lib/services/auto-courier';

export async function POST() {
  try {
    console.log('Starting database reset and order creation process...');
    const results = {
      steps: [],
      adminUser: null,
      regularUser: null,
      products: [],
      order: null,
      orderItems: []
    };

    // Step 1: Drop existing tables if they exist
    console.log('Dropping existing tables if they exist...');
    results.steps.push({ name: 'Drop Tables', status: 'in_progress' });
    try {
      // Drop tables in reverse order of dependencies using direct pool queries
      await pool.query('DROP TABLE IF EXISTS store_locations CASCADE');
      await pool.query('DROP TABLE IF EXISTS courier_tracking CASCADE');
      await pool.query('DROP TABLE IF EXISTS order_items CASCADE');
      await pool.query('DROP TABLE IF EXISTS orders CASCADE');
      await pool.query('DROP TABLE IF EXISTS products CASCADE');
      await pool.query('DROP TABLE IF EXISTS categories CASCADE');
      await pool.query('DROP TABLE IF EXISTS couriers CASCADE');
      await pool.query('DROP TABLE IF EXISTS users CASCADE');
      await pool.query('DROP TABLE IF EXISTS files CASCADE');
      await pool.query('DROP TYPE IF EXISTS user_role CASCADE');
      await pool.query('DROP TYPE IF EXISTS order_status CASCADE');
      await pool.query('DROP TYPE IF EXISTS courier_status CASCADE');

      results.steps[0].status = 'completed';
    } catch (error) {
      console.error('Error dropping tables:', error);
      results.steps[0].status = 'failed';
      results.steps[0].error = error.message;
      throw error;
    }

    // Step 2: Create schema using direct pool queries
    console.log('Creating schema...');
    results.steps.push({ name: 'Create Schema', status: 'in_progress' });
    try {
      // Create enum types first
      await pool.query("CREATE TYPE user_role AS ENUM ('admin', 'customer')");
      await pool.query("CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled')");
      await pool.query("CREATE TYPE courier_status AS ENUM ('pending', 'picked', 'in_transit', 'delivered', 'returned', 'cancelled')");

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
          weight DECIMAL(5, 2) DEFAULT 0.5,
          description TEXT,
          image TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE couriers (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
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
          courier_id INTEGER REFERENCES couriers(id),
          courier_order_id TEXT,
          courier_tracking_id TEXT,
          courier_status courier_status,
          shipping_address TEXT,
          shipping_city TEXT,
          shipping_post_code TEXT,
          shipping_phone TEXT,
          shipping_area TEXT,
          shipping_landmark TEXT,
          shipping_instructions TEXT,
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

      await pool.query(`
        CREATE TABLE courier_tracking (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
          courier_id INTEGER REFERENCES couriers(id),
          tracking_id TEXT NOT NULL,
          status courier_status NOT NULL,
          details TEXT,
          location TEXT,
          timestamp TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create store_locations table
      await pool.query(`
        CREATE TABLE store_locations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          contact_name TEXT NOT NULL,
          contact_number TEXT NOT NULL,
          secondary_contact TEXT,
          address TEXT NOT NULL,
          city_id INTEGER NOT NULL,
          zone_id INTEGER NOT NULL,
          area_id INTEGER NOT NULL,
          is_default BOOLEAN DEFAULT FALSE,
          pathao_store_id TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      results.steps[1].status = 'completed';
    } catch (error) {
      console.error('Error creating schema:', error);
      results.steps[1].status = 'failed';
      results.steps[1].error = error.message;
      throw error;
    }

    // Step 3: Create admin user
    console.log('Creating admin user...');
    results.steps.push({ name: 'Create Admin User', status: 'in_progress' });
    try {
      const adminUser = {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: 'Admin123!',
        phone: '+1122334455',
        address: '789 Admin St',
        city: 'Dhaka',
        post_code: '1000',
        country: 'Bangladesh',
        region: 'Dhaka Division',
        role: 'admin'
      };

      // Hash the password
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);

      // Create user object with hashed password
      const userToInsert = {
        first_name: adminUser.first_name,
        last_name: adminUser.last_name,
        email: adminUser.email,
        password_hash: hashedPassword,
        phone: adminUser.phone || null,
        address: adminUser.address || null,
        city: adminUser.city || null,
        post_code: adminUser.post_code || null,
        country: adminUser.country || null,
        region: adminUser.region || null,
        role: adminUser.role
      };

      console.log(`Inserting admin user: ${adminUser.email}`);
      const insertedAdmin = await db.insert(schema.users).values(userToInsert).returning();
      results.adminUser = {
        ...insertedAdmin[0],
        password: adminUser.password // Include plain password for testing
      };
      delete results.adminUser.password_hash;

      results.steps[2].status = 'completed';
    } catch (error) {
      console.error('Error creating admin user:', error);
      results.steps[2].status = 'failed';
      results.steps[2].error = error.message;
      throw error;
    }

    // Step 4: Create regular user
    console.log('Creating regular user...');
    results.steps.push({ name: 'Create Regular User', status: 'in_progress' });
    try {
      const regularUser = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '01712345678', // Bangladesh format phone number
        address: '123 Test St',
        city: 'Dhaka',
        post_code: '1000',
        country: 'Bangladesh',
        region: 'Dhaka Division',
        role: 'customer'
      };

      // Hash the password
      const hashedPassword = await bcrypt.hash(regularUser.password, 10);

      // Create user object with hashed password
      const userToInsert = {
        first_name: regularUser.first_name,
        last_name: regularUser.last_name,
        email: regularUser.email,
        password_hash: hashedPassword,
        phone: regularUser.phone || null,
        address: regularUser.address || null,
        city: regularUser.city || null,
        post_code: regularUser.post_code || null,
        country: regularUser.country || null,
        region: regularUser.region || null,
        role: regularUser.role
      };

      console.log(`Inserting regular user: ${regularUser.email}`);
      const insertedUser = await db.insert(schema.users).values(userToInsert).returning();
      results.regularUser = {
        ...insertedUser[0],
        password: regularUser.password // Include plain password for testing
      };
      delete results.regularUser.password_hash;

      results.steps[3].status = 'completed';
    } catch (error) {
      console.error('Error creating regular user:', error);
      results.steps[3].status = 'failed';
      results.steps[3].error = error.message;
      throw error;
    }

    // Step 5: Create categories
    console.log('Creating categories...');
    results.steps.push({ name: 'Create Categories', status: 'in_progress' });
    try {
      const categories = [
        { name: 'Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=60' },
        { name: 'Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&auto=format&fit=crop&q=60' },
        { name: 'Dairy', slug: 'dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format&fit=crop&q=60' }
      ];

      for (const category of categories) {
        await db.insert(schema.categories).values(category);
      }

      results.steps[4].status = 'completed';
    } catch (error) {
      console.error('Error creating categories:', error);
      results.steps[4].status = 'failed';
      results.steps[4].error = error.message;
      throw error;
    }

    // Step 6: Create products
    console.log('Creating products...');
    results.steps.push({ name: 'Create Products', status: 'in_progress' });
    try {
      const products = [
        { name: 'Organic Bananas', sku: 'FRUIT-001', category_id: 1, price: 2.99, stock: 150, weight: 0.8, description: 'Fresh organic bananas from local farms.', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60' },
        { name: 'Fresh Strawberries', sku: 'FRUIT-002', category_id: 1, price: 4.99, stock: 100, weight: 0.3, description: 'Sweet and juicy strawberries, perfect for desserts.', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=60' },
        { name: 'Organic Spinach', sku: 'VEG-001', category_id: 2, price: 1.99, stock: 80, weight: 0.2, description: 'Fresh organic spinach, rich in iron and vitamins.', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60' },
        { name: 'Fresh Milk', sku: 'DAIRY-001', category_id: 3, price: 3.49, stock: 50, weight: 1.0, description: 'Fresh whole milk from local dairy farms.', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60' }
      ];

      for (const product of products) {
        const insertedProduct = await db.insert(schema.products).values(product).returning();
        results.products.push(insertedProduct[0]);
      }

      results.steps[5].status = 'completed';
    } catch (error) {
      console.error('Error creating products:', error);
      results.steps[5].status = 'failed';
      results.steps[5].error = error.message;
      throw error;
    }

    // Step 7: Create order
    console.log('Creating order...');
    results.steps.push({ name: 'Create Order', status: 'in_progress' });
    try {
      // Reset the sequence for the orders table to avoid primary key conflicts
      await resetSequence('orders');

      // Calculate order total
      const orderItems = [
        { product_id: 1, quantity: 2, price: 2.99 },
        { product_id: 2, quantity: 1, price: 4.99 },
        { product_id: 4, quantity: 1, price: 3.49 }
      ];

      const orderTotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      // Create order
      const orderData = {
        user_id: results.regularUser.id,
        status: 'pending',
        total: orderTotal,
        shipping_address: results.regularUser.address,
        shipping_city: results.regularUser.city,
        shipping_post_code: results.regularUser.post_code,
        shipping_phone: results.regularUser.phone,
        shipping_area: 'Gulshan',
        shipping_landmark: 'Near City Park',
        shipping_instructions: 'Please call before delivery',
        created_at: new Date(),
        updated_at: new Date()
      };

      const insertedOrder = await db.insert(schema.orders).values(orderData).returning();
      results.order = insertedOrder[0];

      // Reset the sequence for the order_items table to avoid primary key conflicts
      await resetSequence('order_items');

      // Create order items
      for (const item of orderItems) {
        const orderItemData = {
          order_id: results.order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        };

        const insertedOrderItem = await db.insert(schema.orderItems).values(orderItemData).returning();
        results.orderItems.push(insertedOrderItem[0]);
      }

      // Step 8: Create courier order
      console.log('Creating courier order...');
      results.steps.push({ name: 'Create Courier Order', status: 'in_progress' });
      try {
        // Automatically create a courier order with Pathao
        console.log(`Creating automatic courier order for order ${results.order.id}`);
        const courierResult = await createAutomaticCourierOrder(results.order.id);

        if (courierResult) {
          console.log(`Courier order created successfully for order ${results.order.id}`, {
            consignment_id: courierResult.consignment_id
          });
          results.courier = courierResult;
          results.steps[7].status = 'completed';
        } else {
          console.error(`Failed to create courier order for order ${results.order.id}`);
          results.steps[7].status = 'failed';
          results.steps[7].error = 'Failed to create courier order';
          // Continue anyway, as we still want to complete the process
        }
      } catch (courierError) {
        console.error('Error creating courier order:', courierError);
        results.steps[7].status = 'failed';
        results.steps[7].error = courierError.message;
        // Continue anyway, as we still want to complete the process
      }

      results.steps[6].status = 'completed';
    } catch (error) {
      console.error('Error creating order:', error);
      results.steps[6].status = 'failed';
      results.steps[6].error = error.message;
      throw error;
    }

    console.log('Database reset and order creation completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database reset and order creation completed successfully!',
      results
    });
  } catch (error) {
    console.error('Error in reset and order creation process:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete process: ' + error.message },
      { status: 500 }
    );
  }
}
