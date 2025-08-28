Event Booking Project
Welcome to the Event Booking Project! This is a full-stack application designed to manage events, ticket bookings, and user reservations. It provides a clear separation of roles, allowing users to browse and book events, while admins have full control over event creation and management.
🎯 Key Features

User Authentication: Secure user registration and login using JSON Web Tokens (JWT).
Event Management: A dedicated admin panel for creating, updating, and deleting events.
Ticket Booking: A seamless process for users to browse upcoming events and book tickets.
Booking History: Users can easily view and manage their past and upcoming reservations.
Robust Database: Powered by MySQL for reliable and structured data storage.

💻 Tech Stack
This project is built on the MERN stack with a relational database.
Frontend

React: A component-based JavaScript library for building dynamic user interfaces.
Vite: A next-generation frontend tool for a fast development experience.
Axios: A promise-based HTTP client to handle API requests.

Backend

Node.js: A powerful JavaScript runtime environment.
Express.js: A fast and minimalist web framework for Node.js.
MySQL: The relational database for storing application data.
JWT: For token-based authentication.
Bcrypt: For securely hashing and storing user passwords.

⚙️ Getting Started
Follow these instructions to set up and run the project locally.
1. Clone the Repository
git clone https://github.com/your-username/Event-Booking-Project.git
cd Event-Booking-Project

2. Backend Setup
Navigate to the server/ directory:
cd server

a. Install Dependencies
npm install

b. Configure Environment Variables
Create a .env file in the server/ folder with the following configuration:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=event_booking
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:5173

c. Database Setup

Open MySQL Workbench.
Create a new connection to your local MySQL instance.
Open a new SQL query tab.
Copy the contents of the event_booking.sql file and paste them into the query tab.
Execute the script to create the database and tables, including sample data.

d. Run the Server
npm run dev

The backend server will run on http://localhost:5000.
3. Frontend Setup
Navigate to the client/ directory:
cd ../client

a. Install Dependencies
npm install

b. Configure Environment Variables
Create a .env file in the client/ folder with the following:
VITE_BACKEND_URL=http://localhost:5000

c. Run the Application
npm run dev

The frontend application will start on http://localhost:5173.
📂 Project Structure
Event-Booking-Project/
│
├── client/                  # React (Vite) frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Main application pages
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Entry point
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Node.js + Express backend
│   ├── controllers/         # Logic for handling requests
│   ├── middleware/          # Middleware functions (e.g., auth)
│   ├── models/              # Database schema and queries
│   ├── routes/              # API endpoints
│   ├── .env
│   ├── package.json
│   └── server.js            # Entry point for the server
│
├── event_booking.sql        # MySQL database schema and initial data
└── README.md

☁️ Deployment

Backend: Deploy on Render or Vercel with the root directory set to server.
Frontend: Deploy on Netlify or Vercel with the build output directory set to dist.

🙏 Credits

Node.js
Express.js
React
MySQL

🤝 Contributing
Feel free to contribute, report issues, or suggest new features! Fork the repository, create a new branch, and submit a pull request.
