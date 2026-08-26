"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function Toast() {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShowToast = (e: any) => {
      setMessage(e.detail);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };

    window.addEventListener("show-toast", handleShowToast);
    return () => window.removeEventListener("show-toast", handleShowToast);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-oso-dark text-white px-6 py-4 rounded-2xl shadow-2xl border border-oso-primary/30 flex items-center gap-3">
        <CheckCircle2 className="text-oso-primary" size={24} />
        <span className="font-bold text-sm">{message}</span>
      </div>
    </div>
  );
}

export const showToast = (message: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: message }));
  }
};
