-- Add learn_more_url field to events table and time field support
ALTER TABLE public.events 
ADD COLUMN learn_more_url text,
ADD COLUMN event_time time;

-- Update activities table to support admin-uploaded PDFs
ALTER TABLE public.activities 
ADD COLUMN pdf_url text,
ADD COLUMN cover_url text;

-- Add time field support by combining date and time into timestamp