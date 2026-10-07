const storageKey = 'aurora-mvp-v1';
const seed = {
  pig: 86, rabbit: 64, court: 'open',
  wishes: [
    { id: 1, title: '下次见面一起看日落', text: '不用去很远的地方，和你慢慢等天黑就好。', owner: '柠檬', cost: 100, progress: 64, status: '积累中' },
    { id: 2, title: '想听你说一次“辛苦啦”', text: '在我觉得累的时候，想被你抱抱。', owner: '执意', cost: 30, progress: 28, status: '快要解锁' }
  ],
  fruits: [{ title: '给彼此写一封信', date: '2026.09.18', icon: '🍑' }, { title: '第一次云同步看电影', date: '2026.08.24', icon: '🍋' }, { title: '一起等流星雨', date: '2026.07.07', icon: '🍒' }],
  activities: [{ icon: '✨', title: '柠檬送给执意 5 极光分', note: '“今天有好好照顾自己” · 刚刚' }, { icon: '✉️', title: '执意完成了一个小任务', note: '发来一段晚安语音 · 2 小时前' }, { icon: '🌱', title: '一枚愿望果实成熟了', note: '“一起等流星雨” · 昨天' }]
};
let state = JSON.parse(localStorage.getItem(storageKey) || 'null') || structuredClone(seed);
const $ = (selector) => document.querySelector(selector);
const save = () => localStorage.setItem(storageKey, JSON.stringify(state));
const escapeHTML = (str) => String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2400); }
function renderToday() {
  $('#todayList').innerHTML = `<div class="today-item"><span class="today-icon">${state.court === 'open' ? '⚖️' : '💜'}</span><div><b>${state.court === 'open' ? '有一件小委屈，等你回应' : '小法庭已温柔结案'}</b><small>${state.court === 'open' ? '柠檬在等执意的修复方案' : '你们又向彼此靠近了一点'}</small></div><span class="item-arrow">›</span></div><div class="today-item"><span class="today-icon">✉️</span><div><b>今日轻任务：分享一件开心的小事</b><small>完成后可获得 5 极光分</small></div><span class="item-arrow">›</span></div>`;
  $('#todayList').onclick = () => showScreen(state.court === 'open' ? 'courtScreen' : 'interactionScreen');
}
function renderWishes() {
  $('#wishPool').innerHTML = state.wishes.map((wish) => { const pct = Math.min(100, Math.round(wish.progress / wish.cost * 100)); return `<article class="wish-card"><div class="wish-top"><div><h3>${escapeHTML(wish.title)}</h3><p>${escapeHTML(wish.text)}</p></div><span class="wish-badge">${wish.status}</span></div><div class="wish-meter"><i style="width:${pct}%"></i></div><div class="wish-footer"><span>${wish.owner}的愿望</span><span>${wish.progress} / ${wish.cost} 极光分</span></div></article>`; }).join('');
  $('#wishTree').innerHTML = `<p class="eyebrow">每一颗果实，都是你们做到过的事</p><div class="tree">🌳</div><div class="fruit-list">${state.fruits.map((fruit) => `<article class="fruit"><span>${fruit.icon}</span><b>${escapeHTML(fruit.title)}</b><small>${fruit.date}</small></article>`).join('')}</div>`;
}
function renderActivities() { $('#activityList').innerHTML = state.activities.slice(0, 5).map((x) => `<div class="activity-row"><span class="activity-dot">${x.icon}</span><div><b>${escapeHTML(x.title)}</b><small>${escapeHTML(x.note)}</small></div></div>`).join(''); }
function renderCourt() {
  const card = $('#courtCase'); card.classList.toggle('hidden', state.court !== 'open');
  if (state.court !== 'open') $('#courtScreen .court-footnote').textContent = state.court === 'withdrawn' ? '柠檬兔子撤回了案件。愿你们把想说的话，留给一个温柔的时刻。' : '案件已结案。执意小猪正在准备一段认真又软乎乎的修复。';
}
function render() { $('#pigPoints').textContent = state.pig; $('#rabbitPoints').textContent = state.rabbit; $('#fruitCount').textContent = state.fruits.length; renderToday(); renderWishes(); renderActivities(); renderCourt(); }
function showScreen(id) { document.querySelectorAll('.screen').forEach((x) => x.classList.toggle('active', x.id === id)); document.querySelectorAll('.tabbar button').forEach((x) => x.classList.toggle('active', x.dataset.go === id)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function openModal(html) { $('#modalContent').innerHTML = html; $('#modal').showModal(); }
function closeModal() { $('#modal').close(); }
document.querySelectorAll('[data-go]').forEach((x) => x.addEventListener('click', () => showScreen(x.dataset.go)));
$('#modalClose').onclick = closeModal;
$('#modal').addEventListener('click', (event) => { if (event.target === $('#modal')) closeModal(); });
$('#newWishButton').onclick = () => openModal(`<h2 class="modal-title">种下一个愿望</h2><p class="modal-desc">先写下心意，再让对方确认兑换所需的极光分。</p><form id="wishForm"><label class="field">愿望标题<input name="title" required placeholder="例如：下次见面一起去散步" maxlength="26"></label><label class="field">想说的话<textarea name="text" placeholder="把期待说得具体一点吧"></textarea></label><label class="field">初始目标分<select name="cost"><option value="30">30 极光分 · 轻轻的期待</option><option value="60" selected>60 极光分 · 认真期待</option><option value="100">100 极光分 · 特别期待</option></select></label><button class="modal-submit">种下愿望</button></form>`);
$('#pointButton').onclick = () => openModal(`<h2 class="modal-title">送一颗极光分</h2><p class="modal-desc">夸夸对方，也把这份心意留下来。</p><form id="pointForm"><label class="field">送给谁<select name="target"><option value="rabbit">柠檬兔子</option><option value="pig">执意小猪</option></select></label><label class="field">极光分<input type="number" name="amount" value="5" min="1" max="100"></label><label class="field">夸夸原因<input name="reason" placeholder="例如：今天有好好照顾自己" maxlength="30"></label><button class="modal-submit">送出心意</button></form>`);
$('#taskButton').onclick = () => openModal(`<h2 class="modal-title">发一个小任务</h2><p class="modal-desc">让期待变得轻一点、好玩一点。</p><form id="taskForm"><label class="field">任务内容<input name="task" required placeholder="例如：给我发一张此刻的照片" maxlength="40"></label><label class="field">完成奖励<input type="number" name="reward" value="5" min="1" max="100"></label><button class="modal-submit">发给柠檬</button></form>`);
$('#capsuleButton').onclick = () => openModal(`<h2 class="modal-title">惊喜胶囊</h2><p class="modal-desc">MVP 已预留此玩法。云端版将支持文字与图片，并由任务或积分解锁。</p><button class="modal-submit" id="closeCapsule">好，期待它成熟</button>`);
$('#appealButton').onclick = () => openModal(`<h2 class="modal-title">小猪的申诉</h2><p class="modal-desc">好好解释不是辩输赢，而是让对方知道你的处境。</p><label class="field">想对柠檬说的话<textarea placeholder="我不是故意忘记你的…"></textarea></label><button class="modal-submit" id="appealSubmit">提交申诉</button>`);
$('#cuteButton').onclick = () => toast('执意小猪递出一张撒娇卡：可以抱抱再判吗？ 🥺');
$('#acceptCourtButton').onclick = () => { state.pig = Math.max(0, state.pig - 4); state.court = 'accepted'; state.activities.unshift({ icon: '💜', title: '执意接受了恋爱小法庭的修复', note: '扣除 4 极光分，准备一段晚安语音 · 刚刚' }); save(); render(); toast('已温柔结案。去完成修复任务吧。'); };
$('#withdrawButton').onclick = () => { state.court = 'withdrawn'; state.activities.unshift({ icon: '🕊️', title: '柠檬撤回了恋爱小法庭', note: '把想说的话，留给更温柔的时刻 · 刚刚' }); save(); render(); toast('案件已撤回。'); };
function invite() { openModal(`<h2 class="modal-title">邀请柠檬进入 Aurora</h2><p class="modal-desc">正式版会生成一次性绑定链接。现在可先复制演示邀请文案发到微信。</p><label class="field">邀请文案<textarea readonly>柠檬，来和我一起点亮 Aurora 吧 ✦</textarea></label><button class="modal-submit" id="copyInvite">复制邀请文案</button><p class="modal-note">本地演示版不含真实配对与跨设备同步。</p>`); }
$('#inviteButton').onclick = invite; $('#inviteListButton').onclick = invite;
$('#renameButton').onclick = () => openModal(`<h2 class="modal-title">给伙伴改个名字</h2><p class="modal-desc">默认是执意小猪与柠檬兔子。正式版会同步到二人空间。</p><form id="renameForm"><label class="field">小猪的新名字<input value="执意" maxlength="10"></label><label class="field">兔子的新名字<input value="柠檬" maxlength="10"></label><button class="modal-submit">保存昵称</button></form>`);
$('#pauseButton').onclick = () => toast('已进入演示暂停状态。云端版会通知另一位伙伴。');
$('#settingsButton').onclick = () => toast('设置会在 CloudBase 接入后开放。');
$('#resetButton').onclick = () => { if (confirm('确定恢复到初始演示数据吗？')) { state = structuredClone(seed); save(); render(); toast('已恢复初始演示数据。'); } };
document.addEventListener('submit', (event) => {
  event.preventDefault(); const data = new FormData(event.target);
  if (event.target.id === 'wishForm') { const cost = Number(data.get('cost')); state.wishes.unshift({ id: Date.now(), title: data.get('title'), text: data.get('text') || '这是一件想和你一起实现的小事。', owner: '执意', cost, progress: 0, status: '等待对方确认分值' }); toast('愿望已种下，等柠檬确认分值。'); }
  if (event.target.id === 'pointForm') { const amount = Number(data.get('amount')); const target = data.get('target'); state[target] += amount; state.activities.unshift({ icon: '✨', title: `执意送给${target === 'pig' ? '自己' : '柠檬'} ${amount} 极光分`, note: `“${data.get('reason') || '因为你值得被夸夸'}” · 刚刚` }); toast('极光分已送达 ✦'); }
  if (event.target.id === 'taskForm') { state.activities.unshift({ icon: '✉️', title: '执意发出了一个小任务', note: `${data.get('task')} · 奖励 ${data.get('reward')} 极光分` }); toast('小任务已飞向柠檬。'); }
  if (event.target.id === 'renameForm') toast('角色昵称已保存。正式版会同步到二人空间。');
  save(); render(); closeModal();
});
document.addEventListener('click', async (event) => {
  if (event.target.id === 'closeCapsule') closeModal();
  if (event.target.id === 'appealSubmit') { state.activities.unshift({ icon: '💌', title: '执意提交了申诉', note: '等待柠檬看到这份解释 · 刚刚' }); save(); render(); closeModal(); toast('申诉已送达柠檬。'); }
  if (event.target.id === 'copyInvite') { try { await navigator.clipboard.writeText('柠檬，来和我一起点亮 Aurora 吧 ✦'); } catch (_) {} toast('邀请文案已复制。'); }
});
document.querySelectorAll('[data-wish-tab]').forEach((x) => x.addEventListener('click', () => { document.querySelectorAll('[data-wish-tab]').forEach((b) => b.classList.toggle('selected', b === x)); $('#wishPool').classList.toggle('hidden', x.dataset.wishTab !== 'pool'); $('#wishTree').classList.toggle('hidden', x.dataset.wishTab !== 'tree'); }));
render();
