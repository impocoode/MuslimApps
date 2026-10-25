import { CalculationMethod, CalculationMethodId, CityLocation, PrayerSchedule } from '../types';

export const CALCULATION_METHODS: CalculationMethod[] = [
  {
    id: 'kemenag',
    name: 'Kementerian Agama RI (Kemenag)',
    fajrAngle: 20,
    ishaAngle: 18,
    description: 'Standar resmi Republik Indonesia (Subuh 20°, Isya 18°)',
  },
  {
    id: 'mwl',
    name: 'Muslim World League (MWL)',
    fajrAngle: 18,
    ishaAngle: 17,
    description: 'Liga Muslim Dunia (Eropa, Timur Tengah, dan sebagian Asia)',
  },
  {
    id: 'egypt',
    name: 'Egyptian General Authority of Survey',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
    description: 'Otoritas Umum Survei Mesir (Afrika & Semenanjung Arab)',
  },
  {
    id: 'makkah',
    name: 'Umm Al-Qura University, Makkah',
    fajrAngle: 18.5,
    ishaAngle: 19, // ~90 min interval
    description: 'Universitas Umm Al-Qura Makkah Al-Mukarramah',
  },
  {
    id: 'isna',
    name: 'Islamic Society of North America (ISNA)',
    fajrAngle: 15,
    ishaAngle: 15,
    description: 'Amerika Utara dan belahan barat',
  },
];

export const INDONESIAN_CITIES: CityLocation[] = [
  { id: 'jkt', name: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'bdg', name: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', latitude: -6.9175, longitude: 107.6191, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'sby', name: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.2575, longitude: 112.7521, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'mdn', name: 'Medan', province: 'Sumatera Utara', country: 'Indonesia', latitude: 3.5952, longitude: 98.6722, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'smg', name: 'Semarang', province: 'Jawa Tengah', country: 'Indonesia', latitude: -6.9667, longitude: 110.4167, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'mks', name: 'Makassar', province: 'Sulawesi Selatan', country: 'Indonesia', latitude: -5.1477, longitude: 119.4327, timezone: 8, timezoneLabel: 'WITA' },
  { id: 'plg', name: 'Palembang', province: 'Sumatera Selatan', country: 'Indonesia', latitude: -2.9909, longitude: 104.7565, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'pdg', name: 'Padang', province: 'Sumatera Barat', country: 'Indonesia', latitude: -0.9471, longitude: 100.4172, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'btm', name: 'Batam', province: 'Kepulauan Riau', country: 'Indonesia', latitude: 1.0456, longitude: 104.0305, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'pku', name: 'Pekanbaru', province: 'Riau', country: 'Indonesia', latitude: 0.5071, longitude: 101.4478, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'btj', name: 'Banda Aceh', province: 'Aceh', country: 'Indonesia', latitude: 5.5483, longitude: 95.3238, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'dps', name: 'Denpasar', province: 'Bali', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezone: 8, timezoneLabel: 'WITA' },
  { id: 'bjm', name: 'Banjarmasin', province: 'Kalimantan Selatan', country: 'Indonesia', latitude: -3.3167, longitude: 114.5901, timezone: 8, timezoneLabel: 'WITA' },
  { id: 'bpn', name: 'Balikpapan', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -1.2379, longitude: 116.8289, timezone: 8, timezoneLabel: 'WITA' },
  { id: 'ptk', name: 'Pontianak', province: 'Kalimantan Barat', country: 'Indonesia', latitude: -0.0263, longitude: 109.3425, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'mnd', name: 'Manado', province: 'Sulawesi Utara', country: 'Indonesia', latitude: 1.4748, longitude: 124.8428, timezone: 8, timezoneLabel: 'WITA' },
  { id: 'mtr', name: 'Mataram (Lombok)', province: 'NTB', country: 'Indonesia', latitude: -8.5833, longitude: 116.1167, timezone: 8, timezoneLabel: 'WITA' },
  { id: 'yog', name: 'Yogyakarta', province: 'DI Yogyakarta', country: 'Indonesia', latitude: -7.7956, longitude: 110.3695, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'slo', name: 'Surakarta (Solo)', province: 'Jawa Tengah', country: 'Indonesia', latitude: -7.5755, longitude: 110.8243, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'smd', name: 'Samarinda', province: 'Kalimantan Timur', country: 'Indonesia', latitude: -0.5021, longitude: 117.1537, timezone: 8, timezoneLabel: 'WITA' },
  { id: 'mlg', name: 'Malang', province: 'Jawa Timur', country: 'Indonesia', latitude: -7.9797, longitude: 112.6304, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'bdl', name: 'Bandar Lampung', province: 'Lampung', country: 'Indonesia', latitude: -5.4500, longitude: 105.2667, timezone: 7, timezoneLabel: 'WIB' },
  { id: 'amb', name: 'Ambon', province: 'Maluku', country: 'Indonesia', latitude: -3.6547, longitude: 128.1906, timezone: 9, timezoneLabel: 'WIT' },
  { id: 'jpr', name: 'Jayapura', province: 'Papua', country: 'Indonesia', latitude: -2.5337, longitude: 140.7181, timezone: 9, timezoneLabel: 'WIT' },
  { id: 'mkk', name: 'Makkah Al-Mukarramah', province: 'Makkah', country: 'Arab Saudi', latitude: 21.4225, longitude: 39.8262, timezone: 3, timezoneLabel: 'AST' },
  { id: 'mdh', name: 'Madinah Al-Munawwarah', province: 'Madinah', country: 'Arab Saudi', latitude: 24.4672, longitude: 39.6112, timezone: 3, timezoneLabel: 'AST' },
];

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206,
};

