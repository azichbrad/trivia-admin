import { useState, useEffect } from 'react';
import { Play, AlertCircle, CheckCircle2, Gift, Plus, Trash2, LogOut, Settings, Target, Zap } from 'lucide-react';

interface Props {
  venueData: any;
  onLogout: () => void;
  onEdit: () => void;
}

export default function AdminDashboard({ venueData, onLogout, onEdit }: Props) {
  const [category, setCategory] = useState('NFL');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [prizes, setPrizes] = useState<string[]>(['Free Drink', '20% Off Final Bill', 'Free French Fries']);
  const [selectedPrize, setSelectedPrize] = useState('Free Drink');
  const [newPrizeInput, setNewPrizeInput] = useState('');

  useEffect(() => {
    const savedPrizes = localStorage.getItem('trivia_admin_prizes');
    if (savedPrizes) {
      const parsedPrizes = JSON.parse(savedPrizes);
      setPrizes(parsedPrizes);
      if (parsedPrizes.length > 0) {
        setSelectedPrize(parsedPrizes[0]);
      }
    }
  }, []);

  const handleAddPrize = () => {
    if (!newPrizeInput.trim() || prizes.includes(newPrizeInput)) return;
    const updatedPrizes = [...prizes, newPrizeInput];
    setPrizes(updatedPrizes);
    setSelectedPrize(newPrizeInput);
    setNewPrizeInput('');
    localStorage.setItem('trivia_admin_prizes', JSON.stringify(updatedPrizes));
  };

  const handleDeletePrize = (prizeToDelete: string) => {
    const updatedPrizes = prizes.filter(p => p !== prizeToDelete);
    setPrizes(updatedPrizes);
    if (selectedPrize === prizeToDelete) setSelectedPrize(updatedPrizes[0] || '');
    localStorage.setItem('trivia_admin_prizes', JSON.stringify(updatedPrizes));
  };

  const handleStartGame = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://trivia-api-z36k.onrender.com/api/games/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barId: venueData.userId, category: category, prize: selectedPrize })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to start game');

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
        
        {/* TOP NAV: Minimalist & Crisp */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{venueData.barName}</h1>
              <p className="text-zinc-500 text-sm font-medium tracking-wide">Managed by {venueData.managerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-md border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">System Ready</span>
            </div>
            <div className="h-6 w-px bg-zinc-800 mx-1"></div>
            <button onClick={onEdit} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md transition-all" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={onLogout} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 rounded-md transition-all" title="Log Out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* MAIN DASHBOARD GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (Settings) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* CATEGORY CARD */}
            <div className="bg-[#0f0f11] border border-zinc-800/80 rounded-xl p-6 shadow-xl shadow-black/50">
              <div className="flex justify-between items-center mb-5">
                 <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-400" /> Topic Selection
                 </h2>
                 <div className="flex gap-2">
                   <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                     Crowd: {venueData.crowdType}
                   </span>
                 </div>
              </div>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-lg font-medium py-3 px-4 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer hover:border-zinc-700"
              >
                <option value="NFL">NFL Football</option>
                <option value="Pop Culture">Pop Culture</option>
                <option value="History">History</option>
                <option value="Science">Science & Tech</option>
              </select>
            </div>

            {/* REWARD CARD */}
            <div className="bg-[#0f0f11] border border-zinc-800/80 rounded-xl p-6 shadow-xl shadow-black/50 flex-grow">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest flex items-center gap-2 mb-5">
                <Gift className="w-4 h-4 text-amber-400" /> Reward Configuration
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {prizes.map((prize, idx) => (
                  <div key={idx} className="relative group">
                    <button 
                      onClick={() => setSelectedPrize(prize)} 
                      className={`w-full text-left py-3 px-4 rounded-lg text-sm font-medium border transition-all 
                        ${selectedPrize === prize 
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-inner' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'}`}
                    >
                      {prize}
                    </button>
                    <button 
                      onClick={() => handleDeletePrize(prize)} 
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-auto">
                <input 
                  type="text" 
                  value={newPrizeInput} 
                  onChange={(e) => setNewPrizeInput(e.target.value)} 
                  placeholder="Create custom reward..." 
                  className="flex-grow bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600" 
                />
                <button 
                  onClick={handleAddPrize} 
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-zinc-700"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Action / Launch) */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-[#15151a] to-[#0a0a0a] border border-zinc-800/80 rounded-xl p-6 shadow-xl shadow-black/50 h-full flex flex-col justify-between min-h-[300px]">
              
              <div>
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-2">Deploy Round</h2>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                  Make sure your TV is displaying the lobby. Launching will immediately lock answers and push the first question to all connected devices.
                </p>

                {status === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                )}
              </div>

              <button
                disabled={status === 'loading' || status === 'success'}
                onClick={handleStartGame}
                className={`w-full group relative overflow-hidden rounded-xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                  ${status === 'loading' || status === 'success' ? 'opacity-80 cursor-not-allowed' : ''}
                `}
              >
                {/* Animated Gradient Border Layer */}
                <span className={`absolute inset-0 bg-gradient-to-r ${status === 'success' ? 'from-emerald-400 to-emerald-600' : 'from-indigo-500 via-purple-500 to-indigo-500'} opacity-70 group-hover:opacity-100 transition-opacity`}></span>
                
                {/* Button Content Layer */}
                <div className="relative bg-zinc-950 px-6 py-6 rounded-xl flex items-center justify-center gap-3 w-full h-full transition-all">
                  {status === 'loading' && (
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm animate-pulse">Initializing...</span>
                  )}
                  {status === 'success' && (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" /> 
                      <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Round Active</span>
                    </>
                  )}
                  {status === 'idle' || status === 'error' ? (
                    <>
                      <Play className="w-5 h-5 text-indigo-400 fill-indigo-400 group-hover:text-indigo-300 group-hover:fill-indigo-300 transition-colors" /> 
                      <span className="text-zinc-100 font-bold tracking-widest uppercase text-sm group-hover:text-white transition-colors">Start Trivia Round</span>
                    </>
                  ) : null}
                </div>
              </button>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}