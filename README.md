# 💻 CodeArena

*A Full-Stack Coding Contest Management Platform*

---

## 💡 Overview

**CodeArena** is a web-based **coding contest management platform** designed to provide a centralized environment for organizing and participating in programming contests.

The platform is being developed to support different types of users, including **students, organizers, and administrators**, with features such as contest management, problem management, submissions, leaderboards, authentication, and user management.

The project is currently under active development, with the backend services being developed first followed by the frontend interface.

---

## 🧩 Planned Features

* 🔐 User authentication and authorization
* 👥 Role-based access control
* 🏆 Coding contest management
* 🧩 Problem management
* 💻 Code submission system
* 📊 Contest leaderboards
* 🔔 Notifications
* 📈 Contest and user analytics
* 👤 User profiles and account management
* 🛡️ Admin management

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **JWT Authentication**

### Frontend

* **React.js**
* **TypeScript**
* **Tailwind CSS**

### Development Tools

* **Git & GitHub**
* **Postman**
* **VS Code**

---

## 🏗️ Project Architecture

CodeArena follows a client-server architecture:

```text
┌──────────────────────────┐
│      React Frontend      │
│    TypeScript + UI       │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│      Express Backend     │
│   Node.js + TypeScript   │
└────────────┬─────────────┘
             │
             │ Prisma ORM
             ▼
┌──────────────────────────┐
│       PostgreSQL         │
│         Database         │
└──────────────────────────┘
```

---

## 📂 Project Structure

```text
CodeArena/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   └── ...
│
├── .gitignore
├── README.md
└── package.json
```

> The project structure will evolve as new modules and features are added.

---

## ⚙️ Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CodeArena.git
cd CodeArena
```

### 2. Navigate to the Backend

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL="your_postgresql_database_url"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

> Do not commit your `.env` file to GitHub.

### 5. Setup Prisma

```bash
npx prisma generate
```

If database migrations are available:

```bash
npx prisma migrate dev
```

### 6. Start the Development Server

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:5000
```

---

## 🧪 Development Status

CodeArena is currently **under active development**.

### Current Progress

* [x] Backend project initialization
* [x] Express + TypeScript setup
* [x] PostgreSQL database integration
* [x] Prisma ORM setup
* [ ] Authentication
* [ ] Role-based authorization
* [ ] Contest management
* [ ] Problem management
* [ ] Submission system
* [ ] Leaderboard
* [ ] Notifications
* [ ] Analytics
* [ ] Frontend development
* [ ] Deployment

This section will be updated as development progresses.

---

## 🚀 Roadmap

### Phase 1 — Backend

* Backend architecture
* Database schema
* Authentication
* Authorization
* Contest APIs
* Problem APIs
* Submission APIs
* Leaderboard APIs

### Phase 2 — Frontend

* Application layout
* Authentication pages
* Student dashboard
* Contest interface
* Problem-solving interface
* Leaderboard
* Organizer dashboard
* Admin dashboard

### Phase 3 — Integration

* Connect frontend with backend APIs
* Authentication flow
* Error handling
* Loading states
* Form validation
* Responsive design

### Phase 4 — Deployment

* Production database
* Backend deployment
* Frontend deployment
* Environment configuration
* Production testing

---

## 🤝 Contributing

Contributions and suggestions are welcome.

If you would like to contribute:

```bash
git clone https://github.com/your-username/CodeArena.git
cd CodeArena
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, commit them, and create a pull request.

---

## 📄 License

This project is currently being developed for **educational and portfolio purposes**.

---

## 👨‍💻 Author

**Para Venkata Aishwarya**

B.Tech — Mathematics and Scientific Computing
**ABV-IIITM Gwalior**

---

⭐ **CodeArena is currently under development. More features and improvements will be added soon.**

