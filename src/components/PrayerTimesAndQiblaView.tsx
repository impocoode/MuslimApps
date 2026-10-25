import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Info,
  MapPin,
  Navigation,
  RefreshCw,
  Sliders,
  Volume2,
} from 'lucide-react';
import {
  AppSettings,
  CalculationMethodId,
  CityLocation,
  PrayerSchedule,
} from '../types';
import {
  CALCULATION_METHODS,
  calculatePrayerTimes,
  calculateQiblaDirection,
  INDONESIAN_CITIES,
} from '../utils/prayerTimes';
import { soundService } from '../utils/audio';

interface PrayerTimesAndQiblaViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenCitySelector: () => void;
}

export const PrayerTimesAndQiblaView: React.FC<PrayerTimesAndQiblaViewProps> = ({
  settings,
  onUpdateSettings,
  onOpenCitySelector,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'qibla'>('schedule');
  const [schedule, setSchedule] = useState<PrayerSchedule>(() =>
    calculatePrayerTimes(settings.selectedCity, settings.calculationMethod)
  );

  // Qibla angle calculation from city coordinates
  const qiblaAngle = calculateQiblaDirection(
    settings.selectedCity.latitude,
    settings.selectedCity.longitude
  );

  // Compass state
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassPermissionGranted, setCompassPermissionGranted] = useState<boolean>(false);
  const [compassSupported, setCompassSupported] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [adzanTestPlaying, setAdzanTestPlaying] = useState<boolean>(false);

  // Update schedule every second for real-time countdown
  useEffect(() => {
    const update = () => {
      setSchedule(
        calculatePrayerTimes(settings.selectedCity, settings.calculationMethod)
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [settings.selectedCity, settings.calculationMethod]);

  // Request compass sensor
  const requestCompassPermission = async () => {
    if (typeof window === 'undefined') return;

    // iOS 13+ DeviceOrientationEvent permission request
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (DeviceOrientation && typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission();
        if (response === 'granted') {
          setCompassPermissionGranted(true);
          initCompassListener();
        }
      } catch {
        setCompassPermissionGranted(false);
      }
    } else if ('ondeviceorientationabsolute' in window || 'ondeviceorientation' in window) {
      setCompassPermissionGranted(true);
      initCompassListener();
    } else {
      setCompassSupported(false);
    }
  };

  const initCompassListener = () => {
    setCompassSupported(true);
    const handler = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;
      // webkitCompassHeading is standard on iOS devices (0-360 from magnetic North)
      if ('webkitCompassHeading' in event && typeof (event as any).webkitCompassHeading === 'number') {
        heading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Standard Android: alpha is compass rotation around Z axis
        heading = 360 - event.alpha;
      }

      if (heading !== null) {
        setDeviceHeading(Math.round(heading));
      }
    };

    window.addEventListener('deviceorientation', handler, true);
  };

  // Request GPS Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung geolokasi GPS.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Determine approximate Indonesian timezone
        let tz = 7;
        let tzLabel = 'WIB';
        if (lng >= 115 && lng < 125) {
          tz = 8;
          tzLabel = 'WITA';
        } else if (lng >= 125) {
          tz = 9;
          tzLabel = 'WIT';
        }

        const customCity: CityLocation = {
          id: 'custom-gps',
          name: `Lokasi GPS Saya`,
          province: `Lat: ${lat.toFixed(2)}°, Lng: ${lng.toFixed(2)}°`,
          country: 'Indonesia',
          latitude: lat,
          longitude: lng,
          timezone: tz,
          timezoneLabel: tzLabel,
        };

        onUpdateSettings({ selectedCity: customCity });
      },
      (err) => {
        setGpsLoading(false);
        setGpsError('Tidak dapat mengakses lokasi. Silakan pilih kota secara manual.');
      },
      { timeout: 8000 }
    );
  };

  const testAdzanTone = () => {
    setAdzanTestPlaying(true);
    soundService.playAdzanChime();
    setTimeout(() => setAdzanTestPlaying(false), 2000);
  };

  const prayerCards = [
    { name: 'Subuh', time: schedule.fajr, isNext: schedule.nextPrayerName.startsWith('Subuh'), desc: 'Awal fajar shadiq hingga terbit matahari' },
    { name: 'Terbit', time: schedule.sunrise, isNext: schedule.nextPrayerName.startsWith('Terbit'), desc: 'Waktu syuruq berakhirnya Subuh' },
    { name: 'Zuhur', time: schedule.dhuhr, isNext: schedule.nextPrayerName.startsWith('Zuhur'), desc: 'Tergelincir matahari hingga bayangan sama panjang' },
    { name: 'Asar', time: schedule.asr, isNext: schedule.nextPrayerName.startsWith('Asar'), desc: 'Bayangan melebihi panjang benda hingga terbenam matahari' },
    { name: 'Magrib', time: schedule.maghrib, isNext: schedule.nextPrayerName.startsWith('Magrib'), desc: 'Terbenam matahari sempurna hingga hilang mega merah' },
    { name: 'Isya', time: schedule.isha, isNext: schedule.nextPrayerName.startsWith('Isya'), desc: 'Hilangnya mega merah hingga pertengahan malam' },
  ];

  // Relative needle angle: if device orientation is known, needle points to qiblaAngle - deviceHeading
  const needleAngle = deviceHeading !== null
    ? (qiblaAngle - deviceHeading + 360) % 360
    : qiblaAngle;

  const isAlignedWithQibla = deviceHeading !== null && Math.abs(needleAngle) < 4;

  return (
    <div className="space-y-4 pb-20">
      {/* View Switcher: Jadwal Salat vs Kompas Kiblat */}
      <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
            activeTab === 'schedule'
              ? 'bg-white text-emerald-800 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Jadwal Salat Harian
        </button>
        <button
          onClick={() => {
            setActiveTab('qibla');
            requestCompassPermission();
          }}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
            activeTab === 'qibla'
              ? 'bg-white text-emerald-800 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Kompas Arah Kiblat
        </button>
      </div>

      {activeTab === 'schedule' ? (
        /* TAB 1: JADWAL SALAT */
        <div className="space-y-4">
          {/* Header Card */}
          <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-5 text-white dark:border-emerald-700/20">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs text-emerald-300">
                  {schedule.hijriFormatted} · {schedule.dateFormatted}
                </p>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-white">
                  Jadwal Salat {settings.selectedCity.name}
                </h1>
                <p className="text-xs text-emerald-200/90">
                  Koordinat: {settings.selectedCity.latitude.toFixed(2)}°, {settings.selectedCity.longitude.toFixed(2)}° ({settings.selectedCity.timezoneLabel})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
                >
                  <Navigation className={`h-3.5 w-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{gpsLoading ? 'Mencari GPS...' : 'Gunakan GPS'}</span>
                </button>
                <button
                  onClick={onOpenCitySelector}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Pilih Kota</span>
                </button>
              </div>
            </div>

            {gpsError && (
              <p className="mt-3 text-xs text-amber-200 bg-black/20 p-2 rounded-lg">
                {gpsError}
              </p>
            )}

            {/* Next Prayer Countdown Callout */}
            <div className="mt-4 rounded-xl bg-black/25 p-3.5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-300" />
                <span className="text-xs text-emerald-200">
                  Salat Berikutnya: <strong>{schedule.nextPrayerName}</strong> ({schedule.nextPrayerTimeFormatted})
                </span>
              </div>
              <button
                onClick={testAdzanTone}
                className="flex items-center gap-1 text-xs text-amber-300 hover:underline"
                title="Uji coba pengingat suara adzan"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{adzanTestPlaying ? 'Memutar...' : 'Tes Nada'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Prayer Times Rows */}
          <div className="space-y-2.5">
            {prayerCards.map((item) => (
              <div
                key={item.name}
                className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                  item.isNext
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs dark:border-emerald-500 dark:bg-emerald-950/40'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                      item.isNext
                        ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h2>
                      {item.isNext && (
                        <span className="rounded-md bg-emerald-700 px-1.5 py-0.2 text-[10px] font-bold text-white dark:bg-emerald-600">
                          Waktu Berikutnya
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {item.time}
                  </span>
                  <p className="text-[10px] text-slate-400">{settings.selectedCity.timezoneLabel}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Method Selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Metode Perhitungan Hisab Waktu Salat
              </span>
              <Sliders className="h-4 w-4 text-slate-400" />
            </div>

            <div className="mt-3 space-y-2">
              {CALCULATION_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => onUpdateSettings({ calculationMethod: method.id })}
                  className={`flex w-full items-start justify-between rounded-xl border p-2.5 text-left text-xs transition-colors ${
                    settings.calculationMethod === method.id
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-100'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{method.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{method.description}</p>
                  </div>
                  {settings.calculationMethod === method.id && (
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: KOMPAS ARAH KIBLAT */
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-5 text-white dark:border-emerald-700/20">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Arah Kiblat Menuju Ka'bah
            </h1>
            <p className="mt-1 text-xs text-emerald-200">
              Ka'bah Al-Musyarrafah: 21° 25' LU, 39° 49' BT (Makkah Al-Mukarramah)
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-black/25 p-3 border border-white/10">
                <p className="text-emerald-300">Derajat Kiblat dari Utara</p>
                <p className="mt-0.5 font-mono text-xl font-bold text-amber-300">
                  {qiblaAngle}°
                </p>
                <p className="text-[10px] text-slate-300">Dari {settings.selectedCity.name}</p>
              </div>

              <div className="rounded-xl bg-black/25 p-3 border border-white/10">
                <p className="text-emerald-300">Arah Hadap Perangkat</p>
                <p className="mt-0.5 font-mono text-xl font-bold text-white">
                  {deviceHeading !== null ? `${deviceHeading}°` : 'Sensor Standby'}
                </p>
                <p className="text-[10px] text-slate-300">
                  {deviceHeading !== null ? 'Sensor Aktif' : 'Pegang HP Rata'}
                </p>
              </div>
            </div>
          </div>

          {/* Compass Dial Stage */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {isAlignedWithQibla && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 animate-pulse">
                <Check className="h-3.5 w-3.5" />
                <span>Posisi Tepat Menghadap Kiblat!</span>
              </div>
            )}

            {/* Compass Circle */}
            <div className="relative mx-auto my-4 flex h-64 w-64 items-center justify-center rounded-full border-4 border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              {/* North, East, South, West labels */}
              <span className="absolute top-2 font-bold text-xs text-rose-600">U (0°)</span>
              <span className="absolute right-2 font-bold text-xs text-slate-400">T (90°)</span>
              <span className="absolute bottom-2 font-bold text-xs text-slate-400">S (180°)</span>
              <span className="absolute left-2 font-bold text-xs text-slate-400">B (270°)</span>

              {/* Ka'bah Needle Pointer (Rotates towards qibla angle) */}
              <div
                className="relative h-48 w-48 transition-transform duration-300 ease-out flex items-center justify-center"
                style={{
                  transform: `rotate(${needleAngle}deg)`,
                }}
              >
                {/* Pointer Tip to Kaaba */}
                <div className="absolute top-0 flex flex-col items-center">
                  {/* Kaaba Icon Box */}
                  <div className="h-6 w-6 rounded-md bg-slate-950 border border-amber-400 flex items-center justify-center shadow-md">
                    <span className="text-[9px] font-bold text-amber-300">🕋</span>
                  </div>
                  {/* Arrow Pointing */}
                  <div className="h-0 w-0 border-x-6 border-x-transparent border-b-10 border-b-emerald-600" />
                </div>

                {/* Compass Needle Body */}
                <div className="h-32 w-1.5 rounded-full bg-gradient-to-b from-emerald-600 via-emerald-400 to-slate-400" />

                {/* Center Pivot */}
                <div className="absolute h-5 w-5 rounded-full bg-slate-900 border-2 border-white dark:border-slate-700 shadow-md" />
              </div>
            </div>

            <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              Arah Kiblat: {qiblaAngle}° (Barat Laut dari Indonesia)
            </p>

            {/* Calibration & Sensor Advice */}
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-400">
                <Info className="h-4 w-4" />
                <span>Petunjuk Kalibrasi Sensor:</span>
              </div>
              <ul className="mt-2 list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                <li>Letakkan smartphone di permukaan datar mendatar (horizontal) dan jauhkan dari benda logam bermagnet.</li>
                <li>Jika arah kompas belum stabil, gerakkan perangkat membentuk angka 8 di udara untuk kalibrasi sensor medan magnet.</li>
                <li>Sudut matematis dihitung berdasarkan rumus trigonometri bola koordinat lintang dan bujur kota {settings.selectedCity.name}.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
