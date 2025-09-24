import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, MessageCircle, Send, Clock, CheckCircle, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Feedback {
  id: string;
  text: string;
  admin_response?: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
}

const Feedback = () => {
  const { user, profile, loading } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - BEFORE ANY CONDITIONAL RETURNS
  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedback(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeedbacks();
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
          <p className="text-muted-foreground">Loading feedback...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          user_id: user?.id,
          text: feedbackText.trim()
        }]);

      if (error) throw error;

      toast.success('Thank you for your feedback!');
      setFeedbackText('');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

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
              <h1 className="text-2xl font-bold">Feedback</h1>
              <p className="text-muted-foreground text-sm">Share your thoughts with us</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Submit Feedback Form */}
        <Card className="bg-card/90 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Share Your Feedback
            </CardTitle>
            <p className="text-muted-foreground">
              We'd love to hear about your experience with Meteor! Your feedback helps us make the app better for all young readers.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Feedback *</label>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What do you think about the books, activities, or events? What would you like to see improved?"
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tell us what you love, what could be better, or any ideas you have!
                </p>
              </div>
              
              <Button type="submit" disabled={submitting} className="gap-2">
                <Send className="h-4 w-4" />
                {submitting ? 'Sending...' : 'Send Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Feedback History */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Your Feedback History
          </h2>
          
          {loadingFeedback ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your feedback...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <Card className="bg-card/90 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
                <p className="text-muted-foreground">
                  Share your first feedback above and help us improve Meteor!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id} className="bg-card/90 backdrop-blur-sm border-0">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      
                      {/* User Feedback */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Your Feedback</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                            <Badge variant={feedback.admin_response ? "default" : "secondary"} className="gap-1">
                              {feedback.admin_response ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Responded
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
                          {feedback.text}
                        </p>
                      </div>

                      {/* Admin Response */}
                      {feedback.admin_response && (
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-primary">Team Response</h4>
                            {feedback.responded_at && (
                              <span className="text-sm text-muted-foreground">
                                {new Date(feedback.responded_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground bg-primary-soft p-3 rounded-lg">
                            {feedback.admin_response}
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

        {/* Encouragement */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
            <p className="opacity-90">
              Your feedback makes Meteor better for all young readers. Every suggestion, compliment, 
              and idea helps us create the best reading experience possible.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Feedback;