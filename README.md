# NEXUS – AI-Powered Campus Capability & Collaboration Network

<div align="center">

![NEXUS Banner](assets/nexus-landing.png)

> **Connect. Collaborate. Grow.**  
> *A Next-Generation Campus Collaboration, Capability Discovery & AI Career Mentorship Ecosystem.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://nexus-campus-collaboration-platform.vercel.app)
[![Backend API](https://img.shields.io/badge/API%20Endpoint-Azure%20App%20Service-blue?style=for-the-badge&logo=microsoft-azure)](https://nexus-backend-cxgfa2cccrddcgar.centralindia-01.azurewebsites.net)
[![Database](https://img.shields.io/badge/Database-Azure%20PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://azure.microsoft.com/services/postgresql/)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%203.6%20Flash-orange?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)
[![GitHub](https://img.shields.io/badge/Repository-GitHub%20Monorepo-181717?style=for-the-badge&logo=github)](https://github.com/rakesh94m/nexus-campus-collaboration-platform)

</div>

---

## 🌐 Live Production Links

| Service | Host / Platform | URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://nexus-campus-collaboration-platform.vercel.app](https://nexus-campus-collaboration-platform.vercel.app) |
| **Backend REST API** | Azure App Service (Linux / Java 21) | [https://nexus-backend-cxgfa2cccrddcgar.centralindia-01.azurewebsites.net](https://nexus-backend-cxgfa2cccrddcgar.centralindia-01.azurewebsites.net) |
| **Database Server** | Azure PostgreSQL Flexible Server | `nexus-db-app.postgres.database.azure.com:5432/nexus_db` |
| **Source Code Repository** | GitHub | [rakesh94m/nexus-campus-collaboration-platform](https://github.com/rakesh94m/nexus-campus-collaboration-platform) |

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Cloud Deployment & Production Architecture](#-cloud-deployment--production-architecture)
    - [Production Architecture Flow](#production-architecture-flow)
    - [Cloud Infrastructure Stack](#cloud-infrastructure-stack)
    - [Frontend Deployment (Vercel)](#frontend-deployment--vercel)
    - [Backend Deployment (Azure App Service)](#backend-deployment--azure-app-service)
    - [Database Deployment (Azure PostgreSQL Flexible Server)](#database-deployment--azure-postgresql-flexible-server)
    - [Environment Variables & Security Configuration](#environment-variables--security-configuration)
    - [Production CORS & Preflight Resolution](#production-cors--preflight-resolution)
- [Key Features](#-key-features)
- [AI Capabilities & Implementation](#-ai-capabilities--implementation)
- [Product Tour & Screenshots](#-product-tour--screenshots)
- [Database Design & Data Model](#-database-design--data-model)
    - [Core Entities](#core-entities-17-tables)
    - [Enumerations](#enumerations-16-enums)
- [REST API Reference](#-rest-api-reference)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started (Local Development)](#-getting-started-local-development)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Security Architecture](#-security-architecture)
- [Future Enhancements](#-future-enhancements)
- [Academic Relevance & DBMS Concepts](#-academic-relevance--dbms-concepts)
- [Author](#-author)

---

# 📖 Overview

Finding the right peers to collaborate with is one of the most persistent hurdles for university students. Students often possess valuable technical skills, unique project ideas, or specific career goals, but campus environments lack a centralized, intelligent platform to connect these capabilities. Traditional university forums and social networks lack structured skill taxonomies, verified capability records, project matching, and career development guidance.

**NEXUS** bridges this gap by creating an **AI-Powered Campus Capability and Collaboration Network**.

### What NEXUS Delivers:
- **Capability Showcase**: Digital student profiles featuring verified skills, proficiencies, interests, CGPA, GitHub/LinkedIn integrations, and resume metadata.
- **Smart Peer Discovery**: Multi-faceted search and discovery engine for student talents and team formation.
- **Project Lifecycle Management**: Create projects, define required skills and roles, manage project members, and review incoming requests.
- **Collaboration Pipeline**: Formal send, accept, reject, and review lifecycle for student collaboration invitations.
- **Generative AI Mentorship**: Tailored, multi-phase career roadmaps and intelligent project suitability recommendations powered by the **Google Gemini 3.6 Flash** model.
- **Student Growth Portfolio**: Track personal and professional goals, manage certifications, record achievements, and receive real-time notifications.
- **In-App Help & Support**: Integrated ticketing system with automatic Gmail SMTP notifications for student inquiries and bug reporting.

The system pairs a normalized **PostgreSQL** relational database with a resilient **Spring Boot 3** REST backend and a responsive **React 19** frontend, deployed across enterprise cloud services on **Azure** and **Vercel**.

---

# 🏗️ System Architecture

NEXUS implements a production-grade, decoupled client-server architecture with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                                │
│                   React 19 + Vite + Tailwind CSS v4                     │
│    • Client-Side Routing (React Router v7)  • Axios HTTP Interceptors   │
│    • Real-time UI Alerts (React Hot Toast)  • Lucide Vector Icons       │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     │ HTTPS / RESTful API (JSON)
                                     │ Bearer JWT Authentication
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             BACKEND TIER                                │
│                     Spring Boot 3.5.4 (Java 21)                         │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         Security Filter                         │   │
│   │       JWT Authentication Filter • BCrypt Password Encoder       │   │
│   │                Stateless Session Management                     │   │
│   └────────────────────────────────┬────────────────────────────────┘   │
│                                    │                                    │
│   ┌────────────────────────────────▼────────────────────────────────┐   │
│   │                        Controller Layer                         │   │
│   │   Auth • Student • Project • Member • Collaboration • Career    │   │
│   │   Recommendation • Skill • Interest • Goal • Achievement        │   │
│   │   Certification • Notification • Support • Search • Dashboard   │   │
│   └────────────────────────────────┬────────────────────────────────┘   │
│                                    │                                    │
│   ┌────────────────────────────────▼────────────────────────────────┐   │
│   │                         Service Layer                           │   │
│   │       Business Logic • Validation • Data Transfer Objects       │   │
│   │     Email Service (JavaMailSender) • Gemini AI Integration      │   │
│   └───────────────┬─────────────────────────────────┬───────────────┘   │
│                   │                                 │                   │
└───────────────────┼─────────────────────────────────┼───────────────────┘
                    │                                 │
     Spring Data JPA / Hibernate                      │ HTTPS REST
                    │                                 │ (Google GenAI SDK)
                    ▼                                 ▼
┌───────────────────────────────────────┐   ┌───────────────────────────┐
│            DATABASE TIER              │   │         AI ENGINE         │
│   Azure Database for PostgreSQL       │   │     Google Gemini 3.6     │
│          Flexible Server              │   │           Flash           │
│         (17 Core Entities)            │   │  Career Roadmaps & Match  │
└───────────────────────────────────────┘   └───────────────────────────┘
```

---

# ☁️ Cloud Deployment & Production Architecture

NEXUS is deployed in a high-availability, enterprise cloud architecture. The frontend, backend, database, and AI microservices are decoupled across dedicated cloud platforms for optimal performance, uptime, and security.

### Production Architecture Flow

```
                              [ Student Browser ]
                                       │
                                       │ HTTPS (Custom Domain / SSL)
                                       ▼
                       ┌───────────────────────────────┐
                       │            Vercel             │
                       │     React 19 + Vite App       │
                       │   SPA Routing (vercel.json)   │
                       └───────────────┬───────────────┘
                                       │
                                       │ HTTPS REST API Calls
                                       │ Axios + JWT Bearer Token
                                       ▼
                       ┌───────────────────────────────┐
                       │       Azure App Service       │
                       │     Spring Boot 3.5.4 (JAR)   │
                       │     Linux Runtime - Java 21   │
                       │                               │
                       │   • Spring Security & JWT     │
                       │   • Production CORS Filters   │
                       │   • Gmail SMTP Integration    │
                       └───────┬───────────────┬───────┘
                               │               │
                     JDBC / SSL│               │ HTTPS (GenAI SDK)
             (sslmode=require) │               │ API Key Auth
                               ▼               ▼
        ┌──────────────────────────────┐   ┌───────────────────────────┐
        │   Azure Database for PG      │   │      Google Gemini        │
        │      Flexible Server         │   │         AI API            │
        │                              │   │                           │
        │   Server: nexus-db-app       │   │  Model: gemini-3.6-flash  │
        │   Database: nexus_db         │   │  Career & Project Engine  │
        └──────────────────────────────┘   └───────────────────────────┘
```

---

### Cloud Infrastructure Stack

| Layer | Cloud Provider | Resource Name / Plan | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | `nexus-campus-collaboration-platform` | Serves the optimized production Vite bundle with global edge caching and CDN distribution. |
| **Backend** | **Microsoft Azure** | Azure App Service (Linux, Java 21) | Executes the containerized/native Spring Boot executable JAR with automated scaling and health monitoring. |
| **Database** | **Microsoft Azure** | Azure Database for PostgreSQL – Flexible Server | Managed relational database cluster (`nexus_db`) with automated storage encryption, SSL/TLS, and daily backups. |
| **AI Mentorship** | **Google Cloud** | Google GenAI API (`gemini-3.6-flash`) | Natural language understanding, skill ontology analysis, career roadmap synthesis, and project suitability matching. |
| **Mail Transport** | **Google Cloud / Gmail**| Gmail SMTP Server (`smtp.gmail.com:587`) | Delivers 6-digit email OTP codes for verification, password resets, and support ticket confirmations. |
| **Version Control**| **GitHub** | `rakesh94m/nexus-campus-collaboration-platform` | Unified monorepo containing frontend and backend code with CI/CD deployment webhooks. |

---

### Frontend Deployment – Vercel

The React frontend is deployed continuously via Vercel connected directly to the GitHub monorepo.

1. **Environment Configuration**:  
   The frontend utilizes a production environment variable to securely target the Azure backend:
   ```properties
   VITE_API_BASE_URL=https://nexus-backend-cxgfa2cccrddcgar.centralindia-01.azurewebsites.net
   ```

2. **Unified Axios Client with Interceptors**:  
   All outgoing network calls automatically bind the stored JWT token and capture 401 unauthenticated states:
   ```javascript
   import axios from "axios";

   const api = axios.create({
       baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
       headers: { "Content-Type": "application/json" }
   });

   api.interceptors.request.use((config) => {
       const token = localStorage.getItem("token");
       if (token) {
           config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
   });
   ```

3. **Single Page Application (SPA) Routing**:  
   Because NEXUS utilizes React Router v7 for client-side routing, direct navigation or browser page reloads on routes like `/projects`, `/career-roadmap`, or `/dashboard` must route back to `/index.html`. A [`vercel.json`](file:///c:/Btech/SEM5/DBMS/NEXUS/frontend/vercel.json) rewrite rule was configured:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

### Backend Deployment – Azure App Service

The Spring Boot application runs on Azure App Service under Linux with the **Java 21 LTS** runtime stack.

1. **Production Packaging**:  
   The backend is compiled into a standalone executable JAR using Maven:
   ```bash
   mvn clean package -DskipTests
   ```
2. **Execution Environment**:
    - Operating System: Linux
    - Java Runtime: Microsoft Build of OpenJDK 21
    - Web Server: Embedded Apache Tomcat (Spring Boot 3.5.4)
    - Host Domain: `https://nexus-backend-cxgfa2cccrddcgar.centralindia-01.azurewebsites.net`

---

### Database Deployment – Azure PostgreSQL Flexible Server

The relational database is provisioned on **Azure Database for PostgreSQL – Flexible Server**:

- **Host**: `nexus-db-app.postgres.database.azure.com`
- **Port**: `5432`
- **Database Name**: `nexus_db`
- **SSL Enforcement**: Mandatory (`sslmode=require`)

Connection configuration in [`application.properties`](file:///c:/Btech/SEM5/DBMS/NEXUS/backend/src/main/resources/application.properties):
```properties
spring.datasource.url=jdbc:postgresql://nexus-db-app.postgres.database.azure.com:5432/nexus_db?sslmode=require
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```
Hibernate automatically maintains schema integrity and manages relational constraints across all 17 JPA entity tables.

---

### Environment Variables & Security Configuration

No credentials, passwords, or private API keys are ever committed to source control. Azure App Service **Application Settings** inject production environment variables directly into the Spring container at startup:

| Environment Variable | Target Property in Spring Boot | Description |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_USERNAME` | `spring.datasource.username` | Azure PostgreSQL administrator username |
| `SPRING_DATASOURCE_PASSWORD` | `spring.datasource.password` | Azure PostgreSQL administrator password |
| `JWT_SECRET` | `jwt.secret` | 256-bit cryptographically secure HMAC-SHA signing key |
| `GEMINI_API_KEY` | `gemini.api.key` | Google Cloud API key for Gemini 3.6 Flash |
| `MAIL_USERNAME` | `spring.mail.username` & `support.email` | Gmail SMTP sender address & support recipient |
| `MAIL_PASSWORD` | `spring.mail.password` | 16-character Google App Password (2FA-compliant) |

---

### Production CORS & Preflight Resolution

Because the frontend is hosted on Vercel (`vercel.app`) while the backend runs on Azure (`azurewebsites.net`), cross-origin security is configured using a dedicated Spring [`CorsConfig`](file:///c:/Btech/SEM5/DBMS/NEXUS/backend/src/main/java/com/nexus/backend/config/CorsConfig.java) bean:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://nexus-campus-collaboration-platform.vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

This ensures browsers cleanly pass `OPTIONS` preflight requests, share credentials, and send `Authorization: Bearer <token>` headers seamlessly.

---

# ✨ Key Features

### 👤 1. Student Capability Profile Management
- Comprehensive student records: Name, roll number, department, specialization, academic year, section, and CGPA.
- Professional links: GitHub username, LinkedIn URL, personal portfolio, and resume links.
- Capability status indicator (`AVAILABLE`, `BUSY`, `OPEN_FOR_PROJECTS`).

### 🧠 2. Granular Skills & Interests Taxonomy
- Multi-category skill management: Programming Languages, Frameworks, Cloud, Databases, Developer Tools, and AI/ML.
- Proficiency ratings (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).
- Personal interests mapping to fuel peer recommendation heuristics.

### 🔍 3. Intelligent Student Discovery
- Filter and search peers across departments, skill sets, and current availability status.
- Direct collaboration request initiation from student discovery cards.

### 📁 4. End-to-End Project Management
- Full project lifecycle: Create, update, view, and close projects.
- Define project visibility (`PUBLIC`, `CAMPUS_ONLY`, `PRIVATE`) and required skills with importance tags (`MANDATORY`, `PREFERRED`).
- Member management with role assignments (`CREATOR`, `ADMIN`, `LEAD`, `MEMBER`, `CONTRIBUTOR`).

### 🤝 5. Collaboration Requests Workflow
- Send personalized invitations with custom messages and requested roles.
- Status management: `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.
- Automated notification triggers upon request dispatch and status changes.

### 🤖 6. AI-Powered Project Recommendations
- Analyzes student skills, proficiency ratings, and personal interests.
- Compares student profiles against open project requirements.
- Uses Gemini 3.6 Flash to output natural language suitability scores and reasoning.

### 🗺️ 7. Personalized AI Career Roadmap Generator
- Students enter their dream career target (e.g., "Full-Stack AI Engineer", "Cloud Solutions Architect").
- The Gemini model synthesizes a multi-phase learning plan covering foundational concepts, tools, hands-on projects, certifications, and portfolio strategies.
- Roadmaps are persisted to the database for anytime access.

### 🎯 8. Goal Tracking & Milestones
- Create actionable personal, academic, and professional goals.
- Track status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`) and target completion deadlines.

### 🏆 9. Achievements & Certifications
- Record hackathon wins, academic honors, publications, and leadership awards.
- Document industry certifications with issuing organizations, credential IDs, issue dates, and expiry dates.

### 🔔 10. Real-time Notification System
- Notification alerts for collaboration invites, acceptances, project updates, and system announcements.
- Mark individual notifications as read or clear all in bulk.

### 🆘 11. Help & Support Ticketing
- Students raise support tickets categorized into `GENERAL`, `BUG`, `ACCOUNT`, `FEATURE_REQUEST`, `COLLABORATION`, or `OTHER`.
- Tickets trigger automatic email notifications via Gmail SMTP to platform administrators.

---

# 🤖 AI Capabilities & Implementation

AI functionality is embedded directly into the Spring Boot backend using the official **Google GenAI Java SDK** (`com.google.genai:google-genai:1.58.0`).

### Configuration
```properties
gemini.api.key=${GEMINI_API_KEY}
gemini.model=gemini-3.6-flash
```

### 1. AI Career Roadmap Engine
- **Input**: Student profile (department, specialization, current skills, proficiencies, interests, target goal).
- **Prompt Engineering**: Structured prompt that forces the model to construct chronological phases (Phase 1: Foundations, Phase 2: Core Engineering, Phase 3: Advanced Projects, Phase 4: Interview & Industry Prep).
- **Output**: Formatted Markdown document stored in `career_roadmaps` table and rendered on the frontend.

### 2. AI Project Suitability Recommendations
- **Input**: Student's active skill matrix + all active public campus projects and their required skill sets.
- **Analysis**: Computes matching overlaps, identifies missing prerequisites, and suggests the top matching projects with actionable reasons.

```text
Student Request (Goal / Target)
       │
       ▼
CareerRoadmapService / RecommendationService
       │
       ▼
Google GenAI Client (Model: gemini-3.6-flash)
       │
       ▼
Structured Response Validation & Markdown Parsing
       │
       ▼
Saved to PostgreSQL Database & Returned to Client
```

---

# 🖼️ Product Tour & Screenshots

All screenshots reflect the live, running NEXUS platform.

---

### 🏠 Landing Page
![NEXUS Landing Page](assets/nexus-landing.png)
*Modern hero section introducing the platform, core value propositions, and live action triggers.*

---

### 🔐 Account Creation & Registration
![NEXUS Create Account](assets/nexus-creat-account.png)
*Clean registration interface capturing student credentials, roll number, and department.*

---

### 📊 Student Dashboard
![NEXUS Dashboard](assets/nexus-dashboard.png)
*Central command center showing active projects, pending collaboration invites, quick metrics, and AI shortcuts.*

---

### 👤 Student Profile Management
![NEXUS Profile](assets/nexus-profile.png)
*Comprehensive profile editor for academic background, GitHub/LinkedIn links, bio, and availability.*

---

### 🧠 Skills & Interests Management
![NEXUS Skills and Interests](assets/nexus-skills-interests.png)
*Interactive skill taxonomy manager categorized by languages, frameworks, cloud, and tools with proficiency tags.*

---

### 🔍 Student Discovery & Networking
![NEXUS Student Discovery](assets/nexus-student-discovery.png)
*Explore student peers, filter by technical competencies, and dispatch one-click collaboration requests.*

---

### 📁 Project Showcase & Collaboration Hub
![NEXUS Project](assets/nexus-project.png)
*Browse campus projects, inspect required skill stacks, review current members, and apply to collaborate.*

---

### 🤖 AI Project Recommendations
![NEXUS AI Recommendations](assets/nexus-ai-recommendation.png)
*Intelligent recommendations powered by Gemini 3.6 Flash analyzing student skills against project requirements.*

---

### 🗺️ AI Career Roadmap Generator
![NEXUS Career Roadmap](assets/nexus-career-roadmap.png)
*AI-synthesized multi-phase career roadmap with milestone breakdowns, recommended projects, and certifications.*

---

### 🔔 Notification Center
![NEXUS Notifications](assets/nexus-notification.png)
*Unified notification feed tracking team invites, request status changes, and platform alerts.*

---

### 🆘 Help & Support System
![NEXUS Help and Support](assets/nexus-support.png)
*In-app support desk for ticket creation, bug tracking, and automated administrator email routing.*

---

# 🗄️ Database Design & Data Model

NEXUS runs on a 3NF-normalized PostgreSQL relational schema containing **17 Core Entities** and **16 Enumerations**.

### Core Entities (17 Tables)

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Student     │◄──────┤  StudentSkill   ├──────►│      Skill      │
│   (User Model)  │       └─────────────────┘       └─────────────────┘
└────────┬────────┘
         │
         ├────────────────┬─────────────────┐       ┌─────────────────┐
         │                │ StudentInterest ├──────►│    Interest     │
         │                └─────────────────┘       └─────────────────┘
         │
         │1               ┌─────────────────┐       ┌─────────────────┐
         ├───────────────►│  ProjectMember  ├──────►│     Project     │
         │                └─────────────────┘       └────────┬────────┘
         │                                                   │
         │                                                   │1
         │                                                   ▼*
         │                                          ┌─────────────────┐
         │                                          │  ProjectSkill   │
         │                                          └─────────────────┘
         │*
         ├───────────────► Goal
         ├───────────────► Achievement
         ├───────────────► Certification
         ├───────────────► Notification
         ├───────────────► CareerRoadmap
         ├───────────────► MatchHistory
         ├───────────────► CollaborationRequest
         ├───────────────► SupportTicket
         └───────────────► EmailOtp
```

| # | Entity Name | Description | Key Attributes |
| :--- | :--- | :--- | :--- |
| 1 | `Student` | Core student user record | `id`, `email`, `password`, `fullName`, `rollNumber`, `department`, `cgpa`, `availabilityStatus`, `role` |
| 2 | `Skill` | Master technical skill dictionary | `id`, `name`, `category`, `description` |
| 3 | `StudentSkill` | Mapping student to skills | `student_id`, `skill_id`, `proficiencyLevel`, `yearsOfExperience` |
| 4 | `Interest` | Master domain/career interest dictionary | `id`, `name`, `category` |
| 5 | `StudentInterest`| Mapping student to interests | `student_id`, `interest_id` |
| 6 | `Project` | Campus collaboration projects | `id`, `title`, `description`, `creator_id`, `status`, `visibility`, `maxMembers` |
| 7 | `ProjectMember` | Project membership tracking | `project_id`, `student_id`, `role`, `joinedAt` |
| 8 | `ProjectSkill` | Required skills for a project | `project_id`, `skill_id`, `importance` |
| 9 | `Goal` | Personal and professional milestones | `id`, `student_id`, `title`, `description`, `targetDate`, `status` |
| 10 | `CollaborationRequest` | Formal collaboration invitations | `id`, `sender_id`, `receiver_id`, `project_id`, `message`, `status` |
| 11 | `MatchHistory` | Log of peer/project matches | `id`, `student_id`, `target_id`, `matchType`, `matchScore` |
| 12 | `CareerRoadmap` | AI-generated career paths | `id`, `student_id`, `targetRole`, `roadmapContent`, `generatedAt` |
| 13 | `Notification` | In-app alerts and notifications | `id`, `student_id`, `title`, `message`, `type`, `status`, `createdAt` |
| 14 | `Achievement` | Student accomplishments & honors | `id`, `student_id`, `title`, `description`, `dateAchieved`, `proofUrl` |
| 15 | `Certification` | Professional credentials | `id`, `student_id`, `name`, `issuingOrg`, `issueDate`, `credentialUrl` |
| 16 | `EmailOtp` | One-time passwords for email verification | `id`, `email`, `otpCode`, `purpose`, `expiryTime`, `isUsed` |
| 17 | `SupportTicket` | User assistance and bug tickets | `id`, `student_id`, `subject`, `description`, `category`, `status` |

---

### Enumerations (16 Enums)

- `AccountStatus` (`ACTIVE`, `INACTIVE`, `SUSPENDED`)
- `AvailabilityStatus` (`AVAILABLE`, `BUSY`, `OPEN_FOR_PROJECTS`)
- `CollaborationStatus` (`PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`)
- `GoalStatus` (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`)
- `MatchType` (`STUDENT_TO_STUDENT`, `STUDENT_TO_PROJECT`)
- `MemberRole` (`CREATOR`, `ADMIN`, `LEAD`, `MEMBER`, `CONTRIBUTOR`)
- `NotificationStatus` (`UNREAD`, `READ`)
- `NotificationType` (`COLLABORATION_REQUEST`, `REQUEST_ACCEPTED`, `PROJECT_UPDATE`, `SYSTEM`)
- `OtpPurpose` (`REGISTRATION`, `PASSWORD_RESET`, `EMAIL_VERIFICATION`)
- `ProficiencyLevel` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`)
- `ProjectStatus` (`PLANNING`, `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`, `CANCELLED`)
- `ProjectVisibility` (`PUBLIC`, `CAMPUS_ONLY`, `PRIVATE`)
- `Role` (`STUDENT`, `FACULTY`, `ADMIN`)
- `SkillImportance` (`MANDATORY`, `PREFERRED`, `NICE_TO_HAVE`)
- `SupportCategory` (`GENERAL`, `BUG`, `ACCOUNT`, `FEATURE_REQUEST`, `COLLABORATION`, `OTHER`)
- `SupportTicketStatus` (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)

---

# 🔌 REST API Reference

The backend exposes secured, versioned REST endpoints prefixed with `/api`. All endpoints except `/api/auth/**` require an HTTP `Authorization: Bearer <JWT_TOKEN>` header.

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `POST` | `/api/auth/send-otp` | Request a 6-digit email OTP |
| `POST` | `/api/auth/verify-otp` | Verify email OTP code |
| `POST` | `/api/auth/forgot-password` | Initiate password reset email |
| `POST` | `/api/auth/reset-password` | Reset password using verified OTP |

### 👤 Student & Profile (`/api/students`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students/me` | Fetch logged-in student's full profile |
| `PUT` | `/api/students/me` | Update student profile and availability |
| `GET` | `/api/students` | Discover all students (with search & filters) |
| `GET` | `/api/students/{id}` | View public profile of a specific student |

### 🧠 Skills & Interests (`/api/skills`, `/api/interests`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/skills` | List all available system skills |
| `GET` | `/api/skills/my` | Get current student's skills with proficiency |
| `POST` | `/api/skills/my` | Add a skill to student profile |
| `DELETE` | `/api/skills/my/{id}` | Remove a skill from student profile |
| `GET` | `/api/interests` | List all available interest tags |
| `POST` | `/api/interests/my` | Save student interest selections |

### 📁 Projects & Members (`/api/projects`, `/api/project-members`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | List all visible campus projects |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/{id}` | Get project details, required skills, and members |
| `PUT` | `/api/projects/{id}` | Update project details (creator/admin only) |
| `DELETE` | `/api/projects/{id}` | Delete a project |
| `POST` | `/api/projects/{id}/members` | Add a member to a project |
| `DELETE` | `/api/projects/{id}/members/{studentId}` | Remove a member from a project |

### 🤝 Collaboration Requests (`/api/collaboration`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/collaboration/send` | Send a collaboration invite |
| `GET` | `/api/collaboration/received` | List incoming collaboration requests |
| `GET` | `/api/collaboration/sent` | List outgoing collaboration requests |
| `PATCH` | `/api/collaboration/{id}/status` | Accept or reject a request |

### 🤖 AI Recommendations & Roadmaps (`/api/recommendations`, `/api/career-roadmap`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recommendations/projects` | Fetch AI project suitability recommendations |
| `POST` | `/api/career-roadmap/generate` | Generate a new AI career roadmap |
| `GET` | `/api/career-roadmap/my` | Retrieve student's saved career roadmaps |

### 🎯 Goals, Achievements & Certifications (`/api/goals`, `/api/achievements`, `/api/certifications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` / `POST` | `/api/goals` | List or create personal goals |
| `PATCH` | `/api/goals/{id}/status` | Update goal status |
| `GET` / `POST` | `/api/achievements` | List or record student achievements |
| `GET` / `POST` | `/api/certifications` | List or record verified certifications |

### 🔔 Notifications & Support (`/api/notifications`, `/api/support`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notifications` | Fetch student notification history |
| `PATCH` | `/api/notifications/{id}/read`| Mark a notification as read |
| `POST` | `/api/support/ticket` | Submit a help & support ticket |
| `GET` | `/api/support/my-tickets` | View submitted tickets and statuses |

---

# 🛠️ Technology Stack

### Frontend
- **Library**: [React 19](https://react.dev/) (`19.2.8`)
- **Build Tool**: [Vite](https://vitejs.dev/) (`8.2.0`)
- **Routing**: [React Router v7](https://reactrouter.com/) (`7.11.0`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`4.3.3`) via `@tailwindcss/vite`
- **HTTP Client**: [Axios](https://axios-http.com/) (`1.19.0`) with interceptors
- **Icons**: [Lucide React](https://lucide.dev/) (`1.30.0`)
- **Toast Notifications**: [React Hot Toast](https://react-hot-toast.com/) (`2.6.0`)
- **Hosting**: [Vercel](https://vercel.com/) (Edge CDN + SPA Rewrites)

### Backend
- **Language**: [Java 21 LTS](https://www.oracle.com/java/)
- **Framework**: [Spring Boot](https://spring.io/projects/spring-boot) (`3.5.4`)
- **Data Access**: Spring Data JPA & [Hibernate ORM](https://hibernate.org/)
- **Security**: Spring Security 6 (Stateless JWT Authentication)
- **Token Handling**: JJWT (`0.11.5` - `jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- **Validation**: Spring Boot Starter Validation (Bean Validation / Hibernate Validator)
- **Mail Service**: Spring Boot Starter Mail (Gmail SMTP)
- **Boilerplate**: Project Lombok (`1.18.38`)
- **Hosting**: [Azure App Service](https://azure.microsoft.com/services/app-service/) (Linux Runtime)

### Database
- **Engine**: [PostgreSQL](https://www.postgresql.org/) (Dialect: `PostgreSQLDialect`)
- **Cloud Provider**: [Azure Database for PostgreSQL – Flexible Server](https://azure.microsoft.com/services/postgresql/)
- **Connection Security**: Enforced SSL/TLS (`sslmode=require`)

### Artificial Intelligence
- **SDK**: [Google GenAI Java SDK](https://github.com/googleapis/google-genai-java) (`1.58.0`)
- **Model**: `gemini-3.6-flash`

---

# 📂 Project Directory Structure

```text
NEXUS/
│
├── .github/                         # GitHub configurations & issue templates
├── assets/                          # Product screenshots & documentation assets
│   ├── nexus-landing.png
│   ├── nexus-creat-account.png
│   ├── nexus-dashboard.png
│   ├── nexus-profile.png
│   ├── nexus-skills-interests.png
│   ├── nexus-student-discovery.png
│   ├── nexus-project.png
│   ├── nexus-ai-recommendation.png
│   ├── nexus-career-roadmap.png
│   ├── nexus-notification.png
│   └── nexus-support.png
│
├── backend/                         # Spring Boot 3.5.4 Backend (Java 21)
│   ├── pom.xml                      # Maven dependencies & build lifecycle
│   ├── mvnw / mvnw.cmd              # Maven wrappers for Linux/Windows
│   └── src/
│       ├── main/
│       │   ├── java/com/nexus/backend/
│       │   │   ├── BackendApplication.java     # Main Spring Boot Runner
│       │   │   ├── config/                     # CORS & Web Mappings
│       │   │   ├── controller/                 # 18 REST Controllers
│       │   │   ├── dto/                        # Request/Response Data Objects
│       │   │   ├── entity/                     # 17 JPA Entities
│       │   │   │   └── enums/                  # 16 Schema Enumerations
│       │   │   ├── exception/                  # Global Exception Handling
│       │   │   ├── repository/                 # Spring Data JPA Repositories
│       │   │   ├── security/                   # SecurityConfig, JWT, UserDetails
│       │   │   ├── service/                    # Business Logic & AI Services
│       │   │   └── util/                       # Helper utilities
│       │   └── resources/
│       │       └── application.properties     # Production & local configuration
│       └── test/                               # JUnit & Spring Security unit tests
│
└── frontend/                        # React 19 + Vite Frontend
    ├── package.json                 # NPM scripts & dependencies
    ├── vite.config.js               # Vite bundler & Tailwind v4 plugins
    ├── vercel.json                  # Production SPA routing rewrites
    ├── index.html                   # HTML5 Entry point
    └── src/
        ├── App.jsx                  # Main Application Component
        ├── main.jsx                 # React DOM Root
        ├── index.css                # Global CSS & Tailwind imports
        ├── components/              # Reusable UI (Navbar, Footer, Modal, Cards)
        ├── context/                 # AuthContext & Global State
        ├── pages/                   # Feature Pages
        │   ├── auth/                # Login & Register
        │   ├── dashboard/           # Student Analytics Dashboard
        │   ├── profile/             # Profile Management
        │   ├── skills/              # Skill Taxonomy
        │   ├── interests/           # Interest Tags
        │   ├── projects/            # Project Hub
        │   ├── collaboration/       # Collaboration Requests
        │   ├── students/            # Student Discovery
        │   ├── career/              # AI Career Roadmap
        │   ├── recommendations/     # AI Project Recommendations
        │   ├── goals/               # Goal Tracker
        │   ├── achievements/        # Achievements Portfolio
        │   ├── certifications/      # Industry Credentials
        │   ├── notifications/       # Real-time Notifications
        │   └── support/             # Help Desk & Ticket Submission
        ├── routes/                  # AppRoutes & ProtectedRoute wrapper
        ├── services/                # Axios API Services (17 API files)
        └── utils/                   # Formatters & Validators
```

---

# 🚀 Getting Started (Local Development)

### Prerequisites
Make sure you have installed:
- **Java Development Kit (JDK) 21** or higher
- **Node.js (v18+)** and **npm**
- **PostgreSQL 14+** (if running a local database)
- **Git**

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables in `src/main/resources/application.properties` or set them in your terminal:
   ```bash
   # Linux / macOS
   export SPRING_DATASOURCE_USERNAME=your_db_user
   export SPRING_DATASOURCE_PASSWORD=your_db_password
   export JWT_SECRET=your_super_secret_jwt_key_at_least_256_bits_long
   export GEMINI_API_KEY=your_gemini_api_key
   export MAIL_USERNAME=your_gmail_address@gmail.com
   export MAIL_PASSWORD=your_gmail_app_password

   # Windows (PowerShell)
   $env:SPRING_DATASOURCE_USERNAME="your_db_user"
   $env:SPRING_DATASOURCE_PASSWORD="your_db_password"
   $env:JWT_SECRET="your_super_secret_jwt_key_at_least_256_bits_long"
   $env:GEMINI_API_KEY="your_gemini_api_key"
   $env:MAIL_USERNAME="your_gmail_address@gmail.com"
   $env:MAIL_PASSWORD="your_gmail_app_password"
   ```

3. Run the Spring Boot application:
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Linux / macOS
   ./mvnw spring-boot:run
   ```
   The backend API will start at `http://localhost:8080`.

---

### Frontend Setup

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Create a `.env` file in the `frontend/` root:
   ```properties
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to access NEXUS locally.

---

# 🔐 Security Architecture

1. **Stateless Authentication**: Utilizes standard JSON Web Tokens (JWT). Upon successful credentials verification, the server generates a cryptographically signed token valid for 24 hours (`86400000 ms`).
2. **Password Security**: Student passwords are encrypted before storage using **BCrypt** with salted hashing.
3. **Protected Endpoints**: A custom `JwtAuthenticationFilter` intercepts all incoming requests, extracts the `Bearer` token from headers, verifies token signatures, and populates the `SecurityContextHolder`.
4. **Email OTP Verification**: Implements single-use 6-digit numeric OTPs with timestamped expiry windows for password reset operations.
5. **Decoupled Cloud Secrets**: Production credentials are never hardcoded. Azure Application Settings inject database credentials, email secrets, and Gemini keys as runtime environment variables.
6. **Strict CORS Policy**: Whitelists only the production Vercel frontend and local development servers with verified HTTP verbs and allowed headers.

---

# 📈 Future Enhancements

- [ ] **Real-Time WebSockets**: Live messaging channels and instant collaboration chat rooms.
- [ ] **Vector Search & Semantic Match**: Embed student skill embeddings into PostgreSQL using `pgvector` for hyper-precise matchmaking.
- [ ] **Resume Parsing Engine**: Automatic extraction of student skills and certifications from uploaded PDF resumes.
- [ ] **Role-Based Admin Analytics**: Advanced campus-wide dashboards for university placement cells and faculty advisors.
- [ ] **Automated GitHub Scraper**: Auto-verify student project repositories, commit statistics, and primary languages.
- [ ] **Mobile Application**: Native iOS/Android application powered by React Native.

---

# 🎓 Academic Relevance & DBMS Concepts

NEXUS was developed as a flagship project for Database Management Systems (DBMS) and modern Software Engineering, demonstrating:

1. **Relational Schema Design & Normalization**: Designed to Third Normal Form (3NF) to eliminate insertion, update, and deletion anomalies.
2. **Cardinality & Relationships**:
    - One-to-Many: Student to Goals, Notifications, Achievements, Certifications, Support Tickets.
    - Many-to-Many: Students to Skills (`StudentSkill`), Students to Interests (`StudentInterest`), Projects to Skills (`ProjectSkill`), Projects to Students (`ProjectMember`).
3. **ORM & Persistence**: Implementation of JPA entity lifecycles, cascading operations, lazy loading, and transactional integrity via Hibernate.
4. **Index Optimization & Constraints**: Unique constraints on student emails, roll numbers, and foreign keys enforcing referential integrity.
5. **Enterprise Cloud Scalability**: Practical deployment across Microsoft Azure and Vercel separating static presentation, application logic, and relational storage.

---

# 👨‍💻 Author

<div align="center">

**Rakesh Meesa**  
*B.Tech in Computer Science and Engineering (Artificial Intelligence)*  
*Specialization: Full-Stack Cloud Engineering & Generative AI Systems*

[![GitHub](https://img.shields.io/badge/GitHub-rakesh94m-181717?style=flat&logo=github)](https://github.com/rakesh94m)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com)

</div>

---

# ⭐ Conclusion

NEXUS redefines the university campus experience by consolidating student profiles, project lifecycles, peer networking, and AI-driven career guidance into a single unified cloud system. By orchestrating **React 19, Vite, Spring Boot 3, Azure PostgreSQL, Vercel, and Google Gemini 3.6 Flash**, NEXUS serves as a scalable benchmark for modern academic collaboration platforms.
