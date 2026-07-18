# BillMind

A full-stack bill reminder app that lets users define their bills and reminder schedules, and BillMind automatically sends email notifications through a pub/sub pipeline with support for sharing bills across multiple users.

<p align="center">
  <img src="client/public/bills.png" alt="Bills" width="65%"><br>
  <em>Dashboard</em>
</p>
<br>
<p align="center">
  <img src="client/public/bill_1.png" alt="Bill details" width="65%"><br>
  <em>Details</em>
</p>


## Motivation

Most brokerages and banks already send payment reminders, but only for their own services. I wanted something personal, a single place to track *all* types of bills (rent, utilities, subscriptions, insurance) with custom reminder schedules per bill. More importantly, I share expenses with family members and wanted a way to notify everyone involved automatically, not just myself.

I also kept missing upcoming payments and juggling reminders across different apps, so I built BillMind to bring everything into one place and make bill tracking simple, flexible, and easy to rely on.


## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker

See the [Contributing](#-contributing) section for full local setup instructions.


## 📖 Usage

### Architecture

BillMind uses an **event-driven pub/sub architecture** powered by RabbitMQ. Three independent services communicate through a topic exchange:

- **Server** — handles all REST API requests
- **Scheduler** — runs daily at 8am, checks for upcoming bills and publishes reminder events to RabbitMQ
- **Notifier** — subscribes to RabbitMQ and sends emails when reminder events arrive

Failed emails are routed to a Dead Letter Queue instead of being lost.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/revoke` | Logout |
| POST | `/api/users` | Register |
| PUT | `/api/users` | Update account |
| DELETE | `/api/users` | Delete account |
| GET | `/api/bills` | Get all your bills |
| POST | `/api/bills` | Create a bill |
| GET | `/api/bills/:id` | Get bill details |
| PUT | `/api/bills/:id` | Update a bill |
| DELETE | `/api/bills/:id` | Delete a bill |
| POST | `/api/bills/:id/members` | Add a member by email |
| POST | `/api/bills/:id/reminders` | Add a reminder rule |


## Tech Stack

**Backend**
- Node.js + TypeScript
- Express — REST API
- RabbitMQ — pub/sub message broker
- PostgreSQL — database
- Drizzle ORM — type-safe database queries
- Argon2 — password hashing
- JWT — authentication

**Frontend**
- React + TypeScript
- Vite — build tool
- React Router — client-side routing
- shadcn/ui — component library 

**Infrastructure**
- Docker — RabbitMQ and PostgreSQL containers
- Nodemailer — email delivery via Gmail SMTP


## 🤝 Contributing

### 1. Clone the repository
```bash
git clone https://github.com/leonelced/billmind.git
cd billmind
```

### 2. Set up environment variables
Create a `.env` file in the root directory:

RABBITMQ_URL=amqp://guest:guest@localhost:5672/

DB_URL=postgresql://postgres:postgres@localhost:5432/billmind

POSTGRES_PASSWORD=postgres

JWT_SECRET=your_jwt_secret

GMAIL_USER=your_gmail@gmail.com

GMAIL_PASSWORD=your_gmail_app_password

PORT=3000

### 3. Start RabbitMQ and PostgreSQL
```bash
npm run rabbit:start
npm run pg:start
```

### 4. Install dependencies and run migrations
```bash
npm install
npm run db:migrate
```

### 5. Start the services
Open three terminals:
```bash
# Terminal 1 - API server
npm run server

# Terminal 2 - Scheduler
npm run scheduler

# Terminal 3 - Notifier
npm run notifier
```

### 6. Start the frontend
```bash
cd client
npm install
npm run dev
```

Navigate to `http://localhost:5173`


### Submit a pull request
If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.
