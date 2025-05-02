'use server';

import { db } from '@/lib/db';
import { storeLocations } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import * as pathaoCourier from '@/lib/services/pathao-courier';

/**
 * Get all store locations
 * @returns {Promise<Array>} - List of store locations
 */
export async function getAllStoreLocations() {
  try {
    const locations = await db
      .select({
        id: storeLocations.id,
        name: storeLocations.name,
        contact_name: storeLocations.contact_name,
        contact_number: storeLocations.contact_number,
        secondary_contact: storeLocations.secondary_contact,
        address: storeLocations.address,
        city_id: storeLocations.city_id,
        zone_id: storeLocations.zone_id,
        area_id: storeLocations.area_id,
        is_default: storeLocations.is_default,
        pathao_store_id: storeLocations.pathao_store_id,
        is_active: storeLocations.is_active,
        created_at: storeLocations.created_at,
        updated_at: storeLocations.updated_at,
      })
      .from(storeLocations)
      .orderBy(desc(storeLocations.created_at));

    return locations;
  } catch (error) {
    console.error('Error fetching store locations:', error);
    return [];
  }
}

/**
 * Get store location by ID
 * @param {number} id - Store location ID
 * @returns {Promise<object|null>} - Store location information
 */
export async function getStoreLocationById(id) {
  try {
    const location = await db
      .select({
        id: storeLocations.id,
        name: storeLocations.name,
        contact_name: storeLocations.contact_name,
        contact_number: storeLocations.contact_number,
        secondary_contact: storeLocations.secondary_contact,
        address: storeLocations.address,
        city_id: storeLocations.city_id,
        zone_id: storeLocations.zone_id,
        area_id: storeLocations.area_id,
        is_default: storeLocations.is_default,
        pathao_store_id: storeLocations.pathao_store_id,
        is_active: storeLocations.is_active,
        created_at: storeLocations.created_at,
        updated_at: storeLocations.updated_at,
      })
      .from(storeLocations)
      .where(eq(storeLocations.id, id))
      .limit(1);

    return location.length ? location[0] : null;
  } catch (error) {
    console.error(`Error fetching store location with ID ${id}:`, error);
    return null;
  }
}

/**
 * Create a new store location
 * @param {object} locationData - Store location data
 * @returns {Promise<object|null>} - Created store location
 */
export async function createStoreLocation(locationData) {
  try {
    // If this is set as default, unset any existing default
    if (locationData.is_default) {
      await db.update(storeLocations)
        .set({ is_default: false })
        .where(eq(storeLocations.is_default, true));
    }

    // Create store in Pathao (mandatory)
    let pathaoStoreId = null;
    try {
      const pathaoStoreData = {
        name: locationData.name,
        contact_name: locationData.contact_name,
        contact_number: locationData.contact_number,
        secondary_contact: locationData.secondary_contact || '',
        address: locationData.address,
        city_id: locationData.city_id,
        zone_id: locationData.zone_id,
        area_id: locationData.area_id
      };

      const pathaoResponse = await pathaoCourier.createStore(pathaoStoreData);
      if (pathaoResponse && pathaoResponse.data && pathaoResponse.data.store_name) {
        pathaoStoreId = pathaoResponse.data.store_id || `pending-${Date.now()}`;
        console.log('Pathao store created successfully:', pathaoResponse.data.store_name);
      } else {
        // If we didn't get a valid response but no error was thrown
        throw new Error('Failed to create store in Pathao: Invalid response');
      }
    } catch (pathaoError) {
      console.error('Error creating store in Pathao:', pathaoError);
      // Don't continue with local creation if Pathao creation fails
      throw new Error(`Failed to create store in Pathao: ${pathaoError.message || 'Unknown error'}`);
    }

    const result = await db.insert(storeLocations).values({
      name: locationData.name,
      contact_name: locationData.contact_name,
      contact_number: locationData.contact_number,
      secondary_contact: locationData.secondary_contact,
      address: locationData.address,
      city_id: locationData.city_id,
      zone_id: locationData.zone_id,
      area_id: locationData.area_id,
      is_default: locationData.is_default || false,
      pathao_store_id: pathaoStoreId,
      is_active: locationData.is_active ?? true,
    }).returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error('Error creating store location:', error);
    return null;
  }
}

/**
 * Update a store location
 * @param {number} id - Store location ID
 * @param {object} locationData - Updated store location data
 * @returns {Promise<object|null>} - Updated store location
 */
export async function updateStoreLocation(id, locationData) {
  try {
    // If this is set as default, unset any existing default
    if (locationData.is_default) {
      await db.update(storeLocations)
        .set({ is_default: false })
        .where(eq(storeLocations.is_default, true));
    }

    const result = await db.update(storeLocations)
      .set({
        name: locationData.name,
        contact_name: locationData.contact_name,
        contact_number: locationData.contact_number,
        secondary_contact: locationData.secondary_contact,
        address: locationData.address,
        city_id: locationData.city_id,
        zone_id: locationData.zone_id,
        area_id: locationData.area_id,
        is_default: locationData.is_default || false,
        is_active: locationData.is_active,
        updated_at: new Date(),
      })
      .where(eq(storeLocations.id, id))
      .returning();

    return result.length ? result[0] : null;
  } catch (error) {
    console.error(`Error updating store location with ID ${id}:`, error);
    return null;
  }
}

/**
 * Delete a store location
 * @param {number} id - Store location ID
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteStoreLocation(id) {
  try {
    // Check if this is the default store
    const location = await getStoreLocationById(id);
    if (location && location.is_default) {
      throw new Error('Cannot delete the default store location');
    }

    await db.delete(storeLocations).where(eq(storeLocations.id, id));
    return true;
  } catch (error) {
    console.error(`Error deleting store location with ID ${id}:`, error);
    return false;
  }
}

/**
 * Get the default store location
 * @returns {Promise<object|null>} - Default store location
 */
export async function getDefaultStoreLocation() {
  try {
    const location = await db
      .select({
        id: storeLocations.id,
        name: storeLocations.name,
        contact_name: storeLocations.contact_name,
        contact_number: storeLocations.contact_number,
        secondary_contact: storeLocations.secondary_contact,
        address: storeLocations.address,
        city_id: storeLocations.city_id,
        zone_id: storeLocations.zone_id,
        area_id: storeLocations.area_id,
        is_default: storeLocations.is_default,
        pathao_store_id: storeLocations.pathao_store_id,
        is_active: storeLocations.is_active,
        created_at: storeLocations.created_at,
        updated_at: storeLocations.updated_at,
      })
      .from(storeLocations)
      .where(eq(storeLocations.is_default, true))
      .limit(1);

    return location.length ? location[0] : null;
  } catch (error) {
    console.error('Error fetching default store location:', error);
    return null;
  }
}
