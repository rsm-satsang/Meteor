import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, HelpCircle, Send, Clock, CheckCircle, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  admin_response?: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
}

const Questions = () => {
  const { user, profile, loading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionText, setQuestionText] = useState('');

  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - BEFORE ANY CONDITIONAL RETURNS
  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQuestions();
    }
  }, [user]);

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
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error('Please enter your question');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('questions')
        .insert([{
          user_id: user?.id,
          text: questionText.trim()
        }]);

      if (error) throw error;

      toast.success('Question submitted! We\'ll get back to you soon.');
      setQuestionText('');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit question');
    } finally {
      setSubmitting(false);
    }
  };

  const popularQuestions = [
    {
      q: "How do I find books for my age group?",
      a: "Books are automatically filtered based on your age! You'll only see books appropriate for your age group when you visit the Books page."
    },
    {
      q: "Can I submit my own stories or artwork?",
      a: "Absolutely! Use the Activities page to submit your creative work, stories, drawings, or any reading-related projects."
    },
    {
      q: "How do I join reading events?",
      a: "Check the Events page for upcoming workshops, book clubs, and contests. Click 'Join Event' to participate!"
    },
    {
      q: "Are the books free to read?",
      a: "Some content is free, while other books may require purchase. Check each book's details for pricing and availability."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
      {/* Header */}
      <header className="border-b border-border/10 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Questions & Help</h1>
              <p className="text-muted-foreground text-sm">Ask us anything about reading and books</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Ask Question Form */}
        <Card className="bg-card/90 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              Ask a Question
            </CardTitle>
            <p className="text-muted-foreground">
              Have a question about books, reading, or using Meteor? We're here to help!
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Question *</label>
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="What would you like to know? Ask about books, reading tips, activities, or anything else!"
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Don't hesitate to ask - no question is too small!
                </p>
              </div>
              
              <Button type="submit" disabled={submitting} className="gap-2">
                <Send className="h-4 w-4" />
                {submitting ? 'Sending...' : 'Ask Question'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Questions */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-4">
            {popularQuestions.map((faq, index) => (
              <Card key={index} className="bg-card/90 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground pl-7">
                      {faq.a}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Your Questions */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Your Questions
          </h2>
          
          {loadingQuestions ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <Card className="bg-card/90 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                <p className="text-muted-foreground">
                  Ask your first question above and we'll help you out!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="bg-card/90 backdrop-blur-sm border-0">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      
                      {/* User Question */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Your Question</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(question.created_at).toLocaleDateString()}</span>
                            <Badge variant={question.admin_response ? "default" : "secondary"} className="gap-1">
                              {question.admin_response ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Answered
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground bg-muted/30 p-3 rounded-lg">
                          {question.text}
                        </p>
                      </div>

                      {/* Admin Answer */}
                      {question.admin_response && (
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-primary">Our Answer</h4>
                            {question.responded_at && (
                              <span className="text-sm text-muted-foreground">
                                {new Date(question.responded_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground bg-primary-soft p-3 rounded-lg">
                            {question.admin_response}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Info */}
        <Card className="bg-gradient-secondary text-secondary-foreground border-0">
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
            <p className="opacity-90">
              Our team is always happy to help young readers like you! Ask any question about books, 
              reading, writing, or using Meteor. We typically respond within 24 hours.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Questions;