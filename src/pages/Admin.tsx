import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/components/admin/Dashboard";
import BooksManager from "@/components/admin/BooksManager";
// import ActivitiesManager from "@/components/admin/ActivitiesManager";
import ActivitiesManagerNew from "@/components/admin/ActivitiesManagerNew";
import EventsManager from "@/components/admin/EventsManager";
import FeedbackManager from "@/components/admin/FeedbackManager";
import QuestionsManager from "@/components/admin/QuestionsManager";
import UsersManager from "@/components/admin/UsersManager";
import FileManager from "@/components/admin/FileManager";
import { useEffect } from "react";

const Admin = () => {
  const { user, profile, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  
//  useEffect(() => {
//     if (user) {
//       console.log("CURRENT LOGGED IN USER ID:", user.id);
//       alert("Current User ID: " + user.id); // Also show it as an alert
//     }
//   }, [user]);

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (!loading && profile && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (tab) {
      case 'books':
        return <BooksManager />;
      case 'activities':
        return <ActivitiesManagerNew />;
      case 'events':
        return <EventsManager />;
      case 'feedback':
        return <FeedbackManager />;
      case 'questions':
        return <QuestionsManager />;
      case 'users':
        return <UsersManager />;
      case 'files':
        return <FileManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;