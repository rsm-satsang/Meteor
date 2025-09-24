import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Search, BookOpen, ExternalLink, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Book {
  id: string;
  title: string;
  cover_url?: string;
  price_amount?: number;
  price_currency?: string;
  amazon_link?: string;
  age_group: 'preteens' | 'teens' | 'young_adults';
  description?: string;
  created_at: string;
}

interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  cover_url?: string;
  pdf_url?: string;
  order_index: number;
}

const Books = () => {
  const { user, profile, loading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - BEFORE ANY CONDITIONAL RETURNS
  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('age_group', profile?.age_group)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoadingBooks(false);
    }
  };

  const fetchChapters = async (bookId: string) => {
    try {
      setLoadingChapters(true);
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error('Failed to load chapters');
    } finally {
      setLoadingChapters(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchBooks();
    }
  }, [profile]);

  // CONDITIONAL RETURNS COME AFTER ALL HOOKS
  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading state
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      </div>
    );
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    fetchChapters(book.id);
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setChapters([]);
    setSelectedChapter(null);
  };

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
  };

  const getCurrentChapterIndex = () => {
    return chapters.findIndex(ch => ch.id === selectedChapter?.id);
  };

  const goToPreviousChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    if (currentIndex > 0) {
      setSelectedChapter(chapters[currentIndex - 1]);
    }
  };

  const goToNextChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    if (currentIndex < chapters.length - 1) {
      setSelectedChapter(chapters[currentIndex + 1]);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAgeGroupBadgeVariant = () => {
    switch (profile.age_group) {
      case 'preteens':
        return 'default';
      case 'teens':
        return 'secondary';
      case 'young_adults':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Chapter Reading View
  if (selectedChapter) {
    const currentIndex = getCurrentChapterIndex();
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < chapters.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
        {/* Header */}
        <header className="border-b border-border/10 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBackToChapters} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Chapters
              </Button>
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  Chapter {selectedChapter.chapter_number} of {chapters.length}
                </Badge>
                <Link to="/">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Chapter Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Chapter Info */}
            <Card className="p-6 bg-card/90 backdrop-blur-sm border-0">
              <div className="flex items-start gap-6">
                {selectedChapter.cover_url && (
                  <div className="w-32 h-40 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={selectedChapter.cover_url}
                      alt={selectedChapter.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedChapter.title}</h1>
                    <p className="text-muted-foreground">
                      Chapter {selectedChapter.chapter_number} • {selectedBook?.title}
                    </p>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={goToPreviousChapter}
                      disabled={!canGoPrevious}
                    >
                      ← Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={goToNextChapter}
                      disabled={!canGoNext}
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* PDF Viewer */}
            <Card className="p-6 bg-card/90 backdrop-blur-sm border-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Read Chapter</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {selectedChapter.pdf_url ? (
                  selectedChapter.pdf_url.includes('drive.google.com') ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        This chapter is hosted on Google Drive. Click the button below to open it.
                      </p>
                      <Button asChild>
                        <a 
                          href={selectedChapter.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open in Google Drive
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-[800px] rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={`${selectedChapter.pdf_url}#toolbar=0&navpanes=0&scrollbar=1`}
                        className="w-full h-full border-0"
                        title={`${selectedChapter.title} - PDF`}
                        allow="fullscreen"
                      />
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Chapter not available</h3>
                      <p className="text-muted-foreground">
                        This chapter is not yet available for reading.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chapter Navigation Footer */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={goToPreviousChapter}
                disabled={!canGoPrevious}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Chapter
              </Button>
              <Badge variant="secondary">
                {currentIndex + 1} of {chapters.length}
              </Badge>
              <Button 
                variant="outline" 
                onClick={goToNextChapter}
                disabled={!canGoNext}
                className="gap-2"
              >
                Next Chapter
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (selectedBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
        {/* Header */}
        <header className="border-b border-border/10 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBackToBooks} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Books
              </Button>
              <Link to="/">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Book Details */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Book Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 bg-card/90 backdrop-blur-sm border-0">
                {selectedBook.cover_url && (
                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-muted">
                    <img
                      src={selectedBook.cover_url}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{selectedBook.title}</h1>
                    <Badge variant={getAgeGroupBadgeVariant()}>
                      {profile.age_group.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  {selectedBook.description && (
                    <p className="text-muted-foreground">{selectedBook.description}</p>
                  )}
                  
                  {selectedBook.price_amount && (
                    <div className="flex items-center justify-between p-3 bg-accent-soft rounded-lg">
                      <span className="font-semibold">
                        {selectedBook.price_currency} {selectedBook.price_amount}
                      </span>
                      {selectedBook.amazon_link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedBook.amazon_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Buy on Amazon
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Chapters List */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-card/90 backdrop-blur-sm border-0">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Chapters
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-0 pb-0">
                  {loadingChapters ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading chapters...</p>
                    </div>
                  ) : chapters.length === 0 ? (
                    <div className="text-center py-8 space-y-4">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">No chapters available yet.</p>
                    </div>
                  ) : (
                     <div className="space-y-3">
                       {chapters.map((chapter) => (
                         <Card 
                           key={chapter.id}
                           className="group cursor-pointer transition-all hover:shadow-card hover:-translate-y-1 border-border/20"
                           onClick={() => handleChapterClick(chapter)}
                         >
                           <CardContent className="p-4">
                             <div className="flex items-center gap-4">
                               {chapter.cover_url ? (
                                 <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                   <img
                                     src={chapter.cover_url}
                                     alt={chapter.title}
                                     className="w-full h-full object-cover"
                                   />
                                 </div>
                               ) : (
                                 <div className="w-16 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                   <BookOpen className="h-6 w-6 text-muted-foreground" />
                                 </div>
                               )}
                               
                               <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-1">
                                   <Badge variant="outline" className="text-xs">
                                     Chapter {chapter.chapter_number}
                                   </Badge>
                                   {chapter.pdf_url && (
                                     <Badge variant="secondary" className="text-xs">
                                       {chapter.pdf_url.includes('drive.google.com') ? 'Google Drive' : 'PDF'}
                                     </Badge>
                                   )}
                                 </div>
                                 <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                                   {chapter.title}
                                 </h3>
                               </div>
                               
                               <div className="flex-shrink-0">
                                 <Button variant="ghost" size="sm">
                                   Read →
                                 </Button>
                               </div>
                             </div>
                           </CardContent>
                         </Card>
                       ))}
                     </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
      {/* Header */}
      <header className="border-b border-border/10 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Books</h1>
                <Badge variant={getAgeGroupBadgeVariant()} className="mt-1">
                  {profile.age_group.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 border-border/20"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingBooks ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 space-y-6">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {searchTerm ? 'No books found' : 'No books available'}
              </h2>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try searching with different keywords.' 
                  : 'New books are being added regularly. Check back soon!'
                }
              </p>
            </div>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {searchTerm ? `Search Results (${filteredBooks.length})` : `Available Books (${filteredBooks.length})`}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card 
                  key={book.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 bg-card/90 backdrop-blur-sm overflow-hidden"
                  onClick={() => handleBookClick(book)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="w-full">
                          View Chapters
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      {book.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {book.description}
                        </p>
                            )}
                                                {(profile?.country?.toLowerCase() === 'india'
                              ? book.price_currency === 'INR'
                              : book.price_currency === 'USD') && (book.price_amount !== null && book.price_amount !== undefined) && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-accent">
                                {book.price_currency} {book.price_amount}
                              </span>
                              <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                          )}
                      {/* {(profile?.country?.toLowerCase() === 'india' ? book.price_currency === 'INR' : book.price_currency === 'USD') && book.price_amount && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-accent">
                            {book.price_currency} {book.price_amount}
                          </span>
                          <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                      )} */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Books;