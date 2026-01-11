
import React from 'react';
import { Transaction, CalendarEvent, FamilyMember } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FAMILY_PROFILES } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  events: CalendarEvent[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, events }) => {
  const totalBalance = transactions.reduce((acc, t) => 
    t.type === 'INCOME' ? acc + t.amount : acc - t.amount, 0
  );

  const upcomingEvents = events
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  const chartData = [
    { name: 'Gen', spesa: 1200, entrata: 2500 },
    { name: 'Feb', spesa: 1500, entrata: 2500 },
    { name: 'Mar', spesa: 1300, entrata: 2700 },
    { name: 'Apr', spesa: 1800, entrata: 2500 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Bentornati</h2>
          <p className="text-slate-500">CondorProf ha tutto sotto controllo oggi.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-right">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Patrimonio Familiare</p>
          <p className="text-2xl font-bold text-slate-900">€ {totalBalance.toLocaleString('it-IT')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Andamento Economico 2026</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEntrata" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="entrata" stroke="#22c55e" fillOpacity={1} fill="url(#colorEntrata)" strokeWidth={3} />
                <Area type="monotone" dataKey="spesa" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpesa)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Next Events */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Prossimi Impegni</h3>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="bg-slate-100 p-2 rounded-xl text-center min-w-[50px]">
                  <p className="text-xs font-bold text-slate-500 uppercase">{new Date(event.start).toLocaleDateString('it-IT', { month: 'short' })}</p>
                  <p className="text-lg font-bold text-slate-800">{new Date(event.start).getDate()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{event.title}</h4>
                  <div className="flex gap-1 mt-1">
                    {event.participants.map(p => (
                      <div 
                        key={p} 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: FAMILY_PROFILES[p].color }}
                        title={p}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(FAMILY_PROFILES).slice(0, 5).map(profile => (
          <div key={profile.id} className="bg-white p-4 rounded-2xl border-l-4 shadow-sm" style={{ borderLeftColor: profile.color }}>
            <p className="text-sm font-bold text-slate-800">{profile.name}</p>
            <p className="text-xs text-slate-500 line-clamp-1">{profile.profile}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
