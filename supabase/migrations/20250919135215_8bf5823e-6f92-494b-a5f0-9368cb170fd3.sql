-- Create age group enum
CREATE TYPE public.age_group AS ENUM ('preteens', 'teens', 'young_adults');

-- Create activity status enum  
CREATE TYPE public.activity_status AS ENUM ('submitted', 'reviewed');

-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  age_group age_group NOT NULL,
  gender TEXT,
  guardian_name TEXT,
  guardian_contact TEXT,
  city TEXT,
  country TEXT,
  pincode TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_timestamp TIMESTAMP WITH TIME ZONE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  cover_url TEXT,
  price_amount NUMERIC(10,2),
  price_currency TEXT DEFAULT 'INR',
  amazon_link TEXT,
  age_group age_group NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  cover_url TEXT,
  pdf_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id, chapter_number)
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  status activity_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  video_url TEXT,
  hero_image_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  admin_response TEXT,
  responded_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  admin_response TEXT,
  responded_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND role = 'admin'
  );
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER  
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles  
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Create RLS policies for books (public read, admin write)
CREATE POLICY "Anyone can view books" ON public.books
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage books" ON public.books
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for chapters (public read, admin write)
CREATE POLICY "Anyone can view chapters" ON public.chapters
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage chapters" ON public.chapters
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for activities
CREATE POLICY "Users can view their own activities" ON public.activities
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own activities" ON public.activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own activities" ON public.activities
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activities" ON public.activities
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all activities" ON public.activities
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Create RLS policies for events (public read, admin write)
CREATE POLICY "Anyone can view visible events" ON public.events
  FOR SELECT USING (visible = true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for feedback
CREATE POLICY "Users can view their own feedback" ON public.feedback
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create feedback" ON public.feedback
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all feedback" ON public.feedback
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update feedback" ON public.feedback
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Create RLS policies for questions  
CREATE POLICY "Users can view their own questions" ON public.questions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create questions" ON public.questions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all questions" ON public.questions
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update questions" ON public.questions
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('book_covers', 'book_covers', true),
  ('book_pdfs', 'book_pdfs', false),
  ('activity_files', 'activity_files', false),
  ('event_images', 'event_images', true);

-- Create storage policies
CREATE POLICY "Public can view book covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'book_covers');

CREATE POLICY "Admins can manage book covers" ON storage.objects
  FOR ALL USING (bucket_id = 'book_covers' AND public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can view PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'book_pdfs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage PDFs" ON storage.objects
  FOR ALL USING (bucket_id = 'book_pdfs' AND public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own activity files" ON storage.objects
  FOR SELECT USING (bucket_id = 'activity_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload activity files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'activity_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all activity files" ON storage.objects
  FOR SELECT USING (bucket_id = 'activity_files' AND public.is_admin(auth.uid()));

CREATE POLICY "Public can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event_images');

CREATE POLICY "Admins can manage event images" ON storage.objects
  FOR ALL USING (bucket_id = 'event_images' AND public.is_admin(auth.uid()));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    full_name,
    age,
    age_group,
    gender,
    guardian_name, 
    guardian_contact,
    city,
    country,
    pincode,
    consent_given,
    consent_timestamp
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 16),
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'age')::integer, 16) <= 12 THEN 'preteens'::age_group
      WHEN COALESCE((NEW.raw_user_meta_data->>'age')::integer, 16) BETWEEN 13 AND 15 THEN 'teens'::age_group
      ELSE 'young_adults'::age_group
    END,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'guardian_name',
    NEW.raw_user_meta_data->>'guardian_contact', 
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'pincode',
    COALESCE((NEW.raw_user_meta_data->>'consent_given')::boolean, false),
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'consent_given')::boolean, false) THEN now()
      ELSE null
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger to handle new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();