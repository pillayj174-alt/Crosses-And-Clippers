const defaults=[
 {name:"Haircut",desc:"Professional haircut.",price:"",duration:""},
 {name:"Fade",desc:"Precision fade.",price:"",duration:""},
 {name:"Taper",desc:"Clean taper styling.",price:"",duration:""},
 {name:"Beard",desc:"Professional beard grooming.",price:"",duration:""},
 {name:"Line-up",desc:"Sharp, detailed line-up.",price:"",duration:""},
 {name:"Custom Style",desc:"Personalized barbering.",price:"",duration:""}
];
const stored=JSON.parse(localStorage.getItem("cac-v3-services")||"null")||defaults;
const grid=document.getElementById("serviceGrid"), select=document.getElementById("serviceSelect");
function renderServices(){grid.innerHTML="";select.innerHTML='<option value="">Select a service</option>';stored.forEach((s,i)=>{grid.insertAdjacentHTML("beforeend",`<article class="service"><small>0${i+1}</small><h3>${s.name}</h3><p>${s.desc}</p>${s.price||s.duration?`<div class="serviceMeta">${s.price?`<span>${s.price}</span>`:""} ${s.duration?`<span>${s.duration}</span>`:""}</div>`:""}<button data-book>BOOK ↗</button></article>`);select.insertAdjacentHTML("beforeend",`<option>${s.name}</option>`)});document.querySelectorAll("[data-book]").forEach(b=>b.addEventListener("click",openModal))}
renderServices();

const modal=document.getElementById("bookingModal");
function openModal(){modal.classList.add("show");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
document.querySelectorAll("[data-book]").forEach(b=>b.addEventListener("click",openModal));
document.getElementById("closeModal").onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});

const form=document.getElementById("bookingForm"), success=document.getElementById("success");
form.addEventListener("submit",e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));const list=JSON.parse(localStorage.getItem("cac-bookings-v3")||"[]");list.push({...data,createdAt:new Date().toISOString()});localStorage.setItem("cac-bookings-v3",JSON.stringify(list));form.style.display="none";success.classList.add("show")});

document.getElementById("hamb").addEventListener("click",()=>document.querySelector(".nav").classList.toggle("open"));
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>document.querySelector(".nav").classList.remove("open")));
