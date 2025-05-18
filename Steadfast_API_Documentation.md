Published using Google Docs
Report abuseLearn more
API Documentation
Updated automatically every 5 minutes








Steadfast Courier Limited


API Documentation


V1










Table of Contents


API Authentication Parameter
Placing an order
Bulk Order Create
Checking Delivery Status
Checking Current Balance







































API Authentication Parameter

Name

Type

Description

Value

Api-Key

String

API Key provided by Steadfast Courier Ltd.

***************

Secret-Key

String

Secret Key provided by Steadfast Courier Ltd.

***************

Content-Type

String

Request Content Type

application/json


Authentication parameters are required to be added at the header part of each request.


Base Url: https://portal.packzy.com/api/v1



Placing an order

        Path: /create_order

        Method: Post


       Input Parameters:


Name

Type

MOC

Description

Example

invoice

string

required

Must be Unique and can be alpha-numeric including hyphens and underscores.

12366

abc123

12abchd

Aa12-das4

a_sdfd-wq

recipient_name

string

required

Within 100 characters.

John Smith

recipient_phone

string

required

Must be 11 Digits Phone number

01234567890

alternative_phone

string

optional

Must be 11 Digits Phone number


recipient_email

string

optional



recipient_address

string

required

Recipient’s address within 250 characters.

Fla# A1,
House# 17/1, Road# 3/A, Dhanmondi,

Dhaka-1209

cod_amount

numeric

required

Cash on delivery amount in BDT including all charges. Can’t be less than 0.

1060

note

string

optional

Delivery instructions or other notes.

Deliver within

3 PM

item_description

string

optional

Items name and other information


total_lot

numeric

optional

Total Lot of items


delivery_type

numeric

optional

0 = for home delivery, 1 = for Point Delivery/Steadfast Hub Pick Up

0/1


        Yellow colour marked parameters are added newly.


Response:


{

    "status": 200,

    "message": "Consignment has been created successfully.",

    "consignment": {

        "consignment_id": 1424107,

        "invoice": "Aa12-das4",

        "tracking_code": "15BAEB8A",

        "recipient_name": "John Smith",

        "recipient_phone": "01234567890",

        "recipient_address": "Fla# A1,House# 17/1, Road# 3/A, Dhanmondi,Dhaka-1209",

        "cod_amount": 1060,

        "status": "in_review",

        "note": "Deliver within 3PM",

        "created_at": "2021-03-21T07:05:31.000000Z",

        "updated_at": "2021-03-21T07:05:31.000000Z"

    }

}




Bulk Order Create

        Path: /create_order/bulk-order

        Method: Post


Input Parameters:




Name

Type

MOC

Description

Example

data

Json

require

Maximum 500 items are allowed. Json encoded array

Given below


        

        Array Keys:


$item = [

        ‘Invoice’ => ‘adbd123’

]


Example:

public function bulkCreate(){

$orders = Order::with('address')->where('status',1)->take(500)->get();


$data = array();


foreach($orders as $order){

$item = [

'invoice' => $order->id,

'recipient_name' => $order->address ? $order->address->name : 'N/A',

'recipient_address' => $order->address ? $order->address->address : 'N/A',

'recipient_phone' => $order->address ? $order->address->phone : '',

'cod_amount' => $order->due_amount,

'note' => $order->note,

];


}


$steadfast = new Steadfast();

$result = $steadfast->bulkCreate(json_encode($data));

return $result;

}

// Example code


public function bulkCreate($data){

                 $api_key = '1m9mwrrwsjbrg0w';

         $secret_key = 'y196ftazvk9s3';


         $response = Http::withHeaders([

         'Api-Key' => $api_key,

         'Secret-Key' => $secret_key,

         'Content-Type' => 'application/json'

         ])->post($this->base_url.'/create_order/bulk-order', [

                 'data' => $data,

                 ]);

         return json_decode($response->getBody()->getContents());

         }




        

Result:

[

{

"invoice": "230822-1",

"recipient_name": "John Doe",

"recipient_address": "House 44, Road 2/A, Dhanmondi, Dhaka 1209",

"recipient_phone": "0171111111",

"cod_amount": "0.00",

"note": null,

"consignment_id": 11543968,

"tracking_code": "B025A038",

"status": "success"

},

{

"invoice": "230822-1",

"recipient_name": "John Doe",

"recipient_address": "House 44, Road 2/A, Dhanmondi, Dhaka 1209",

"recipient_phone": "0171111111",

"cod_amount": "0.00",

"note": null,

"consignment_id": 11543969,

"tracking_code": "B025A1DC",

"status": "success"

},

{

"invoice": "230822-1",

"recipient_name": "John Doe",

"recipient_address": "House 44, Road 2/A, Dhanmondi, Dhaka 1209",

"recipient_phone": "0171111111",

"cod_amount": "0.00",

"note": null,

"consignment_id": 11543970,

"tracking_code": "B025A23A",

"status": "success"

},

{

"invoice": "230822-1",

"recipient_name": "John Doe",

"recipient_address": "House 44, Road 2/A, Dhanmondi, Dhaka 1209",

"recipient_phone": "0171111111",

"cod_amount": "0.00",

"note": null,

"consignment_id": 11543971,

"tracking_code": "B025A3FA",

"status": "success"

},

]


If there is any error in data your will get response like

"data": [

{

"invoice": "230822-1",

"recipient_name": "John Doe",

"recipient_address": "House 44, Road 2/A, Dhanmondi, Dhaka 1209",

"recipient_phone": "0171111111",

"cod_amount": "0.00",

"note": null,

"consignment_id": null,

"tracking_code": null,

"status": "error"

},

]


Checking Delivery Status
        


i) By Consignment ID


                Path: /status_by_cid/{id}

Method: GET


        ii) By Your invoice ID

                Path: /status_by_invoice/{invoice}

                Method: GET


        iii) By Tracking Code

                Path: /status_by_trackingcode/{trackingCode}

                Method: GET

                

        

        Response:

        

        {

    "status": 200,

    "delivery_status": "in_review"

}




Delivery Statuses:


Name

Description

pending

Consignment is not delivered or cancelled yet.

delivered_approval_pending

Consignment is delivered but waiting for admin approval.

partial_delivered_approval_pending

Consignment is delivered partially and waiting for admin approval.

cancelled_approval_pending

Consignment is cancelled and waiting for admin approval.

unknown_approval_pending

Unknown Pending status. Need contact with the support team.

delivered

Consignment is delivered and balance added.

partial_delivered

Consignment is partially delivered and balance added.

cancelled

Consignment is cancelled and balance updated.

hold

Consignment is held.

in_review

Order is placed and waiting to be reviewed.

unknown

Unknown status. Need contact with the support team.



5. Checking Current Balance


        Path: /get_balance

        Method: GET


Response:

 {

    "status": 200,

    "current_balance": 0

}





be careful if steadfast api doesnt have sandbox url
auto-courier order disabled by default