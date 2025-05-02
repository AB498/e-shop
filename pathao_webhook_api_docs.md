Webhook Integration
You can choose to integrate webhook for status updates of your individual delivery. You only need to provide us with a Callback URL and Webhook secret, where you will receive a POST request containing event details.
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return status code 202 for this specific event.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should be exactly f3992ecc-59da-4cbe-a049-a13da2018d51.
To integrate webhook, you will received the following body:
{
   event: "webhook_integration"
}
Callback URL

https://example.com/status-update
Please provide an url

Secret

enter your webhook secret
Events
Select All
Order Created
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:49:43",
   timestamp: "2024-12-27T17:49:43+00:00",
   store_id: 130820,
   event: "order.created",
   delivery_fee: 83.46
}

Order Updated
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:50:16",
   timestamp: "2024-12-27T17:50:16+00:00",
   store_id: 130820,
   event: "order.updated",
   delivery_fee: 83.46
}
Pickup Requested
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:50:32",
   timestamp: "2024-12-27T17:50:32+00:00",
   store_id: 130820,
   event: "order.pickup-requested",
   delivery_fee: 83.46
}
Assigned For Pickup
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:51:01",
   timestamp: "2024-12-27T17:51:01+00:00",
   store_id: 130820,
   event: "order.assigned-for-pickup"
}
Pickup
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:51:17",
   timestamp: "2024-12-27T17:51:17+00:00",
   store_id: 130820,
   event: "order.picked"
}

Pickup Failed
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:51:33",
   timestamp: "2024-12-27T17:51:33+00:00",
   store_id: 130820,
   event: "order.pickup-failed"
}
Pickup Cancelled
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:51:49",
   timestamp: "2024-12-27T17:51:49+00:00",
   store_id: 130820,
   event: "order.pickup-cancelled"
}
At the Sorting Hub
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:52:15",
   timestamp: "2024-12-27T17:52:15+00:00",
   store_id: 130820,
   event: "order.at-the-sorting-hub"
}
In Transit
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:52:32",
   timestamp: "2024-12-27T17:52:32+00:00",
   store_id: 130820,
   event: "order.in-transit"
}
Received at Last Mile Hub
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:52:48",
   timestamp: "2024-12-27T17:52:48+00:00",
   store_id: 130820,
   event: "order.received-at-last-mile-hub"
}
Assigned for Delivery
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:53:05",
   timestamp: "2024-12-27T17:53:05+00:00",
   store_id: 130820,
   event: "order.assigned-for-delivery"
}
Delivered
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:53:23",
   timestamp: "2024-12-27T17:53:23+00:00",
   store_id: 130820,
   event: "order.delivered"
}
Partial Delivery
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:53:45",
   timestamp: "2024-12-27T17:53:45+00:00",
   store_id: 130820,
   event: "order.partial-delivery",
   collected_amount: 60,
   reason: "This field might not be present in some cases."
}
Return
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:54:02",
   timestamp: "2024-12-27T17:54:02+00:00",
   store_id: 130820,
   event: "order.returned",
   reason: "This field might not be present in some cases."
}
Delivery Failed
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:54:21",
   timestamp: "2024-12-27T17:54:21+00:00",
   store_id: 130820,
   event: "order.delivery-failed",
   reason: "This field might not be present in some cases."
}
On Hold
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:54:46",
   timestamp: "2024-12-27T17:54:46+00:00",
   store_id: 130820,
   event: "order.on-hold",
   reason: "This field might not be present in some cases."
}
Payment Invoice
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:55:01",
   timestamp: "2024-12-27T17:55:01+00:00",
   store_id: 130820,
   event: "order.paid",
   invoice_id: "121224IBW19790"
}

Paid Return
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:55:17",
   timestamp: "2024-12-27T17:55:17+00:00",
   store_id: 130820,
   event: "order.paid-return",
   reason: "This field might not be present in some cases."
}

Exchange
Store
merchant123
Merchant Order ID
Merchant Order ID (Optional)
TEST
Your URL should be reachable.
Your URL should be resolved within 3 redirections.
If using HTTPS, your SSL certificate should be valid.
Your URL should return a response within a timeout.
Your URL should return a response with header X-Pathao-Merchant-Webhook-Integration-Secret.
The header X-Pathao-Merchant-Webhook-Integration-Secret value should contain f3992ecc-59da-4cbe-a049-a13da2018d51.
Sample payload:
{
   consignment_id: "DL121224VS8TTJ",
   merchant_order_id: "TS-123",
   updated_at: "2024-12-27 23:55:34",
   timestamp: "2024-12-27T17:55:34+00:00",
   store_id: 130820,
   event: "order.exchanged",
   reason: "This field might not be present in some cases."
}
