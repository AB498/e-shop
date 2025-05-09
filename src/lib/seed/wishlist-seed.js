import { db } from '@/lib/db';
import { wishlistItems, users, products } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Seed wishlist items for testing
 */
export async function seedWishlistItems() {
  try {
    console.log('Seeding wishlist items...');
    
    // Clear existing wishlist items
    await db.delete(wishlistItems);
    
    // Get all users
    const allUsers = await db.select().from(users);
    
    // Get all products
    const allProducts = await db.select().from(products);
    
    if (allUsers.length === 0 || allProducts.length === 0) {
      console.log('No users or products found. Skipping wishlist seeding.');
      return;
    }
    
    // Create wishlist items for each user
    const wishlistData = [];
    
    // For the first user (assuming it's a customer), add 3-5 random products to wishlist
    const firstUser = allUsers.find(user => user.role === 'customer') || allUsers[0];
    const numProducts = Math.floor(Math.random() * 3) + 3; // 3-5 products
    
    const shuffledProducts = [...allProducts].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, numProducts);
    
    for (const product of selectedProducts) {
      wishlistData.push({
        user_id: firstUser.id,
        product_id: product.id
      });
    }
    
    // Insert wishlist items
    if (wishlistData.length > 0) {
      await db.insert(wishlistItems).values(wishlistData);
      console.log(`Added ${wishlistData.length} items to ${firstUser.firstName}'s wishlist`);
    }
    
    console.log('Wishlist seeding completed successfully');
    return { success: true, message: `Seeded ${wishlistData.length} wishlist items` };
  } catch (error) {
    console.error('Error seeding wishlist items:', error);
    return { success: false, message: error.message };
  }
}
