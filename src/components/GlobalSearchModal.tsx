import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, Heart, Quote, ScrollText, Search, X } from 'lucide-react';
import { SURAHS_METADATA } from '../data/surahs';
import { HADITH_LIST } from '../data/hadiths';
import { PRAYERS_AND_DHIKR } from '../data/prayersAndDhikr';
import { ISLAMIC_STORIES } from '../data/prophetsAndFigures';

interface GlobalSearchModalProps {
  onSelectSurah: (surahNumber: number) => void;
  onSelectHadith: (hadithId: string) => void;
  onSelectPrayer: () => void;
  onSelectStory: (storyId: string) => void;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  onSelectSurah,
  onSelectHadith,
  onSelectPrayer,
  onSelectStory,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { surahs: [], hadiths: [], prayers: [], stories: [] };
    }

    const surahs = SURAHS_METADATA.filter(
      (s) =>
        s.nameLatin.toLowerCase().includes(q) ||
        s.translationId.toLowerCase().includes(q) ||
        s.number.toString() === q
    ).slice(0, 5);

    const hadiths = HADITH_LIST.filter(
      (h) =>
        h.translationId.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.bookName.toLowerCase().includes(q)
    ).slice(0, 5);

    const prayers = PRAYERS_AND_DHIKR.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.translationId.toLowerCase().includes(q) ||
        p.latin.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 5);

    const stories = ISLAMIC_STORIES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q)
    ).slice(0, 5);

    return { surahs, hadiths, prayers, stories };
  }, [query]);

  const totalResults =
    results.surahs.length +
    results.hadiths.length +
    results.prayers.length +
    results.stories.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-100 p-4 dark:border-slate-800">
          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari Surah, Hadis, Doa, atau Kisah Nabi..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 text-sm text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!query.trim() ? (
            <div className="py-10 text-center text-xs text-slate-400">
              <Search className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">Pencarian Universal</p>
              <p className="mt-1">Ketik kata kunci untuk mencari di seluruh Al-Qur'an, Hadis, Doa, dan Kisah Islam.</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Tidak ada hasil untuk "{query}"
              </p>
              <p className="mt-1">Coba gunakan kata kunci yang lebih umum seperti 'Al-Fatihah', 'niat', 'sabar', atau 'ibrahim'.</p>
            </div>
          ) : (
            <>
              {/* Surahs */}
              {results.surahs.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Surah Al-Qur'an ({results.surahs.length})</span>
                  </h4>
                  <div className="mt-2 space-y-1.5">
                    {results.surahs.map((surah) => (
                      <div
                        key={surah.number}
                        onClick={() => {
                          onSelectSurah(surah.number);
                          onClose();
                        }}
                        className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 p-3 transition-colors hover:bg-emerald-50 dark:bg-slate-800/60 dark:hover:bg-emerald-950/40"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {surah.number}. {surah.nameLatin} ({surah.nameArabic})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            "{surah.translationId}" · {surah.numberOfAyahs} Ayat
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hadiths */}
              {results.hadiths.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <Quote className="h-3.5 w-3.5" />
                    <span>Koleksi Hadis ({results.hadiths.length})</span>
                  </h4>
                  <div className="mt-2 space-y-1.5">
                    {results.hadiths.map((hadith) => (
                      <div
                        key={hadith.id}
                        onClick={() => {
                          onSelectHadith(hadith.id);
                          onClose();
                        }}
                        className="cursor-pointer rounded-xl bg-slate-50 p-3 transition-colors hover:bg-amber-50/50 dark:bg-slate-800/60 dark:hover:bg-amber-950/30"
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {hadith.bookName} No. {hadith.hadithNumber} ({hadith.category})
                        </p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          "{hadith.translationId}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prayers */}
              {results.prayers.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    <Heart className="h-3.5 w-3.5" />
                    <span>Doa & Dzikir ({results.prayers.length})</span>
                  </h4>
                  <div className="mt-2 space-y-1.5">
                    {results.prayers.map((prayer) => (
                      <div
                        key={prayer.id}
                        onClick={() => {
                          onSelectPrayer();
                          onClose();
                        }}
                        className="cursor-pointer rounded-xl bg-slate-50 p-3 transition-colors hover:bg-rose-50/50 dark:bg-slate-800/60 dark:hover:bg-rose-950/30"
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {prayer.title} ({prayer.category})
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                          "{prayer.translationId}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories */}
              {results.stories.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                    <ScrollText className="h-3.5 w-3.5" />
                    <span>Kisah Islam & Sirah ({results.stories.length})</span>
                  </h4>
                  <div className="mt-2 space-y-1.5">
                    {results.stories.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => {
                          onSelectStory(story.id);
                          onClose();
                        }}
                        className="cursor-pointer rounded-xl bg-slate-50 p-3 transition-colors hover:bg-emerald-50/50 dark:bg-slate-800/60 dark:hover:bg-emerald-950/30"
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {story.title} ({story.categoryLabel})
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {story.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
