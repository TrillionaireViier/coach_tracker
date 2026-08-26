"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("oso_auth");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLoggedIn(true);
      localStorage.setItem("oso_auth", "true");
      setError("");
    } else {
      setError("Введіть логін та пароль");
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-oso-white flex items-center justify-center w-full" />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4 w-full">
        <div className="bg-white border border-gray-200 p-10 rounded-2xl w-full max-w-md shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-oso-primary/20 rounded-full text-oso-dark">
              {isRegistering ? <ShieldCheck size={36} /> : <Lock size={36} />}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-oso-grafete text-center mb-2 tracking-tight">
            {isRegistering ? "Реєстрація" : "Oso Football Lab"}
          </h1>
          <p className="text-gray-500 text-center mb-8 font-medium">
            {isRegistering ? "Створіть акаунт тренера" : "Увійдіть до системи управління командою"}
          </p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-oso-grafete mb-2">Логін або Email</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-oso-grafete focus:outline-none focus:border-oso-primary focus:ring-2 focus:ring-oso-primary/20 transition-all font-medium"
                placeholder="coach@osolab.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-oso-grafete mb-2">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-oso-grafete focus:outline-none focus:border-oso-primary focus:ring-2 focus:ring-oso-primary/20 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-oso-primary text-oso-dark py-3.5 rounded-xl font-bold hover:bg-[#12d62e] transition-colors mt-2 shadow-lg shadow-oso-primary/20 text-lg"
            >
              {isRegistering ? "Створити акаунт" : "Увійти"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)} 
              className="text-oso-accent hover:text-oso-dark font-semibold text-sm transition-colors"
            >
              {isRegistering ? "Вже є акаунт? Увійти" : "Немає акаунту? Створити"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
