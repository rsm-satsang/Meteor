// import { useState, useEffect } from "react";
// import { Navigate, Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useAuth } from "@/contexts/AuthContext";
// import { ArrowLeft, Upload, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { toast } from "sonner";

// interface Activity {
//   id: string;
//   title: string;
//   description?: string;
//   status: 'submitted' | 'reviewed' | 'approved' | 'rejected';
//   file_name?: string;
//   file_url?: string;
//   created_at: string;
// }

// const Activities = () => {
//   const { user, profile, loading } = useAuth();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [loadingActivities, setLoadingActivities] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
  
//   // Form state
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [file, setFile] = useState<File | null>(null);

//   // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - BEFORE ANY CONDITIONAL RETURNS
//   const fetchActivities = async () => {
//     try {
//       setLoadingActivities(true);
//       const { data, error } = await supabase
//         .from('activities')
//         .select('*')
//         .eq('user_id', user?.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setActivities(data || []);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       toast.error('Failed to load activities');
//     } finally {
//       setLoadingActivities(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchActivities();
//     }
//   }, [user]);

//   // CONDITIONAL RETURNS COME AFTER ALL HOOKS
//   // Redirect if not authenticated
//   if (!loading && !user) {
//     return <Navigate to="/auth" replace />;
//   }

//   // Show loading state
//   if (loading || !profile) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
//           <p className="text-muted-foreground">Loading activities...</p>
//         </div>
//       </div>
//     );
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       toast.error('Please enter a title for your activity');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const { error } = await supabase
//         .from('activities')
//         .insert([{
//           user_id: user?.id,
//           title: title.trim(),
//           description: description.trim() || null,
//           file_name: file?.name || null,
//           status: 'submitted'
//         }]);

//       if (error) throw error;

//       toast.success('Activity submitted successfully!');
//       setTitle('');
//       setDescription('');
//       setFile(null);
//       setShowForm(false);
//       fetchActivities();
//     } catch (error) {
//       console.error('Error submitting activity:', error);
//       toast.error('Failed to submit activity');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getStatusIcon = (status: Activity['status']) => {
//     switch (status) {
//       case 'submitted':
//         return <Clock className="h-4 w-4 text-yellow-500" />;
//       case 'reviewed':
//         return <FileText className="h-4 w-4 text-blue-500" />;
//       case 'approved':
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case 'rejected':
//         return <XCircle className="h-4 w-4 text-red-500" />;
//     }
//   };

//   const getStatusVariant = (status: Activity['status']) => {
//     switch (status) {
//       case 'submitted':
//         return 'secondary';
//       case 'reviewed':
//         return 'outline';
//       case 'approved':
//         return 'default';
//       case 'rejected':
//         return 'destructive';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
//       {/* Header */}
//       <header className="border-b border-border/10 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link to="/dashboard">
//                 <Button variant="ghost" className="gap-2">
//                   <ArrowLeft className="h-4 w-4" />
//                   Dashboard
//                 </Button>
//               </Link>
//               <h1 className="text-2xl font-bold">My Activities</h1>
//             </div>
            
//             <Button onClick={() => setShowForm(!showForm)} className="gap-2">
//               <Upload className="h-4 w-4" />
//               Submit New Activity
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
//         {/* Submit Form */}
//         {showForm && (
//           <Card className="bg-card/90 backdrop-blur-sm border-0">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Upload className="h-5 w-5" />
//                 Submit New Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Title *</label>
//                   <Input
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="What did you create?"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Description</label>
//                   <Textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Tell us about your activity..."
//                     rows={3}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-2">File (Optional)</label>
//                   <Input
//                     type="file"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                     accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
//                   />
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Images, audio, video, or documents (PDF, Word)
//                   </p>
//                 </div>
                
//                 <div className="flex gap-3 pt-4">
//                   <Button type="submit" disabled={submitting}>
//                     {submitting ? 'Submitting...' : 'Submit Activity'}
//                   </Button>
//                   <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* Activities List */}
//         <div>
//           {loadingActivities ? (
//             <div className="text-center py-12">
//               <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
//               <p className="text-muted-foreground">Loading your activities...</p>
//             </div>
//           ) : activities.length === 0 ? (
//             <div className="text-center py-12 space-y-6">
//               <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
//               <div>
//                 <h2 className="text-2xl font-bold mb-2">No activities yet</h2>
//                 <p className="text-muted-foreground">
//                   Start by submitting your first reading activity!
//                 </p>
//               </div>
//               <Button onClick={() => setShowForm(true)} className="gap-2">
//                 <Upload className="h-4 w-4" />
//                 Submit Your First Activity
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold">Your Submitted Activities ({activities.length})</h2>
              
//               <div className="grid gap-4">
//                 {activities.map((activity) => (
//                   <Card 
//                     key={activity.id}
//                     className="bg-card/90 backdrop-blur-sm border-0 hover:shadow-card transition-shadow"
//                   >
//                     <CardContent className="p-6">
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1 space-y-2">
//                           <div className="flex items-center gap-3">
//                             <h3 className="font-semibold text-lg">{activity.title}</h3>
//                             <Badge variant={getStatusVariant(activity.status)} className="gap-1">
//                               {getStatusIcon(activity.status)}
//                               {activity.status}
//                             </Badge>
//                           </div>
                          
//                           {activity.description && (
//                             <p className="text-muted-foreground">{activity.description}</p>
//                           )}
                          
//                           <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                             <span>Submitted {new Date(activity.created_at).toLocaleDateString()}</span>
//                             {activity.file_name && (
//                               <span className="flex items-center gap-1">
//                                 <FileText className="h-3 w-3" />
//                                 {activity.file_name}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Activities;


import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, BookOpen, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Activity {
  id: string;
  title: string;
  description?: string;
  pdf_url?: string;
  cover_url?: string;
  created_at: string;
}

const Activities = () => {
  const { user, loading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const fetchAdminActivities = async () => {
      try {
        setLoadingActivities(true);
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .not('pdf_url', 'is', null) // Fetches only admin-uploaded activities
          .order('created_at', { ascending: false });

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to load activities');
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchAdminActivities();
  }, []);

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

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
            <h1 className="text-2xl font-bold">Activities</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingActivities ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 space-y-6">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-2">No Activities Yet</h2>
              <p className="text-muted-foreground">Check back soon for new learning activities!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Available Activities ({activities.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activities.map((activity) => (
                <Card 
                  key={activity.id}
                  className="group transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 bg-card/90 backdrop-blur-sm overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                      {activity.cover_url ? (
                        <img
                          src={activity.cover_url}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        {activity.pdf_url && (
                          <Button asChild className="w-full">
                            <a href={activity.pdf_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                              <Download className="h-4 w-4" />
                              View Activity
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-2">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{activity.description}</p>
                      )}
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

export default Activities;