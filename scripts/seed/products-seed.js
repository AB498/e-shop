// Product seed data mapped to our 8 categories from images/categories
const productsSeed = [
  // Grooming (Category 1)
  { id: 1, name: 'Men\'s Shaving Kit', sku: 'GROOM-001', category_id: 1, price: 29.99, stock: 50, weight: 0.8, description: 'Complete shaving kit for men with razor and shaving cream.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Beard Oil', sku: 'GROOM-002', category_id: 1, price: 14.99, stock: 75, description: 'Nourishing beard oil for soft and manageable facial hair.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Electric Trimmer', sku: 'GROOM-003', category_id: 1, price: 39.99, stock: 40, description: 'Precision electric trimmer for beard and hair.', image: 'https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Aftershave Balm', sku: 'GROOM-004', category_id: 1, price: 12.99, stock: 60, description: 'Soothing aftershave balm to reduce irritation.', image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=500&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Men\'s Face Wash', sku: 'GROOM-005', category_id: 1, price: 9.99, stock: 80, description: 'Deep cleansing face wash for men.', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&auto=format&fit=crop&q=60' },

  // Hair Care (Category 2)
  { id: 6, name: 'Argan Oil Shampoo', sku: 'HAIR-001', category_id: 2, price: 12.99, stock: 70, description: 'Nourishing shampoo with argan oil for all hair types.', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Hydrating Conditioner', sku: 'HAIR-002', category_id: 2, price: 12.99, stock: 65, description: 'Deep hydrating conditioner for smooth, silky hair.', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60' },
  { id: 8, name: 'Hair Serum', sku: 'HAIR-003', category_id: 2, price: 16.99, stock: 55, description: 'Anti-frizz hair serum for smooth, shiny hair.', image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=500&auto=format&fit=crop&q=60' },
  { id: 9, name: 'Hair Mask', sku: 'HAIR-004', category_id: 2, price: 18.99, stock: 45, description: 'Intensive repair hair mask for damaged hair.', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60' },
  { id: 10, name: 'Hair Styling Gel', sku: 'HAIR-005', category_id: 2, price: 8.99, stock: 60, description: 'Strong hold styling gel for all hair types.', image: 'https://images.unsplash.com/photo-1626015449568-e887bd02a2f4?w=500&auto=format&fit=crop&q=60' },

  // Health and Beauty (Category 3)
  { id: 11, name: 'Facial Cleanser', sku: 'HEALTH-001', category_id: 3, price: 12.99, stock: 65, description: 'Gentle facial cleanser for all skin types.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60' },
  { id: 12, name: 'Vitamin C Serum', sku: 'HEALTH-002', category_id: 3, price: 24.99, stock: 40, description: 'Brightening vitamin C serum for radiant skin.', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60' },
  { id: 13, name: 'Moisturizer', sku: 'HEALTH-003', category_id: 3, price: 18.99, stock: 55, description: 'Hydrating facial moisturizer with SPF 30.', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop&q=60' },
  { id: 14, name: 'Body Lotion', sku: 'HEALTH-004', category_id: 3, price: 11.99, stock: 70, description: 'Moisturizing body lotion for soft, smooth skin.', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60' },
  { id: 15, name: 'Multivitamin', sku: 'HEALTH-005', category_id: 3, price: 19.99, stock: 85, description: 'Daily multivitamin for overall health and wellness.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60' },

  // Hot Offers (Category 4)
  { id: 16, name: 'Limited Edition Gift Set', sku: 'OFFER-001', category_id: 4, price: 49.99, stock: 30, description: 'Special limited edition beauty gift set at 40% off.', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60' },
  { id: 17, name: 'Skincare Bundle', sku: 'OFFER-002', category_id: 4, price: 59.99, stock: 25, description: 'Complete skincare routine bundle at special price.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60' },
  { id: 18, name: 'Buy 1 Get 1 Free Masks', sku: 'OFFER-003', category_id: 4, price: 9.99, stock: 50, description: 'Buy one face mask, get one free - limited time offer.', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&auto=format&fit=crop&q=60' },
  { id: 19, name: 'Clearance Perfume', sku: 'OFFER-004', category_id: 4, price: 29.99, stock: 15, description: 'Luxury perfume at clearance price - 60% off.', image: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60' },
  { id: 20, name: 'Flash Sale Makeup Kit', sku: 'OFFER-005', category_id: 4, price: 24.99, stock: 20, description: '24-hour flash sale on complete makeup kit.', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60' },

  // Kids and Baby (Category 5)
  { id: 21, name: 'Baby Shampoo', sku: 'KIDS-001', category_id: 5, price: 8.99, stock: 60, description: 'Gentle tear-free baby shampoo.', image: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60' },
  { id: 22, name: 'Baby Lotion', sku: 'KIDS-002', category_id: 5, price: 7.99, stock: 55, description: 'Gentle moisturizing lotion for baby\'s sensitive skin.', image: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60' },
  { id: 23, name: 'Kids Bubble Bath', sku: 'KIDS-003', category_id: 5, price: 6.99, stock: 45, description: 'Fun bubble bath for kids with no harsh chemicals.', image: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60' },
  { id: 24, name: 'Baby Powder', sku: 'KIDS-004', category_id: 5, price: 5.99, stock: 70, description: 'Talc-free baby powder for sensitive skin.', image: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60' },
  { id: 25, name: 'Kids Detangler Spray', sku: 'KIDS-005', category_id: 5, price: 7.49, stock: 40, description: 'No-tears detangling spray for kids hair.', image: 'https://images.unsplash.com/photo-1594918195019-f6fddfc36b78?w=500&auto=format&fit=crop&q=60' },

  // Makeup (Category 6)
  { id: 26, name: 'Foundation', sku: 'MAKEUP-001', category_id: 6, price: 22.99, stock: 40, description: 'Long-wearing liquid foundation with medium coverage.', image: 'https://images.unsplash.com/photo-1631214524020-3aae896f59e9?w=500&auto=format&fit=crop&q=60' },
  { id: 27, name: 'Mascara', sku: 'MAKEUP-002', category_id: 6, price: 9.99, stock: 55, description: 'Volumizing and lengthening mascara for dramatic lashes.', image: 'https://images.unsplash.com/photo-1631214499983-1e8ad3a0bb28?w=500&auto=format&fit=crop&q=60' },
  { id: 28, name: 'Lipstick', sku: 'MAKEUP-003', category_id: 6, price: 12.99, stock: 60, description: 'Creamy matte lipstick in a classic red shade.', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60' },
  { id: 29, name: 'Eyeshadow Palette', sku: 'MAKEUP-004', category_id: 6, price: 29.99, stock: 35, description: 'Versatile eyeshadow palette with 12 neutral shades.', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60' },
  { id: 30, name: 'Blush', sku: 'MAKEUP-005', category_id: 6, price: 14.99, stock: 45, description: 'Silky powder blush for a natural flush of color.', image: 'https://images.unsplash.com/photo-1631214499984-31c0b2d82cb3?w=500&auto=format&fit=crop&q=60' },

  // Perfume (Category 7)
  { id: 31, name: 'Floral Perfume', sku: 'PERFUME-001', category_id: 7, price: 59.99, stock: 30, description: 'Elegant floral perfume with notes of jasmine and rose.', image: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60' },
  { id: 32, name: 'Citrus Cologne', sku: 'PERFUME-002', category_id: 7, price: 49.99, stock: 25, description: 'Refreshing citrus cologne for men.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60' },
  { id: 33, name: 'Woody Fragrance', sku: 'PERFUME-003', category_id: 7, price: 64.99, stock: 20, description: 'Sophisticated woody fragrance with amber and sandalwood.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60' },
  { id: 34, name: 'Oriental Perfume', sku: 'PERFUME-004', category_id: 7, price: 69.99, stock: 15, description: 'Exotic oriental perfume with spicy and sweet notes.', image: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60' },
  { id: 35, name: 'Fresh Eau de Toilette', sku: 'PERFUME-005', category_id: 7, price: 39.99, stock: 35, description: 'Light and fresh eau de toilette for everyday wear.', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60' },

  // Top Brands (Category 8)
  { id: 36, name: 'Luxury Face Cream', sku: 'BRAND-001', category_id: 8, price: 89.99, stock: 20, description: 'Premium face cream from top luxury skincare brand.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60' },
  { id: 37, name: 'Designer Perfume', sku: 'BRAND-002', category_id: 8, price: 129.99, stock: 15, description: 'Signature scent from world-renowned fashion designer.', image: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c4d?w=500&auto=format&fit=crop&q=60' },
  { id: 38, name: 'Premium Makeup Set', sku: 'BRAND-003', category_id: 8, price: 149.99, stock: 10, description: 'Complete makeup collection from celebrity makeup artist brand.', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60' },
  { id: 39, name: 'Exclusive Hair Care Kit', sku: 'BRAND-004', category_id: 8, price: 99.99, stock: 25, description: 'Professional salon brand hair care set with shampoo, conditioner, and treatment.', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60' },
  { id: 40, name: 'Luxury Skincare Set', sku: 'BRAND-005', category_id: 8, price: 199.99, stock: 5, description: 'Complete luxury skincare regimen from top dermatologist brand.', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop&q=60' },

];

export default productsSeed;
