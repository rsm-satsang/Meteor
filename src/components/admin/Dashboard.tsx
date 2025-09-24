import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  PenTool, 
  Calendar, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalChapters: 0,
    totalActivities: 0,
    totalEvents: 0,
    pendingFeedback: 0,
    pendingQuestions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [
        usersRes, 
        booksRes, 
        chaptersRes,
        activitiesRes, 
        eventsRes, 
        feedbackRes, 
        questionsRes
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('chapters').select('*', { count: 'exact', head: true }),
        supabase.from('activities').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('feedback').select('*', { count: 'exact', head: true }).is('admin_response', null),
        supabase.from('questions').select('*', { count: 'exact', head: true }).is('admin_response', null)
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalBooks: booksRes.count || 0,
        totalChapters: chaptersRes.count || 0,
        totalActivities: activitiesRes.count || 0,
        totalEvents: eventsRes.count || 0,
        pendingFeedback: feedbackRes.count || 0,
        pendingQuestions: questionsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Books', value: stats.totalBooks, icon: BookOpen, color: 'text-green-500' },
    { label: 'Chapters', value: stats.totalChapters, icon: BookOpen, color: 'text-green-600' },
    { label: 'Activities', value: stats.totalActivities, icon: PenTool, color: 'text-purple-500' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-orange-500' },
    { label: 'Pending Feedback', value: stats.pendingFeedback, icon: MessageCircle, color: 'text-red-500' },
    { label: 'Pending Questions', value: stats.pendingQuestions, icon: HelpCircle, color: 'text-yellow-500' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your reading app</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card/90 backdrop-blur-sm border-0">
              <CardContent className="p-4 text-center">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">
                  {loading ? '...' : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Mock */}
      <Card className="bg-card/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold">New user registration</p>
                <p className="text-sm text-muted-foreground">A new young reader joined the platform</p>
              </div>
              <Badge variant="secondary">2 hours ago</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold">Activity submitted</p>
                <p className="text-sm text-muted-foreground">Creative writing submission pending review</p>
              </div>
              <Badge variant="outline">5 hours ago</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold">Feedback received</p>
                <p className="text-sm text-muted-foreground">User shared thoughts about the app</p>
              </div>
              <Badge variant="secondary">1 day ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;