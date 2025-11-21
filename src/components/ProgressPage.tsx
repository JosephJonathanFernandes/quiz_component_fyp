import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { UserProgress, Category } from '../types/quiz';

const ProgressPage: React.FC = () => {
  const { supabase } = useSupabase();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSampleProgress = (): UserProgress[] => [
    {
      id: '1',
      user_id: 'demo-user',
      question_id: 'q1',
      selected_answer: 'A',
      is_correct: true,
      completed_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '2',
      user_id: 'demo-user',
      question_id: 'q2',
      selected_answer: 'Option 2',
      is_correct: true,
      completed_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      user_id: 'demo-user',
      question_id: 'q3',
      selected_answer: '2',
      is_correct: false,
      completed_at: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  const getSampleCategories = (): Category[] => [
    {
      id: '1',
      name: 'Basic Alphabet',
      description: 'Learn the basic sign language alphabet A-Z',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Numbers',
      description: 'Practice sign language numbers 1-10',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchProgress();
    fetchCategories();
  }, []);

  const fetchProgress = async () => {
    try {
      const userId = 'demo-user';
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching progress:', error);
        setError('Failed to load progress data');
        setProgress(getSampleProgress());
      } else {
        setProgress(data || getSampleProgress());
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to connect to database');
      setProgress(getSampleProgress());
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        setCategories(getSampleCategories());
      } else {
        setCategories(data || getSampleCategories());
      }
    } catch (err) {
      console.error('Error:', err);
      setCategories(getSampleCategories());
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryStats = (categoryId: string) => {
    const categoryProgress = progress.filter((p: UserProgress) => 
      (categoryId === '1' && ['q1', 'q2'].indexOf(p.question_id) !== -1) ||
      (categoryId === '2' && ['q3'].indexOf(p.question_id) !== -1)
    );
    
    const totalQuestions = categoryId === '1' ? 2 : categoryId === '2' ? 1 : 0;
    const completedQuestions = categoryProgress.length;
    const correctAnswers = categoryProgress.filter((p: UserProgress) => p.is_correct).length;
    const accuracy = completedQuestions > 0 ? (correctAnswers / completedQuestions) * 100 : 0;
    
    return {
      totalQuestions,
      completedQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy)
    };
  };

  const getOverallStats = () => {
    const totalCompleted = progress.length;
    const totalCorrect = progress.filter((p: UserProgress) => p.is_correct).length;
    const overallAccuracy = totalCompleted > 0 ? (totalCorrect / totalCompleted) * 100 : 0;
    
    return {
      totalCompleted,
      totalCorrect,
      accuracy: Math.round(overallAccuracy)
    };
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading progress...</div>
      </div>
    );
  }

  const overallStats = getOverallStats();

  return (
    <div className="container">
      <div className="header">
        <h1>Your Learning Progress</h1>
        <p>Track your sign language learning journey</p>
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
          <p>Showing sample data for demonstration</p>
        </div>
      )}

      <div className="quiz-card">
        <h2>Overall Statistics</h2>
        <div className="progress-stats">
          <div className="stat-item">
            <h3>{overallStats.totalCompleted}</h3>
            <p>Questions Completed</p>
          </div>
          <div className="stat-item">
            <h3>{overallStats.totalCorrect}</h3>
            <p>Correct Answers</p>
          </div>
          <div className="stat-item">
            <h3>{overallStats.accuracy}%</h3>
            <p>Overall Accuracy</p>
          </div>
        </div>
      </div>

      <h2>Progress by Category</h2>
      
      {categories.map((category: Category) => {
        const stats = calculateCategoryStats(category.id);
        const progressPercentage = stats.totalQuestions > 0 
          ? (stats.completedQuestions / stats.totalQuestions) * 100 
          : 0;

        return (
          <div key={category.id} className="quiz-card">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>            <div className="progress-stats">
              <div className="stat-item">
                <h4>{stats.completedQuestions}/{stats.totalQuestions}</h4>
                <p>Questions Completed</p>
              </div>
              <div className="stat-item">
                <h4>{stats.accuracy}%</h4>
                <p>Accuracy</p>
              </div>
            </div>
            
            <Link to={`/quiz/${category.id}`} className="nav-button">
              {stats.completedQuestions === 0 ? 'Start Learning' : 'Continue Practice'}
            </Link>
          </div>
        );
      })}

      {progress.length === 0 && (
        <div className="quiz-card">
          <h3>No progress yet</h3>
          <p>Start taking quizzes to track your progress!</p>
        </div>
      )}

      <div className="quiz-card">
        <h3>Recent Activity</h3>
        {progress.slice(-5).reverse().map((item: UserProgress, index: number) => (
          <div key={item.id} className="activity-item">
            <p>
              Question answered {item.is_correct ? 'correctly' : 'incorrectly'} 
              {' '}
              <span className={`status ${item.is_correct ? 'correct' : 'incorrect'}`}>
                {item.is_correct ? '✓' : '✗'}
              </span>
            </p>
            <small>{new Date(item.completed_at).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="quiz-actions">
        <Link to="/" className="nav-button">Back to Categories</Link>
      </div>
    </div>
  );
};

export default ProgressPage;