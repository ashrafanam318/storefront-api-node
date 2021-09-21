# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index -> GET: `/products`
  - sample response

    ```
        [
            {
                "id": 1,
                "name": "Energy Plus",
                "price": "10",
                "category": "snacks"
            },
            {
                "id": 2,
                "name": "Cornelly Cone Ice Cream",
                "price": "40",
                "category": "snacks"
            }
        ]
    ```

- Show -> GET: `/products/:id`
   - sample response 

     ```
        {
            "id": 3,
            "name": "Coca Cola 1 Litre",
            "price": "50",
            "category": "Soft Drink"
        }
     ```
- Create [token required] -> POST: `/products`
  - request headers
    ```
        {
            "Authorization": "jwt <jwt token>"
        }
    ```
  - request body
    ```
        {
            name: string,
            price: string,
            category: string
        }
    ```

  - sample response
    ```
        {
            "id": 2,
            "name": "Cornelly Cone Ice Cream",
            "price": "40",
            "category": "snacks"
        }
    ```
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required] GET: `/users`
  - request headers
    ```
        {
            "Authorization": "jwt <jwt token>"
        }
    ```  
  - sample response

    ```
        [
            {
                "id": 1,
                "firstname": "John",
                "lastname": "Doe",
                "username": "john1"
            },
            {
                "id": 2,
                "firstname": "John",
                "lastname": "Doe The II",
                "username": "john2"
            }
        ]
    ```

- Show [token required] -> GET: `/users/:id`
  - request headers
    ```
        {
            "Authorization": "jwt <jwt token>"
        }
    ```
   - sample response 

     ```
        {
            "id": 1,
            "firstname": "John",
            "lastname": "Doe",
            "username": "john1"
        }
     ```
- Create (returns new jwt token) -> POST: `/users`
  - request body
    ```
        {
            firstname: string,
            lastname: string,
            username: "string",
            password: "string"
        }
    ```

  - sample response
    ```
        {
            "jwt": "eyJhbGciOiJsdfllsjrI1nR5dfsfcCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6InByaXRsdflsjf3IiwiZmlyc3RuYW1lIjoiUnVsIiwibGFzdG5hbWUiOiJBbmsdfsdf0sImlhdCI6MTYzMjEyNTQyNn0.RbxQz25lAhm1Z4FZCBf6ipEekslrtcIEnJ9lPJspkULI"
        }
    ```

- Sign in (returns new jwt token) -> POST: `/users/signin`
  - request body
    ```
        {
            username: "string",
            password: "string"
        }
    ```

  - sample response
    ```
        {
            "jwt": "eyJhbGciOiJsdfllsjrI1nR5dfsfcCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyLCJ1c2VybmFtZSI6InByaXRsdflsjf3IiwiZmlyc3RuYW1lIjoiUnVsIiwibGFzdG5hbWUiOiJBbmsdfsdf0sImlhdCI6MTYzMjEyNTQyNn0.RbxQz25lAhm1Z4FZCBf6ipEekslrtcIEnJ9lPJspkULI"
        }
    ```
#### Orders
- Current Order by user (args: user id)[token required] -> GET: `/:user_id/orders/active`
  - request headers
    ```
        {
            "Authorization": "jwt <jwt token>"
        }
    ```
  - response structure
    ```
        {
            [order_id: string] : Array<{
                quantity: number,
                product: {
                    id: integer,
                    name: string,
                    price: string,
                    category: string
                }
            }>
        }
    ```
  
  - sample response
    ```
        {
            "6": [
                {
                    "quantity": 5,
                    "product": {
                        "id": 2,
                        "name": "Cornelly Cone Ice Cream",
                        "price": "40",
                        "category": "snacks"
                    }
                },
                {
                    "quantity": 1,
                    "product": {
                        "id": 3,
                        "name": "Coca Cola 1 Litre",
                        "price": "50",
                        "category": "Soft Drink"
                    }
                }
            ]
        }
    ```
- Create Order -> POST: `/:user_id/orders`
  
  - request headers
    ```
        {
            "Authorization": "jwt <jwt token>"
        }
    ```

  - request body
    ```
        Array<{
            product_id: number, 
            quantity: number
        }>
    ```

  - sample response
    ```
        {
            id: 6,
            user_id: 1,
            status: "active"
        }
    ```

- Complete an Order -> PUT: `/orders/:order_id/complete`
  - request headers
    ```
        {
            "Authorization": "jwt <jwt token>"
        }
    ```
  - sample response  
    ```
        {
            id: 6,
            user_id: 1,
            status: "complete"
        }
    ```
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
```
TABLE: products
    id: integer, auto incrimenting, PK;
    name: varchar, length 100;
    price: varchar, length 30;
    category: varchar, length 50;
```

#### User
```
TABLE: users
    id: integer, auto incrimenting, PK;
    firstname: varchar, length 100;
    lastname: varchar, length 100;
    username: varchar, length 50;
    password_hash: long text;
```

#### Orders
```
TABLE: orders
    id: integer, auto incrimenting, PK;
    status: varchar, length 8;
    user_id: integer, FK references users:id;
```

#### Order Products
```
TABLE: order_products
    id: integer, auto incrimenting, PK;
    order_id: integer, FK references orders:id;
    product_id: integer, FK references products:id;
    quantity: small integer
```

## DB Schema

![download](https://user-images.githubusercontent.com/26758476/134123467-e03ea108-a798-4675-8eb2-c8abc20234db.png)

