import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, User, Bell, Palette, Shield, Download, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    age: 0,
    gender: '',
    guardian_name: '',
    guardian_contact: '',
    city: '',
    country: '',
    pincode: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    activities: true,
    events: true,
    reminders: false
  });
  const [preferences, setPreferences] = useState({
    theme: 'system',
    fontSize: 'medium',
    readingGoal: 30
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age || 0,
        gender: profile.gender || '',
        guardian_name: profile.guardian_name || '',
        guardian_contact: profile.guardian_contact || '',
        city: profile.city || '',
        country: profile.country || '',
        pincode: profile.pincode || ''
      });
    }
  }, [profile]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleDataExport = () => {
    toast.info("Data export feature coming soon!");
  };

  const handleAccountDeletion = () => {
    toast.error("Account deletion requires contacting support.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                  />
                </div>
              </div>
              
              {profile?.age_group !== 'young_adults' && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guardian_name">Guardian Name</Label>
                      <Input
                        id="guardian_name"
                        value={formData.guardian_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, guardian_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardian_contact">Guardian Contact</Label>
                      <Input
                        id="guardian_contact"
                        value={formData.guardian_contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, guardian_contact: e.target.value }))}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reading Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Reading Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={preferences.theme} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, theme: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Select value={preferences.fontSize} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, fontSize: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="readingGoal">Reading Goal (minutes per day)</Label>
              <Input
                id="readingGoal"
                type="number"
                value={preferences.readingGoal}
                onChange={(e) => setPreferences(prev => ({ ...prev, readingGoal: parseInt(e.target.value) }))}
              />
            </div>
            <Button className="w-full" onClick={() => toast.success("Preferences saved!")}>
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activity-notifications">Activity Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about activity responses</p>
              </div>
              <Switch
                id="activity-notifications"
                checked={notifications.activities}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, activities: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="event-notifications">Event Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders for upcoming events</p>
              </div>
              <Switch
                id="event-notifications"
                checked={notifications.events}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, events: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reading-reminders">Reading Reminders</Label>
                <p className="text-sm text-muted-foreground">Daily reading goal reminders</p>
              </div>
              <Switch
                id="reading-reminders"
                checked={notifications.reminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reminders: checked }))}
              />
            </div>
            <Button className="w-full" onClick={() => toast.success("Notification preferences saved!")}>
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Account & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Account Email</Label>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full" onClick={handleDataExport}>
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              
              <Button variant="destructive" className="w-full" onClick={handleAccountDeletion}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;