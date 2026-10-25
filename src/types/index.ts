export type NavTab = 'beranda' | 'quran' | 'hadis' | 'kisah' | 'lainnya';

export type SubView =
  | 'home'
  | 'surah-detail'
  | 'hadis-detail'
  | 'kisah-detail'
  | 'doa'
  | 'tasbih'
  | 'jadwal-salat'
  | 'kiblat'
  | 'donasi'
  | 'mutabaah'
  | 'catatan'
  | 'pengaturan'
  | 'bookmarks'
  | 'search';

export interface SurahMeta {
  number: number;
  nameArabic: string;
  nameLatin: string;
  translationId: string;
  numberOfAyahs: number;
  revelationType: 'Makkiyah' | 'Madaniyah';
  bismillahPre: boolean;
}

export interface Ayah {
  numberInSurah: number;
  numberInQuran: number;
  textArabic: string;
  textLatin?: string;
  translationId: string;
  audioUrl?: string;
}

export interface SurahDetailData extends SurahMeta {
  ayahs: Ayah[];
  tafsirShort?: string;
}

export interface LastReadPosition {
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber: number;
  timestamp: number;
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  surahNameLatin: string;
  ayahNumber: number;
  textArabic: string;
  translationId: string;
  timestamp: number;
}

export interface HadithItem {
  id: string;
  bookName: string; // e.g. "HR. Bukhari", "HR. Muslim", "HR. Abu Dawud", "HR. Tirmidzi"
  bookId: 'bukhari' | 'muslim' | 'abu-dawud' | 'tirmidzi' | 'nasai' | 'ibnu-majah' | 'riyadhus-shalihin';
  hadithNumber: number | string;
  category: 'Niat & Ikhlas' | 'Iman & Tauhid' | 'Akhlak Mulia' | 'Salat & Ibadah' | 'Menuntut Ilmu' | 'Doa & Dzikir' | 'Sabar & Syukur' | 'Kasih Sayang & Silaturahmi';
  arabic: string;
  translationId: string;
  grade?: string; // e.g. "Shahih", "Hasan"
  explanation?: string;
}

export interface StoryItem {
  id: string;
  category: 'sirah' | 'prophet' | 'sahabah' | 'scholar';
  categoryLabel: string;
  title: string;
  arabicTitle?: string;
  era?: string;
  orderIndex: number;
  summary: string;
  content: string[];
  lessons: string[];
  references: string[];
}

export interface PrayerDhikrItem {
  id: string;
  category: 'Bangun Tidur' | 'Makan & Minum' | 'Kamar Mandi' | 'Rumah' | 'Menuntut Ilmu' | 'Orang Tua & Keluarga' | 'Bepergian (Safar)' | 'Kesehatan & Sakit' | 'Perlindungan' | 'Setelah Salat' | 'Dzikir Pagi' | 'Dzikir Petang' | 'Istighfar & Selawat';
  title: string;
  arabic: string;
  latin: string;
  translationId: string;
  source: string;
  benefits?: string;
  repeatCount?: number;
}

export interface CityLocation {
  id: string;
  name: string;
  province?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset in hours e.g. 7 for WIB, 8 for WITA, 9 for WIT
  timezoneLabel: string;
}

export type CalculationMethodId = 'kemenag' | 'mwl' | 'egypt' | 'makkah' | 'isna';

export interface CalculationMethod {
  id: CalculationMethodId;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
  description: string;
}

export interface PrayerSchedule {
  dateFormatted: string;
  hijriFormatted: string;
  fajr: string; // Subuh
  sunrise: string; // Terbit
  dhuhr: string; // Zuhur
  asr: string; // Asar
  maghrib: string; // Magrib
  isha: string; // Isya
  fajrTimestamp: number;
  sunriseTimestamp: number;
  dhuhrTimestamp: number;
  asrTimestamp: number;
  maghribTimestamp: number;
  ishaTimestamp: number;
  nextPrayerName: string;
  nextPrayerTimeFormatted: string;
  countdownSeconds: number;
}

export interface TasbihDhikr {
  id: string;
  arabic: string;
  latin: string;
  meaning: string;
  defaultTarget: number;
}

export interface TasbihHistory {
  id: string;
  dhikrName: string;
  count: number;
  target: number;
  completedAt: number;
}

export interface MutabaahItem {
  id: string;
  label: string;
  category: 'Fardhu' | 'Sunnah' | 'Al-Qur\'an' | 'Amalan Sosial';
  targetDays?: number;
}

export interface DonationProgram {
  id: string;
  category: 'Pendidikan Santri' | 'Kemanusiaan & Dhuafa' | 'Renovasi Rumah Ibadah' | 'Air Bersih & Sanitasi';
  title: string;
  organizer: string;
  legalNotice: string;
  targetAmount: number;
  collectedAmount: number;
  donorsCount: number;
  deadlineDays: number;
  description: string;
  usageAllocation: { label: string; percentage: number }[];
  bankAccounts: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }[];
  qrisEnabled: boolean;
}

export interface DonationRecord {
  id: string;
  programTitle: string;
  donorName: string;
  donorPhoneOrEmail: string;
  amount: number;
  paymentMethod: string;
  status: 'Menunggu Verifikasi Bank' | 'Tercatat Sukses';
  timestamp: number;
  referenceCode: string;
}

export interface IslamicNote {
  id: string;
  title: string;
  category: 'Tadabbur' | 'Kutipan Hadis' | 'Target & Doa' | 'Kajian';
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  arabicFontSize: 'sm' | 'md' | 'lg' | 'xl';
  translationFontSize: 'sm' | 'md' | 'lg';
  calculationMethod: CalculationMethodId;
  selectedCity: CityLocation;
  audioAutoPlayNext: boolean;
  tasbihVibration: boolean;
  tasbihSound: boolean;
  adzanSoundReminder: boolean;
}
