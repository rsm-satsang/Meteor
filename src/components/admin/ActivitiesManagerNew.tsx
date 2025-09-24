import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DataTable from './DataTable';
import FileUpload from './FileUpload';

interface Activity {
  id: string;
  title: string; 
  description?: string;
  pdf_url?: string;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

const ActivitiesManagerNew = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pdf_url: '',
    cover_url: ''
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .not('pdf_url', 'is', null) // Only admin-uploaded activities with PDFs
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const activityData = {
        title: formData.title,
        description: formData.description || null,
        pdf_url: formData.pdf_url || null,
        cover_url: formData.cover_url || null,
        user_id: null, // Admin-uploaded activities don't have a user_id
        status: 'approved' // Admin activities are automatically approved
      };

      if (editingActivity) {
        const { error } = await supabase
          .from('activities')
          .update(activityData)
          .eq('id', editingActivity.id);
        
        if (error) throw error;
        toast.success('Activity updated successfully');
      } else {
        const { error } = await supabase
          .from('activities')
          .insert([activityData]);
        
        if (error) throw error;
        toast.success('Activity created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchActivities();
    } catch (error: any) {
      console.error('Error saving activity:', error);
      toast.error(error.message || 'Failed to save activity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Activity deleted successfully');
      fetchActivities();
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      pdf_url: '',
      cover_url: ''
    });
    setEditingActivity(null);
  };

  const openEditDialog = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description || '',
      pdf_url: activity.pdf_url || '',
      cover_url: activity.cover_url || ''
    });
    setDialogOpen(true);
  };

  const columns = [
    {
      key: 'cover_url',
      label: 'Cover',
      render: (value: string) => (
        value ? (
          <img src={value} alt="Activity cover" className="w-12 h-16 object-cover rounded" />
        ) : (
          <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      )
    },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
      key: 'pdf_url',
      label: 'PDF',
      render: (value: string) => (
        value ? (
          <Badge variant="default">Available</Badge>
        ) : (
          <Badge variant="secondary">No PDF</Badge>
        )
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
          <h1 className="text-3xl font-bold">Activities Manager</h1>
          <p className="text-muted-foreground">Upload and manage learning activities for students</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Activity Cover Image</Label>
                <FileUpload
                  bucket="book_covers"
                  accept="image/*"
                  onUpload={(url) => setFormData({ ...formData, cover_url: url })}
                  placeholder="Upload activity cover"
                />
                {formData.cover_url && (
                  <img src={formData.cover_url} alt="Preview" className="w-24 h-32 object-cover rounded" />
                )}
              </div>

              <div className="space-y-2">
                <Label>Activity PDF *</Label>
                <FileUpload
                  bucket="book_pdfs"
                  path="activities"
                  accept=".pdf"
                  onUpload={(url) => setFormData({ ...formData, pdf_url: url })}
                  placeholder="Upload activity PDF"
                />
                {formData.pdf_url && (
                  <p className="text-sm text-green-600">PDF uploaded successfully</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingActivity ? 'Update' : 'Create'} Activity
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
        data={activities}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search activities..."
        actions={(activity) => (
          <div className="flex gap-2">
            {activity.pdf_url && (
              <Button size="sm" variant="ghost" asChild>
                <a href={activity.pdf_url} target="_blank" rel="noopener noreferrer" title="View PDF">
                  <Eye className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => openEditDialog(activity)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(activity.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default ActivitiesManagerNew;