'use server';

import { db } from '@/lib/db';
import { paymentTransactions, orders, users } from '@/db/schema';
import { eq, desc, and, sql, or } from 'drizzle-orm';

/**
 * Get all payment transactions with pagination and filtering
 * @param {Object} options - Options for filtering and pagination
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of items per page
 * @param {string} options.status - Filter by status
 * @param {string} options.search - Search term for transaction_id or order_id
 * @returns {Promise<Object>} - Payment transactions with pagination info
 */
export async function getAllPaymentTransactions({ page = 1, limit = 10, status = null, search = null } = {}) {
  try {
    const offset = (page - 1) * limit;

    // Build conditions for filtering
    let conditions = [];

    if (status) {
      conditions.push(eq(paymentTransactions.status, status));
    }

    if (search) {
      // Check if search is a number (potential order_id)
      const isNumeric = /^\d+$/.test(search);

      if (isNumeric) {
        conditions.push(
          eq(paymentTransactions.order_id, parseInt(search))
        );
      } else {
        // Search in transaction_id, val_id, or bank_tran_id
        conditions.push(
          sql`${paymentTransactions.transaction_id} ILIKE ${`%${search}%`} OR
              ${paymentTransactions.val_id} ILIKE ${`%${search}%`} OR
              ${paymentTransactions.bank_tran_id} ILIKE ${`%${search}%`}`
        );
      }
    }

    // Build the query with conditions
    const query = conditions.length > 0
      ? and(...conditions)
      : undefined;

    // Get transactions with pagination
    const transactionsData = await db
      .select({
        id: paymentTransactions.id,
        order_id: paymentTransactions.order_id,
        transaction_id: paymentTransactions.transaction_id,
        val_id: paymentTransactions.val_id,
        amount: paymentTransactions.amount,
        status: paymentTransactions.status,
        currency: paymentTransactions.currency,
        tran_date: paymentTransactions.tran_date,
        card_type: paymentTransactions.card_type,
        card_no: paymentTransactions.card_no,
        payment_method: paymentTransactions.payment_method,
        created_at: paymentTransactions.created_at,
      })
      .from(paymentTransactions)
      .where(query)
      .orderBy(desc(paymentTransactions.created_at))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(paymentTransactions)
      .where(query);

    const totalTransactions = Number(count);
    const totalPages = Math.ceil(totalTransactions / limit);

    return {
      transactions: transactionsData,
      pagination: {
        total: totalTransactions,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    };
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    throw new Error('Failed to fetch payment transactions');
  }
}

/**
 * Get payment transaction details by ID
 * @param {number} id - Transaction ID
 * @returns {Promise<Object>} - Transaction details
 */
export async function getPaymentTransactionById(id) {
  try {
    const [transaction] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, id));

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Get order details if available
    let orderData = null;
    let userData = null;

    if (transaction.order_id) {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, transaction.order_id));

      orderData = order;

      // Get user details if available
      if (order && order.user_id) {
        const [user] = await db
          .select({
            id: users.id,
            firstName: users.first_name,
            lastName: users.last_name,
            email: users.email,
            phone: users.phone,
          })
          .from(users)
          .where(eq(users.id, order.user_id));

        userData = user;
      }
    }

    return {
      transaction,
      order: orderData,
      user: userData,
    };
  } catch (error) {
    console.error('Error fetching payment transaction details:', error);
    throw new Error('Failed to fetch payment transaction details');
  }
}

/**
 * Get payment transaction statistics
 * @returns {Promise<Object>} - Payment statistics
 */
export async function getPaymentStats() {
  try {
    // Get total transactions count
    const [{ count: totalTransactions }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(paymentTransactions);

    // Get successful transactions count (both VALID and VALIDATED statuses)
    const [{ count: successfulTransactions }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(paymentTransactions)
      .where(
        or(
          eq(paymentTransactions.status, 'VALID'),
          eq(paymentTransactions.status, 'VALIDATED')
        )
      );

    // Get failed transactions count
    const [{ count: failedTransactions }] = await db
      .select({ count: sql`COUNT(*)` })
      .from(paymentTransactions)
      .where(eq(paymentTransactions.status, 'FAILED'));

    // Get total amount of successful transactions (both VALID and VALIDATED statuses)
    const [{ total: totalAmount }] = await db
      .select({ total: sql`SUM(${paymentTransactions.amount})` })
      .from(paymentTransactions)
      .where(
        or(
          eq(paymentTransactions.status, 'VALID'),
          eq(paymentTransactions.status, 'VALIDATED')
        )
      );

    // Get recent transactions
    const recentTransactions = await db
      .select({
        id: paymentTransactions.id,
        order_id: paymentTransactions.order_id,
        transaction_id: paymentTransactions.transaction_id,
        amount: paymentTransactions.amount,
        status: paymentTransactions.status,
        created_at: paymentTransactions.created_at,
      })
      .from(paymentTransactions)
      .orderBy(desc(paymentTransactions.created_at))
      .limit(5);

    return {
      totalTransactions: Number(totalTransactions) || 0,
      successfulTransactions: Number(successfulTransactions) || 0,
      failedTransactions: Number(failedTransactions) || 0,
      totalAmount: Number(totalAmount) || 0,
      recentTransactions,
    };
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    throw new Error('Failed to fetch payment statistics');
  }
}

/**
 * Store payment transaction data
 * @param {Object} data - Payment transaction data
 * @returns {Promise<Object>} - Created transaction
 */
export async function storePaymentTransaction(data) {
  try {
    const [transaction] = await db
      .insert(paymentTransactions)
      .values({
        order_id: data.order_id,
        transaction_id: data.transaction_id,
        val_id: data.val_id,
        amount: data.amount,
        status: data.status,
        currency: data.currency,
        tran_date: data.tran_date ? new Date(data.tran_date) : null,
        card_type: data.card_type,
        card_no: data.card_no,
        bank_tran_id: data.bank_tran_id,
        card_issuer: data.card_issuer,
        card_brand: data.card_brand,
        card_issuer_country: data.card_issuer_country,
        card_issuer_country_code: data.card_issuer_country_code,
        store_amount: data.store_amount,
        verify_sign: data.verify_sign,
        verify_key: data.verify_key,
        risk_level: data.risk_level,
        risk_title: data.risk_title,
        payment_method: data.payment_method,
        gateway_url: data.gateway_url,
        response_data: data.response_data || {},
      })
      .returning();

    return transaction;
  } catch (error) {
    console.error('Error storing payment transaction:', error);
    throw new Error('Failed to store payment transaction');
  }
}
