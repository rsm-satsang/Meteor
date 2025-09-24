import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ExternalLink, Check, X, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DataTable from './DataTable';

interface Activity {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
  user_id: string;
  book_id?: string;
  chapter_id?: string;
  profile?: {
    full_name: string;
  };
  book?: {
    title: string;
  };
  chapter?: {
    title: string;
    chapter_number: number;
  };
}

const ActivitiesManager = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          profile:profiles!activities_user_id_fkey(full_name),
          book:books(title),
          chapter:chapters(title, chapter_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const updateActivityStatus = async (id: string, status: Activity['status']) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Activity ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully`);
      fetchActivities();
    } catch (error: any) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity status');
    }
  };

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const getStatusBadge = (status: Activity['status']) => {
    const variants = {
      submitted: 'secondary',
      reviewed: 'outline',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    const colors = {
      submitted: 'bg-blue-500',
      reviewed: 'bg-yellow-500',
      approved: 'bg-green-500', 
      rejected: 'bg-red-500'
    };

    return (
      <Badge variant={variants[status]} className={`${colors[status]} text-white`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'profile',
      label: 'User',
      render: (profile: any) => profile?.full_name || 'Unknown User'
    },
    { key: 'title', label: 'Title' },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || '-'}
        </div>
      )
    },
    {
      key: 'book',
      label: 'Book/Chapter',
      render: (book: any, row: Activity) => {
        if (book?.title && row.chapter) {
          return `${book.title} - Ch.${row.chapter.chapter_number}`;
        }
        if (book?.title) {
          return book.title;
        }
        return 'General Activity';
      }
    },
    {
      key: 'file_url',
      label: 'File',
      render: (fileUrl: string, row: Activity) => (
        fileUrl ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadFile(fileUrl, row.file_name || 'activity-file')}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">No file</span>
        )
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: Activity['status']) => getStatusBadge(status)
    },
    {
      key: 'created_at',
      label: 'Submitted',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activities Manager</h1>
        <p className="text-muted-foreground">Review user-submitted activities and creative work</p>
      </div>

      <DataTable
        data={activities}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search activities..."
        actions={(activity) => (
          <div className="flex gap-1">
            {activity.status === 'submitted' && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateActivityStatus(activity.id, 'approved')}
                  title="Approve"
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateActivityStatus(activity.id, 'rejected')}
                  title="Reject"
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateActivityStatus(activity.id, 'reviewed')}
                  title="Mark as Reviewed"
                >
                  <Clock className="h-4 w-4 text-yellow-600" />
                </Button>
              </>
            )}
            {activity.status !== 'submitted' && (
              <Select
                value={activity.status}
                onValueChange={(status: Activity['status']) => updateActivityStatus(activity.id, status)}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ActivitiesManager;