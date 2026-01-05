import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, BookOpen, ShoppingCart, Award, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { user, logout } = useApp();
  const { t } = useTranslation();

  const commonLinks = [
    { to: '/dashboard', text: t('dashboard'), icon: LayoutDashboard },
    { to: '/assistant', text: t('aiAssistant'), icon: MessageSquare },
    { to: '/education', text: t('educationHub'), icon: BookOpen },
    { to: '/marketplace', text: t('marketplace'), icon: ShoppingCart },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-green-600">EcoSync</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {commonLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            // --- FIX 1: Added the type here ---
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.text}</span>
          </NavLink>
        ))}

        {user?.role === 'citizen' && (
          <NavLink
            to="/rewards"
            // --- FIX 2: Added the type here ---
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Award className="h-5 w-5" />
            <span>{t('rewards')}</span>
          </NavLink>
        )}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-8 w-8 text-gray-500 bg-gray-200 rounded-full p-1" />
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}