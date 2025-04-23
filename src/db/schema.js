const { pgTable, serial, text, timestamp } = require('drizzle-orm/pg-core')

const files = pgTable('files', {
  id: serial('id').primaryKey(),
  key: text('key').notNull(),
  url: text('url').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

module.exports = { files }
