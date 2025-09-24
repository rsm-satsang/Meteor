import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, PenTool, Calendar, MessageCircle, HelpCircle, Settings, LogOut, Sparkles, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardStats {
  totalBooks: number;
  myActivities: number;
  upcomingEvents: number;
}

const Dashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ totalBooks: 0, myActivities: 0, upcomingEvents: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Only fetch if we have user and profile
        if (!user || !profile) return;

        // Fetch books count for user's age group
        const { count: booksCount } = await supabase
          .from('books')
          .select('*', { count: 'exact', head: true })
          .eq('age_group', profile.age_group);

        // Fetch user's activities count
        const { count: activitiesCount } = await supabase
          .from('activities')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user?.id);

        // Fetch upcoming events count
        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('visible', true)
          .gte('event_date', new Date().toISOString());

        setStats({
          totalBooks: booksCount || 0,
          myActivities: activitiesCount || 0,
          upcomingEvents: eventsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, profile]);

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
          <p className="text-muted-foreground">Loading your reading world...</p>
        </div>
      </div>
    );
  }

  const getAgeGroupInfo = () => {
    switch (profile.age_group) {
      case 'preteens':
        return {
          title: 'Young Explorer',
          gradient: 'gradient-primary',
          icon: '🌟',
          description: 'Perfect age for magical adventures!'
        };
      case 'teens':
        return {
          title: 'Adventure Seeker',
          gradient: 'gradient-teen',
          icon: '🚀',
          description: 'Ready for thrilling stories!'
        };
      case 'young_adults':
        return {
          title: 'Story Master',
          gradient: 'gradient-secondary',
          icon: '📚',
          description: 'Exploring deeper narratives!'
        };
      default:
        return {
          title: 'Reader',
          gradient: 'gradient-primary',
          icon: '📖',
          description: 'Happy reading!'
        };
    }
  };

  const ageInfo = getAgeGroupInfo();

  const navigationCards = [
    {
      title: 'Books',
      description: 'Discover amazing stories just for you',
      icon: BookOpen,
      path: '/books',
      variant: 'default' as const,
      count: stats.totalBooks
    },
    {
      title: 'Activities',
      description: 'Share your creative work',
      icon: PenTool,
      path: '/activities',
      // variant: 'secondary' as const,
      count: stats.myActivities
    },
    {
      title: 'Events',
      description: 'Join reading events and workshops',
      icon: Calendar,
      path: '/events',
      // variant: 'accent' as const,
      count: stats.upcomingEvents
    },
    {
      title: 'Feedback',
      description: 'Share your thoughts with us',
      icon: MessageCircle,
      path: '/feedback',
      // variant: 'teen' as const,
      count: null
    },
    {
      title: 'Questions',
      description: 'Ask anything about books',
      icon: HelpCircle,
      path: '/questions',
      // variant: 'outline' as const,
      count: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
      {/* Header */}
      <header className="border-b border-border/10 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Meteor
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">{ageInfo.icon}</span>
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Welcome back, {profile.full_name}!
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="secondary" className="text-sm">
                  {ageInfo.title}
                </Badge>
                <Badge variant="outline" className="text-sm capitalize">
                  Age {profile.age} • {profile.age_group.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {ageInfo.description} Ready to explore new adventures today?
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => (
            <Card 
              key={card.title} 
              className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 bg-card/90 backdrop-blur-sm overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-${card.variant === 'outline' ? 'primary' : card.variant} ${card.variant === 'outline' ? '' : '/10'}`}>
                    <card.icon className={`h-6 w-6 ${
                      card.variant === 'default' ? 'text-primary' :
                      card.variant === 'secondary' ? 'text-secondary' :
                      card.variant === 'accent' ? 'text-accent' :
                      card.variant === 'teen' ? 'text-teen' :
                      'text-primary'
                    }`} />
                  </div>
                  {card.count !== null && (
                    <Badge variant="secondary" className="text-xs">
                      {loadingStats ? '...' : card.count}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">
                  {card.description}
                </p>
                <Button 
                  variant={card.variant} 
                  className="w-full group-hover:scale-105 transition-transform"
                  asChild
                >
                  <a href={card.path}>
                    Explore {card.title}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 bg-card/90 backdrop-blur-sm border-0">
            <div className="text-3xl font-bold text-primary mb-2">
              {loadingStats ? '...' : stats.totalBooks}
            </div>
            <p className="text-muted-foreground">Books Available</p>
          </Card>
          
          <Card className="text-center p-6 bg-card/90 backdrop-blur-sm border-0">
            <div className="text-3xl font-bold text-secondary mb-2">
              {loadingStats ? '...' : stats.myActivities}
            </div>
            <p className="text-muted-foreground">Your Activities</p>
          </Card>
          
          <Card className="text-center p-6 bg-card/90 backdrop-blur-sm border-0">
            <div className="text-3xl font-bold text-accent mb-2">
              {loadingStats ? '...' : stats.upcomingEvents}
            </div>
            <p className="text-muted-foreground">Upcoming Events</p>
          </Card>
        </div>

        {/* Admin Panel Link */}
        {profile.role === 'admin' && (
          <Card className="p-6 bg-gradient-teen text-teen-foreground border-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
                <p className="opacity-90">Manage books, activities, events, and users</p>
              </div>
              <Button variant="outline" className="bg-card hover:bg-card/80 text-teen border-teen-foreground/30">
                <a href="/admin">Go to Admin Panel</a>
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;