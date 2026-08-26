"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, Trash2, Edit2, X, Save } from "lucide-react";
import { useTeam } from "@/contexts/TeamContext";

export default function MicrocyclePage() {
  const { activeTeam } = useTeam();
  const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

  const defaultCycleData = {
    0: [{ title: "Сніданок", type: "event" }, { title: "Тренування (Фізика)", type: "training" }],
    1: [{ title: "Відновлення", type: "medical" }],
    2: [{ title: "Сніданок", type: "event" }, { title: "Тренування (Тактика)", type: "training" }, { title: "Теорія", type: "theory" }],
    3: [],
    4: [{ title: "Тренування (Передматчеве)", type: "training" }],
    5: [{ title: "Гра: Оболонь", type: "game", highlight: true }],
    6: [{ title: "Вихідний", type: "event" }],
  };

  const [cycleData, setCycleData] = useState<any>(defaultCycleData);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<{ dayIdx: number | null, itemIdx: number | null, title: string, type: string, time: string }>({
    dayIdx: null, itemIdx: null, title: "", type: "training", time: "10:00 - 11:30"
  });

  useEffect(() => {
    const saved = localStorage.getItem(`oso_microcycle_${activeTeam}`);
    if (saved) {
      try {
        setCycleData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved microcycle data");
      }
    } else {
      setCycleData(defaultCycleData);
    }
    setIsLoaded(true);
  }, [activeTeam]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`oso_microcycle_${activeTeam}`, JSON.stringify(cycleData));
    }
  }, [cycleData, isLoaded, activeTeam]);

  const handleAddItem = (dayIndex: number) => {
    setEditingData({
      dayIdx: dayIndex, itemIdx: null, title: "", type: "training", time: "10:00 - 11:30"
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (dayIndex: number, itemIndex: number, item: any) => {
    setEditingData({
      dayIdx: dayIndex, itemIdx: itemIndex, title: item.title, type: item.type, time: item.time || "10:00 - 11:30"
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingData.title.trim() || editingData.dayIdx === null) return;
    
    const updated = { ...cycleData };
    if (!updated[editingData.dayIdx]) updated[editingData.dayIdx] = [];
    
    const newItem = {
      title: editingData.title,
      type: editingData.type,
      time: editingData.time,
      highlight: editingData.type === 'game'
    };

    if (editingData.itemIdx !== null) {
      // Edit
      updated[editingData.dayIdx][editingData.itemIdx] = newItem;
    } else {
      // Add
      updated[editingData.dayIdx].push(newItem);
    }
    
    setCycleData(updated);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (dayIndex: number, itemIndex: number) => {
    const updated = { ...cycleData };
    updated[dayIndex] = updated[dayIndex].filter((_: any, idx: number) => idx !== itemIndex);
    setCycleData(updated);
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
                {((cycleData as any)[index] || []).map((item: any, itemIdx: number) => (
                  <div 
                    key={itemIdx} 
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
                          onClick={(e) => { e.stopPropagation(); handleEditItem(index, itemIdx, item); }}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteItem(index, itemIdx); }}
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
    </div>
      
      {/* Modal for Event Edit/Add */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-oso-grafete">{editingData.itemIdx !== null ? "Редагувати подію" : "Додати подію"}</h2>
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
                <select 
                  value={editingData.type}
                  onChange={(e) => setEditingData({...editingData, type: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm cursor-pointer"
                >
                  <option value="training">Тренування</option>
                  <option value="game">Матч / Гра</option>
                  <option value="medical">Медицина / Відновлення</option>
                  <option value="theory">Теорія</option>
                  <option value="event">Інше (Сніданок, Вихідний)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Час</label>
                <input 
                  type="text" 
                  placeholder="10:00 - 11:30"
                  value={editingData.time}
                  onChange={(e) => setEditingData({...editingData, time: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                />
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
