# BLKOUT Learning Platform

**Status**: ✅ Fully Implemented (January 10, 2026)
**Integration**: IVOR AI-powered learning delivery
**Liberation Values**: Cooperative learning, trauma-informed pedagogy, skill sovereignty

---

## Overview

The Learning Platform is BLKOUT's self-improvement and education infrastructure, integrated with IVOR AI chat for conversational learning delivery. It centers Black queer liberation values in all curriculum and pedagogy.

### Core Features

1. **Learning Modules** - 5 liberation-focused courses
2. **IVOR Chat Integration** - Conversational lesson delivery
3. **Interactive Quizzes** - Knowledge assessment with IVOR
4. **Skill Exchange Marketplace** - Community skill sharing
5. **Mentorship Matching** - Long-term learning relationships
6. **Certificate Generation** - Verifiable credentials

---

## Architecture

### Database Schema

**8 Core Tables:**

1. `learning_modules` - Course content and metadata
2. `learning_progress` - User enrollment and completion tracking
3. `skill_exchange` - Community skill sharing posts
4. `skill_exchange_matches` - Skill connection tracking
5. `mentorships` - Mentor-mentee relationships
6. `learning_certificates` - Achievement credentials
7. `learning_pathways` - Curated learning journeys
8. `learning_community_posts` - Discussion and peer support

**Location**: `/apps/community-platform/database/learning-platform-schema.sql`

### API Endpoints (IVOR Backend)

**Base URL**: `https://ivor.blkoutuk.cloud/api/learning`

#### Module Management
- `GET /modules` - Get all available modules
- `GET /modules/:id` - Get specific module
- `GET /recommendations/:userId` - Get personalized recommendations

#### Progress Tracking
- `POST /enroll` - Enroll in module
- `GET /progress/:userId` - Get all user progress
- `GET /progress/:userId/:moduleId` - Get specific module progress
- `PUT /progress` - Update learning progress

#### Assessment
- `POST /quiz/submit` - Submit quiz results
- `POST /certificate/generate` - Generate completion certificate

#### IVOR Chat Integration
- `POST /chat/lesson` - Get conversational lesson
- `POST /chat/quiz` - Get quiz question
- `POST /chat/quiz/check` - Check quiz answer

**Location**: `/apps/ivor-core/src/api/learning.ts`

### Frontend Components

**React Components:**

1. `LearningDashboard.tsx` - Main learning interface
2. `SkillExchangeMarketplace.tsx` - Skill sharing marketplace
3. `LearningCertificate.tsx` - Certificate display and download

**Location**: `/apps/community-platform/src/components/`

---

## Initial Learning Modules

### 1. Cooperative Ownership 101
- **Duration**: 40 minutes
- **Difficulty**: Beginner
- **Liberation Values**: Cooperative ownership (10/10), Economic justice (9/10)
- **Topics**: What is a cooperative, types of cooperatives, BLKOUT as cooperative

### 2. Democratic Decision-Making Skills
- **Duration**: 50 minutes
- **Difficulty**: Intermediate
- **Liberation Values**: Democratic governance (10/10), Trauma-informed (9/10)
- **Topics**: Consensus building, facilitation techniques, conflict resolution

### 3. Digital Sovereignty & Privacy
- **Duration**: 60 minutes
- **Difficulty**: Intermediate
- **Liberation Values**: Data sovereignty (10/10), Economic justice (7/10)
- **Topics**: Surveillance capitalism, privacy tools, digital autonomy

### 4. Trauma-Informed Community Care
- **Duration**: 65 minutes
- **Difficulty**: Intermediate
- **Liberation Values**: Trauma-informed (10/10), Democratic governance (7/10)
- **Topics**: Understanding trauma, healing-centered practices, safer spaces

### 5. Economic Justice & Mutual Aid
- **Duration**: 65 minutes
- **Difficulty**: Intermediate
- **Liberation Values**: Economic justice (10/10), Cooperative ownership (9/10)
- **Topics**: Capitalism vs. community economics, mutual aid principles, economic power

---

## Deployment Instructions

### 1. Apply Database Schema

```bash
# Navigate to community platform
cd /home/robbe/blkout-platform/apps/community-platform

# Apply schema to Supabase (production)
psql $DATABASE_URL -f database/learning-platform-schema.sql

# Or use the deployment script
psql $DATABASE_URL -f database/apply-learning-schema.sql
```

### 2. Update IVOR Server

