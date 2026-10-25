import React, { useState, useMemo } from 'react';
import { Bookmark, Check, Copy, Heart, RotateCcw, Search, Share2, Volume2 } from 'lucide-react';
import { PrayerDhikrItem } from '../types';
import { PRAYER_CATEGORIES, PRAYERS_AND_DHIKR } from '../data/prayersAndDhikr';
import { soundService } from '../utils/audio';

interface PrayersAndDhikrViewProps {
  bookmarks: string[]; // doa IDs
  onToggleBookmark: (doaId: string) => void;
}

export const PrayersAndDhikrView: React.FC<PrayersAndDhikrViewProps> = ({
  bookmarks,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Doa');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [counters, setCounters] = useState<Record<string, number>>({});

  const filteredItems = useMemo(() => {
    return PRAYERS_AND_DHIKR.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'Semua Doa' ? true : item.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleIncrementCounter = (id: string, target?: number) => {
    soundService.playTasbihClick();
    soundService.vibrate(20);
    setCounters((prev) => {
      const current = prev[id] || 0;
      const next = current + 1;
      if (target && next === target) {
        soundService.playTargetChime();
      }
      return { ...prev, [id]: next };
    });
  };

  const handleResetCounter = (id: string) => {
    setCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  const copyDoa = async (item: PrayerDhikrItem) => {
    const textToCopy = `${item.title}\n\n${item.arabic}\n\n${item.latin}\n\n"${item.translationId}"\n(Sumber: ${item.source})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const shareDoa = (item: PrayerDhikrItem) => {
    const textToShare = `${item.title}\n\n${item.arabic}\n\n"${item.translationId}"\n(${item.source})`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: textToShare,
      }).catch(() => {});
    } else {
      copyDoa(item);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Kumpulan Doa & Dzikir Harian
        </h1>
        <p className="mt-1 text-xs text-emerald-200">
          Doa sehari-hari, dzikir pagi & petang (Al-Matsurat), Sayyidul Istighfar, dan selawat bersumber Al-Qur'an dan As-Sunnah
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari doa (contoh: bangun tidur, makan, orang tua, istighfar)..."
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

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {PRAYER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
            <Heart className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Doa tidak ditemukan
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Coba cari dengan kata kunci lain seperti 'makan', 'keluar', atau 'sakit'.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            const isCopied = copiedId === item.id;
            const currentCount = counters[item.id] || 0;
            const targetCount = item.repeatCount || 1;

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {item.category}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-amber-500'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                      title={isBookmarked ? 'Hapus Bookmark' : 'Tandai Bookmark'}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => copyDoa(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Salin Doa"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => shareDoa(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Bagikan Doa"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="my-4 text-right">
                  <p
                    dir="rtl"
                    className="font-arabic text-xl sm:text-2xl font-bold leading-loose text-slate-900 dark:text-slate-50"
                  >
                    {item.arabic}
                  </p>
                </div>

                {/* Latin Transliteration */}
                <p className="text-xs italic text-slate-500 dark:text-slate-400">
                  {item.latin}
                </p>

                {/* Indonesian Translation */}
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  "{item.translationId}"
                </p>

                {/* Source & Benefits */}
                <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <p><strong className="text-slate-700 dark:text-slate-200">Sumber:</strong> {item.source}</p>
                  {item.benefits && (
                    <p className="mt-1 text-emerald-800 dark:text-emerald-400">{item.benefits}</p>
                  )}
                </div>

                {/* Interactive Counter Row */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Target Bacaan: <span className="font-semibold text-slate-800 dark:text-slate-200">{targetCount}x</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentCount > 0 && (
                      <button
                        onClick={() => handleResetCounter(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Reset Hitungan"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleIncrementCounter(item.id, targetCount)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                        currentCount >= targetCount
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      <span>Hitung ({currentCount}/{targetCount})</span>
                      {currentCount >= targetCount && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
