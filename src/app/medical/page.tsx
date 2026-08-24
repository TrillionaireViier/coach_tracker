"use client";

import { useState, useEffect } from "react";
import { Activity, AlertTriangle, CheckCircle, Flame, BatteryCharging, Loader2, Edit2, Check, X } from "lucide-react";

type MedicalRecord = { id: number; name: string; issue: string; returnDate: string; severity: string; tdee: number; expenditure: number };

export default function MedicalPage() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<MedicalRecord>>({});

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    fetch('/api/medical')
      .then(res => res.json())
      .then(data => {
        setMedicalRecords(data);
        setIsLoading(false);
      });
  };

  const handleEditClick = (record: MedicalRecord) => {
    setEditingId(record.id);
    setEditForm(record);
  };

  const handleSave = async (id: number) => {
    await fetch('/api/medical', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm })
    });
    setEditingId(null);
    fetchRecords();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Медицина & Харчування</h1>
          <p className="text-gray-400">Стан здоров'я та трекінг енерговитрат (MacroFactor).</p>
        </div>
        <button className="bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-medium hover:bg-[#85c95a] transition-colors">
          + Звіт Лікаря / Дієтолога
        </button>
      </header>

      {/* TDEE Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 font-medium mb-2">Середній TDEE Команди</h3>
            <p className="text-3xl font-bold text-white">3,450 <span className="text-lg font-normal text-gray-500">ккал</span></p>
          </div>
          <div className="p-4 bg-orange-500/10 rounded-full text-orange-400"><Flame size={28} /></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 font-medium mb-2">Енергетичний Баланс</h3>
            <p className="text-3xl font-bold text-green-400">Профіцит</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-full text-green-400"><BatteryCharging size={28} /></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-gray-400 font-medium mb-2">Травмовані гравці</h3>
          <p className="text-3xl font-bold text-red-400">2 <span className="text-lg font-normal text-gray-500">особи</span></p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Статус Гравців (Травми & Енергія)</h2>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-[#9FE870]" size={32} />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-950 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Гравець</th>
                <th className="p-4 font-medium">Проблема & Ступінь</th>
                <th className="p-4 font-medium">TDEE (Норма)</th>
                <th className="p-4 font-medium">Витрачено (Сьогодні)</th>
                <th className="p-4 font-medium">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {medicalRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      record.severity === 'Готовий' ? 'bg-green-500/10 text-green-400' :
                      record.severity === 'Середня' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {record.severity === 'Готовий' ? <CheckCircle size={18} /> : 
                       record.severity === 'Середня' ? <AlertTriangle size={18} /> : 
                       <Activity size={18} />}
                    </div>
                    <span className="text-white font-medium">{record.name}</span>
                  </td>
                  
                  <td className="p-4">
                    {editingId === record.id ? (
                      <div className="flex flex-col gap-2">
                        <input 
                          className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                          value={editForm.issue || ""} 
                          onChange={e => setEditForm({...editForm, issue: e.target.value})}
                          placeholder="Проблема"
                        />
                        <select 
                          className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                          value={editForm.severity || "Готовий"}
                          onChange={e => setEditForm({...editForm, severity: e.target.value})}
                        >
                          <option>Готовий</option>
                          <option>Легка</option>
                          <option>Середня</option>
                          <option>Важка</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-gray-400">{record.issue}</span>
                        <span className={`w-fit mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                          record.severity === 'Готовий' ? 'bg-green-500/10 text-green-400' :
                          record.severity === 'Середня' ? 'bg-red-500/10 text-red-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {record.severity}
                        </span>
                      </div>
                    )}
                  </td>
                  
                  <td className="p-4 text-white font-medium">
                    {editingId === record.id ? (
                      <input 
                        type="number"
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm w-20"
                        value={editForm.tdee || 0} 
                        onChange={e => setEditForm({...editForm, tdee: Number(e.target.value)})}
                      />
                    ) : (
                      `${record.tdee} ккал`
                    )}
                  </td>
                  
                  <td className="p-4">
                    {editingId === record.id ? (
                      <input 
                        type="number"
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm w-20"
                        value={editForm.expenditure || 0} 
                        onChange={e => setEditForm({...editForm, expenditure: Number(e.target.value)})}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300">{record.expenditure} ккал</span>
                        <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${record.expenditure >= record.tdee ? 'bg-orange-500' : 'bg-[#9FE870]'}`}
                            style={{ width: `${Math.min((record.expenditure / record.tdee) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </td>
                  
                  <td className="p-4">
                    {editingId === record.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(record.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                          <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(record)} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
