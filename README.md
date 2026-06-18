<p align="center">
  <img width="220" alt="Smart Library System Logo" src="https://github.com/user-attachments/assets/d25ef6c6-18be-439b-aef2-e4efbbc86267"/>
</p>

<h1 align="center">Smart Library System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=FF9900" />
</p>

<p align="center">
  <i>A smart web-based library system for seamless borrowing, tracking, reservations, approvals, and administration.</i>
</p>

## 📌 Features

### Students
- 📚 Browse, search, and filter the catalogue; view book details
- 🔄 Request to borrow with a due date, or add to a bag for later
- 📷 A **QR code** is generated on borrow to present at the desk for pickup
- 🏢 Reserve study rooms (with attendee details)
- ❤️ Like books, and track borrowing history, liked titles, and account status/fines
- 🔔 In-app notifications and profile management

### Librarians
- 📋 Dashboard with calendar overview
- ✅ Approve / reject borrow requests, confirm returns, approve room reservations
- ➕ Manual transactions (borrow / return / room) and **settle fines** on a student's behalf
- 📕 Full book management — add, edit, delete, with cover image + PDF uploads to AWS S3
- 👥 Students list and per-student detail
- 🔔 Notifications and profile management

### Admins
- 📊 Single-page dashboard with live charts (user traffic, reservations) built on Recharts
- 👤 Manage students (revoke/restore borrowing, delete) and librarians (delete)
- 📚 Manage books and rooms (add rooms, update status, delete)
- 🧾 View all book and room transactions
- 📄 Export a **daily activity log** and a **monthly usage report** as CSV

### System
- ⏰ Automated overdue and fine handling via `node-cron`
- 🔐 Role-based access for students, librarians, and admins
- 🖥️ Responsive single-page interface built in React

---

## 🏛️ Architecture

The project is a **monorepo** with two apps:

| App | Stack | Port |
|-----|-------|------|
| `backend/` | Node + Express 5 (ESM) + Mongoose + MongoDB Atlas | `3000` |
| `frontend/` | React + Vite + React Router + Bootstrap | `5173` |

The frontend is a React **SPA** that talks to the backend over a JSON API under `/api/*`. The migration followed the **strangler pattern**: JSON API routes were added alongside the original server-rendered EJS routes, and the React app was built on top area by area, leaving the legacy views untouched.

In development, Vite proxies `/api` to the backend so the browser stays same-origin and the session cookie flows automatically. Authentication uses `express-session` + `connect-mongo` (sessions stored in MongoDB) with bcrypt-hashed passwords, and file uploads (book covers, PDFs, profile pictures) go to **AWS S3** via `multer-s3`.

---

## 🖼️ Screenshots

<p align="center">
  <img width="80%" src="backend/public/images/screenshots/Screenshot 2026-05-25 132605.png" alt="Dashboard Screenshot">
</p>

<p align="center">
  <img width="80%" src="backend/public/images/screenshots/Screenshot 2026-05-25 132617.png" alt="Library Screenshot">
</p>

<p align="center">
  <img width="80%" src="backend/public/images/screenshots/Screenshot 2026-05-25 132629.png" alt="Borrowing Screenshot">
</p>

---

## 🛠️ Tech Stack

<div align="center">
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png" alt="React" title="React"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/express.png" alt="Express" title="Express"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mongodb.png" alt="mongoDB" title="mongoDB"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/bootstrap.png" alt="Bootstrap" title="Bootstrap"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png" alt="Node.js" title="Node.js"/></code>
    <code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/aws.png" alt="AWS" title="AWS"/></code>
</div>

### Frontend
- **React** — UI library (single-page app)
- **Vite** — build tool & dev server
- **React Router** — client-side routing
- **Bootstrap 5** — styling (Ionicons + Tabler Icons via CDN)
- **Recharts** — admin dashboard charts
- **qrcode** — borrow QR generation

### Backend
- **Node.js** — runtime environment
- **Express.js 5** — API & server framework
- **MongoDB + Mongoose** — database & ODM
- **express-session + connect-mongo** — session auth stored in MongoDB
- **bcryptjs** — password hashing
- **multer-s3 + AWS S3** — file uploads (covers, PDFs, avatars)
- **node-cron** — scheduled overdue/fine handling
- **EJS** — templating (legacy views, retained under the strangler pattern)

---

## 🚀 Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd smart-library-system
```

The backend and frontend are installed and run **separately**.

### 1️⃣ Backend

```bash
cd backend
npm install
npm run dev          # runs on http://localhost:3000
```

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev          # runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## ⚙️ Environment Variables

### `backend/.env`

```bash
PORT=3000
NODE_ENV=development          # use "development" locally (see note below)
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173   # used for CORS

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name
```

> ⚠️ **`NODE_ENV` matters locally.** When `NODE_ENV=production`, the session cookie is set `Secure; SameSite=None`, which browsers drop over plain `http://localhost` — so logins won't persist. Keep it `development` for local work.

### `frontend/.env` (optional)

```bash
VITE_API_TARGET=http://localhost:3000   # backend URL the Vite dev proxy points to
```

If omitted, it defaults to `http://localhost:3000`.

---

## 📦 Dependencies

### `backend/package.json`

```jsonc
"dependencies": {
  "@aws-sdk/client-s3": "^3.1054.0",
  "bcryptjs": "^2.4.3",
  "bootstrap": "^5.3.8",
  "connect-mongo": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^17.4.2",
  "ejs": "^5.0.2",
  "express": "^5.2.1",
  "express-session": "^1.19.0",
  "mongodb": "^7.2.0",
  "mongoose": "^9.6.2",
  "multer": "^2.1.1",
  "multer-s3": "^3.0.1",
  "node-cron": "^4.2.1",
  "qrcode": "^1.5.1"
}
```

### `frontend/package.json`

```jsonc
"dependencies": {
  "bootstrap": "^5.3.8",
  "qrcode": "^1.5.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^7.0.0",
  "recharts": "^2.12.0"
},
"devDependencies": {
  "@vitejs/plugin-react": "^5.0.0",
  "vite": "^7.0.0"
}
```

> Versions are indicative — match them to your actual `package.json`.

---

## 🔮 Future Improvements

- Email notifications for due dates and approvals
- Full notification history (read + unread, paginated)
- Live sync of librarian notifications across the header and the dedicated page
- Retire the remaining legacy EJS views once parity is confirmed

---

# 👨‍💻 Authors
- Christian Neal Paredes — Fullstack Developer
- Devann Dereck Villarin — Back-end Developer
- Aeirol John Gilo — UI / UX Designer