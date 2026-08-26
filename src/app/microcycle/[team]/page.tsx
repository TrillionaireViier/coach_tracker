"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus, GripVertical, Trash2, Edit2, X, Save } from "lucide-react";
import { useTeam } from "@/contexts/TeamContext";

export default function MicrocyclePage() {
  const params = useParams();
  const router = useRouter();
  const decodedTeam = params.team ? decodeURIComponent(params.team as string) : "U-19";
  
  const { activeTeam, setActiveTeam } = useTeam();
  const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

  const [cycleData, setCycleData] = useState<any>({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Sync URL parameter with global active team
  useEffect(() => {
    if (decodedTeam && decodedTeam !== activeTeam) {
      setActiveTeam(decodedTeam);
    }
  }, [decodedTeam, activeTeam, setActiveTeam]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<{ id: number | null, dayIdx: number | null, title: string, type: string, startTime: string, endTime: string }>({
    id: null, dayIdx: null, title: "", type: "training", startTime: "10:00", endTime: "11:30"
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/microcycle?team=${encodeURIComponent(decodedTeam)}`);
      const data = await res.json();
      
      const formattedData: any = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      if (Array.isArray(data)) {
        data.forEach((event: any) => {
          if (formattedData[event.day_index]) {
            formattedData[event.day_index].push(event);
          }
        });
      }
      setCycleData(formattedData);
      setIsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch microcycle", err);
    }
  };

  useEffect(() => {
    setIsLoaded(false);
    fetchEvents();
  }, [decodedTeam]);

  const handleAddItem = (dayIndex: number) => {
    setEditingData({
      id: null, dayIdx: dayIndex, title: "", type: "training", startTime: "10:00", endTime: "11:30"
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (dayIndex: number, item: any) => {
    let st = "10:00";
    let et = "11:30";
    if (item.time && item.time.includes("-")) {
      const parts = item.time.split("-");
      st = parts[0]?.trim() || "10:00";
      et = parts[1]?.trim() || "11:30";
    }
    setEditingData({
      id: item.id, dayIdx: dayIndex, title: item.title, type: item.type, startTime: st, endTime: et
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingData.title.trim() || editingData.dayIdx === null) return;
    
    const isGame = editingData.type === 'game';
    const timeString = `${editingData.startTime} - ${editingData.endTime}`;
    
    if (editingData.id) {
      // Update
      await fetch('/api/microcycle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingData.id,
          title: editingData.title,
          type: editingData.type,
          time: timeString,
          highlight: isGame
        })
      });
    } else {
      // Add
      await fetch('/api/microcycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team: decodedTeam,
          day_index: editingData.dayIdx,
          title: editingData.title,
          type: editingData.type,
          time: timeString,
          highlight: isGame
        })
      });
    }
    
    await fetchEvents();
    setIsModalOpen(false);
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Видалити цю подію?')) {
      await fetch(`/api/microcycle?id=${id}`, { method: 'DELETE' });
      await fetchEvents();
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">Мікроцикл</h1>
          <p className="text-gray-500 mt-1 font-medium">Планування тренувального тижня</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        {!isLoaded ? (
          <div className="flex items-center justify-center h-full">Завантаження...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-7 gap-2 lg:gap-4 h-full min-w-max xl:min-w-0">
            {days.map((day, index) => (
              <div key={day} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden xl:w-auto w-72">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-oso-grafete">{day}</h3>
                  <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                    {((cycleData as any)[index] || []).length} подій
                  </span>
                </div>
                
                <div className="p-3 flex-1 flex flex-col gap-3">
                  {((cycleData as any)[index] || []).map((item: any) => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-xl border flex flex-col group ${
                        item.highlight 
                          ? 'bg-oso-gold/10 border-oso-gold/30' 
                          : item.type === 'training'
                            ? 'bg-[#16FC36]/10 border-[#16FC36]/30'
                            : 'bg-white border-gray-100 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.type}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEditItem(index, item); }}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                          <GripVertical size={14} className="text-gray-300 cursor-grab" />
                        </div>
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${item.highlight ? 'text-yellow-800' : 'text-oso-grafete'}`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">{item.time || "10:00 - 11:30"}</div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={() => handleAddItem(index)}
                    className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm hover:border-oso-primary hover:text-oso-primary transition-colors flex items-center justify-center gap-2 mt-auto active:scale-95"
                  >
                    <Plus size={16} /> Додати
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
      
      {/* Modal for Event Edit/Add */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-oso-grafete">{editingData.id !== null ? "Редагувати подію" : "Додати подію"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Назва</label>
                <input 
                  type="text" 
                  placeholder="Тренування, Гра, Збори..."
                  value={editingData.title}
                  onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Тип події</label>
                <div className="flex gap-2">
                  <select 
                    value={['training', 'game', 'medical', 'theory', 'event'].includes(editingData.type) ? editingData.type : 'custom'}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setEditingData({...editingData, type: ''})
                      } else {
                        setEditingData({...editingData, type: e.target.value})
                      }
                    }}
                    className={`${!['training', 'game', 'medical', 'theory', 'event'].includes(editingData.type) ? 'w-1/2' : 'w-full'} bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm cursor-pointer`}
                  >
                    <option value="training">Тренування</option>
                    <option value="game">Матч / Гра</option>
                    <option value="medical">Медицина / Відновлення</option>
                    <option value="theory">Теорія</option>
                    <option value="event">Інше (Сніданок, Вихідний)</option>
                    <option value="custom">Свій варіант...</option>
                  </select>
                  
                  {!['training', 'game', 'medical', 'theory', 'event'].includes(editingData.type) && (
                    <input
                      type="text"
                      placeholder="Введіть тип..."
                      value={editingData.type}
                      onChange={(e) => setEditingData({...editingData, type: e.target.value})}
                      className="w-1/2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Початок</label>
                  <input 
                    type="time" 
                    value={editingData.startTime}
                    onChange={(e) => setEditingData({...editingData, startTime: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Кінець</label>
                  <input 
                    type="time" 
                    value={editingData.endTime}
                    onChange={(e) => setEditingData({...editingData, endTime: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Скасувати
              </button>
              <button 
                onClick={handleSaveItem}
                disabled={!editingData.title.trim()}
                className="bg-oso-primary text-oso-dark px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#12d62e] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
