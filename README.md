# CareerAI - Agentic AI Career Platform

AI-powered career platform with resume analysis, skill assessment, career path recommendations, and personalized learning paths.

## Setup

### 1. Install dependencies

```bash
pnpm install
# or: npm install --legacy-peer-deps
```

### 2. Add your OpenAI API key

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
3. Edit `.env.local` and add your key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

### 3. Run the app

```bash
pnpm dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Resume Analysis** – Upload PDF/DOCX/TXT, get AI-powered analysis with scores and suggestions
- **Skill Assessment** – Personalized skill evaluation (uses resume context when available)
- **Career Paths** – AI-generated career recommendations
- **AI Chat** – Conversational career advisor powered by OpenAI
- **Learning Paths** – Personalized course recommendations (updates when you select a career path)
- All buttons and links are wired and interactive

## Without API key

The app works without an API key but uses fallback mock data. Add `OPENAI_API_KEY` for full AI-powered features.
