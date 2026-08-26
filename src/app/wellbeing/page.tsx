"use client";

import { useState, useEffect } from "react";
import { Smile, Frown, Meh, Activity, Moon, Zap, User, Users, LineChart } from "lucide-react";
import { showToast } from "@/components/Toast";
import { useTeam } from "@/contexts/TeamContext";

export default function WellbeingPage() {
  const [viewMode, setViewMode] = useState<"player" | "coach">("player");
  const { activeTeam } = useTeam();
  const [players, setPlayers] = useState<any[]>([]);
  
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState(7);
  const [fatigue, setFatigue] = useState(4);
  const [notes, setNotes] = useState("");
  
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // Load players
    const savedPlayers = localStorage.getItem("oso_players");
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        setPlayers(parsed[activeTeam] || []);
      } catch (e) {}
    }

    // Load reports
    const savedReports = localStorage.getItem("oso_wellbeing");
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {}
    }
  }, [activeTeam]);

  const handleSubmit = () => {
    if (!selectedPlayer) {
      showToast("Будь ласка, оберіть своє ім'я!");
      return;
    }
    if (!selectedMood) {
      showToast("Спочатку оберіть ваш настрій!");
      return;
    }

    const newReport = {
      id: Date.now(),
      team: activeTeam,
      playerName: selectedPlayer,
      mood: selectedMood,
      sleep,
      fatigue,
      notes,
      date: new Date().toISOString()
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem("oso_wellbeing", JSON.stringify(updatedReports));
    
    showToast("Звіт про самопочуття успішно відправлено!");
    setSelectedMood(null);
    setSleep(7);
    setFatigue(4);
    setNotes("");
    setSelectedPlayer("");
  };

  const moods = [
    { id: 1, icon: Frown, label: "Погано", color: "text-red-500", bg: "bg-red-50 hover:bg-red-100 border-red-200" },
    { id: 2, icon: Meh, label: "Нормально", color: "text-yellow-500", bg: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200" },
    { id: 3, icon: Smile, label: "Відмінно", color: "text-green-500", bg: "bg-green-50 hover:bg-green-100 border-green-200" },
  ];

  return (
    <div className="p-8 h-full flex flex-col max-w-5xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">Оцінка самопочуття</h1>
          <p className="text-gray-500 mt-2 font-medium">Контроль стану гравців команди: <span className="text-oso-primary font-bold">{activeTeam}</span></p>
        </div>
        
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setViewMode("player")}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${viewMode === "player" ? "bg-gray-100 text-oso-dark" : "text-gray-400 hover:text-gray-600"}`}
          >
            <User size={18} /> Анкета (Для Гравців)
          </button>
          <button 
            onClick={() => setViewMode("coach")}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${viewMode === "coach" ? "bg-oso-primary/10 text-oso-dark border border-oso-primary/20" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LineChart size={18} /> Панель Тренера
          </button>
        </div>
      </div>

      {viewMode === "player" ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-10 max-w-3xl mx-auto w-full">
          {/* Player Selection */}
          <section>
            <h2 className="text-xl font-bold text-oso-grafete mb-4 flex items-center gap-2">
              <Users className="text-oso-primary" />
              Хто ви?
            </h2>
            <select 
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-oso-grafete font-bold focus:outline-none focus:border-oso-primary transition-colors cursor-pointer"
            >
              <option value="">-- Оберіть своє ім'я --</option>
              {players.map(p => (
                <option key={p.id} value={p.name}>{p.name} {p.number ? `(#${p.number})` : ''}</option>
              ))}
            </select>
          </section>
        <section>
          <h2 className="text-xl font-bold text-oso-grafete mb-4 flex items-center gap-2">
            <Activity className="text-oso-primary" />
            Як ви себе почуваєте сьогодні?
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                  selectedMood === mood.id ? mood.bg + " ring-2 ring-offset-2 ring-oso-primary/50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <mood.icon size={48} className={`mb-3 ${selectedMood === mood.id ? mood.color : "text-gray-300"}`} />
                <span className={`font-bold ${selectedMood === mood.id ? "text-oso-grafete" : "text-gray-400"}`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Sleep & Fatigue Sliders */}
        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="text-lg font-bold text-oso-grafete mb-4 flex items-center gap-2">
              <Moon className="text-oso-dark" size={20} />
              Якість сну (1-10)
            </h2>
            <input 
              type="range" min="1" max="10" 
              value={sleep} onChange={(e) => setSleep(parseInt(e.target.value))}
              className="w-full accent-oso-primary" 
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold">
              <span>Жахливо (1)</span>
              <span className="text-oso-primary text-base">{sleep}</span>
              <span>Ідеально (10)</span>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-oso-grafete mb-4 flex items-center gap-2">
              <Zap className="text-oso-gold" size={20} />
              Рівень втоми (1-10)
            </h2>
            <input 
              type="range" min="1" max="10" 
              value={fatigue} onChange={(e) => setFatigue(parseInt(e.target.value))}
              className="w-full accent-oso-primary" 
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold">
              <span>Відпочив (1)</span>
              <span className="text-oso-primary text-base">{fatigue}</span>
              <span>Виснажений (10)</span>
            </div>
          </section>
        </div>

        {/* Notes */}
        <section>
          <h2 className="text-lg font-bold text-oso-grafete mb-4">Додаткові коментарі / Біль</h2>
          <textarea 
            rows={3} 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-oso-grafete focus:outline-none focus:border-oso-primary focus:ring-2 focus:ring-oso-primary/20 transition-all resize-none"
            placeholder="Опишіть, якщо є якісь проблеми (напр. біль у коліні)"
          ></textarea>
        </section>

        <button 
          onClick={handleSubmit}
          className="w-full bg-oso-primary text-oso-dark py-4 rounded-xl font-bold hover:bg-[#12d62e] transition-colors shadow-md text-lg active:scale-95"
        >
          Відправити звіт
        </button>
      </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-oso-grafete">Звіти гравців ({activeTeam})</h2>
          </div>
          <div className="overflow-auto flex-1 p-6">
            {reports.filter(r => r.team === activeTeam).length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium">Ще немає звітів від гравців цієї команди.</div>
            ) : (
              <div className="grid gap-4">
                {reports.filter(r => r.team === activeTeam).map((report, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm hover:border-gray-200 transition-colors">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-oso-grafete mb-1">{report.playerName}</div>
                      <div className="text-xs text-gray-400 font-medium">{new Date(report.date).toLocaleString('uk-UA')}</div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Стан</span>
                        {report.mood === 1 && <Frown size={24} className="text-red-500" />}
                        {report.mood === 2 && <Meh size={24} className="text-yellow-500" />}
                        {report.mood === 3 && <Smile size={24} className="text-green-500" />}
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Сон</span>
                        <div className={`font-bold text-lg ${report.sleep < 5 ? 'text-red-500' : 'text-green-500'}`}>{report.sleep}/10</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Втома</span>
                        <div className={`font-bold text-lg ${report.fatigue > 7 ? 'text-red-500' : 'text-oso-grafete'}`}>{report.fatigue}/10</div>
                      </div>
                    </div>
                    
                    {report.notes && (
                      <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
                        <span className="font-bold text-xs text-gray-400 block mb-1 uppercase">Коментар</span>
                        {report.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
