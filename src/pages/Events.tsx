import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

const Events = () => {
  const { user, profile, loading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - BEFORE ANY CONDITIONAL RETURNS
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('visible', true)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  const isUpcoming = (eventDate: string) => {
    return new Date(eventDate) > new Date();
  };

  const isPast = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  const formatEventDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const dateFormat = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let timeFormat = '';
    if (timeString) {
      // Convert 24-hour time to 12-hour format
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      timeFormat = `${displayHour}:${minutes} ${ampm}`;
    }
    
    return {
      date: dateFormat,
      time: timeFormat
    };
  };

  const upcomingEvents = events.filter(event => event.event_date && isUpcoming(event.event_date));
  const pastEvents = events.filter(event => event.event_date && isPast(event.event_date));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
      {/* Header */}
      <header className="border-b border-border/10 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Reading Events</h1>
                <p className="text-muted-foreground text-sm">Workshops, contests, and book clubs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {loadingEvents ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Upcoming Events */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                {upcomingEvents.length > 0 && (
                  <Badge variant="secondary">{upcomingEvents.length}</Badge>
                )}
              </div>
              
              {upcomingEvents.length === 0 ? (
                <Card className="bg-card/90 backdrop-blur-sm border-0">
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground">Check back soon for exciting reading events!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {upcomingEvents.map((event) => (
                    <Card 
                      key={event.id}
                      className="group bg-card/90 backdrop-blur-sm border-0 hover:shadow-card transition-all duration-300 overflow-hidden"
                    >
                      <div className="grid lg:grid-cols-3 gap-0">
                        {event.hero_image_url && (
                          <div className="lg:col-span-1 aspect-video lg:aspect-square bg-muted">
                            <img
                              src={event.hero_image_url}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className={`${event.hero_image_url ? 'lg:col-span-2' : 'lg:col-span-3'} p-6`}>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default" className="gap-1">
                                  <Clock className="h-3 w-3" />
                                  Upcoming
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {event.title}
                              </h3>
                              {event.event_date && (
                                <div className="text-muted-foreground text-sm space-y-1">
                                  <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatEventDate(event.event_date, event.event_time).date}
                                  </p>
                                  {event.event_time && (
                                    <p className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      {formatEventDate(event.event_date, event.event_time).time}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {event.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex gap-3">
                            {event.video_url && (
                              <Button className="gap-2" asChild>
                                <a href={event.video_url} target="_blank" rel="noopener noreferrer">
                                  <Users className="h-4 w-4" />
                                  Join Event
                                </a>
                              </Button>
                            )}
                            {event.learn_more_url && (
                              <Button variant="outline" asChild>
                                <a href={event.learn_more_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                                  <ExternalLink className="h-4 w-4" />
                                  Learn More
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                  <h2 className="text-2xl font-bold">Past Events</h2>
                  <Badge variant="outline">{pastEvents.length}</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <Card 
                      key={event.id}
                      className="group bg-card/90 backdrop-blur-sm border-0 hover:shadow-card transition-all duration-300 overflow-hidden"
                    >
                      <CardContent className="p-0">
                        {event.hero_image_url && (
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            <img
                              src={event.hero_image_url}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                Past Event
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          
                          {event.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          
                          {event.event_date && (
                            <p className="text-xs text-muted-foreground">
                              {formatEventDate(event.event_date, event.event_time).date}
                              {event.event_time && (
                                <span className="block">{formatEventDate(event.event_date, event.event_time).time}</span>
                              )}
                            </p>
                          )}
                          
                          {event.video_url && (
                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <a href={event.video_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Watch Recording
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
            
            {events.length === 0 && (
              <div className="text-center py-12 space-y-6">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">No events available</h2>
                  <p className="text-muted-foreground">
                    We're planning exciting reading events and workshops. Check back soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;