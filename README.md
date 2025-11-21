# Sign Language Learning Quiz Application

A React TypeScript application for learning sign language through interactive quizzes, powered by Supabase.

## Features

- 📚 **Multiple Categories**: Alphabet, Numbers, Common Words, and Greetings
- 🎥 **Media Support**: Video and image-based questions and answers
- 📊 **Progress Tracking**: Monitor your learning progress and accuracy
- 💯 **Quiz Scoring**: Real-time feedback and score calculation
- 🎨 **Modern UI**: Responsive design with beautiful gradients and animations
- 📱 **Mobile Friendly**: Works on all devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Supabase (PostgreSQL database, authentication, storage)
- **Routing**: React Router DOM
- **Styling**: CSS with modern glass-morphism effects

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (optional - app works with sample data)

### Installation

1. **Clone or download the project**
   ```bash
   cd quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Database Schema (Optional Supabase Setup)

If you want to use your own Supabase database instead of the sample data, create these tables:

```sql
-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  media_url TEXT,
  media_type VARCHAR CHECK (media_type IN ('image', 'video')),
  correct_answer VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answer options table
CREATE TABLE answer_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_text VARCHAR NOT NULL,
  media_url TEXT,
  media_type VARCHAR CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer VARCHAR NOT NULL,
  is_correct BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO categories (id, name, description) VALUES 
('cat-1', 'Basic Alphabet', 'Learn the basic sign language alphabet A-Z'),
('cat-2', 'Numbers', 'Practice sign language numbers 1-10'),
('cat-3', 'Common Words', 'Essential everyday words in sign language'),
('cat-4', 'Greetings', 'Hello, goodbye, and other greeting signs');
```

## Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.tsx     # Main category selection page
│   ├── QuizPage.tsx     # Quiz interface
│   └── ProgressPage.tsx # Progress tracking
├── contexts/            # React contexts
│   └── SupabaseContext.tsx
├── types/               # TypeScript type definitions
│   ├── database.ts      # Supabase database types
│   └── quiz.ts          # Quiz-related types
├── App.tsx             # Main application component
├── App.css             # Application styles
└── index.tsx           # Application entry point
```

## Features in Detail

### 🎯 Quiz System
- Multiple-choice questions with text and media options
- Real-time answer validation and feedback
- Progressive difficulty across categories
- Score calculation and performance metrics

### 📱 Responsive Design
- Mobile-first approach
- Glassmorphism UI effects
- Smooth animations and transitions
- Cross-browser compatibility

### 📊 Progress Tracking
- Individual question history
- Category-wise progress statistics
- Overall accuracy measurements
- Recent activity timeline

### 🎥 Media Support
- Image-based sign language demonstrations
- Video question support
- Responsive media player
- Fallback for missing media

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Notes

### Sample Data
The application includes comprehensive sample data that demonstrates all features without requiring a database setup. This includes:
- 4 quiz categories
- Sample questions with various answer types
- Mock progress data
- Placeholder media URLs

### Media Assets
For a production deployment, you would need to:
- Add actual sign language images and videos
- Store media in Supabase Storage or a CDN
- Update the media URLs in your database

### Environment Variables
- The app works without Supabase configuration using sample data
- Add Supabase credentials to enable real database functionality
- All sensitive keys should be kept in environment variables

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue in the repository.