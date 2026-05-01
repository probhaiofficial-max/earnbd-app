// ===== EarnBD Config File =====
// এই ফাইলে আপনার সব সেটিংস বসান

const CONFIG = {
  appName: "EarnBD",
  whatsapp: "+8801XXXXXXXXX",
  telegram: "https://t.me/yourchannel",
  telegramChannel: "https://t.me/yourchannel",
  youtube: "https://youtube.com/@yourchannel",
  facebook: "https://facebook.com/yourpage",

  // Ad Networks
  cpagrip: {
    publisherId: "",
    wallId: "",
    offerWallUrl: "" // Will be auto-generated
  },
  cpalead: {
    apiKey: "",
    websiteId: ""
  },
  mylead: {
    publisherId: ""
  },
  adworkmedia: {
    apiKey: ""
  },
  ogads: {
    publisherId: ""
  },

  // Adsterra
  adsterra: {
    socialBarCode: "", // Paste full script tag here
    popunderCode: ""
  },

  // Affiliate Links
  freecash: "https://freecash.com/?ref=YOUR_CODE",

  // Wallet Addresses
  wallet: {
    bkash: "01XXXXXXXXX",
    nagad: "01XXXXXXXXX",
    usdt_trc20: "YOUR_USDT_TRC20_ADDRESS",
    btc: "YOUR_BTC_ADDRESS",
    bnb: "YOUR_BNB_ADDRESS",
    xrp: "YOUR_XRP_ADDRESS",
    sol: "YOUR_SOL_ADDRESS",
    usdc: "YOUR_USDC_ADDRESS",
    binance_uid: "YOUR_BINANCE_UID"
  },

  // Rates
  minWithdraw: 100, // BDT
  taskRewardMin: 0.5,
  taskRewardMax: 50,
  referralCommission: { l1: 20, l2: 10, l3: 5 }, // percent

  // Exchange Rates (update manually or use API)
  rates: {
    USD_BDT: 110,
    USD_INR: 83,
    USD_BTC: 0.0000168,
    USD_USDT: 1,
    USD_BNB: 0.0035,
    USD_SOL: 0.0063,
    USD_XRP: 1.82,
    USD_USDC: 1
  }
};
