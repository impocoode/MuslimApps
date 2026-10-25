import React, { useState, useEffect } from 'react';
import {
  AppSettings,
  CityLocation,
  LastReadPosition,
  NavTab,
  QuranBookmark,
  SubView,
} from './types';
import { INDONESIAN_CITIES } from './utils/prayerTimes';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { QuranView } from './components/QuranView';
import { SurahDetailView } from './components/SurahDetailView';
import { HadithView } from './components/HadithView';
import { StoriesView } from './components/StoriesView';
import { PrayersAndDhikrView } from './components/PrayersAndDhikrView';
import { TasbihView } from './components/TasbihView';
import { PrayerTimesAndQiblaView } from './components/PrayerTimesAndQiblaView';
import { DonationView } from './components/DonationView';
import { MutabaahView } from './components/MutabaahView';
import { NotesView } from './components/NotesView';
import { MoreMenuHubView } from './components/MoreMenuHubView';
import { SettingsView } from './components/SettingsView';
import { CitySelectorModal } from './components/CitySelectorModal';
import { BookmarksModal } from './components/BookmarksModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { DEFAULT_MUTABAAH_ITEMS } from './data/donationPrograms';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('beranda');
  const [subView, setSubView] = useState<SubView>('home');

  // Selected Detail items
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState<number | undefined>(undefined);
  const [selectedHadithId, setSelectedHadithId] = useState<string | undefined>(undefined);
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(undefined);

  // Modals
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // App Settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      theme: 'light',
      arabicFontSize: 'md',
      translationFontSize: 'md',
      calculationMethod: 'kemenag',
      selectedCity: INDONESIAN_CITIES[0], // Jakarta default
      audioAutoPlayNext: true,
      tasbihVibration: true,
      tasbihSound: true,
      adzanSoundReminder: true,
    };
  });

  // Last read position
  const [lastRead, setLastRead] = useState<LastReadPosition | null>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Bookmarks
  const [quranBookmarks, setQuranBookmarks] = useState<QuranBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hadithBookmarks, setHadithBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_hadith_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [prayerBookmarks, setPrayerBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_prayer_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply theme to HTML root
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('muslim_app_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('muslim_app_quran_bookmarks', JSON.stringify(quranBookmarks));
    } catch {
      // ignore
    }
  }, [quranBookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('muslim_app_hadith_bookmarks', JSON.stringify(hadithBookmarks));
    } catch {
      // ignore
    }
  }, [hadithBookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('muslim_app_prayer_bookmarks', JSON.stringify(prayerBookmarks));
    } catch {
      // ignore
    }
  }, [prayerBookmarks]);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Set Last Read handler
  const handleSetLastRead = (pos: LastReadPosition) => {
    setLastRead(pos);
    try {
      localStorage.setItem('muslim_app_last_read', JSON.stringify(pos));
    } catch {
      // ignore
    }
  };

  // Toggle Quran Bookmark
  const handleToggleQuranBookmark = (b: Omit<QuranBookmark, 'id' | 'timestamp'>) => {
    setQuranBookmarks((prev) => {
      const exists = prev.some(
        (item) => item.surahNumber === b.surahNumber && item.ayahNumber === b.ayahNumber
      );
      if (exists) {
        return prev.filter(
          (item) => !(item.surahNumber === b.surahNumber && item.ayahNumber === b.ayahNumber)
        );
      }
      return [
        {
          ...b,
          id: `bm-${b.surahNumber}-${b.ayahNumber}-${Date.now()}`,
          timestamp: Date.now(),
        },
        ...prev,
      ];
    });
  };

  // Toggle Hadith Bookmark
  const handleToggleHadithBookmark = (hadithId: string) => {
    setHadithBookmarks((prev) =>
      prev.includes(hadithId) ? prev.filter((id) => id !== hadithId) : [...prev, hadithId]
    );
  };

  // Toggle Prayer Bookmark
  const handleTogglePrayerBookmark = (prayerId: string) => {
    setPrayerBookmarks((prev) =>
      prev.includes(prayerId) ? prev.filter((id) => id !== prayerId) : [...prev, prayerId]
    );
  };

  // Navigation handlers
  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    setSubView('home');
    setSelectedSurahNumber(null);
    setSelectedAyahNumber(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToQuran = (surahNumber?: number, ayahNumber?: number) => {
    setCurrentTab('quran');
    if (surahNumber) {
      setSelectedSurahNumber(surahNumber);
      setSelectedAyahNumber(ayahNumber);
      setSubView('surah-detail');
    } else {
      setSelectedSurahNumber(null);
      setSubView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHadith = (hadithId?: string) => {
    setCurrentTab('hadis');
    setSelectedHadithId(hadithId);
    setSubView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToStories = (storyId?: string) => {
    setCurrentTab('kisah');
    setSelectedStoryId(storyId);
    setSubView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSubView = (view: SubView) => {
    setSubView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh data bookmark, mutaba\'ah, dan riwayat di perangkat ini?')) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('muslim_app_')) {
          localStorage.removeItem(key);
        }
      }
      setQuranBookmarks([]);
      setHadithBookmarks([]);
      setPrayerBookmarks([]);
      setLastRead(null);
      alert('Data lokal berhasil dibersihkan.');
    }
  };

  // Calculate Mutaba'ah count for today
  const todayKey = new Date().toISOString().slice(0, 10);
  let completedMutabaahCount = 0;
  try {
    const savedMutabaah = localStorage.getItem(`muslim_app_mutabaah_${todayKey}`);
    if (savedMutabaah) {
      completedMutabaahCount = JSON.parse(savedMutabaah).length;
    }
  } catch {
    completedMutabaahCount = 0;
  }

  // Active view rendering logic
  const renderCurrentView = () => {
    // 1. Direct subviews triggered from More menu or quick actions
    if (subView === 'doa') {
      return (
        <PrayersAndDhikrView
          bookmarks={prayerBookmarks}
          onToggleBookmark={handleTogglePrayerBookmark}
        />
      );
    }
    if (subView === 'tasbih') {
      return <TasbihView />;
    }
    if (subView === 'jadwal-salat' || subView === 'kiblat') {
      return (
        <PrayerTimesAndQiblaView
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenCitySelector={() => setIsCitySelectorOpen(true)}
        />
      );
    }
    if (subView === 'donasi') {
      return <DonationView />;
    }
    if (subView === 'mutabaah') {
      return <MutabaahView />;
    }
    if (subView === 'catatan') {
      return <NotesView />;
    }
    if (subView === 'pengaturan') {
      return (
        <SettingsView
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetAllData={handleResetAllData}
        />
      );
    }

    // 2. Surah Detail View if a surah is selected
    if (currentTab === 'quran' && (selectedSurahNumber !== null || subView === 'surah-detail')) {
      return (
        <SurahDetailView
          surahNumber={selectedSurahNumber || 1}
          initialAyahNumber={selectedAyahNumber}
          settings={settings}
          bookmarks={quranBookmarks}
          onToggleBookmark={handleToggleQuranBookmark}
          onSetLastRead={handleSetLastRead}
          onBack={() => {
            setSelectedSurahNumber(null);
            setSelectedAyahNumber(undefined);
            setSubView('home');
          }}
          onSelectOtherSurah={(num) => {
            setSelectedSurahNumber(num);
            setSelectedAyahNumber(undefined);
          }}
        />
      );
    }

    // 3. Main 5 Tab Views
    switch (currentTab) {
      case 'beranda':
        return (
          <HomeView
            settings={settings}
            lastRead={lastRead}
            completedMutabaahCount={completedMutabaahCount}
            totalMutabaahCount={DEFAULT_MUTABAAH_ITEMS.length}
            onNavigateToQuran={handleNavigateToQuran}
            onNavigateToHadith={handleNavigateToHadith}
            onNavigateToStories={handleNavigateToStories}
            onNavigateToSubView={handleNavigateToSubView}
            onOpenCitySelector={() => setIsCitySelectorOpen(true)}
          />
        );
      case 'quran':
        return (
          <QuranView
            lastRead={lastRead}
            onSelectSurah={(surahNum, targetAyah) => {
              setSelectedSurahNumber(surahNum);
              setSelectedAyahNumber(targetAyah);
              setSubView('surah-detail');
            }}
            onOpenBookmarks={() => setIsBookmarksOpen(true)}
          />
        );
      case 'hadis':
        return (
          <HadithView
            initialHadithId={selectedHadithId}
            bookmarks={hadithBookmarks}
            onToggleBookmark={handleToggleHadithBookmark}
          />
        );
      case 'kisah':
        return (
          <StoriesView
            initialStoryId={selectedStoryId}
            bookmarks={[]}
            onToggleBookmark={() => {}}
          />
        );
      case 'lainnya':
        return (
          <MoreMenuHubView
            onNavigateToSubView={handleNavigateToSubView}
            onOpenBookmarks={() => setIsBookmarksOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenCitySelector={() => setIsCitySelectorOpen(true)}
        onGoHome={() => handleTabChange('beranda')}
      />

      {/* Main Content Viewport Canvas */}
      <main className="mx-auto flex-1 w-full max-w-4xl px-4 py-4 sm:px-6">
        {renderCurrentView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />

      {/* City Selector Modal */}
      {isCitySelectorOpen && (
        <CitySelectorModal
          currentCity={settings.selectedCity}
          onSelectCity={(city) => handleUpdateSettings({ selectedCity: city })}
          onClose={() => setIsCitySelectorOpen(false)}
        />
      )}

      {/* Bookmarks Modal */}
      {isBookmarksOpen && (
        <BookmarksModal
          quranBookmarks={quranBookmarks}
          hadithBookmarks={hadithBookmarks}
          prayerBookmarks={prayerBookmarks}
          onSelectAyah={(surahNum, ayahNum) => {
            handleNavigateToQuran(surahNum, ayahNum);
          }}
          onRemoveQuranBookmark={(id) =>
            setQuranBookmarks((prev) => prev.filter((b) => b.id !== id))
          }
          onRemoveHadithBookmark={handleToggleHadithBookmark}
          onRemovePrayerBookmark={handleTogglePrayerBookmark}
          onClose={() => setIsBookmarksOpen(false)}
        />
      )}

      {/* Global Search Modal */}
      {isSearchOpen && (
        <GlobalSearchModal
          onSelectSurah={(surahNum) => {
            handleNavigateToQuran(surahNum);
          }}
          onSelectHadith={(hadithId) => {
            handleNavigateToHadith(hadithId);
          }}
          onSelectPrayer={() => {
            handleNavigateToSubView('doa');
          }}
          onSelectStory={(storyId) => {
            handleNavigateToStories(storyId);
          }}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </div>
  );
}
