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
Pickup Requested
Assigned For Pickup
Pickup
Pickup Failed
Pickup Cancelled
At the Sorting Hub
In Transit
Received at Last Mile Hub
Assigned for Delivery
Delivered
Partial Delivery
Return
Delivery Failed
On Hold
Payment Invoice
Paid Return
Exchange
Add Webhook
Webhook Integration Documentation
Headers you will receive
Header name	Header value
X-PATHAO-Signature	Secret provided by you during integration.
Content-Type	application/json
Order Created
Order Updated
Pickup Requested
Assigned For Pickup
Pickup
Pickup Failed
Pickup Cancelled
At the Sorting Hub
In Transit
Received at Last Mile Hub
Assigned for Delivery
Delivered
Partial Delivery
Return
Delivery Failed
On Hold
Payment Invoice
Paid Return
Exchange
