import React, { useState } from 'react';
import { Check, MapPin, Navigation, Search, X } from 'lucide-react';
import { CityLocation } from '../types';
import { INDONESIAN_CITIES } from '../utils/prayerTimes';

interface CitySelectorModalProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onClose: () => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  currentCity,
  onSelectCity,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const filteredCities = INDONESIAN_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.province && c.province.toLowerCase().includes(search.toLowerCase())) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi GPS tidak didukung di perangkat ini.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let tz = 7;
        let tzLabel = 'WIB';
        if (lng >= 115 && lng < 125) {
          tz = 8;
          tzLabel = 'WITA';
        } else if (lng >= 125) {
          tz = 9;
          tzLabel = 'WIT';
        }

        const custom: CityLocation = {
          id: 'custom-gps',
          name: 'Lokasi GPS Saya',
          province: `Lat ${lat.toFixed(2)}°, Lng ${lng.toFixed(2)}°`,
          country: 'Indonesia',
          latitude: lat,
          longitude: lng,
          timezone: tz,
          timezoneLabel: tzLabel,
        };
        onSelectCity(custom);
        onClose();
      },
      () => {
        setGpsLoading(false);
        alert('Izin lokasi ditolak atau sinyal GPS tidak tersedia.');
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pilih Lokasi Kota
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Menyesuaikan jadwal waktu salat & arah kiblat
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & GPS Button */}
        <div className="p-4 space-y-2 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik nama kota (Jakarta, Surabaya, Makassar, Padang)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleUseGps}
            disabled={gpsLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
          >
            <Navigation className={`h-3.5 w-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Mendeteksi Koordinat GPS...' : 'Gunakan Koordinat GPS Otomatis'}</span>
          </button>
        </div>

        {/* City List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {filteredCities.map((city) => {
            const isSelected = currentCity.id === city.id;
            return (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`h-4 w-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold">{city.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {city.province ? `${city.province}, ` : ''}{city.country} ({city.timezoneLabel})
                    </p>
                  </div>
                </div>

                {isSelected && <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
