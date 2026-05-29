<p align="center">
  <img width="220" alt="Smart Library System Logo" src="https://github.com/user-attachments/assets/d25ef6c6-18be-439b-aef2-e4efbbc86267"/>
</p>

<h1 align="center">Smart Library System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=FF9900" />
</p>


<p align="center">
  <i>A smart web-based library system for seamless borrowing, tracking, and reservations.</i>
</p>

## 📌 Features

- 📚 Book inventory management
- 👤 User and borrowing system
- ⏰ Automated overdue handling using `node-cron`
- 🔍 Search and tracking functionality
- 🖥️ Responsive user interface
- 🏢 Upcoming room reservation module

---

## 🖼️ Screenshots

<p align="center">
  <img width="80%" src="./public/images/screenshots/Screenshot 2026-05-25 132605.png" alt="Dashboard Screenshot">
</p>

<p align="center">
  <img width="80%" src="./public/images/screenshots/Screenshot 2026-05-25 132617.png" alt="Library Screenshot">
</p>

<p align="center">
  <img width="80%" src="./public/images/screenshots/Screenshot 2026-05-25 132629.png" alt="Borrowing Screenshot">
</p>

---

## 🛠️ Tech Stack

<div align="center">
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/express.png" alt="Express" title="Express"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mongodb.png" alt="mongoDB" title="mongoDB"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/bootstrap.png" alt="Bootstrap" title="Bootstrap"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png" alt="Node.js" title="Node.js"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/aws.png" alt="AWS" title="AWS"/></code>
</div>

### Technologies Used

- **MongoDB** — Database
- **Express.js** — Backend framework
- **EJS** — Templating engine
- **Node.js** — Runtime environment
- **Bootstrap 5** — Frontend styling
- **AWS** — Cloud hosting & deployment

---

## 🚀 Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd smart-library-system
```

---
### 2️⃣ Install Dependencies
```bash
npm install
```

---

### 3️⃣ Configure Environment Variables
create .env file in root directory
```bash
PORT=3000
MONGODB_URI=your_mongodb_connection
SESSION_SECRET=your_secret_key

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name
```

---

### 📦 Dependencies
dependencies should be: 
<h3>package.json</h3>
```aiignore
"dependencies": {
  "@aws-sdk/client-s3": "^3.1054.0",
  "bootstrap": "^5.3.8",
  "connect-mongo": "^6.0.0",
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

---

### 🔮 Future Improvements


---
# 👨‍💻 Authors

<div align="center">
  <div style="display: inline-flex; gap: 75px; flex-wrap: wrap; justify-content: center;">
    <div align="center">
      <img 
        src="" 
        width="120" 
        height="120" 
        style="border-radius: 50%; object-fit: cover;" 
        alt="Author 1"
      />
      <br><br>
      <strong>Devann Dereck Villarin</strong><br>
      <sub>BACK-END DEVELOPER</sub>
    </div>
    <div align="center">
      <img 
        src="public/authors/Neal.jpg" 
        width="120" 
        height="120" 
        style="border-radius: 50%; object-fit: cover;" 
        alt="Author 2"
      />
      <br><br>
      <strong>Christian Neal Paredes</strong><br>
      <sub>FULLSTACK DEVELOPER</sub>
    </div>
    <div align="center">
      <img 
        src="" 
        width="120" 
        height="120" 
        style="border-radius: 50%; object-fit: cover;" 
        alt="Author 3"
      />
      <br><br>
      <strong>Aeirol John Gilo</strong><br>
      <sub>UI/UX DESIGNER</sub>
    </div>

  </div>

</div>