import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  BookMarked,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Info,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Sliders,
  Volume2,
} from 'lucide-react';
import {
  AppSettings,
  Ayah,
  LastReadPosition,
  QuranBookmark,
  SurahMeta,
} from '../types';
import { fetchSurahVerses, SURAHS_METADATA } from '../data/surahs';
import { getAyahAudioUrl, QARI_OPTIONS, soundService } from '../utils/audio';

interface SurahDetailViewProps {
  surahNumber: number;
  initialAyahNumber?: number;
  settings: AppSettings;
  bookmarks: QuranBookmark[];
  onToggleBookmark: (bookmark: Omit<QuranBookmark, 'id' | 'timestamp'>) => void;
  onSetLastRead: (pos: LastReadPosition) => void;
  onBack: () => void;
  onSelectOtherSurah: (num: number) => void;
}

export const SurahDetailView: React.FC<SurahDetailViewProps> = ({
  surahNumber,
  initialAyahNumber,
  settings,
  bookmarks,
  onToggleBookmark,
  onSetLastRead,
  onBack,
  onSelectOtherSurah,
}) => {
  const surahMeta = SURAHS_METADATA.find((s) => s.number === surahNumber) || SURAHS_METADATA[0];

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [tafsirShort, setTafsirShort] = useState<string | undefined>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio state
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
  const [selectedQari, setSelectedQari] = useState<string>('alafasy');
  const [isAutoPlayNext, setIsAutoPlayNext] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Font size state
  const [arabicSize, setArabicSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(settings.arabicFontSize || 'md');
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);

  // Load verses
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentPlayingAyah(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    fetchSurahVerses(surahNumber)
      .then((data) => {
        if (!isMounted) return;
        setAyahs(data.ayahs);
        setTafsirShort(data.tafsirShort);
        setIsLoading(false);

        // Record as last read
        onSetLastRead({
          surahNumber: surahMeta.number,
          surahNameLatin: surahMeta.nameLatin,
          ayahNumber: initialAyahNumber || 1,
          timestamp: Date.now(),
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMessage('Gagal memuat ayat Al-Qur\'an. Silakan coba kembali.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [surahNumber]);

  // Scroll to initial ayah if provided
  useEffect(() => {
    if (!isLoading && initialAyahNumber && initialAyahNumber > 1) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-${initialAyahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [isLoading, initialAyahNumber]);

  // Audio playback handler
  const playAyahAudio = (ayahNumber: number) => {
    if (currentPlayingAyah === ayahNumber && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setCurrentPlayingAyah(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioUrl = getAyahAudioUrl(surahNumber, ayahNumber, selectedQari);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentPlayingAyah(ayahNumber);

    audio.onended = () => {
      if (isAutoPlayNext && ayahNumber < surahMeta.numberOfAyahs) {
        playAyahAudio(ayahNumber + 1);
      } else {
        setCurrentPlayingAyah(null);
      }
    };

    audio.onerror = () => {
      setCurrentPlayingAyah(null);
      soundService.playAdzanChime();
    };

    audio.play().catch(() => {
      setCurrentPlayingAyah(null);
    });
  };

  const copyAyah = async (ayah: Ayah) => {
    const textToCopy = `${ayah.textArabic}\n\n"${ayah.translationId}"\n(QS. ${surahMeta.nameLatin}: ${ayah.numberInSurah})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAyahNumber(ayah.numberInSurah);
      setTimeout(() => setCopiedAyahNumber(null), 2000);
    } catch {
      // ignore
    }
  };

  const shareAyah = async (ayah: Ayah) => {
    const textToShare = `${ayah.textArabic}\n\n"${ayah.translationId}"\n(QS. ${surahMeta.nameLatin}: ${ayah.numberInSurah})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${surahMeta.nameLatin}: ${ayah.numberInSurah}`,
          text: textToShare,
        });
      } catch {
        copyAyah(ayah);
      }
    } else {
      copyAyah(ayah);
    }
  };

  const isAyahBookmarked = (ayahNum: number) => {
    return bookmarks.some(
      (b) => b.surahNumber === surahMeta.number && b.ayahNumber === ayahNum
    );
  };

  const arabicSizeClasses = {
    sm: 'text-lg sm:text-xl leading-[2.2]',
    md: 'text-2xl sm:text-3xl leading-[2.4]',
    lg: 'text-3xl sm:text-4xl leading-[2.6]',
    xl: 'text-4xl sm:text-5xl leading-[2.8]',
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-[57px] z-20 flex items-center justify-between rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">
            {surahMeta.number}. {surahMeta.nameLatin}
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {surahMeta.numberOfAyahs} Ayat · {surahMeta.revelationType}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Pengaturan Ukuran Font & Qari"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Surah Header Card */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-6 text-center text-white dark:border-emerald-700/20">
        <p className="font-arabic text-3xl sm:text-4xl font-bold text-amber-200">
          {surahMeta.nameArabic}
        </p>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-white">
          Surah {surahMeta.nameLatin}
        </h1>
        <p className="text-xs text-emerald-200">
          "{surahMeta.translationId}" · {surahMeta.numberOfAyahs} Ayat · Diturunkan di {surahMeta.revelationType}
        </p>

        {tafsirShort && (
          <p className="mt-3 text-xs text-emerald-100/80 max-w-xl mx-auto leading-relaxed border-t border-white/10 pt-2.5">
            {tafsirShort}
          </p>
        )}

        {/* Global Surah Play Button */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => playAyahAudio(1)}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-300"
          >
            {currentPlayingAyah !== null ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Sedang Memutar Murottal</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Putar Murottal Lengkap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Font & Audio Controls Panel (Toggled) */}
      {showSettingsDrawer && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Preferensi Pembacaan & Audio
            </span>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Tutup
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Arabic Font Size */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Ukuran Teks Arab:
              </label>
              <div className="mt-1.5 flex items-center gap-1.5">
                {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setArabicSize(size)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-medium uppercase transition-colors ${
                      arabicSize === size
                        ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qari Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pilihan Qari Murottal:
              </label>
              <select
                value={selectedQari}
                onChange={(e) => setSelectedQari(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {QARI_OPTIONS.map((qari) => (
                  <option key={qari.id} value={qari.id}>
                    {qari.name} ({qari.subname})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bismillah Header (Except Surah At-Taubah no 9 & Al-Fatihah no 1 where it is Ayah 1) */}
      {surahMeta.bismillahPre && (
        <div className="my-6 text-center">
          <p dir="rtl" className="font-arabic text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-300">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3 py-6">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Volume2 className="h-4 w-4 animate-spin text-emerald-600" />
            <span>Memuat ayat-ayat Al-Qur'an...</span>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-4 h-8 w-3/4 ml-auto rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900 dark:bg-amber-950/40">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {errorMessage}
          </p>
          <button
            onClick={() => {
              setIsLoading(true);
              fetchSurahVerses(surahNumber).then((data) => {
                setAyahs(data.ayahs);
                setIsLoading(false);
              });
            }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Muat Ulang</span>
          </button>
        </div>
      )}

      {/* Verses List */}
      {!isLoading && (
        <div className="space-y-4">
          {ayahs.map((ayah) => {
            const isPlayingThis = currentPlayingAyah === ayah.numberInSurah;
            const isBookmarked = isAyahBookmarked(ayah.numberInSurah);

            return (
              <article
                key={ayah.numberInSurah}
                id={`ayah-${ayah.numberInSurah}`}
                className={`rounded-2xl border p-5 transition-all ${
                  isPlayingThis
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-sm dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                {/* Ayah Actions & Number Row */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      {ayah.numberInSurah}
                    </div>
                    <span className="text-xs text-slate-400">
                      {surahMeta.nameLatin}:{ayah.numberInSurah}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Play Audio */}
                    <button
                      onClick={() => playAyahAudio(ayah.numberInSurah)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isPlayingThis
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                      title={isPlayingThis ? 'Jeda Audio' : 'Putar Audio Ayat'}
                    >
                      {isPlayingThis ? (
                        <Pause className="h-3.5 w-3.5 fill-current" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-current" />
                      )}
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() =>
                        onToggleBookmark({
                          surahNumber: surahMeta.number,
                          surahNameLatin: surahMeta.nameLatin,
                          ayahNumber: ayah.numberInSurah,
                          textArabic: ayah.textArabic,
                          translationId: ayah.translationId,
                        })
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-amber-500'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                      title={isBookmarked ? 'Hapus Bookmark' : 'Tandai Bookmark'}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => copyAyah(ayah)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Salin Ayat & Terjemahan"
                    >
                      {copiedAyahNumber === ayah.numberInSurah ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => shareAyah(ayah)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Bagikan Ayat"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>

                    {/* Mark as Last Read */}
                    <button
                      onClick={() => {
                        onSetLastRead({
                          surahNumber: surahMeta.number,
                          surahNameLatin: surahMeta.nameLatin,
                          ayahNumber: ayah.numberInSurah,
                          timestamp: Date.now(),
                        });
                        soundService.playTasbihClick();
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      title="Tandai Terakhir Dibaca"
                    >
                      <BookMarked className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="my-5 text-right">
                  <p
                    dir="rtl"
                    className={`font-arabic font-bold text-slate-900 dark:text-slate-50 ${arabicSizeClasses[arabicSize]}`}
                  >
                    {ayah.textArabic}
                  </p>
                </div>

                {/* Latin Transliteration */}
                {ayah.textLatin && (
                  <p className="text-xs italic text-slate-500 dark:text-slate-400">
                    {ayah.textLatin}
                  </p>
                )}

                {/* Indonesian Translation */}
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {ayah.translationId}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {/* Surah Switcher Pagination Bottom Bar */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
        {surahMeta.number > 1 ? (
          <button
            onClick={() => onSelectOtherSurah(surahMeta.number - 1)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Surah Sebelumnya</span>
          </button>
        ) : (
          <div />
        )}

        {surahMeta.number < 114 ? (
          <button
            onClick={() => onSelectOtherSurah(surahMeta.number + 1)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span>Surah Berikutnya</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
