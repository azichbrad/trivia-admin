import { useState } from 'react';
import { ChevronRight, Sparkles, Users, Music, Film, Globe, BrainCircuit, MapPin, User, Trophy } from 'lucide-react';
import { supabase } from '../supabaseClient';

const TRIVIA_CATEGORIES = [
  { id: 'Sports', icon: <Trophy className="w-5 h-5" /> },
  { id: 'Pop Culture', icon: <Film className="w-5 h-5" /> },
  { id: 'Music / Audio', icon: <Music className="w-5 h-5" /> },
  { id: 'History', icon: <Globe className="w-5 h-5" /> },
  { id: 'Science & Tech', icon: <BrainCircuit className="w-5 h-5" /> },
  { id: '80s/90s Nostalgia', icon: <Sparkles className="w-5 h-5" /> },
];

const CROWD_TYPES = ['College / Young Adult', 'Family Friendly', 'Hardcore Trivia Nerds', 'Casual After-Work'];

interface Props {
  onComplete: () => void;
  onCancel: () => void;
  initialData?: any; // NEW: Accepts existing data!
}

export default function OnboardingWizard({ onComplete, onCancel, initialData }: Props) {
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [errorMessage, setErrorMessage] = useState('');
  
  // PRE-FILL DATA if they are editing!
  const [managerName, setManagerName] = useState(initialData?.managerName || '');
  const [barName, setBarName] = useState(initialData?.barName || '');
  const [hometownTeam, setHometownTeam] = useState(initialData?.hometownTeam || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.preferredCategories || []);
  const [crowdType, setCrowdType] = useState<string>(initialData?.crowdType || '');

  const isEditing = !!initialData; // Are we creating or editing?

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barName || !managerName || !hometownTeam) {
      return setErrorMessage('Please fill out all venue details.');
    }
    setErrorMessage('');
    setOnboardingStep(2);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const finalizeSetup = async () => {
    if (selectedCategories.length === 0 || !crowdType) {
      return setErrorMessage('Please select a crowd type and at least one category!');
    }

    const updates = { barName, managerName, hometownTeam, preferredCategories: selectedCategories, crowdType };
    const { error } = await supabase.auth.updateUser({ data: updates });
    
    if (error) {
      setErrorMessage(error.message);
    } else {
      onComplete(); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700 animate-fade-in relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-700">
          <div className={`h-full bg-blue-500 transition-all duration-500 ${onboardingStep === 1 ? 'w-1/2' : 'w-full'}`}></div>
        </div>

        <h2 className="text-3xl font-black text-white mb-2 mt-4">
          {/* Dynamic Header */}
          {isEditing ? "Edit Venue Settings" : (onboardingStep === 1 ? "Welcome to Command." : "Curate Your Vibe.")}
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          {onboardingStep === 1 ? "Update the basics of your venue." : "Adjust your crowd preferences to tailor the trivia packs."}
        </p>

        {errorMessage && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">{errorMessage}</div>}

        {onboardingStep === 1 && (
          <form onSubmit={handleNextStep} className="flex flex-col gap-6 animate-fade-in">
            <div>
              <label className="text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide block flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400"/> Venue Name</label>
              <input type="text" value={barName} onChange={(e) => setBarName(e.target.value)} className="w-full bg-slate-900 text-white text-xl font-bold rounded-xl p-4 border border-slate-600 focus:border-blue-500 focus:outline-none" placeholder="Newport Sports Tavern" required/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide block flex items-center gap-2"><User className="w-4 h-4 text-green-400"/> Manager Name</label>
                <input type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} className="w-full bg-slate-900 text-white text-lg rounded-xl p-4 border border-slate-600 focus:border-blue-500 focus:outline-none" placeholder="Brad" required/>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-bold mb-2 uppercase tracking-wide block flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400"/> Hometown Team</label>
                <input type="text" value={hometownTeam} onChange={(e) => setHometownTeam(e.target.value)} className="w-full bg-slate-900 text-white text-lg rounded-xl p-4 border border-slate-600 focus:border-blue-500 focus:outline-none" placeholder="Steelers" required/>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              {/* Show Cancel button only if they are editing existing data */}
              {isEditing ? (
                <button type="button" onClick={onCancel} className="text-slate-400 hover:text-white font-bold px-4 py-2 transition-colors">Cancel</button>
              ) : <div></div>}
              
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition active:scale-95 shadow-lg">
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {onboardingStep === 2 && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm font-bold mb-4 uppercase tracking-wide">
                <Users className="w-4 h-4 text-green-400" /> What is your primary crowd?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CROWD_TYPES.map(type => (
                  <button key={type} onClick={() => setCrowdType(type)} className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${crowdType === type ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-slate-300 text-sm font-bold mb-4 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-yellow-400" /> Select 3+ preferred topics
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TRIVIA_CATEGORIES.map(cat => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button key={cat.id} onClick={() => toggleCategory(cat.id)} className={`py-4 px-4 rounded-xl flex items-center gap-3 transition-all border-2 ${isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20 scale-[1.02]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                      <div className={`${isSelected ? 'text-white' : 'text-slate-500'}`}>{cat.icon}</div>
                      <span className="font-bold">{cat.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 border-t border-slate-700 pt-6">
              <button onClick={() => setOnboardingStep(1)} className="text-slate-400 hover:text-white font-bold px-4 py-2">Back</button>
              <button onClick={finalizeSetup} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 px-10 rounded-xl transition active:scale-95 shadow-xl shadow-blue-900/30">
                {isEditing ? 'SAVE SETTINGS' : 'LAUNCH COMMAND'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}