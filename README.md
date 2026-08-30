# NEXUS — Smart Student Collaboration & Project Management System

> **AI-Powered Campus Capability & Collaboration Network**

NEXUS is a full-stack campus collaboration platform designed to help students discover peers, showcase their skills and interests, form project teams, manage collaboration requests, and receive AI-powered recommendations and career roadmaps.

## 🚀 Features

### 👤 Student Profile
- Manage personal and academic information
- Add professional bio and career links
- GitHub, LinkedIn, and resume links
- Profile completion tracking
- Availability status management

### 🛠️ Skills
- Add and manage skills
- Set proficiency levels
- Skill suggestions and autocomplete
- Skill summaries and diversity insights

### ❤️ Interests
- Add and manage personal and professional interests
- Quick interest suggestions
- Support improved student discovery and matching

### 🎯 Goals
- Create personal and professional goals
- Track progress through Not Started, In Progress, and Completed states

### 📂 Project Management
- Create and manage projects
- Define required project skills
- Discover available projects
- Join projects with selected roles
- Manage project members

### 🤝 Collaboration
- Send collaboration requests
- Include project and role information
- Accept or reject requests
- Track sent and received requests

### 🔍 Find Students
Search students by:
- Name
- Roll number
- Department
- Specialization

View student profiles, skills, availability, and send collaboration requests.

### 🧠 AI Recommendations
- Discover suitable project opportunities
- View project matching scores
- Generate AI recommendation analysis
- Track recommendation history

### 🗺️ AI Career Roadmap
Generate personalized career guidance including:
- Missing skills
- Recommended learning steps
- Career advice
- Certification suggestions
- Roadmap history

### 🔔 Notifications
- View campus and collaboration updates
- Filter by All, Unread, and Read
- Mark notifications as read
- Mark all notifications as read
- Delete notifications
- Display latest notifications first

### 🆘 Support
- Create support tickets
- Select support categories
- Track submitted tickets and their status

---

## 🏗️ Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Lucide React
- JavaScript

### Backend
- Spring Boot
- Spring Data JPA / Hibernate
- Spring Security
- JWT Authentication
- Maven

### Database
- PostgreSQL

### Development Tools
- VS Code
- pgAdmin 4
- Postman
- GitHub

---

## 🧩 Core Modules

```text
NEXUS
│
├── Authentication
│   ├── Login
│   └── Registration
│
├── Student Profile
│   ├── Personal Information
│   ├── Skills
│   ├── Interests
│   └── Goals
│
├── Collaboration
│   ├── Find Students
│   ├── Collaboration Requests
│   └── Project Matching
│
├── Projects
│   ├── Create Projects
│   ├── Join Projects
│   ├── Required Skills
│   └── Team Management
│
├── AI Intelligence
│   ├── Recommendations
│   └── Career Roadmap
│
└── Updates & Support
    ├── Notifications
    └── Support Tickets
```

---

## 🗄️ Database Design

The system is designed around these core entities:

- Student
- Skill
- StudentSkill
- Interest
- StudentInterest
- Project
- ProjectMember
- ProjectSkill
- Goal
- CollaborationRequest
- MatchHistory
- CareerRoadmap
- Notification
- Achievement
- Certification

PostgreSQL is used as the database, with relationships managed through Spring Data JPA and Hibernate.

---

## 📁 Project Structure

```text
NEXUS/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── ...
│
└── README.md
```

> The exact folder structure may vary depending on the repository configuration.

---

## ⚙️ Getting Started

### Prerequisites

Install:

- Node.js
- npm
- Java 21
- Maven
- PostgreSQL
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
```

### Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Configure the PostgreSQL connection in the backend application configuration before starting the server.

---

## 🗃️ Database Setup

1. Install PostgreSQL.
2. Create a database for NEXUS.
3. Configure the database credentials in the backend configuration.
4. Start the Spring Boot backend.
5. Verify the required tables using pgAdmin.

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexus
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

> Never commit passwords, JWT secrets, API keys, or other sensitive credentials.

---

## 🔐 Authentication

NEXUS uses JWT-based authentication.

```text
Student
   ↓
Login / Register
   ↓
Backend Authentication
   ↓
JWT Token
   ↓
Authenticated API Requests
```

---

## 🧠 AI Capabilities

### Project Matching
Students receive recommendations based on their capabilities and project requirements.

### AI Recommendation Analysis
The system can generate additional AI-based insights for project matches.

### Career Roadmap Generation
Personalized roadmaps can include career goals, missing skills, learning steps, career advice, and certification suggestions.

---

## 🎨 UI/UX Redesign

The NEXUS frontend completed a full 9-phase UI/UX improvement process.

| Phase | Scope |
|---|---|
| 1 | Global foundation, sidebar, header, layout |
| 2 | Authentication pages |
| 3 | Dashboard |
| 4 | Student profile |
| 5 | Skills, interests, goals |
| 6 | Projects |
| 7 | Collaboration and student discovery |
| 8 | AI recommendations and career roadmap |
| 9 | Notifications and support |

The redesign focuses on:
- Responsive layouts
- Consistent design patterns
- Accessible controls
- Semantic status colors
- Improved empty states
- Consistent modal design
- Better loading states
- Mobile responsiveness

---

## 🔔 Notification Ordering

Notifications are displayed in descending chronological order:

```text
NEWEST
   ↓
OLDER
   ↓
OLDEST
```

The latest notification appears at the top of the Notifications page.

This ordering works with:
- All notifications
- Unread notifications
- Read notifications

---

## 🧪 Testing Checklist

Before deployment, verify:

- Authentication flow
- Profile updates
- Skill management
- Interest management
- Goal management
- Project creation and joining
- Collaboration requests
- Student search
- AI recommendations
- Career roadmap generation
- Notification actions and ordering
- Support ticket creation

Frontend build:

```bash
npm run build
```

---

## 🚀 Future Improvements

Potential future enhancements:

- Advanced AI teammate matching
- Real-time notifications using WebSockets
- Email notifications
- File sharing inside projects
- Project progress tracking
- Team chat
- Student portfolio generation
- Advanced analytics
- Admin dashboard
- Cloud deployment
- Mobile application

---

## 👨‍💻 Author

**Rakesh Meesa**

B.Tech Computer Science and Engineering (Artificial Intelligence)  
Amrita Vishwa Vidyapeetham, Coimbatore

GitHub: https://github.com/rakesh94m  
LinkedIn: https://www.linkedin.com/in/rakesh-meesa-237656308

---

## 📄 License

This project is currently intended for academic and educational purposes.

---

# ⭐ NEXUS

**Connect. Collaborate. Build. Grow.**

NEXUS aims to help students discover capabilities across campus, find complementary teammates, collaborate on meaningful projects, and build personalized career pathways.
