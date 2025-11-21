import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Question, AnswerOption, QuizSession } from '../types/quiz';

const QuizPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { supabase } = useSupabase();
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (categoryId) {
      fetchQuestions(categoryId);
    }
  }, [categoryId]);

  const fetchQuestions = async (catId: string) => {
    try {
      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          *,
          answer_options (*)
        `)
        .eq('category_id', catId);

      if (error) {
        console.error('Error fetching questions:', error);
        // Use sample data for demo
        const sampleQuestions = getSampleQuestions(catId);
        initializeQuiz(sampleQuestions);
        setError('Using sample data for demonstration');
      } else {
        const questionsWithOptions = questions || getSampleQuestions(catId);
        initializeQuiz(questionsWithOptions);
      }
    } catch (err) {
      console.error('Error:', err);
      const sampleQuestions = getSampleQuestions(catId);
      initializeQuiz(sampleQuestions);
      setError('Failed to connect to database. Using sample data.');
    } finally {
      setLoading(false);
    }
  };

  const getSampleQuestions = (catId: string): Question[] => {
    const questionSets: { [key: string]: Question[] } = {
      '1': [ // Basic Alphabet
        {
          id: 'q1',
          category_id: catId,
          question_text: 'What letter does this sign represent?',
          media_url: '/images/sign-a.jpg',
          media_type: 'image',
          correct_answer: 'A',
          created_at: new Date().toISOString(),
          answer_options: [
            { id: 'a1', question_id: 'q1', option_text: 'A', created_at: new Date().toISOString() },
            { id: 'a2', question_id: 'q1', option_text: 'B', created_at: new Date().toISOString() },
            { id: 'a3', question_id: 'q1', option_text: 'C', created_at: new Date().toISOString() },
            { id: 'a4', question_id: 'q1', option_text: 'D', created_at: new Date().toISOString() }
          ]
        },
        {
          id: 'q2',
          category_id: catId,
          question_text: 'Which sign represents the letter "E"?',
          correct_answer: 'Option 2',
          created_at: new Date().toISOString(),
          answer_options: [
            { id: 'a5', question_id: 'q2', option_text: 'Option 1', media_url: '/images/sign-d.jpg', media_type: 'image', created_at: new Date().toISOString() },
            { id: 'a6', question_id: 'q2', option_text: 'Option 2', media_url: '/images/sign-e.jpg', media_type: 'image', created_at: new Date().toISOString() },
            { id: 'a7', question_id: 'q2', option_text: 'Option 3', media_url: '/images/sign-f.jpg', media_type: 'image', created_at: new Date().toISOString() },
            { id: 'a8', question_id: 'q2', option_text: 'Option 4', media_url: '/images/sign-g.jpg', media_type: 'image', created_at: new Date().toISOString() }
          ]
        }
      ],
      '2': [ // Numbers
        {
          id: 'q3',
          category_id: catId,
          question_text: 'What number is being signed?',
          media_url: '/videos/number-3.mp4',
          media_type: 'video',
          correct_answer: '3',
          created_at: new Date().toISOString(),
          answer_options: [
            { id: 'a9', question_id: 'q3', option_text: '1', created_at: new Date().toISOString() },
            { id: 'a10', question_id: 'q3', option_text: '2', created_at: new Date().toISOString() },
            { id: 'a11', question_id: 'q3', option_text: '3', created_at: new Date().toISOString() },
            { id: 'a12', question_id: 'q3', option_text: '4', created_at: new Date().toISOString() }
          ]
        }
      ]
    };

    return questionSets[catId] || [
      {
        id: 'default',
        category_id: catId,
        question_text: 'Sample question for this category',
        correct_answer: 'Sample Answer',
        created_at: new Date().toISOString(),
        answer_options: [
          { id: 'default1', question_id: 'default', option_text: 'Sample Answer', created_at: new Date().toISOString() },
          { id: 'default2', question_id: 'default', option_text: 'Wrong Answer 1', created_at: new Date().toISOString() },
          { id: 'default3', question_id: 'default', option_text: 'Wrong Answer 2', created_at: new Date().toISOString() },
          { id: 'default4', question_id: 'default', option_text: 'Wrong Answer 3', created_at: new Date().toISOString() }
        ]
      }
    ];
  };

  const initializeQuiz = (questions: Question[]) => {
    if (questions.length > 0) {
      setQuizSession({
        questions,
        currentQuestionIndex: 0,
        answers: {},
        score: 0,
        completed: false
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!quizSession || !selectedAnswer) return;

    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    setShowResult(true);
    setFeedback(isCorrect ? 'Correct! Great job!' : `Incorrect. The correct answer is: ${currentQuestion.correct_answer}`);

    const updatedSession = {
      ...quizSession,
      answers: {
        ...quizSession.answers,
        [currentQuestion.id]: selectedAnswer
      },
      score: isCorrect ? quizSession.score + 1 : quizSession.score
    };

    setQuizSession(updatedSession);
  };

  const handleNextQuestion = () => {
    if (!quizSession) return;

    const nextIndex = quizSession.currentQuestionIndex + 1;
    
    if (nextIndex >= quizSession.questions.length) {
      // Quiz completed
      setQuizSession({
        ...quizSession,
        completed: true
      });
    } else {
      setQuizSession({
        ...quizSession,
        currentQuestionIndex: nextIndex
      });
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedback('');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading quiz...</div>
      </div>
    );
  }

  if (!quizSession) {
    return (
      <div className="container">
        <div className="error">No questions available for this category.</div>
        <Link to="/" className="nav-button">Back to Categories</Link>
      </div>
    );
  }

  if (quizSession.completed) {
    const scorePercentage = Math.round((quizSession.score / quizSession.questions.length) * 100);
    
    return (
      <div className="container">
        <div className="quiz-card">
          <h2>Quiz Completed!</h2>
          <div style={{ fontSize: '48px', margin: '20px 0' }}>🎉</div>
          <h3>Your Score: {quizSession.score} / {quizSession.questions.length}</h3>
          <h4>Percentage: {scorePercentage}%</h4>
          
          {scorePercentage >= 80 && <p style={{ color: '#4CAF50', fontSize: '18px' }}>Excellent work! 🌟</p>}
          {scorePercentage >= 60 && scorePercentage < 80 && <p style={{ color: '#FF9800', fontSize: '18px' }}>Good job! Keep practicing! 👍</p>}
          {scorePercentage < 60 && <p style={{ color: '#f44336', fontSize: '18px' }}>Keep practicing to improve! 💪</p>}
          
          <div style={{ marginTop: '30px' }}>
            <Link to="/" className="nav-button">Back to Categories</Link>
            <Link to="/progress" className="nav-button">View Progress</Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex];
  const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100;

  return (
    <div className="container">
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      <div className="quiz-card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        
        <h3>Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}</h3>
        
        <h2>{currentQuestion.question_text}</h2>
        
        {currentQuestion.media_url && (
          <div>
            {currentQuestion.media_type === 'video' ? (
              <video 
                className="question-media" 
                controls 
                poster="/images/video-placeholder.jpg"
              >
                <source src={currentQuestion.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                className="question-media" 
                src={currentQuestion.media_url} 
                alt="Sign language demonstration"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-sign.jpg';
                }}
              />
            )}
          </div>
        )}
        
        <div className="answer-options">
          {currentQuestion.answer_options?.map((option) => (
            <button
              key={option.id}
              className={`answer-button ${
                selectedAnswer === option.option_text ? 'selected' : ''
              } ${
                showResult
                  ? option.option_text === currentQuestion.correct_answer
                    ? 'correct'
                    : selectedAnswer === option.option_text
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
              onClick={() => !showResult && handleAnswerSelect(option.option_text)}
              disabled={showResult}
            >
              {option.media_url ? (
                <div>
                  {option.media_type === 'image' && (
                    <img
                      src={option.media_url}
                      alt={option.option_text}
                      style={{ width: '100%', maxWidth: '150px', height: 'auto', borderRadius: '8px' }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-sign.jpg';
                      }}
                    />
                  )}
                  <p>{option.option_text}</p>
                </div>
              ) : (
                option.option_text
              )}
            </button>
          ))}
        </div>
        
        {feedback && (
          <div style={{ 
            margin: '20px 0', 
            padding: '15px', 
            borderRadius: '10px',
            background: feedback.includes('Correct') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
            border: `1px solid ${feedback.includes('Correct') ? '#4CAF50' : '#f44336'}`
          }}>
            <h4>{feedback}</h4>
          </div>
        )}
        
        <div style={{ marginTop: '30px' }}>
          {!showResult ? (
            <button 
              className="nav-button" 
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              style={{ 
                opacity: selectedAnswer ? 1 : 0.5,
                cursor: selectedAnswer ? 'pointer' : 'not-allowed'
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button className="nav-button" onClick={handleNextQuestion}>
              {quizSession.currentQuestionIndex + 1 >= quizSession.questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
          
          <Link to="/" className="nav-button">Exit Quiz</Link>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;