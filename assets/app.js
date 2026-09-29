
const PRODUCTS = [
 {slug:'capcut',logo:'https://drive.google.com/thumbnail?id=12rd2-F3smW44wjp3FUL0ggqP9esaF7FV&sz=w1000',name:'CapCut Pro',category:'Video & Editing',icon:'fa-video',price:'Rs. 199',description:'Premium video editing access for creators.',plans:[
  {name:'7 Days',price:'Rs. 199',details:'2 Devices • Full Access',duration:'7d',devices:2},
  {name:'1 Month',price:'Rs. 399',details:'Single Device Access',duration:'1m',devices:1},
  {name:'1 Month',price:'Rs. 699',details:'2 Devices Access',duration:'1m',devices:2},
  {name:'2 Months',price:'Price on request',details:'Single Device Access',duration:'2m',devices:1},
  {name:'2 Months',price:'Price on request',details:'2 Devices Access',duration:'2m',devices:2}
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
 document.title=p.name+' | AR SERVICES';
 const meta=document.querySelector('meta[name="description"]');
 if(meta)meta.setAttribute('content','Explore '+p.name+' plans, features, pricing and ordering information from AR SERVICES. '+p.description);

 const isCapCut=p.slug==='capcut';
 const initial=p.plans[0]||{name:'Standard',price:p.price,details:'Premium access',devices:1};

 const existingSchema=document.getElementById('productSchema');
 if(existingSchema)existingSchema.remove();
 const schema=document.createElement('script');
 schema.id='productSchema'; schema.type='application/ld+json';
 schema.textContent=JSON.stringify({
  "@context":"https://schema.org","@type":"Product","name":p.name,"description":p.description,
  "image":p.logo,"category":p.category,
  "offers":{"@type":"Offer","priceCurrency":"PKR","price":parseFloat(String(initial.price).replace(/[^0-9.]/g,''))||0,
   "availability":/in stock|available/i.test(p.stock)?"https://schema.org/InStock":"https://schema.org/LimitedAvailability",
   "url":"https://arservicesdigital.store/product-"+p.slug+".html"}
 });
 document.head.appendChild(schema);

 const included=p.features.map(f=>'<li><span class="product-check"><i class="fa-solid fa-check"></i></span><span>'+escapeHtml(f)+'</span></li>').join('');
 const related=PRODUCTS.filter(x=>x.slug!==p.slug && x.category===p.category).slice(0,4);
 const fallbackRelated=PRODUCTS.filter(x=>x.slug!==p.slug).slice(0,4);
 const relatedProducts=(related.length?related:fallbackRelated).map(x=>'<a class="product-related-card" href="product-'+x.slug+'.html"><div class="product-related-image"><img src="'+x.logo+'" alt="'+escapeHtml(x.name)+' logo" loading="lazy"></div><div class="small-label">'+escapeHtml(x.category)+'</div><strong>'+escapeHtml(x.name)+'</strong><span>'+escapeHtml(x.price)+'</span></a>').join('');

 let inlinePicker='';
 if(isCapCut){
  inlinePicker='<div class="capcut-plan-picker" id="capcutPlanPicker"><div class="small-label mb-2">Choose Duration</div><div class="capcut-duration-grid">'+
   ['7 Days','1 Month','2 Months'].map(function(d,i){return '<button type="button" class="capcut-duration-btn '+(i===0?'active':'')+'" data-duration="'+d+'">'+d+'</button>';}).join('')+
   '</div><div class="small-label mt-4 mb-2">Device Access</div><div class="capcut-device-grid" id="capcutDeviceOptions"></div>'+
   '<div class="capcut-plan-summary"><div><span class="small-label">Selected Plan</span><strong id="capcutSelectedPlan">'+escapeHtml(initial.name)+' • '+escapeHtml(initial.details)+'</strong></div><div class="capcut-selected-price" id="capcutSelectedPrice">'+escapeHtml(initial.price)+'</div></div></div>';
 }else{
  const cards=p.plans.map(function(pl,i){return '<div class="col-12 col-md-6 col-lg-5"><div class="product-plan-card '+(i===0&&p.plans.length>1?'featured':'')+'">'+(i===0&&p.plans.length>1?'<span class="product-plan-badge">Recommended</span>':'')+'<div class="small-label">'+escapeHtml(pl.name)+'</div><div class="product-plan-price">'+escapeHtml(pl.price)+'</div><p class="text-silver mb-3">'+escapeHtml(pl.details)+'</p><button class="btn btn-gradient w-100" onclick="openOrder(\''+escapeHtml(p.name)+'\',\''+escapeHtml(pl.name)+' - '+escapeHtml(pl.price)+'\')">Select Plan <i class="fa-solid fa-arrow-right ms-1"></i></button></div></div>';}).join('');
  inlinePicker='<section class="product-content-card"><h2>Choose Your Plan</h2><div class="row g-4 justify-content-center">'+cards+'</div></section>';
 }

 const initOrder=escapeHtml(initial.name)+' - '+escapeHtml(initial.details)+' - '+escapeHtml(initial.price);

 root.innerHTML='<section class="product-page-shell"><div class="container product-container">'+
 '<nav aria-label="Breadcrumb" class="product-breadcrumb"><a href="index.html">Home</a><span>/</span><a href="tools.html">Tools</a><span>/</span><span>'+escapeHtml(p.name)+'</span></nav>'+
 '<div class="product-trust-strip"><div><i class="fa-solid fa-bolt"></i><strong>Instant Delivery</strong><small>Fast processing</small></div><div><i class="fa-solid fa-shield-halved"></i><strong>Trusted Support</strong><small>Help when needed</small></div><div><i class="fa-brands fa-whatsapp"></i><strong>WhatsApp Support</strong><small>Easy ordering</small></div></div>'+
 '<div class="product-main-grid"><div class="product-media-card"><div class="product-media-glow"></div><div class="product-media-inner"><img src="'+p.logo+'" alt="'+escapeHtml(p.name)+' logo" loading="eager"></div>'+(isCapCut?inlinePicker:'')+'</div>'+
 '<div class="product-info"><div class="small-label product-category">'+escapeHtml(p.category)+'</div><h1>'+escapeHtml(p.name)+'</h1>'+
 '<div class="product-rating-row"><span class="stars">★★★★★</span><strong>4.8 / 5</strong><span class="verified-chip"><i class="fa-solid fa-check"></i> Verified</span><span class="delivery-chip"><i class="fa-solid fa-bolt"></i> Instant Delivery</span></div>'+
 '<p class="product-short-description">'+escapeHtml(p.description)+'</p>'+
 '<div class="product-price-card"><div><span class="small-label">TOTAL AMOUNT</span><div class="product-price" id="productTotalPrice">'+escapeHtml(initial.price)+'</div></div><div class="product-stock"><span class="stock-dot"></span>'+escapeHtml(p.stock)+'</div>'+
 '<button class="btn btn-gradient product-primary-cta" id="productPrimaryCta" onclick="openOrder(\''+escapeHtml(p.name)+'\',\''+initOrder+'\')">Proceed to Payment <i class="fa-solid fa-arrow-right"></i></button>'+
 '<div class="product-security-note"><i class="fa-solid fa-shield-halved"></i> Secure checkout · Simple activation process</div>'+
 '<button class="product-whatsapp-cta" onclick="openOrder(\''+escapeHtml(p.name)+'\')"><i class="fa-brands fa-whatsapp"></i> Questions before buying? Ask us on WhatsApp</button></div></div></div>'+
 '<div class="product-content-stack"><section class="product-content-card"><h2>Product Description</h2><p>'+escapeHtml(p.description)+'</p><p>'+escapeHtml(p.name)+' is available through AR SERVICES with a simple ordering flow and support for product-related questions. Review the plan options and choose the one that matches your requirements.</p></section>'+
 '<section class="product-content-card"><h2>What\'s Included</h2><ul class="product-included-list">'+included+'</ul></section>'+
 (isCapCut?'':' '+inlinePicker)+
 '<section class="product-content-card"><h2>How It Works</h2><div class="product-steps"><div><span>1</span><div><strong>Choose your plan</strong><p>Select the option that fits your needs.</p></div></div><div><span>2</span><div><strong>Place your order</strong><p>Continue with your product and contact details.</p></div></div><div><span>3</span><div><strong>Payment verification</strong><p>Complete the payment process and verification.</p></div></div><div><span>4</span><div><strong>Receive access</strong><p>Get the agreed subscription/access details through the delivery process.</p></div></div></div></section>'+
 '<section class="product-content-card product-why-card"><h2>Why Choose <span class="text-gradient">AR SERVICES?</span></h2><div class="product-assurance-grid"><div><i class="fa-solid fa-bolt"></i><strong>Simple Ordering</strong><p>Clear product pages and a straightforward ordering flow.</p></div><div><i class="fa-solid fa-shield-halved"></i><strong>Clear Information</strong><p>Plans, pricing and included details are shown before ordering.</p></div><div><i class="fa-solid fa-headset"></i><strong>Support</strong><p>WhatsApp support for product and order questions.</p></div></div></section>'+
 '<section class="product-content-card"><div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4"><div><h2 class="mb-1">More Premium Tools</h2><p class="text-silver mb-0">Explore more products from AR SERVICES.</p></div><a class="btn btn-outline-glass" href="tools.html">View All Tools</a></div><div class="product-related-grid">'+relatedProducts+'</div></section></div></div></section>'+
 '<div class="product-mobile-buybar"><div><small>'+escapeHtml(p.name)+'</small><strong id="mobileProductPrice">'+escapeHtml(initial.price)+'</strong></div><button class="btn btn-gradient" id="mobileBuyCta" onclick="openOrder(\''+escapeHtml(p.name)+'\',\''+initOrder+'\')">Buy Now <i class="fa-solid fa-arrow-right ms-1"></i></button></div>';

 if(isCapCut){
  const picker=document.getElementById('capcutPlanPicker');
  const durationBtns=[...picker.querySelectorAll('.capcut-duration-btn')];
  const deviceEl=document.getElementById('capcutDeviceOptions');
  const totalPrice=document.getElementById('productTotalPrice');
  const mobilePrice=document.getElementById('mobileProductPrice');
  const summaryPlan=document.getElementById('capcutSelectedPlan');
  const summaryPrice=document.getElementById('capcutSelectedPrice');
  const primary=document.getElementById('productPrimaryCta');
  const mobileCta=document.getElementById('mobileBuyCta');
  let activeDuration='7 Days', activePlan=p.plans[0];

  function getPlans(duration){return p.plans.filter(function(pl){return pl.name===duration;});}
  function renderDevices(){
   const plans=getPlans(activeDuration);
   deviceEl.innerHTML=plans.map(function(pl){
    const idx=p.plans.indexOf(pl);
    return '<button type="button" class="capcut-device-btn '+(activePlan===pl?'active':'')+'" data-plan-index="'+idx+'"><span class="capcut-device-check"><i class="fa-solid fa-check"></i></span><span><strong>'+escapeHtml(pl.details)+'</strong><small>'+escapeHtml(pl.price)+'</small></span></button>';
   }).join('');
   deviceEl.querySelectorAll('.capcut-device-btn').forEach(function(btn){btn.addEventListener('click',function(){activePlan=p.plans[Number(btn.dataset.planIndex)];renderDevices();syncSelection();});});
  }
  function syncSelection(){
   durationBtns.forEach(function(b){b.classList.toggle('active',b.dataset.duration===activeDuration);});
   const knownPrice=/^Rs\.\\s*\\d/i.test(activePlan.price);
   totalPrice.textContent=activePlan.price; mobilePrice.textContent=activePlan.price;
   summaryPlan.textContent=activePlan.name+' • '+activePlan.details; summaryPrice.textContent=activePlan.price;
   const orderPlan=activePlan.name+' - '+activePlan.details+' - '+activePlan.price;
   primary.setAttribute('onclick','openOrder(\''+escapeHtml(p.name)+'\',\''+escapeHtml(orderPlan)+'\')');
   mobileCta.setAttribute('onclick','openOrder(\''+escapeHtml(p.name)+'\',\''+escapeHtml(orderPlan)+'\')');
   primary.disabled=!knownPrice; mobileCta.disabled=!knownPrice;
   primary.innerHTML=knownPrice?'Proceed to Payment <i class="fa-solid fa-arrow-right"></i>':'Price on Request';
   primary.title=knownPrice?'':'Contact us on WhatsApp for the 2 Months price.';
  }
  durationBtns.forEach(function(btn){btn.addEventListener('click',function(){activeDuration=btn.dataset.duration;activePlan=getPlans(activeDuration)[0];renderDevices();syncSelection();});});
  renderDevices(); syncSelection();
 }
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

 let paused=false, dragging=false, last=performance.now(), offset=0;
 let startX=0, lastX=0, startY=0, moved=false, horizontal=false;
 const speed=0.035;

 function normalize(){
  const half=track.scrollWidth/2;
  if(!half)return;
  while(offset>=half)offset-=half;
  while(offset<0)offset+=half;
 }
 function render(){track.style.transform=`translate3d(-${offset}px,0,0)`}
 function tick(now){
  const delta=Math.min(50,now-last); last=now;
  if(!paused && !dragging){offset+=speed*delta;normalize();render()}
  requestAnimationFrame(tick);
 }
 function pause(){paused=true}
 function resume(){paused=false;last=performance.now()}

 function begin(x,y){
  dragging=true; paused=true; moved=false; horizontal=false;
  startX=lastX=x; startY=y; last=performance.now();
  container.classList.add('is-dragging');
 }
 function move(x,y,e){
  if(!dragging)return;
  const dx=x-lastX, totalX=x-startX, totalY=y-startY;
  if(!horizontal && Math.abs(totalX)+Math.abs(totalY)>7){
    horizontal=Math.abs(totalX)>Math.abs(totalY);
  }
  if(horizontal){
    if(e && e.cancelable)e.preventDefault();
    moved=true;
    offset-=dx;
    normalize();
    render();
  }
  lastX=x;
 }
 function end(){
  if(!dragging)return;
  dragging=false;
  container.classList.remove('is-dragging');
  resume();
 }

 container.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse' && e.button!==0)return;
  begin(e.clientX,e.clientY);
  if(container.setPointerCapture)try{container.setPointerCapture(e.pointerId)}catch(_){}
 });
 container.addEventListener('pointermove',e=>move(e.clientX,e.clientY,e),{passive:false});
 container.addEventListener('pointerup',end);
 container.addEventListener('pointercancel',end);
 container.addEventListener('lostpointercapture',()=>{if(dragging)end()});

 container.addEventListener('touchstart',e=>{
  const t=e.touches[0]; if(t)begin(t.clientX,t.clientY);
 },{passive:true});
 container.addEventListener('touchmove',e=>{
  const t=e.touches[0]; if(t)move(t.clientX,t.clientY,e);
 },{passive:false});
 container.addEventListener('touchend',end,{passive:true});
 container.addEventListener('touchcancel',end,{passive:true});

 container.addEventListener('pointerenter',()=>{if(!dragging)pause()});
 container.addEventListener('pointerleave',()=>{if(!dragging)resume()});
 container.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();offset+=e.deltaY*.7}
  else offset+=e.deltaX;
  normalize();render();pause();
  clearTimeout(container._wheelTimer);
  container._wheelTimer=setTimeout(resume,500);
 },{passive:false});

 track.addEventListener('dragstart',e=>e.preventDefault());
 requestAnimationFrame(now=>{last=now;tick(now)});
}
