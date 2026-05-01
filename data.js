// ===== EarnBD Data File =====

const TASKS = [
  { id: 't1', type: 'daily', icon: '📅', title: 'দৈনিক লগইন বোনাস', desc: 'প্রতিদিন লগইন করুন এবং বোনাস পান', reward: 5, currency: '৳', link: null },
  { id: 't2', type: 'survey', icon: '📋', title: 'ছোট সার্ভে সম্পন্ন করুন', desc: 'ৱ মিনিটের সার্ভে পূরণ করুন', reward: 20, currency: '৳', link: 'https://cpagrip.com' },
  { id: 't3', type: 'install', icon: '📱', title: 'অ্যাপ ইন্সটল করুন', desc: 'অ্যাপ ইন্সটল করে ৩ মিনিট ব্যবহার করুন', reward: 35, currency: '৳', link: 'https://cpagrip.com' },
  { id: 't4', type: 'watch', icon: '▶️', title: 'ভিডিও দেখুন', desc: '৩০ সেকেন্ডের বিজ্ঞাপন দেখুন', reward: 2, currency: '৳', link: null },
  { id: 't5', type: 'survey', icon: '🎯', title: 'প্রোফাইল সার্ভে', desc: 'আপনার পছন্দ সম্পর্কে তথ্য দিন', reward: 15, currency: '৳', link: 'https://cpagrip.com' },
  { id: 't6', type: 'install', icon: '🎮', title: 'গেম ডাউনলোড ও খেলুন', desc: 'গেম ইন্সটল করে লেভেল ৫ পর্যন্ত পৌঁছান', reward: 80, currency: '৳', link: 'https://cpagrip.com' },
  { id: 't7', type: 'daily', icon: '🔄', title: 'বন্ধুকে শেয়ার করুন', desc: 'সোশ্যাল মিডিয়ায় শেয়ার করুন', reward: 3, currency: '৳', link: null },
  { id: 't8', type: 'survey', icon: '💡', title: 'মতামত জরিপ', desc: 'পণ্য সম্পর্কে আপনার মতামত দিন', reward: 25, currency: '৳', link: 'https://cpagrip.com' },
  { id: 't9', type: 'install', icon: '🛒', title: 'শপিং অ্যাপ ইন্সটল', desc: 'যেকোনো একটি পণ্য দেখুন', reward: 50, currency: '৳', link: 'https://cpagrip.com' },
  { id: 't10', type: 'watch', icon: '📺', title: 'লাইভ স্ট্রিম দেখুন', desc: '৫ মিনিট লাইভ দেখুন', reward: 8, currency: '৳', link: null },
];

const MICRO_JOBS = [
  { id: 'j1', platform: 'facebook', platformClass: 'fb', icon: '👍', title: 'Facebook পেজে লাইক দিন', desc: 'একটি Facebook পেজে লাইক করুন এবং ৩০ সেকেন্ড থাকুন', pay: '৳5', slots: 500, link: '#' },
  { id: 'j2', platform: 'facebook', platformClass: 'fb', icon: '👥', title: 'Facebook গ্রুপে যোগ দিন', desc: 'নির্দিষ্ট গ্রুপে জয়েন করুন', pay: '৳8', slots: 200, link: '#' },
  { id: 'j3', platform: 'facebook', platformClass: 'fb', icon: '📸', title: 'পোস্টে রিঅ্যাক্ট ও কমেন্ট', desc: 'পোস্টে রিঅ্যাক্ট করুন এবং একটি কমেন্ট দিন', pay: '৳10', slots: 300, link: '#' },
  { id: 'j4', platform: 'youtube', platformClass: 'yt', icon: '▶️', title: 'YouTube ভিডিও দেখুন', desc: '5 মিনিট ভিডিও দেখুন (স্কিপ ছাড়া)', pay: '৳12', slots: 1000, link: '#' },
  { id: 'j5', platform: 'youtube', platformClass: 'yt', icon: '🔔', title: 'চ্যানেল সাবস্ক্রাইব', desc: 'চ্যানেল সাবস্ক্রাইব করুন এবং বেল চাপুন', pay: '৳15', slots: 500, link: '#' },
  { id: 'j6', platform: 'youtube', platformClass: 'yt', icon: '💬', title: 'ভিডিওতে কমেন্ট', desc: 'অর্থবহ কমেন্ট করুন (সর্বনিম্ন ১০ শব্দ)', pay: '৳18', slots: 300, link: '#' },
  { id: 'j7', platform: 'tiktok', platformClass: 'tt', icon: '🎵', title: 'TikTok ফলো করুন', desc: 'একটি TikTok অ্যাকাউন্ট ফলো করুন', pay: '৳10', slots: 800, link: '#' },
  { id: 'j8', platform: 'tiktok', platformClass: 'tt', icon: '❤️', title: 'TikTok ভিডিওতে লাইক', desc: '3টি ভিডিওতে লাইক করুন', pay: '৳8', slots: 500, link: '#' },
  { id: 'j9', platform: 'instagram', platformClass: 'ig', icon: '📷', title: 'Instagram ফলো', desc: 'Instagram অ্যাকাউন্ট ফলো করুন', pay: '৳12', slots: 400, link: '#' },
  { id: 'j10', platform: 'twitter', platformClass: 'tw', icon: '🐦', title: 'Twitter ফলো ও রিটুইট', desc: 'ফলো করুন এবং একটি টুইট রিটুইট করুন', pay: '৳14', slots: 350, link: '#' },
];

const OFFERS = [
  { id: 'o1', logo: '🎮', name: 'Gaming Offer', desc: 'গেম খেলে পুরস্কার জিতুন', reward: '৳150', link: '#', network: 'CPAGrip' },
  { id: 'o2', logo: '🛍️', name: 'Shopping Cashback', desc: 'অনলাইনে কেনাকাটায় ক্যাশব্যাক', reward: '৳200', link: '#', network: 'CPALead' },
  { id: 'o3', logo: '📱', name: 'App Registration', desc: 'নতুন অ্যাপে রেজিস্ট্রেশন করুন', reward: '৳80', link: '#', network: 'MyLead' },
  { id: 'o4', logo: '💳', name: 'Credit Card Apply', desc: 'ক্রেডিট কার্ডের জন্য আবেদন করুন', reward: '৳500', link: '#', network: 'AdWorkMedia' },
  { id: 'o5', logo: '🏦', name: 'Bank Account Open', desc: 'ডিজিটাল ব্যাংক একাউন্ট খুলুন', reward: '৳300', link: '#', network: 'OGAds' },
  { id: 'o6', logo: '📊', name: 'Survey Complete', desc: 'সার্ভে সম্পন্ন করুন', reward: '৳50', link: '#', network: 'Freecash' },
];

const FEED_POSTS = [
  { id: 'p1', user: 'রাহেলা খানম', avatar: 'https://ui-avatars.com/api/?name=RK&background=FF6584&color=fff&size=40', time: '২ ঘন্টা আগে', text: 'আজ EarnBD থেকে ৳৫০০ উইথড্র করলাম! সত্যিই অসাধারণ প্ল্যাটফর্ম। আপনারাও চেষ্টা করুন! 🎉', likes: 145, comments: 32, type: 'text' },
  { id: 'p2', user: 'মোহাম্মদ রাফি', avatar: 'https://ui-avatars.com/api/?name=MR&background=43BCCD&color=fff&size=40', time: '৪ ঘন্টা আগে', text: 'মাইক্রো জব সিস্টেম এত সহজ! ঘরে বসেই ইউটিউব সাবস্ক্রাইব করে আয় করছি প্রতিদিন।', likes: 89, comments: 18, type: 'text' },
  { id: 'p3', user: 'প্রিয়া দাস', avatar: 'https://ui-avatars.com/api/?name=PD&background=6C63FF&color=fff&size=40', time: '৬ ঘন্টা আগে', text: 'রেফারেল সিস্টেম দারুণ! ১০ জন বন্ধুকে রেফার করে এই মাসে ৳১২০০ পেয়েছি! 💰💰💰', likes: 234, comments: 56, type: 'text' },
];

