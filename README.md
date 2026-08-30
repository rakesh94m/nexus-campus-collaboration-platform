# NEXUS — Smart Student Collaboration & Project Management System

> **AI-Powered Campus Capability & Collaboration Network**

NEXUS is a full-stack campus collaboration platform designed to help students discover peers, showcase their skills and interests, form project teams, manage collaboration requests, track support requests, and receive AI-powered recommendations and personalized career roadmaps.

---

## 🚀 Features

### 🔐 Authentication
- Secure student registration and login
- JWT-based authentication
- Protected authenticated API requests
- Password management
- Account and availability status support

### 👤 Student Profile
- Manage personal and academic information
- Add a professional bio
- Add GitHub, LinkedIn, and resume links
- Profile completion tracking
- Availability status management
- View student information and capabilities

### 🛠️ Skills
- Add and manage skills
- Set proficiency levels
- Skill suggestions and autocomplete
- View skill summaries
- Track skill diversity and proficiency

### ❤️ Interests
- Add and manage personal and professional interests
- Quick interest suggestions
- Support improved student discovery and matching

### 🎯 Goals
- Create personal and professional goals
- Track goal progress
- Manage Not Started, In Progress, and Completed states

### 📂 Project Management
- Create and manage projects
- Define required project skills
- Discover available projects
- Join projects with selected roles
- Manage project members
- View project skill requirements

### 🤝 Collaboration
- Discover students across campus
- Send collaboration requests
- Include project and role information
- Accept or reject collaboration requests
- Track sent and received requests
- View collaboration request status

### 🔍 Find Students

Search and discover students by:

- Name
- Roll number
- Department
- Specialization

View student profiles, skills, availability, and send collaboration requests.

### 🧠 AI Recommendations
- Discover suitable project opportunities
- View student-project matching scores
- Generate AI-based recommendation analysis
- Understand project suitability and collaboration potential
- Track recommendation history

### 🗺️ AI Career Roadmap

Generate personalized career guidance including:

- Missing skills
- Recommended learning steps
- Career advice
- Certification suggestions
- Personalized career roadmap history

### 🔔 Notifications
- View campus and collaboration updates
- Filter by All, Unread, and Read
- Mark notifications as read
- Mark all notifications as read
- Delete notifications
- Display latest notifications first

### 🆘 Support Tickets
- Create support tickets
- Select support categories
- Describe technical or account-related issues
- Track submitted tickets
- View ticket status
- Refresh support ticket history

### 🏆 Achievement Management

The backend includes Achievement management functionality with CRUD support for student achievements.

Achievement functionality is currently supported through the backend architecture and database design.

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
- Spring Data JPA
- Hibernate
- Spring Security
- JWT Authentication
- Maven

### Database

- PostgreSQL

### AI

- Google Gemini API

### Development Tools

- VS Code
- pgAdmin 4
- Postman
- Git
- GitHub

---

## 🧩 Core Modules

```text
NEXUS
│
├── Authentication
│   ├── Login
│   ├── Registration
│   └── JWT Authentication
│
├── Student Profile
│   ├── Personal Information
│   ├── Academic Information
│   ├── Skills
│   ├── Interests
│   ├── Goals
│   └── Availability Management
│
├── Projects
│   ├── Create Projects
│   ├── Edit Projects
│   ├── Join Projects
│   ├── Required Skills
│   ├── Team Management
│   └── Project Matching
│
├── Collaboration
│   ├── Find Students
│   ├── Student Discovery
│   ├── Collaboration Requests
│   └── Request Management
│
├── AI Intelligence
│   ├── Project Recommendations
│   ├── AI Recommendation Analysis
│   ├── Match History
│   └── Career Roadmap
│
└── Updates & Support
    ├── Notifications
    ├── Support Tickets
    └── Achievement Management
```

---

## 🗄️ Database Design

NEXUS uses a normalized PostgreSQL database with **17 interconnected entities** designed to support student capability discovery, collaboration, project management, AI recommendations, notifications, support functionality, and career development.

Core entities include:

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
- SupportTicket

The database also contains additional supporting entities required by the current backend architecture.

Relationships are managed through:

- Spring Data JPA
- Hibernate
- JPA entity mappings
- Foreign key relationships

The Student entity acts as a central entity and connects student capabilities, interests, goals, projects, collaboration requests, achievements, notifications, and other platform functionality.

> PostgreSQL is used as the primary relational database for the NEXUS platform.

---

## 🏛️ System Architecture

