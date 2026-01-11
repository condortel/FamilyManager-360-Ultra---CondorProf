
import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'finance', label: 'Finanze', icon: '💰' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'assistant', label: 'CondorProf', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 md:relative md:w-64 md:border-t-0 md:border-r md:h-full z-50">
      <div className="flex justify-around md:flex-col md:justify-start md:space-y-4 md:pt-8">
        <div className="hidden md:block px-6 mb-8">
          <h1 className="text-xl font-bold text-slate-800">FamilyManager</h1>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">360 Ultra Edition</p>
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center md:flex-row md:items-center px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-lg md:mx-4'
                : 'text-slate-500 hover:bg-slate-100 md:mx-4'
            }`}
          >
            <span className="text-xl md:mr-3">{tab.icon}</span>
            <span className="text-xs md:text-sm font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
