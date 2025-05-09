import { pgTable, serial, text, timestamp, integer, decimal, boolean, json, jsonb, varchar, pgEnum } from 'drizzle-orm/pg-core'

// Files table for storing uploaded files
const files = pgTable('files', {
  id: serial('id').primaryKey(),
  key: text('key').notNull(),
  url: text('url').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

// User roles enum
const userRoleEnum = pgEnum('user_role', ['admin', 'customer'])

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  post_code: text('post_code'),
  country: text('country'),
  region: text('region'),
  role: userRoleEnum('role').default('customer').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Categories table
const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Products table
const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull().unique(),
  category_id: integer('category_id').references(() => categories.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).default('0.5'),
  description: text('description'),
  image: text('image'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Order status enum
const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'in_transit', 'shipped', 'delivered', 'cancelled'])

// Couriers table
const couriers = pgTable('couriers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  courier_type: text('courier_type').default('external').notNull(), // 'internal' or 'external'
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Delivery persons table for internal delivery staff
const deliveryPersons = pgTable('delivery_persons', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  city: text('city'),
  area: text('area'),
  status: text('status').default('active').notNull(), // 'active', 'inactive', 'on_delivery'
  current_orders: integer('current_orders').default(0).notNull(),
  total_orders: integer('total_orders').default(0).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
  profile_image: text('profile_image'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Orders table
const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  status: orderStatusEnum('status').default('pending').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  courier_id: integer('courier_id').references(() => couriers.id),
  delivery_person_id: integer('delivery_person_id').references(() => deliveryPersons.id),
  courier_order_id: text('courier_order_id'),
  courier_tracking_id: text('courier_tracking_id'),
  courier_status: text('courier_status'),
  shipping_address: text('shipping_address'),
  shipping_city: text('shipping_city'),
  shipping_post_code: text('shipping_post_code'),
  shipping_phone: text('shipping_phone'),
  shipping_area: text('shipping_area'),
  shipping_landmark: text('shipping_landmark'),
  shipping_instructions: text('shipping_instructions'),
  delivery_otp: text('delivery_otp'),
  delivery_otp_verified: boolean('delivery_otp_verified').default(false),
  delivery_otp_sent_at: timestamp('delivery_otp_sent_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Order items table
const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => orders.id),
  product_id: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

// Courier tracking table
const courierTracking = pgTable('courier_tracking', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => orders.id),
  courier_id: integer('courier_id').references(() => couriers.id),
  tracking_id: text('tracking_id').notNull(),
  status: text('status'),
  details: text('details'),
  location: text('location'),
  timestamp: timestamp('timestamp').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
})

// Store locations table for courier pickups
const storeLocations = pgTable('store_locations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contact_name: text('contact_name').notNull(),
  contact_number: text('contact_number').notNull(),
  secondary_contact: text('secondary_contact'),
  address: text('address').notNull(),
  city_id: integer('city_id').notNull(),
  zone_id: integer('zone_id').notNull(),
  area_id: integer('area_id').notNull(),
  is_default: boolean('is_default').default(false),
  pathao_store_id: text('pathao_store_id'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

export {
  files,
  users,
  categories,
  products,
  orders,
  orderItems,
  couriers,
  courierTracking,
  storeLocations,
  deliveryPersons,
  userRoleEnum,
  orderStatusEnum
}
