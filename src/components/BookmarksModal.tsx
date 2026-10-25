import React, { useState } from 'react';
import { Bookmark, ChevronRight, Copy, Heart, Quote, Trash2, X } from 'lucide-react';
import { QuranBookmark } from '../types';
import { HADITH_LIST } from '../data/hadiths';
import { PRAYERS_AND_DHIKR } from '../data/prayersAndDhikr';

interface BookmarksModalProps {
  quranBookmarks: QuranBookmark[];
  hadithBookmarks: string[];
  prayerBookmarks: string[];
  onSelectAyah: (surahNumber: number, ayahNumber: number) => void;
  onRemoveQuranBookmark: (id: string) => void;
  onRemoveHadithBookmark: (id: string) => void;
  onRemovePrayerBookmark: (id: string) => void;
  onClose: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  quranBookmarks,
  hadithBookmarks,
  prayerBookmarks,
  onSelectAyah,
  onRemoveQuranBookmark,
  onRemoveHadithBookmark,
  onRemovePrayerBookmark,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'quran' | 'hadith' | 'prayer'>('quran');

  const bookmarkedHadiths = HADITH_LIST.filter((h) => hadithBookmarks.includes(h.id));
  const bookmarkedPrayers = PRAYERS_AND_DHIKR.filter((p) => prayerBookmarks.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Penanda Bacaan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center border-b border-slate-100 px-4 pt-2 dark:border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('quran')}
            className={`border-b-2 pb-2 text-xs font-semibold transition-colors ${
              activeTab === 'quran'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Al-Qur'an ({quranBookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('hadith')}
            className={`border-b-2 pb-2 text-xs font-semibold transition-colors ${
              activeTab === 'hadith'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Hadis ({bookmarkedHadiths.length})
          </button>
          <button
            onClick={() => setActiveTab('prayer')}
            className={`border-b-2 pb-2 text-xs font-semibold transition-colors ${
              activeTab === 'prayer'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            Doa & Dzikir ({bookmarkedPrayers.length})
          </button>
        </div>

        {/* Bookmark Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'quran' && (
            <>
              {quranBookmarks.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  Belum ada ayat Al-Qur'an yang ditandai. Klik ikon bookmark pada ayat untuk menyimpannya di sini.
                </p>
              ) : (
                quranBookmarks.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        onSelectAyah(item.surahNumber, item.ayahNumber);
                        onClose();
                      }}
                    >
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        Surah {item.surahNameLatin} · Ayat {item.ayahNumber}
                      </p>
                      <p dir="rtl" className="mt-1 font-arabic text-sm text-slate-900 dark:text-white line-clamp-1">
                        {item.textArabic}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        "{item.translationId}"
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveQuranBookmark(item.id)}
                      className="ml-3 p-1 text-slate-400 hover:text-rose-600"
                      title="Hapus bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'hadith' && (
            <>
              {bookmarkedHadiths.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  Belum ada hadis yang ditandai. Klik ikon bookmark pada hadis untuk menyimpannya di sini.
                </p>
              ) : (
                bookmarkedHadiths.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.bookName} No. {item.hadithNumber}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        "{item.translationId}"
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveHadithBookmark(item.id)}
                      className="ml-3 p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'prayer' && (
            <>
              {bookmarkedPrayers.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  Belum ada doa yang ditandai. Klik ikon bookmark pada doa untuk menyimpannya di sini.
                </p>
              ) : (
                bookmarkedPrayers.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.category}
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        "{item.translationId}"
                      </p>
                    </div>
                    <button
                      onClick={() => onRemovePrayerBookmark(item.id)}
                      className="ml-3 p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
