
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AssistantChat from './components/AssistantChat';
import { Transaction, CalendarEvent, FamilyMember } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  
  // Mock Initial Data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2026-03-01',
      amount: 2500,
      category: 'Lavoro',
      payer: FamilyMember.PAPA,
      description: 'Stipendio base',
      type: 'INCOME'
    },
    {
      id: '2',
      date: '2026-03-05',
      amount: 450,
      category: 'Alimentari',
      payer: FamilyMember.MAMMA,
      description: 'Spesa settimanale Gourmet',
      type: 'EXPENSE'
    },
    {
      id: '3',
      date: '2026-03-10',
      amount: 120,
      category: 'Salute',
      payer: FamilyMember.NONNI,
      description: 'Visita oculistica',
      type: 'EXPENSE'
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: CATEGORIES.EXPENSE[0],
    payer: FamilyMember.PAPA
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'e1',
      title: 'Cena di Pasqua',
      start: '2026-04-05T20:00:00',
      end: '2026-04-05T23:00:00',
      participants: [FamilyMember.TUTTI, FamilyMember.NONNI]
    },
    {
      id: 'e2',
      title: 'Allenamento Calcio',
      start: '2026-03-25T17:00:00',
      end: '2026-03-25T19:00:00',
      participants: [FamilyMember.FIGLIO_GRANDE]
    }
  ]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      payer: newExpense.payer,
      description: newExpense.description,
      type: 'EXPENSE'
    };

    setTransactions([transaction, ...transactions]);
    setShowExpenseForm(false);
    setNewExpense({
      amount: '',
      description: '',
      category: CATEGORIES.EXPENSE[0],
      payer: FamilyMember.PAPA
    });
  };

  const contextData = {
    transactions,
    events,
    familyMembers: Object.keys(FamilyMember),
    currentDate: '2026-03-15'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} events={events} />;
      case 'finance':
        return (
          <div className="p-4 md:p-8 max-w-5xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Gestione Finanze</h2>
                <p className="text-slate-500">Monitoraggio entrate e uscite della famiglia.</p>
              </div>
              <button 
                onClick={() => setShowExpenseForm(true)}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span> Aggiungi Nuova Spesa
              </button>
            </div>

            {showExpenseForm && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-xl font-bold mb-6 text-slate-800">Registra Uscita</h3>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Importo (€)</label>
                      <input 
                        type="number" 
                        required
                        value={newExpense.amount}
                        onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-slate-200 outline-none"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrizione</label>
                      <input 
                        type="text" 
                        required
                        value={newExpense.description}
                        onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-slate-200 outline-none"
                        placeholder="es. Cena ristorante"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Categoria</label>
                        <select 
                          value={newExpense.category}
                          onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-slate-200 outline-none"
                        >
                          {CATEGORIES.EXPENSE.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Pagato da</label>
                        <select 
                          value={newExpense.payer}
                          onChange={e => setNewExpense({...newExpense, payer: e.target.value as FamilyMember})}
                          className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-slate-200 outline-none"
                        >
                          {Object.values(FamilyMember).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setShowExpenseForm(false)}
                        className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                      >
                        Annulla
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all"
                      >
                        Conferma
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {transactions.map(t => (
                <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === 'INCOME' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-400 font-medium">{t.payer} • {t.category} • {new Date(t.date).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>
                  <p className={`text-lg font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} € {t.amount.toLocaleString('it-IT')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Calendario 2026</h2>
            <div className="grid grid-cols-1 gap-4">
               {events.map(e => (
                 <div key={e.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase mb-1">{new Date(e.start).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <h3 className="text-xl font-bold text-slate-800">{e.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{new Date(e.start).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {e.participants.map(p => (
                        <div key={p} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold" title={p}>
                          {p.substring(0, 1)}
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'assistant':
        return <AssistantChat context={contextData} />;
      default:
        return <Dashboard transactions={transactions} events={events} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
