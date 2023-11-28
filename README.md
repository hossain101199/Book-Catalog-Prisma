# Book catalog API Documentation:

## Live Link: https://book-catalog-prisma-hossain101199.vercel.app/

# **AUTH**

## Endpoint: POST https://book-catalog-prisma-hossain101199.vercel.app/api/v1/auth/signup

**Description:** This endpoint is used to sign up and create a new user.

**Request Body:**

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpassword",
  "role": "ADMIN",
  "contactNo": "123-456-7890",
  "address": "123 Main St",
  "profileImg": "admin.jpg"
}
```

```json
{
  "name": "Customer One",
  "email": "customer1@example.com",
  "password": "customerpassword1",
  "contactNo": "987-654-3210",
  "address": "456 Elm St",
  "profileImg": "customer1.jpg"
}
```

## Endpoint: POST https://book-catalog-prisma-hossain101199.vercel.app/api/v1/auth/signin

**Description:** This endpoint is used to sign in user.

**Request Body:**

```json
{
  "email": "customer1@example.com",
  "password": "customerpassword1"
}
```

```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Response:** When the user logs in, they will receive an access token in the response.

```json
{
  "statusCode": 200,
  "success": true,
  "message": "User signin successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkMTc5OTBkLWJhY2YtNDNhMC1iNDYwLTM4NDg0Mjg1MzgzNyIsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTY5Njk0OTAyNywiZXhwIjoxNzI4NDg1MDI3fQ.UXt_x5vjQgTIRP3v63yMym7xu6jSSB1GeN2r3kVfDO0"
  }
}
```

# **USERS**

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/users

**Description:** This endpoint is used to retrieve a list of users.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

**Query Parameters:**

- `searchTerm` : A search term to filter users based on certain fields.
- `name` : Filter users by name.
- `phoneNumber` : Filter users by phone number.
- `address` : Filter users by address.
- `page` : The page number for pagination. Default is 1.
- `limit` : The number of users to return per page. Default is 10.
- `sortBy` : The field to sort the users by.
- `sortOrder` : The sort order for the users. Valid values are "asc" for ascending and "desc" for descending.

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/users/:id

**Description:** This endpoint is used to retrieve a single user by their ID.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

## Endpoint: PATCH https://book-catalog-prisma-hossain101199.vercel.app/api/v1/users/:id

**Description:** This endpoint allows to modify user information.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

**Request Body:**

```json
{
  "name": "Customer 2"
}
```

## Endpoint: DELETE https://book-catalog-prisma-hossain101199.vercel.app/api/v1/users/:id

**Description:** This endpoint is used to delete a user by their ID.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

# **PROFILE**

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/profile

**Description:** This endpoint allows the user to fetch their own profile information.

**Headers:** `Authorization` : [access_token]

# **categories**

## Endpoint: POST https://book-catalog-prisma-hossain101199.vercel.app/api/v1/categories

**Description:** This endpoint is used to create a new category.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

**Request Body:**

```json
{
  "title": "Science"
}
```

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/categories

**Description:** This endpoint is used to retrieve a list of categories based on specified filters and pagination options.

**Access:** This endpoint is accessible to all users

**Query Parameters:**

- `searchTerm` : Search term to filter category by specific fields.
- `title` : Filter category by title.
- `page` : Page number for pagination.
- `limit` : Number of results to include per page.
- `sortBy` : Field to sort the results by.
- `sortOrder` : Sort order for the results (asc for ascending, desc for descending).

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/categories/:id

**Description:** This endpoint is used to retrieve a single category by ID.

**Access:** This endpoint is accessible to all users

## Endpoint: PATCH https://book-catalog-prisma-hossain101199.vercel.app/api/v1/categories/:id

**Description:** This endpoint is used to update a category by ID.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

**Request Body:**

```json
{
  "title": "Science 2"
}
```

## Endpoint: DELETE https://book-catalog-prisma-hossain101199.vercel.app/api/v1/categories/:id

**Description:** This endpoint is used to delete a category by ID.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

# **Books**

## Endpoint: POST https://book-catalog-prisma-hossain101199.vercel.app/api/v1/books

**Description:** This endpoint is used to create book.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

**Request Body:**

