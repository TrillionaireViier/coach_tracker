"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, Check, X, Clock, MapPin, Trophy } from "lucide-react";

type Match = { id: number; opponent: string; type: string; date: string; location: string; status: string };

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Match>>({});
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    opponent: "",
    type: "Домашній",
    date: "",
    location: "",
    status: "Заплановано"
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = () => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        setMatches(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMatches([]);
        setIsLoading(false);
      });
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMatch)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewMatch({ opponent: "", type: "Домашній", date: "", location: "", status: "Заплановано" });
        fetchMatches();
      } else {
        alert("Помилка збереження матчу");
      }
    } catch (err) {
      alert("Помилка сервера");
    }
  };

  const handleEditClick = (match: Match) => {
    setEditingId(match.id);
    setEditForm(match);
  };

  const handleSave = async (id: number) => {
    await fetch('/api/matches', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm })
    });
    setEditingId(null);
    fetchMatches();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="p-8 pb-20">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Матчі</h1>
          <p className="text-gray-400">Управління іграми та календарем матчів.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-medium hover:bg-[#85c95a] transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Додати Матч
        </button>
      </header>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-[#9FE870]" size={32} />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-950 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Суперник</th>
                <th className="p-4 font-medium">Тип / Місце</th>
                <th className="p-4 font-medium">Дата & Час</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {matches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-400">
                      <Trophy size={18} />
                    </div>
                    {editingId === match.id ? (
                      <input 
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        value={editForm.opponent || ""} 
                        onChange={e => setEditForm({...editForm, opponent: e.target.value})}
                      />
                    ) : (
                      <span className="text-white font-medium">{match.opponent}</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">
                    {editingId === match.id ? (
                      <div className="flex flex-col gap-2">
                        <select 
                          className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm w-32"
                          value={editForm.type || "Домашній"}
                          onChange={e => setEditForm({...editForm, type: e.target.value})}
                        >
                          <option>Домашній</option>
                          <option>Виїзний</option>
                        </select>
                        <input 
                          className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm w-32"
                          value={editForm.location || ""} 
                          onChange={e => setEditForm({...editForm, location: e.target.value})}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-gray-300 font-medium">{match.type}</span>
                        <span className="text-xs flex items-center gap-1 mt-1"><MapPin size={12}/> {match.location}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">
                    {editingId === match.id ? (
                      <input 
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm w-40"
                        value={editForm.date || ""} 
                        onChange={e => setEditForm({...editForm, date: e.target.value})}
                      />
                    ) : (
                      <span className="flex items-center gap-2"><Clock size={14}/> {match.date}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === match.id ? (
                      <select 
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        value={editForm.status || "Заплановано"}
                        onChange={e => setEditForm({...editForm, status: e.target.value})}
                      >
                        <option>Заплановано</option>
                        <option>Завершено</option>
                        <option>Скасовано</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        match.status === 'Завершено' ? 'bg-gray-800 text-gray-400' :
                        match.status === 'Скасовано' ? 'bg-red-500/10 text-red-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {match.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === match.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(match.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                          <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(match)} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Додати Матч</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Команда суперника</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870]"
                  placeholder="ФК Динамо"
                  value={newMatch.opponent}
                  onChange={e => setNewMatch({...newMatch, opponent: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Тип</label>
                  <select 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870]"
                    value={newMatch.type}
                    onChange={e => setNewMatch({...newMatch, type: e.target.value})}
                  >
                    <option>Домашній</option>
                    <option>Виїзний</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Дата та Час</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870]"
                    placeholder="28 Серпня, 19:00"
                    value={newMatch.date}
                    onChange={e => setNewMatch({...newMatch, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Стадіон / Місце</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870]"
                  placeholder="Олімпійський Стадіон"
                  value={newMatch.location}
                  onChange={e => setNewMatch({...newMatch, location: e.target.value})}
                />
              </div>
              
              <button 
                onClick={handleCreate}
                className="w-full bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-bold hover:bg-[#85c95a] transition-colors mt-6"
              >
                Зберегти матч
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
