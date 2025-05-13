/**
 * Contact Messages Seed Data
 *
 * This file contains sample contact messages for the database.
 */

const contactMessagesSeed = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 555-123-4567',
    message: 'I recently ordered some Thai spices from your store and I\'m very impressed with the quality. Do you have any recommendations for authentic Thai curry recipes?',
    status: 'new',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 555-987-6543',
    message: 'Hello, I\'m planning a Thai-themed dinner party next month and would like to know if you offer any special discounts for bulk orders? I need various ingredients and cookware.',
    status: 'read',
    admin_notes: 'Responded via email about our bulk order discount program.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)  // 4 days ago
  },
  {
    name: 'Michael Wong',
    email: 'michael.w@example.com',
    phone: '+1 555-456-7890',
    message: 'I received my order #TBS-10045 yesterday but one of the items was damaged during shipping. The glass jar of red curry paste was cracked. Can I get a replacement?',
    status: 'replied',
    admin_notes: 'Replacement sent on 2023-06-15. Tracking number provided to customer.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)  // 6 days ago
  },
  {
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    phone: '+1 555-789-0123',
    message: 'Do you ship internationally? I\'m currently in Canada and would love to order some authentic Thai ingredients that are hard to find here.',
    status: 'archived',
    admin_notes: 'Informed about international shipping policies and rates to Canada.',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    updated_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)  // 13 days ago
  },
  {
    name: 'David Patel',
    email: 'david.p@example.com',
    phone: '+1 555-234-5678',
    message: 'I\'m interested in learning more about Thai cooking. Do you offer any cooking classes or workshops? Or can you recommend any good resources for beginners?',
    status: 'new',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)  // 1 day ago
  }
];

export default contactMessagesSeed;
