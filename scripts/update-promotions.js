#!/usr/bin/env node

/**
 * Update Promotions Script
 * 
 * This script updates the promotions in the database with the latest seed data.
 * 
 * Usage:
 *   node scripts/update-promotions.js
 */

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import promotionsSeed from './seed/promotions-seed.js';

// Load environment variables
dotenv.config();

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for Supabase
  }
});

const db = drizzle(pool);

// Import schema
import { promotions } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

async function updatePromotions() {
  try {
    console.log('Starting to update promotions...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }
    
    // Test database connection
    try {
      console.log('Testing database connection...');
      const result = await pool.query('SELECT NOW() as current_time');
      console.log(`Database connection successful! Server time: ${result.rows[0].current_time}`);
    } catch (error) {
      console.error('Database connection failed!');
      console.error('Error details:', error.message);
      throw new Error('Failed to connect to the database.');
    }
    
    // Check if promotions table exists
    try {
      console.log('Checking if promotions table exists...');
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'promotions'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.log('Promotions table does not exist. Creating it...');
        await pool.query(`
          CREATE TABLE promotions (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT NOT NULL,
            link_url TEXT,
            type TEXT DEFAULT 'banner' NOT NULL,
            position TEXT DEFAULT 'home',
            start_date TIMESTAMP,
            end_date TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE,
            priority INTEGER DEFAULT 0,
            discount TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `);
        console.log('Promotions table created successfully.');
      } else {
        console.log('Promotions table already exists.');
        
        // Check if discount column exists
        const columnCheck = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'promotions'
            AND column_name = 'discount'
          );
        `);
        
        if (!columnCheck.rows[0].exists) {
          console.log('Adding discount column to promotions table...');
          await pool.query(`
            ALTER TABLE promotions
            ADD COLUMN discount TEXT;
          `);
          console.log('Discount column added successfully.');
        }
      }
    } catch (error) {
      console.error('Error checking/creating promotions table:', error);
      throw error;
    }
    
    // Get existing promotions
    const existingPromotions = await db.select().from(promotions);
    console.log(`Found ${existingPromotions.length} existing promotions.`);
    
    // Clear existing promotions
    console.log('Clearing existing promotions...');
    await db.delete(promotions);
    console.log('Existing promotions cleared.');
    
    // Insert new promotions
    console.log(`Adding ${promotionsSeed.length} promotions...`);
    
    for (const promotion of promotionsSeed) {
      await db.insert(promotions).values({
        title: promotion.title,
        description: promotion.description || null,
        image_url: promotion.image_url,
        link_url: promotion.link_url || null,
        type: promotion.type || 'banner',
        position: promotion.position || 'home',
        start_date: promotion.start_date ? new Date(promotion.start_date) : null,
        end_date: promotion.end_date ? new Date(promotion.end_date) : null,
        is_active: promotion.is_active !== undefined ? promotion.is_active : true,
        priority: promotion.priority || 0,
        discount: promotion.discount || null,
      });
      
      console.log(`Added promotion: ${promotion.title}`);
    }
    
    console.log('All promotions updated successfully!');
    
    // Verify promotions were added
    const updatedPromotions = await db.select().from(promotions);
    console.log(`Verified ${updatedPromotions.length} promotions in the database.`);
    
    // Check weekly deals
    const weeklyDeals = updatedPromotions.filter(p => p.type === 'deal' && p.position === 'home');
    console.log(`Found ${weeklyDeals.length} weekly deals for home position.`);
    
  } catch (error) {
    console.error('Error updating promotions:', error);
  } finally {
    // Close the database connection
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the function
updatePromotions();
