import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  BarChart3, 
  BookOpen, 
  PenTool, 
  Calendar, 
  MessageCircle,
  HelpCircle,
  Users,
  FolderOpen,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: BarChart3 },
    { label: 'Books', href: '/admin?tab=books', icon: BookOpen },
    { label: 'Activities', href: '/admin?tab=activities', icon: PenTool },
    { label: 'Events', href: '/admin?tab=events', icon: Calendar },
    { label: 'Feedback', href: '/admin?tab=feedback', icon: MessageCircle },
    { label: 'Questions', href: '/admin?tab=questions', icon: HelpCircle },
    { label: 'Users', href: '/admin?tab=users', icon: Users },
    { label: 'Files', href: '/admin?tab=files', icon: FolderOpen },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return currentPath === '/admin' || currentPath === '/admin?tab=dashboard';
    }
    return currentPath === href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card/80 backdrop-blur-sm border-r border-border/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border/10">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Reading App Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/10">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <Link to="/dashboard">
              <LogOut className="h-4 w-4" />
              Back to App
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;