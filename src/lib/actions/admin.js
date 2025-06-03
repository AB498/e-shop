'use server';

import { db, pool } from '@/lib/db';
import { orders, orderItems, products, users, categories, couriers, deliveryPersons, productImages, wishlistItems } from '@/db/schema';
import { eq, desc, sql, and, gte, lte, inArray } from 'drizzle-orm';

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} - Dashboard statistics
 */
export async function getDashboardStats() {
  try {
    // Get total revenue
    const revenueResult = await db
      .select({ total: sql`SUM(${orders.total})` })
      .from(orders);

    const totalRevenue = revenueResult[0]?.total || 0;

    // Get total orders
    const ordersResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders);

    const totalOrders = ordersResult[0]?.count || 0;

    // Get total customers
    const customersResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(users)
      .where(eq(users.role, 'customer'));

    const totalCustomers = customersResult[0]?.count || 0;

    // Calculate conversion rate (mock for now)
    // In a real system, this would be calculated based on visits vs. orders
    const conversionRate = (totalOrders / (totalOrders + 30)) * 100;

    // Get month-over-month growth for revenue
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const previousMonthStart = new Date(previousMonthYear, previousMonth, 1);
    const previousMonthEnd = new Date(currentYear, currentMonth, 0);

    // Current month revenue
    const currentMonthRevenueResult = await db
      .select({ total: sql`SUM(${orders.total})` })
      .from(orders)
      .where(gte(orders.created_at, currentMonthStart));

    const currentMonthRevenue = currentMonthRevenueResult[0]?.total || 0;

    // Previous month revenue
    const previousMonthRevenueResult = await db
      .select({ total: sql`SUM(${orders.total})` })
      .from(orders)
      .where(
        and(
          gte(orders.created_at, previousMonthStart),
          lte(orders.created_at, previousMonthEnd)
        )
      );

    const previousMonthRevenue = previousMonthRevenueResult[0]?.total || 0;

    // Calculate revenue growth percentage
    const revenueGrowth = previousMonthRevenue === 0
      ? 100
      : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

    // Get month-over-month growth for orders
    const currentMonthOrdersResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders)
      .where(gte(orders.created_at, currentMonthStart));

    const currentMonthOrders = currentMonthOrdersResult[0]?.count || 0;

    const previousMonthOrdersResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders)
      .where(
        and(
          gte(orders.created_at, previousMonthStart),
          lte(orders.created_at, previousMonthEnd)
        )
      );

    const previousMonthOrders = previousMonthOrdersResult[0]?.count || 0;

    // Calculate orders growth percentage
    const ordersGrowth = previousMonthOrders === 0
      ? 100
      : ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100;

    // Get month-over-month growth for customers
    const currentMonthCustomersResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(users)
      .where(
        and(
          eq(users.role, 'customer'),
          gte(users.created_at, currentMonthStart)
        )
      );

    const currentMonthCustomers = currentMonthCustomersResult[0]?.count || 0;

    const previousMonthCustomersResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(users)
      .where(
        and(
          eq(users.role, 'customer'),
          gte(users.created_at, previousMonthStart),
          lte(users.created_at, previousMonthEnd)
        )
      );

    const previousMonthCustomers = previousMonthCustomersResult[0]?.count || 0;

    // Calculate customers growth percentage
    const customersGrowth = previousMonthCustomers === 0
      ? 100
      : ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;

    // Get pending orders count for notifications
    const pendingOrdersResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders)
      .where(eq(orders.status, 'pending'));

    const pendingOrdersCount = pendingOrdersResult[0]?.count || 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      conversionRate,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      pendingOrdersCount
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      conversionRate: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      pendingOrdersCount: 0
    };
  }
}

/**
 * Get monthly sales data for the current and previous year
 * @returns {Promise<Object>} - Monthly sales data
 */
export async function getMonthlySalesData() {
  try {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Get monthly sales for current year
    const currentYearSales = await Promise.all(
      Array.from({ length: 12 }, async (_, month) => {
        const startDate = new Date(currentYear, month, 1);
        const endDate = new Date(currentYear, month + 1, 0);

        const result = await db
          .select({ total: sql`SUM(${orders.total})` })
          .from(orders)
          .where(
            and(
              gte(orders.created_at, startDate),
              lte(orders.created_at, endDate)
            )
          );

        return result[0]?.total || 0;
      })
    );

    // Get monthly sales for previous year
    const previousYearSales = await Promise.all(
      Array.from({ length: 12 }, async (_, month) => {
        const startDate = new Date(previousYear, month, 1);
        const endDate = new Date(previousYear, month + 1, 0);

        const result = await db
          .select({ total: sql`SUM(${orders.total})` })
          .from(orders)
          .where(
            and(
              gte(orders.created_at, startDate),
              lte(orders.created_at, endDate)
            )
          );

        return result[0]?.total || 0;
      })
    );

    return {
      currentYearSales,
      previousYearSales
    };
  } catch (error) {
    console.error('Error fetching monthly sales data:', error);
    return {
      currentYearSales: Array(12).fill(0),
      previousYearSales: Array(12).fill(0)
    };
  }
}

