import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import DataTable from './DataTable';

interface Question {
  id: string;
  text: string;
  admin_response?: string;
  responded_by?: string;
  responded_at?: string;
  created_at: string;
  user_id: string;
  profile?: {
    full_name: string;
  };
  responder?: {
    full_name: string;
  };
}

const QuestionsManager = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResponses, setEditingResponses] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profile:profiles!questions_user_id_fkey(full_name),
          responder:profiles!questions_responded_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const saveResponse = async (questionId: string) => {
    const response = editingResponses[questionId];
    if (!response?.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      const { error } = await supabase
        .from('questions')
        .update({
          admin_response: response,
          responded_by: user?.id,
          responded_at: new Date().toISOString()
        })
        .eq('id', questionId);

      if (error) throw error;
      
      toast.success('Response saved successfully');
      setEditingResponses(prev => {
        const newState = { ...prev };
        delete newState[questionId];
        return newState;
      });
      fetchQuestions();
    } catch (error: any) {
      console.error('Error saving response:', error);
      toast.error('Failed to save response');
    }
  };

  const startEditing = (questionId: string, currentResponse: string = '') => {
    setEditingResponses(prev => ({
      ...prev,
      [questionId]: currentResponse
    }));
  };

  const cancelEditing = (questionId: string) => {
    setEditingResponses(prev => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
  };

  const columns = [
    {
      key: 'profile',
      label: 'User',
      render: (profile: any) => profile?.full_name || 'Unknown User'
    },
    {
      key: 'text',
      label: 'Question',
      render: (text: string) => (
        <div className="max-w-md">
          <Card className="bg-muted/20 border-0">
            <CardContent className="p-3">
              <p className="text-sm">{text}</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      key: 'admin_response',
      label: 'Admin Answer',
      render: (response: string, row: Question) => (
        <div className="max-w-md">
          {editingResponses[row.id] !== undefined ? (
            <div className="space-y-2">
              <Textarea
                value={editingResponses[row.id]}
                onChange={(e) => setEditingResponses(prev => ({
                  ...prev,
                  [row.id]: e.target.value
                }))}
                placeholder="Enter your answer..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => saveResponse(row.id)}>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => cancelEditing(row.id)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : response ? (
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-3">
                <p className="text-sm">{response}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>By: {row.responder?.full_name}</span>
                  <span>{new Date(row.responded_at!).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Badge variant="outline">No answer yet</Badge>
          )}
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Asked',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Questions Manager</h1>
        <p className="text-muted-foreground">Answer questions from young readers</p>
      </div>

      <DataTable
        data={questions}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search questions..."
        actions={(item) => (
          <div className="flex gap-2">
            {editingResponses[item.id] === undefined && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEditing(item.id, item.admin_response || '')}
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                {item.admin_response ? 'Edit' : 'Answer'}
              </Button>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default QuestionsManager;