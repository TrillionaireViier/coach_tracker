"use client";

import { useState } from "react";
import { Send, Paperclip, Smile, MoreVertical } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Гравець 1", text: "Тренере, яку форму завтра одягаємо на гру?", time: "10:30", isMe: false },
    { id: 2, sender: "Я", text: "Граємо в зеленій. Збір о 09:30, не запізнюватись!", time: "10:42", isMe: true }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "Я",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden m-4 rounded-2xl border border-gray-200 shadow-sm">
      {/* Sidebar - Chat List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-gray-100 bg-white">
          <input 
            type="text" 
            placeholder="Пошук..." 
            className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oso-primary/30 font-medium"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex items-center gap-3 cursor-pointer bg-oso-primary/5 hover:bg-oso-primary/10 transition-colors border-l-4 border-oso-primary">
            <div className="w-12 h-12 rounded-full bg-oso-dark flex items-center justify-center text-white font-bold text-lg">U19</div>
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-oso-grafete truncate">Командний чат U-19</h3>
                <span className="text-xs text-gray-400 font-medium">{messages[messages.length-1].time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate font-medium">{messages[messages.length-1].text}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-100 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-oso-dark flex items-center justify-center text-white font-bold">U19</div>
            <div>
              <h2 className="font-bold text-oso-grafete leading-tight">Командний чат U-19</h2>
              <p className="text-xs text-oso-primary font-bold">24 учасники</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-oso-grafete"><MoreVertical size={20} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/50">
          <div className="space-y-6 flex flex-col">
            <div className="flex justify-center">
              <span className="bg-gray-200/50 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">Сьогодні</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : ''}`}>
                {!msg.isMe && <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />}
                
                <div className={`p-3 max-w-md shadow-sm ${
                  msg.isMe 
                    ? 'bg-oso-primary text-oso-dark rounded-2xl rounded-br-none shadow-oso-primary/10' 
                    : 'bg-white border border-gray-200 rounded-2xl rounded-bl-none'
                }`}>
                  {!msg.isMe && <p className="text-xs font-bold text-oso-accent mb-1">{msg.sender}</p>}
                  <p className={`text-sm font-medium ${msg.isMe ? 'font-bold' : 'text-oso-grafete'}`}>{msg.text}</p>
                  <div className={`text-[10px] mt-1 font-bold ${msg.isMe ? 'text-oso-dark/60 text-right' : 'text-gray-400 text-right'}`}>
                    {msg.time} {msg.isMe && '✓✓'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
          <button className="text-gray-400 hover:text-oso-dark transition-colors p-2"><Paperclip size={20} /></button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Написати повідомлення..." 
              className="w-full bg-gray-100 border-none rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-oso-primary/30 font-medium text-oso-grafete"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-oso-dark transition-colors">
              <Smile size={20} />
            </button>
          </div>
          <button 
            onClick={handleSend}
            className="bg-oso-primary text-oso-dark w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#12d62e] transition-colors shadow-sm active:scale-95"
          >
            <Send size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