/**
 * Get sales data by category
 * @returns {Promise<Object>} - Sales data by category
 */
export async function getSalesByCategory() {
  try {
    // Join orders, order_items, products, and categories to get sales by category
    const result = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name,
        total: sql`SUM(${orderItems.price} * ${orderItems.quantity})`
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.product_id, products.id))
      .innerJoin(categories, eq(products.category_id, categories.id))
      .innerJoin(orders, eq(orderItems.order_id, orders.id))
      .groupBy(categories.id, categories.name)
      .orderBy(desc(sql`SUM(${orderItems.price} * ${orderItems.quantity})`));

    return result.map(item => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      total: parseFloat(item.total) || 0
    }));
  } catch (error) {
    console.error('Error fetching sales by category:', error);
    return [];
  }
}

/**
 * Get recent orders
 * @param {number} limit - Number of orders to return
 * @returns {Promise<Array>} - Recent orders
 */
export async function getRecentOrders(limit = 5) {
  try {
    const recentOrders = await db
      .select({
        id: orders.id,
        userId: orders.user_id,
        status: orders.status,
        total: orders.total,
        createdAt: orders.created_at
      })
      .from(orders)
      .orderBy(desc(orders.created_at))
      .limit(limit);

    // Get customer names for each order
    const ordersWithCustomers = await Promise.all(
      recentOrders.map(async (order) => {
        const userData = await db
          .select({
            firstName: users.first_name,
            lastName: users.last_name
          })
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);

        const customer = userData[0]
          ? `${userData[0].firstName} ${userData[0].lastName}`
          : 'Unknown';

        return {
          id: order.id,
          customer,
          date: order.createdAt.toISOString().split('T')[0],
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          amount: `৳${parseFloat(order.total).toFixed(2)}`
        };
      })
    );

    return ordersWithCustomers;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }
}

/**
 * Get low stock products
 * @param {number} limit - Number of products to return
 * @param {number} threshold - Stock threshold
 * @returns {Promise<Array>} - Low stock products
 */
export async function getLowStockProducts(limit = 5, threshold = 10) {
  try {
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        stock: products.stock,
        sku: products.sku
      })
      .from(products)
      .where(lte(products.stock, threshold))
      .orderBy(products.stock)
      .limit(limit);

    return lowStockProducts.map(product => ({
      id: product.sku,
      name: product.name,
      stock: product.stock,
      threshold
    }));
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
}

/**
 * Get all customers
 * @returns {Promise<Array>} - List of customers
 */
