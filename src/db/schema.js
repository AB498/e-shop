const { pgTable, serial, text, timestamp, integer, decimal, boolean, json, varchar, pgEnum } = require('drizzle-orm/pg-core')

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
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash'),
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
  description: text('description'),
  image: text('image'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Order status enum
const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])

// Orders table
const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  status: orderStatusEnum('status').default('pending').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
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

module.exports = {
  files,
  users,
  categories,
  products,
  orders,
  orderItems,
  userRoleEnum,
  orderStatusEnum
}