**File**: `/apps/ivor-core/src/server.ts`

```typescript
// Import learning routes (ALREADY ADDED)
import learningRoutes from './api/learning.js'

// Add to API routes (ALREADY ADDED)
app.use('/api/learning', learningRoutes)
```

### 3. Add Frontend Routes

**File**: `/apps/community-platform/src/App.tsx`

```typescript
import LearningDashboard from './components/LearningDashboard'
import SkillExchangeMarketplace from './components/SkillExchangeMarketplace'

// Add routes
<Route path="/learning" element={<LearningDashboard />} />
<Route path="/skills" element={<SkillExchangeMarketplace />} />
```

### 4. Configure Environment Variables

**IVOR Backend** (`.env`):
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Deploy to Production

```bash
# Deploy IVOR backend
cd /home/robbe/blkout-platform/apps/ivor-core
npm run build
# Deploy to ivor.blkoutuk.cloud via Coolify

# Deploy community platform frontend
cd /home/robbe/blkout-platform/apps/community-platform
npm run build
# Deploy to blkoutuk.com via Vercel/Coolify
```

---

## Usage Examples

### Enrolling in a Module

```typescript
const enrollUser = async (userId: string, moduleId: string) => {
  const response = await fetch('https://ivor.blkoutuk.cloud/api/learning/enroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, moduleId })
  });

  const data = await response.json();
  console.log('Enrollment ID:', data.progressId);
};
```

### Getting Lesson from IVOR

```typescript
const getLesson = async (moduleId: string, sectionIndex: number) => {
  const response = await fetch('https://ivor.blkoutuk.cloud/api/learning/chat/lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId, sectionIndex })
  });

  const data = await response.json();
  console.log(data.lesson); // Formatted lesson content
  console.log(data.context); // IVOR conversation context
};
```

### Submitting Quiz

```typescript
const submitQuiz = async (userId: string, moduleId: string, score: number) => {
  const response = await fetch('https://ivor.blkoutuk.cloud/api/learning/quiz/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, moduleId, score, passingScore: 70 })
  });

  const data = await response.json();
  if (data.passed) {
    console.log('Quiz passed! Generating certificate...');
    // Generate certificate
  }
};
```

### Generating Certificate

```typescript
const generateCertificate = async (userId: string, moduleId: string) => {
  const response = await fetch('https://ivor.blkoutuk.cloud/api/learning/certificate/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, moduleId })
  });

  const data = await response.json();
  console.log('Certificate ID:', data.certificateId);
};
```

---

## IVOR Chat Integration

### Lesson Delivery Flow

1. **User enrolls** in module via frontend
2. **Frontend requests** first lesson from `/api/learning/chat/lesson`
3. **IVOR delivers** conversational lesson with reflection prompts
4. **User progresses** through sections via chat
5. **Progress tracked** automatically in database
6. **Quiz triggered** when all sections complete

### Conversational Pedagogy

IVOR uses trauma-informed teaching approach:

- **Warm, affirming tone** - "We" language, collective liberation
- **Culturally responsive** - Centers Black queer experience
- **Trauma-informed** - Gentle, empowering, celebrates progress
- **Interactive** - Reflection questions, real-world application
- **Liberation-focused** - Connects learning to community values

### Example IVOR Conversation

```
IVOR: Welcome to Cooperative Ownership 101! I'm IVOR, and I'll be your guide
      through this journey. Let's explore how cooperative ownership can be a
      tool for liberation. 🏴‍☠️

      **What is a Cooperative?**

      A cooperative is a business owned and democratically controlled by its
      members. Unlike traditional businesses where profits go to external
      investors, cooperatives return value directly to the people doing the work.

      💭 **Reflect on this:**
      • What does ownership mean to you?
      • Have you ever been part of a group decision?

      📊 **Progress:** 33% complete
      ⏱️ **Estimated time:** 10 minutes

      Ready to continue? Just say "next" or "continue".

User: next

IVOR: Excellent! Let's dive into the different types of cooperatives...
```

---

## Skill Exchange Marketplace

### Features

- **Post skills** you're offering or seeking
- **Browse skills** by category and experience level
- **Filter by compensation** type (free, time exchange, mutual aid, etc.)
- **Connect with members** for skill sharing
- **Track exchanges** and provide feedback

### Compensation Models