export async function getAllCustomers() {
  try {
    const customers = await db
      .select({
        id: users.id,
        firstName: users.first_name,
        lastName: users.last_name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        postCode: users.post_code,
        country: users.country,
        region: users.region,
        createdAt: users.created_at
      })
      .from(users)
      .where(eq(users.role, 'customer'))
      .orderBy(desc(users.created_at));

    return customers.map(customer => ({
      ...customer,
      fullName: `${customer.firstName} ${customer.lastName}`,
      createdAt: customer.createdAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

/**
 * Get customer details by ID
 * @param {number} id - Customer ID
 * @returns {Promise<Object|null>} - Customer details
 */
export async function getCustomerById(id) {
  try {
    const customerData = await db
      .select({
        id: users.id,
        firstName: users.first_name,
        lastName: users.last_name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        city: users.city,
        postCode: users.post_code,
        country: users.country,
        region: users.region,
        createdAt: users.created_at
      })
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, 'customer')))
      .limit(1);

    if (!customerData.length) {
      return null;
    }

    const customer = customerData[0];

    // Get customer orders
    const customerOrders = await db
      .select({
        id: orders.id,
        total: orders.total,
        status: orders.status,
        createdAt: orders.created_at
      })
      .from(orders)
      .where(eq(orders.user_id, id))
      .orderBy(desc(orders.created_at))
      .limit(5);

    return {
      ...customer,
      fullName: `${customer.firstName} ${customer.lastName}`,
      createdAt: customer.createdAt.toISOString().split('T')[0],
      orders: customerOrders.map(order => ({
        ...order,
        createdAt: order.createdAt.toISOString().split('T')[0],
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        total: `৳${parseFloat(order.total).toFixed(2)}`
      }))
    };
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return null;
  }
}

/**
 * Get all products with inventory information
 * @returns {Promise<Array>} - List of products with inventory information
 */
export async function getAllProductsWithInventory() {
  try {
    const productsData = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        price: products.price,
        stock: products.stock,
        categoryId: products.category_id,
        image: products.image,
        description: products.description,
        createdAt: products.created_at
      })
      .from(products)
      .orderBy(products.name);

    // Get categories
    const categoriesData = await db
      .select({
        id: categories.id,
        name: categories.name
      })
      .from(categories);

    // Get primary images for all products
    const primaryImagesData = await db
      .select({
        productId: productImages.product_id,
        url: productImages.url
      })
      .from(productImages)
      .where(eq(productImages.is_primary, true));

    // Create a map of product IDs to primary images
    const primaryImageMap = primaryImagesData.reduce((map, image) => {
      map[image.productId] = image.url;
      return map;
    }, {});

    const categoryMap = categoriesData.reduce((map, category) => {
      map[category.id] = category.name;
      return map;
    }, {});

    return productsData.map(product => ({
      ...product,
      // Use primary image from product_images if available, otherwise use the legacy image field
      image: primaryImageMap[product.id] || product.image,
      category: categoryMap[product.categoryId] || 'Uncategorized',
      price: `৳${parseFloat(product.price).toFixed(2)}`,
      createdAt: product.createdAt.toISOString().split('T')[0],
      stockStatus: product.stock <= 10 ? 'low' : product.stock <= 50 ? 'medium' : 'high',
      // Ensure description is included
      description: product.description || ''
    }));
  } catch (error) {
    console.error('Error fetching products with inventory:', error);
    return [];
  }
}

/**
 * Update product stock
 * @param {number} productId - Product ID
 * @param {number} newStock - New stock value
 * @returns {Promise<Object|null>} - Updated product
 */
export async function updateProductStock(productId, newStock) {
  try {
    const updatedProduct = await db
      .update(products)
      .set({
        stock: newStock,
        updated_at: new Date()
      })
      .where(eq(products.id, productId))
      .returning();

    if (!updatedProduct.length) {
      return null;
    }

    return updatedProduct[0];
  } catch (error) {
    console.error('Error updating product stock:', error);
    return null;
  }
}

/**
 * Get product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object|null>} - Product details
 */
export async function getProductById(productId) {
  try {
    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        price: products.price,
        stock: products.stock,
        weight: products.weight,
        description: products.description,
        image: products.image,
        categoryId: products.category_id,
        createdAt: products.created_at,
        updatedAt: products.updated_at
      })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!productData.length) {
      return null;
    }

    const product = productData[0];

    // Get category information
    const categoryData = await db
      .select({
        id: categories.id,
        name: categories.name
      })
      .from(categories)
      .where(eq(categories.id, product.categoryId))
      .limit(1);

    const category = categoryData.length ? categoryData[0] : null;

    return {
      ...product,
      category: category ? category.name : 'Uncategorized',
      categoryId: category ? category.id : null,
      price: parseFloat(product.price),
      weight: parseFloat(product.weight),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object|null>} - Created product
 */
