import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Heart,
  HelpCircle,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SubView } from '../types';

interface MoreMenuHubViewProps {
  onNavigateToSubView: (view: SubView) => void;
  onOpenBookmarks: () => void;
}

export const MoreMenuHubView: React.FC<MoreMenuHubViewProps> = ({
  onNavigateToSubView,
  onOpenBookmarks,
}) => {
  const menuGroups = [
    {
      groupTitle: 'Ibadah & Doa',
      items: [
        {
          id: 'doa',
          label: 'Kumpulan Doa & Dzikir',
          description: 'Doa harian, dzikir pagi & petang (Al-Matsurat), istighfar dan selawat',
          icon: Heart,
          action: () => onNavigateToSubView('doa'),
        },
        {
          id: 'tasbih',
          label: 'Tasbih Digital Interaktif',
          description: 'Penghitung zikir dengan getaran haptic dan simulasi suara klik',
          icon: RotateCcw,
          action: () => onNavigateToSubView('tasbih'),
        },
        {
          id: 'jadwal-salat',
          label: 'Jadwal Salat & Arah Kiblat',
          description: 'Jadwal 5 waktu akurat, hitung mundur, dan kompas kiblat Ka\'bah',
          icon: Compass,
          action: () => onNavigateToSubView('jadwal-salat'),
        },
        {
          id: 'mutabaah',
          label: 'Mutaba\'ah Target Ibadah',
          description: 'Evaluasi amalan harian fardhu dan sunnah serta streak hari',
          icon: CheckCircle2,
          action: () => onNavigateToSubView('mutabaah'),
        },
      ],
    },
    {
      groupTitle: 'Pribadi & Kebaikan',
      items: [
        {
          id: 'catatan',
          label: 'Catatan & Jurnal Muslim',
          description: 'Dokumentasi tadabbur ayat, faedah kajian, dan refleksi pribadi',
          icon: FileText,
          action: () => onNavigateToSubView('catatan'),
        },
        {
          id: 'bookmarks',
          label: 'Daftar Penanda (Bookmark)',
          description: 'Koleksi ayat Al-Qur\'an, hadis, dan doa yang Anda simpan',
          icon: Bookmark,
          action: onOpenBookmarks,
        },
        {
          id: 'donasi',
          label: 'Infaq, Sedekah & Wakaf',
          description: 'Program kebaikan transparan untuk santri dhuafa & fasilitas masjid',
          icon: ShieldCheck,
          action: () => onNavigateToSubView('donasi'),
        },
      ],
    },
    {
      groupTitle: 'Aplikasi',
      items: [
        {
          id: 'pengaturan',
          label: 'Pengaturan & Sumber Data',
          description: 'Ukuran font Arab, metode hisab salat, sumber rujukan, dan reset data',
          icon: Settings,
          action: () => onNavigateToSubView('pengaturan'),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Menu & Layanan Lainnya
        </h1>
        <p className="mt-1 text-xs text-emerald-200">
          Seluruh perkakas ibadah, jurnal, penanda bacaan, dan pengaturan dalam satu tempat
        </p>
      </div>

      {/* Menu Groups */}
      {menuGroups.map((group, gIdx) => (
        <section key={gIdx} className="space-y-2">
          <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {group.groupTitle}
          </h2>

          <div className="space-y-2">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-emerald-500 hover:shadow-xs active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600 dark:active:bg-slate-800/80"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      item.action();
                    }
                  }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                        {item.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
