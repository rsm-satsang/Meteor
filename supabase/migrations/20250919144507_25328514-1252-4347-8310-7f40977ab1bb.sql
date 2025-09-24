-- Add some sample data for testing

-- Insert sample books
INSERT INTO public.books (title, cover_url, price_amount, price_currency, amazon_link, age_group, description) VALUES
  ('The Magic Forest Adventure', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', 12.99, 'USD', 'https://amazon.com', 'preteens', 'Join Emma and Jack as they discover a magical forest filled with talking animals and hidden treasures!'),
  ('Mystery at Moonlight Academy', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', 15.99, 'USD', 'https://amazon.com', 'teens', 'A thrilling mystery unfolds at the prestigious Moonlight Academy when students start disappearing.'),
  ('The Time Keeper''s Legacy', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', 18.99, 'USD', 'https://amazon.com', 'young_adults', 'In a world where time can be manipulated, Maya must save reality itself from collapsing.'),
  ('Rainbow Friends', 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=400&h=600&fit=crop', 9.99, 'USD', 'https://amazon.com', 'preteens', 'A heartwarming story about friendship, kindness, and celebrating differences.'),
  ('Cyber Quest', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop', 16.99, 'USD', 'https://amazon.com', 'teens', 'Step into a virtual world where gaming becomes reality and every choice matters.'),
  ('Beyond the Stars', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop', 19.99, 'USD', 'https://amazon.com', 'young_adults', 'An epic space adventure that explores the depths of human courage and love.');

-- Insert sample chapters for the first book
INSERT INTO public.chapters (book_id, chapter_number, title, cover_url, order_index) 
SELECT 
  b.id,
  1,
  'The Mysterious Path',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
  1
FROM public.books b WHERE b.title = 'The Magic Forest Adventure'
UNION ALL
SELECT 
  b.id,
  2,
  'Meeting the Forest Guardians',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
  2
FROM public.books b WHERE b.title = 'The Magic Forest Adventure'
UNION ALL
SELECT 
  b.id,
  3,
  'The Hidden Temple',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
  3
FROM public.books b WHERE b.title = 'The Magic Forest Adventure';

-- Insert sample chapters for the teen book
INSERT INTO public.chapters (book_id, chapter_number, title, cover_url, order_index)
SELECT 
  b.id,
  1,
  'First Day Mysteries',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  1
FROM public.books b WHERE b.title = 'Mystery at Moonlight Academy'
UNION ALL
SELECT 
  b.id,
  2,
  'The Disappearing Students',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  2
FROM public.books b WHERE b.title = 'Mystery at Moonlight Academy';

-- Insert sample events
INSERT INTO public.events (title, description, event_date, video_url, hero_image_url, visible) VALUES
  ('Reading Rainbow Workshop', 'Join us for a fun interactive reading session with games and activities!', NOW() + INTERVAL '7 days', 'https://youtube.com/watch?v=example1', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop', true),
  ('Creative Writing Contest', 'Show off your storytelling skills in our monthly writing contest. Prizes for all age groups!', NOW() + INTERVAL '14 days', 'https://youtube.com/watch?v=example2', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&h=400&fit=crop', true),
  ('Virtual Book Club', 'Discuss your favorite books with other young readers from around the world.', NOW() + INTERVAL '21 days', 'https://youtube.com/watch?v=example3', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop', true);