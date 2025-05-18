# Steadfast Courier Integration

This document outlines the integration of Steadfast Courier Limited's API into the e-shop application.

## Overview

Steadfast Courier Limited is a courier service provider in Bangladesh. This integration allows the e-shop application to automatically create courier orders with Steadfast after successful payment.

## API Documentation

The Steadfast API documentation is available at:
https://docs.google.com/document/u/0/d/e/2PACX-1vTi0sTyR353xu1AK0nR8E_WKe5onCkUXGEf8ch8uoJy9qxGfgGnboSIkNosjQ0OOdXkJhgGuAsWxnIh/pub

## Configuration

### Environment Variables

The following environment variables need to be set in the `.env` file:

```
STEADFAST_BASE_URL=https://portal.packzy.com/api/v1
STEADFAST_API_KEY=your-steadfast-api-key
STEADFAST_SECRET_KEY=your-steadfast-secret-key
```

### Settings

The application includes a setting to enable/disable automatic Steadfast courier order creation:

- `auto_create_steadfast_order`: Set to 'true' to enable automatic Steadfast courier order creation, 'false' to disable it.

## API Endpoints

### Create Order

- **Endpoint**: `${STEADFAST_BASE_URL}/create_order`
- **Method**: POST
- **Headers**:
  - `Api-Key`: Your Steadfast API key
  - `Secret-Key`: Your Steadfast secret key
  - `Content-Type`: application/json
- **Request Body**:
  ```json
  {
    "invoice": "order-123",
    "recipient_name": "John Doe",
    "recipient_phone": "01712345678",
    "recipient_address": "123 Main St, Dhaka",
    "cod_amount": 1000,
    "note": "Handle with care",
    "item_description": "Product 1, Product 2"
  }
  ```
- **Response**:
  ```json
  {
    "status": 200,
    "message": "Consignment has been created successfully.",
    "consignment": {
      "consignment_id": 1424107,
      "invoice": "order-123",
      "tracking_code": "15BAEB8A",
      "recipient_name": "John Doe",
      "recipient_phone": "01712345678",
      "recipient_address": "123 Main St, Dhaka",
      "cod_amount": 1000,
      "status": "in_review",
      "note": "Handle with care",
      "created_at": "2021-03-21T07:05:31.000000Z",
      "updated_at": "2021-03-21T07:05:31.000000Z"
    }
  }
  ```

### Check Delivery Status

- **By Consignment ID**: `${STEADFAST_BASE_URL}/status_by_cid/{id}`
- **By Invoice ID**: `${STEADFAST_BASE_URL}/status_by_invoice/{invoice}`
- **By Tracking Code**: `${STEADFAST_BASE_URL}/status_by_trackingcode/{trackingCode}`
- **Method**: GET
- **Response**:
  ```json
  {
    "status": 200,
    "delivery_status": "in_review"
  }
  ```

### Check Balance

- **Endpoint**: `${STEADFAST_BASE_URL}/get_balance`
- **Method**: GET
- **Response**:
  ```json
  {
    "status": 200,
    "current_balance": 0
  }
  ```

## Implementation Details

The integration is implemented in the following files:

- `src/lib/services/steadfast-courier.js`: Main service file for Steadfast API integration
- `src/lib/actions/couriers.js`: Functions for courier management
- `src/lib/services/auto-courier.js`: Automatic courier order creation
- `src/lib/actions/settings.js`: Settings management
- `src/app/api/couriers/steadfast/`: API routes for Steadfast integration

## Delivery Status Mapping

Steadfast delivery statuses are mapped to internal statuses as follows:

| Steadfast Status | Internal Status |
|------------------|----------------|
| pending | pending |
| delivered_approval_pending | in_transit |
| partial_delivered_approval_pending | in_transit |
| cancelled_approval_pending | in_transit |
| unknown_approval_pending | in_transit |
| delivered | delivered |
| partial_delivered | delivered |
| cancelled | cancelled |
| hold | in_transit |
| in_review | processing |
| unknown | processing |

## Usage

To create a Steadfast courier order:

```javascript
import { createAutomaticCourierOrder } from '@/lib/services/auto-courier';

// Create a Steadfast courier order
const result = await createAutomaticCourierOrder(orderId, false, 'steadfast');
```

To enable/disable automatic Steadfast courier order creation:

```javascript
import { updateSetting } from '@/lib/actions/settings';

// Enable automatic Steadfast courier order creation
await updateSetting('auto_create_steadfast_order', 'true', 'Enable automatic Steadfast courier order creation');

// Disable automatic Steadfast courier order creation
await updateSetting('auto_create_steadfast_order', 'false', 'Enable automatic Steadfast courier order creation');
```
