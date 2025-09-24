import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, BookOpen, Eye, FileText, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DataTable from './DataTable';
import FileUpload from './FileUpload';

interface Book {
  id: string;
  title: string;
  description?: string;
  age_group: 'preteens' | 'teens' | 'young_adults';
  cover_url?: string;
  amazon_link?: string;
  price_amount?: number;
  price_currency?: string;
  created_at: string;
  updated_at: string;
}

interface Chapter {
  id: string;
  book_id: string;
  title: string;
  chapter_number: number;
  order_index: number;
  cover_url?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

const BooksManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    age_group: 'preteens' as 'preteens' | 'teens' | 'young_adults',
    cover_url: '',
    amazon_link: '',
    price_amount: '',
    price_currency: 'INR'
  });

  // Chapter management state
  const [chaptersDialogOpen, setChaptersDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterFormData, setChapterFormData] = useState({
    title: '',
    chapter_number: '',
    cover_url: '',
    pdf_url: '',
    google_drive_link: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bookData = {
        title: formData.title,
        description: formData.description || null,
        age_group: formData.age_group,
        cover_url: formData.cover_url || null,
        amazon_link: formData.amazon_link || null,
        price_amount: formData.price_amount ? parseFloat(formData.price_amount) : null,
        price_currency: formData.price_currency
      };

      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', editingBook.id);
        
        if (error) throw error;
        toast.success('Book updated successfully');
      } else {
        const { error } = await supabase
          .from('books')
          .insert([bookData]);
        
        if (error) throw error;
        toast.success('Book created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchBooks();
    } catch (error: any) {
      console.error('Error saving book:', error);
      toast.error(error.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Book deleted successfully');
      fetchBooks();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      age_group: 'preteens',
      cover_url: '',
      amazon_link: '',
      price_amount: '',
      price_currency: 'INR'
    });
    setEditingBook(null);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description || '',
      age_group: book.age_group,
      cover_url: book.cover_url || '',
      amazon_link: book.amazon_link || '',
      price_amount: book.price_amount?.toString() || '',
      price_currency: book.price_currency || 'INR'
    });
    setDialogOpen(true);
  };

  // Chapter management functions
  const openChaptersDialog = async (book: Book) => {
    setSelectedBook(book);
    setChaptersDialogOpen(true);
    await fetchChapters(book.id);
  };

  const fetchChapters = async (bookId: string) => {
    try {
      setChaptersLoading(true);
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setChapters(data || []);
    } catch (error: any) {
      console.error('Error fetching chapters:', error);
      toast.error('Failed to load chapters');
    } finally {
      setChaptersLoading(false);
    }
  };

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    
    try {
      const chapterData = {
        book_id: selectedBook.id,
        title: chapterFormData.title,
        chapter_number: parseInt(chapterFormData.chapter_number),
        order_index: editingChapter ? editingChapter.order_index : chapters.length + 1,
        cover_url: chapterFormData.cover_url || null,
        pdf_url: chapterFormData.pdf_url || chapterFormData.google_drive_link || null
      };

      if (editingChapter) {
        const { error } = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', editingChapter.id);
        
        if (error) throw error;
        toast.success('Chapter updated successfully');
      } else {
        const { error } = await supabase
          .from('chapters')
          .insert([chapterData]);
        
        if (error) throw error;
        toast.success('Chapter created successfully');
      }

      setChapterDialogOpen(false);
      resetChapterForm();
      fetchChapters(selectedBook.id);
    } catch (error: any) {
      console.error('Error saving chapter:', error);
      toast.error(error.message || 'Failed to save chapter');
    }
  };

  const handleChapterDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Chapter deleted successfully');
      if (selectedBook) fetchChapters(selectedBook.id);
    } catch (error: any) {
      console.error('Error deleting chapter:', error);
      toast.error('Failed to delete chapter');
    }
  };

  const moveChapter = async (chapterId: string, direction: 'up' | 'down') => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const targetIndex = direction === 'up' ? chapter.order_index - 1 : chapter.order_index + 1;
    const targetChapter = chapters.find(c => c.order_index === targetIndex);
    
    if (!targetChapter) return;

    try {
      // Swap order_index values
      const { error: error1 } = await supabase
        .from('chapters')
        .update({ order_index: targetIndex })
        .eq('id', chapter.id);

      const { error: error2 } = await supabase
        .from('chapters')
        .update({ order_index: chapter.order_index })
        .eq('id', targetChapter.id);

      if (error1 || error2) throw error1 || error2;
      
      toast.success('Chapter order updated');
      if (selectedBook) fetchChapters(selectedBook.id);
    } catch (error: any) {
      console.error('Error reordering chapters:', error);
      toast.error('Failed to reorder chapters');
    }
  };

  const resetChapterForm = () => {
    setChapterFormData({
      title: '',
      chapter_number: '',
      cover_url: '',
      pdf_url: '',
      google_drive_link: ''
    });
    setEditingChapter(null);
  };

  const openEditChapterDialog = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterFormData({
      title: chapter.title,
      chapter_number: chapter.chapter_number.toString(),
      cover_url: chapter.cover_url || '',
      pdf_url: chapter.pdf_url || '',
      google_drive_link: chapter.pdf_url?.includes('drive.google.com') ? chapter.pdf_url : ''
    });
    setChapterDialogOpen(true);
  };

  const columns = [
    {
      key: 'cover_url',
      label: 'Cover',
      render: (value: string) => (
        value ? (
          <img src={value} alt="Book cover" className="w-12 h-16 object-cover rounded" />
        ) : (
          <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      )
    },
    { key: 'title', label: 'Title' },
    {
      key: 'age_group',
      label: 'Age Group',
      render: (value: string) => (
        <Badge variant="secondary">
          {value.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'price_amount',
      label: 'Price',
      render: (value: number, row: Book) => (
        value ? `${row.price_currency} ${value}` : 'Free'
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books Manager</h1>
          <p className="text-muted-foreground">Manage books and chapters</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age_group">Age Group *</Label>
                  <Select value={formData.age_group} onValueChange={(value: any) => setFormData({ ...formData, age_group: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preteens">Preteens</SelectItem>
                      <SelectItem value="teens">Teens</SelectItem>
                      <SelectItem value="young_adults">Young Adults</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <FileUpload
                  bucket="book_covers"
                  accept="image/*"
                  onUpload={(url) => setFormData({ ...formData, cover_url: url })}
                  placeholder="Upload book cover"
                />
                {formData.cover_url && (
                  <img src={formData.cover_url} alt="Preview" className="w-24 h-32 object-cover rounded" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amazon_link">Amazon Link</Label>
                  <Input
                    id="amazon_link"
                    type="url"
                    value={formData.amazon_link}
                    onChange={(e) => setFormData({ ...formData, amazon_link: e.target.value })}
                    placeholder="https://amazon.in/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price_amount">Price</Label>
                  <div className="flex gap-2">
                    <Select value={formData.price_currency} onValueChange={(value) => setFormData({ ...formData, price_currency: value })}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price_amount}
                      onChange={(e) => setFormData({ ...formData, price_amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingBook ? 'Update' : 'Create'} Book
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={books}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search books..."
        actions={(book) => (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => openChaptersDialog(book)} title="Manage Chapters">
              <FileText className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => openEditDialog(book)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(book.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* Chapters Management Dialog */}
      <Dialog open={chaptersDialogOpen} onOpenChange={setChaptersDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Chapters - {selectedBook?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
              </p>
              <Dialog open={chapterDialogOpen} onOpenChange={setChapterDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetChapterForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Chapter
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle>
                      {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-y-auto px-1">
                    <form onSubmit={handleChapterSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="chapter_title">Title *</Label>
                          <Input
                            id="chapter_title"
                            value={chapterFormData.title}
                            onChange={(e) => setChapterFormData({ ...chapterFormData, title: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="chapter_number">Chapter Number *</Label>
                          <Input
                            id="chapter_number"
                            type="number"
                            value={chapterFormData.chapter_number}
                            onChange={(e) => setChapterFormData({ ...chapterFormData, chapter_number: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Chapter Cover Image</Label>
                        <FileUpload
                          bucket="book_covers"
                          accept="image/*"
                          onUpload={(url) => setChapterFormData({ ...chapterFormData, cover_url: url })}
                          placeholder="Upload chapter cover"
                        />
                        {chapterFormData.cover_url && (
                          <img src={chapterFormData.cover_url} alt="Preview" className="w-24 h-32 object-cover rounded" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Chapter PDF</Label>
                        <FileUpload
                          bucket="book_pdfs"
                          path={selectedBook ? `books/${selectedBook.id}/chapters` : ''}
                          accept=".pdf"
                          onUpload={(url) => setChapterFormData({ ...chapterFormData, pdf_url: url, google_drive_link: '' })}
                          placeholder="Upload chapter PDF"
                        />
                        {chapterFormData.pdf_url && !chapterFormData.pdf_url.includes('drive.google.com') && (
                          <p className="text-sm text-green-600">PDF uploaded successfully</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="google_drive_link">Or Google Drive Link</Label>
                        <Input
                          id="google_drive_link"
                          type="url"
                          value={chapterFormData.google_drive_link}
                          onChange={(e) => setChapterFormData({ ...chapterFormData, google_drive_link: e.target.value, pdf_url: '' })}
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </form>
                  </div>

                  <div className="flex-shrink-0 border-t pt-4 mt-4">
                    <div className="flex gap-2">
                      <Button type="submit" onClick={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget.closest('.overflow-y-auto')?.querySelector('form');
                        form?.requestSubmit();
                      }}>
                        {editingChapter ? 'Update' : 'Create'} Chapter
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setChapterDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {chaptersLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No chapters yet. Add your first chapter!
              </div>
            ) : (
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <Card key={chapter.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveChapter(chapter.id, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveChapter(chapter.id, 'down')}
                              disabled={index === chapters.length - 1}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {chapter.cover_url ? (
                            <img src={chapter.cover_url} alt="Chapter cover" className="w-12 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium">Chapter {chapter.chapter_number}: {chapter.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {chapter.pdf_url ? (
                                chapter.pdf_url.includes('drive.google.com') ? 'Google Drive Link' : 'PDF Uploaded'
                              ) : 'No PDF'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {chapter.pdf_url && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={chapter.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => openEditChapterDialog(chapter)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleChapterDelete(chapter.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksManager;