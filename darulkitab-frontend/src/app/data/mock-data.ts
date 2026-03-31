// Mock data for Quran Surahs
export const SURAHS = [
  { number: 1, name: 'Al-Fatihah', nameArabic: 'الفاتحة', translation: 'The Opening', verses: 7, type: 'Makki' },
  { number: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', translation: 'The Cow', verses: 286, type: 'Madani' },
  { number: 3, name: 'Aal-E-Imran', nameArabic: 'آل عمران', translation: 'The Family of Imran', verses: 200, type: 'Madani' },
  { number: 4, name: 'An-Nisa', nameArabic: 'النساء', translation: 'The Women', verses: 176, type: 'Madani' },
  { number: 5, name: 'Al-Ma\'idah', nameArabic: 'المائدة', translation: 'The Table Spread', verses: 120, type: 'Madani' },
  { number: 6, name: 'Al-An\'am', nameArabic: 'الأنعام', translation: 'The Cattle', verses: 165, type: 'Makki' },
  { number: 7, name: 'Al-A\'raf', nameArabic: 'الأعراف', translation: 'The Heights', verses: 206, type: 'Makki' },
  { number: 8, name: 'Al-Anfal', nameArabic: 'الأنفال', translation: 'The Spoils of War', verses: 75, type: 'Madani' },
  { number: 9, name: 'At-Tawbah', nameArabic: 'التوبة', translation: 'The Repentance', verses: 129, type: 'Madani' },
  { number: 10, name: 'Yunus', nameArabic: 'يونس', translation: 'Jonah', verses: 109, type: 'Makki' },
  { number: 18, name: 'Al-Kahf', nameArabic: 'الكهف', translation: 'The Cave', verses: 110, type: 'Makki' },
  { number: 36, name: 'Ya-Sin', nameArabic: 'يس', translation: 'Ya-Sin', verses: 83, type: 'Makki' },
  { number: 55, name: 'Ar-Rahman', nameArabic: 'الرحمن', translation: 'The Most Merciful', verses: 78, type: 'Madani' },
  { number: 56, name: 'Al-Waqi\'ah', nameArabic: 'الواقعة', translation: 'The Event', verses: 96, type: 'Makki' },
  { number: 67, name: 'Al-Mulk', nameArabic: 'الملك', translation: 'The Sovereignty', verses: 30, type: 'Makki' },
  { number: 78, name: 'An-Naba', nameArabic: 'النبأ', translation: 'The Tidings', verses: 40, type: 'Makki' },
  { number: 112, name: 'Al-Ikhlas', nameArabic: 'الإخلاص', translation: 'The Sincerity', verses: 4, type: 'Makki' },
  { number: 113, name: 'Al-Falaq', nameArabic: 'الفلق', translation: 'The Daybreak', verses: 5, type: 'Makki' },
  { number: 114, name: 'An-Nas', nameArabic: 'الناس', translation: 'Mankind', verses: 6, type: 'Makki' },
];

export const RECITERS = [
  { id: '1', name: 'Abdul Basit Abdul Samad', country: 'Egypt', isPremium: false },
  { id: '2', name: 'Mishary Rashid Alafasy', country: 'Kuwait', isPremium: false },
  { id: '3', name: 'Saad Al-Ghamdi', country: 'Saudi Arabia', isPremium: false },
  { id: '4', name: 'Maher Al Muaiqly', country: 'Saudi Arabia', isPremium: true },
  { id: '5', name: 'Ahmed Al Ajmy', country: 'Saudi Arabia', isPremium: true },
  { id: '6', name: 'Muhammad Al Luhaidan', country: 'Saudi Arabia', isPremium: true },
  { id: '7', name: 'Abdur Rahman As-Sudais', country: 'Saudi Arabia', isPremium: true },
  { id: '8', name: 'Nasser Al Qatami', country: 'Saudi Arabia', isPremium: true },
];

export const SAMPLE_AYAHS = [
  {
    id: '1-1',
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    surahNameArabic: 'الفاتحة',
    ayahNumber: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    reciter: 'Abdul Basit Abdul Samad',
    streamId: 512,
    isPremium: false
  },
  {
    id: '2-255',
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    ayahNumber: 255,
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    reciter: 'Mishary Rashid Alafasy',
    streamId: 513,
    isPremium: false
  },
  {
    id: '36-1',
    surahNumber: 36,
    surahName: 'Ya-Sin',
    surahNameArabic: 'يس',
    ayahNumber: 1,
    arabicText: 'يس',
    translation: 'Ya-Sin.',
    reciter: 'Saad Al-Ghamdi',
    streamId: 525,
    isPremium: false
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '',
    features: [
      'Limited reciters (3)',
      'Online streaming only',
      'Standard quality audio',
      'Ads supported'
    ],
    isFree: true
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 199,
    period: '/month',
    features: [
      'All reciters unlocked',
      'Offline downloads',
      'High quality audio (320kbps)',
      'No ads',
      'Early access to new content',
      'Playlist creation'
    ],
    isFree: false,
    popular: false
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 1999,
    period: '/year',
    features: [
      'All reciters unlocked',
      'Offline downloads',
      'High quality audio (320kbps)',
      'No ads',
      'Early access to new content',
      'Playlist creation',
      'Save 17% vs monthly'
    ],
    isFree: false,
    popular: true
  }
];
