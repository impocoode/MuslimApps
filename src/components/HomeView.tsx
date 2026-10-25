import React, { useEffect, useState } from 'react';
import {
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Heart,
  HelpCircle,
  MapPin,
  Play,
  Pause,
  Quote,
  RotateCcw,
  ScrollText,
  Volume2,
} from 'lucide-react';
import {
  AppSettings,
  CityLocation,
  LastReadPosition,
  PrayerSchedule,
  SubView,
} from '../types';
import { calculatePrayerTimes } from '../utils/prayerTimes';
import { DAILY_AYAH_HIGHLIGHTS } from '../data/surahs';
import { HADITH_LIST } from '../data/hadiths';
import { ISLAMIC_STORIES } from '../data/prophetsAndFigures';
import { soundService } from '../utils/audio';

interface HomeViewProps {
  settings: AppSettings;
  lastRead: LastReadPosition | null;
  completedMutabaahCount: number;
  totalMutabaahCount: number;
  onNavigateToQuran: (surahNumber?: number, ayahNumber?: number) => void;
  onNavigateToHadith: (hadithId?: string) => void;
  onNavigateToStories: (storyId?: string) => void;
  onNavigateToSubView: (view: SubView) => void;
  onOpenCitySelector: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  lastRead,
  completedMutabaahCount,
  totalMutabaahCount,
  onNavigateToQuran,
  onNavigateToHadith,
  onNavigateToStories,
  onNavigateToSubView,
  onOpenCitySelector,
}) => {
  const [schedule, setSchedule] = useState<PrayerSchedule>(() =>
    calculatePrayerTimes(settings.selectedCity, settings.calculationMethod)
  );
  const [countdownStr, setCountdownStr] = useState<string>('');
  const [isPlayingAyahAudio, setIsPlayingAyahAudio] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Pick highlight of the day deterministically based on day of year
  const todayDayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const dailyAyah = DAILY_AYAH_HIGHLIGHTS[todayDayOfYear % DAILY_AYAH_HIGHLIGHTS.length];
  const dailyHadith = HADITH_LIST[todayDayOfYear % HADITH_LIST.length];
  const featuredStory = ISLAMIC_STORIES[0]; // Sirah Nabi Muhammad

  // Recalculate prayer times every second to update countdown
  useEffect(() => {
    const updateCountdown = () => {
      const currentSchedule = calculatePrayerTimes(
        settings.selectedCity,
        settings.calculationMethod
      );
      setSchedule(currentSchedule);

      const sec = currentSchedule.countdownSeconds;
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      setCountdownStr(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.selectedCity, settings.calculationMethod]);

  // Audio preview for Daily Ayah
  const toggleDailyAyahAudio = () => {
    if (isPlayingAyahAudio && audioElement) {
      audioElement.pause();
      setIsPlayingAyahAudio(false);
      return;
    }

    // Audio URL for Ayat Kursi or Surah verse from everyayah
    const surahStr = dailyAyah.surahNumber.toString().padStart(3, '0');
    const ayahStr = dailyAyah.ayahNumber.toString().padStart(3, '0');
    const url = `https://everyayah.com/data/Alafasy_128kbps/${surahStr}${ayahStr}.mp3`;

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(url);
    audio.onended = () => setIsPlayingAyahAudio(false);
    audio.onerror = () => {
      setIsPlayingAyahAudio(false);
      soundService.playAdzanChime();
    };

    audio.play().then(() => {
      setAudioElement(audio);
      setIsPlayingAyahAudio(true);
    }).catch(() => {
      setIsPlayingAyahAudio(false);
      soundService.playAdzanChime();
    });
  };

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  const prayerTimesList = [
    { name: 'Subuh', time: schedule.fajr, isNext: schedule.nextPrayerName.startsWith('Subuh') },
    { name: 'Terbit', time: schedule.sunrise, isNext: schedule.nextPrayerName.startsWith('Terbit') },
    { name: 'Zuhur', time: schedule.dhuhr, isNext: schedule.nextPrayerName.startsWith('Zuhur') },
    { name: 'Asar', time: schedule.asr, isNext: schedule.nextPrayerName.startsWith('Asar') },
    { name: 'Magrib', time: schedule.maghrib, isNext: schedule.nextPrayerName.startsWith('Magrib') },
    { name: 'Isya', time: schedule.isha, isNext: schedule.nextPrayerName.startsWith('Isya') },
  ];

  const quickActions = [
    { id: 'quran', label: 'Al-Qur\'an', icon: BookOpen, action: () => onNavigateToQuran() },
    { id: 'hadis', label: 'Hadis Sahih', icon: Quote, action: () => onNavigateToHadith() },
    { id: 'kisah', label: 'Sirah Nabi', icon: ScrollText, action: () => onNavigateToStories('sirah-1-kelahiran') },
    { id: 'doa', label: 'Doa & Dzikir', icon: Heart, action: () => onNavigateToSubView('doa') },
    { id: 'tasbih', label: 'Tasbih', icon: RotateCcw, action: () => onNavigateToSubView('tasbih') },
    { id: 'kiblat', label: 'Arah Kiblat', icon: Compass, action: () => onNavigateToSubView('kiblat') },
    { id: 'salat', label: 'Jadwal Salat', icon: Clock, action: () => onNavigateToSubView('jadwal-salat') },
    { id: 'donasi', label: 'Infaq & Wakaf', icon: CheckCircle2, action: () => onNavigateToSubView('donasi') },
  ];

  const mutabaahPercent = totalMutabaahCount > 0 ? Math.round((completedMutabaahCount / totalMutabaahCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Greeting & Calendar Header */}
      <section className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-5 text-white shadow-md dark:border-emerald-700/20">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium text-emerald-200">
              Assalamu'alaikum Warahmatullahi Wabarakatuh
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Selamat Beribadah Hari Ini
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:self-center">
            <Calendar className="h-4 w-4 text-emerald-300" />
            <div className="text-left text-xs leading-tight">
              <p className="font-semibold text-emerald-100">{schedule.hijriFormatted}</p>
              <p className="text-[11px] text-emerald-300/90">{schedule.dateFormatted}</p>
            </div>
          </div>
        </div>

        {/* Prayer Countdown Banner */}
        <div className="mt-5 rounded-xl bg-black/25 p-4 border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-300 animate-pulse" />
              <span className="text-xs text-emerald-200">Menuju Waktu {schedule.nextPrayerName}</span>
              <span className="text-xs text-slate-300">({schedule.nextPrayerTimeFormatted})</span>
            </div>
            <div className="font-mono text-base font-bold tracking-wider text-amber-300 sm:text-lg">
              {countdownStr}
            </div>
          </div>

          {/* Location indicator */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs text-emerald-200/90">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 text-emerald-300" />
              <span className="truncate">{settings.selectedCity.name}, {settings.selectedCity.country}</span>
            </div>
            <button
              onClick={onOpenCitySelector}
              className="text-[11px] font-medium text-amber-300 hover:underline"
            >
              Ubah Kota
            </button>
          </div>
        </div>

        {/* 6 Prayer Times Strip */}
        <div className="mt-4 grid grid-cols-6 gap-1.5 text-center sm:gap-2">
          {prayerTimesList.map((item) => (
            <div
              key={item.name}
              className={`rounded-lg py-2 px-1 transition-all ${
                item.isNext
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md scale-105'
                  : 'bg-white/10 text-white/90'
              }`}
            >
              <p className="text-[10px] tracking-tight">{item.name}</p>
              <p className="font-mono text-xs sm:text-sm mt-0.5">{item.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Quick Actions Grid */}
      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Akses Cepat Fitur Ibadah
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">8 Menu Utama</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-xs transition-all hover:border-emerald-500 hover:shadow-sm active:scale-95 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-transform group-hover:scale-110 dark:bg-emerald-950/70 dark:text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Resume Last Read Quran & Mutaba'ah Summary Strip */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Last Read Position Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <BookMarked className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bacaan Terakhir Al-Qur'an</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lastRead ? `Surah ${lastRead.surahNameLatin}` : 'Surah Al-Fatihah'}
                </h3>
              </div>
            </div>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              {lastRead ? `Ayat ${lastRead.ayahNumber}` : 'Ayat 1'}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {lastRead ? 'Tersimpan otomatis' : 'Mulai tilawah hari ini'}
            </span>
            <button
              onClick={() => onNavigateToQuran(lastRead ? lastRead.surahNumber : 1, lastRead ? lastRead.ayahNumber : 1)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Lanjutkan Baca
            </button>
          </div>
        </div>

        {/* Daily Mutaba'ah Target Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target Ibadah Hari Ini</p>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {completedMutabaahCount} dari {totalMutabaahCount} Amalan
                </h3>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {mutabaahPercent}%
            </span>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${mutabaahPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500">Mutaba'ah Yaumiyah</span>
            <button
              onClick={() => onNavigateToSubView('mutabaah')}
              className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              Perbarui Amalan
            </button>
          </div>
        </div>
      </section>

      {/* 4. Ayat Pilihan Hari Ini */}
      <section className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Ayat Al-Qur'an Pilihan Hari Ini
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{dailyAyah.theme}</span>
          </div>

          <button
            onClick={toggleDailyAyahAudio}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
            title="Dengarkan murottal ayat ini"
          >
            {isPlayingAyahAudio ? (
              <>
                <Pause className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                <span>Jeda Audio</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Putar Audio</span>
              </>
            )}
          </button>
        </div>

        <div className="my-4 text-right">
          <p
            dir="rtl"
            className="font-arabic text-xl sm:text-2xl font-bold leading-loose text-slate-900 dark:text-slate-50"
          >
            {dailyAyah.arabic}
          </p>
        </div>

        <div className="space-y-1.5 text-left">
          <p className="text-xs italic text-slate-500 dark:text-slate-400">
            {dailyAyah.latin}
          </p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            "{dailyAyah.translationId}"
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            QS. {dailyAyah.surahNameLatin} [{dailyAyah.surahNumber}]: {dailyAyah.ayahNumber}
          </span>
          <button
            onClick={() => onNavigateToQuran(dailyAyah.surahNumber, dailyAyah.ayahNumber)}
            className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Buka Surah Lengkap
          </button>
        </div>
      </section>

      {/* 5. Hadits Pilihan Hari Ini */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Hadis Pilihan Hari Ini
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{dailyHadith.category}</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            {dailyHadith.grade}
          </span>
        </div>

        <div className="my-3 text-right">
          <p dir="rtl" className="font-arabic text-lg sm:text-xl font-bold leading-relaxed text-slate-900 dark:text-slate-100">
            {dailyHadith.arabic}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          "{dailyHadith.translationId}"
        </p>

        {dailyHadith.explanation && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
            {dailyHadith.explanation}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {dailyHadith.bookName} (No. {dailyHadith.hadithNumber})
          </span>
          <button
            onClick={() => onNavigateToHadith(dailyHadith.id)}
            className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Pelajari Hadis Lainnya
          </button>
        </div>
      </section>

      {/* 6. Featured Islamic Story (Sirah Nabi Muhammad SAW) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Kisah & Sirah Pilihan
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{featuredStory.era}</span>
          </div>
          <span className="text-xs text-slate-400">Ref: Ibnu Hisyam</span>
        </div>

        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
          {featuredStory.title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {featuredStory.summary}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Teladan Akhlak & Sejarah Islam
          </span>
          <button
            onClick={() => onNavigateToStories(featuredStory.id)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Baca Kisah Lengkap
          </button>
        </div>
      </section>
    </div>
  );
};
