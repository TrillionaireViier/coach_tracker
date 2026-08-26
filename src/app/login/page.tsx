"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !password.trim()) {
      showToast("Будь ласка, заповніть всі поля!");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // For now, any login works and we just redirect to the app
      localStorage.setItem("oso_auth", "true");
      showToast("Успішний вхід!");
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-oso-dark p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-oso-primary"></div>
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-oso-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-oso-primary/10 rounded-full blur-2xl"></div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-oso-primary/10 mb-4 relative z-10">
            <Shield size={32} className="text-oso-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white relative z-10 tracking-tight">Вхід в систему</h1>
          <p className="text-gray-400 mt-2 text-sm relative z-10 font-medium">Oso Football Lab (для тренерів та гравців)</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Нікнейм</label>
              <input
                type="text"
                placeholder="Введіть ваш нікнейм"
                value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-oso-grafete font-medium focus:outline-none focus:border-oso-primary focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Пароль</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-oso-grafete font-medium focus:outline-none focus:border-oso-primary focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-oso-primary text-oso-dark py-3.5 rounded-xl font-bold hover:bg-[#12d62e] transition-colors shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-oso-dark/30 border-t-oso-dark rounded-full animate-spin"></div>
                ) : (
                  <>
                    Увійти
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 font-medium">
              Немає акаунту? <a href="#" className="text-oso-grafete hover:text-oso-primary transition-colors font-bold border-b border-gray-300 hover:border-oso-primary pb-0.5">Зверніться до тренера</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
