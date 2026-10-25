import React, { useState, useMemo } from 'react';
import { BookMarked, Bookmark, ChevronRight, Filter, Play, Search } from 'lucide-react';
import { LastReadPosition, SurahMeta } from '../types';
import { SURAHS_METADATA } from '../data/surahs';

interface QuranViewProps {
  lastRead: LastReadPosition | null;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
  onOpenBookmarks: () => void;
}

export const QuranView: React.FC<QuranViewProps> = ({
  lastRead,
  onSelectSurah,
  onOpenBookmarks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Makkiyah' | 'Madaniyah'>('all');

  // Filter surahs
  const filteredSurahs = useMemo(() => {
    return SURAHS_METADATA.filter((surah) => {
      const matchSearch =
        surah.nameLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.translationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString() === searchQuery.trim();

      const matchType =
        filterType === 'all' ? true : surah.revelationType === filterType;

      return matchSearch && matchType;
    });
  }, [searchQuery, filterType]);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner & Header */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Al-Qur'anul Karim
            </h1>
            <p className="mt-1 text-xs text-emerald-200">
              114 Surah lengkap teks Arab, terjemahan Indonesia & audio murottal
            </p>
          </div>
          <button
            onClick={onOpenBookmarks}
            className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Bookmark</span>
          </button>
        </div>

        {/* Resume Last Read Card */}
        {lastRead && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-black/25 p-3.5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                <BookMarked className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="text-emerald-300/80">Terakhir Dibaca</p>
                <p className="font-semibold text-white">
                  Surah {lastRead.surahNameLatin} · Ayat {lastRead.ayahNumber}
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Lanjutkan
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama surah (contoh: Al-Baqarah, Yasin, 36)..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Semua (114)
          </button>
          <button
            onClick={() => setFilterType('Makkiyah')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filterType === 'Makkiyah'
                ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Makkiyah
          </button>
          <button
            onClick={() => setFilterType('Madaniyah')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              filterType === 'Madaniyah'
                ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Madaniyah
          </button>
        </div>
      </div>

      {/* Surah List */}
      <div className="space-y-2">
        {filteredSurahs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Surah "{searchQuery}" tidak ditemukan
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Periksa ejaan nama surah atau coba cari dengan nomor surah (1 - 114).
            </p>
          </div>
        ) : (
          filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => onSelectSurah(surah.number)}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-emerald-500 hover:shadow-xs active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600 dark:active:bg-slate-800/80"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectSurah(surah.number);
                }
              }}
            >
              <div className="flex items-center gap-3">
                {/* Surah Number Badge */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {surah.number}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {surah.nameLatin}
                    </h3>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      ({surah.translationId})
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>{surah.revelationType}</span>
                    <span>·</span>
                    <span>{surah.numberOfAyahs} Ayat</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-arabic text-lg font-bold text-emerald-800 dark:text-emerald-400 sm:text-xl">
                  {surah.nameArabic}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
