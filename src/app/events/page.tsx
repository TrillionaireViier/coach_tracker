"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Loader2, ArrowLeft, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Training = { id: number; type: string; time: string; location: string; status: string };

export default function EventsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);

  // Navigation State (starts at August 2026 as per original design)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); 

  useEffect(() => {
    fetch('/api/trainings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setTrainings(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setMatches(Array.isArray(data) ? data : []);
      });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
  const monthName = monthNames[month];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const firstDayOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Deterministic training type generator for infinite scrolling
  const trainingTypes = [
    { name: "Ноги", color: "text-blue-400 bg-blue-500/20 border-blue-500/30" },
    { name: "Руки / Плечі", color: "text-purple-400 bg-purple-500/20 border-purple-500/30" },
    { name: "Спина / Кор", color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30" },
    { name: "Відпочинок / Масаж", color: "text-green-400 bg-green-500/20 border-green-500/30" }
  ];

  return (
    <div className="p-8 pb-20">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 text-sm">
            <ArrowLeft size={16} /> Повернутися на головну
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Календар подій</h1>
          <p className="text-gray-400">Розклад усіх матчів, тренувань та командних зборів.</p>
        </div>
        <Link href="/matches" className="bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-bold hover:bg-[#85c95a] transition-colors flex items-center gap-2">
          <Plus size={18} /> Створити подію
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        
        {/* Main Calendar View */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button onClick={handlePrevMonth} className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 text-white"><ChevronLeft size={20}/></button>
              <h2 className="text-2xl font-bold text-white w-48 text-center">{monthName} {year}</h2>
              <button onClick={handleNextMonth} className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 text-white"><ChevronRight size={20}/></button>
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Матчі</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Тренування</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Відпочинок</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm font-medium text-gray-500">
            <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div className="text-gray-300">Сб</div><div className="text-gray-300">Нд</div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {[...Array(firstDayOffset)].map((_, i) => (
              <div key={`empty-${i}`} className="h-28 border border-gray-800/30 rounded-xl bg-gray-900/30"></div>
            ))}
            
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const today = new Date();
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              
              const matchOnDay = matches.find(m => m.date.includes(`${day} ${monthName}`));
              const hasMatch = !!matchOnDay;
              
              // Deterministic assignment of training type based on absolute day index
              const dayTimestamp = new Date(year, month, day).getTime();
              const dayIndex = Math.floor(dayTimestamp / (1000 * 60 * 60 * 24));
              const tType = trainingTypes[Math.abs(dayIndex) % trainingTypes.length];
              const hasTraining = !hasMatch; 
              
              return (
                <div 
                  key={day} 
                  className={`h-28 p-2 border rounded-xl flex flex-col transition-all hover:bg-gray-800 cursor-pointer ${
                    isToday ? 'border-[#9FE870] bg-[#9FE870]/5' : 'border-gray-800 bg-gray-950'
                  }`}
                >
                  <span className={`text-sm mb-2 ${isToday ? 'text-[#9FE870] font-bold' : 'text-gray-400'}`}>
                    {day}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {hasMatch && (
                      <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] uppercase font-bold px-1.5 py-1 rounded truncate">
                        Матч: {matchOnDay.opponent.split(' ')[1] || matchOnDay.opponent}
                      </div>
                    )}
                    {hasTraining && (
                      <div className={`border text-[10px] uppercase font-bold px-1.5 py-1 rounded truncate ${tType.color}`}>
                        {tType.name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming List */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Найближчі події</h3>
            
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#9FE870]" /></div>
              ) : (
                trainings.slice(0, 5).map(t => (
                  <div key={t.id} className="p-4 bg-gray-950 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-400 uppercase">Тренування</span>
                      <span className="text-xs text-gray-500">{t.status}</span>
                    </div>
                    <h4 className="text-white font-bold mb-2">{t.type}</h4>
                    <div className="flex flex-col gap-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5"><Clock size={12}/> {t.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={12}/> {t.location}</span>
                    </div>
                  </div>
                ))
              )}

              {matches.slice(0, 3).map(m => (
                <div key={m.id} className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl hover:bg-orange-500/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-400 uppercase">Офіційний Матч ({m.type})</span>
                    <span className="text-xs text-orange-500/50">{m.status}</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">{m.opponent}</h4>
                  <div className="flex flex-col gap-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><Clock size={12}/> {m.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12}/> {m.location}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/matches" className="block w-full text-center py-3 mt-6 border border-gray-800 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              Перейти до таблиці бази
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