1. **Free (Community Gift)** - No exchange expected
2. **Time Exchange** - Trade equal time (1 hour for 1 hour)
3. **Sliding Scale** - Pay what you can afford
4. **Mutual Aid Suggested** - Recommended contribution
5. **Negotiable** - Discuss terms directly

---

## Mentorship System

### Features (Coming Soon)

- **Match mentors** with mentees based on focus areas
- **Track mentorship** progress and goals
- **Schedule check-ins** and reflection sessions
- **Measure outcomes** for community benefit
- **Democratic matching** - Self-organized or platform-suggested

### Focus Areas

- Leadership development
- Cooperative business skills
- Digital sovereignty advocacy
- Trauma-informed facilitation
- Economic justice education

---

## Testing Checklist

### Database Testing

```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'learning_%';

-- Check sample modules
SELECT id, title, category, difficulty_level FROM learning_modules;

-- Test enrollment function
SELECT enroll_in_module('<module_id>');

-- Check progress
SELECT * FROM learning_progress WHERE user_id = '<user_id>';
```

### API Testing

```bash
# Get all modules
curl https://ivor.blkoutuk.cloud/api/learning/modules

# Get specific module
curl https://ivor.blkoutuk.cloud/api/learning/modules/<module_id>

# Enroll in module
curl -X POST https://ivor.blkoutuk.cloud/api/learning/enroll \
  -H "Content-Type: application/json" \
  -d '{"userId": "<user_id>", "moduleId": "<module_id>"}'

# Get lesson
curl -X POST https://ivor.blkoutuk.cloud/api/learning/chat/lesson \
  -H "Content-Type: application/json" \
  -d '{"moduleId": "<module_id>", "sectionIndex": 0}'
```

### Frontend Testing

1. Navigate to `/learning`
2. Verify modules display correctly
3. Enroll in a module
4. Start learning with IVOR chat
5. Complete quiz
6. Generate certificate
7. Download/share certificate

---

## Monitoring & Analytics

### Key Metrics

- **Enrollment rate** - % of users enrolling in modules
- **Completion rate** - % of enrolled users completing modules
- **Average quiz score** - Learning effectiveness measure
- **Time to completion** - Average time per module
- **Skill exchange activity** - Connections made per month
- **Liberation values alignment** - Module ratings by value

### Database Queries

```sql
-- Platform-wide completion rate
SELECT
  ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL /
         COUNT(*)::DECIMAL * 100), 2) as completion_rate
FROM learning_progress;

-- Most popular modules
SELECT lm.title, lm.enrollment_count, lm.completion_count
FROM learning_modules lm
ORDER BY enrollment_count DESC
LIMIT 10;

-- Average quiz scores by module
SELECT lm.title, AVG(lp.quiz_score) as avg_score
FROM learning_progress lp
JOIN learning_modules lm ON lp.module_id = lm.id
WHERE lp.quiz_score IS NOT NULL
GROUP BY lm.title
ORDER BY avg_score DESC;
```

---

## Future Enhancements

### Phase 2 Features

1. **Peer Learning Groups** - Study circles and reading groups
2. **Live Workshops** - Scheduled interactive sessions
3. **Advanced Pathways** - Multi-module learning journeys
4. **Gamification** - Badges, streaks, community challenges
5. **Content Creation Tools** - Community-authored modules
6. **Integration with CRM** - Learning tied to membership benefits

### Technical Improvements

1. **PDF Certificate Generation** - Server-side rendering
2. **Email Notifications** - Progress reminders, new modules
3. **Mobile App** - Offline learning capability
4. **Video Integration** - Embedded lessons and demos
5. **Analytics Dashboard** - Learning insights for admins

---

## Support & Contribution

### Getting Help

- **Technical Issues**: File issue in GitHub repository
- **Content Questions**: Ask IVOR in learning chat
- **Feature Requests**: Discuss in governance proposals

### Contributing Content

Want to create a learning module?

1. Propose module topic in governance platform
2. Get community approval
3. Draft content using liberation values framework
4. Submit for review
5. Module published to platform

---

## License & Values

**License**: AGPL-3.0 (Copyleft for community protection)

**Liberation Values**:
- ✊ Cooperative ownership and democratic control
- 🏴‍☠️ Data sovereignty and digital autonomy
- 💜 Trauma-informed and healing-centered design
- 🌈 Economic justice and mutual aid
- 🎓 Education as liberation practice

---

**BLKOUT UK Cooperative © 2026**
*Learning together, building liberation, owning our future*

For questions or support, contact: platform@blkoutuk.com
