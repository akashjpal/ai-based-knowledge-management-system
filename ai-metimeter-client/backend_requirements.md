# Backend Requirements - AI Quick Analysis

Complete backend specification for building a fully functional REST API server.

---

## Tech Stack Recommendations

| Component | Recommended | Alternatives |
|-----------|-------------|--------------|
| Runtime | Node.js 18+ | Python 3.10+, Go |
| Framework | Express.js / NestJS | FastAPI, Gin |
| Database | PostgreSQL 15+ | MongoDB, MySQL |
| ORM | Prisma / TypeORM | Sequelize, Drizzle |
| Auth | JWT (RS256) | Auth0, Firebase Auth |
| AI Integration | OpenAI API / Google Gemini | Anthropic Claude |
| File Storage | AWS S3 / Cloudflare R2 | Local filesystem |
| Cache | Redis | In-memory |

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_quick_analysis

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Service
OPENAI_API_KEY=sk-your-openai-key
# OR
GEMINI_API_KEY=your-gemini-api-key

# File Upload
MAX_FILE_SIZE_MB=5
ALLOWED_MIME_TYPES=application/pdf,text/plain

# Optional: Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'teacher' CHECK (role IN ('teacher', 'student', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Assessments Table

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(255),
  difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  code VARCHAR(6) UNIQUE,
  time_limit_minutes INTEGER,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

### Questions Table

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL, -- [{id, text, isCorrect}]
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT,
  difficulty VARCHAR(50),
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Quiz Sessions Table

```sql
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255),
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  submitted_at TIMESTAMP,
  score INTEGER,
  total_points INTEGER,
  time_taken_seconds INTEGER
);
```

### Answers Table

```sql
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER DEFAULT 0,
  time_taken_seconds INTEGER
);
```

---

## API Endpoints

### Authentication

#### POST `/api/auth/signup`

```typescript
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response 201
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "teacher",
    "createdAt": "2026-01-03T15:00:00Z"
  },
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "expiresIn": 900
}

// Error 409
{
  "success": false,
  "error": {
    "code": "USER_EXISTS",
    "message": "Email already registered"
  }
}
```

#### POST `/api/auth/login`

```typescript
// Request
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response 200: Same as signup response

// Error 401
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

#### POST `/api/auth/forgot-password`

```typescript
// Request
{ "email": "john@example.com" }

// Response 200
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST `/api/auth/reset-password`

```typescript
// Request
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}

// Response 200
{ "success": true, "message": "Password updated successfully" }
```

#### POST `/api/auth/refresh`

```typescript
// Request
{ "refreshToken": "eyJhbG..." }

// Response 200
{
  "accessToken": "eyJhbG...",
  "expiresIn": 900
}
```

---

### Assessments (Protected - Requires JWT)

#### POST `/api/assessments/generate`

**Content-Type**: `multipart/form-data`

```typescript
// Form Fields
title: string
subject: string
topic: string
difficulty: 'easy' | 'medium' | 'hard' | 'expert'
questionsCount: number (1-20)
content?: string (text content)
file?: File (PDF, max 5MB)

// Response 201
{
  "assessment": {
    "id": "uuid",
    "title": "Biology Basics",
    "subject": "Biology",
    "topic": "Cell Structure",
    "difficulty": "medium",
    "questions": [...],
    "questionsCount": 10,
    "status": "draft",
    "createdAt": "2026-01-03T15:00:00Z"
  },
  "generatedQuestions": [...],
  "suggestedTitle": "Cell Biology Fundamentals"
}
```

**AI Prompt Template**:
```
Generate {questionsCount} multiple-choice questions about {topic} in {subject}.
Difficulty level: {difficulty}
Context: {content or extracted PDF text}

For each question, provide:
1. Question text
2. 4 options (A, B, C, D)
3. Correct answer index (0-3)
4. Brief explanation

Format as JSON array.
```

#### GET `/api/assessments`

```typescript
// Query params: ?status=published&page=1&limit=10

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Biology Quiz",
      "subject": "Biology",
      "questionsCount": 10,
      "status": "published",
      "code": "ABC123",
      "participantsCount": 25,
      "avgScore": 78.5,
      "createdAt": "2026-01-03T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 24,
    "totalPages": 3
  }
}
```

#### GET `/api/assessments/:id`

```typescript
// Response 200: Full assessment with questions array
```

#### PUT `/api/assessments/:id`

```typescript
// Request (partial update)
{
  "title": "Updated Title",
  "questions": [...]
}

// Response 200: Updated assessment
```

#### DELETE `/api/assessments/:id`

```typescript
// Response 200
{ "success": true, "message": "Assessment deleted" }
```

#### POST `/api/assessments/:id/publish`

```typescript
// Request
{ "timeLimit": 30 } // minutes (optional)

// Response 200
{
  "id": "uuid",
  "status": "published",
  "code": "XYZ789", // Generated 6-char alphanumeric
  "publishedAt": "2026-01-03T15:00:00Z"
}
```

---

### Reports & Analytics (Protected)

#### GET `/api/assessments/:id/stats`

