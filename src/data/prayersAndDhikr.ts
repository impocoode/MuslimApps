import { PrayerDhikrItem } from '../types';

export const PRAYERS_AND_DHIKR: PrayerDhikrItem[] = [
  // --- BANGUN TIDUR ---
  {
    id: 'doa-bangun-tidur',
    category: 'Bangun Tidur',
    title: 'Doa Ketika Bangun Tidur',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alhamdulillahillazi ahyana ba\'da ma amatana wa ilaihin-nusyur',
    translationId: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami (tidur), dan hanya kepada-Nya kami akan dibangkitkan.',
    source: 'HR. Bukhari no. 6312 & Muslim no. 2711',
    benefits: 'Mengawali hari dengan rasa syukur atas nikmat ruh yang dikembalikan ke dalam jasad.',
    repeatCount: 1
  },
  {
    id: 'doa-sebelum-tidur',
    category: 'Bangun Tidur',
    title: 'Doa Sebelum Tidur',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    latin: 'Bismikallahumma amutu wa ahya',
    translationId: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    source: 'HR. Bukhari no. 6324 & Muslim no. 2711',
    benefits: 'Menyerahkan jiwa raga dalam perlindungan Allah sebelum terlelap.',
    repeatCount: 1
  },

  // --- MAKAN & MINUM ---
  {
    id: 'doa-sebelum-makan',
    category: 'Makan & Minum',
    title: 'Doa Sebelum Makan',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ، بِسْمِ اللَّهِ',
    latin: 'Allahumma barik lana fima razaqtana wa qina \'azaban-nar, bismillah',
    translationId: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka. Dengan nama Allah.',
    source: 'HR. Ibnu As-Sunni no. 457, Al-Adzkar An-Nawawi',
    benefits: 'Menghadirkan keberkahan dan mencegah setan ikut memakan hidangan.',
    repeatCount: 1
  },
  {
    id: 'doa-sesudah-makan',
    category: 'Makan & Minum',
    title: 'Doa Sesudah Makan',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latin: 'Alhamdulillahillazi ath\'amana wa saqana wa ja\'alana muslimin',
    translationId: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami termasuk orang-orang yang berserah diri (muslim).',
    source: 'HR. Abu Dawud no. 3850 & At-Tirmidzi no. 3457',
    benefits: 'Bentuk syukur atas nikmat rezeki dan kelestarian nikmat iman.',
    repeatCount: 1
  },

  // --- KAMAR MANDI ---
  {
    id: 'doa-masuk-wc',
    category: 'Kamar Mandi',
    title: 'Doa Masuk Kamar Mandi (WC)',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    latin: 'Allahumma inni a\'uzu bika minal-khubutsi wal-khaba\'its',
    translationId: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan setan laki-laki dan setan perempuan.',
    source: 'HR. Bukhari no. 142 & Muslim no. 375',
    benefits: 'Benteng diri dari pandangan dan godaan jin di tempat pembuangan hajat.',
    repeatCount: 1
  },
  {
    id: 'doa-keluar-wc',
    category: 'Kamar Mandi',
    title: 'Doa Keluar Kamar Mandi',
    arabic: 'غُفْرَانَكَ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي',
    latin: 'Ghufranaka, alhamdulillahillazi azhaba \'annil-aza wa \'afani',
    translationId: 'Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran dari tubuhku dan menyehatkanku.',
    source: 'HR. Abu Dawud no. 17 & At-Tirmidzi no. 7',
    benefits: 'Memohon ampunan Allah atas kelemahan diri dan bersyukur atas kesehatan saluran tubuh.',
    repeatCount: 1
  },

  // --- RUMAH ---
  {
    id: 'doa-keluar-rumah',
    category: 'Rumah',
    title: 'Doa Keluar Rumah',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: 'Bismillahi tawakkaltu \'alallah, la haula wa la quwwata illa billah',
    translationId: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan tiada kekuatan kecuali dengan pertolongan Allah semata.',
    source: 'HR. Abu Dawud no. 5095 & At-Tirmidzi no. 3426 (Shahih)',
    benefits: 'Malaikat akan menyeru: "Engkau telah diberi petunjuk, dicukupi, dan dilindungi", serta setan akan menjauh.',
    repeatCount: 1
  },
  {
    id: 'doa-masuk-rumah',
    category: 'Rumah',
    title: 'Doa Masuk Rumah',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    latin: 'Bismillahi walajna, wa bismillahi kharajna, wa \'ala rabbina tawakkalna',
    translationId: 'Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Tuhan kami, kami bertawakal.',
    source: 'HR. Abu Dawud no. 5096',
    benefits: 'Menghalangi setan bermalam di dalam rumah bersama penghuninya.',
    repeatCount: 1
  },

  // --- BELAJAR ---
  {
    id: 'doa-sebelum-belajar',
    category: 'Menuntut Ilmu',
    title: 'Doa Sebelum Belajar & Memohon Tambahan Ilmu',
    arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا، وَاجْعَلْنِي مِنَ الصَّالِحِينَ',
    latin: 'Rabbi zidni \'ilman warzuqni fahma, waj\'alni minas-salihin',
    translationId: 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan dan anugerahkanlah kepadaku pemahaman yang luas, serta jadikanlah aku termasuk golongan orang-orang yang shalih.',
    source: 'Intisari QS. Thaha: 114 & Doa Para Salaf',
    benefits: 'Membuka kelapangan dada dan ketajaman daya nalar dalam menyerap faedah ilmu.',
    repeatCount: 1
  },

  // --- ORANG TUA ---
  {
    id: 'doa-kedua-orang-tua',
    category: 'Orang Tua & Keluarga',
    title: 'Doa untuk Kedua Orang Tua',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbighfir li wa liwalidayya warhamhuma kama rabbayani saghira',
    translationId: 'Ya Tuhanku, ampunilah dosaku dan dosa kedua orang tuaku, dan sayangilah keduanya sebagaimana mereka telah menyayangi dan mendidikku sewaktu kecil.',
    source: 'QS. Al-Isra\': 24 & Hadis Birrul Walidain',
    benefits: 'Amalan bakti utama seorang anak shalih yang terus mengalirkan pahala ke alam kubur.',
    repeatCount: 3
  },

  // --- SAFAR (BEPERGIAN) ---
  {
    id: 'doa-bepergian-safar',
    category: 'Bepergian (Safar)',
    title: 'Doa Naik Kendaraan & Safar',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
    latin: 'Subhanallazi sakh-khara lana haza wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun',
    translationId: 'Mahasuci Allah yang telah menundukkan kendaraan ini bagi kami padahal sebelumnya kami tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    source: 'QS. Az-Zukhruf: 13-14 & HR. Muslim no. 1342',
    benefits: 'Menghindarkan musibah dalam perjalanan dan mengingatkan perjalanan hakiki menuju akhirat.',
    repeatCount: 1
  },

  // --- SAKIT ---
  {
    id: 'doa-ketika-sakit',
    category: 'Kesehatan & Sakit',
    title: 'Doa Memohon Kesembuhan (Ketika Sakit)',
    arabic: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    latin: 'Allahumma rabban-nas, azhibil-ba\'s, isyfi antasy-syafi, la syifa\'a illa syifa\'uka, syifa\'an la yughadiru saqama',
    translationId: 'Ya Allah, Tuhan seluruh manusia, hilangkanlah rasa sakit ini. Sembuhkanlah, Engkaulah Sang Maha Penyembuh. Tiada kesembuhan selain kesembuhan dari-Mu, kesembuhan yang tidak meninggalkan penyakit lagi.',
    source: 'HR. Bukhari no. 5743 & Muslim no. 2191',
    benefits: 'Doa ruqyah yang diajarkan Rasulullah SAW ketika menjenguk orang yang sakit.',
    repeatCount: 1
  },

  // --- PERLINDUNGAN ---
  {
    id: 'doa-perlindungan-marabahaya',
    category: 'Perlindungan',
    title: 'Doa Perlindungan Pagi & Sore dari Segala Bahaya',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    latin: 'Bismillahillazi la yadurru ma\'asmihi syai\'un fil-ardi wa la fis-sama\'i wa huwas-sami\'ul-\'alim',
    translationId: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun yang dapat memberi bahaya di bumi maupun di langit, dan Dialah Yang Maha Mendengar lagi Maha Mengetahui.',
    source: 'HR. Abu Dawud no. 5088 & At-Tirmidzi no. 3388 (Shahih)',
    benefits: 'Dibaca 3 kali pagi dan petang, terlindung dari racun, sihir, dan marabahaya mendadak.',
    repeatCount: 3
  },

  // --- SETELAH SALAT ---
  {
    id: 'doa-setelah-salat-fardhu',
    category: 'Setelah Salat',
    title: 'Dzikir Istighfar & Salam Selesai Salat Fardhu',
    arabic: 'أَسْتَغْفِرُ اللَّهَ (٣×)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
    latin: 'Astaghfirullah (3x). Allahumma antas-salam wa minkas-salam, tabarakta ya zal-jalali wal-ikram',
    translationId: 'Aku memohon ampun kepada Allah (3 kali). Ya Allah, Engkaulah Sang Pemilik Kedamaian dan dari-Mu lah segala kedamaian. Mahaberkah Engkau, wahai Tuhan Yang Memiliki Keagungan dan Kemuliaan.',
    source: 'HR. Muslim no. 591',
    benefits: 'Sunnah muakkadah yang diucapkan Rasulullah SAW begitu salam dari salat fardhu.',
    repeatCount: 1
  },

  // --- SAYYIDUL ISTIGHFAR ---
  {
    id: 'sayyidul-istighfar',
    category: 'Istighfar & Selawat',
    title: 'Sayyidul Istighfar (Penghulu Segala Istighfar)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    latin: 'Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mastatha\'tu, a\'uzu bika min syarri ma shana\'tu, abu\'u laka bini\'matika \'alayya, wa abu\'u bizanbi faghfir li fainnahu la yaghfiruz-zunuba illa anta',
    translationId: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah selain Engkau. Engkaulah yang menciptakanku dan aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang telah kuperbuat. Aku mengakui segala nikmat-Mu kepadaku dan aku mengakui segala dosaku, maka ampunilah aku. Sungguh tidak ada yang dapat mengampuni dosa-dosa selain Engkau.',
    source: 'HR. Bukhari no. 6306',
    benefits: 'Barangsiapa membacanya di sore hari dengan penuh keyakinan lalu meninggal di malam itu, maka ia termasuk penghuni surga; demikian pula jika dibaca di pagi hari.',
    repeatCount: 1
  },

  // --- SELAWAT NABI ---
  {
    id: 'selawat-ibrahimiyah',
    category: 'Istighfar & Selawat',
    title: 'Selawat Ibrahimiyah (Paling Utama)',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    latin: 'Allahumma shalli \'ala Muhammad wa \'ala ali Muhammad kama shallaita \'ala Ibrahim wa \'ala ali Ibrahim, innaka hamidum majid. Allahumma barik \'ala Muhammad wa \'ala ali Muhammad kama barakta \'ala Ibrahim wa \'ala ali Ibrahim, innaka hamidum majid',
    translationId: 'Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau telah melimpahkan rahmat kepada Nabi Ibrahim dan keluarga Nabi Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berkahilah Nabi Muhammad dan keluarga Nabi Muhammad, sebagaimana Engkau telah memberkahi Nabi Ibrahim dan keluarga Nabi Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
    source: 'HR. Bukhari no. 3370 & Muslim no. 406',
    benefits: 'Selawat paling afdhal yang diajarkan langsung oleh Rasulullah SAW dalam bacaan Tasyahhud akhir.',
    repeatCount: 10
  },

  // --- DZIKIR PAGI & PETANG ---
  {
    id: 'dzikir-pagi-al-matsurat',
    category: 'Dzikir Pagi',
    title: 'Dzikir Pagi (Al-Matsurat): Memasuki Pagi dengan Kerajaan Allah',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    latin: 'Ashbahna wa ashbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la syarika lah, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli syai\'in qadir',
    translationId: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada tuhan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan bagi-Nya segala pujian, dan Dia Mahakuasa atas segala sesuatu.',
    source: 'HR. Muslim no. 2723',
    benefits: 'Meneguhkan ketundukan diri di pagi hari dan menyambut rezeki dalam berkah Ilahi.',
    repeatCount: 1
  },
  {
    id: 'dzikir-petang-al-matsurat',
    category: 'Dzikir Petang',
    title: 'Dzikir Petang (Al-Matsurat): Memasuki Sore Hari',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    latin: 'Amsaina wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la syarika lah, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli syai\'in qadir',
    translationId: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada tuhan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan bagi-Nya segala pujian, dan Dia Mahakuasa atas segala sesuatu.',
    source: 'HR. Muslim no. 2723',
    benefits: 'Menutup aktivitas siang hari dengan pengakuan ketauhidan dan rasa syukur.',
    repeatCount: 1
  }
];

export const PRAYER_CATEGORIES = [
  'Semua Doa',
  'Bangun Tidur',
  'Makan & Minum',
  'Kamar Mandi',
  'Rumah',
  'Menuntut Ilmu',
  'Orang Tua & Keluarga',
  'Bepergian (Safar)',
  'Kesehatan & Sakit',
  'Perlindungan',
  'Setelah Salat',
  'Dzikir Pagi',
  'Dzikir Petang',
  'Istighfar & Selawat'
] as const;
