#!/usr/bin/env node

/**
 * Check Promotions Script
 * 
 * This script checks the promotions in the database.
 * 
 * Usage:
 *   node scripts/check-promotions.js
 */

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

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

async function checkPromotions() {
  try {
    console.log('Checking promotions in the database...');
    
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
        console.log('Promotions table does not exist.');
        return;
      } else {
        console.log('Promotions table exists.');
      }
    } catch (error) {
      console.error('Error checking promotions table:', error);
      throw error;
    }
    
    // Get all promotions
    const allPromotions = await db.select().from(promotions);
    console.log(`Found ${allPromotions.length} promotions in the database.`);
    
    if (allPromotions.length === 0) {
      console.log('No promotions found in the database.');
      return;
    }
    
    // Display promotions
    console.log('\nPromotions:');
    console.log('==========');
    
    allPromotions.forEach((promotion, index) => {
      console.log(`\n[${index + 1}] ${promotion.title}`);
      console.log(`ID: ${promotion.id}`);
      console.log(`Type: ${promotion.type}`);
      console.log(`Position: ${promotion.position}`);
      console.log(`Active: ${promotion.is_active ? 'Yes' : 'No'}`);
      console.log(`Priority: ${promotion.priority}`);
      console.log(`Image URL: ${promotion.image_url}`);
      console.log(`Link URL: ${promotion.link_url || 'None'}`);
      console.log(`Description: ${promotion.description || 'None'}`);
      console.log(`Start Date: ${promotion.start_date ? new Date(promotion.start_date).toLocaleString() : 'None'}`);
      console.log(`End Date: ${promotion.end_date ? new Date(promotion.end_date).toLocaleString() : 'None'}`);
      console.log(`Created At: ${new Date(promotion.created_at).toLocaleString()}`);
      console.log(`Updated At: ${new Date(promotion.updated_at).toLocaleString()}`);
    });
    
    // Check carousel promotions
    const carouselPromotions = allPromotions.filter(p => p.type === 'carousel');
    console.log(`\nFound ${carouselPromotions.length} carousel promotions.`);
    
    // Check home position promotions
    const homePromotions = allPromotions.filter(p => p.position === 'home');
    console.log(`Found ${homePromotions.length} home position promotions.`);
    
    // Check carousel + home promotions
    const carouselHomePromotions = allPromotions.filter(p => p.type === 'carousel' && p.position === 'home');
    console.log(`Found ${carouselHomePromotions.length} carousel promotions for home position.`);
    
    // Check active promotions
    const activePromotions = allPromotions.filter(p => p.is_active);
    console.log(`Found ${activePromotions.length} active promotions.`);
    
    // Check active carousel + home promotions
    const activeCarouselHomePromotions = allPromotions.filter(
      p => p.is_active && p.type === 'carousel' && p.position === 'home'
    );
    console.log(`Found ${activeCarouselHomePromotions.length} active carousel promotions for home position.`);
    
  } catch (error) {
    console.error('Error checking promotions:', error);
  } finally {
    // Close the database connection
    await pool.end();
    console.log('\nDatabase connection closed.');
  }
}

// Run the function
checkPromotions();
