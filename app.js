const booking=document.getElementById('booking');
const adminModal=document.getElementById('adminModal');
const toast=document.getElementById('toast');
const sbReady=window.CC_SUPABASE_URL && !window.CC_SUPABASE_URL.includes('YOUR_') && window.CC_SUPABASE_ANON_KEY && !window.CC_SUPABASE_ANON_KEY.includes('YOUR_');
const supabaseClient=sbReady && window.supabase ? window.supabase.createClient(window.CC_SUPABASE_URL,window.CC_SUPABASE_ANON_KEY) : null;

function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}
function showModal(el){el.classList.add('show');document.body.style.overflow='hidden'}
function hideModal(el){el.classList.remove('show');document.body.style.overflow=''}

document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>showModal(booking)));
document.querySelector('[data-close]').addEventListener('click',()=>hideModal(booking));
booking.addEventListener('click',e=>{if(e.target===booking)hideModal(booking)});

document.getElementById('bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(e.currentTarget);
  const text=`Hi Davian, I'd like to book with Crosses & Clippers.%0A%0AName: ${encodeURIComponent(d.get('name'))}%0APhone: ${encodeURIComponent(d.get('phone'))}%0AService: ${encodeURIComponent(d.get('service'))}%0ADate: ${encodeURIComponent(d.get('date'))}%0ATime: ${encodeURIComponent(d.get('time'))}%0ANotes: ${encodeURIComponent(d.get('notes')||'None')}`;
  window.open(`https://wa.me/27716369939?text=${text}`,'_blank');
  e.currentTarget.reset();hideModal(booking);showToast('Booking message prepared for WhatsApp.');
});

const nav=document.querySelector('.desktop-nav');
document.querySelector('.hamb').addEventListener('click',()=>{
  const open=nav.dataset.mobile==='open';
  if(open){nav.dataset.mobile='';nav.removeAttribute('style')}
  else{nav.dataset.mobile='open';Object.assign(nav.style,{display:'flex',position:'absolute',top:'82px',left:'0',right:'0',padding:'25px',flexDirection:'column',alignItems:'stretch',background:'#0b0b0b'})}
});

async function loadReviews(){
  const list=document.getElementById('reviewList');
  if(!supabaseClient){list.innerHTML='<div class="empty-state">Reviews will appear here once the V5 database is connected.</div>';return}
  const {data,error}=await supabaseClient.from('reviews').select('id,name,rating,comment,created_at').eq('status','approved').order('created_at',{ascending:false});
  if(error){list.innerHTML='<div class="empty-state">Reviews are temporarily unavailable.</div>';return}
  if(!data.length){list.innerHTML='<div class="empty-state">Be the first client to leave a review.</div>';return}
  list.innerHTML=data.map(r=>`<article class="review-item"><div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div><h4>${escapeHtml(r.name)}</h4><p>${escapeHtml(r.comment)}</p><small>${new Date(r.created_at).toLocaleDateString()}</small></article>`).join('');
}
function escapeHtml(v=''){return v.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

document.getElementById('reviewForm').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!supabaseClient){showToast('The review database is not connected yet.');return}
  const d=new FormData(e.currentTarget);
  const {error}=await supabaseClient.from('reviews').insert({name:d.get('name'),email:d.get('email')||null,rating:Number(d.get('rating')),comment:d.get('comment'),status:'pending'});
  if(error){showToast('Could not submit the review. Please try again.');return}
  e.currentTarget.reset();showToast('Thank you. Your review was submitted for approval.');loadReviews();
});

document.getElementById('adminOpen').addEventListener('click',async()=>{showModal(adminModal);await refreshAdmin()});
document.getElementById('adminClose').addEventListener('click',()=>hideModal(adminModal));
adminModal.addEventListener('click',e=>{if(e.target===adminModal)hideModal(adminModal)});

document.getElementById('loginForm').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!supabaseClient){showToast('Connect Supabase in supabase-config.js first.');return}
  const d=new FormData(e.currentTarget);
  const {error}=await supabaseClient.auth.signInWithPassword({email:d.get('email'),password:d.get('password')});
  if(error){showToast(error.message);return}
  e.currentTarget.hidden=true;document.getElementById('adminPanel').hidden=false;await refreshAdmin();
});

document.getElementById('logoutBtn').addEventListener('click',async()=>{
  if(supabaseClient) await supabaseClient.auth.signOut();
  document.getElementById('loginForm').hidden=false;document.getElementById('adminPanel').hidden=true;showToast('Logged out.');
});

document.querySelectorAll('.admin-tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.admin-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  document.querySelectorAll('.admin-tab').forEach(x=>x.hidden=true);document.getElementById(b.dataset.tab).hidden=false;
}));

async function refreshAdmin(){
  if(!supabaseClient)return;
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session){document.getElementById('loginForm').hidden=false;document.getElementById('adminPanel').hidden=true;return}
  document.getElementById('loginForm').hidden=true;document.getElementById('adminPanel').hidden=false;
  loadAdminReviews();loadAdminClients();
}
async function loadAdminReviews(){
  const wrap=document.getElementById('adminReviews');
  const {data,error}=await supabaseClient.from('reviews').select('*').order('created_at',{ascending:false});
  if(error){wrap.innerHTML='<p>Could not load reviews.</p>';return}
  if(!data.length){wrap.innerHTML='<p>No reviews yet.</p>';return}
  wrap.innerHTML=data.map(r=>`<div class="admin-review"><strong>${escapeHtml(r.name)} • ${r.rating}/5 • ${r.status}</strong><p>${escapeHtml(r.comment)}</p><div class="admin-actions">${r.status!=='approved'?`<button class="approve" data-approve="${r.id}">APPROVE</button>`:''}<button data-delete-review="${r.id}">DELETE</button></div></div>`).join('');
  wrap.querySelectorAll('[data-approve]').forEach(b=>b.addEventListener('click',async()=>{await supabaseClient.from('reviews').update({status:'approved'}).eq('id',b.dataset.approve);loadAdminReviews();loadReviews()}));
  wrap.querySelectorAll('[data-delete-review]').forEach(b=>b.addEventListener('click',async()=>{if(confirm('Delete this review?')){await supabaseClient.from('reviews').delete().eq('id',b.dataset.deleteReview);loadAdminReviews();loadReviews()}}));
}
async function loadAdminClients(){
  const wrap=document.getElementById('adminClients');
  const {data,error}=await supabaseClient.from('clients').select('*').order('created_at',{ascending:false});
  if(error){wrap.innerHTML='<p>Could not load clients.</p>';return}
  wrap.innerHTML=data.length?data.map(c=>`<div class="client-row"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.phone||'')} ${escapeHtml(c.email||'')}</span><span>${escapeHtml(c.notes||'')}</span></div>`).join(''):'<p>No clients yet.</p>';
}
document.getElementById('clientForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!supabaseClient)return;
  const d=new FormData(e.currentTarget);
  const {error}=await supabaseClient.from('clients').insert({name:d.get('name'),phone:d.get('phone'),email:d.get('email'),notes:d.get('notes')});
  if(error){showToast(error.message);return}e.currentTarget.reset();showToast('Client added.');loadAdminClients();
});
loadReviews();
if(supabaseClient){supabaseClient.auth.onAuthStateChange(()=>refreshAdmin())}
