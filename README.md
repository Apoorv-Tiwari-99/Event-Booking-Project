# 🎫 Event Booking Project (MERN + MySQL)

A full-stack event booking system where users can browse events, book tickets, and manage reservations, while admins can create/manage events and track bookings.  
This project uses **Node.js + Express + MySQL** for the backend and **React (Vite)** for the frontend.

---

## 📌 Backend Setup (server/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Event-Booking-Project.git
cd Event-Booking-Project/server
2. Install dependencies
npm install

3. Configure Environment Variables

Create a .env file inside the server/ folder and add:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=event_booking

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:5173

4. Database Setup (MySQL Workbench)

Open MySQL Workbench.

Create a new connection using your credentials (replace password in .env with yours).

Open the connection and create a new SQL query tab.

Copy-paste the contents of event_booking.sql (provided in this repo).

Execute the script ✅ to create the database and tables.

5. Run the Backend
npm run dev


Backend will start on http://localhost:5000

📌 Frontend Setup (client/)
1. Move into client folder
cd ../client

2. Install dependencies
npm install

3. Configure Environment Variables

Create a .env file inside the client/ folder and add:

VITE_BACKEND_URL=http://localhost:5000

4. Run the Frontend
npm run dev


Frontend will start on http://localhost:5173

🚀 Deployment

Backend: Can be deployed on Render
 (Root Directory = server)

Frontend: Can be deployed on Vercel
 or Netlify
 (Build output = dist)

📂 Project Structure
Event-Booking-Project/
│── client/   # React (Vite) frontend
│── server/   # Node.js + Express backend
│── event_booking.sql # Database schema
│── README.md

✅ Features

User authentication with JWT

Browse upcoming events

Book tickets

Admin can create/manage events

MySQL database integration
