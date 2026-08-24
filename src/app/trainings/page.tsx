"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Shuffle, Dumbbell, BrainCircuit, Activity, Loader2, X } from "lucide-react";

type Training = { id: number; type: string; time: string; location: string; status: string; rpe: number; rir: number; volume: string };

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTraining, setNewTraining] = useState<Partial<Training>>({
    type: "",
    time: "",
    location: "",
    status: "Заплановано",
    rpe: 5,
    rir: 2,
    volume: "MAV"
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    fetch('/api/trainings')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error("API Error:", data.error);
          setTrainings([]);
        } else {
          setTrainings(Array.isArray(data) ? data : []);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        setTrainings([]);
        setIsLoading(false);
      });
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTraining)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert("Помилка збереження: " + (data.error || "Невідома помилка DB. Чи налаштували ви DATABASE_URL у Vercel?"));
        return;
      }
      
      setIsModalOpen(false);
      setNewTraining({ type: "", time: "", location: "", status: "Заплановано", rpe: 5, rir: 2, volume: "MAV" });
      fetchTrainings();
    } catch (err) {
      alert("Не вдалося підключитися до сервера!");
    }
  };

  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Тренування та Прогресія</h1>
          <p className="text-gray-400">Графік тренувань, RIR/RPE та відстеження об'єму (MEV/MRV).</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-6 py-3 rounded-xl font-medium hover:bg-purple-600/30 transition-colors flex items-center gap-2">
            <Shuffle size={18} />
            Зміксувати Тренування (Alpha Progression)
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-medium hover:bg-[#85c95a] transition-colors flex items-center gap-2"
          >
            <Dumbbell size={18} />
            + Запланувати Тренування
          </button>
        </div>
      </header>

      {/* Algorithmic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><BrainCircuit size={20} /></div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Поточний Об'єм Команди</h3>
            <p className="text-xl font-bold text-white mt-1">MAV <span className="text-sm font-normal text-gray-500">(Макс. Адаптивний)</span></p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><Dumbbell size={20} /></div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Середній RIR</h3>
            <p className="text-xl font-bold text-white mt-1">2 <span className="text-sm font-normal text-gray-500">(повторення в запасі)</span></p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400"><Activity size={20} /></div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Втома (Fatigue)</h3>
            <p className="text-xl font-bold text-orange-400 mt-1">Висока <span className="text-sm font-normal text-gray-500">(близько до MRV)</span></p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-[#9FE870]" size={32} />
          </div>
        ) : (
          trainings.map((session) => (
            <div key={session.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between hover:border-gray-700 transition-colors gap-4">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-[#9FE870]">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{session.type}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={14} /> {session.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {session.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Advanced Metrics */}
              <div className="flex items-center gap-6 bg-gray-950 p-3 rounded-xl border border-gray-800">
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase">Об'єм</div>
                  <div className={`font-bold ${session.volume === 'MRV' ? 'text-red-400' : session.volume === 'MEV' ? 'text-blue-400' : 'text-green-400'}`}>{session.volume}</div>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase">RPE</div>
                  <div className="font-bold text-white">{session.rpe}/10</div>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase">RIR</div>
                  <div className="font-bold text-white">{session.rir}</div>
                </div>
              </div>

              <div>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  session.status === 'Завершено' ? 'bg-gray-800 text-gray-400' : 'bg-[#9FE870]/10 text-[#9FE870]'
                }`}>
                  {session.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Нове Тренування</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Тип тренування</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870]"
                  placeholder="Наприклад, Тактика"
                  value={newTraining.type}
                  onChange={e => setNewTraining({...newTraining, type: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Час</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870]"
                  placeholder="Сьогодні, 18:00"
                  value={newTraining.time}
                  onChange={e => setNewTraining({...newTraining, time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Місце</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870]"
                  placeholder="Головне поле"
                  value={newTraining.location}
                  onChange={e => setNewTraining({...newTraining, location: e.target.value})}
                />
              </div>
              
              <button 
                onClick={handleCreate}
                className="w-full bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-bold hover:bg-[#85c95a] transition-colors mt-6"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
