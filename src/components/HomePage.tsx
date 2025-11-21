import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Category } from '../types/quiz';

const HomePage: React.FC = () => {
  const { supabase } = useSupabase();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', error);
        // For demo purposes, use sample data
        setCategories(getSampleCategories());
      } else {
        setCategories(data || getSampleCategories());
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to connect to database');
      // Use sample data for demo
      setCategories(getSampleCategories());
    } finally {
      setLoading(false);
    }
  };

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
    },
    {
      id: '3',
      name: 'Common Words',
      description: 'Essential everyday words in sign language',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Greetings',
      description: 'Hello, goodbye, and other greeting signs',
      created_at: new Date().toISOString()
    }
  ];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Sign Language Learning Quiz</h1>
        <p>Choose a category to start learning sign language</p>
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
          <p>Using sample data for demonstration</p>
        </div>
      )}

      <div className="category-grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/quiz/${category.id}`}
            className="category-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/progress" className="nav-button">
          View Progress
        </Link>
      </div>
    </div>
  );
};

export default HomePage;