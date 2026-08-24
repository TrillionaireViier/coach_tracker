"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("coach_auth");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      localStorage.setItem("coach_auth", "true");
      setError("");
    } else {
      setError("Невірне ім'я користувача або пароль");
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center w-full" />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 w-full">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#9FE870]/10 rounded-full text-[#9FE870]">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Вхід для Тренера</h1>
          <p className="text-gray-400 text-center mb-8">Введіть свої дані для доступу до панелі управління</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ім'я користувача</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FE870] transition-colors"
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-[#9FE870] text-gray-950 py-3 rounded-xl font-bold hover:bg-[#85c95a] transition-colors mt-4"
            >
              Увійти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
