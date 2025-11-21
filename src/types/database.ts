export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          category_id: string;
          question_text: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          correct_answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          question_text: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          correct_answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          question_text?: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          correct_answer?: string;
          created_at?: string;
        };
      };
      answer_options: {
        Row: {
          id: string;
          question_id: string;
          option_text: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          option_text: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          option_text?: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          selected_answer: string;
          is_correct: boolean;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          selected_answer: string;
          is_correct: boolean;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          selected_answer?: string;
          is_correct?: boolean;
          completed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}