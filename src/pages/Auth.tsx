// import { useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAuth } from "@/contexts/AuthContext";
// import { Sparkles, BookOpen, Star } from "lucide-react";
// import login_page_image from "@/assets/login_page_image.png";
// import ForgotPassword from "@/components/ForgotPassword";

// const Auth = () => {
//   const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
//   const [loading, setLoading] = useState(false);
//   const { user, signIn, signUp } = useAuth();
  
//   // Form state
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState('');
//   const [guardianName, setGuardianName] = useState('');
//   const [guardianContact, setGuardianContact] = useState('');
//   const [city, setCity] = useState('');
//   const [country, setCountry] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [consentGiven, setConsentGiven] = useState(false);

//   // Redirect if already authenticated
//   if (user) {
//     return <Navigate to="/" replace />;
//   }

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     await signIn(email, password);
//     setLoading(false);
//   };

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!consentGiven) {
//       alert('Please provide consent to continue');
//       return;
//     }
    
//     setLoading(true);
    
//     const metadata = {
//       full_name: fullName,
//       age: parseInt(age),
//       gender,
//       guardian_name: guardianName,
//       guardian_contact: guardianContact,
//       city,
//       country,
//       pincode,
//       consent_given: consentGiven
//     };
    
//     await signUp(email, password, metadata);
//     setLoading(false);
//   };

//   const isUnder18 = parseInt(age) < 18;

//   // Show forgot password component
//   if (mode === 'forgot') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center p-4">
//         <ForgotPassword onBack={() => setMode('signin')} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center p-4">
//       <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
//         {/* Hero Section */}
//         <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
//           <div className="flex items-center justify-center lg:justify-start gap-2">
//             <Sparkles className="h-8 w-8 text-primary" />
//             <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//               Meteor
//             </h1>
//           </div>
          
//           <div className="space-y-4">
//             <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
//               Discover Amazing Books & Activities
//             </h2>
//             <p className="text-lg text-muted-foreground">
//               Age-appropriate reading adventures for kids, teens, and young adults. 
//               Join thousands of young readers exploring new worlds!
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
//             <div className="text-center p-4 bg-card rounded-lg shadow-soft">
//               <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
//               <p className="text-sm font-semibold">100+ Books</p>
//             </div>
//             <div className="text-center p-4 bg-card rounded-lg shadow-soft">
//               <Star className="h-8 w-8 text-accent mx-auto mb-2" />
//               <p className="text-sm font-semibold">Fun Activities</p>
//             </div>
//           </div>
          
//           <div className="rounded-2xl overflow-hidden shadow-card lg:block hidden">
//             <img 
//               src={login_page_image} 
//               alt="Children reading books under stars" 
//               className="w-full h-auto"
//             />
//           </div>
//         </div>

//         {/* Auth Form */}
//         <div className="order-1 lg:order-2">
//           <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
//             <CardHeader className="text-center">
//               <CardTitle className="text-2xl font-bold">
//                 {mode === 'signin' ? 'Welcome Back!' : 'Join Meteor'}
//               </CardTitle>
//               <CardDescription>
//                 {mode === 'signin' 
//                   ? 'Sign in to continue your reading journey' 
//                   : 'Start your amazing reading adventure'
//                 }
//               </CardDescription>
//             </CardHeader>
            
//             <CardContent className="space-y-4">
//               <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                
//                 {mode === 'signup' && (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="fullName">Full Name *</Label>
//                       <Input
//                         id="fullName"
//                         type="text"
//                         value={fullName}
//                         onChange={(e) => setFullName(e.target.value)}
//                         required
//                         className="h-12 rounded-lg"
//                       />
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="age">Age *</Label>
//                         <Input
//                           id="age"
//                           type="number"
//                           value={age}
//                           onChange={(e) => setAge(e.target.value)}
//                           required
//                           min="5"
//                           max="25"
//                           className="h-12 rounded-lg"
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label htmlFor="gender">Gender</Label>
//                         <Select value={gender} onValueChange={setGender}>
//                           <SelectTrigger className="h-12 rounded-lg">
//                             <SelectValue placeholder="Select gender" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="male">Male</SelectItem>
//                             <SelectItem value="female">Female</SelectItem>
//                             <SelectItem value="other">Other</SelectItem>
//                             <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
                    
//                     {isUnder18 && (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-accent-soft rounded-lg">
//                         <div className="space-y-2">
//                           <Label htmlFor="guardianName">Guardian Name</Label>
//                           <Input
//                             id="guardianName"
//                             type="text"
//                             value={guardianName}
//                             onChange={(e) => setGuardianName(e.target.value)}
//                             className="h-12 rounded-lg"
//                           />
//                         </div>
                        
//                         <div className="space-y-2">
//                           <Label htmlFor="guardianContact">Guardian Contact</Label>
//                           <Input
//                             id="guardianContact"
//                             type="tel"
//                             value={guardianContact}
//                             onChange={(e) => setGuardianContact(e.target.value)}
//                             className="h-12 rounded-lg"
//                           />
//                         </div>
//                       </div>
//                     )}
                    
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="city">City</Label>
//                         <Input
//                           id="city"
//                           type="text"
//                           value={city}
//                           onChange={(e) => setCity(e.target.value)}
//                           className="h-12 rounded-lg"
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label htmlFor="country">Country</Label>
//                         <Input
//                           id="country"
//                           type="text"
//                           value={country}
//                           onChange={(e) => setCountry(e.target.value)}
//                           className="h-12 rounded-lg"
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label htmlFor="pincode">Pin Code</Label>
//                         <Input
//                           id="pincode"
//                           type="text"
//                           value={pincode}
//                           onChange={(e) => setPincode(e.target.value)}
//                           className="h-12 rounded-lg"
//                         />
//                       </div>
//                     </div>
//                   </>
//                 )}
                
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="h-12 rounded-lg"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password *</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     minLength={6}
//                     className="h-12 rounded-lg"
//                   />
//                 </div>
                
//                 {mode === 'signup' && (
//                   <div className="flex items-start space-x-2 p-4 bg-primary-soft rounded-lg">
//                     <Checkbox
//                       id="consent"
//                       checked={consentGiven}
//                       onCheckedChange={(checked) => setConsentGiven(checked === true)}
//                       required
//                     />
//                     <Label htmlFor="consent" className="text-sm leading-relaxed">
//                       I agree to the terms and conditions and give consent for my data to be processed 
//                       for providing reading recommendations and activities. *
//                     </Label>
//                   </div>
//                 )}
                
//                 <Button 
//                   type="submit" 
//                   className="w-full" 
//                   size="lg"
//                   disabled={loading}
//                   variant={mode === 'signin' ? 'default' : 'accent'}
//                 >
//                   {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
//                 </Button>
//               </form>
              
//               <div className="text-center space-y-2">
//                 {mode === 'signin' && (
//                   <Button
//                     variant="ghost"
//                     onClick={() => setMode('forgot')}
//                     className="text-sm text-muted-foreground hover:text-primary"
//                   >
//                     Forgot Password?
//                   </Button>
//                 )}
//                 <p className="text-sm text-muted-foreground">
//                   {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
//                 </p>
//                 <Button
//                   variant="ghost"
//                   onClick={() => {
//                     setMode(mode === 'signin' ? 'signup' : 'signin');
//                     // Reset form
//                     setEmail('');
//                     setPassword('');
//                     setFullName('');
//                     setAge('');
//                   }}
//                   className="text-primary hover:text-primary font-semibold"
//                 >
//                   {mode === 'signin' ? 'Create Account' : 'Sign In'}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;





import { useState, useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, BookOpen, Star } from "lucide-react";
// import heroImage from "@/assets/hero-illustration.jpg";
import login_page_image from "@/assets/login_page_image.png";
import ForgotPassword from "@/components/ForgotPassword";
import PasswordUpdateForm from "@/components/PasswordUpdateForm"; 

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  
  // New: Read URL parameters
  const [searchParams] = useSearchParams();

  // New: Use a useEffect to check for the URL parameter on component mount
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setMode('reset');
    }
  }, [searchParams]);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      alert('Please provide consent to continue');
      return;
    }
    
    setLoading(true);
    
    const metadata = {
      full_name: fullName,
      age: parseInt(age),
      gender,
      guardian_name: guardianName,
      guardian_contact: guardianContact,
      city,
      country,
      pincode,
      consent_given: consentGiven
    };
    
    await signUp(email, password, metadata);
    setLoading(false);
  };

  const isUnder18 = parseInt(age) < 18;

  // Show forgot password component
  if (mode === 'forgot') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center p-4">
        <ForgotPassword onBack={() => setMode('signin')} />
      </div>
    );
  }

  // New: Show the password update form if the URL contains the reset parameter
  if (mode === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center p-4">
        <PasswordUpdateForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft via-secondary-soft to-accent-soft flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Meteor
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Discover Amazing Books & Activities
            </h2>
            <p className="text-lg text-muted-foreground">
              Age-appropriate reading adventures for kids, teens, and young adults. 
              Join thousands of young readers exploring new worlds!
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="text-center p-4 bg-card rounded-lg shadow-soft">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold">100+ Books</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg shadow-soft">
              <Star className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold">Fun Activities</p>
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-card lg:block hidden">
            <img 
              src={login_page_image} 
              alt="Children reading books under stars" 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Auth Form */}
        <div className="order-1 lg:order-2">
          <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {mode === 'signin' ? 'Welcome Back!' : 'Join Meteor'}
              </CardTitle>
              <CardDescription>
                {mode === 'signin' 
                  ? 'Sign in to continue your reading journey' 
                  : 'Start your amazing reading adventure'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                
                {mode === 'signup' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-12 rounded-lg"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                          min="5"
                          max="25"
                          className="h-12 rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger className="h-12 rounded-lg">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {isUnder18 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-accent-soft rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="guardianName">Guardian Name</Label>
                          <Input
                            id="guardianName"
                            type="text"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
                            className="h-12 rounded-lg"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="guardianContact">Guardian Contact</Label>
                          <Input
                            id="guardianContact"
                            type="tel"
                            value={guardianContact}
                            onChange={(e) => setGuardianContact(e.target.value)}
                            className="h-12 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-12 rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="h-12 rounded-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pin Code</Label>
                        <Input
                          id="pincode"
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="h-12 rounded-lg"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-lg"
                  />
                </div>
                
                {mode === 'signup' && (
                  <div className="flex items-start space-x-2 p-4 bg-primary-soft rounded-lg">
                    <Checkbox
                      id="consent"
                      checked={consentGiven}
                      onCheckedChange={(checked) => setConsentGiven(checked === true)}
                      required
                    />
                    <Label htmlFor="consent" className="text-sm leading-relaxed">
                      I agree to the terms and conditions and give consent for my data to be processed 
                      for providing reading recommendations and activities. *
                    </Label>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                  variant={mode === 'signin' ? 'default' : 'accent'}
                >
                  {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                </Button>
              </form>
              
              <div className="text-center space-y-2">
                {mode === 'signin' && (
                  <Button
                    variant="ghost"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot Password?
                  </Button>
                )}
                <p className="text-sm text-muted-foreground">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    // Reset form
                    setEmail('');
                    setPassword('');
                    setFullName('');
                    setAge('');
                  }}
                  className="text-primary hover:text-primary font-semibold"
                >
                  {mode === 'signin' ? 'Create Account' : 'Sign In'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
