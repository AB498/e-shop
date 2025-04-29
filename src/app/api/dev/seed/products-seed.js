// Expanded product seed data with Unsplash images
const productsSeed = [
  // Fruits (Category 1)
  { id: 1, name: 'Organic Bananas', sku: 'FRUIT-001', category_id: 1, price: 2.99, stock: 150, description: 'Fresh organic bananas from local farms.', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Fresh Strawberries', sku: 'FRUIT-002', category_id: 1, price: 4.99, stock: 100, description: 'Sweet and juicy strawberries, perfect for desserts.', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Avocado', sku: 'FRUIT-003', category_id: 1, price: 1.99, stock: 75, description: 'Ripe avocados, ready to eat.', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60' },
  { id: 11, name: 'Red Apples', sku: 'FRUIT-004', category_id: 1, price: 3.49, stock: 200, description: 'Crisp and sweet red apples.', image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500&auto=format&fit=crop&q=60' },
  { id: 12, name: 'Oranges', sku: 'FRUIT-005', category_id: 1, price: 4.29, stock: 180, description: 'Juicy oranges rich in vitamin C.', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&auto=format&fit=crop&q=60' },
  { id: 13, name: 'Blueberries', sku: 'FRUIT-006', category_id: 1, price: 5.99, stock: 90, description: 'Fresh blueberries packed with antioxidants.', image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&auto=format&fit=crop&q=60' },

  // Vegetables (Category 2)
  { id: 14, name: 'Broccoli', sku: 'VEG-001', category_id: 2, price: 2.49, stock: 120, description: 'Fresh broccoli florets.', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500&auto=format&fit=crop&q=60' },
  { id: 15, name: 'Carrots', sku: 'VEG-002', category_id: 2, price: 1.99, stock: 150, description: 'Organic carrots, perfect for snacking or cooking.', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60' },
  { id: 16, name: 'Spinach', sku: 'VEG-003', category_id: 2, price: 3.49, stock: 100, description: 'Fresh spinach leaves.', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60' },
  { id: 17, name: 'Bell Peppers', sku: 'VEG-004', category_id: 2, price: 2.99, stock: 110, description: 'Colorful bell peppers.', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=60' },
  { id: 18, name: 'Tomatoes', sku: 'VEG-005', category_id: 2, price: 3.29, stock: 130, description: 'Ripe tomatoes for salads and cooking.', image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&auto=format&fit=crop&q=60' },

  // Dairy (Category 3)
  { id: 4, name: 'Whole Milk', sku: 'DAIRY-001', category_id: 3, price: 3.49, stock: 50, description: 'Fresh whole milk from local dairy farms.', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Greek Yogurt', sku: 'DAIRY-002', category_id: 3, price: 5.99, stock: 40, description: 'Creamy Greek yogurt, high in protein.', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60' },
  { id: 19, name: 'Cheddar Cheese', sku: 'DAIRY-003', category_id: 3, price: 4.99, stock: 60, description: 'Sharp cheddar cheese.', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&auto=format&fit=crop&q=60' },
  { id: 20, name: 'Butter', sku: 'DAIRY-004', category_id: 3, price: 3.99, stock: 70, description: 'Creamy butter made from fresh cream.', image: 'https://images.unsplash.com/photo-1589985270958-bf087b2d8ed7?w=500&auto=format&fit=crop&q=60' },
  { id: 21, name: 'Cream Cheese', sku: 'DAIRY-005', category_id: 3, price: 2.99, stock: 55, description: 'Smooth cream cheese.', image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&auto=format&fit=crop&q=60' },

  // Bakery (Category 4)
  { id: 6, name: 'Sourdough Bread', sku: 'BAKERY-001', category_id: 4, price: 4.49, stock: 30, description: 'Freshly baked sourdough bread.', image: 'https://images.unsplash.com/photo-1585478259715-1c093a7b70d3?w=500&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Chocolate Croissant', sku: 'BAKERY-002', category_id: 4, price: 2.99, stock: 25, description: 'Buttery croissant with chocolate filling.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
  { id: 22, name: 'Baguette', sku: 'BAKERY-003', category_id: 4, price: 3.49, stock: 35, description: 'Traditional French baguette.', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=500&auto=format&fit=crop&q=60' },
  { id: 23, name: 'Cinnamon Rolls', sku: 'BAKERY-004', category_id: 4, price: 5.99, stock: 20, description: 'Sweet cinnamon rolls with icing.', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&auto=format&fit=crop&q=60' },

  // Beverages (Category 5)
  { id: 8, name: 'Sparkling Water', sku: 'BEVERAGE-001', category_id: 5, price: 1.49, stock: 100, description: 'Refreshing sparkling water.', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop&q=60' },
  { id: 9, name: 'Orange Juice', sku: 'BEVERAGE-002', category_id: 5, price: 3.99, stock: 60, description: 'Freshly squeezed orange juice.', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=60' },
  { id: 24, name: 'Cold Brew Coffee', sku: 'BEVERAGE-003', category_id: 5, price: 4.99, stock: 40, description: 'Smooth cold brew coffee.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60' },
  { id: 25, name: 'Green Tea', sku: 'BEVERAGE-004', category_id: 5, price: 3.49, stock: 50, description: 'Organic green tea bags.', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&auto=format&fit=crop&q=60' },

  // Meat (Category 6)
  { id: 26, name: 'Ground Beef', sku: 'MEAT-001', category_id: 6, price: 8.99, stock: 30, description: 'Lean ground beef.', image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=500&auto=format&fit=crop&q=60' },
  { id: 27, name: 'Chicken Breast', sku: 'MEAT-002', category_id: 6, price: 7.99, stock: 40, description: 'Boneless, skinless chicken breasts.', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60' },
  { id: 28, name: 'Pork Chops', sku: 'MEAT-003', category_id: 6, price: 9.99, stock: 25, description: 'Tender pork chops.', image: 'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=500&auto=format&fit=crop&q=60' },

  // Seafood (Category 7)
  { id: 10, name: 'Salmon Fillet', sku: 'SEAFOOD-001', category_id: 7, price: 12.99, stock: 20, description: 'Fresh salmon fillet, perfect for grilling.', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60' },
  { id: 29, name: 'Shrimp', sku: 'SEAFOOD-002', category_id: 7, price: 14.99, stock: 25, description: 'Large shrimp, peeled and deveined.', image: 'https://images.unsplash.com/photo-1565680018160-64b74e7ff1d7?w=500&auto=format&fit=crop&q=60' },
  { id: 30, name: 'Tuna Steak', sku: 'SEAFOOD-003', category_id: 7, price: 15.99, stock: 15, description: 'Fresh tuna steaks.', image: 'https://images.unsplash.com/photo-1553659971-f01207815908?w=500&auto=format&fit=crop&q=60' },

  // Pantry (Category 8)
  { id: 31, name: 'Olive Oil', sku: 'PANTRY-001', category_id: 8, price: 9.99, stock: 40, description: 'Extra virgin olive oil.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60' },
  { id: 32, name: 'Pasta', sku: 'PANTRY-002', category_id: 8, price: 2.49, stock: 80, description: 'Italian spaghetti pasta.', image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=500&auto=format&fit=crop&q=60' },
  { id: 33, name: 'Rice', sku: 'PANTRY-003', category_id: 8, price: 3.99, stock: 70, description: 'Long grain white rice.', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=60' },
  { id: 34, name: 'Tomato Sauce', sku: 'PANTRY-004', category_id: 8, price: 2.99, stock: 60, description: 'Organic tomato sauce.', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=60' },

  // Snacks (Category 9)
  { id: 35, name: 'Potato Chips', sku: 'SNACK-001', category_id: 9, price: 3.49, stock: 90, description: 'Crispy potato chips.', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60' },
  { id: 36, name: 'Chocolate Bar', sku: 'SNACK-002', category_id: 9, price: 2.99, stock: 100, description: 'Milk chocolate bar.', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&auto=format&fit=crop&q=60' },
  { id: 37, name: 'Mixed Nuts', sku: 'SNACK-003', category_id: 9, price: 6.99, stock: 50, description: 'Assorted roasted nuts.', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60' },

  // Health Foods (Category 10)
  { id: 38, name: 'Protein Powder', sku: 'HEALTH-001', category_id: 10, price: 24.99, stock: 30, description: 'Whey protein powder.', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&auto=format&fit=crop&q=60' },
  { id: 39, name: 'Chia Seeds', sku: 'HEALTH-002', category_id: 10, price: 7.99, stock: 40, description: 'Organic chia seeds.', image: 'https://images.unsplash.com/photo-1541990202460-a0a9a3b6e4e0?w=500&auto=format&fit=crop&q=60' },
  { id: 40, name: 'Granola', sku: 'HEALTH-003', category_id: 10, price: 5.99, stock: 45, description: 'Organic granola with nuts and dried fruits.', image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=500&auto=format&fit=crop&q=60' },

  // Beauty (Category 13)
  { id: 41, name: 'Facial Cleanser', sku: 'BEAUTY-001', category_id: 13, price: 12.99, stock: 45, description: 'Gentle facial cleanser for all skin types.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60' },
  { id: 42, name: 'Moisturizer', sku: 'BEAUTY-002', category_id: 13, price: 18.99, stock: 35, description: 'Hydrating facial moisturizer with SPF 30.', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500&auto=format&fit=crop&q=60' },
  { id: 43, name: 'Shampoo', sku: 'BEAUTY-003', category_id: 13, price: 9.99, stock: 60, description: 'Nourishing shampoo for all hair types.', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60' },
  { id: 44, name: 'Conditioner', sku: 'BEAUTY-004', category_id: 13, price: 9.99, stock: 60, description: 'Hydrating conditioner for smooth, silky hair.', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60' },
  { id: 45, name: 'Body Lotion', sku: 'BEAUTY-005', category_id: 13, price: 11.99, stock: 50, description: 'Moisturizing body lotion for soft, smooth skin.', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=60' },

  // Skincare (Category 14)
  { id: 46, name: 'Face Serum', sku: 'SKIN-001', category_id: 14, price: 24.99, stock: 30, description: 'Anti-aging serum with vitamin C and hyaluronic acid.', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60' },
  { id: 47, name: 'Face Mask', sku: 'SKIN-002', category_id: 14, price: 3.99, stock: 75, description: 'Hydrating sheet mask for glowing skin.', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&auto=format&fit=crop&q=60' },
  { id: 48, name: 'Eye Cream', sku: 'SKIN-003', category_id: 14, price: 19.99, stock: 25, description: 'Rejuvenating eye cream to reduce dark circles and puffiness.', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&auto=format&fit=crop&q=60' },
  { id: 49, name: 'Toner', sku: 'SKIN-004', category_id: 14, price: 14.99, stock: 40, description: 'Alcohol-free toner to balance skin pH.', image: 'https://images.unsplash.com/photo-1616683693502-1ef7ac6a2b8a?w=500&auto=format&fit=crop&q=60' },
  { id: 50, name: 'Sunscreen', sku: 'SKIN-005', category_id: 14, price: 15.99, stock: 55, description: 'Broad-spectrum SPF 50 sunscreen for face and body.', image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=500&auto=format&fit=crop&q=60' },

  // Makeup (Category 15)
  { id: 51, name: 'Foundation', sku: 'MAKEUP-001', category_id: 15, price: 22.99, stock: 30, description: 'Long-wearing liquid foundation with medium coverage.', image: 'https://images.unsplash.com/photo-1631214524020-3aae896f59e9?w=500&auto=format&fit=crop&q=60' },
  { id: 52, name: 'Mascara', sku: 'MAKEUP-002', category_id: 15, price: 9.99, stock: 45, description: 'Volumizing and lengthening mascara for dramatic lashes.', image: 'https://images.unsplash.com/photo-1631214499983-1e8ad3a0bb28?w=500&auto=format&fit=crop&q=60' },
  { id: 53, name: 'Lipstick', sku: 'MAKEUP-003', category_id: 15, price: 12.99, stock: 50, description: 'Creamy matte lipstick in a classic red shade.', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60' },
  { id: 54, name: 'Eyeshadow Palette', sku: 'MAKEUP-004', category_id: 15, price: 29.99, stock: 25, description: 'Versatile eyeshadow palette with 12 neutral shades.', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60' },
  { id: 55, name: 'Blush', sku: 'MAKEUP-005', category_id: 15, price: 14.99, stock: 35, description: 'Silky powder blush for a natural flush of color.', image: 'https://images.unsplash.com/photo-1631214499984-31c0b2d82cb3?w=500&auto=format&fit=crop&q=60' }
];

export default productsSeed;
