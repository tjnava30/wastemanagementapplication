import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Feedback {
  id: string;
  course: string;
  teacher: string;
  feedback_date: string;
  content_rating: number;
  delivery_rating: number;
  pace_rating: number;
  clarity_rating: number;
  created_at: string;
}
