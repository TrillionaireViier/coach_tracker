"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Target, TrendingUp, Activity, Crosshair } from "lucide-react";

const teamPerformanceData = [
  { name: 'Тур 1', attack: 75, defense: 85, possession: 55 },
  { name: 'Тур 2', attack: 82, defense: 78, possession: 60 },
  { name: 'Тур 3', attack: 68, defense: 90, possession: 45 },
  { name: 'Тур 4', attack: 88, defense: 82, possession: 65 },
  { name: 'Тур 5', attack: 95, defense: 88, possession: 58 },
];

const playerLoadData = [
  { name: 'Пн', load: 45 },
  { name: 'Вт', load: 85 },
  { name: 'Ср', load: 60 },
  { name: 'Чт', load: 90 },
  { name: 'Пт', load: 75 },
  { name: 'Сб', load: 100 }, // Game day
  { name: 'Нд', load: 30 },
];

export default function AnalysisPage() {
  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">Аналіз</h1>
          <p className="text-gray-500 mt-1 font-medium">Аналітика команди та тренувальних навантажень</p>
        </div>
        <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-oso-grafete focus:outline-none focus:border-oso-primary shadow-sm">
          <option>Останні 5 матчів</option>
          <option>Поточний місяць</option>
          <option>Весь сезон</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 rounded-xl bg-green-50 text-green-600"><Target size={24} /></div>
            <span className="text-sm font-bold text-green-600 flex items-center gap-1"><TrendingUp size={14}/> +12%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold">Реалізація моментів</h3>
          <p className="text-3xl font-black text-oso-grafete mt-1">24.5%</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Crosshair size={24} /></div>
            <span className="text-sm font-bold text-green-600 flex items-center gap-1"><TrendingUp size={14}/> +5%</span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold">Точність передач</h3>
          <p className="text-3xl font-black text-oso-grafete mt-1">82%</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600"><Activity size={24} /></div>
          </div>
          <h3 className="text-gray-500 text-sm font-bold">Середній RPE</h3>
          <p className="text-3xl font-black text-oso-grafete mt-1">7.8</p>
        </div>
        <div className="bg-oso-dark rounded-2xl border border-oso-dark p-6 shadow-sm text-white">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 rounded-xl bg-oso-primary/20 text-oso-primary"><TrendingUp size={24} /></div>
          </div>
          <h3 className="text-gray-300 text-sm font-bold">XG (Очікувані голи)</h3>
          <p className="text-3xl font-black text-oso-primary mt-1">2.14</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        
        {/* Performance Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-oso-grafete mb-6">Динаміка гри (Останні матчі)</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="attack" name="Атака" fill="#16FC36" radius={[4, 4, 0, 0]} />
                <Bar dataKey="defense" name="Захист" fill="#0E3D24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Load Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-oso-grafete mb-6">Навантаження команди (Мікроцикл)</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={playerLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="load" name="Навантаження" stroke="#D4AF37" strokeWidth={4} dot={{r: 6, fill: '#D4AF37', strokeWidth: 0}} activeDot={{r: 8, fill: '#0E3D24'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
