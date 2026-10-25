import React, { useState, useMemo } from 'react';
import { Bookmark, Check, Copy, Filter, Quote, Search, Share2 } from 'lucide-react';
import { HadithItem } from '../types';
import { HADITH_BOOKS, HADITH_CATEGORIES, HADITH_LIST } from '../data/hadiths';

interface HadithViewProps {
  initialHadithId?: string;
  bookmarks: string[]; // hadith IDs
  onToggleBookmark: (hadithId: string) => void;
}

export const HadithView: React.FC<HadithViewProps> = ({
  initialHadithId,
  bookmarks,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHadiths = useMemo(() => {
    return HADITH_LIST.filter((item) => {
      const matchSearch =
        item.translationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hadithNumber.toString() === searchQuery.trim();

      const matchBook =
        selectedBook === 'all' ? true : item.bookId === selectedBook;

      const matchCategory =
        selectedCategory === 'Semua Kategori' ? true : item.category === selectedCategory;

      return matchSearch && matchBook && matchCategory;
    });
  }, [searchQuery, selectedBook, selectedCategory]);

  const copyHadith = async (item: HadithItem) => {
    const textToCopy = `${item.arabic}\n\n"${item.translationId}"\n(${item.bookName} No. ${item.hadithNumber} · Derajat: ${item.grade || 'Shahih'})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const shareHadith = async (item: HadithItem) => {
    const textToShare = `${item.arabic}\n\n"${item.translationId}"\n(${item.bookName} No. ${item.hadithNumber})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.bookName} No. ${item.hadithNumber}`,
          text: textToShare,
        });
      } catch {
        copyHadith(item);
      }
    } else {
      copyHadith(item);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Koleksi Hadis Shahih
        </h1>
        <p className="mt-1 text-xs text-emerald-200">
          Kumpulan hadis Nabi Muhammad SAW dari kitab-kitab muktamad (Shahih Bukhari, Muslim, Abu Dawud, At-Tirmidzi)
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kata kunci hadis (contoh: niat, akhlak, ilmu, sabar)..."
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

      {/* Book Filter Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {HADITH_BOOKS.map((book) => (
          <button
            key={book.id}
            onClick={() => setSelectedBook(book.id)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
              selectedBook === book.id
                ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {book.name}
          </button>
        ))}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {HADITH_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Hadith List */}
      <div className="space-y-4">
        {filteredHadiths.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
            <Quote className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Tidak ada hadis yang cocok dengan pencarian
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Coba gunakan kata kunci umum seperti 'iman', 'salat', atau 'sedekah'.
            </p>
          </div>
        ) : (
          filteredHadiths.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            const isCopied = copiedId === item.id;

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      {item.bookName}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      No. {item.hadithNumber}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      {item.category}
                    </span>
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
                      onClick={() => copyHadith(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Salin Hadis"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => shareHadith(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Bagikan Hadis"
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

                {/* Indonesian Translation */}
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  "{item.translationId}"
                </p>

                {/* Explanation */}
                {item.explanation && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Faedah Hadis: </span>
                    {item.explanation}
                  </div>
                )}

                {/* Footer Grade */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-slate-800">
                  <span>Derajat Riwayat: <strong className="text-slate-600 dark:text-slate-300">{item.grade || 'Shahih'}</strong></span>
                  <span>Terverifikasi Kitab Muktamad</span>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
