import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LoginScreen from './components/LoginScreen';
import OnboardingWizard from './components/OnboardingWizard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [session, setSession] = useState<any>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [venueData, setVenueData] = useState<any>(null);
  
  // NEW: Traffic Cop routing state for editing
  const [isEditing, setIsEditing] = useState(false);

  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    handleSessionUpdate(session);
  };

  useEffect(() => {
    fetchSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionUpdate(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSessionUpdate = (session: any) => {
    setSession(session);
    if (session?.user?.user_metadata?.barName) {
      setIsSetupComplete(true);
      // We grab their existing preferences here to pass to the Wizard
      setVenueData({
        userId: session.user.id,
        barName: session.user.user_metadata.barName,
        managerName: session.user.user_metadata.managerName,
        hometownTeam: session.user.user_metadata.hometownTeam,
        crowdType: session.user.user_metadata.crowdType || 'Casual',
        preferredCategories: session.user.user_metadata.preferredCategories || []
      });
    } else {
      setIsSetupComplete(false);
      setVenueData(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- THE TRAFFIC COP LOGIC ---
  if (!session) return <LoginScreen />;

  // If they aren't set up OR they clicked Edit, show the Wizard
  if (!isSetupComplete || isEditing) {
    return (
      <OnboardingWizard 
        initialData={venueData} 
        onComplete={() => { setIsEditing(false); fetchSession(); }} 
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Otherwise, show the Dashboard
  return (
    <AdminDashboard 
      venueData={venueData} 
      onLogout={handleLogout} 
      onEdit={() => setIsEditing(true)} 
    />
  );
}

export default App;