# AI Quick Analysis - Client

**AI Quick Analysis** is a modern, AI-powered assessment platform designed to help educators create engaging quizzes instantly and providing students with real-time feedback. This repository contains the frontend client built with **Angular 18+**.

![Project Status](https://img.shields.io/badge/Status-Development-blue)
![Framework](https://img.shields.io/badge/Framework-Angular%2018-red)
![Style](https://img.shields.io/badge/UI-Material%20Design%20%2B%20Glassmorphism-purple)

---

## 🚀 Features

### 1. Modern Landing Page
-   **Dark Premium Theme**: "Tech Grid" background with vibrant aurora (Violet/Sky Blue) gradients.
-   **Hero Section**: Glassmorphic dashboard mockup and interactive CTA buttons.
-   **Navigation**: Smooth scrolling to "Features" and "Pricing" sections.
-   **Components**: Feature cards with hover effects, 3-tier Pricing section with highlights.

### 2. Authentication
-   **Flow**: Full Login, Signup, and Forgot Password worklows.
-   **Design**: Glassmorphic auth cards consistent with the landing theme.
-   **UX**: Floating labels, password visibility toggles, and seamless routing.

### 3. Teacher Dashboard
-   **Create Assessment**: UI for uploading content (PDF/Text) to generate AI quizzes.
-   **My Quizzes**: Manage created assessments with sort/filter capabilities.
-   **Reports & Analytics**:
    -   Detailed performance stats (Avg Score, High/Low, Participants).
    -   Visual charts and data tables.
    -   **Export Tools**: Client-side **PDF Download** (via `jspdf`) and **CSV Export** for results.

### 4. Student Portal
-   **Join Quiz**: Simple code-entry interface.
-   **Interactive Quiz**: Step-by-step question flow with timer and progress tracking.
-   **Results**: Instant performance feedback and score display.

---

## 🛠 Tech Stack

-   **Framework**: Angular 18 (Standalone Components)
-   **Language**: TypeScript
-   **Styling**: SCSS (Custom mixins, CSS Variables), Angular Material
-   **Animation**: CSS Keyframes (Aurora effects, Fade-ins)
-   **Libraries**:
    -   `@angular/material`: UI Components
    -   `jspdf` & `jspdf-autotable`: PDF Generation
    -   `ngx-charts` (Prepared for analytics)

---

## 🔌 Backend Requirements (API Specification)

To make this frontend fully functional, the backend server must implement the following REST API endpoints:

### Authentication
| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `{email, password}` | authenticate user & return JWT |
| `POST` | `/api/auth/signup` | `{name, email, password}` | register new user |
| `POST` | `/api/auth/forgot-password` | `{email}` | initiate password reset flow |

### Assessments (Teacher)
| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/assessments/generate` | `FormData` (file/text, topic) | trigger AI to generate questions |
| `GET` | `/api/assessments` | - | list all quizzes created by user |
| `GET` | `/api/assessments/:id` | - | get full details of a specific quiz |
| `DELETE`| `/api/assessments/:id` | - | delete a quiz |

### Reports & Analytics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/assessments/:id/stats` | Get high-level stats (avg score, total participants) |
| `GET` | `/api/assessments/:id/results` | Get list of student attempts (name, score, time) |

### Student Quiz Flow
| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/quiz/join` | `{code, studentName}` | validate code and join session |
| `GET` | `/api/quiz/:id/questions` | - | fetch questions for the session |
| `POST` | `/api/quiz/submit` | `{quizId, answers[]}` | submit answers and calculate score |

---

## 💻 Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm (v9 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ai-quick-analysis-client.git
    cd ai-quick-analysis-client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Development Server

Run the dev server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

### Build

Build the project for production:
```bash
npm run build
```
The build artifacts will be stored in the `dist/` directory.

---

## 🎨 Design System

-   **Colors**:
    -   Primary: Zinc 950 (`#09090b`)
    -   Accents: Violet (`#8b5cf6`), Sky Blue (`#38bdf8`)
-   **Typography**: 'Inter', sans-serif

---

**Developed for AI Knowledge Management System Project.**
