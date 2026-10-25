import React from 'react';
import {
  BookOpen,
  Database,
  Download,
  Info,
  Moon,
  RefreshCcw,
  Shield,
  Sliders,
  Sun,
} from 'lucide-react';
import { AppSettings } from '../types';
import { CALCULATION_METHODS } from '../utils/prayerTimes';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const exportLocalData = () => {
    const dataObj: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('muslim_app_')) {
        dataObj[key] = localStorage.getItem(key);
      }
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `muslim_app_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Pengaturan & Rujukan Data
        </h1>
        <p className="mt-1 text-xs text-emerald-200">
          Sesuaikan tampilan, ukuran font, metode hisab, dan verifikasi sumber rujukan syar'i
        </p>
      </div>

      {/* 1. Appearance & Theme */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Tema & Tampilan Aplikasi
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSettings({ theme: 'light' })}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
              settings.theme === 'light'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Mode Terang (Light)</span>
          </button>

          <button
            onClick={() => onUpdateSettings({ theme: 'dark' })}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
              settings.theme === 'dark'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            <Moon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Mode Gelap (Dark)</span>
          </button>
        </div>
      </section>

      {/* 2. Arabic Font Size */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Ukuran Teks Arab Al-Qur'an
        </h2>

        <div className="mt-3 flex items-center gap-2">
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <button
              key={size}
              onClick={() => onUpdateSettings({ arabicFontSize: size })}
              className={`flex-1 rounded-xl py-2 text-xs font-bold uppercase transition-colors ${
                settings.arabicFontSize === size
                  ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {size === 'sm' ? 'Kecil' : size === 'md' ? 'Sedang' : size === 'lg' ? 'Besar' : 'Ekstra'}
            </button>
          ))}
        </div>

        {/* Live Font Size Preview */}
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-right dark:bg-slate-800/60">
          <p
            dir="rtl"
            className={`font-arabic font-bold text-slate-900 dark:text-slate-50 ${
              settings.arabicFontSize === 'sm'
                ? 'text-xl leading-[2.2]'
                : settings.arabicFontSize === 'md'
                ? 'text-2xl leading-[2.4]'
                : settings.arabicFontSize === 'lg'
                ? 'text-3xl leading-[2.6]'
                : 'text-4xl leading-[2.8]'
            }`}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="mt-1 text-left text-xs text-slate-500">Pratinjau ukuran teks ayat Al-Qur'an</p>
        </div>
      </section>

      {/* 3. Data Storage & Backup */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Penyimpanan Data Lokal (localStorage)
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Seluruh penanda bacaan (bookmarks), riwayat bacaan terakhir, target ibadah harian, dan catatan disimpan di memori lokal peramban Anda.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={exportLocalData}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <Download className="h-4 w-4" />
            <span>Cadangkan Data (JSON)</span>
          </button>

          <button
            onClick={onResetAllData}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Reset Seluruh Data</span>
          </button>
        </div>
      </section>

      {/* 4. Verified Sources & Attributions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Sumber Rujukan & Verifikasi Data
          </h2>
        </div>

        <div className="mt-3 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div>
            <strong className="text-slate-800 dark:text-slate-200">1. Al-Qur'anul Karim:</strong>
            <p className="text-slate-500 dark:text-slate-400">
              Teks Arab berpedoman pada Rasm Utsmani Standar Madinah & Kementerian Agama Republik Indonesia (Kemenag RI). Terjemahan bahasa Indonesia mengacu pada Al-Qur'an dan Terjemahnya edisi penyempurnaan Kemenag RI.
            </p>
          </div>

          <div>
            <strong className="text-slate-800 dark:text-slate-200">2. Koleksi Hadis:</strong>
            <p className="text-slate-500 dark:text-slate-400">
              Kutubus Sittah: Shahih Al-Bukhari, Shahih Muslim, Sunan Abi Dawud, Jami' At-Tirmidzi, Sunan Ibnu Majah, serta Riyadhus Shalihin karya Imam An-Nawawi.
            </p>
          </div>

          <div>
            <strong className="text-slate-800 dark:text-slate-200">3. Sirah Nabawiyah & Sejarah Islam:</strong>
            <p className="text-slate-500 dark:text-slate-400">
              Kitab Ar-Rahiq Al-Makhtum (Syaikh Shafiyyurrahman Al-Mubarakfuri), Sirah Nabawiyah Ibnu Hisyam, dan Al-Bidayah wan-Nihayah (Al-Hafizh Ibnu Katsir).
            </p>
          </div>

          <div>
            <strong className="text-slate-800 dark:text-slate-200">4. Perhitungan Waktu Salat & Kiblat:</strong>
            <p className="text-slate-500 dark:text-slate-400">
              Formula astronomi posisi deklinasi matahari dan persamaan waktu (Equation of Time) dengan sudut Subuh 20° dan Isya 18° standar Kemenag RI serta sudut koordinat Ka'bah (21.422487° LU, 39.826206° BT).
            </p>
          </div>
        </div>
      </section>

      {/* 5. Privacy Statement */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Kebijakan Privasi & Keamanan
          </h2>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Aplikasi Muslim ini menghormati privasi Anda sepenuhnya. Seluruh preferensi, mutaba'ah, bookmark, dan catatan pribadi tersimpan aman di perangkat lokal Anda tanpa dikirim ke server pihak ketiga. Izin lokasi GPS hanya digunakan di sisi browser untuk menghitung jadwal waktu salat dan arah kiblat kota Anda.
        </p>

        <p className="mt-3 text-[11px] text-slate-400">
          Muslim App — Aplikasi Islam Digital Lengkap v1.0.0
        </p>
      </section>
    </div>
  );
};