// Calculate Qibla angle from given user coordinates
export function calculateQiblaDirection(latitude: number, longitude: number): number {
  const phiK = (KAABA_COORDINATES.latitude * Math.PI) / 180;
  const lambdaK = (KAABA_COORDINATES.longitude * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;
  const lambda = (longitude * Math.PI) / 180;

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;
  return Math.round(qibla * 10) / 10;
}

// Convert Julian Day to Hijri Date (Kuwaiti algorithm adaptation)
export function getHijriDate(date: Date = new Date()): { day: number; monthName: string; year: number; formatted: string } {
  const hijriMonths = [
    'Muharram', 'Safar', 'Rabi\'ul Awwal', 'Rabi\'ul Akhir',
    'Jumadil Ula', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
    'Ramadhan', 'Syawal', 'Dzulqa\'dah', 'Dzulhijjah'
  ];

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  const z = Math.floor(jd + 0.5);
  const epoch = 1948440; // Julian day of 1 Muharram 1 AH
  const islamicDay = z - epoch;

  const hYear = Math.floor((30 * islamicDay + 10646) / 10631);
  const priorDays = Math.floor((hYear - 1) * 354 + Math.floor((3 + 11 * (hYear - 1)) / 30));
  let dayInYear = islamicDay - priorDays;
  if (dayInYear <= 0) {
    dayInYear += 354;
  }

  let hMonth = 0;
  let accumulatedDays = 0;
  for (let i = 0; i < 12; i++) {
    const monthLength = (i % 2 === 0) ? 30 : 29;
    if (accumulatedDays + monthLength >= dayInYear) {
      hMonth = i;
      break;
    }
    accumulatedDays += monthLength;
  }

  const hDay = Math.max(1, Math.min(30, dayInYear - accumulatedDays));
  const monthName = hijriMonths[hMonth] || hijriMonths[0];

  return {
    day: hDay,
    monthName,
    year: hYear,
    formatted: `${hDay} ${monthName} ${hYear} H`,
  };
}

// Format double hours to HH:MM string
function formatHoursToTime(hours: number): string {
  let h = Math.floor(hours) % 24;
  let m = Math.floor((hours - Math.floor(hours)) * 60);
  if (h < 0) h += 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Convert double hours to timestamp for today
function hoursToTimestamp(hours: number, date: Date, timezoneOffsetHours: number): number {
  const d = new Date(date);
  // Set UTC base
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;

  d.setHours(h, m, 0, 0);
  return d.getTime();
}

// Solar declination & equation of time
function getSolarCoordinates(jd: number) {
  const d = jd - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * Math.sin((g * Math.PI) / 180) + 0.02 * Math.sin((2 * g * Math.PI) / 180)) % 360;

  const e = 23.439 - 0.00000036 * d;
  const sinDelta = Math.sin((e * Math.PI) / 180) * Math.sin((L * Math.PI) / 180);
  const delta = (Math.asin(sinDelta) * 180) / Math.PI;

  const RA = (Math.atan2(Math.cos((e * Math.PI) / 180) * Math.sin((L * Math.PI) / 180), Math.cos((L * Math.PI) / 180)) * 180) / 180;
  const eqTime = (q / 15 - RA) * 4; // minutes

  return { declination: delta, equationOfTime: eqTime };
}

// Main prayer schedule calculation
export function calculatePrayerTimes(
  location: CityLocation,
  methodId: CalculationMethodId = 'kemenag',
  date: Date = new Date()
): PrayerSchedule {
  const method = CALCULATION_METHODS.find((m) => m.id === methodId) || CALCULATION_METHODS[0];

  const lat = location.latitude;
  const lng = location.longitude;
  const tz = location.timezone;

  // Julian date
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 - 0.5;

  const solar = getSolarCoordinates(jd);
  const dec = (solar.declination * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // Midday / Solar Noon
  const noon = 12 + tz - lng / 15 - solar.equationOfTime / 60;

  // Helper for angle times
  const timeForAngle = (angle: number, direction: 'morning' | 'evening'): number => {
    const angleRad = (angle * Math.PI) / 180;
    const cosHourAngle = (-Math.sin(angleRad) - Math.sin(latRad) * Math.sin(dec)) / (Math.cos(latRad) * Math.cos(dec));
    if (cosHourAngle > 1) return noon; // sun never rises to this angle
    if (cosHourAngle < -1) return noon; // sun never sets to this angle
    const hourAngle = (Math.acos(cosHourAngle) * 180) / Math.PI / 15;
    return direction === 'morning' ? noon - hourAngle : noon + hourAngle;
  };

  // Asr calculation (Shafi'i: shadow = 1)
  const asrAngleRad = Math.atan(1 + Math.tan(Math.abs(latRad - dec)));
  const cosAsrHourAngle = (Math.sin(asrAngleRad) - Math.sin(latRad) * Math.sin(dec)) / (Math.cos(latRad) * Math.cos(dec));
  let asrHourAngle = 0;
  if (cosAsrHourAngle >= -1 && cosAsrHourAngle <= 1) {
    asrHourAngle = (Math.acos(cosAsrHourAngle) * 180) / Math.PI / 15;
  }

  // Sunrise and Sunset (approx 0.833° depression for refraction)
  const sunrise = timeForAngle(0.833, 'morning');
  const sunset = timeForAngle(0.833, 'evening');

  // Fajr & Isha
  const fajr = timeForAngle(method.fajrAngle, 'morning');
  const asr = noon + asrHourAngle;
  const maghrib = sunset + (2 / 60); // 2 min ihtiyat
  const isha = timeForAngle(method.ishaAngle, 'evening') + (2 / 60);
  const dhuhr = noon + (2 / 60); // 2 min ihtiyat

  const fajrTs = hoursToTimestamp(fajr, date, tz);
  const sunriseTs = hoursToTimestamp(sunrise, date, tz);
  const dhuhrTs = hoursToTimestamp(dhuhr, date, tz);
  const asrTs = hoursToTimestamp(asr, date, tz);
  const maghribTs = hoursToTimestamp(maghrib, date, tz);
  const ishaTs = hoursToTimestamp(isha, date, tz);

  const now = date.getTime();
  let nextPrayerName = 'Subuh';
  let nextPrayerTimeFormatted = formatHoursToTime(fajr);
  let nextTimestamp = fajrTs;

  if (now < fajrTs) {
    nextPrayerName = 'Subuh';
    nextPrayerTimeFormatted = formatHoursToTime(fajr);
    nextTimestamp = fajrTs;
  } else if (now < sunriseTs) {
    nextPrayerName = 'Terbit (Syuruq)';
    nextPrayerTimeFormatted = formatHoursToTime(sunrise);
    nextTimestamp = sunriseTs;
  } else if (now < dhuhrTs) {
    nextPrayerName = 'Zuhur';
    nextPrayerTimeFormatted = formatHoursToTime(dhuhr);
    nextTimestamp = dhuhrTs;
  } else if (now < asrTs) {
    nextPrayerName = 'Asar';
    nextPrayerTimeFormatted = formatHoursToTime(asr);
    nextTimestamp = asrTs;
  } else if (now < maghribTs) {
    nextPrayerName = 'Magrib';
    nextPrayerTimeFormatted = formatHoursToTime(maghrib);
    nextTimestamp = maghribTs;
  } else if (now < ishaTs) {
    nextPrayerName = 'Isya';
    nextPrayerTimeFormatted = formatHoursToTime(isha);
    nextTimestamp = ishaTs;
  } else {
    // Tomorrow Fajr
    nextPrayerName = 'Subuh (Besok)';
    nextPrayerTimeFormatted = formatHoursToTime(fajr);
    nextTimestamp = fajrTs + 24 * 60 * 60 * 1000;
  }

  const countdownSeconds = Math.max(0, Math.floor((nextTimestamp - now) / 1000));

  // Date format
  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const hijri = getHijriDate(date);

  return {
    dateFormatted,
    hijriFormatted: hijri.formatted,
    fajr: formatHoursToTime(fajr),
    sunrise: formatHoursToTime(sunrise),
    dhuhr: formatHoursToTime(dhuhr),
    asr: formatHoursToTime(asr),
    maghrib: formatHoursToTime(maghrib),
    isha: formatHoursToTime(isha),
    fajrTimestamp: fajrTs,
    sunriseTimestamp: sunriseTs,
    dhuhrTimestamp: dhuhrTs,
    asrTimestamp: asrTs,
    maghribTimestamp: maghribTs,
    ishaTimestamp: ishaTs,
    nextPrayerName,
    nextPrayerTimeFormatted,
    countdownSeconds,
  };
}
