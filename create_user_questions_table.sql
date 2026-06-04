-- Run this script in your Supabase SQL Editor to create the user_questions table

CREATE TABLE public.user_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_questions ENABLE ROW LEVEL SECURITY;

-- Create policy allowing authenticated users to insert their own questions
CREATE POLICY "Users can insert their own questions" 
ON public.user_questions
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = auth_id);

-- Create policy allowing users to read their own questions (optional but good practice)
CREATE POLICY "Users can read their own questions" 
ON public.user_questions
FOR SELECT 
TO authenticated 
USING (auth.uid() = auth_id);
