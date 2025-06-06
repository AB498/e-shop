import { pgTable, serial, text, timestamp, integer, decimal, boolean, json, jsonb, varchar, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core'

// Contact messages status enum
const contactMessageStatusEnum = pgEnum('contact_message_status', ['new', 'read', 'replied', 'archived'])

// Contact messages table
const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  status: contactMessageStatusEnum('status').default('new').notNull(),
  admin_notes: text('admin_notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

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
  display_order: integer('display_order').default(1).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Products table
const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  category_id: integer('category_id').references(() => categories.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).default('0.5'),
  description: text('description'),
  image: text('image'),
  // New product attributes
  sizes: jsonb('sizes'), // Array of available sizes
  colors: jsonb('colors'), // Array of available colors
  tags: jsonb('tags'), // Array of product tags
  type: text('type'), // Product type (e.g., "Thai Brand", "Organic")
  brand: text('brand'), // Brand name
  material: text('material'), // Material composition
  origin_country: text('origin_country'), // Country of origin
  mfg_date: text('mfg_date'), // Manufacturing date
  lifespan: text('lifespan'), // Product lifespan/expiry info
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
  payment_method: text('payment_method').default('sslcommerz').notNull(), // 'sslcommerz' or 'cod'
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
  discount_price: decimal('discount_price', { precision: 10, scale: 2 }),
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

// Store locations have been removed as they are now created from external provider pages

// Product images table
const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  url: text('url').notNull(),
  key: text('key').notNull(),
  alt_text: text('alt_text'),
  position: integer('position').default(0).notNull(),
  is_primary: boolean('is_primary').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Wishlist items table
const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

// Promotions table for banners and marketing content
const promotions = pgTable('promotions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  image_url: text('image_url').notNull(),
  link_url: text('link_url'),
  type: text('type').default('banner').notNull(), // 'banner', 'carousel', 'deal', etc.
  position: text('position').default('home'), // 'home', 'category', 'product', etc.
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  is_active: boolean('is_active').default(true),
  priority: integer('priority').default(0), // For ordering promotions
  discount: text('discount'), // Discount percentage for deals
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Product promotions junction table
const productPromotions = pgTable('product_promotions', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  promotion_id: integer('promotion_id').references(() => promotions.id).notNull(),
  discount_percentage: decimal('discount_percentage', { precision: 5, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Payment transactions table for SSLCommerz
const paymentTransactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => orders.id),
  transaction_id: text('transaction_id').notNull(),
  val_id: text('val_id'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(),
  currency: text('currency').notNull(),
  tran_date: timestamp('tran_date'),
  card_type: text('card_type'),
  card_no: text('card_no'),
  bank_tran_id: text('bank_tran_id'),
  card_issuer: text('card_issuer'),
  card_brand: text('card_brand'),
  card_issuer_country: text('card_issuer_country'),
  card_issuer_country_code: text('card_issuer_country_code'),
  store_amount: decimal('store_amount', { precision: 10, scale: 2 }),
  verify_sign: text('verify_sign'),
  verify_key: text('verify_key'),
  risk_level: text('risk_level'),
  risk_title: text('risk_title'),
  payment_method: text('payment_method'),
  gateway_url: text('gateway_url'),
  response_data: jsonb('response_data'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Settings table for system-wide configuration
const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Database backups table for tracking backup metadata
const databaseBackups = pgTable('database_backups', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull().unique(),
  s3_key: text('s3_key').notNull(),
  file_size: integer('file_size').notNull(), // Size in bytes
  backup_type: text('backup_type').default('full').notNull(), // 'full', 'incremental'
  status: text('status').default('completed').notNull(), // 'in_progress', 'completed', 'failed'
  created_by: text('created_by').default('system').notNull(), // 'system', 'admin'
  metadata: jsonb('metadata'), // Additional backup information
  created_at: timestamp('created_at').defaultNow(),
  completed_at: timestamp('completed_at'),
})

// Product reviews table
const productReviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => products.id).notNull(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  rating: decimal('rating', { precision: 2, scale: 1 }).notNull(),
  review_text: text('review_text'),
  title: text('title'),
  verified_purchase: boolean('verified_purchase').default(false),
  status: text('status').default('published').notNull(), // 'published', 'pending', 'rejected'
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    // Ensure a user can only review a product once
    userProductIdx: uniqueIndex('user_product_idx').on(table.user_id, table.product_id),
  }
})

export {
  files,
  users,
  categories,
  products,
  productImages,
  orders,
  orderItems,
  couriers,
  courierTracking,
  deliveryPersons,
  wishlistItems,
  promotions,
  productPromotions,
  paymentTransactions,
  settings,
  databaseBackups,
  contactMessages,
  productReviews,
  userRoleEnum,
  orderStatusEnum,
  contactMessageStatusEnum
}
