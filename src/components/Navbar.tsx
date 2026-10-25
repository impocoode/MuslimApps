import React from 'react';
import { Bookmark, Compass, MapPin, Moon, Search, Sun } from 'lucide-react';
import { AppSettings, CityLocation } from '../types';

interface NavbarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenCitySelector: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
  onOpenSearch,
  onOpenBookmarks,
  onOpenCitySelector,
  onGoHome,
}) => {
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={onGoHome}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
          aria-label="Kembali ke Beranda"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-emerald-600">
            {/* Islamic Crescent / Geometric Star Emblem SVG */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              Muslim App
            </span>
            <span className="hidden text-xs text-emerald-800 dark:text-emerald-400 sm:inline sm:ml-2">
              Aplikasi Islam Digital
            </span>
          </div>
        </button>

        {/* Location selector trigger */}
        <button
          onClick={onOpenCitySelector}
          className="flex min-h-[38px] max-w-[170px] items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400 sm:max-w-xs"
          title="Ubah lokasi kota untuk jadwal salat"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="truncate">{settings.selectedCity.name}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">({settings.selectedCity.timezoneLabel})</span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Cari Surah, Hadis, Doa, atau Kisah"
            title="Pencarian Global"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Lihat Penanda / Bookmark"
            title="Daftar Bookmark"
          >
            <Bookmark className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Ganti Mode Tampilan"
            title={settings.theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {settings.theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
