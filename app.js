const booking=document.getElementById('booking');
const openers=document.querySelectorAll('[data-book]');
const close=document.querySelector('[data-close]');
const form=document.getElementById('bookingForm');
const toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);
function show(){booking.classList.add('show');document.body.style.overflow='hidden'}
function hide(){booking.classList.remove('show');document.body.style.overflow=''}
openers.forEach(b=>b.addEventListener('click',show));close.addEventListener('click',hide);booking.addEventListener('click',e=>{if(e.target===booking)hide()});
form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const text=`Hi Davian, I'd like to book with Crosses & Clippers.%0A%0AName: ${encodeURIComponent(d.get('name'))}%0APhone: ${encodeURIComponent(d.get('phone'))}%0AService: ${encodeURIComponent(d.get('service'))}%0ADate: ${encodeURIComponent(d.get('date'))}%0ATime: ${encodeURIComponent(d.get('time'))}%0ANotes: ${encodeURIComponent(d.get('notes')||'None')}`;const record=Object.fromEntries(d.entries());record.createdAt=new Date().toISOString();const old=JSON.parse(localStorage.getItem('crossesBookings')||'[]');old.push(record);localStorage.setItem('crossesBookings',JSON.stringify(old));window.open(`https://wa.me/27716369939?text=${text}`,'_blank');form.reset();hide();toast.textContent='Booking message prepared for WhatsApp.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)});
const nav=document.querySelector('nav');document.querySelector('.hamb').addEventListener('click',()=>{nav.style.display=nav.style.display==='flex'?'':'flex';nav.style.position='absolute';nav.style.top='82px';nav.style.left='0';nav.style.right='0';nav.style.padding='25px';nav.style.flexDirection='column';nav.style.alignItems='stretch';nav.style.background='#0b0b0b'});
