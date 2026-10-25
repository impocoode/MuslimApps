import React, { useState, useEffect } from 'react';
import { Award, Calendar, Check, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { DEFAULT_MUTABAAH_ITEMS } from '../data/donationPrograms';
import { soundService } from '../utils/audio';

export const MutabaahView: React.FC = () => {
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`muslim_app_mutabaah_${todayKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_streak_days');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`muslim_app_mutabaah_${todayKey}`, JSON.stringify(completedItems));
    } catch {
      // ignore
    }
  }, [completedItems, todayKey]);

  const toggleItem = (id: string) => {
    soundService.playTasbihClick();
    soundService.vibrate(20);
    setCompletedItems((prev) => {
      const isAlready = prev.includes(id);
      const updated = isAlready ? prev.filter((i) => i !== id) : [...prev, id];
      if (!isAlready && updated.length === DEFAULT_MUTABAAH_ITEMS.length) {
        soundService.playTargetChime();
      }
      return updated;
    });
  };

  const handleResetToday = () => {
    if (confirm('Atur ulang seluruh checklist amalan hari ini?')) {
      setCompletedItems([]);
    }
  };

  const total = DEFAULT_MUTABAAH_ITEMS.length;
  const completed = completedItems.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categories = ['Fardhu', 'Sunnah', 'Al-Qur\'an', 'Amalan Sosial'] as const;

  return (
    <div className="space-y-5 pb-20">
      {/* Header Card */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Mutaba'ah Yaumiyah
            </h1>
            <p className="mt-1 text-xs text-emerald-200">
              Evaluasi & pelacak target ibadah harian untuk menjaga istiqamah
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-amber-300">
            <Award className="h-4 w-4" />
            <span>{streakDays} Hari Beruntun</span>
          </div>
        </div>

        {/* Progress Bar & Metric */}
        <div className="mt-5 rounded-xl bg-black/25 p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-200">
              Pencapaian Hari Ini: <strong>{completed} dari {total} Amalan</strong>
            </span>
            <span className="font-mono text-base font-bold text-amber-300">{percent}%</span>
          </div>

          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-200/80">
            <span>
              {percent === 100
                ? 'Alhamdulillah! Seluruh target amalan hari ini tuntas sempurna.'
                : 'Lanjutkan dengan niat ikhlas lillahi ta\'ala.'}
            </span>
            {completed > 0 && (
              <button
                onClick={handleResetToday}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
                title="Reset checklist hari ini"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Amalan List by Category */}
      <div className="space-y-4">
        {categories.map((category) => {
          const itemsInCat = DEFAULT_MUTABAAH_ITEMS.filter((i) => i.category === category);
          const catCompleted = itemsInCat.filter((i) => completedItems.includes(i.id)).length;

          return (
            <div
              key={category}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {category}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {catCompleted}/{itemsInCat.length} Selesai
                </span>
              </div>

              <div className="mt-2.5 space-y-2">
                {itemsInCat.map((item) => {
                  const isChecked = completedItems.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition-all ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 dark:border-emerald-600 dark:bg-emerald-950/20 dark:text-white'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`font-medium ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                        {item.label}
                      </span>

                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
