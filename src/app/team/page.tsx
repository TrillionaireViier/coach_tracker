"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, Search, List, LayoutGrid, MoreVertical, Shield, X, Save, Edit2, Trash2 } from "lucide-react";
import { useTeam } from "@/contexts/TeamContext";

export default function TeamPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { activeTeam } = useTeam();

  // Create a mapping of teams to players
  const allPlayers: Record<string, any[]> = {
    "U-19": [
      { id: 1, name: "Олександр Зінченко", number: 17, position: "ПЗ", age: 19, height: 175, weight: 64, matches: 34, rating: 8.4 },
      { id: 2, name: "Михайло Мудрик", number: 10, position: "НП", age: 19, height: 175, weight: 61, matches: 28, rating: 7.9 },
    ],
    "U-17": [
      { id: 3, name: "Ілля Забарний", number: 13, position: "ЗХ", age: 17, height: 189, weight: 81, matches: 42, rating: 8.1 },
    ],
    "Перша команда": [
      { id: 4, name: "Артем Довбик", number: 9, position: "НП", age: 26, height: 189, weight: 76, matches: 38, rating: 8.7 },
      { id: 5, name: "Андрій Ярмоленко", number: 7, position: "ПЗ", age: 34, height: 189, weight: 81, matches: 120, rating: 8.5 },
    ]
  };

  const [players, setPlayers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    nickname: "",
    position: "ПЗ",
    accessRole: "Гравець",
    password: "",
    number: "",
    age: "",
    height: "",
    weight: ""
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("oso_players");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Object.keys(parsed).length > 0) {
          // Merge with defaults if needed or just use saved
          setPlayers(parsed[activeTeam] || []);
        } else {
          setPlayers(allPlayers[activeTeam] || []);
        }
      } catch (e) {
        setPlayers(allPlayers[activeTeam] || []);
      }
    } else {
      setPlayers(allPlayers[activeTeam] || []);
    }
    setIsLoaded(true);
  }, [activeTeam]);

  // Save to localStorage when players change
  useEffect(() => {
    if (isLoaded) {
      const saved = localStorage.getItem("oso_players");
      let allTeamsPlayers = { ...allPlayers };
      if (saved) {
        try {
          allTeamsPlayers = JSON.parse(saved);
        } catch (e) {}
      }
      allTeamsPlayers[activeTeam] = players;
      localStorage.setItem("oso_players", JSON.stringify(allTeamsPlayers));
    }
  }, [players, activeTeam, isLoaded]);

  const handleSavePlayer = () => {
    if (!newPlayer.name.trim()) return;
    
    const playerData = {
      id: editingPlayerId || Date.now(),
      name: newPlayer.name,
      nickname: newPlayer.nickname,
      number: newPlayer.number || Math.floor(Math.random() * 99) + 1,
      position: newPlayer.position,
      accessRole: newPlayer.accessRole,
      password: newPlayer.password,
      age: newPlayer.age || 18,
      height: newPlayer.height || 180,
      weight: newPlayer.weight || 70,
      matches: editingPlayerId ? (players.find(p => p.id === editingPlayerId)?.matches || 0) : 0,
      rating: editingPlayerId ? (players.find(p => p.id === editingPlayerId)?.rating || 5.0) : 5.0
    };
    
    if (editingPlayerId) {
      setPlayers(players.map(p => p.id === editingPlayerId ? playerData : p));
    } else {
      setPlayers([...players, playerData]);
    }
    
    setIsModalOpen(false);
    setEditingPlayerId(null);
    setNewPlayer({
      name: "", nickname: "", position: "ПЗ", accessRole: "Гравець", password: "", number: "", age: "", height: "", weight: ""
    });
  };

  const handleEditPlayer = (player: any) => {
    setEditingPlayerId(player.id);
    setNewPlayer({
      name: player.name,
      nickname: player.nickname || "",
      position: player.position,
      accessRole: player.accessRole || "Гравець",
      password: player.password || "",
      number: player.number,
      age: player.age,
      height: player.height,
      weight: player.weight
    });
    setActiveDropdown(null);
    setIsModalOpen(true);
  };

  const handleDeletePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
    setActiveDropdown(null);
  };

  const openAddModal = () => {
    setEditingPlayerId(null);
    setNewPlayer({
      name: "", nickname: "", position: "ПЗ", accessRole: "Гравець", password: "", number: "", age: "", height: "", weight: ""
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">Моя команда</h1>
          <p className="text-gray-500 mt-1 font-medium">Керування складом: <span className="font-bold text-oso-primary">{activeTeam}</span></p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-oso-primary text-oso-dark px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#12d62e] transition-colors shadow-sm active:scale-95"
        >
          <UserPlus size={20} />
          Додати гравця
        </button>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Пошук гравця..." 
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
          />
        </div>
        
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100 text-oso-dark" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100 text-oso-dark" : "text-gray-400 hover:text-gray-600"}`}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* Players List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          {players.length === 0 ? (
             <div className="h-full flex items-center justify-center text-gray-400 font-medium">Немає гравців у цій команді. Додайте нового!</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Гравець</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Позиція</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Вік</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Зріст/Вага</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-oso-grafete border border-gray-200">
                          {player.number}
                        </div>
                        <div>
                          <span className="font-bold text-oso-grafete group-hover:text-oso-primary transition-colors block">{player.name}</span>
                          {player.nickname && <span className="text-[10px] text-gray-400 font-bold uppercase">@{player.nickname}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold w-fit">{player.position}</span>
                        {player.accessRole && <span className="text-[10px] text-oso-primary font-bold uppercase">{player.accessRole}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{player.age}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{player.height} см / {player.weight} кг</td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === player.id ? null : player.id)}
                        className="text-gray-400 hover:text-oso-dark transition-colors p-2 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {activeDropdown === player.id && (
                        <div ref={dropdownRef} className="absolute right-8 top-10 bg-white border border-gray-200 shadow-xl rounded-xl w-40 z-50 flex flex-col overflow-hidden py-1">
                          <button 
                            onClick={() => handleEditPlayer(player)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                          >
                            <Edit2 size={16} className="text-gray-400" /> Редагувати
                          </button>
                          <button 
                            onClick={() => handleDeletePlayer(player.id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <Trash2 size={16} className="text-red-400" /> Видалити
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Add Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-oso-grafete">{editingPlayerId ? "Редагувати гравця" : "Додати нового гравця"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ім'я та Прізвище</label>
                  <input 
                    type="text" 
                    placeholder="Наприклад: Артем Довбик"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Нікнейм</label>
                  <input 
                    type="text" 
                    placeholder="Наприклад: dovbyk9"
                    value={newPlayer.nickname}
                    onChange={(e) => setNewPlayer({...newPlayer, nickname: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Пароль (Для входу)</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={newPlayer.password}
                    onChange={(e) => setNewPlayer({...newPlayer, password: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Роль на полі</label>
                  <select 
                    value={newPlayer.position}
                    onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm cursor-pointer"
                  >
                    <option value="ВР">ВР (Воротар)</option>
                    <option value="ЗХ">ЗХ (Захисник)</option>
                    <option value="ПЗ">ПЗ (Півзахисник)</option>
                    <option value="НП">НП (Нападник)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Рівень Доступу</label>
                  <select 
                    value={newPlayer.accessRole}
                    onChange={(e) => setNewPlayer({...newPlayer, accessRole: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm cursor-pointer"
                  >
                    <option value="Гравець">Гравець</option>
                    <option value="Тренер">Тренер</option>
                    <option value="Адмін">Адмін</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Номер</label>
                  <input 
                    type="number" 
                    placeholder="Наприклад: 10"
                    value={newPlayer.number}
                    onChange={(e) => setNewPlayer({...newPlayer, number: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  />
                </div>
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
                onClick={handleSavePlayer}
                disabled={!newPlayer.name.trim()}
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
