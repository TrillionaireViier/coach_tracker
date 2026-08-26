"use client";

import { useState } from "react";
import { Save, Settings as SettingsIcon, BrainCircuit, Activity } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function SettingsPage() {
  const [multiplier, setMultiplier] = useState(1.5);

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">Налаштування Алгоритмів</h1>
          <p className="text-gray-500 mt-1 font-medium">Параметри генерації тренувань та відстеження втоми.</p>
        </div>
        <button 
          onClick={() => showToast("Налаштування алгоритмів успішно збережено!")}
          className="bg-oso-primary text-oso-dark px-6 py-3 rounded-xl font-bold hover:bg-[#12d62e] transition-colors flex items-center gap-2 shadow-sm active:scale-95"
        >
          <Save size={20} />
          Зберегти Зміни
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RP Hypertrophy Algorithm */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-500">
              <BrainCircuit size={24} />
            </div>
            <h2 className="text-xl font-bold text-oso-grafete">Alpha Progression & RP</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Базовий RIR (Reps in Reserve)</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-oso-grafete font-medium focus:outline-none focus:border-oso-primary transition-colors cursor-pointer">
                <option>RIR 3 (Легке навантаження)</option>
                <option>RIR 2 (Середнє навантаження)</option>
                <option selected>RIR 1 (Важке навантаження)</option>
                <option>RIR 0 (Відмова)</option>
              </select>
              <p className="text-xs text-gray-400 mt-2 font-medium">Визначає, наскільки близько до відмови мають тренуватися гравці.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Автоматичне Прогресивне Перевантаження</label>
              <div className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-oso-primary border-gray-300 rounded cursor-pointer" />
                <span className="text-oso-grafete font-medium group-hover:text-oso-primary transition-colors">Збільшувати об'єм (Sets) при RPE &lt; 7</span>
              </div>
            </div>
          </div>
        </div>

        {/* MacroFactor Energy Expenditure */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-500">
              <Activity size={24} />
            </div>
            <h2 className="text-xl font-bold text-oso-grafete">MacroFactor (Енерговитрати)</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Коефіцієнт Тренувального Навантаження</label>
              <input 
                type="range" 
                min="1" max="2" step="0.1" 
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full accent-oso-primary"
              />
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2 font-medium">
                <span>Легкий (1.2)</span>
                <span className="font-bold text-oso-dark text-sm bg-oso-primary/20 px-2 py-1 rounded-md border border-oso-primary/30">Поточний: {multiplier}</span>
                <span>Високий (1.8)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2">Автокорекція Макросів</label>
              <div className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-oso-primary border-gray-300 rounded cursor-pointer" />
                <span className="text-oso-grafete font-medium group-hover:text-oso-primary transition-colors">Динамічно змінювати TDEE на основі ваги гравця</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
