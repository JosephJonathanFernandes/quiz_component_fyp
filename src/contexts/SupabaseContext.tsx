import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Replace with your actual Supabase URL and API key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

interface SupabaseContextType {
  supabase: SupabaseClient<Database>;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabase] = useState(() => createClient<Database>(supabaseUrl, supabaseAnonKey));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize any setup here
    setLoading(false);
  }, []);

  const value = {
    supabase,
    loading
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};