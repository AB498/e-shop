# Pathao Courier Integration

This document provides instructions for setting up and using the Pathao Courier integration in the e-commerce application.

## Setup

1. Add the Pathao API credentials to your `.env.local` file:

```
# Pathao API Credentials - Sandbox Environment
PATHAO_CLIENT_ID=7N1aMJQbWm
PATHAO_CLIENT_SECRET=wRcaibZkUdSNz2EI9ZyuXLlNrnAv0TdPUPXMnD39
PATHAO_USERNAME=test@pathao.com
PATHAO_PASSWORD=lovePathao
```

For production, replace these with your actual Pathao merchant credentials.

## API Endpoints

The integration uses the following Pathao API endpoints:

- **Authentication**: `/aladdin/api/v1/issue-token`
- **Cities**: `/aladdin/api/v1/city-list`
- **Zones**: `/aladdin/api/v1/cities/{city_id}/zone-list`
- **Areas**: `/aladdin/api/v1/zones/{zone_id}/area-list`
- **Stores**: `/aladdin/api/v1/stores`
- **Create Order**: `/aladdin/api/v1/orders`
- **Price Calculation**: `/aladdin/api/v1/merchant/price-plan`
- **Track Order**: `/aladdin/api/v1/orders/{consignment_id}/info`

## Testing

You can test the Pathao integration using the developer tools:

1. Go to `/dev` in your application
2. Find the "Test Pathao courier order creation" section
3. Enter an order ID and click "Create Courier Order"

## Monitoring

You can monitor Pathao courier orders in the admin dashboard:

1. Go to `/admin/courier-orders`
2. View all courier orders with their statuses
3. Click "Update" to refresh tracking information for any order

## Troubleshooting

If you encounter issues with the Pathao integration:

1. Check that your API credentials are correctly set in the `.env.local` file
2. Verify that the order has valid shipping information (address, city, zone, area)
3. Check the server logs for detailed error messages
4. Ensure that the Pathao API is available and responding

### Common Issues

#### amount_to_collect must be an integer

The Pathao API requires the `amount_to_collect` field to be an integer. Our implementation converts the order total to an integer by multiplying by 100 (converting to cents/paisa). This means:

- An order total of 100.50 will be sent as 10050
- An order total of 25.99 will be sent as 2599

If you're seeing this error, check that the conversion is happening correctly in:
- `src/lib/services/pathao-courier.js` - `formatOrderForPathao` function
- `src/lib/services/auto-courier.js` - `createAutomaticCourierOrder` function

#### recipient_phone is not a valid phone number

The Pathao API requires phone numbers to be in Bangladesh format. Valid phone numbers must:

- Start with '01' (e.g., '01712345678')
- Contain 11 digits total
- Not include the country code ('+880' or '880')

Our implementation automatically formats phone numbers to meet these requirements:
- '+8801712345678' becomes '01712345678'
- '8801712345678' becomes '01712345678'
- '1712345678' becomes '01712345678'

If you're seeing this error, check that the phone number formatting is working correctly in:
- `src/lib/services/pathao-courier.js` - `formatBangladeshPhoneNumber` function
- `src/app/api/dev/reset-and-create-order/route.js` - Regular user creation

## References

- [Pathao Courier Merchant API Documentation](https://merchant.pathao.com/courier/developer-api)
- [Pathao Merchant Dashboard](https://merchant.pathao.com)
