const booking=document.getElementById('booking');
const openers=document.querySelectorAll('[data-book]');
const close=document.querySelector('[data-close]');
const form=document.getElementById('bookingForm');
const reviewForm=document.getElementById('reviewForm');
const reviewList=document.getElementById('reviewList');
const reviewEmpty=document.getElementById('reviewEmpty');
const toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);
const DB_KEY='crossesV5DB';
const uid=(prefix)=>`${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Date.now()+Math.random()}`;
const normalizePhone=v=>(v||'').replace(/[^0-9+]/g,'');
function getDB(){try{return JSON.parse(localStorage.getItem(DB_KEY))||{owners:[],clients:[],reviews:[],bookings:[]}}catch{return {owners:[],clients:[],reviews:[],bookings:[]}}}
function saveDB(db){localStorage.setItem(DB_KEY,JSON.stringify(db))}
function dedupeClients(clients){const map=new Map();clients.forEach(c=>{const key=(c.email||'').trim().toLowerCase()||normalizePhone(c.phone)||c.clientId;if(key&&!map.has(key))map.set(key,c)});return [...map.values()]}
function show(){booking.classList.add('show');document.body.style.overflow='hidden'}
function hide(){booking.classList.remove('show');document.body.style.overflow=''}
openers.forEach(b=>b.addEventListener('click',show));close.addEventListener('click',hide);booking.addEventListener('click',e=>{if(e.target===booking)hide()});
form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const db=getDB();const phone=normalizePhone(d.get('phone'));const name=(d.get('name')||'').trim();const existing=db.clients.find(c=>normalizePhone(c.phone)===phone&&phone);const client=existing||{clientId:uid('client'),name,phone,createdAt:new Date().toISOString()};if(existing){existing.name=name||existing.name;existing.updatedAt=new Date().toISOString()}else db.clients.push(client);db.clients=dedupeClients(db.clients);db.bookings.push({bookingId:uid('booking'),clientId:client.clientId,name,phone,service:d.get('service'),date:d.get('date'),time:d.get('time'),notes:d.get('notes')||'',createdAt:new Date().toISOString()});saveDB(db);const text=`Hi Davian, I'd like to book with Crosses & Clippers.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AService: ${encodeURIComponent(d.get('service'))}%0ADate: ${encodeURIComponent(d.get('date'))}%0ATime: ${encodeURIComponent(d.get('time'))}%0ANotes: ${encodeURIComponent(d.get('notes')||'None')}`;window.open(`https://wa.me/27716369939?text=${text}`,'_blank');form.reset();hide();notify('Booking saved and WhatsApp opened.')});
function renderReviews(){const db=getDB();reviewList.innerHTML=db.reviews.filter(r=>r.status==='approved').map(r=>`<article class="review-item"><div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div><p>${escapeHtml(r.review)}</p><strong>${escapeHtml(r.name)}</strong></article>`).join('');reviewEmpty.style.display=db.reviews.some(r=>r.status==='approved')?'none':'block'}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
reviewForm.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(reviewForm);const db=getDB();const phone=normalizePhone(d.get('phone'));let client=db.clients.find(c=>normalizePhone(c.phone)===phone&&phone);if(!client){client={clientId:uid('client'),name:d.get('name'),phone,createdAt:new Date().toISOString()};db.clients.push(client)}if(db.reviews.some(r=>r.clientId===client.clientId&&r.status!=='rejected')){notify('A review already exists for this client.');return}db.reviews.push({reviewId:uid('review'),clientId:client.clientId,name:d.get('name'),rating:Number(d.get('rating')),review:d.get('review'),status:'approved',createdAt:new Date().toISOString()});db.clients=dedupeClients(db.clients);saveDB(db);reviewForm.reset();renderReviews();notify('Thank you — your review has been added.')});
function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}
const nav=document.querySelector('nav');document.querySelector('.hamb').addEventListener('click',()=>{nav.style.display=nav.style.display==='flex'?'':'flex';nav.style.position='absolute';nav.style.top='82px';nav.style.left='0';nav.style.right='0';nav.style.padding='25px';nav.style.flexDirection='column';nav.style.alignItems='stretch';nav.style.background='#0b0b0b'});
renderReviews();
