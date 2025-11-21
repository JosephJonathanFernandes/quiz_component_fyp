import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ProgressPage from './components/ProgressPage';
import './App.css';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/:categoryId" element={<QuizPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </div>
      </Router>
    </SupabaseProvider>
  );
}

export default App;