# CareerAI Platform - API Reference

Backend APIs powering the AI career platform UI. **Requires `OPENAI_API_KEY` in `.env.local`** for full AI features.

## Endpoints

### Resume Analysis
- **POST** `/api/resume/analyze`
- **Body**: `FormData` with `file` (PDF, DOCX, or TXT, max 5MB)
- **Response**: `{ overallScore, categories, keywords, suggestions }`

### Skill Assessment
- **GET** `/api/skills`
- **Response**: `{ skills: Skill[], radarSkills: RadarSkill[] }`

### Career Paths
- **GET** `/api/career-paths`
- **Response**: `{ paths: CareerPath[] }`

### AI Chat
- **POST** `/api/chat`
- **Body**: `{ messages: { role: "user" | "assistant", content: string }[] }`
- **Response**: `{ message: string }`

### Learning Paths
- **GET** `/api/learning-paths`
- **Response**: `{ paths: LearningPath[] }`

## Running the app

```bash
pnpm install
pnpm dev
```

The frontend is wired to these APIs via `lib/api.ts` and `hooks/use-api.ts`.
