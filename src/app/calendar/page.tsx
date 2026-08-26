"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Save } from "lucide-react";
import { showToast } from "@/components/Toast";
import { useTeam } from "@/contexts/TeamContext";

export default function CalendarPage() {
  const { activeTeam } = useTeam();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

  const defaultEvents = {
    5: [{ type: "training", title: "Тренування (Тактика)", time: "16:00" }],
    12: [{ type: "game", title: "Гра проти Динамо", time: "14:00" }],
    15: [{ type: "training", title: "Відновлення", time: "10:00" }],
    22: [{ type: "game", title: "Кубок: 1/4", time: "18:00" }],
  };

  const [events, setEvents] = useState<any>(defaultEvents);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", type: "training", time: "10:00 - 11:30" });

  useEffect(() => {
    const saved = localStorage.getItem(`oso_calendar_${activeTeam}`);
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved calendar data");
      }
    } else {
      setEvents(defaultEvents); // Reset to default if no saved data for this team
    }
    setIsLoaded(true);
  }, [activeTeam]); // Re-run when team changes

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`oso_calendar_${activeTeam}`, JSON.stringify(events));
    }
  }, [events, isLoaded, activeTeam]);

  const handleAddEventClick = (day: number) => {
    setEditingDay(day);
    setNewEvent({ title: "", type: "training", time: "10:00 - 11:30" });
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title.trim() || editingDay === null) return;
    
    const updated = { ...events };
    if (!updated[editingDay]) updated[editingDay] = [];
    
    updated[editingDay] = [...updated[editingDay], { 
      type: newEvent.type, 
      title: newEvent.title, 
      time: newEvent.time 
    }];
    
    setEvents(updated);
    setIsModalOpen(false);
    showToast(`Подію успішно додано на ${editingDay} число!`);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">Календар</h1>
          <p className="text-gray-500 mt-1 font-medium">Планування подій та матчів на місяць</p>
        </div>
        <button 
          onClick={() => handleAddEventClick(new Date().getDate())}
          className="bg-oso-primary text-oso-dark px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#12d62e] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Додати подію (Сьогодні)
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-oso-grafete">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="px-4 py-2 font-semibold text-oso-dark bg-oso-primary/10 rounded-lg hover:bg-oso-primary/20 transition-colors">
              Сьогодні
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {["Пн", "Вв", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-gray-100 gap-[1px]">
          {blanks.map((b) => (
            <div key={`blank-${b}`} className="bg-white min-h-[100px] p-2" />
          ))}
          {days.map((day) => (
            <div key={day} className="bg-white min-h-[100px] p-2 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start">
                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${day === 15 ? 'bg-oso-primary text-oso-dark' : 'text-gray-400 group-hover:text-oso-grafete'}`}>
                  {day}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAddEventClick(day); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-oso-primary transition-opacity"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="mt-2 space-y-1">
                {(events as any)[day]?.map((event: any, i: number) => (
                  <div 
                    key={i} 
                    className={`text-xs p-1.5 rounded-md font-medium truncate ${
                      event.type === 'game' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-oso-primary/20 text-oso-dark border border-oso-primary/30'
                    }`}
                  >
                    <span className="font-bold opacity-75 mr-1">{event.time}</span>
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-oso-grafete">Додати подію на {editingDay} число</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Назва</label>
                <input 
                  type="text" 
                  placeholder="Тренування, Гра..."
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Тип події</label>
                <select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm cursor-pointer"
                >
                  <option value="training">Тренування</option>
                  <option value="game">Гра / Матч</option>
                  <option value="medical">Відновлення / Медицина</option>
                  <option value="theory">Теорія</option>
                  <option value="event">Інше</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Час</label>
                <input 
                  type="text" 
                  placeholder="10:00"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
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
                onClick={handleSaveEvent}
                disabled={!newEvent.title.trim()}
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
