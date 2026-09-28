
const PRODUCTS = [
 {slug:'capcut',logo:'https://drive.google.com/thumbnail?id=12rd2-F3smW44wjp3FUL0ggqP9esaF7FV&sz=w1000',name:'CapCut Pro',category:'Video & Editing',icon:'fa-video',price:'Rs. 180',description:'Premium video editing access for creators.',plans:[
  {name:'7 Days',price:'Rs. 180',details:'Short-term access'},
  {name:'1 Month',price:'Rs. 649',details:'Premium editing access'}
 ],features:['Premium transitions','Cloud storage','Advanced filters & effects','Pro templates'],stock:'Available'},
 {slug:'gemini',logo:'https://drive.google.com/thumbnail?id=1j8URbAKCTgYC0r-qzhXqIK_ZnNSZuG0X&sz=w1000',name:'Gemini',category:'AI Tools',icon:'fa-robot',price:'Rs. 999',description:'Premium AI access for smarter work and creativity.',plans:[
  {name:'18 Months',price:'Rs. 999',details:'Active on your mail'}
 ],features:['AI assistance','Long-term access','Productivity support'],stock:'In Stock (5)'},
 {slug:'canva',logo:'https://drive.google.com/thumbnail?id=1yH-jlpzpY-kZ5VYAniI6M8g5ZwvhBP6i&sz=w1000',name:'Canva Edu',category:'Design & Creative',icon:'fa-palette',price:'Rs. 149',description:'Premium design access for creative projects.',plans:[
  {name:'1 Month',price:'Rs. 149',details:'Premium design access'},
  {name:'3 Months',price:'Rs. 199',details:'Extended access'}
 ],features:['Premium design tools','Multiple accounts','Creative templates'],stock:'Available'},
 {slug:'surfshark',logo:'https://nhatphuc.com/wp-content/uploads/2022/02/surfshark-logo-960x960.webp',name:'Surfshark VPN',category:'VPN & Security',icon:'fa-shield-halved',price:'Rs. 299',description:'VPN subscription for private browsing and online security.',plans:[
  {name:'Monthly',price:'Rs. 299',details:'Monthly access'}
 ],features:['VPN access','Privacy tools','Multi-device support'],stock:'In Stock (4)'},
 {slug:'netflix',logo:'https://drive.google.com/thumbnail?id=1R17XYrlzWDF91kORrA4Iw1clUfGgTsVV&sz=w1000',name:'Netflix',category:'Entertainment',icon:'fa-film',price:'Rs. 349',description:'Entertainment subscription with 4K plan availability.',plans:[
  {name:'1 Month 4K',price:'Rs. 349',details:'4K resolution'}
 ],features:['4K resolution','Entertainment library','1 month access'],stock:'In Stock (2)'},
 {slug:'office365',logo:'https://drive.google.com/thumbnail?id=1seMGx02uJScl3dq7RzIhNSTNi9BTPvjh&sz=w1000',name:'MS Office 365 Plus',category:'Productivity',icon:'fa-file-word',price:'Rs. 999',description:'Productivity suite for documents, spreadsheets and more.',plans:[
  {name:'12 Months',price:'Rs. 999',details:'Annual access'}
 ],features:['Office productivity tools','12 months access','Cloud productivity'],stock:'In Stock (20)'},
 {slug:'adobe-express',logo:'https://drive.google.com/thumbnail?id=1ucXCM65kcLvTXh6taiVdgPjXSPoiNZBG&sz=w1000',name:'Adobe Express Premium',category:'Design & Creative',icon:'fa-wand-magic-sparkles',price:'Rs. 799',description:'Premium creative tools for fast content creation.',plans:[
  {name:'12 Months',price:'Rs. 799',details:'Annual access'}
 ],features:['Premium creative tools','Templates','12 months access'],stock:'In Stock (7)'},
 {slug:'ilovepdf',logo:'https://congressus-bilboard.s3-eu-west-1.amazonaws.com/files/61a9b343a72b44a4a51937f27e713efb.png',name:'iLovePDF Premium',category:'Productivity',icon:'fa-file-pdf',price:'Rs. 499',description:'Premium PDF tools for everyday document workflows.',plans:[
  {name:'12 Months',price:'Rs. 499',details:'Annual access'}
 ],features:['PDF tools','Document workflow','12 months access'],stock:'In Stock (10)'},
 {slug:'quillbot',logo:'https://drive.google.com/thumbnail?id=1IB4rTPpONfJujOtUZDA7mUekgs4Pt1L6&sz=w1000',name:'QuillBot',category:'Education',icon:'fa-pen-nib',price:'Rs. 699',description:'Writing and productivity assistance for students and creators.',plans:[
  {name:'1 Month',price:'Rs. 699',details:'Monthly access'}
 ],features:['Writing assistance','Productivity tools','1 month access'],stock:'In Stock (1)'},
 {slug:'duolingo',logo:'https://drive.google.com/thumbnail?id=1prhyndVHF3tkB2Qdffyuc8Sg5GtkmSbS&sz=w1000',name:'Super Duolingo',category:'Education',icon:'fa-language',price:'Rs. 949',description:'Premium language-learning access.',plans:[
  {name:'12 Months',price:'Rs. 949',details:'Annual access'}
 ],features:['Language learning','Premium access','12 months access'],stock:'In Stock (4)'},
 {slug:'youtube-premium',logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/YouTube_Premium_logo_2024.svg/3840px-YouTube_Premium_logo_2024.svg.png',name:'YouTube Premium',category:'Entertainment',icon:'fa-youtube',price:'Rs. 1199',description:'Premium YouTube experience for entertainment and learning.',plans:[
  {name:'3 Months',price:'Rs. 1199',details:'Three-month access'}
 ],features:['Premium viewing','3 months access','Enhanced experience'],stock:'In Stock (2)'}
];

