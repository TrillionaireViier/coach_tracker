"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Users, Calendar, Activity, DollarSign, Settings, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Players', href: '/players', icon: Users },
  { name: 'Trainings', href: '/trainings', icon: Calendar },
  { name: 'Medical', href: '/medical', icon: Activity },
  { name: 'Finances', href: '/finances', icon: DollarSign },
];

export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/'; // Force a hard reload to trigger the AuthWrapper lock
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#9FE870]">Coach Tracker</h1>
      </div>
      
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Вийти</span>
        </button>
      </div>
    </div>
  );
}
