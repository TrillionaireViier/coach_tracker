"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Play, FileText, Image as ImageIcon, Edit2, Trash2, X, Save } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function ExercisesPage() {
  const categories = ["Всі", "Тактика", "Фізика", "Техніка", "Стандарти", "Воротарі"];
  const [activeCategory, setActiveCategory] = useState("Всі");

  const defaultExercises = [
    { id: 1, title: "Квадрат 4х2 з переходом", category: "Техніка", duration: "15", description: "Гравці грають у квадрат 4х2, після 5 точних передач переводять м'яч в інший квадрат.", media: "video", videoUrl: "" },
    { id: 2, title: "Пресинг на чужій половині", category: "Тактика", duration: "25", description: "Відпрацювання високого пресингу при втраті м'яча.", media: "image", videoUrl: "" },
    { id: 3, title: "Інтервальний біг 15/15", category: "Фізика", duration: "12", description: "Біг на максимальній швидкості 15 сек, відпочинок 15 сек.", media: "doc", videoUrl: "" }
  ];

  const [exercises, setExercises] = useState<any[]>(defaultExercises);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "", category: "Техніка", duration: "15", description: "", media: "image", videoUrl: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("oso_exercises");
    if (saved) {
      try {
        setExercises(JSON.parse(saved));
      } catch(e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("oso_exercises", JSON.stringify(exercises));
    }
  }, [exercises, isLoaded]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ title: "", category: "Техніка", duration: "15", description: "", media: "image", videoUrl: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, ex: any) => {
    e.stopPropagation();
    setEditingId(ex.id);
    setFormData({ 
      title: ex.title, 
      category: ex.category, 
      duration: ex.duration, 
      description: ex.description || "", 
      media: ex.media || "image",
      videoUrl: ex.videoUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setExercises(exercises.filter(ex => ex.id !== id));
    showToast("Вправу видалено!");
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (editingId) {
      setExercises(exercises.map(ex => ex.id === editingId ? { ...formData, id: editingId } : ex));
      showToast("Вправу оновлено!");
    } else {
      setExercises([{ ...formData, id: Date.now() }, ...exercises]);
      showToast("Вправу додано!");
    }
    setIsModalOpen(false);
  };

  const filteredExercises = exercises.filter(ex => activeCategory === "Всі" || ex.category === activeCategory);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">База вправ</h1>
          <p className="text-gray-500 mt-1 font-medium">Бібліотека тренувань та матеріалів</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-oso-primary text-oso-dark px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#12d62e] transition-colors shadow-sm active:scale-95"
        >
          <Plus size={20} />
          Додати вправу
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-oso-dark text-white shadow-md' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8">
        {filteredExercises.map(ex => (
          <div 
            key={ex.id} 
            onClick={() => handleOpenEdit({ stopPropagation: () => {} } as any, ex)}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all hover:border-oso-primary/30 relative"
          >
            <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => handleDelete(e, ex.id)}
                className="bg-white/90 p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {/* Thumbnail Placeholder */}
            <div 
              className="h-40 bg-gray-100 relative flex items-center justify-center cursor-pointer group/video"
              onClick={(e) => {
                if (ex.videoUrl) {
                  e.stopPropagation();
                  window.open(ex.videoUrl, '_blank');
                }
              }}
            >
              {ex.videoUrl ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover/video:bg-black/20 transition-colors">
                  <Play size={40} className="text-oso-primary opacity-90 group-hover/video:scale-110 transition-transform drop-shadow-md" fill="currentColor" />
                </div>
              ) : (
                <>
                  {ex.media === 'video' && <Play size={32} className="text-gray-400 group-hover:text-oso-primary transition-colors" />}
                  {ex.media === 'image' && <ImageIcon size={32} className="text-gray-400 group-hover:text-oso-primary transition-colors" />}
                  {ex.media === 'doc' && <FileText size={32} className="text-gray-400 group-hover:text-oso-primary transition-colors" />}
                </>
              )}
              
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                {ex.duration} хв
              </div>
            </div>
            
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-oso-dark bg-oso-primary/20 px-2.5 py-1 rounded-md mb-2 inline-block">
                {ex.category}
              </span>
              <h3 className="font-bold text-oso-grafete text-lg leading-tight mt-1 group-hover:text-oso-primary transition-colors">
                {ex.title}
              </h3>
            </div>
          </div>
        ))}
        {filteredExercises.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-lg">Вправ не знайдено</p>
            <p className="text-sm font-medium mt-1">Змініть фільтр або додайте нову вправу</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-oso-grafete">{editingId ? "Редагувати вправу" : "Нова вправа"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Назва вправи</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  placeholder="Наприклад: Квадрат 4х2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Посилання на відео (YouTube / Drive)</label>
                <input 
                  type="url" 
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value, media: e.target.value ? "video" : formData.media})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Категорія</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm cursor-pointer"
                  >
                    {categories.filter(c => c !== "Всі").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Тривалість (хв)</label>
                  <input 
                    type="number" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Опис / Правила</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium shadow-sm resize-none"
                  placeholder="Опишіть правила вправи, розмір поля тощо..."
                />
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
                onClick={handleSave}
                disabled={!formData.title.trim()}
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