```json
{
  "title": "The Adventures of Sci-Fi Heroes",
  "author": "Alice Sci-Fi",
  "price": 26.99,
  "genre": "Science Fiction",
  "publicationDate": "2023-01-05",
  "categoryId": "af2aa664-da28-4b91-affc-6bd0c41da9a9"
}
```

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/books

**Description:** This endpoint is used to retrieve a list of books based on specified filters and pagination options.

**Access:** This endpoint is accessible to all users

**Query Parameters:**

- `searchTerm` : Search term to filter books by specific fields.
- `title` : Filter books by title.
- `author` : Filter books by author.
- `genre` : Filter books by genre.
- `publicationDate` : Filter category by publicationDate.
- `categoryId` : Filter books by categoryId.
- `minPrice` : Filter books by minimum price.
- `maxPrice` : Filter books by maximum price.
- `page` : Page number for pagination.
- `limit` : Number of results to include per page.
- `sortBy` : Field to sort the results by.
- `sortOrder` : Sort order for the results (asc for ascending, desc for descending).

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/books/:categoryID/category

**Description:** This endpoint is used to retrieve a list of books based on catedoryID.

**Access:** This endpoint is accessible to all users

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/books/:ID

**Description:** This endpoint is used to retrieve a books based on ID.

**Access:** This endpoint is accessible to all users

## Endpoint: PATCH https://book-catalog-prisma-hossain101199.vercel.app/api/v1/books/:ID

**Description:** This endpoint is used to update book.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

**Request Body:**

```json
{
  "price": 26.99
}
```

## Endpoint: DELETE https://book-catalog-prisma-hossain101199.vercel.app/api/v1/books/:ID

**Description:** This endpoint is used to delete book.

**Access:** This endpoint is restricted to administrators only.

**Headers:** `Authorization` : [access_token]

# **ORDERS**

## Endpoint: POST https://book-catalog-prisma-hossain101199.vercel.app/api/v1/orders

**Description:** This endpoint is used to create an order.

**Access:** This endpoint is restricted to customer only.

**Headers:** `Authorization` : [access_token]

**Request Body:**

```json
{
  "orderedBooks": [
    {
      "bookId": "c9ee79b5-6b8e-4a6c-aa6b-8e42ca60e415",
      "quantity": 4
    }
  ]
}
```

```json
{
  "orderedBooks": [
    {
      "bookId": "c9ee79b5-6b8e-4a6c-aa6b-8e42ca60e415",
      "quantity": 2
    },
    {
      "bookId": "c9ee79b5-6b8e-4a6c-aa6b-565669498566",
      "quantity": 1
    }
  ]
}
```

- `bookId` : The ID of the book being purchased.

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/orders

**Description:** This endpoint is used to retrieve a list of orders.

**Access:**

- Admin: Admin users can access this endpoint to retrieve all orders across the platform.
- Customer: Customer can access this endpoint to retrieve their own orders.

**Headers:** `Authorization` : [access_token]

## Endpoint: GET https://book-catalog-prisma-hossain101199.vercel.app/api/v1/orders/:id

**Description:** This endpoint is used to retrieve a specific order based on its ID.

**Access:**

- Admin: Admin can access this endpoint to retrieve any order, regardless of the associated customer.
- Customer: Customer can access this endpoint to retrieve their own orders.

**Headers:** `Authorization` : [access_token]


```.env
NODE_ENV=development

PORT=

DATABASE_URL=

BCRYPT_SALT_ROUNDS=

JWT_SECRET=
JWT_EXPIRES_IN=

```

## Your Feedback Matters

Your opinion and feedback are essential to me! I value your input as it helps me improve and grow. If you have any questions, suggestions, please don't hesitate to reach out. Your feedback will help me tailor future content to your needs.

Thank you for joining me on this journey to build a professional Node.js project. I look forward to guiding you through the implementation of user authentication and helping you become a more skilled and confident developer. Stay tuned for the next chapters!

## Contact

If you have any questions or feedback, feel free to contact me:

- Mohammad Hossain - [Linkedin](https://www.linkedin.com/in/hossain1011/) - fshossain10@gmail.com

[![LinkedIn][linkedin-shield]][linkedin-url]

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/hossain1011/

**Happy coding! 🚀**
