-- Make book_pdfs bucket public so PDFs can be accessed directly
UPDATE storage.buckets 
SET public = true 
WHERE name = 'book_pdfs';