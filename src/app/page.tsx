"use client";

import Link from "next/link";
import { Users, CalendarCheck, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Пн', intensity: 65, attendance: 22 },
  { name: 'Вт', intensity: 85, attendance: 24 },
  { name: 'Ср', intensity: 45, attendance: 21 },
  { name: 'Чт', intensity: 90, attendance: 23 },
  { name: 'Пт', intensity: 75, attendance: 24 },
  { name: 'Сб', intensity: 100, attendance: 25 },
  { name: 'Нд', intensity: 30, attendance: 20 },
];

export default function DashboardOverview() {
  const handleLogout = () => {
    localStorage.removeItem("coach_auth");
    window.location.reload();
  };

  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Панель управління</h1>
          <p className="text-gray-400">З поверненням, Тренер. Ось огляд вашої команди.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleLogout} className="bg-gray-800 text-white border border-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors">
            Вийти
          </button>
          <button className="bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-medium hover:bg-[#85c95a] transition-colors">
            + Запланувати Тренування
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Users size={24} />
            </div>
            <span className="text-green-400 text-sm flex items-center font-medium"><TrendingUp size={14} className="mr-1" /> +2</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Активні Гравці</h3>
          <p className="text-3xl font-bold text-white mt-1">24</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
              <CalendarCheck size={24} />
            </div>
            <span className="text-green-400 text-sm flex items-center font-medium"><TrendingUp size={14} className="mr-1" /> 100%</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Тижнева Відвідуваність</h3>
          <p className="text-3xl font-bold text-white mt-1">92%</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Середня Готовність (RPE)</h3>
          <p className="text-3xl font-bold text-white mt-1">8.4 / 10</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Наступний Матч Через</h3>
          <p className="text-3xl font-bold text-white mt-1">3 Дні</p>
        </div>
      </div>

      {/* Bottom Section: Chart & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart Section */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Тижневе Навантаження та Інтенсивність</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9FE870" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9FE870" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#9FE870' }}
                />
                <Area type="monotone" dataKey="intensity" stroke="#9FE870" strokeWidth={3} fillOpacity={1} fill="url(#colorIntensity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Календар (Серпень 2026)</h2>
            <Link href="/events" className="text-sm text-[#9FE870] hover:underline">Всі події</Link>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-medium text-gray-400">
            <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div className="text-white">Сб</div><div className="text-white">Нд</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 flex-1">
            {/* Empty days */}
            <div className="p-2 border border-gray-800/50 rounded-lg bg-gray-900/50 opacity-50"></div>
            <div className="p-2 border border-gray-800/50 rounded-lg bg-gray-900/50 opacity-50"></div>
            <div className="p-2 border border-gray-800/50 rounded-lg bg-gray-900/50 opacity-50"></div>
            
            {/* Days 1-28 Mock */}
            {[...Array(28)].map((_, i) => {
              const day = i + 1;
              const hasMatch = day === 15 || day === 28;
              const hasTraining = day % 3 === 0 && !hasMatch;
              const isToday = day === 24;
              
              return (
                <div key={day} className={`p-2 border rounded-lg flex flex-col items-center justify-start gap-1 transition-colors hover:bg-gray-800 cursor-pointer ${
                  isToday ? 'border-[#9FE870] bg-[#9FE870]/5' : 'border-gray-800 bg-gray-900'
                }`}>
                  <span className={`text-sm ${isToday ? 'text-[#9FE870] font-bold' : 'text-gray-300'}`}>{day}</span>
                  {hasMatch && <div className="w-2 h-2 rounded-full bg-orange-500" title="Матч"></div>}
                  {hasTraining && <div className="w-2 h-2 rounded-full bg-blue-500" title="Тренування"></div>}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex gap-4 text-xs text-gray-400 justify-center border-t border-gray-800 pt-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Матч</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Тренування</div>
          </div>
        </div>

      </div>
    </div>
  );
}