export async function createProduct(productData) {
  try {
    // Validate required fields
    if (!productData.name || !productData.price) {
      throw new Error('Name and price are required');
    }

    // Check if SKU already exists (only if SKU is provided)
    if (productData.sku && productData.sku.trim() !== '') {
      const existingSku = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.sku, productData.sku))
        .limit(1);

      if (existingSku.length) {
        throw new Error('SKU already exists');
      }
    }

    // Reset the sequence for the products table to avoid primary key conflicts
    try {
      await pool.query(`
        SELECT setval(pg_get_serial_sequence('products', 'id'),
          (SELECT COALESCE(MAX(id), 0) + 1 FROM products), false);
      `);
      console.log('Products table sequence has been reset');
    } catch (seqError) {
      console.error('Error resetting sequence:', seqError);
      // Continue anyway, as we'll handle duplicate key errors below
    }

    // Create new product with error handling for duplicate keys
    const createProductOperation = async () => {
      return await db
        .insert(products)
        .values({
          name: productData.name,
          sku: productData.sku && productData.sku.trim() !== '' ? productData.sku : null,
          category_id: productData.category_id || null,
          price: productData.price,
          stock: productData.stock || 0,
          weight: productData.weight || 0.5,
          description: productData.description || '',
          image: productData.image || '',
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();
    };

    try {
      const newProduct = await createProductOperation();

      if (!newProduct.length) {
        return null;
      }

      return newProduct[0];
    } catch (insertError) {
      // If it's a duplicate key error, try to fix the sequence and retry
      if (insertError.code === '23505' && insertError.constraint === 'products_pkey') {
        console.log('Detected duplicate key error, attempting to fix sequence and retry...');

        // Force reset the sequence to a higher value
        await pool.query(`
          SELECT setval(pg_get_serial_sequence('products', 'id'),
            (SELECT COALESCE(MAX(id), 0) + 10 FROM products), false);
        `);

        // Retry the operation
        const newProduct = await createProductOperation();

        if (!newProduct.length) {
          return null;
        }

        return newProduct[0];
      } else {
        // If it's not a duplicate key error or retry failed, rethrow
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Update an existing product
 * @param {number} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object|null>} - Updated product
 */
export async function updateProduct(productId, productData) {
  try {
    // Validate required fields
    if (!productData.name || !productData.price) {
      throw new Error('Name and price are required');
    }

    // Check if SKU already exists and belongs to another product (only if SKU is provided)
    if (productData.sku && productData.sku.trim() !== '') {
      const existingSku = await db
        .select({ id: products.id })
        .from(products)
        .where(and(
          eq(products.sku, productData.sku),
          sql`${products.id} != ${productId}`
        ))
        .limit(1);

      if (existingSku.length) {
        throw new Error('SKU already exists for another product');
      }
    }

    // Update product with error handling
    const updateProductOperation = async () => {
      return await db
        .update(products)
        .set({
          name: productData.name,
          sku: productData.sku && productData.sku.trim() !== '' ? productData.sku : null,
          category_id: productData.category_id || null,
          price: productData.price,
          stock: productData.stock !== undefined ? productData.stock : products.stock,
          weight: productData.weight || products.weight,
          description: productData.description || products.description,
          image: productData.image || products.image,
          updated_at: new Date()
        })
        .where(eq(products.id, productId))
        .returning();
    };

    try {
      const updatedProduct = await updateProductOperation();

      if (!updatedProduct.length) {
        return null;
      }

      return updatedProduct[0];
    } catch (updateError) {
      // If it's a database error, log it and rethrow
      console.error('Database error during product update:', updateError);
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Delete a product
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} - True if deleted successfully, false otherwise
 */
export async function deleteProduct(productId) {
  try {
    // Check if product exists
    const productExists = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!productExists.length) {
      return false;
    }

    // First, delete all related product images
    await db
      .delete(productImages)
      .where(eq(productImages.product_id, productId));

    // Then, delete any wishlist items referencing this product
    await db
      .delete(wishlistItems)
      .where(eq(wishlistItems.product_id, productId));

    // Finally, delete the product
    const result = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning({ id: products.id });

    return result.length > 0;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

/**
 * Get all orders
 * @returns {Promise<Array>} - List of orders
 */
export async function getAllOrders() {
  try {
    const ordersData = await db
      .select({
        id: orders.id,
        userId: orders.user_id,
        status: orders.status,
        total: orders.total,
        payment_method: orders.payment_method,
        createdAt: orders.created_at,
        updatedAt: orders.updated_at,
        shippingAddress: orders.shipping_address,
        shippingCity: orders.shipping_city,
        shippingPostCode: orders.shipping_post_code,
        shippingPhone: orders.shipping_phone,
        shippingInstructions: orders.shipping_instructions,
        courierId: orders.courier_id,
        deliveryPersonId: orders.delivery_person_id,
        courierOrderId: orders.courier_order_id,
        courierTrackingId: orders.courier_tracking_id,
        courierStatus: orders.courier_status
      })
      .from(orders)
      .orderBy(desc(orders.created_at));

    // Get courier information for orders with couriers
    const courierIds = ordersData.filter(order => order.courierId).map(order => order.courierId);
    let couriersData = [];

    if (courierIds.length > 0) {
      couriersData = await db
        .select({
          id: couriers.id,
          name: couriers.name,
          courierType: couriers.courier_type
        })
        .from(couriers)
        .where(inArray(couriers.id, courierIds));
    }

    // Create a map of courier id to courier data for quick lookup
    const courierMap = couriersData.reduce((map, courier) => {
      map[courier.id] = courier;
      return map;
    }, {});

    // Get delivery person information for orders with delivery persons
    const deliveryPersonIds = ordersData.filter(order => order.deliveryPersonId).map(order => order.deliveryPersonId);
    let deliveryPersonsData = [];

    if (deliveryPersonIds.length > 0) {
      deliveryPersonsData = await db
        .select({
          id: deliveryPersons.id,
          name: deliveryPersons.name,
          phone: deliveryPersons.phone
        })
        .from(deliveryPersons)
        .where(inArray(deliveryPersons.id, deliveryPersonIds));
    }

    // Create a map of delivery person id to delivery person data for quick lookup
    const deliveryPersonMap = deliveryPersonsData.reduce((map, person) => {
      map[person.id] = person;
      return map;
    }, {});

    // Get customer names for each order
    const ordersWithCustomers = await Promise.all(
      ordersData.map(async (order) => {
        const userData = await db
          .select({
            firstName: users.first_name,
            lastName: users.last_name
          })
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);

        const customer = userData[0]
          ? `${userData[0].firstName} ${userData[0].lastName}`
          : 'Unknown';

        // Get order items with product details
        const orderItemsData = await db
          .select({
            id: orderItems.id,
            quantity: orderItems.quantity,
            price: orderItems.price,
            discount_price: orderItems.discount_price,
            product_id: orderItems.product_id,
            product_name: products.name,
            product_image: products.image,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.product_id, products.id))
          .where(eq(orderItems.order_id, order.id));

        const itemsCount = orderItemsData.length;

        // Get courier information if available
        const courier = order.courierId ? courierMap[order.courierId] : null;
        const courierType = courier ? courier.courierType : null;
        const courierName = courier ? courier.name : null;

        // Get delivery person information if available
        const deliveryPerson = order.deliveryPersonId ? deliveryPersonMap[order.deliveryPersonId] : null;

        return {
          id: order.id,
          customer,
          customerId: order.userId,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          total: `৳${parseFloat(order.total).toFixed(2)}`,
          payment_method: order.payment_method,
          date: order.createdAt.toISOString().split('T')[0],
          time: order.createdAt.toLocaleTimeString(),
          itemsCount,
          items: orderItemsData.map(item => {
            const hasDiscount = item.discount_price && parseFloat(item.discount_price) < parseFloat(item.price);
            const priceToUse = hasDiscount ? parseFloat(item.discount_price) : parseFloat(item.price);

            return {
              id: item.id,
              product_id: item.product_id,
              product_name: item.product_name,
              product_image: item.product_image,
              quantity: item.quantity,
              price: parseFloat(item.price).toFixed(2),
              discount_price: item.discount_price ? parseFloat(item.discount_price).toFixed(2) : null,
              total: (priceToUse * item.quantity).toFixed(2)
            };
          }),
          shippingAddress: order.shippingAddress,
          shippingCity: order.shippingCity,
          shippingPostCode: order.shippingPostCode,
          shippingPhone: order.shippingPhone,
          shippingInstructions: order.shippingInstructions,
          courier_id: order.courierId,
          courier_name: courierName,
          courier_type: courierType,
          delivery_person_id: order.deliveryPersonId,
          delivery_person_name: deliveryPerson ? deliveryPerson.name : null,
          delivery_person_phone: deliveryPerson ? deliveryPerson.phone : null,
          courier_order_id: order.courierOrderId,
          courier_tracking_id: order.courierTrackingId,
          courier_status: order.courierStatus
        };
      })
    );

    return ordersWithCustomers;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
}

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object|null>} - Updated order
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const updatedOrder = await db
      .update(orders)
      .set({
        status,
        updated_at: new Date()
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder.length) {
      return null;
    }

    return updatedOrder[0];
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
}

/**
 * Check if the internal courier system is active
 * @returns {Promise<boolean>} - True if internal courier is active, false otherwise
 */
export async function isInternalCourierActive() {
  try {
    const internalCourier = await db
      .select({
        is_active: couriers.is_active
      })
      .from(couriers)
      .where(and(
        eq(couriers.name, 'Internal Delivery'),
        eq(couriers.courier_type, 'internal')
      ))
      .limit(1);

    // Return true if internal courier exists and is active, false otherwise
    return internalCourier.length > 0 && internalCourier[0].is_active;
  } catch (error) {
    console.error('Error checking internal courier status:', error);
    return false;
  }
}
