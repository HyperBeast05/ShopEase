# ShopEase

ShopEase is a full-stack e-commerce web application built with React, Node.js, Express.js, and MySQL.

It provides a complete shopping experience for customers along with an admin dashboard for managing products, categories, customers, and orders.

## Features

### Customer Features

- User registration and login
- JWT-based authentication
- Forgot password functionality
- Password reset through email
- Product browsing
- Product details
- Category-based product filtering
- Shopping cart
- Checkout
- Order placement
- Order history
- Order details
- Order cancellation
- User profile management
- Change password
- Responsive user interface

### Admin Features

- Admin dashboard
- Product management
- Add products
- Edit products
- Delete products
- Category management
- Customer management
- Customer details
- Order management
- Order details
- Order status management

## Tech Stack

### Frontend

- React
- React Router
- Bootstrap
- React Icons
- Axios
- Formik
- Yup
- Vite

### Backend

- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- Nodemailer
- dotenv
- CORS

### Database

- MySQL
- MySQL Workbench

## Project Structure

```text
ShopEase/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/HyperBeast05/ShopEase.git
```

```bash
cd ShopEase
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=ecommerce_db
DB_PORT=3306

JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d

FRONTEND_URL=http://localhost:5173

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_login
SMTP_PASSWORD=your_brevo_smtp_key
SMTP_FROM_EMAIL=your_verified_sender_email
SMTP_FROM_NAME=ShopEase
```

### 3. Database Setup

Make sure MySQL is installed and running.

Create the database:

```sql
CREATE DATABASE ecommerce_db;
```

The backend uses MySQL for storing users, products, categories, carts, orders, and related application data.

Configure the database credentials in the backend `.env` file.

### 4. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

You can verify the API by opening:

```text
http://localhost:5000/
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## Environment Variables

### Backend

The following environment variables are required:

| Variable          | Description                        |
| ----------------- | ---------------------------------- |
| `PORT`            | Backend server port                |
| `DB_HOST`         | MySQL host                         |
| `DB_USER`         | MySQL username                     |
| `DB_PASSWORD`     | MySQL password                     |
| `DB_NAME`         | MySQL database name                |
| `DB_PORT`         | MySQL port                         |
| `JWT_SECRET`      | Secret used for JWT authentication |
| `JWT_EXPIRES`     | JWT expiration time                |
| `FRONTEND_URL`    | Frontend URL used for CORS         |
| `SMTP_HOST`       | SMTP server host                   |
| `SMTP_PORT`       | SMTP server port                   |
| `SMTP_USER`       | SMTP login                         |
| `SMTP_PASSWORD`   | SMTP key/password                  |
| `SMTP_FROM_EMAIL` | Verified sender email              |
| `SMTP_FROM_NAME`  | Sender name                        |

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

## Authentication

ShopEase uses JWT-based authentication.

After successful login, the authentication token is stored on the client and automatically attached to API requests using an Axios interceptor.

Protected routes require authentication, while admin routes require appropriate admin authorization.

## Email Functionality

ShopEase uses Nodemailer with Brevo SMTP for email functionality.

Email functionality is used for password reset operations.

SMTP credentials are stored in environment variables and are not committed to the repository.

## API

The backend exposes REST API endpoints for:

- Authentication
- Users
- Products
- Categories
- Cart
- Orders

The API is consumed by the React frontend using Axios.

## Security

The project follows several basic security practices:

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Admin authorization
- Environment variables for sensitive configuration
- SMTP credentials kept outside the source code
- `.env` files excluded from Git

## Responsive Design

The frontend uses Bootstrap to provide a responsive interface across desktop, tablet, and mobile screen sizes.

React Icons are used throughout the application for UI icons.

## Development

Run the backend and frontend separately during development.

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Future Improvements

Possible future improvements include:

- Online payment gateway integration
- Product image upload and cloud storage
- Product reviews and ratings
- Wishlist functionality
- Search and advanced filtering
- Pagination improvements
- Sales analytics
- Production deployment
- Automated testing
- CI/CD integration

## License

This project is developed for learning and portfolio purposes.
