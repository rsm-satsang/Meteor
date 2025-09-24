import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DataTable from './DataTable';
import FileUpload from './FileUpload';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  video_url?: string;
  learn_more_url?: string;
  hero_image_url?: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    video_url: '',
    learn_more_url: '',
    hero_image_url: '',
    visible: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        event_date: formData.event_date ? new Date(formData.event_date).toISOString() : null,
        event_time: formData.event_time || null,
        video_url: formData.video_url || null,
        learn_more_url: formData.learn_more_url || null,
        hero_image_url: formData.hero_image_url || null,
        visible: formData.visible
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);
        
        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);
        
        if (error) throw error;
        toast.success('Event created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.message || 'Failed to save event');
    }
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ visible })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Event ${visible ? 'made visible' : 'hidden'}`);
      fetchEvents();
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update event visibility');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '',
      video_url: '',
      learn_more_url: '',
      hero_image_url: '',
      visible: true
    });
    setEditingEvent(null);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '',
      event_time: event.event_time || '',
      video_url: event.video_url || '',
      learn_more_url: event.learn_more_url || '',
      hero_image_url: event.hero_image_url || '',
      visible: event.visible
    });
    setDialogOpen(true);
  };

  const columns = [
    {
      key: 'hero_image_url',
      label: 'Image',
      render: (value: string) => (
        value ? (
          <img src={value} alt="Event hero" className="w-16 h-12 object-cover rounded" />
        ) : (
          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        )
      )
    },
    { key: 'title', label: 'Title' },
    {
      key: 'event_date',
      label: 'Date & Time',
      render: (value: string, event: Event) => {
        if (!value) return 'No date set';
        const date = new Date(value).toLocaleDateString();
        const time = event.event_time ? event.event_time : '';
        return (
          <div>
            <div>{date}</div>
            {time && <div className="text-xs text-muted-foreground">{time}</div>}
          </div>
        );
      }
    },
    {
      key: 'visible',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Visible' : 'Hidden'}
        </Badge>
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
          <h1 className="text-3xl font-bold">Events Manager</h1>
          <p className="text-muted-foreground">Manage reading events, workshops, and contests</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Event Date</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_time">Event Time</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video_url">Join Event URL (YouTube/Zoom)</Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/live/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learn_more_url">Learn More URL</Label>
                  <Input
                    id="learn_more_url"
                    type="url"
                    value={formData.learn_more_url}
                    onChange={(e) => setFormData({ ...formData, learn_more_url: e.target.value })}
                    placeholder="https://website.com/event-details"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hero Image</Label>
                <FileUpload
                  bucket="event_images"
                  accept="image/*"
                  onUpload={(url) => setFormData({ ...formData, hero_image_url: url })}
                  placeholder="Upload event hero image"
                />
                {formData.hero_image_url && (
                  <img src={formData.hero_image_url} alt="Preview" className="w-full h-32 object-cover rounded" />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                />
                <Label htmlFor="visible">Make event visible to users</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingEvent ? 'Update' : 'Create'} Event
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
        data={events}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search events..."
        actions={(event) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleVisibility(event.id, !event.visible)}
              title={event.visible ? 'Hide event' : 'Show event'}
            >
              {event.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => openEditDialog(event)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(event.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default EventsManager;