import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { Rewards } from './components/Rewards';
import { Education } from './components/Education';
import { Marketplace } from './components/Marketplace';
import { GroupChat } from './components/GroupChat';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Bot, Trophy, BookOpen, MessageSquare, LogOut, Store } from 'lucide-react';

function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}

function Main() {
  const { user, currentPage, setCurrentPage, logout } = useApp();
  const { t } = useTranslation();

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'ai-assistant': return <AIAssistant />;
      case 'rewards': return <Rewards />;
      case 'education': return <Education />;
      case 'marketplace': return <Marketplace />;
      case 'group-chat': return <GroupChat />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-white">EcoSync</h2>
          </div>
          <LanguageSwitcher /> 
          <p className="text-sm text-gray-400 mt-3">{t('welcomeMessage', { name: user.name })}</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <ul className="space-y-2">
            <SidebarItem icon={<LayoutDashboard size={20} />} text={t('dashboard')} active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
            <SidebarItem icon={<Bot size={20} />} text={t('aiAssistant')} active={currentPage === 'ai-assistant'} onClick={() => setCurrentPage('ai-assistant')} />
            
            {/* --- THIS IS THE FIX --- */}
            {/* This code checks the user's role. If the role is 'citizen', it will show the 'Rewards' link. */}
            {/* If the role is 'worker' or 'government', this link will be hidden. */}
            {user.role === 'citizen' && (
              <SidebarItem icon={<Trophy size={20} />} text={t('rewards')} active={currentPage === 'rewards'} onClick={() => setCurrentPage('rewards')} />
            )}
            {/* ------------------------- */}

            <SidebarItem icon={<BookOpen size={20} />} text={t('education')} active={currentPage === 'education'} onClick={() => setCurrentPage('education')} />
            <SidebarItem icon={<Store size={20} />} text={t('marketplace')} active={currentPage === 'marketplace'} onClick={() => setCurrentPage('marketplace')} />
            
            {user.role !== 'citizen' && (
              <SidebarItem icon={<MessageSquare size={20} />} text={t('groupChat')} active={currentPage === 'group-chat'} onClick={() => setCurrentPage('group-chat')} />
            )}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <SidebarItem icon={<LogOut size={20} />} text={t('logout')} onClick={logout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

// SidebarItem helper component
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, text, active, onClick }: SidebarItemProps) {
  return (
    <li
      onClick={onClick}
      className={`
        flex items-center py-2 px-3 rounded-md cursor-pointer
        transition-colors group
        ${active
          ? 'bg-green-600 text-white'
          // eslint-disable-next-line @typescript-eslint/indent
          : 'hover:bg-gray-700 text-gray-300'
        }
      `}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </li>
  );
}

export default App;