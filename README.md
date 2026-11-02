# ShopEase – Full-Stack E-Commerce Application

ShopEase is a full-stack e-commerce web application built to provide a simple online shopping experience with separate customer and administrator functionalities.

The application allows customers to browse products, manage their shopping cart, place orders and track their purchases. Administrators can manage products, categories, customers and customer orders through an admin dashboard.

## Features

### Customer Features

- User registration and login
- JWT-based authentication
- Browse and search products
- View product details
- Add and manage shopping cart items
- Place orders
- View order history and order details
- Track order status
- Manage user profile
- Change password
- Forgot password and password reset through email

### Admin Features

- Admin dashboard
- Manage products (add, edit and delete)
- Manage product categories
- View and manage customers
- View customer details
- Manage customer orders
- Update order status

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Bootstrap 5
- React Icons
- React Router
- Axios
- Formik
- Yup

### Backend

- Node.js
- Express.js
- JavaScript ES Modules
- MySQL2
- JSON Web Token (JWT)
- bcryptjs
- Nodemailer

### Database

- MySQL

### Development Tools

- Visual Studio Code
- MySQL Workbench
- Git and GitHub
- Postman

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
│   ├── package.json
│   └── server.js
│
├── database/
│   └── shopease.sql
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
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run ShopEase locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MySQL Server
- MySQL Workbench (optional)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/HyperBeast05/ShopEase.git
```

Navigate into the project directory:

```bash
cd ShopEase
```

### 2. Set Up the Database

1. Start your MySQL server.
2. Open MySQL Workbench.
3. Open the SQL file located at `database/shopease.sql`.
4. Execute the SQL script to create the ShopEase database and its tables.

The database name is:

```text
shopease_db
```

**Important:** The supplied SQL script is intended for a fresh installation. It drops existing application tables before recreating them. Back up any existing data before executing it.

### 3. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file by copying `.env.example`.

Configure the following variables:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shopease_db
DB_PORT=3306

JWT_SECRET=your_secure_random_secret
JWT_EXPIRES=7d

FRONTEND_URL=http://localhost:5173

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_login
SMTP_PASSWORD=your_brevo_smtp_key
SMTP_FROM_EMAIL=your_verified_sender_email
SMTP_FROM_NAME=ShopEase
```

Replace the example values with your own database credentials, a secure JWT secret and valid SMTP credentials.

Start the backend development server:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### 4. Configure the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`.

Configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Available Scripts

### Backend

| Command       | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Start backend with Nodemon |
| `npm start`   | Start backend server       |

### Frontend

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start Vite development server |
| `npm run build`   | Create production build       |
| `npm run preview` | Preview production build      |
| `npm run lint`    | Run ESLint checks             |

## Security

- Password hashing using bcryptjs
- JWT-based authentication
- Role-based authorization for admin routes
- Protected frontend routes
- Backend request validation
- Password reset using email tokens
- Environment variables for sensitive configuration

## Future Improvements

- Integrate an online payment gateway
- Add product reviews and ratings
- Improve product filtering and sorting
- Add product image upload functionality

## Author

**ShopEase – Full-Stack E-Commerce Portfolio Project**

GitHub: https://github.com/HyperBeast05/ShopEase

---

_Built as a full-stack portfolio project to demonstrate frontend development, backend API development, database management and application integration._
