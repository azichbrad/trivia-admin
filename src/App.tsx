import { useState, useEffect } from 'react';
import { Play, AlertCircle, CheckCircle2, MonitorSpeaker, Gift, Plus, Trash2 } from 'lucide-react';

const NEWPORT_BAR_ID = '11111111-1111-1111-1111-111111111111';

function App() {
  const [category, setCategory] = useState('NFL');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // NEW: Reward System State
  const [prizes, setPrizes] = useState<string[]>(['Free Drink', '20% Off Final Bill', 'Free French Fries', 'Bragging Rights']);
  const [selectedPrize, setSelectedPrize] = useState('Free Drink');
  const [newPrizeInput, setNewPrizeInput] = useState('');

  // Load custom prizes from local storage when the app opens
  useEffect(() => {
    const savedPrizes = localStorage.getItem('trivia_prizes');
    if (savedPrizes) {
      setPrizes(JSON.parse(savedPrizes));
      setSelectedPrize(JSON.parse(savedPrizes)[0]);
    }
  }, []);

  const handleAddPrize = () => {
    if (!newPrizeInput.trim() || prizes.includes(newPrizeInput)) return;
    const updatedPrizes = [...prizes, newPrizeInput];
    setPrizes(updatedPrizes);
    setSelectedPrize(newPrizeInput);
    setNewPrizeInput('');
    localStorage.setItem('trivia_prizes', JSON.stringify(updatedPrizes));
  };

  const handleDeletePrize = (prizeToDelete: string) => {
    const updatedPrizes = prizes.filter(p => p !== prizeToDelete);
    setPrizes(updatedPrizes);
    if (selectedPrize === prizeToDelete) setSelectedPrize(updatedPrizes[0] || '');
    localStorage.setItem('trivia_prizes', JSON.stringify(updatedPrizes));
  };

  const handleStartGame = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
     const response = await fetch('https://trivia-api-z36k.onrender.com/api/games/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // THE UPGRADE: We are now sending the selected prize to the server!
        body: JSON.stringify({ barId: NEWPORT_BAR_ID, category: category, prize: selectedPrize })
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
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans flex justify-center">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        
        <header className="flex items-center justify-between border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">TRIVIA COMMAND</h1>
            <p className="text-slate-400 font-medium mt-1">Newport Sports Tavern</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <MonitorSpeaker className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold text-slate-300">TV Display Active</span>
          </div>
        </header>

        <main className="bg-slate-800 border border-slate-700 rounded-3xl p-10 shadow-2xl flex flex-col gap-10">
          
          {/* STEP 1: CATEGORY */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">1. Select Category</h2>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-600 text-white text-2xl font-bold py-4 px-6 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="NFL">🏈 NFL Football</option>
              <option value="Pop Culture">🎬 Pop Culture</option>
              <option value="History">📜 History</option>
              <option value="Science">🔬 Science</option>
            </select>
          </div>

          {/* NEW STEP 2: THE REWARD MANAGER */}
          <div className="bg-slate-700/50 p-6 rounded-2xl border border-slate-600">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
              <Gift className="w-6 h-6" /> 2. Set the Reward
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {prizes.map((prize, idx) => (
                <div key={idx} className="relative group">
                  <button
                    onClick={() => setSelectedPrize(prize)}
                    className={`w-full py-3 px-4 rounded-xl text-lg font-bold border-2 transition-all ${selectedPrize === prize ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                  >
                    {prize}
                  </button>
                  <button onClick={() => handleDeletePrize(prize)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newPrizeInput} 
                onChange={(e) => setNewPrizeInput(e.target.value)} 
                placeholder="Type a custom reward..." 
                className="flex-grow bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <button onClick={handleAddPrize} className="bg-slate-600 hover:bg-slate-500 px-4 rounded-xl text-white font-bold flex items-center gap-2 transition-colors">
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
          </div>

          {/* STEP 3: LAUNCH */}
          <div>
            <h2 className="text-xl font-bold mb-4">3. Launch Game</h2>
            <button
              onClick={handleStartGame}
              disabled={status === 'loading' || status === 'success'}
              className={`w-full flex items-center justify-center gap-4 py-8 rounded-2xl text-3xl font-black transition-all transform active:scale-[0.98] shadow-lg
                ${status === 'loading' ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 
                  status === 'success' ? 'bg-green-600 text-white border-4 border-green-400' : 
                  'bg-blue-600 hover:bg-blue-500 text-white'}
              `}
            >
              {status === 'loading' && <span className="animate-pulse">STARTING...</span>}
              {status === 'success' && <><CheckCircle2 className="w-10 h-10" /> ROUND STARTED</>}
              {status === 'idle' || status === 'error' ? <><Play className="w-10 h-10 fill-current" /> START ROUND</> : null}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;