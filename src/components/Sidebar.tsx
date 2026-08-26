"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Users, HeartPulse, LayoutList, Dumbbell, Folder, LineChart, MessageCircle, Settings, LogOut, ChevronDown, Plus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTeam } from '@/contexts/TeamContext';

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeTeam, setActiveTeam, teams, addTeam } = useTeam();

  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic navItems based on activeTeam
  const navItems = [
    { name: 'Календар', href: '/calendar', icon: Calendar },
    { name: 'Мікроцикл', href: `/microcycle/${encodeURIComponent(activeTeam)}`, icon: LayoutList },
    { name: 'Моя команда', href: '/team', icon: Users },
    { name: 'Оцінка самопочуття', href: '/wellbeing', icon: HeartPulse },
    { name: 'База вправ', href: '/exercises', icon: Dumbbell },
    { name: 'Документи', href: '/docs', icon: Folder },
    { name: 'Аналіз', href: '/analysis', icon: LineChart },
    { name: 'Загальний чат', href: '/chat', icon: MessageCircle },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTeamDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName);
    }
    setNewTeamName("");
    setIsAddingTeam(false);
    setIsTeamDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('oso_auth');
    window.location.href = '/login';
  };

  const handleTeamChange = (team: string) => {
    setActiveTeam(team);
    setIsTeamDropdownOpen(false);
    if (pathname.startsWith('/microcycle')) {
      router.push(`/microcycle/${encodeURIComponent(team)}`);
    }
  };

  return (
    <div className="w-64 bg-oso-dark border-r border-gray-800 h-screen flex flex-col hidden md:flex z-40">
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-oso-primary tracking-tight">Oso Football Lab</h1>
        
        {/* Team Switcher */}
        <div className="mt-6 relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between transition-colors"
          >
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Команда</span>
              <span className="text-white font-bold text-sm truncate max-w-[120px]">{activeTeam}</span>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isTeamDropdownOpen && (
            <div className="absolute top-[110%] left-0 w-full bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-[100] flex flex-col py-1 overflow-hidden">
              <div className="max-h-48 overflow-y-auto">
                {teams.map((team, idx) => (
                  <button
                    key={team}
                    onClick={() => handleTeamChange(team)}
                    className={`w-full block text-left px-4 py-3 text-sm font-bold hover:bg-gray-800 transition-colors ${
                      activeTeam === team ? 'text-oso-primary bg-gray-800/50' : 'text-gray-300'
                    } ${idx !== teams.length - 1 ? 'border-b border-gray-800/50' : ''}`}
                  >
                    {team}
                  </button>
                ))}
              </div>
              
              <div className="border-t border-gray-700 p-2 bg-[#1a1a1a]">
                {isAddingTeam ? (
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                      placeholder="Назва команди"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-oso-primary"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button onClick={handleAddTeam} className="flex-1 bg-oso-primary text-oso-dark text-xs font-bold py-2 rounded-lg">Створити</button>
                      <button onClick={() => setIsAddingTeam(false)} className="px-3 bg-gray-800 text-gray-400 rounded-lg hover:text-white"><X size={14} /></button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingTeam(true)}
                    className="w-full flex items-center gap-2 justify-center py-2 text-sm text-oso-primary font-bold hover:bg-oso-primary/10 rounded-lg transition-colors"
                  >
                    <Plus size={16} /> Додати команду
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith('/microcycle') && item.href.startsWith('/microcycle') ? true : pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-oso-primary text-oso-dark font-semibold' 
                  : 'text-gray-300 hover:text-oso-white hover:bg-white/10 font-medium'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-oso-dark' : 'text-oso-accent'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2 mt-auto">
        <Link 
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            pathname === '/settings'
              ? 'bg-oso-primary text-oso-dark font-semibold'
              : 'text-gray-300 hover:text-oso-white hover:bg-white/10 font-medium'
          }`}
        >
          <Settings size={20} className={pathname === '/settings' ? 'text-oso-dark' : 'text-gray-400'} />
          <span>Налаштування</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Вийти</span>
        </button>
      </div>
    </div>
  );
}
