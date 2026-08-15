# 💻 CodeArena

*A Full-Stack Coding Contest Management Platform*

---

## 💡 Overview

**CodeArena** is a **full-stack web-based coding contest management platform** designed to provide a centralized environment for creating, organizing, participating in, and managing programming contests.

The platform enables **students to participate in coding contests**, **organizers to create and manage contests**, and **administrators to manage users, problems, submissions, and platform activities**.

CodeArena focuses on providing a **responsive, scalable, and user-friendly experience** with role-based access control, contest management, problem management, submissions, leaderboards, notifications, and analytics.

The project is built using:

* **React.js + TypeScript** for the frontend
* **Node.js + Express.js + TypeScript** for the backend
* **PostgreSQL** for data storage
* **Prisma ORM** for database management
* **JWT** for authentication and authorization
* **Tailwind CSS** for responsive UI development

---

## 🧩 Key Features

### 👨‍💻 Student Features

* 📝 Browse and participate in available coding contests
* 💻 View contest problems and submit solutions
* 📊 Track submission status and scores
* 🏆 View real-time contest leaderboards
* 👤 Manage personal profile and account settings
* 🔔 Receive contest and platform notifications
* 📜 View earned certificates and achievements

### 🧑‍💼 Organizer Features

* ➕ Create and manage coding contests
* 📚 Create and maintain problem sets
* ⏰ Configure contest start and end times
* 📊 Monitor participant submissions
* 🏆 Manage contest rankings and leaderboards
* 📈 View contest-level analytics
* 🔔 Send notifications to participants

### 🛡️ Admin Features

* 👥 Manage registered users
* 🔐 Manage role-based permissions
* 📋 Monitor contests and problems
* 📊 View platform-level analytics
* ⚙️ Manage platform settings
* 🚨 Monitor system activities and submissions

---

## 🏗️ System Architecture

CodeArena follows a **client-server architecture** where the React frontend communicates with the Express backend through RESTful APIs.

```text
                    ┌─────────────────────┐
                    │      CodeArena      │
                    │      Frontend       │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      Backend        │
                    │ Node.js + Express   │
                    │    + TypeScript     │
                    └──────────┬──────────┘
                               │
                               │ Prisma ORM
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
```

### 🔄 Application Flow

```text
User
 │
 ▼
React Frontend
 │
 ▼
Authentication / Authorization
 │
 ▼
REST API
 │
 ▼
Express Backend
 │
 ▼
Prisma ORM
 │
 ▼
PostgreSQL Database
 │
 ▼
Response
 │
 ▼
React UI
```

---

## 🛠️ Technologies Used

| **Technology**   | **Purpose**                        |
| ---------------- | ---------------------------------- |
| **React.js**     | Frontend user interface            |
| **TypeScript**   | Type-safe application development  |
| **Tailwind CSS** | Responsive and modern UI styling   |
| **Node.js**      | Backend JavaScript runtime         |
| **Express.js**   | REST API and backend services      |
| **PostgreSQL**   | Relational database                |
| **Prisma**       | Database ORM and schema management |
| **JWT**          | Authentication and authorization   |
| **Git & GitHub** | Version control and collaboration  |
| **Vercel**       | Frontend deployment                |
| **Render**       | Backend deployment                 |
| **Neon**         | Cloud PostgreSQL database          |

---

## 📂 Project Structure

```text
CodeArena/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── contexts/
│       ├── utils/
│       ├── types/
│       └── App.tsx
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

> **Note:** The exact folder structure may vary depending on the current implementation of the repository.

---

## 🔐 Authentication & Authorization

CodeArena uses **JWT-based authentication** to securely manage user sessions.

The platform implements **Role-Based Access Control (RBAC)** with three primary roles:

| **Role**            | **Access**                                                                  |
| ------------------- | --------------------------------------------------------------------------- |
| 👨‍💻 **Student**   | Participate in contests, solve problems, submit solutions and view rankings |
| 🧑‍💼 **Organizer** | Create contests, manage problems and monitor participants                   |
| 🛡️ **Admin**       | Manage users, contests, problems and platform-level activities              |

Protected API routes verify the user's authentication token and role before allowing access to restricted resources.

---

## 🗄️ Database

CodeArena uses **PostgreSQL** as its primary database with **Prisma ORM** for database interaction.

The database manages entities such as:

```text
User
 │
 ├── Roles
 ├── Profiles
 ├── Submissions
 └── Notifications

Contest
 │
 ├── Problems
 ├── Participants
 ├── Submissions
 └── Leaderboard

Problem
 │
 ├── Test Cases
 ├── Submissions
 └── Contest
```

Prisma provides type-safe database queries and simplifies schema migrations and database management.

---

## ⚙️ How to Run

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/CodeArena.git
cd CodeArena
```

---

### Step 2: Setup the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

### Step 3: Setup the Frontend

Open a new terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file if required:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

### Frontend

```env
VITE_API_URL=
```

> Never commit `.env` files or expose database credentials and secret keys in the repository.

---

## 📊 Core Modules

