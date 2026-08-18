(() => {
  const REVIEW_KEY='cc_reviews';
  const CLIENT_KEY='cc_clients';
  const OWNER_KEY='cc_owner';
  const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
  const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stars=n=>'★★★★★'.slice(0,n)+'☆☆☆☆☆'.slice(0,5-n);

  function initBooking(){
    const modal=document.getElementById('booking');
    document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>modal?.classList.add('show')));
    document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>modal?.classList.remove('show')));
    modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
    document.getElementById('bookingForm')?.addEventListener('submit',e=>{
      e.preventDefault();const f=new FormData(e.currentTarget);
      const msg=`Hi Davian, I'd like to book a cut with Crosses & Clippers.%0A%0AName: ${encodeURIComponent(f.get('name'))}%0APhone: ${encodeURIComponent(f.get('phone'))}%0AService: ${encodeURIComponent(f.get('service'))}%0ADate: ${encodeURIComponent(f.get('date'))}%0ATime: ${encodeURIComponent(f.get('time'))}%0ANotes: ${encodeURIComponent(f.get('notes')||'')}`;
      window.open(`https://wa.me/27716369939?text=${msg}`,'_blank','noopener');
      modal?.classList.remove('show');e.currentTarget.reset();
    });
  }

  function initMobile(){
    const nav=document.querySelector('.nav nav'),hamb=document.querySelector('.hamb');
    if(!nav||!hamb)return;
    hamb.addEventListener('click',()=>{nav.style.display=nav.style.display==='flex'?'':'flex';nav.style.position='absolute';nav.style.top='78px';nav.style.left='0';nav.style.right='0';nav.style.padding='22px 6vw';nav.style.background='#090909';nav.style.flexDirection='column';nav.style.alignItems='flex-start';});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<=950)nav.style.display=''}));
  }

  function initReviews(){
    const form=document.getElementById('reviewForm'),list=document.getElementById('reviewsList'),rating=document.getElementById('ratingStars');
    if(!form||!list)return;
    let selected=0;
    rating?.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{selected=Number(btn.dataset.rating);rating.querySelectorAll('button').forEach(x=>x.classList.toggle('active',Number(x.dataset.rating)<=selected))}));
    const render=()=>{
      const reviews=get(REVIEW_KEY,[]).filter(r=>r.approved);
      list.innerHTML=reviews.length?reviews.map(r=>`<article class="v5-review"><div class="stars">${stars(r.rating)}</div><small>${esc(r.name)} • ${new Date(r.createdAt).toLocaleDateString()}</small><p>${esc(r.comment)}</p></article>`).join(''):'<div class="v5-review"><p>No approved reviews yet. Be the first to share your experience.</p></div>';
      renderAdmin();
    };
    form.addEventListener('submit',e=>{e.preventDefault();if(!selected)return alert('Please select a star rating.');const f=new FormData(form);const id=(crypto.randomUUID?.()||Date.now().toString());const review={id,name:f.get('name'),email:f.get('email'),rating:selected,comment:f.get('comment'),approved:false,createdAt:new Date().toISOString()};const reviews=get(REVIEW_KEY,[]);reviews.unshift(review);put(REVIEW_KEY,reviews);const clients=get(CLIENT_KEY,[]);clients.unshift({id,name:review.name,email:review.email,createdAt:review.createdAt});put(CLIENT_KEY,clients);selected=0;rating?.querySelectorAll('button').forEach(x=>x.classList.remove('active'));form.reset();alert('Thank you. Your review has been submitted for owner approval.');render();});
    render();
  }

  function renderAdmin(){
    const panel=document.getElementById('adminPanel'),reviewsBox=document.getElementById('adminReviews'),clientsBox=document.getElementById('clientsPanel');if(!panel||!reviewsBox||!clientsBox)return;
    const reviews=get(REVIEW_KEY,[]),clients=get(CLIENT_KEY,[]);
    reviewsBox.innerHTML='<p class="eyebrow">REVIEW MANAGEMENT</p>'+(reviews.length?reviews.map(r=>`<div class="v5-admin-row"><span><b>${esc(r.name)}</b> — ${stars(r.rating)}<br>${esc(r.comment)}</span><span>${r.approved?'':'<button class="approve" data-approve="'+r.id+'">APPROVE</button>'}<button data-delete="${r.id}">DELETE</button></span></div>`).join(''):'<p class="v5-login-note">No reviews yet.</p>');
    reviewsBox.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>{const a=get(REVIEW_KEY,[]);const r=a.find(x=>x.id===b.dataset.approve);if(r)r.approved=true;put(REVIEW_KEY,a);initReviews()});
    reviewsBox.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{put(REVIEW_KEY,get(REVIEW_KEY,[]).filter(x=>x.id!==b.dataset.delete));initReviews()});
    clientsBox.innerHTML='<p class="eyebrow">CLIENT DATABASE</p><p class="v5-login-note">'+clients.length+' client record(s).</p>'+(clients.length?clients.map(c=>`<div class="v5-admin-row"><span><b>${esc(c.name)}</b><br>${esc(c.email||'No email')}</span></div>`).join(''):'<p class="v5-login-note">No client records yet.</p>');
  }

  function initOwner(){
    const modal=document.getElementById('ownerModal'),open=document.getElementById('ownerLoginBtn'),close=document.getElementById('ownerClose'),form=document.getElementById('ownerForm'),panel=document.getElementById('adminPanel');
    if(!modal||!open||!form)return;
    open.onclick=()=>modal.classList.add('show');close&&(close.onclick=()=>modal.classList.remove('show'));
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
    form.addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('ownerEmail').value.trim().toLowerCase(),password=document.getElementById('ownerPassword').value,saved=get(OWNER_KEY,null);if(password.length<6)return alert('Password must be at least 6 characters.');if(!saved){put(OWNER_KEY,{email,password});panel.classList.add('show');modal.classList.remove('show');renderAdmin();alert('Owner account created on this browser.');return}if(saved.email!==email||saved.password!==password)return alert('Owner login details do not match.');panel.classList.add('show');modal.classList.remove('show');renderAdmin();});
  }

  function init(){initBooking();initMobile();initReviews();initOwner();}
  document.addEventListener('DOMContentLoaded',init);
})();