const SHORTS_DATA = [
  { id: 's1', user: 'EarnTips BD', title: 'দিনে ৳৫০০ আয়ের সহজ উপায়', views: '১.২ লক্ষ', emoji: '💰' },
  { id: 's2', user: 'DigitalBD', title: 'মাইক্রো জব কীভাবে করবেন', views: '৮৫ হাজার', emoji: '📱' },
  { id: 's3', user: 'FreelanceBD', title: 'CPAGrip থেকে আয় করুন', views: '২.৩ লক্ষ', emoji: '🎯' },
  { id: 's4', user: 'TechBD', title: 'Crypto উইথড্র গাইড', views: '৪৫ হাজার', emoji: '₿' },
  { id: 's5', user: 'EarnBD Official', title: 'রেফারেল সিস্টেম বোনাস', views: '১.৮ লক্ষ', emoji: '👥' },
  { id: 's6', user: 'SmartEarn', title: 'লাইভ থেকে গিফট পাওয়ার উপায়', views: '৬৭ হাজার', emoji: '🎁' },
];

const LIVE_STREAMS = [
  { id: 'l1', streamer: 'রাহেলা খানম', title: 'আড্ডা ও উপদেশ', viewers: '১২৪৫', emoji: '👩‍💼' },
  { id: 'l2', streamer: 'DJ রাফি', title: 'লাইভ মিউজিক সেশন', viewers: '৮৭৬', emoji: '🎵' },
  { id: 'l3', streamer: 'Tech Talks BD', title: 'অনলাইন আয়ের টিপস', viewers: '২৩৪১', emoji: '💻' },
  { id: 'l4', streamer: 'Cooking With Priya', title: 'রান্নার ক্লাস', viewers: '৫৬৭', emoji: '🍳' },
];

const GIFTS = [
  { emoji: '🌹', name: 'গোলাপ', cost: 10 },
  { emoji: '❤️', name: 'হৃদয়', cost: 50 },
  { emoji: '🎂', name: 'কেক', cost: 100 },
  { emoji: '💎', name: 'হীরা', cost: 500 },
  { emoji: '🏆', name: 'ট্রফি', cost: 1000 },
  { emoji: '🎁', name: 'গিফট বক্স', cost: 200 },
  { emoji: '🚗', name: 'গাড়ি', cost: 2000 },
  { emoji: '✈️', name: 'বিমান', cost: 5000 },
];

const MONETIZE_TIERS = [
  {
    name: 'Bronze Creator',
    emoji: '🥉',
    bg: '#CD7F32',
    requirements: { followers: 100, videos: 5, views: 1000 },
    perks: 'বিজ্ঞাপন আয়ের ৩০%',
  },
  {
    name: 'Silver Creator',
    emoji: '🥈',
    bg: '#C0C0C0',
    requirements: { followers: 1000, videos: 20, views: 10000 },
    perks: 'বিজ্ঞাপন আয়ের ৫০% + গিফট',
  },
  {
    name: 'Gold Creator',
    emoji: '🥇',
    bg: '#FFD700',
    requirements: { followers: 10000, videos: 50, views: 100000 },
    perks: 'বিজ্ঞাপন আয়ের ৭০% + গিফট + লাইভ',
  },
  {
    name: 'Diamond Creator',
    emoji: '💎',
    bg: '#B9F2FF',
    requirements: { followers: 100000, videos: 100, views: 1000000 },
    perks: 'বিজ্ঞাপন আয়ের ৯০% + সব ফিচার + ভেরিফাইড ব্যাজ',
  },
];

const PAYMENT_ADDRESSES = {
  bkash: { label: 'bKash নম্বরে পাঠান', key: 'bkash' },
  nagad: { label: 'Nagad নম্বরে পাঠান', key: 'nagad' },
  usdt: { label: 'USDT (TRC20) ঠিকানা', key: 'usdt_trc20' },
  btc: { label: 'Bitcoin ঠিকানা', key: 'btc' },
  bnb: { label: 'BNB ঠিকানা', key: 'bnb' },
  xrp: { label: 'XRP ঠিকানা', key: 'xrp' },
  sol: { label: 'Solana ঠিকানা', key: 'sol' },
  usdc: { label: 'USDC ঠিকানা', key: 'usdc' },
};