const LOGO_FIT={
 capcut:{size:'48px'},gemini:{size:'39px'},canva:{size:'48px'},surfshark:{size:'48px'},
 netflix:{size:'48px'},office365:{size:'46px'},'adobe-express':{size:'48px'},ilovepdf:{size:'48px'},
 quillbot:{size:'46px'},duolingo:{size:'48px'},'youtube-premium':{size:'48px'}
};
function logoStyle(p){const fit=LOGO_FIT[p.slug]||{size:'48px'};return `--logo-size:${fit.size}`;}

const WA_NUMBER='923351925662';

function productBySlug(slug){return PRODUCTS.find(p=>p.slug===slug)}
function money(p){return p.price}
function productCard(p){
 return `<div class="col-12 col-md-6 col-lg-4 product-item" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
   <div class="glass-card product-card d-flex flex-column">
    <div class="product-icon-wrap"><div class="product-icon" style="${logoStyle(p)}"><img src="${p.logo}" alt="${p.name} logo" loading="lazy"><i class="fa-solid ${p.icon}" aria-hidden="true"></i></div></div>
    <div class="small-label">${p.category}</div>
    <h3 class="fw-bold mt-2">${p.name}</h3>
    <p class="text-silver">${p.description}</p>
    <div class="price text-gradient mt-auto">${money(p)}</div>
    <p class="text-silver mb-3">${p.plans.length} plan${p.plans.length>1?'s':''} • ${p.stock}</p>
    <a class="btn btn-gradient w-100" href="product-${p.slug}.html">View Details</a>
   </div>
 </div>`
}
function renderProductGrid(targetId,limit=99){
 const el=document.getElementById(targetId); if(!el)return;
 el.innerHTML=PRODUCTS.slice(0,limit).map(productCard).join('');
}
function setPackage(value){
 const select=document.getElementById('waPackage'); if(select)select.value=value;
}
function openOrder(productName='',plan=''){
 const modal=document.getElementById('whatsappModal');
 if(productName){
  const pkg=plan?`${productName} - ${plan}`:productName;
  const select=document.getElementById('waPackage');
  if(select){
   select.innerHTML=`<option value="${escapeHtml(pkg)}">${escapeHtml(pkg)}</option>`;
   select.value=pkg;
  }
 }
 if(modal) bootstrap.Modal.getOrCreateInstance(modal).show();
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function sendToWhatsApp(e){
 e.preventDefault();
 const name=document.getElementById('waName').value.trim();
 const phone=document.getElementById('waPhone').value.trim();
 const email=document.getElementById('waEmail').value.trim();
 const pkg=document.getElementById('waPackage').value;
 const message=`Hello AR SERVICES! I would like to place an order.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email)}%0A*Package:* ${encodeURIComponent(pkg)}`;
 window.open(`https://wa.me/${WA_NUMBER}?text=${message}`,'_blank');
}
function initStoreFilters(){
 const grid=document.getElementById('storeGrid'), search=document.getElementById('toolSearch');
 if(!grid)return;
 const buttons=[...document.querySelectorAll('.filter-btn')];
 let category='All';
 function apply(){
  const q=(search?.value||'').toLowerCase().trim();
  let shown=0;
  grid.querySelectorAll('.product-item').forEach(card=>{
   const okCat=category==='All'||card.dataset.category===category;
   const okSearch=!q||card.dataset.name.includes(q);
   card.style.display=okCat&&okSearch?'':'none'; if(okCat&&okSearch)shown++;
  });
  const empty=document.getElementById('emptyState'); if(empty)empty.style.display=shown?'none':'block';
 }
 buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');category=b.dataset.category;apply()}));
 search?.addEventListener('input',apply);
 apply();
}
function renderProductPage(){
 const root=document.getElementById('productPage'); if(!root)return;
 const slug=root.dataset.slug,p=productBySlug(slug);
 if(!p){root.innerHTML='<div class="container py-5"><div class="alert alert-danger">Product not found.</div></div>';return}
 document.title=`AR SERVICES - ${p.name}`;
 root.innerHTML=`
 <section class="page-hero">
  <div class="container">
   <div class="product-icon-wrap product-detail-icon-wrap"><div class="product-icon product-detail-icon" style="${logoStyle(p)}"><img src="${p.logo}" alt="${p.name} logo" loading="lazy"><i class="fa-solid ${p.icon}" aria-hidden="true"></i></div></div>
   <div class="small-label">${p.category}</div>
   <h1 class="mt-2">${p.name}</h1>
   <p class="lead text-silver mx-auto" style="max-width:720px">${p.description}</p>
   <div class="d-flex justify-content-center gap-3 flex-wrap mt-4">
    <a href="#plans" class="btn btn-gradient">View Plans</a>
    <button class="btn btn-outline-glass" onclick="openOrder('${escapeHtml(p.name)}')">Buy via WhatsApp</button>
   </div>
  </div>
 </section>
 <section class="section-alt">
  <div class="container">
   <div class="row g-4">
    <div class="col-lg-7">
     <div class="glass-card">
      <h2 class="fw-bold mb-4">Why Choose <span class="text-gradient">${p.name}</span>?</h2>
      <ul class="list-unstyled feature-list">${p.features.map(f=>`<li><i class="fa-solid fa-check"></i>${f}</li>`).join('')}</ul>
      <hr class="border-secondary my-4">
      <p class="text-silver mb-0">Select the plan that fits your needs and continue through our simple WhatsApp ordering process.</p>
     </div>
    </div>
    <div class="col-lg-5"><div class="glass-card sticky-buy text-center">
      <div class="small-label">Starting from</div><div class="display-5 fw-bold text-gradient my-2">${p.price}</div>
      <p class="text-silver">${p.stock}</p>
      <button class="btn btn-gradient w-100" onclick="openOrder('${escapeHtml(p.name)}')">Get ${escapeHtml(p.name)}</button>
     </div></div>
   </div>
  </div>
 </section>
 <section id="plans">
  <div class="container">
   <h2 class="section-title">Choose Your <span class="text-gradient">Plan</span></h2>
   <div class="row justify-content-center g-4">${p.plans.map((pl,i)=>`
    <div class="col-12 col-md-6 col-lg-5"><div class="${i===0&&p.plans.length>1?'premium-border-wrap':''}">
     <div class="glass-card text-center ${i===0&&p.plans.length>1?'h-100':''}">
      ${i===0&&p.plans.length>1?'<span class="badge rounded-pill mb-3" style="background:linear-gradient(90deg,var(--primary),var(--secondary))">Featured Plan</span>':''}
      <h3 class="fw-bold">${pl.name}</h3><p class="text-silver">${pl.details}</p>
      <div class="display-5 fw-bold text-gradient my-3">${pl.price}</div>
      <button class="btn btn-gradient w-100" onclick="openOrder('${escapeHtml(p.name)}','${escapeHtml(pl.name)} - ${escapeHtml(pl.price)}')">Select Plan</button>
     </div>
    </div></div>`).join('')}</div>
  </div>
 </section>
 <section class="section-alt">
  <div class="container">
   <h2 class="section-title">How to <span class="text-gradient">Order</span></h2>
   <div class="row g-4">
    ${[['1','Choose a Plan','Select the plan you want.'],['2','Submit Order','Enter your details in the order form.'],['3','Continue to WhatsApp','Complete the payment conversation.'],['4','Receive Access','Get your subscription/account details through the agreed delivery process.']].map(x=>`<div class="col-12 col-md-6 col-lg-3"><div class="glass-card text-center"><div class="neon-circle-icon fw-bold">${x[0]}</div><h5 class="fw-bold">${x[1]}</h5><p class="text-silver mb-0">${x[2]}</p></div></div>`).join('')}
   </div>
  </div>
 </section>
 <section>
  <div class="container">
   <h2 class="section-title">Product <span class="text-gradient">FAQ</span></h2>
   <div class="accordion mx-auto" style="max-width:850px">
    <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#pf1">How do I order ${escapeHtml(p.name)}?</button></h2><div id="pf1" class="accordion-collapse collapse show"><div class="accordion-body">Choose a plan and use the WhatsApp order button to continue.</div></div></div>
    <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#pf2">Which plan should I choose?</button></h2><div id="pf2" class="accordion-collapse collapse"><div class="accordion-body">Review the plan duration and details above and choose the option that matches your requirements.</div></div></div>
    <div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#pf3">How do I get support?</button></h2><div id="pf3" class="accordion-collapse collapse"><div class="accordion-body">Use the WhatsApp support option or the Support page to contact AR SERVICES.</div></div></div>
   </div>
  </div>
 </section>`;
}
document.addEventListener('DOMContentLoaded',()=>{
 if(window.AOS)AOS.init({duration:600,once:true,offset:50,easing:'ease-in-out'});
 renderProductPage();
 if(document.getElementById('homeProducts'))renderProductGrid('homeProducts',6);
 if(document.getElementById('storeGrid')){renderProductGrid('storeGrid');initStoreFilters()}
 if(document.getElementById('homeReviews'))renderCustomerReviews('homeReviews',6);
 if(document.getElementById('reviewsGrid'))renderCustomerReviews('reviewsGrid',CUSTOMER_REVIEWS.length);
 document.querySelectorAll('.nav-link').forEach(link=>link.addEventListener('click',()=>{const n=document.getElementById('navbarNav');if(n?.classList.contains('show'))bootstrap.Collapse.getOrCreateInstance(n).hide()}));
});


const CUSTOMER_REVIEWS = [
 "https://lh3.googleusercontent.com/d/1horq_9c3FyDohE7WmowEHSv5dbFYW4y9",
 "https://lh3.googleusercontent.com/d/14iyJdk9aZbVwsZO64Xy_Ax_4q5TPlhIq",
 "https://lh3.googleusercontent.com/d/1mLa7bIdkC5fXqBPLCijV09wBgMhA9KoX",
 "https://lh3.googleusercontent.com/d/134vpoZXKyvxKaBSN_rp0KmUPTr0PXE39",
 "https://lh3.googleusercontent.com/d/12F8_obd3odiTZo81zZVh44x06rvkuYXF",
 "https://lh3.googleusercontent.com/d/1JA2dwhqgOQ3hs4r7O3ZNua8b2wFNpvhN",
 "https://lh3.googleusercontent.com/d/1QVFqPhaedPPicVMzELgOB0AQ-sZBM0mq"
];

function reviewCard(url,i){
 return `<div class="review-slide"><div class="review-image-card glass-card p-2"><img src="${url}" alt="Customer Review ${i+1}" loading="lazy" decoding="async"></div></div>`;
}

function renderCustomerReviews(targetId,limit=6){
 const el=document.getElementById(targetId); if(!el)return;
 const reviews=CUSTOMER_REVIEWS.slice(0,limit);
 if(!reviews.length){el.innerHTML='';return;}
 el.classList.add('reviews-carousel');
 el.innerHTML=`<div class="reviews-track">${reviews.map(reviewCard).join('')}${reviews.map((url,i)=>reviewCard(url,i+reviews.length)).join('')}</div>`;
 initReviewCarousel(el);
}

function initReviewCarousel(container){
 if(container.dataset.carouselReady==='1')return;
 const track=container.querySelector('.reviews-track');
 if(!track)return;
 container.dataset.carouselReady='1';
 let paused=false, rafId=0, last=performance.now(), offset=0;
 const speed=0.035;

 function tick(now){
  const delta=Math.min(50,now-last); last=now;
  if(!paused){
   offset+=speed*delta;
   const half=track.scrollWidth/2;
   if(offset>=half)offset-=half;
   track.style.transform=`translate3d(-${offset}px,0,0)`;
  }
  rafId=requestAnimationFrame(tick);
 }
 function pause(){paused=true}
 function resume(){paused=false;last=performance.now()}

 container.addEventListener('pointerdown',pause,{passive:true});
 window.addEventListener('pointerup',resume,{passive:true});
 window.addEventListener('pointercancel',resume,{passive:true});
 container.addEventListener('touchcancel',resume,{passive:true});
 container.addEventListener('mouseleave',()=>{if(!paused)last=performance.now()});
 track.addEventListener('dragstart',e=>e.preventDefault());
 
 requestAnimationFrame(now=>{last=now;rafId=requestAnimationFrame(tick)});
}
