"use client";

import { Save, Settings as SettingsIcon, BrainCircuit, Activity } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Налаштування Алгоритмів</h1>
          <p className="text-gray-400">Параметри генерації тренувань та відстеження втоми.</p>
        </div>
        <button className="bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-medium hover:bg-[#85c95a] transition-colors flex items-center gap-2">
          <Save size={18} />
          Зберегти Зміни
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RP Hypertrophy Algorithm */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <BrainCircuit size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Alpha Progression & RP</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Базовий RIR (Reps in Reserve)</label>
              <select className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870] transition-colors">
                <option>RIR 3 (Легке навантаження)</option>
                <option>RIR 2 (Середнє навантаження)</option>
                <option selected>RIR 1 (Важке навантаження)</option>
                <option>RIR 0 (Відмова)</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">Визначає, наскільки близько до відмови мають тренуватися гравці.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Автоматичне Прогресивне Перевантаження</label>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#9FE870] bg-gray-950 border-gray-800" />
                <span className="text-white">Збільшувати об'єм (Sets) при RPE &lt; 7</span>
              </div>
            </div>
          </div>
        </div>

        {/* MacroFactor Energy Expenditure */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
              <Activity size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">MacroFactor (Енерговитрати)</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Коефіцієнт Тренувального Навантаження</label>
              <input 
                type="range" 
                min="1" max="2" step="0.1" defaultValue="1.5"
                className="w-full accent-[#9FE870]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Легкий (1.2)</span>
                <span>Високий (1.8)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Автокорекція Макросів</label>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#9FE870] bg-gray-950 border-gray-800" />
                <span className="text-white">Динамічно змінювати TDEE на основі ваги гравця</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
