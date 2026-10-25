import React from 'react';
import { BookOpen, Compass, Home, MoreHorizontal, Quote, ScrollText } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    {
      id: 'beranda' as NavTab,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'quran' as NavTab,
      label: 'Al-Qur\'an',
      icon: BookOpen,
    },
    {
      id: 'hadis' as NavTab,
      label: 'Hadis',
      icon: Quote,
    },
    {
      id: 'kisah' as NavTab,
      label: 'Kisah Islam',
      icon: ScrollText,
    },
    {
      id: 'lainnya' as NavTab,
      label: 'Lainnya',
      icon: MoreHorizontal,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95"
      role="navigation"
      aria-label="Navigasi Utama"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-center px-1 py-1.5 sm:max-w-xl">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group flex min-h-[50px] flex-col items-center justify-center rounded-xl px-1 py-1 transition-all ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-lg transition-transform ${
                  isActive
                    ? 'scale-105 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'group-hover:scale-105'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={isActive ? 2.3 : 1.8} />
              </div>
              <span className="mt-0.5 text-[10px] tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
