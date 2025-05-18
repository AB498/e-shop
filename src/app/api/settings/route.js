import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSettingIfNotExists } from '@/lib/actions/settings';

export async function GET(request) {
  try {
    // Check if sslcommerz_enabled setting exists, create it if not
    const sslcommerzSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'sslcommerz_enabled'))
      .limit(1);

    if (sslcommerzSetting.length === 0) {
      console.log('SSLCommerz setting not found in public API, creating it...');
      await createSettingIfNotExists('sslcommerz_enabled', 'false', 'Enable SSLCommerz payment gateway');
    }

    // Get all settings
    const allSettings = await db.select().from(settings);

    // Return only public settings (exclude sensitive settings if needed)
    const publicSettings = allSettings.filter(setting => {
      // Add any sensitive settings that should not be exposed to the client
      const sensitiveSettings = ['admin_password', 'api_key'];
      return !sensitiveSettings.includes(setting.key);
    });

    return NextResponse.json(publicSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
