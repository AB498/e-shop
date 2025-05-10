#!/usr/bin/env node

/**
 * Add Promotions Script
 * 
 * This script adds sample promotions to the database.
 * 
 * Usage:
 *   node scripts/add-promotions.js
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

async function addPromotions() {
  try {
    console.log('Starting to add promotions...');
    
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
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `);
        console.log('Promotions table created successfully.');
      } else {
        console.log('Promotions table already exists.');
      }
    } catch (error) {
      console.error('Error checking/creating promotions table:', error);
      throw error;
    }
    
    // Check if there are already promotions in the database
    const existingPromotions = await db.select().from(promotions);
    console.log(`Found ${existingPromotions.length} existing promotions.`);
    
    if (existingPromotions.length > 0) {
      console.log('Promotions already exist in the database. Skipping insertion.');
      console.log('If you want to add more promotions, please modify this script.');
      return;
    }
    
    // Insert promotions
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
      });
      
      console.log(`Added promotion: ${promotion.title}`);
    }
    
    console.log('All promotions added successfully!');
    
    // Verify promotions were added
    const addedPromotions = await db.select().from(promotions);
    console.log(`Verified ${addedPromotions.length} promotions in the database.`);
    
  } catch (error) {
    console.error('Error adding promotions:', error);
  } finally {
    // Close the database connection
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the function
addPromotions();