```text
┌───────────────────────────────┐
│       React Frontend          │
│                               │
│  React + Vite + Tailwind CSS  │
└───────────────┬───────────────┘
                │
                │ REST API / HTTP
                │ JWT Authentication
                ▼
┌───────────────────────────────┐
│      Spring Boot Backend      │
│                               │
│ Controllers                  │
│ Services                     │
│ Repositories                 │
│ Security / JWT               │
└───────────────┬───────────────┘
                │
                │ Spring Data JPA
                │ Hibernate
                ▼
┌───────────────────────────────┐
│       PostgreSQL Database     │
│                               │
│       17 Entities             │
└───────────────────────────────┘
                │
                │
                ▼
┌───────────────────────────────┐
│         AI Services           │
│                               │
│       Google Gemini API       │
└───────────────────────────────┘
```

---

## 📁 Project Structure

```text
NEXUS/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/nexus/backend/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       ├── service/
│   │   │   │       └── service/impl/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │
│   ├── src/test/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── .mvn/
│
├── README.md
└── .gitignore
```

> The exact internal package structure may evolve as the project continues to develop.

---

## 🔄 Application Flow

```text
Student
   │
   ▼
Login / Registration
   │
   ▼
JWT Authentication
   │
   ▼
React Frontend
   │
   ├── Profile
   ├── Skills
   ├── Interests
   ├── Goals
   ├── Projects
   ├── Find Students
   ├── Collaboration
   ├── AI Recommendations
   ├── Career Roadmap
   ├── Notifications
   └── Support
   │
   ▼
Spring Boot REST APIs
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
PostgreSQL Database
```

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

---

## 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

---

## ☕ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Alternatively, if using the Maven Wrapper:

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

Configure the PostgreSQL connection and required environment values before starting the backend.

---

## 🗃️ Database Setup

1. Install PostgreSQL.
2. Create a database for NEXUS.
3. Configure the database connection in the backend configuration.
4. Start the Spring Boot backend.
5. Verify the required tables using pgAdmin.

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexus
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

> Never commit real passwords, JWT secrets, API keys, database credentials, or other sensitive values to GitHub.

---

## 🔐 Authentication

NEXUS uses JWT-based authentication.

```text
Student
   ↓
Login / Register
   ↓
Spring Boot Authentication
   ↓
JWT Token Generated
   ↓
Token Stored by Frontend
   ↓
Authenticated API Requests
   ↓
Protected Backend Endpoints
```

---

## 🧠 AI Capabilities

### 🎯 Project Matching

Students can discover projects based on their capabilities and project requirements.

Matching considers relevant student skills and project skill requirements to estimate suitability.

### ✨ AI Recommendation Analysis

The platform can generate additional AI-powered insights to help students understand project recommendations and potential collaboration opportunities.

### 🗺️ Career Roadmap Generation

Personalized career roadmaps can include:

- Career direction
- Missing skills
- Recommended learning steps
- Career advice
- Certification suggestions

Generated roadmaps can be stored and reviewed through roadmap history.

---

## 🎨 UI/UX Redesign

The NEXUS frontend completed a full **9-phase UI/UX improvement process**.

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
- Consistent typography and spacing
- Improved form usability

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

This ordering applies to:

- All notifications
- Unread notifications
- Read notifications

---

## 🧪 Testing Checklist

Before deployment, verify:

### Authentication

- Student registration
- Login
- JWT authentication
- Protected routes

### Student Profile

- Profile updates
- Availability updates
- Social links
- Password changes

### Student Capabilities

- Skill management
- Interest management
- Goal management

### Projects & Collaboration

- Project creation
- Project updates
- Project joining
- Project member management
- Student search
- Collaboration requests
- Accept/reject collaboration requests

### AI Features

- Project recommendations
- Match history
- AI recommendation analysis
- Career roadmap generation
- Career roadmap history

### Updates & Support

- Notification loading
- Notification filtering
- Mark notifications as read
- Mark all notifications as read
- Notification deletion
- Notification ordering
- Support ticket creation
- Support ticket status tracking

### Build Verification

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
mvn clean package
```

---

## 🚀 Deployment

NEXUS is currently under development and deployment preparation.

The application architecture supports independent deployment of:

```text
Frontend
   ↓
React + Vite Production Build
   ↓
Static Hosting

Backend
   ↓
Spring Boot Application
   ↓
Cloud Application Hosting

Database
   ↓
Managed PostgreSQL
```

The frontend and backend can be deployed independently while communicating through REST APIs.

Potential deployment platforms include:

- Microsoft Azure
- Vercel
- AWS

---

## 🔮 Future Improvements

Potential future enhancements include:

- Advanced AI teammate matching
- Real-time notifications using WebSockets
- Email notifications
- File sharing inside projects
- Project progress tracking
- Team chat
- Student portfolio generation
- Advanced analytics
- Admin dashboard
- Enhanced achievement management
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