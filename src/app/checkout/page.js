


import { db } from '@/lib/db';
import { settings } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import CheckoutClient from './SSLCommerzProvider';

export async function getSSLCommerzSetting() {
  try {
    // Fetch SSLCommerz setting server-side
    const sslcommerzSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'sslcommerz_enabled'))
      .limit(1);

    console.log('SSLCommerz setting from server:', sslcommerzSetting);

    if (sslcommerzSetting.length > 0) {
      return sslcommerzSetting[0].value === 'true';
    } else {
      // If setting doesn't exist, create it with default value 'true'
      console.log('SSLCommerz setting not found, creating it...');

      // Get the highest ID currently in the settings table
      const maxIdResult = await db
        .select({ maxId: sql`MAX(id)` })
        .from(settings);

      const nextId = maxIdResult[0]?.maxId ? Number(maxIdResult[0].maxId) + 1 : 1;

      // Create setting with explicit ID
      await db
        .insert(settings)
        .values({
          id: nextId,
          key: 'sslcommerz_enabled',
          value: 'true',
          description: 'Enable SSLCommerz payment gateway',
          created_at: new Date(),
          updated_at: new Date()
        });

      console.log(`Successfully created SSLCommerz setting with ID ${nextId}.`);
      return true;
    }
  } catch (error) {
    console.error('Error fetching SSLCommerz setting:', error);
    // In case of error, default to true
    return true;
  }
}

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  // Fetch SSLCommerz setting server-side
  const sslcommerzEnabled = await getSSLCommerzSetting();
  console.log('SSLCommerz enabled in page.js:', sslcommerzEnabled);

  return <CheckoutClient sslcommerzEnabled={sslcommerzEnabled} />;
}

