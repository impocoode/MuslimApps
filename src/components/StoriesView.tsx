import React, { useState, useMemo } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, HelpCircle, Layers, Lightbulb, ScrollText, Search, Share2 } from 'lucide-react';
import { StoryItem } from '../types';
import { ISLAMIC_STORIES, STORY_CATEGORIES } from '../data/prophetsAndFigures';

interface StoriesViewProps {
  initialStoryId?: string;
  bookmarks: string[]; // story IDs
  onToggleBookmark: (storyId: string) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  initialStoryId,
  bookmarks,
  onToggleBookmark,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(initialStoryId || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStories = useMemo(() => {
    return ISLAMIC_STORIES.filter((story) => {
      const matchSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'all' ? true : story.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const selectedStory = ISLAMIC_STORIES.find((s) => s.id === selectedStoryId);

  const shareStory = (story: StoryItem) => {
    const textToShare = `${story.title}\n\n${story.summary}\n(Muslim App - Kisah Islam & Sirah Nabawiyah)`;
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: textToShare,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* If a story is selected, show its full reading view */}
      {selectedStory ? (
        <article className="space-y-5">
          {/* Header Bar */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setSelectedStoryId(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Daftar Kisah</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => shareStory(selectedStory)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Bagikan</span>
              </button>
            </div>
          </div>

          {/* Story Hero */}
          <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-6 text-white dark:border-emerald-700/20">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
              <span>{selectedStory.categoryLabel}</span>
              {selectedStory.era && (
                <>
                  <span>·</span>
                  <span>{selectedStory.era}</span>
                </>
              )}
            </div>

            {selectedStory.arabicTitle && (
              <p dir="rtl" className="mt-3 font-arabic text-2xl font-bold text-amber-200">
                {selectedStory.arabicTitle}
              </p>
            )}

            <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {selectedStory.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed border-t border-white/10 pt-3">
              {selectedStory.summary}
            </p>
          </div>

          {/* Full Narrative Content */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Riwayat Perjalanan & Kisah Lengkap
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {selectedStory.content.map((paragraph, idx) => (
                <p key={idx} className="indent-4 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Lessons / Hikmah Section */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Pelajaran & Ibrah (Hikmah) yang Dapat Dipetik
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5">
              {selectedStory.lessons.map((lesson, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                    {idx + 1}
                  </span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Source References */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              Sumber Rujukan & Verifikasi Sejarah:
            </h3>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {selectedStory.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        </article>
      ) : (
        /* Stories Index / List View */
        <>
          {/* Header Banner */}
          <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Kisah Teladan & Sirah Islam
            </h1>
            <p className="mt-1 text-xs text-emerald-200">
              Perjalanan hidup Nabi Muhammad SAW secara kronologis, kisah para Nabi & Rasul, Khulafaur Rasyidin, dan Cendekiawan Muslim
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kisah Nabi, sahabat, atau tokoh (contoh: Sirah, Adam, Ibrahim, Umar)..."
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

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {STORY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Stories List */}
          <div className="space-y-3">
            {filteredStories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
                <ScrollText className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Tidak ada kisah yang ditemukan
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Coba cari dengan kata kunci lain atau pilih kategori "Semua Kisah".
                </p>
              </div>
            ) : (
              filteredStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setSelectedStoryId(story.id)}
                  className="group flex cursor-pointer items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-emerald-500 hover:shadow-xs active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600 dark:active:bg-slate-800/80"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedStoryId(story.id);
                    }
                  }}
                >
                  <div className="space-y-1.5 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {story.categoryLabel}
                      </span>
                      {story.era && (
                        <>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {story.era}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {story.summary}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
