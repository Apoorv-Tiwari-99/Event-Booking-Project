🎫 Event Booking Project (MERN + MySQL)
A full-stack event booking system where users can browse events, book tickets, and manage reservations, while admins can create/manage events and track bookings.

This project is built using the MERN stack, with a slight twist: Node.js + Express for the backend, React (Vite) for the frontend, and a MySQL database for persistence.

🚀 Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens).

Event Management: Admins can create, update, and delete events.

Ticket Booking: Users can browse upcoming events and book tickets.

Booking Management: Users can view and manage their reservations.

MySQL Database: Integration with a robust relational database for data storage.

💻 Tech Stack
Frontend:

React: A JavaScript library for building user interfaces.

Vite: A fast, modern build tool for frontend development.

Axios: A promise-based HTTP client for making API requests.

Backend:

Node.js: A JavaScript runtime for server-side development.

Express.js: A minimal and flexible Node.js web application framework.

MySQL: A popular open-source relational database management system.

JWT: For secure authentication.

Bcrypt: For password hashing.

⚙️ Setup and Installation
Follow these steps to get the project up and running on your local machine.

1. Clone the repository
git clone https://github.com/your-username/Event-Booking-Project.git

2. Backend Setup (server/)
Navigate to the server/ directory:

cd Event-Booking-Project/server

a. Install dependencies

npm install

b. Configure Environment Variables
Create a .env file in the server/ folder and add the following:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=event_booking

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:5173

c. Database Setup (MySQL Workbench)

Open MySQL Workbench.

Create a new connection using your MySQL credentials.

Open a new SQL query tab and copy-paste the contents of event_booking.sql from the project's root directory.

Execute the script to create the database and tables with sample data.

d. Run the Backend

npm run dev

The backend server will start on http://localhost:5000.

3. Frontend Setup (client/)
Navigate to the client/ directory from the root folder:

cd ../client

a. Install dependencies

npm install

b. Configure Environment Variables
Create a .env file in the client/ folder and add the following:

VITE_BACKEND_URL=http://localhost:5000

c. Run the Frontend

npm run dev

The frontend will start on http://localhost:5173.

📂 Project Structure
Event-Booking-Project/
│
├── client/          # React (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/          # Node.js + Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── event_booking.sql  # MySQL database schema and data
└── README.md


Feel free to contribute, report issues, or suggest new features!
