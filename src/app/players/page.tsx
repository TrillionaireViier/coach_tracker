"use client";

import { useState, useEffect } from "react";
import { Users, Search, Filter, Loader2, Edit2, Check, X } from "lucide-react";

type Player = { id: number; name: string; position: string; status: string; rpe: number };

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Player>>({});

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = () => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => {
        setPlayers(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setPlayers([]);
        setIsLoading(false);
      });
  };

  const handleEditClick = (player: Player) => {
    setEditingId(player.id);
    setEditForm(player);
  };

  const handleSave = async (id: number) => {
    await fetch('/api/players', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm })
    });
    setEditingId(null);
    fetchPlayers();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="p-8">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Гравці</h1>
          <p className="text-gray-400">Управління складом команди.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#9FE870] text-gray-950 px-6 py-3 rounded-xl font-medium hover:bg-[#85c95a] transition-colors">
            + Додати Гравця
          </button>
        </div>
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
                <th className="p-4 font-medium">Ім'я</th>
                <th className="p-4 font-medium">Позиція</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium">Готовність (RPE)</th>
                <th className="p-4 font-medium">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-[#9FE870]">
                      <Users size={18} />
                    </div>
                    {editingId === player.id ? (
                      <input 
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        value={editForm.name || ""} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <span className="text-white font-medium">{player.name}</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">
                    {editingId === player.id ? (
                      <input 
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm w-24"
                        value={editForm.position || ""} 
                        onChange={e => setEditForm({...editForm, position: e.target.value})}
                      />
                    ) : (
                      player.position
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === player.id ? (
                      <select 
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        value={editForm.status || "Готовий"}
                        onChange={e => setEditForm({...editForm, status: e.target.value})}
                      >
                        <option>Готовий</option>
                        <option>Травма</option>
                        <option>Відпочинок</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        player.status === 'Готовий' ? 'bg-green-500/10 text-green-400' :
                        player.status === 'Травма' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {player.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-white font-medium">
                    {editingId === player.id ? (
                      <input 
                        type="number"
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm w-16"
                        value={editForm.rpe || 0} 
                        onChange={e => setEditForm({...editForm, rpe: Number(e.target.value)})}
                      />
                    ) : (
                      player.rpe > 0 ? `${player.rpe} / 10` : '-'
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === player.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(player.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                          <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(player)} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors">
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
