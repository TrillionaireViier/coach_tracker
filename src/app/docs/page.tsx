"use client";

import { useState, useRef, useEffect } from "react";
import { FolderPlus, FilePlus, FileText, Image as ImageIcon, Search, Folder, FolderOpen, X, ChevronRight, ChevronDown, Download } from "lucide-react";
import { showToast } from "@/components/Toast";

import React from "react";
export default function DocsPage() {
  const defaultDocuments = [
    { 
      id: 10, name: "Документи гравців", size: "--", date: "Вчора", type: "folder", 
      children: [
        { id: 1, name: "Медичні довідки 2026.pdf", size: "2.4 MB", date: "Сьогодні", type: "pdf" }
      ] 
    },
    { id: 2, name: "Тактична схема (Кутовий).png", size: "840 KB", date: "Вчора", type: "img" },
    { id: 3, name: "Правила команди.docx", size: "1.2 MB", date: "12 Серп", type: "doc" },
  ];

  const [documents, setDocuments] = useState<any[]>(defaultDocuments);
  const [isLoaded, setIsLoaded] = useState(false);

  const [openFolders, setOpenFolders] = useState<number[]>([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadTargetFolderId, setUploadTargetFolderId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("oso_docs");
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch(e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("oso_docs", JSON.stringify(documents));
    }
  }, [documents, isLoaded]);

  const toggleFolder = (id: number) => {
    setOpenFolders(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: Date.now(),
      name: newFolderName,
      size: "--",
      date: "Щойно",
      type: "folder",
      children: []
    };
    setDocuments([newFolder, ...documents]);
    setIsFolderModalOpen(false);
    setNewFolderName("");
    showToast(`Папку "${newFolder.name}" створено!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Determine type by extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    let type = "doc";
    if (ext === "pdf") type = "pdf";
    if (["png", "jpg", "jpeg", "svg", "webp"].includes(ext || "")) type = "img";

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    
    // Read file to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${sizeInMB} MB`,
        date: "Щойно",
        type: type,
        contentUrl: base64Data // Store actual file data!
      };
      
      try {
        let updatedDocs;
        if (uploadTargetFolderId !== null) {
          updatedDocs = documents.map(doc => {
            if (doc.id === uploadTargetFolderId) {
              return { ...doc, children: [newFile, ...(doc.children || [])] };
            }
            return doc;
          });
          if (!openFolders.includes(uploadTargetFolderId)) {
            setOpenFolders(prev => [...prev, uploadTargetFolderId]);
          }
        } else {
          updatedDocs = [newFile, ...documents];
        }
        
        setDocuments(updatedDocs);
        localStorage.setItem("oso_docs", JSON.stringify(updatedDocs));
        showToast(`Файл "${file.name}" завантажено!`);
      } catch (err) {
        showToast(`Помилка: Файл занадто великий для локальної пам'яті.`);
      }
    };
    
    reader.onerror = () => showToast("Помилка читання файлу");
    reader.readAsDataURL(file); // Convert to base64
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadTargetFolderId(null);
  };

  const handleDownload = (e: React.MouseEvent, doc: any) => {
    e.stopPropagation();
    
    if (doc.contentUrl) {
      showToast(`Завантаження "${doc.name}" розпочато...`);
      // Use fetch to convert base64 to blob for stable download
      fetch(doc.contentUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 100);
        })
        .catch(() => {
          // Fallback if fetch fails
          const a = document.createElement('a');
          a.href = doc.contentUrl;
          a.download = doc.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    } else {
      // It's a dummy file
      showToast(`Завантаження "${doc.name}" розпочато...`);
      const content = `Це вміст файлу: ${doc.name}\nЗавантажено з Oso Football Lab.`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRowClick = (doc: any) => {
    if (doc.type === 'folder') {
      toggleFolder(doc.id);
    } else if (doc.type === 'img' && doc.contentUrl) {
      // Show preview for images in a new tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${doc.contentUrl}" style="max-width: 100%; height: auto;" />`);
      }
    } else if (doc.contentUrl) {
       // Download automatically if not image
       handleDownload({ stopPropagation: () => {} } as any, doc);
    }
  };

  const renderFileRow = (doc: any, isChild = false) => {
    const isFolder = doc.type === 'folder';
    const isOpen = openFolders.includes(doc.id);
    
    return (
      <tr 
        key={doc.id} 
        onClick={() => handleRowClick(doc)}
        className={`hover:bg-gray-50/50 transition-colors group cursor-pointer`}
      >
        <td className={`py-4 flex items-center gap-3 ${isChild ? 'pl-10' : ''}`}>
          {isFolder && (
            <div className="text-gray-400">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
          <div className={`p-2 rounded-lg ${
            isFolder ? 'bg-yellow-50 text-yellow-500' :
            doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 
            doc.type === 'img' ? 'bg-blue-50 text-blue-500' : 
            'bg-blue-50 text-blue-600'
          }`}>
            {isFolder ? (isOpen ? <FolderOpen size={20} /> : <Folder size={20} />) :
             doc.type === 'img' ? <ImageIcon size={20} /> : 
             <FileText size={20} />}
          </div>
          <span className="font-bold text-oso-grafete group-hover:text-oso-primary transition-colors">{doc.name}</span>
        </td>
        <td className="py-4 text-sm text-gray-500 font-medium">{doc.size}</td>
        <td className="py-4 text-sm text-gray-500 font-medium flex items-center justify-between pr-4">
          <span>{doc.date}</span>
          {!isFolder && (
            <button 
              onClick={(e) => handleDownload(e, doc)}
              className="text-gray-400 hover:text-oso-primary opacity-0 group-hover:opacity-100 transition-all bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 hover:border-oso-primary/30"
              title="Скачати"
            >
              <Download size={16} />
            </button>
          )}
          {isFolder && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setUploadTargetFolderId(doc.id);
                fileInputRef.current?.click();
              }}
              className="text-gray-400 hover:text-oso-primary opacity-0 group-hover:opacity-100 transition-all bg-white p-1.5 rounded-lg shadow-sm border border-gray-100 hover:border-oso-primary/30"
              title="Додати файл у папку"
            >
              <FilePlus size={16} />
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-oso-grafete tracking-tight">Документи</h1>
          <p className="text-gray-500 mt-1 font-medium">Сховище файлів команди</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsFolderModalOpen(true)}
            className="bg-white border border-gray-200 text-oso-grafete px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
          >
            <FolderPlus size={20} />
            Нова папка
          </button>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => {
              setUploadTargetFolderId(null);
              fileInputRef.current?.click();
            }}
            className="bg-oso-primary text-oso-dark px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#12d62e] transition-colors shadow-sm active:scale-95"
          >
            <FilePlus size={20} />
            Завантажити
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 flex flex-col p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Пошук файлів..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-oso-primary transition-colors font-medium"
          />
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Назва</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Розмір</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase">Дата змінення</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {documents.map((doc) => (
                <React.Fragment key={doc.id}>
                  {renderFileRow(doc, false)}
                  {doc.type === 'folder' && openFolders.includes(doc.id) && doc.children?.map((child: any) => (
                    renderFileRow(child, true)
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Folder Creation Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-oso-grafete">Створити папку</h2>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-gray-400 hover:text-oso-grafete">
                <X size={20} />
              </button>
            </div>
            <input 
              type="text" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
              placeholder="Назва папки"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oso-primary mb-4 font-medium"
              autoFocus
            />
            <button 
              onClick={handleAddFolder}
              className="w-full bg-oso-primary text-oso-dark py-3 rounded-xl font-bold hover:bg-[#12d62e] transition-colors shadow-sm"
            >
              Створити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
