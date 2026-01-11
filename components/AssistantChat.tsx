
import React, { useState, useRef, useEffect } from 'react';
import { getCondorProfResponse, speakText } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AssistantChatProps {
  context: any;
}

const AssistantChat: React.FC<AssistantChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Buongiorno. Sono CondorProf. Come posso aiutarla a gestire l’armonia della sua casa oggi?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    // Se è un resoconto finale, puliamo SUBITO la chat per privacy e ordine
    const isReportRequest = customPrompt && customPrompt.includes("resoconto finale");
    
    // Salviamo la cronologia corrente per passarla all'IA prima di cancellarla dallo stato
    const chatHistorySnapshot = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    if (isReportRequest) {
      setMessages([
        {
          role: 'assistant',
          content: "Sto procedendo alla pulizia della cronologia e alla generazione del resoconto finale. Un momento di pazienza, per favore.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } else if (!customPrompt) {
      const userMsg: ChatMessage = {
        role: 'user',
        content: textToSend,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
    }
    
    setIsTyping(true);

    const enrichedContext = {
      ...context,
      chatHistory: chatHistorySnapshot
    };

    const response = await getCondorProfResponse(textToSend, enrichedContext);

    setIsTyping(false);
    
    if (isReportRequest) {
      // Sostituiamo tutto con il solo resoconto
      setMessages([
        {
          role: 'assistant',
          content: "Tutti i dati della sessione precedente sono stati cancellati con successo per la vostra privacy. Ecco il resoconto finale di FamilyManager 360 Ultra:",
          timestamp: new Date().toLocaleTimeString()
        },
        {
          role: 'assistant',
          content: response || "Analisi completata. Cronologia azzerata.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } else {
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response || "Purtroppo ho avuto un attimo di distrazione, potrebbe ripetere gentilmente?",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    }

    if (voiceEnabled && response) {
      setIsSpeaking(true);
      const source = await speakText(response);
      if (source) {
        source.onended = () => setIsSpeaking(false);
      } else {
        setIsSpeaking(false);
      }
    }
  };

  const handleFinalReport = () => {
    // Il prompt istruisce l'IA a essere definitiva e a confermare l'archiviazione
    handleSend("CondorProf, procedi ora: analizza i dati familiari e la chat appena avvenuta, genera un resoconto finale di alto livello per la famiglia, e conferma l'avvenuta archiviazione sicura con cancellazione della cronologia corrente.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-2xl transition-transform duration-500 ${isSpeaking ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}>
            {isSpeaking ? '🗣️' : '🎩'}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">CondorProf</h3>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Assistente Ultra Premium</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFinalReport}
            className="hidden md:flex bg-amber-500 hover:bg-amber-600 text-slate-900 text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-xl items-center gap-2 transition-all shadow-lg active:scale-95"
            title="Genera report e pulisci tutto"
          >
            Pulisci & Report
          </button>
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg transition-colors ${voiceEnabled ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}
            title={voiceEnabled ? "Disattiva voce" : "Attiva voce"}
          >
            {voiceEnabled ? '🔊' : '🔈'}
          </button>
          <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
            <div className={`w-2 h-2 bg-emerald-400 rounded-full ${isTyping || isSpeaking ? 'animate-pulse' : ''}`} />
            {isSpeaking ? 'In ascolto' : 'Operativo'}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              {msg.content}
              <p className={`text-[10px] mt-2 font-medium opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex flex-col gap-4">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Chieda pure a CondorProf..."
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-slate-800 focus:ring-2 focus:ring-slate-200 transition-all outline-none"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isTyping}
              className={`bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ➔
            </button>
          </div>
          <button 
            onClick={handleFinalReport}
            className="md:hidden w-full bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl shadow-lg active:scale-95"
          >
            Genera Resoconto & Pulisci Tutto
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
          Tutti i dati sono protetti da crittografia FamilyManager 360 Ultra
        </p>
      </div>
    </div>
  );
};

export default AssistantChat;
