# Steadfast Webhook Integration Setup

This document outlines how to set up and configure the Steadfast webhook integration for the e-shop application.

## Overview

Steadfast provides webhooks to notify your application about delivery status changes and tracking updates. This integration allows the e-shop application to automatically update order statuses and tracking information based on these webhook notifications.

## Webhook Types

Steadfast provides two types of webhooks:

1. **Delivery Status Updates** (`notification_type: "delivery_status"`)
   - Notifies about changes in the delivery status of a consignment
   - Updates the order status in the e-shop application

2. **Tracking Updates** (`notification_type: "tracking_update"`)
   - Sends tracking updates for a consignment
   - Adds tracking entries without changing the order status

## Webhook Payload Format

### Delivery Status Update

```json
{
    "notification_type": "delivery_status",
    "consignment_id": 12345,
    "invoice": "INV-67890",
    "cod_amount": 1500.00,
    "status": "Delivered",
    "delivery_charge": 100.00,
    "tracking_message": "Your package has been delivered successfully.",
    "updated_at": "2025-03-02 12:45:30"
}
```

### Tracking Update

```json
{
    "notification_type": "tracking_update",
    "consignment_id": 12345,
    "invoice": "INV-67890",
    "tracking_message": "Package arrived at the sorting center.",
    "updated_at": "2025-03-02 13:15:00"
}
```

## Webhook Endpoint

The webhook endpoint for Steadfast is:

```
https://your-domain.com/api/couriers/steadfast/webhook
```

## Webhook Authentication

Steadfast may require authentication for webhooks. The webhook endpoint supports Bearer token authentication. You can configure the token in your environment variables:

```
STEADFAST_WEBHOOK_TOKEN=your-webhook-token
```

To enable authentication, uncomment the authentication check in the webhook handler.

## Status Mapping

Steadfast delivery statuses are mapped to internal statuses as follows:

| Steadfast Status | Internal Status |
|------------------|----------------|
| pending | pending |
| delivered | delivered |
| partial_delivered | delivered |
| cancelled | cancelled |
| unknown | processing |

## Setup Instructions

1. **Configure Steadfast Webhook URL**:
   - Log in to your Steadfast account
   - Navigate to the webhook settings
   - Add the webhook URL: `https://your-domain.com/api/couriers/steadfast/webhook`
   - If required, set up authentication

2. **Configure Environment Variables**:
   - Add the following to your `.env` file:
     ```
     STEADFAST_WEBHOOK_TOKEN=your-webhook-token
     ```

3. **Test the Webhook**:
   - You can test the webhook by sending a GET request to the webhook endpoint:
     ```
     curl https://your-domain.com/api/couriers/steadfast/webhook
     ```
   - The response should be:
     ```json
     {
       "status": "success",
       "message": "Steadfast webhook endpoint is active"
     }
     ```

4. **Monitor Webhook Activity**:
   - Check the application logs for webhook activity
   - Look for log entries starting with "Received Steadfast webhook:"

## Troubleshooting

If you're not receiving webhook notifications:

1. **Check Webhook Configuration**:
   - Verify the webhook URL is correctly configured in your Steadfast account
   - Ensure the URL is publicly accessible

2. **Check Authentication**:
   - If you've enabled authentication, verify the token is correct
   - Check the application logs for authentication errors

3. **Check Order Matching**:
   - The webhook tries to match orders by:
     - `consignment_id`
     - `invoice` (as `merchant_order_id`)
   - Ensure these values match between Steadfast and your e-shop orders

4. **Enable Debug Logging**:
   - The webhook handler logs all incoming webhook data
   - Check the application logs for detailed information

## Implementation Details

The webhook integration is implemented in the following files:

- `src/app/api/couriers/steadfast/webhook/route.js`: Webhook endpoint
- `src/lib/actions/couriers.js`: Order status update logic
- `src/lib/services/steadfast-courier.js`: Steadfast API integration
