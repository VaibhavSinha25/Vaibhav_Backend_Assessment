
# 📘 Chapter Performance Dashboard – Backend API

A RESTful backend built with **Node.js**, **Express.js**, **MongoDB**, and **Redis** to manage chapters, with features like filtering, pagination, caching, and rate limiting.

---

## 🚀 Features

- ✅ Upload chapters from JSON (admin-only)
- 🔍 Filter chapters by subject, class, unit, status, weak chapters
- 📄 Pagination with `page` and `limit` params
- ⚡ Caching using Redis (for chapter lists and individual chapter details)
- 🚫 Rate limiting (30 requests per minute per IP)
- 🛡️ Security via Helmet and CORS
- 📁 Clean modular structure

---

## 🧱 Tech Stack

| Layer     | Technology              |
|-----------|--------------------------|
| Language  | Node.js (ESM syntax)     |
| Framework | Express.js               |
| Database  | MongoDB + Mongoose       |
| Cache     | Redis (with ioredis)     |
| Rate Limit| express-rate-limit + Redis |
| Hosting   | Render   |

---

## 📁 Folder Structure

```
.
├── init/                # Redis and MongoDB init
├── models/              # Mongoose schema
├── routes/              # Express routes
├── controllers/         # Business logic
├── middlewares/         # Custom middleware
├── config.env           # Environment variables
├── server.js             # Entry point (combined server)
└── README.md
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=3000
MONGO_URL=mongodb_url
MONGO_PASS = mongo_password
REDIS_URL=redis://127.0.0.1:6379
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/VaibhavSinha25/Vaibhav_Backend_Assessment.git
cd Vaibhav_Backend_Assessment

# Install dependencies
npm install

# Set up .env file
cp config.env 

# Start Redis server locally (if using local Redis)
redis-server

# Run the app
npm start
```

---

## 🧪 API Endpoints

| Method | Endpoint                         | Description                      |
|--------|----------------------------------|----------------------------------|
| POST   | `/api/v1/chapters`               | Upload chapters (admin-only)     |
| GET    | `/api/v1/chapters`               | Get all chapters (with filters)  |
| GET    | `/api/v1/chapters/:id`           | Get a single chapter by ID       |

---

## 🔍 Filters Supported on `/api/v1/chapters`

- `class` (e.g., "Class 11")
- `subject` (e.g., "Physics")
- `unit` (e.g., "Mechanics 1")
- `status` (e.g., "Not Started")
- `isWeakChapter` (e.g., true/false)
- `page`, `limit` (for pagination)

---

## ⚡ Caching (Redis)

- Cached:  
  - `GET /api/v1/chapters` (based on query filters)
- Duration: 1 hour
- Invalidated on upload (`POST /api/v1/chapters`)

---

## 🚦 Rate Limiting

- Limit: **30 requests/minute per IP**
- Backed by Redis
- Returns `429 Too Many Requests` when exceeded

---

## 📬 Postman Collection

📎 [https://documenter.getpostman.com/view/45515918/2sB2x2KZYo](#)  
(*Add your exported collection link*)

---

## 🧠 Admin Access (Simulation)

- Send this header in upload requests:
  ```http
  x-admin: true
  ```

---

## 🧹 TODOs / Enhancements

- ✅ Add PUT/PATCH for chapter updates
- ✅ Invalidate single-chapter cache on update
- ⏳ Add user authentication for real admin check

---

## 🤝 License

MIT License. Use freely.
