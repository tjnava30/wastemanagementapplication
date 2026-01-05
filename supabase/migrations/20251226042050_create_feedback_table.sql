/*
  # Create Course Feedback System

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key) - Unique identifier for each feedback entry
      - `course` (text) - Course name
      - `teacher` (text) - Teacher name
      - `feedback_date` (date) - Date of the session/course
      - `content_rating` (integer) - Rating for content quality (1-5)
      - `delivery_rating` (integer) - Rating for delivery quality (1-5)
      - `pace_rating` (integer) - Rating for pace (1-5)
      - `clarity_rating` (integer) - Rating for clarity (1-5)
      - `created_at` (timestamptz) - Timestamp when feedback was submitted
  
  2. Security
    - Enable RLS on `feedback` table
    - Add policy for public to insert feedback (students can submit)
    - Add policy for public to read feedback (admin dashboard can view)
  
  3. Constraints
    - All rating columns have CHECK constraints to ensure values are between 1 and 5
    - Course and teacher fields are required (NOT NULL)
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course text NOT NULL,
  teacher text NOT NULL,
  feedback_date date NOT NULL,
  content_rating integer NOT NULL CHECK (content_rating >= 1 AND content_rating <= 5),
  delivery_rating integer NOT NULL CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  pace_rating integer NOT NULL CHECK (pace_rating >= 1 AND pace_rating <= 5),
  clarity_rating integer NOT NULL CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view feedback"
  ON feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);