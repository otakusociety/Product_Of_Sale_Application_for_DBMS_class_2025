# Product_Of_Sale_Application_for_DBMS_class_2025

# Team Members: [1 Abrokwa Seth Kwaku-ANU23400065, ]

Right so first off, idek, im too tired to use proper punctuation its 4 in the morning. Read the stuffs below. It will show you how this works or just use the link above idc. -Seth

📚 API Documentation

You can find the full API documentation generated using Swagger UI. It’s available at: http://localhost:5000/api-docs/


API Documentation
💡 API Endpoints
1. Get All Products - GET /api/products

Fetches a list of all products.

    Response:
        200 OK - A list of products.
        500 Internal Server Error - If something goes wrong(Remember this please).

2. Add a New Product - POST /api/products

Adds a new product to the database.

    Request Body:

    {
      "name": "Product Name",
      "price": 99.99,
      "stock": 10
    }

    Response:
        201 Created - Returns the newly created product.
        500 Internal Server Error - If something goes wrong.

3. Update a Product - PUT /api/products/:id

Updates an existing product by its ID.

    Parameters:
        id: The ID of the product to be updated.

    Request Body:

    {
      "name": "Updated Product",
      "price": 129.99,
      "stock": 20
    }

    Response:
        200 OK - Returns the updated product.
        404 Not Found - If the product doesn't exist.
        500 Internal Server Error - If something goes wrong.

4. Delete a Product - DELETE /api/products/:id

Deletes a product by its ID.

    Parameters:
        id: The ID of the product to delete.

    Response:
        200 OK - Returns a success message.
        404 Not Found - If the product doesn't exist.
        500 Internal Server Error - If something goes wrong.

5. Search Products by Name - GET /api/products/search

Searches products by their name (case-insensitive).

    Query Parameters:
        name: The name (or part of it) to search for.

    Response:
        200 OK - A list of matching products.
        400 Bad Request - If the name parameter is missing.
        500 Internal Server Error - If something goes wrong.

6. Filter Products by Price Range - GET /api/products/filter

Filters products based on a minimum and/or maximum price.

    Query Parameters:
        minPrice: Minimum price.
        maxPrice: Maximum price.

    Response:
        200 OK - A list of filtered products.
        500 Internal Server Error - If something goes wrong.

🌐 Access Swagger UI

You can easily visualize and test the API endpoints using Swagger UI. Visit the following URL to access the interactive documentation:

Swagger UI Documentation
🛠️ Security

For better security, the API is equipped with Helmet middleware to secure HTTP headers.
📦 Deployment

You can deploy this API to services like Heroku, Vercel, or Render by following their respective deployment guides.

    Deploy to Heroku: Heroku Deployment Guide
    Deploy to Vercel: Vercel Deployment Guide
    Deploy to Render: Render Deployment Guide

🧪 Testing

i was too lazy to pu in automated tests. You can manually test the API using Swagger UI, again use the damn link.


📝 Contributing
Harith, and Owen, should have acces to this, i think. IDK😊


📫 Contact



🎉 License

This project is licensed under the MIT License.

This project was for the DBSM course taken in febuary of 2025. 
Thank you