```typescript
// Response 200
{
  "assessmentId": "uuid",
  "totalParticipants": 45,
  "completedCount": 42,
  "averageScore": 78.5,
  "highestScore": 100,
  "lowestScore": 45,
  "averageTimeSeconds": 1245,
  "completionRate": 93.3,
  "questionStats": [
    {
      "questionId": "uuid",
      "questionText": "What is...?",
      "correctCount": 38,
      "incorrectCount": 7,
      "correctPercentage": 84.4,
      "mostSelectedOptionIndex": 1
    }
  ]
}
```

#### GET `/api/assessments/:id/results`

```typescript
// Query: ?page=1&limit=20&sortBy=score&sortOrder=desc

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentName": "Jane Smith",
      "score": 85,
      "percentage": 85.0,
      "correctAnswers": 17,
      "totalQuestions": 20,
      "timeTakenSeconds": 1120,
      "submittedAt": "2026-01-03T15:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET `/api/dashboard/stats`

```typescript
// Response 200
{
  "totalAssessments": 24,
  "totalParticipants": 156,
  "avgPerformance": 82,
  "completionRate": 94
}
```

---

### Student Quiz Flow (Public)

#### POST `/api/quiz/join`

```typescript
// Request
{
  "code": "ABC123",
  "studentName": "Alice Johnson",
  "studentEmail": "alice@school.edu" // optional
}

// Response 200
{
  "sessionId": "uuid",
  "assessmentId": "uuid",
  "assessmentTitle": "Biology Quiz 101",
  "subject": "Biology",
  "questionsCount": 20,
  "timeLimit": 30,
  "startedAt": "2026-01-03T15:00:00Z",
  "expiresAt": "2026-01-03T15:30:00Z"
}

// Error 404
{
  "success": false,
  "error": {
    "code": "INVALID_CODE",
    "message": "Quiz not found or no longer active"
  }
}
```

#### GET `/api/quiz/:sessionId/questions`

```typescript
// Response 200 (no correct answers!)
[
  {
    "id": "uuid",
    "text": "What is the powerhouse of the cell?",
    "options": [
      { "id": "opt1", "text": "Nucleus" },
      { "id": "opt2", "text": "Mitochondria" },
      { "id": "opt3", "text": "Ribosome" },
      { "id": "opt4", "text": "Golgi Apparatus" }
    ],
    "points": 1
  }
]
```

#### POST `/api/quiz/submit`

```typescript
// Request
{
  "sessionId": "uuid",
  "answers": [
    { "questionId": "uuid", "selectedOptionIndex": 1 },
    { "questionId": "uuid", "selectedOptionIndex": 0 }
  ]
}

// Response 200
{
  "result": {
    "id": "uuid",
    "score": 85,
    "percentage": 85.0,
    "correctAnswers": 17,
    "totalQuestions": 20,
    "timeTakenSeconds": 1120,
    "submittedAt": "2026-01-03T15:25:00Z"
  },
  "correctAnswers": [
    {
      "questionId": "uuid",
      "selectedOptionIndex": 1,
      "correctOptionIndex": 1,
      "isCorrect": true,
      "explanation": "Mitochondria produce ATP..."
    }
  ]
}
```

---

## Error Handling

All errors should follow this format:

```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... } // Optional field-level errors
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request body |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `USER_EXISTS` | 409 | Email already registered |
| `INVALID_CODE` | 404 | Quiz code not found |
| `QUIZ_EXPIRED` | 410 | Quiz session expired |
| `ALREADY_SUBMITTED` | 409 | Quiz already submitted |
| `AI_ERROR` | 503 | AI generation failed |

---

## Authentication Middleware

```typescript
// JWT Payload
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "teacher",
  "iat": 1704300000,
  "exp": 1704300900
}

// Protected routes require header:
Authorization: Bearer <accessToken>
```

---

## Code Generation Logic

Generate 6-character alphanumeric codes for quiz joining:

```typescript
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing: 0/O, 1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

---

## CORS Configuration

```typescript
{
  origin: ['http://localhost:4200', 'https://your-frontend.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

## File Upload Handling

- Accept: `application/pdf`, `text/plain`
- Max size: 5MB
- PDF text extraction: Use `pdf-parse` or similar library
- Store files temporarily for AI processing, delete after

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/auth/*` | 5 requests/minute |
| `/api/assessments/generate` | 10 requests/hour |
| `/api/quiz/join` | 20 requests/minute |
| Other endpoints | 100 requests/minute |

---

## Recommended Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── assessment.controller.ts
│   │   ├── quiz.controller.ts
│   │   └── report.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── assessment.model.ts
│   │   └── question.model.ts
│   ├── routes/
│   │   └── index.ts
│   ├── services/
│   │   ├── ai.service.ts
│   │   ├── auth.service.ts
│   │   └── email.service.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── package.json
└── tsconfig.json
```

---

## Quick Start Commands

```bash
# Initialize project
npm init -y
npm install express cors bcryptjs jsonwebtoken @prisma/client openai multer pdf-parse
npm install -D typescript @types/node @types/express prisma nodemon

# Database
npx prisma init
npx prisma migrate dev --name init
npx prisma generate

# Run
npm run dev
```
