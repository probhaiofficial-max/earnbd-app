// ===== EarnBD Super App - Main Logic =====

// STATE
let state = {
  user: null,
  balance: 0,
  points: 0,
  tasksCompleted: [],
  transactions: [],
  posts: [...FEED_POSTS],
  referrals: [],
  settings: {},
  currentPostType: 'text',
  currentLive: null,
  monetizeStats: { followers: 0, videos: 0, views: 0, likes: 0 },
};

// INIT
window.addEventListener('load', () => {
  loadSettings();
  setTimeout(() => {
    document.querySelector('.splash').classList.add('fade-out');
    setTimeout(() => {
      document.querySelector('.splash').style.display = 'none';
      checkAuth();
    }, 500);
  }, 2200);
});

function checkAuth() {
  const savedUser = localStorage.getItem('earnbd_user');
  if (savedUser) {
    state.user = JSON.parse(savedUser);
    state.balance = parseFloat(localStorage.getItem('earnbd_balance') || '0');
    state.points = parseInt(localStorage.getItem('earnbd_points') || '0');
    state.transactions = JSON.parse(localStorage.getItem('earnbd_txs') || '[]');
    state.tasksCompleted = JSON.parse(localStorage.getItem('earnbd_tasks_done') || '[]');
    state.referrals = JSON.parse(localStorage.getItem('earnbd_refs') || '[]');
    showApp();
  } else {
    showScreen('auth-screen');
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  updateUI();
  renderFeed();
  renderShorts();
  renderTasks();
  renderMicroJobs();
  renderOffers();
  renderLive();
  renderMonetize();
  renderWalletHistory();
  renderReferrals();
  applySettings();
  injectAdsterra();
  convertCurrency();
  showConvRates();
}

function updateUI() {
  if (!state.user) return;
  const name = state.user.name || 'ব্যবহারকারী';
  const email = state.user.email || '';
  document.getElementById('header-balance').textContent = formatBDT(state.balance);
  document.getElementById('home-balance').textContent = '৳' + state.balance.toFixed(2);
  document.getElementById('home-tasks').textContent = state.tasksCompleted.length;
  document.getElementById('home-refs').textContent = state.referrals.length;
  document.getElementById('home-points').textContent = state.points;
  document.getElementById('wallet-balance-display').textContent = '৳' + state.balance.toFixed(2);
  document.getElementById('wallet-usd-display').textContent = '≈ $' + (state.balance / CONFIG.rates.USD_BDT).toFixed(2);
  const refCode = 'EARN' + (state.user.id || '0001');
  document.getElementById('ref-code-box').textContent = refCode;
  document.getElementById('ref-link').textContent = `https://earnbd.app/?ref=${refCode}`;
  document.getElementById('total-refs').textContent = state.referrals.length;
  document.getElementById('active-refs').textContent = state.referrals.filter(r=>r.active).length;
  document.getElementById('ref-earnings').textContent = '৳' + state.referrals.reduce((a,r)=>a+(r.earned||0),0).toFixed(0);
  if (name) {
    document.getElementById('sidebar-name').textContent = name;
    document.getElementById('sidebar-email').textContent = email;
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-email').textContent = email;
    const av = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff&size=80`;
    document.getElementById('user-avatar').src = av;
    document.getElementById('sidebar-avatar').src = av;
    document.getElementById('profile-avatar').src = av;
  }
  document.getElementById('ps-posts').textContent = state.posts.filter(p=>p.userId===state.user?.id).length || 0;
  document.getElementById('ps-followers').textContent = state.monetizeStats.followers;
  document.getElementById('ps-following').textContent = 0;
  document.getElementById('ps-earned').textContent = '৳' + state.balance.toFixed(0);

  document.getElementById('min-wd-display').textContent = state.settings.minWithdraw || CONFIG.minWithdraw;
}

// AUTH
function switchAuth(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;
  if (!email || !pass) return showToast('সব তথ্য পূরণ করুন', 'error');
  const stored = localStorage.getItem('earnbd_user_' + email);
  if (!stored) return showToast('একাউন্ট পাওয়া যায়নি', 'error');
  const user = JSON.parse(stored);
  if (user.pass !== btoa(pass)) return showToast('পাসওয়ার্ড ভুল', 'error');
  state.user = user;
  localStorage.setItem('earnbd_user', JSON.stringify(user));
  showToast('লগইন সফল!', 'success');
  setTimeout(() => showApp(), 500);
}

function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const ref = document.getElementById('reg-ref').value.trim();
  if (!name || !email || !pass) return showToast('সব তথ্য পূরণ করুন', 'error');
  if (localStorage.getItem('earnbd_user_' + email)) return showToast('এই ইমেইল আগেই নিবন্ধিত', 'error');
  const user = {
    id: Date.now().toString().slice(-6),
    name, email, pass: btoa(pass), ref,
    joinDate: new Date().toLocaleDateString('bn-BD'),
  };
  localStorage.setItem('earnbd_user_' + email, JSON.stringify(user));
  localStorage.setItem('earnbd_user', JSON.stringify(user));
  state.user = user;
  // Referral bonus
  if (ref) {
    state.balance += 20;
    localStorage.setItem('earnbd_balance', state.balance);
    showToast('রেফারেল বোনাস ৳২০ পেয়েছেন!', 'success');
  } else {
    showToast('রেজিস্ট্রেশন সফল! ৳০ দিয়ে শুরু করুন', 'success');
  }
  setTimeout(() => showApp(), 500);
}

function googleLogin() {
  const user = {
    id: Date.now().toString().slice(-6),
    name: 'Google User',
    email: 'google@earnbd.com',
    joinDate: new Date().toLocaleDateString('bn-BD'),
  };
  state.user = user;
  localStorage.setItem('earnbd_user', JSON.stringify(user));
  showToast('Google দিয়ে লগইন সফল!', 'success');
  setTimeout(() => showApp(), 300);
}

function doLogout() {
  localStorage.removeItem('earnbd_user');
  state.user = null;
  document.getElementById('main-app').classList.add('hidden');
  showScreen('auth-screen');
  showToast('লগআউট সফল');
}

// NAVIGATION
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.add('hidden');
  });
  const target = document.getElementById('page-' + page);
  if (target) { target.classList.remove('hidden'); target.classList.add('active'); }
  document.querySelectorAll('.bn-btn').forEach(b => b.classList.remove('active'));
  const bnBtn = document.getElementById('bn-' + page);
  if (bnBtn) bnBtn.classList.add('active');
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('hidden');
}

// CURRENCY CONVERTER
function convertCurrency() {
  const amount = parseFloat(document.getElementById('conv-amount').value) || 0;
  const from = document.getElementById('conv-from').value;
  const to = document.getElementById('conv-to').value;
  const rates = CONFIG.rates;
  const toUSD = (val, cur) => {
    switch(cur) {
      case 'USD': return val;
      case 'BDT': return val / rates.USD_BDT;
      case 'INR': return val / rates.USD_INR;
      case 'BTC': return val / rates.USD_BTC;
      case 'USDT': return val / rates.USD_USDT;
      case 'BNB': return val / rates.USD_BNB;
      case 'SOL': return val / rates.USD_SOL;
      case 'XRP': return val / rates.USD_XRP;
      default: return val;
    }
  };
  const fromUSD = (val, cur) => {
    switch(cur) {
      case 'USD': return val;
      case 'BDT': return val * rates.USD_BDT;
      case 'INR': return val * rates.USD_INR;
      case 'BTC': return val * rates.USD_BTC;
      case 'USDT': return val * rates.USD_USDT;
      case 'BNB': return val * rates.USD_BNB;
      case 'SOL': return val * rates.USD_SOL;
      case 'XRP': return val * rates.USD_XRP;
      default: return val;
    }
  };
  const usd = toUSD(amount, from);
  const result = fromUSD(usd, to);
  const symbols = { USD:'$', BDT:'৳', INR:'₹', BTC:'₿', USDT:'₮', BNB:'BNB ', SOL:'◎', XRP:'✕ ' };
  document.getElementById('conv-result').textContent = `= ${symbols[to] || ''}${result < 0.001 ? result.toExponential(4) : result.toFixed(4)}`;
}

function swapCurrency() {
  const from = document.getElementById('conv-from');
  const to = document.getElementById('conv-to');
  [from.value, to.value] = [to.value, from.value];
  convertCurrency();
}

function showConvRates() {
  const r = CONFIG.rates;
  const container = document.getElementById('conv-rates');
  if (!container) return;
  container.innerHTML = [
    `$1 = ৳${r.USD_BDT}`,
    `$1 = ₹${r.USD_INR}`,
    `$1 = ${r.USD_USDT} USDT`,
    `₿1 = $${Math.round(1/r.USD_BTC).toLocaleString()}`,
  ].map(r => `<span class="conv-rate-chip">${r}</span>`).join('');
}

// OFFER WALL
function showOW(network) {
  document.querySelectorAll('.ow-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const frame = document.getElementById('ow-frame');
  const ph = document.getElementById('ow-placeholder');
  const cfg = state.settings;
  let url = '';
  if (network === 'cpagrip' && cfg.cpagrip) url = `https://cpagrip.com/user/wall.php?user_id=${cfg.cpagrip}&pubkey=`;
  else if (network === 'cpalead' && cfg.cpalead) url = `https://cpalead.com/api/v2/campaign/offer-wall?id=${cfg.cpalead}`;
  else if (network === 'mylead' && cfg.mylead) url = `https://mylead.global/s/${cfg.mylead}`;
  else if (network === 'adworkmedia' && cfg.adworkmedia) url = `https://www.adworkmedia.com/go.php?sid=${cfg.adworkmedia}`;
  else if (network === 'ogads' && cfg.ogads) url = `https://ogads.com/api/offerwall/${cfg.ogads}`;
  if (url) {
    frame.src = url; frame.classList.remove('hidden'); ph.classList.add('hidden');
  } else {
    frame.classList.add('hidden'); ph.classList.remove('hidden');
    ph.innerHTML = `<i class="fas fa-cog"></i><p>Settings-এ <b>${network.toUpperCase()}</b> ID বসান</p>`;
  }
}

// FEED
function renderFeed() {
  const container = document.getElementById('feed-posts');
  container.innerHTML = state.posts.map(p => `
    <div class="feed-post" id="post-${p.id}">
      <div class="post-header">
        <img src="${p.avatar || `https://ui-avatars.com/api/?name=${p.user}&background=6C63FF&color=fff&size=40`}" class="post-avatar">
        <div class="post-user">
          <p class="post-username">${p.user}</p>
          <p class="post-time">${p.time}</p>
        </div>
        <button class="post-more"><i class="fas fa-ellipsis-v"></i></button>
      </div>
      ${p.text ? `<div class="post-body">${p.text}</div>` : ''}
      ${p.image ? `<img src="${p.image}" class="post-img">` : ''}
      <div class="post-actions">
        <button class="post-act-btn ${(p.liked)?'liked':''}" onclick="likePost('${p.id}')">
          <i class="fa${p.liked?'s':'r'} fa-heart"></i> ${p.likes}
        </button>
        <button class="post-act-btn" onclick="commentPost('${p.id}')">
          <i class="far fa-comment"></i> ${p.comments}
        </button>
        <button class="post-act-btn" onclick="sharePost('${p.id}')">
          <i class="fas fa-share"></i> শেয়ার
        </button>
      </div>
    </div>
  `).join('');
}

function likePost(id) {
  const p = state.posts.find(p => p.id === id);
  if (!p) return;
  p.liked = !p.liked;
  p.likes += p.liked ? 1 : -1;
  renderFeed();
  addPoints(1);
}

function commentPost(id) { showToast('কমেন্ট ফিচার শীঘ্রই আসছে'); }
function sharePost(id) { showToast('পোস্ট শেয়ার করা হয়েছে', 'success'); addPoints(2); }

function openCreatePost() { document.getElementById('create-post-modal').classList.remove('hidden'); }
function setPostType(type) {
  state.currentPostType = type;
  document.querySelectorAll('.pt-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('post-media-upload').classList.toggle('hidden', type === 'text');
}
function previewMedia() {
  const file = document.getElementById('post-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('media-preview');
    if (file.type.startsWith('image/')) preview.innerHTML = `<img src="${e.target.result}">`;
    else preview.innerHTML = `<video src="${e.target.result}" controls></video>`;
  };
  reader.readAsDataURL(file);
}
function createPost() {
  const text = document.getElementById('post-text').value.trim();
  if (!text && state.currentPostType === 'text') return showToast('পোস্ট লিখুন', 'error');
  const newPost = {
    id: 'p' + Date.now(),
    userId: state.user?.id,
    user: state.user?.name || 'আপনি',
    avatar: `https://ui-avatars.com/api/?name=${state.user?.name}&background=6C63FF&color=fff&size=40`,
    time: 'এইমাত্র',
    text, likes: 0, comments: 0, type: state.currentPostType,
  };
  state.posts.unshift(newPost);
  closeModal('create-post-modal');
  renderFeed();
  addPoints(5);
  addBalance(1);
  showToast('পোস্ট প্রকাশিত হয়েছে!', 'success');
}

// SHORTS
function renderShorts() {
  const container = document.getElementById('shorts-feed');
  container.innerHTML = SHORTS_DATA.map(s => `
    <div class="short-card" onclick="playShort('${s.id}')">
      <div class="short-thumb" style="display:flex;align-items:center;justify-content:center;font-size:60px;background:linear-gradient(135deg,var(--card),var(--card2))">
        ${s.emoji}
      </div>
      <div class="short-overlay">
        <p class="short-title">${s.title}</p>
        <p class="short-views">👁 ${s.views}</p>
      </div>
      <div class="short-play"><i class="fas fa-play-circle" style="filter:drop-shadow(0 2px 8px rgba(0,0,0,0.8))"></i></div>
    </div>
  `).join('');
}
function playShort(id) {
  showToast('শর্টস ভিডিও শুরু হচ্ছে...', 'success');
  setTimeout(() => { addBalance(0.5); addPoints(2); showToast('ভিডিও দেখার জন্য ৳০.৫ পেয়েছেন!', 'success'); }, 2000);
}
function uploadShort() { showToast('শর্টস আপলোড ফিচার শীঘ্রই আসছে'); }

// TASKS
function renderTasks(filter = 'all') {
  const container = document.getElementById('tasks-list');
  const filtered = filter === 'all' ? TASKS : TASKS.filter(t => t.type === filter);
  container.innerHTML = filtered.map(t => {
    const done = state.tasksCompleted.includes(t.id);
    return `
      <div class="task-card">
        <div class="task-icon ${t.type}">${t.icon}</div>
        <div class="task-info">
          <p class="task-title">${t.title}</p>
          <p class="task-desc">${t.desc}</p>
          <p class="task-reward">+${t.currency}${t.reward}</p>
        </div>
        <button class="task-btn ${done?'done':''}" ${done?'disabled':''} onclick="doTask('${t.id}', ${t.reward}, '${t.title}', '${t.link || ''}')">
          ${done ? '✓ সম্পন্ন' : 'শুরু করুন'}
        </button>
      </div>
    `;
  }).join('');
}
function filterTasks(type) {
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderTasks(type);
}
function doTask(id, reward, title, link) {
  if (link && link !== 'null') window.open(link, '_blank');
  const done = () => {
    state.tasksCompleted.push(id);
    localStorage.setItem('earnbd_tasks_done', JSON.stringify(state.tasksCompleted));
    addBalance(reward);
    addPoints(reward * 2);
    addTransaction('credit', `টাস্ক: ${title}`, reward);
    showToast(`+৳${reward} পেয়েছেন!`, 'success');
    renderTasks();
    updateUI();
  };
  if (link && link !== 'null') setTimeout(done, 3000);
  else done();
}

// MICRO JOBS
function renderMicroJobs(filter = 'all') {
  const container = document.getElementById('jobs-list');
  const filtered = filter === 'all' ? MICRO_JOBS : MICRO_JOBS.filter(j => j.platform === filter);
  container.innerHTML = filtered.map(j => `
    <div class="job-card">
      <div class="job-header">
        <div class="job-platform ${j.platformClass}">${j.icon}</div>
        <div class="job-title">${j.title}</div>
        <div class="job-pay">${j.pay}</div>
      </div>
      <p class="job-desc">${j.desc}</p>
      <div class="job-footer">
        <span class="job-slots">স্লট: ${j.slots}</span>
        <button class="job-apply-btn" onclick="applyJob('${j.id}', '${j.pay}', '${j.title}')">আবেদন করুন</button>
      </div>
    </div>
  `).join('');
}
function filterJobs(cat) {
  document.querySelectorAll('.mj-cat').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderMicroJobs(cat);
}
function applyJob(id, pay, title) {
  const amt = parseFloat(pay.replace('৳', ''));
  addBalance(amt);
  addPoints(amt * 3);
  addTransaction('credit', `মাইক্রো জব: ${title}`, amt);
  showToast(`${pay} পেয়েছেন! (${title})`, 'success');
  updateUI();
}

// OFFERS
function renderOffers() {
  const list = document.getElementById('offers-list');
  list.innerHTML = OFFERS.map(o => `
    <div class="offer-card">
      <div class="offer-logo">${o.logo}</div>
      <div class="offer-info">
        <p class="offer-name">${o.name} <small style="color:var(--text2);font-size:10px">${o.network}</small></p>
        <p class="offer-desc">${o.desc}</p>
        <p class="offer-reward">${o.reward}</p>
      </div>
      <button class="offer-btn" onclick="doOffer('${o.id}','${o.reward}','${o.name}')">করুন</button>
    </div>
  `).join('');
  const fc = document.getElementById('freecash-link');
  if (fc) fc.href = state.settings.freecash || CONFIG.freecash;
}
function doOffer(id, reward, name) {
  const amt = parseFloat(reward.replace('৳',''));
  addBalance(amt);
  addTransaction('credit', `অফার: ${name}`, amt);
  showToast(`অফার শুরু করা হয়েছে! সম্পন্ন হলে ${reward} পাবেন`, 'success');
  updateUI();
}

// WALLET
function showWalletTab(tab) {
  document.querySelectorAll('.wallet-section').forEach(s => s.classList.add('hidden'));
  document.getElementById('wallet-' + tab).classList.remove('hidden');
  document.querySelectorAll('.wt-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}
function selectPayment(method) {
  document.querySelectorAll('.pm-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  const form = document.getElementById('deposit-form');
  const addrs = PAYMENT_ADDRESSES[method];
  form.classList.remove('hidden');
  document.getElementById('addr-label').textContent = addrs.label + ':';
  const walletCfg = state.settings.wallet || CONFIG.wallet;
  document.getElementById('addr-val').textContent = walletCfg[addrs.key] || 'সেটিংসে ঠিকানা বসান';
}
function copyAddress() {
  const addr = document.getElementById('addr-val').textContent;
  navigator.clipboard.writeText(addr).then(() => showToast('ঠিকানা কপি হয়েছে', 'success'));
}
function submitDeposit() {
  const amount = parseFloat(document.getElementById('dep-amount').value);
  const txid = document.getElementById('dep-txid').value.trim();
  if (!amount || !txid) return showToast('পরিমাণ ও TxID দিন', 'error');
  addTransaction('credit', 'ডিপোজিট (পেন্ডিং)', amount);
  showToast('ডিপোজিট রিকোয়েস্ট পাঠানো হয়েছে! ১-২৪ ঘন্টায় ক্রেডিট হবে', 'success');
  document.getElementById('dep-amount').value = '';
  document.getElementById('dep-txid').value = '';
  renderWalletHistory();
}
function updateWDMethod() { showToast('পেমেন্ট পদ্ধতি পরিবর্তন হয়েছে'); }
function submitWithdraw() {
  const method = document.getElementById('wd-method').value;
  const address = document.getElementById('wd-address').value.trim();
  const amount = parseFloat(document.getElementById('wd-amount').value);
  const minWD = parseInt(state.settings.minWithdraw || CONFIG.minWithdraw);
  if (!address) return showToast('ঠিকানা / নম্বর দিন', 'error');
  if (!amount || amount < minWD) return showToast(`সর্বনিম্ন ৳${minWD} উইথড্র করুন`, 'error');
  if (amount > state.balance) return showToast('অপর্যাপ্ত ব্যালেন্স', 'error');
  state.balance -= amount;
  localStorage.setItem('earnbd_balance', state.balance);
  addTransaction('debit', `উইথড্র (${method.toUpperCase()})`, amount);
  showToast(`৳${amount} উইথড্র রিকোয়েস্ট পাঠানো হয়েছে!`, 'success');
  updateUI();
  renderWalletHistory();
}
function renderWalletHistory() {
  const container = document.getElementById('tx-history');
  if (!state.transactions.length) { container.innerHTML = '<p style="text-align:center;color:var(--text2);padding:20px">কোনো লেনদেন নেই</p>'; return; }
  container.innerHTML = state.transactions.slice().reverse().slice(0,20).map(tx => `
    <div class="tx-item">
      <div class="tx-icon ${tx.type}"><i class="fas fa-${tx.type==='credit'?'arrow-down':'arrow-up'}"></i></div>
      <div class="tx-info">
        <p class="tx-title">${tx.title}</p>
        <p class="tx-date">${tx.date}</p>
      </div>
      <p class="tx-amount ${tx.type}">${tx.type==='credit'?'+':'-'}৳${tx.amount}</p>
    </div>
  `).join('');
}

// REFERRAL
function renderReferrals() {
  const container = document.getElementById('ref-list');
  if (!state.referrals.length) { container.innerHTML = '<p style="color:var(--text2);text-align:center;padding:20px">এখনো কোনো রেফারেল নেই</p>'; return; }
  container.innerHTML = state.referrals.map(r => `
    <div class="ref-item">
      <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=6C63FF&color=fff&size=36" class="ref-item-avatar">
      <div class="ref-item-info">
        <p class="ref-item-name">${r.name}</p>
        <p class="ref-item-date">${r.date}</p>
      </div>
      <p class="ref-item-earn">+৳${r.earned||0}</p>
    </div>
  `).join('');
}
function copyRef() {
  const code = document.getElementById('ref-code-box').textContent;
  navigator.clipboard.writeText(code).then(() => showToast('রেফারেল কোড কপি হয়েছে', 'success'));
}
function shareRef() {
  const link = document.getElementById('ref-link').textContent;
  if (navigator.share) navigator.share({ title: 'EarnBD', text: 'আমার রেফারেল লিঙ্ক দিয়ে যোগ দিন!', url: link });
  else { navigator.clipboard.writeText(link); showToast('লিঙ্ক কপি হয়েছে', 'success'); }
}

// LIVE
function renderLive() {
  const container = document.getElementById('live-list');
  container.innerHTML = LIVE_STREAMS.map(l => `
    <div class="live-card" onclick="joinLive('${l.id}')">
      <div class="live-card-thumb">${l.emoji}</div>
      <div class="live-badge">LIVE</div>
      <div class="live-viewers">👁 ${l.viewers}</div>
      <div class="live-card-info">
        <p class="live-streamer">${l.streamer}</p>
        <p class="live-title">${l.title}</p>
      </div>
    </div>
  `).join('');
}
function joinLive(id) {
  const lv = LIVE_STREAMS.find(l => l.id === id);
  if (!lv) return;
  state.currentLive = lv;
  const modal = document.getElementById('live-modal');
  modal.classList.remove('hidden');
  document.getElementById('live-screen').textContent = lv.emoji;
  const msgs = document.getElementById('live-chat-msgs');
  msgs.innerHTML = `
    <div class="chat-msg"><span class="cm-user">EarnBD Bot:</span> লাইভে স্বাগতম! 🎉</div>
    <div class="chat-msg"><span class="cm-user">আদিত্য:</span> দারুণ লাইভ!</div>
    <div class="chat-msg"><span class="cm-user">রাহেলা:</span> অসাধারণ! ❤️</div>
  `;
  renderGifts();
  addBalance(0.2);
  showToast('লাইভ দেখার জন্য ৳০.২ পেয়েছেন', 'success');
}
function sendLiveChat() {
  const input = document.getElementById('live-chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const msgs = document.getElementById('live-chat-msgs');
  const div = document.createElement('div');
  div.className = 'chat-msg';
  div.innerHTML = `<span class="cm-user">${state.user?.name || 'আপনি'}:</span> ${msg}`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';
  addPoints(1);
}
function startLive() {
  showToast('লাইভ স্ট্রিম শুরু হচ্ছে... (এই ফিচার শীঘ্রই আসছে)', 'success');
}
function openGifts() {
  document.getElementById('gift-modal').classList.remove('hidden');
}
function renderGifts() {
  const container = document.getElementById('gifts-grid');
  container.innerHTML = GIFTS.map(g => `
    <div class="gift-item" onclick="sendGift('${g.emoji}','${g.name}',${g.cost})">
      <div class="gift-emoji">${g.emoji}</div>
      <p class="gift-name">${g.name}</p>
      <p class="gift-cost">🪙${g.cost}</p>
    </div>
  `).join('');
}
function sendGift(emoji, name, cost) {
  if (state.points < cost) return showToast(`পয়েন্ট অপর্যাপ্ত! আপনার: ${state.points}, প্রয়োজন: ${cost}`, 'error');
  state.points -= cost;
  localStorage.setItem('earnbd_points', state.points);
  closeModal('gift-modal');
  showToast(`${emoji} ${name} গিফট পাঠানো হয়েছে!`, 'success');
  const chatMsgs = document.getElementById('live-chat-msgs');
  if (chatMsgs) {
    const div = document.createElement('div');
    div.className = 'chat-msg';
    div.innerHTML = `<span class="cm-user" style="color:var(--orange)">${state.user?.name}</span> ${emoji} ${name} গিফট পাঠিয়েছে!`;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }
}

// MONETIZATION
function renderMonetize() {
  const container = document.getElementById('tier-cards');
  container.innerHTML = MONETIZE_TIERS.map(t => `
    <div class="tier-card">
      <div class="tier-badge" style="background:${t.bg}20;color:${t.bg}">${t.emoji}</div>
      <div class="tier-info">
        <p class="tier-name">${t.name}</p>
        <p class="tier-req">ফলোয়ার: ${t.requirements.followers.toLocaleString()} | ভিডিও: ${t.requirements.videos} | ভিউ: ${t.requirements.views.toLocaleString()}</p>
        <p class="tier-perk">${t.perks}</p>
      </div>
    </div>
  `).join('');
}
function checkMonetization() {
  const stats = state.monetizeStats;
  const criteria = [
    { label: `ফলোয়ার: ${stats.followers}/১০০`, met: stats.followers >= 100 },
    { label: `পোস্ট/ভিডিও: ${stats.videos}/৫`, met: stats.videos >= 5 },
    { label: `মোট ভিউ: ${stats.views}/১০০০`, met: stats.views >= 1000 },
    { label: `লাইক: ${stats.likes}/৫০০`, met: stats.likes >= 500 },
  ];
  const allMet = criteria.every(c => c.met);
  document.getElementById('criteria-list').innerHTML = criteria.map(c => `
    <div class="criteria-item ${c.met?'met':'unmet'}">
      <span class="ci-icon">${c.met?'✅':'❌'}</span>
      <span>${c.label}</span>
    </div>
  `).join('');
  document.getElementById('monetize-status-text').textContent = allMet ? '🎉 আপনি মনিটাইজেশনের জন্য যোগ্য!' : 'মনিটাইজেশনের জন্য আরো প্রয়োজন';
}

// SETTINGS
function loadSettings() {
  const saved = localStorage.getItem('earnbd_settings');
  if (saved) state.settings = JSON.parse(saved);
}
function saveSettings() {
  const settings = {
    appName: document.getElementById('cfg-appname').value,
    whatsapp: document.getElementById('cfg-whatsapp').value,
    telegram: document.getElementById('cfg-telegram').value,
    youtube: document.getElementById('cfg-youtube').value,
    facebook: document.getElementById('cfg-facebook').value,
    cpagrip: document.getElementById('cfg-cpagrip').value,
    cpalead: document.getElementById('cfg-cpalead').value,
    mylead: document.getElementById('cfg-mylead').value,
    adworkmedia: document.getElementById('cfg-adworkmedia').value,
    ogads: document.getElementById('cfg-ogads').value,
    adsterraSocial: document.getElementById('cfg-adsterra-social').value,
    adsterraPopunder: document.getElementById('cfg-adsterra-pop').value,
    freecash: document.getElementById('cfg-freecash').value,
    minWithdraw: document.getElementById('cfg-min-wd').value,
    wallet: {
      bkash: document.getElementById('cfg-bkash').value,
      nagad: document.getElementById('cfg-nagad').value,
      usdt_trc20: document.getElementById('cfg-usdt').value,
      btc: document.getElementById('cfg-btc').value,
      bnb: document.getElementById('cfg-bnb').value,
      xrp: document.getElementById('cfg-xrp').value,
      sol: document.getElementById('cfg-sol').value,
      usdc: document.getElementById('cfg-usdc').value,
    }
  };
  state.settings = settings;
  localStorage.setItem('earnbd_settings', JSON.stringify(settings));
  showToast('সেটিংস সংরক্ষিত হয়েছে!', 'success');
  applySettings();
  injectAdsterra();
}
function applySettings() {
  const s = state.settings;
  if (!s) return;
  if (s.appName) document.title = s.appName + ' - আয় করুন বাংলায়';
  const populateField = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
  populateField('cfg-appname', s.appName);
  populateField('cfg-whatsapp', s.whatsapp);
  populateField('cfg-telegram', s.telegram);
  populateField('cfg-youtube', s.youtube);
  populateField('cfg-facebook', s.facebook);
  populateField('cfg-cpagrip', s.cpagrip);
  populateField('cfg-cpalead', s.cpalead);
  populateField('cfg-mylead', s.mylead);
  populateField('cfg-adworkmedia', s.adworkmedia);
  populateField('cfg-ogads', s.ogads);
  populateField('cfg-adsterra-social', s.adsterraSocial);
  populateField('cfg-adsterra-pop', s.adsterraPopunder);
  populateField('cfg-freecash', s.freecash);
  populateField('cfg-min-wd', s.minWithdraw);
  if (s.wallet) {
    populateField('cfg-bkash', s.wallet.bkash);
    populateField('cfg-nagad', s.wallet.nagad);
    populateField('cfg-usdt', s.wallet.usdt_trc20);
    populateField('cfg-btc', s.wallet.btc);
    populateField('cfg-bnb', s.wallet.bnb);
    populateField('cfg-xrp', s.wallet.xrp);
    populateField('cfg-sol', s.wallet.sol);
    populateField('cfg-usdc', s.wallet.usdc);
  }
  if (s.telegram) { const el = document.getElementById('tg-link'); if (el) el.href = s.telegram; }
  if (s.youtube) { const el = document.getElementById('yt-link'); if (el) el.href = s.youtube; }
  if (s.facebook) { const el = document.getElementById('fb-link'); if (el) el.href = s.facebook; }
}
function injectAdsterra() {
  const s = state.settings;
  if (!s) return;
  const container = document.getElementById('adsterra-scripts');
  container.innerHTML = '';
  if (s.adsterraSocial) {
    const div = document.createElement('div');
    div.innerHTML = s.adsterraSocial;
    container.appendChild(div);
  }
  if (s.adsterraPopunder) {
    const div = document.createElement('div');
    div.innerHTML = s.adsterraPopunder;
    container.appendChild(div);
  }
}

// HELPERS
function addBalance(amount) {
  state.balance += amount;
  localStorage.setItem('earnbd_balance', state.balance);
}
function addPoints(pts) {
  state.points += pts;
  localStorage.setItem('earnbd_points', state.points);
}
function addTransaction(type, title, amount) {
  state.transactions.push({ type, title, amount, date: new Date().toLocaleString('bn-BD') });
  localStorage.setItem('earnbd_txs', JSON.stringify(state.transactions));
}
function formatBDT(n) { return parseFloat(n).toFixed(2); }
function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }
function showNotif() { showToast('কোনো নতুন বিজ্ঞপ্তি নেই'); }
function editProfile() { showPage('settings'); showToast('প্রোফাইল সম্পাদনা করুন সেটিংসে'); }

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.remove('hidden');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.add('hidden'), 3000);
}

// Daily check-in auto bonus
(function dailyBonus() {
  const today = new Date().toDateString();
  const last = localStorage.getItem('earnbd_last_login');
  if (last !== today) {
    localStorage.setItem('earnbd_last_login', today);
    if (localStorage.getItem('earnbd_user')) {
      setTimeout(() => {
        addBalance(5);
        addPoints(10);
        addTransaction('credit', 'দৈনিক লগইন বোনাস', 5);
        showToast('দৈনিক বোনাস: ৳৫ পেয়েছেন! 🎉', 'success');
        updateUI();
      }, 3000);
    }
  }
})();
