import React, { useState, useEffect } from 'react';
import { Check, History, RotateCcw, Volume2, VolumeX, Smartphone, Trash2 } from 'lucide-react';
import { TasbihDhikr, TasbihHistory } from '../types';
import { TASBIH_PRESETS } from '../data/donationPrograms';
import { soundService } from '../utils/audio';

interface TasbihViewProps {
  onBack?: () => void;
}

export const TasbihView: React.FC<TasbihViewProps> = () => {
  const [selectedDhikr, setSelectedDhikr] = useState<TasbihDhikr>(TASBIH_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [roundCompleted, setRoundCompleted] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrateEnabled, setVibrateEnabled] = useState<boolean>(true);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<TasbihHistory[]>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_tasbih_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('muslim_app_tasbih_history', JSON.stringify(historyList));
    } catch {
      // ignore
    }
  }, [historyList]);

  // Main tap counter
  const handleCountClick = () => {
    if (soundEnabled) {
      soundService.playTasbihClick();
    }
    if (vibrateEnabled) {
      soundService.vibrate(30);
    }

    const nextCount = count + 1;
    if (nextCount >= target) {
      // Completed target
      soundService.playTargetChime();
      if (vibrateEnabled) {
        soundService.vibrate(80);
      }
      setRoundCompleted((prev) => prev + 1);

      // Record to history
      const newHistoryItem: TasbihHistory = {
        id: `th-${Date.now()}`,
        dhikrName: selectedDhikr.latin,
        count: target,
        target: target,
        completedAt: Date.now(),
      };
      setHistoryList((prev) => [newHistoryItem, ...prev.slice(0, 24)]);
      setCount(0);
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    setCount(0);
    setShowResetConfirm(false);
  };

  const handleSelectDhikr = (dhikr: TasbihDhikr) => {
    setSelectedDhikr(dhikr);
    setTarget(dhikr.defaultTarget);
    setCount(0);
  };

  const clearHistory = () => {
    setHistoryList([]);
  };

  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Tasbih Digital Interaktif
            </h1>
            <p className="mt-1 text-xs text-emerald-200">
              Penghitung zikir digital dengan simulasi ketukan lembut, haptic getaran, dan riwayat
            </p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25"
          >
            <History className="h-3.5 w-3.5" />
            <span>Riwayat</span>
          </button>
        </div>
      </div>

      {/* Dhikr Selector Carousel */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Pilihan Bacaan Zikir:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          {TASBIH_PRESETS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectDhikr(item)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 font-medium transition-all ${
                selectedDhikr.id === item.id
                  ? 'bg-emerald-700 text-white shadow-xs dark:bg-emerald-600'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {item.latin}
            </button>
          ))}
        </div>
      </div>

      {/* Main Counter Stage Card */}
      <div className="relative rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Arabic Display */}
        <p dir="rtl" className="font-arabic text-3xl sm:text-4xl font-bold text-emerald-800 dark:text-emerald-400">
          {selectedDhikr.arabic}
        </p>
        <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
          {selectedDhikr.latin}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          "{selectedDhikr.meaning}"
        </p>

        {/* Target Buttons */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-400">Target:</span>
          {[33, 99, 100].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                if (count >= t) setCount(0);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                target === t
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t}x
            </button>
          ))}
        </div>

        {/* Big Circular Interactive Counter Area */}
        <div className="my-8 flex justify-center">
          <button
            onClick={handleCountClick}
            className="group relative flex h-52 w-52 sm:h-60 sm:w-60 items-center justify-center rounded-full bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 p-3 shadow-xl transition-all duration-100 active:scale-95 active:shadow-md focus:outline-none"
            aria-label={`Hitung zikir saat ini: ${count}`}
          >
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 h-full w-full -rotate-90 p-2" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-emerald-900/50 fill-none stroke-[6]"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-amber-400 fill-none stroke-[6] transition-all duration-150"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Bead Button Surface */}
            <div className="flex h-40 w-40 sm:h-46 sm:w-46 flex-col items-center justify-center rounded-full bg-emerald-800 text-white shadow-inner group-hover:bg-emerald-750">
              <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {count}
              </span>
              <span className="mt-1 text-xs font-semibold text-emerald-200">
                dari {target}
              </span>
              <span className="mt-0.5 text-[10px] text-amber-300 uppercase tracking-widest font-bold">
                Ketuk Untuk Menghitung
              </span>
            </div>
          </button>
        </div>

        {/* Rounds and Controls Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="text-left text-xs text-slate-500 dark:text-slate-400">
            <p>Putaran Selesai: <strong className="text-slate-800 dark:text-slate-200">{roundCompleted}x</strong></p>
            <p className="text-[11px] text-slate-400">Total: {roundCompleted * target + count} kali</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                soundEnabled
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'border-slate-200 text-slate-400 dark:border-slate-800'
              }`}
              title={soundEnabled ? 'Matikan Suara Klik' : 'Aktifkan Suara Klik'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Vibration Toggle */}
            <button
              onClick={() => setVibrateEnabled(!vibrateEnabled)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                vibrateEnabled
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'border-slate-200 text-slate-400 dark:border-slate-800'
              }`}
              title={vibrateEnabled ? 'Matikan Getaran' : 'Aktifkan Getaran'}
            >
              <Smartphone className="h-4 w-4" />
            </button>

            {/* Reset Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-rose-400 hover:text-rose-600 dark:border-slate-800 dark:text-slate-300"
              title="Reset hitungan ke 0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Konfirmasi Reset Hitungan
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin mengatur ulang hitungan zikir saat ini kembali ke 0?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Drawer / Modal */}
      {showHistory && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Riwayat Putaran Zikir Selesai
            </h3>
            <div className="flex items-center gap-2">
              {historyList.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus Riwayat</span>
                </button>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Tutup
              </button>
            </div>
          </div>

          <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
            {historyList.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                Belum ada putaran zikir yang tercatat. Selesaikan hitungan hingga target untuk menyimpan riwayat.
              </p>
            ) : (
              historyList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs dark:bg-slate-800/60"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.dhikrName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(item.completedAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} · {new Date(item.completedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    +{item.count}x
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