### 🏆 Contest Management

Organizers can create contests with configurable:

* Contest title and description
* Start and end times
* Problem sets
* Participant information
* Contest status
* Leaderboard

### 🧩 Problem Management

Problems can be associated with contests and contain:

* Problem statements
* Difficulty levels
* Input/output descriptions
* Constraints
* Test cases
* Submission information

### 📤 Submission Management

Participants can submit their solutions through the platform.

The submission workflow tracks:

```text
Problem Selection
       ↓
Code Submission
       ↓
Submission Processing
       ↓
Result / Score
       ↓
Leaderboard Update
```

### 🏆 Leaderboard

The leaderboard provides participants with a ranking based on their contest performance.

It allows users to:

* View rankings
* Compare scores
* Track contest performance
* Monitor their position

### 📈 Analytics

Organizers and administrators can access analytics related to:

* Contest participation
* Submission activity
* Problem performance
* User activity
* Contest statistics

---

## ⚡ Performance & User Experience

CodeArena focuses on providing a responsive and efficient user experience through:

* ⚡ Lazy-loaded frontend routes
* 📦 Component-based React architecture
* 🔄 Efficient API communication
* 🗃️ Optimized database queries
* 📱 Responsive UI design
* 🔐 Protected API endpoints
* 🧩 Reusable UI components

---

## 🖼️ Demo / Screenshots

The following screenshots can be added to showcase the main CodeArena workflows:

### 🏠 Dashboard

![CodeArena Dashboard](screenshots/dashboard.png)

### 🏆 Contest Page

![Contest Page](screenshots/contest.png)

### 💻 Problem Solving

![Problem Solving](screenshots/problem.png)

### 📊 Leaderboard

![Leaderboard](screenshots/leaderboard.png)

### 👤 User Profile

![User Profile](screenshots/profile.png)

> Replace the image paths above with the actual screenshots available in your repository.

---

## 🚀 Deployment

CodeArena can be deployed using the following infrastructure:

| **Component**       | **Platform** |
| ------------------- | ------------ |
| Frontend            | Vercel       |
| Backend             | Render       |
| PostgreSQL Database | Neon         |

### Deployment Architecture

```text
                    Internet
                       │
                       ▼
                ┌──────────────┐
                │    Vercel    │
                │   Frontend   │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │    Render    │
                │   Backend    │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │     Neon     │
                │  PostgreSQL  │
                └──────────────┘
```

---

## 🧪 Testing

The application can be tested across different user roles and workflows.

### Authentication Testing

* User registration
* User login
* JWT validation
* Protected routes
* Role-based access

### Contest Testing

* Contest creation
* Contest participation
* Contest scheduling
* Problem association
* Submission handling
* Leaderboard generation

### UI Testing

* Responsive layouts
* Navigation
* Form validation
* Error handling
* Loading states
* Dashboard interactions

---

## 🧭 Future Enhancements

* 🤖 **Real-Time Code Execution:** Integrate a secure code execution engine for evaluating submissions against test cases.
* ⚡ **Real-Time Leaderboards:** Introduce WebSocket-based leaderboard updates.
* 🧠 **AI-Powered Assistance:** Add AI-based problem recommendations and performance insights.
* 📊 **Advanced Analytics:** Provide detailed participant and contest performance analytics.
* 🔔 **Real-Time Notifications:** Implement real-time contest and submission notifications.
* 🏅 **Gamification:** Add badges, achievements, streaks, and competitive rankings.
* 📱 **Mobile Support:** Improve the platform for mobile and tablet users.
* ☁️ **Scalable Infrastructure:** Introduce containerization and cloud-native deployment for larger contests.

---

## 🤝 Contributing

Contributions are welcome!

### 1. Fork the repository

```bash
git fork https://github.com/your-username/CodeArena.git
```

### 2. Create a new branch

```bash
git checkout -b feature/your-feature
```

### 3. Make your changes

Implement your feature or fix.

### 4. Commit your changes

```bash
git commit -m "Add: your feature"
```

### 5. Push the branch

```bash
git push origin feature/your-feature
```

### 6. Create a Pull Request

Open a pull request with a clear description of your changes.

---

## 📄 License

This project is developed for **educational and portfolio purposes**.

If you intend to use or distribute the project commercially, please contact the project maintainers.

---

## 👨‍💻 Author

**Para Venkata Aishwarya**

B.Tech — Mathematics and Scientific Computing
**ABV-IIITM Gwalior**

---

## 🏁 Conclusion

**CodeArena** provides a centralized platform for conducting and participating in programming contests while simplifying contest administration and participant management.

By combining a modern **React and TypeScript frontend**, a structured **Node.js and Express backend**, and a reliable **PostgreSQL database**, the platform demonstrates the practical implementation of a scalable full-stack application.

The project brings together **authentication, role-based access control, contest management, problem management, submissions, leaderboards, notifications, and analytics** into a single platform, providing a foundation that can be further extended into a production-ready competitive programming ecosystem.

---

⭐ **If you find CodeArena useful, consider giving the repository a star!**
