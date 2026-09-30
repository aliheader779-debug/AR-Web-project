
const PRODUCTS = [
 {slug:'capcut',deviceAccess:'2 devices access',logo:'https://drive.google.com/thumbnail?id=12rd2-F3smW44wjp3FUL0ggqP9esaF7FV&sz=w1000',name:'CapCut Pro',category:'Video & Editing',icon:'fa-video',price:'Rs. 180',description:'A powerful video editing tool for creating professional-looking videos quickly and easily.',plans:[
  {name:'7 Days',price:'Rs. 180',details:'2 devices access'},
  {name:'1 Month',price:'Rs. 399',details:'Choose device access'}
 ],features:['Advanced video editing','Premium effects and filters','Pro transitions','Creative templates','Cloud storage','Text, audio and visual editing'],detailedDescription:'CapCut Pro gives creators access to advanced video editing features for making social media videos, reels, YouTube content, promotional videos, and more. It is designed for beginners and regular content creators who want more editing options without a complicated workflow.',benefits:['Create polished videos faster','Make content for social media and YouTube','Use advanced editing tools and effects','Improve the overall look of your videos'],bestFor:'Content creators, students, social media users, and video editors',stock:'Available'},
 {slug:'gemini',accessLabel:'Access Method',accessDetails:'Choose your access option',logo:'https://drive.google.com/thumbnail?id=1j8URbAKCTgYC0r-qzhXqIK_ZnNSZuG0X&sz=w1000',name:'Gemini',category:'AI Tools',icon:'fa-robot',price:'Rs. 999',description:'Google AI Pro access centered on Gemini and a wider set of Google AI, creative, and productivity features.',plans:[{name:'18 Months',price:'Rs. 999',details:'Choose your access option'}],features:['Gemini app with advanced AI access','Gemini in Gmail, Docs, Vids, and more','Google AI Studio','Google Flow','Google Antigravity with higher limits','Google Colab','5 TB or 10 TB Google storage depending on membership plan','AI credits for supported products'],detailedDescription:'Google AI Pro brings expanded access to Google AI products and features, including the Gemini app, Gemini in Gmail and Docs, Google AI Studio, Flow, Antigravity, and Google Colab. Storage and AI usage limits depend on the specific membership plan.',benefits:['Expanded access to Gemini and Google AI features','Use Gemini across supported Google apps','Access creative and development tools such as Flow, AI Studio, Antigravity, and Colab','Receive the storage and AI credits provided by the selected Google AI Pro membership'],bestFor:'Students, researchers, creators, developers, and users who work across Google services',stock:'In Stock (5)'},
 {slug:'canva',accessLabel:'Access Method',accessDetails:'Team Invite',logo:'https://drive.google.com/thumbnail?id=1yH-jlpzpY-kZ5VYAniI6M8g5ZwvhBP6i&sz=w1000',name:'Canva Edu',category:'Design & Creative',icon:'fa-palette',price:'Rs. 149',description:'Canva Education combines Canva\'s visual design tools with education-focused features for teaching, learning, and classroom content.',plans:[{name:'1 Month',price:'Rs. 149',details:'Canva Education team invite'},{name:'3 Months',price:'Rs. 199',details:'Canva Education team invite'}],features:['Most Canva premium features included','Premium photos, graphics, and videos','Background Remover','Magic Write','Magic Resize','Education templates','LMS integrations','Assignments and classwork tools','AI-powered teaching tools'],detailedDescription:'Canva Education provides premium creative features together with tools designed for educators and students, including education templates, LMS integrations, shared work and assignments, and AI-powered teaching tools.',benefits:['Use premium creative features included with Canva Education','Create lessons and learning materials with education templates','Share work and manage assignments in education-focused workflows','Use Canva AI tools for supported teaching and classroom tasks'],bestFor:'K-12 educators, students, schools, and education-focused creators',stock:'Available'},
 {slug:'surfshark',accessLabel:'Access Method',accessDetails:'Full Account Access • Login verification code • 1 Device',logo:'https://nhatphuc.com/wp-content/uploads/2022/02/surfshark-logo-960x960.webp',name:'Surfshark VPN',category:'VPN & Security',icon:'fa-shield-halved',price:'Rs. 299',description:'Surfshark VPN full account access with login verification support for a single device.',plans:[
  {name:'1 Month',price:'Rs. 299',details:'Full account access • 1 device'},
  {name:'2 Months',price:'Rs. 499',details:'Full account access • 1 device • Discount price'}
 ],features:['Full account access','Login with provided credentials','Device login verification code','1 device access','1-month plan','2-month discounted plan'],detailedDescription:'Surfshark VPN access is provided through a full account login. After payment, customers receive the required login details and can complete device login using the required verification code. The available plans provide single-device access for 1 or 2 months.',benefits:['Full account access','Single-device access','Login verification support','Choose 1-month or 2-month access','Discounted 2-month option'],bestFor:'Users who want VPN access with full account login',stock:'In Stock (4)'},
 {slug:'netflix',accessLabel:'Access Method',accessDetails:'Screen Access • 1 Device / 1 Screen • 25-Day Warranty',logo:'https://drive.google.com/thumbnail?id=1R17XYrlzWDF91kORrA4Iw1clUfGgTsVV&sz=w1000',name:'Netflix',category:'Entertainment',icon:'fa-film',price:'Rs. 349',description:'Netflix screen access with single-device access and a 25-day warranty.',plans:[
  {name:'1 Month',price:'Rs. 349',details:'Screen access • 1 device / 1 screen • 25-day warranty'}
 ],features:['Screen access','1 device / 1 screen','25-day warranty','Movies and TV shows','Original content','Supported high-quality video'],detailedDescription:'Netflix access is provided as screen access for a single device or screen. The offer includes a 25-day warranty from AR SERVICES and is intended for customers who want straightforward access to Netflix entertainment.',benefits:['Netflix entertainment access','Single-device / single-screen access','25-day warranty','Simple activation and support'],bestFor:'Movie lovers, TV-series fans, and regular Netflix viewers',stock:'In Stock (2)'},
 {slug:'office365',accessLabel:'Access Method',accessDetails:'Organization account • Windows, macOS, Android & iOS • Limited features',logo:'https://drive.google.com/thumbnail?id=1seMGx02uJScl3dq7RzIhNSTNi9BTPvjh&sz=w1000',name:'MS Office 365 Plus',category:'Productivity',icon:'fa-file-word',price:'Rs. 999',description:'12-month Microsoft Office 365 organization account with essential Office apps across major devices.',plans:[
  {name:'12 Months',price:'Rs. 999',details:'Annual access'}
 ],features:['12-month organization account','Word','Excel','PowerPoint','OneNote','Forms','Windows, macOS, Android & iOS','Limited organization-account features','20-day full warranty','OneDrive storage is complementary','Copilot Premium is not included'],detailedDescription:'This is an organization account that provides access to Microsoft Word, Excel, PowerPoint, OneNote, and Forms. The vendor states that the account has limited features and can be used on Windows, macOS, Android, and iOS. Login credentials are provided after payment.',benefits:['Essential Office apps for study and work','Create documents, spreadsheets, and presentations','Use the account across supported device platforms','Login credentials provided after payment'],bestFor:'Students, teachers, professionals, office users, and everyday productivity work',stock:'In Stock (20)'},
 {slug:'adobe-express',logo:'https://drive.google.com/thumbnail?id=1ucXCM65kcLvTXh6taiVdgPjXSPoiNZBG&sz=w1000',name:'Adobe Express Premium',category:'Design & Creative',icon:'fa-wand-magic-sparkles',price:'Rs. 799',description:'A simple creative platform for making graphics, social media content, videos, and visual designs.',plans:[
  {name:'12 Months',price:'Rs. 799',details:'Annual access'}
 ],features:['Premium creative tools','Ready-made templates','Graphic design','Social media content creation','Video creation','Image editing'],detailedDescription:'Adobe Express helps users create attractive visual content without requiring advanced design skills. It can be used for social media posts, promotional graphics, videos, presentations, and other creative projects.',benefits:['Create visual content quickly','Design without advanced skills','Make social media graphics and videos','Speed up everyday creative projects'],bestFor:'Creators, marketers, students, small businesses, and social media users',stock:'In Stock (7)'},
 {slug:'ilovepdf',accessLabel:'Access Method',accessDetails:'Premium access',logo:'https://congressus-bilboard.s3-eu-west-1.amazonaws.com/files/61a9b343a72b44a4a51937f27e713efb.png',name:'iLovePDF Premium',category:'Productivity',icon:'fa-file-pdf',price:'Rs. 499',description:'iLovePDF Premium unlocks the full PDF toolkit for converting, editing, signing, organizing, and processing documents.',plans:[{name:'12 Months',price:'Rs. 499',details:'Premium access'}],features:['Full access to all iLovePDF tools','Unlimited document processing','Web, Mobile, and Desktop access','Digital Signatures','Workflows','Ad-free experience','Priority customer support','Regional file processing','2,000 AI credits'],detailedDescription:'iLovePDF Premium is designed for advanced document work across web, mobile, and desktop. Premium includes the full PDF toolkit, unlimited document processing, digital signatures, workflows, an ad-free experience, priority support, regional file processing, and AI credits.',benefits:['Use the full set of Premium PDF tools','Process documents with unlimited Premium access','Work across Web, Mobile, and Desktop','Use digital signatures and workflows','Work without ads and receive priority support','Use the AI credits included with Premium'],bestFor:'Students, office teams, businesses, and frequent PDF users',stock:'In Stock (10)'},
 {slug:'quillbot',accessLabel:'Access Method',accessDetails:'Coupon code • Redeem on your own account • New account required',logo:'https://drive.google.com/thumbnail?id=1IB4rTPpONfJujOtUZDA7mUekgs4Pt1L6&sz=w1000',name:'QuillBot',category:'Education',icon:'fa-pen-nib',price:'Rs. 699',description:'A QuillBot Premium coupon code for upgrading an eligible new account.',plans:[
  {name:'1 Month',price:'Rs. 699',details:'Monthly access'}
 ],features:['Premium coupon code','Own account redemption','New account required','Account must not have had Premium before','12-hour coupon-code hold time','20-day subscription warranty'],detailedDescription:'QuillBot Premium helps improve, rewrite, summarize, and refine written content. This offer is provided as a coupon code that the customer redeems on their own QuillBot account. The vendor states that the account must be new and must not have had Premium before.',benefits:['Improve writing clarity','Rewrite and refine text','Summarize content','Use Premium features on your own eligible account'],bestFor:'Students, writers, bloggers, professionals, and content creators',stock:'In Stock (1)'},
 {slug:'duolingo',accessLabel:'Access Method',accessDetails:'Own account activation • Redeem link • No card required',logo:'https://drive.google.com/thumbnail?id=1prhyndVHF3tkB2Qdffyuc8Sg5GtkmSbS&sz=w1000',name:'Super Duolingo',category:'Education',icon:'fa-language',price:'Rs. 949',description:'12-month Super Duolingo access activated on your own account through a redeem link.',plans:[
  {name:'12 Months',price:'Rs. 949',details:'Annual access'}
 ],features:['12-month Super Duolingo','Own account activation','Redeem-link delivery','No card required','2-hour hold time','No warranty after activation'],detailedDescription:'Super Duolingo provides a premium language-learning experience with interactive lessons, vocabulary practice, grammar exercises, listening and reading activities, and progress tracking. This offer is redeemed on the customer\'s own account and does not require a card.',benefits:['Interactive language-learning experience','Practice vocabulary and grammar','Build a regular learning routine','Activate on your own account'],bestFor:'Students, travelers, beginners, and language learners',stock:'In Stock (4)'},
 {slug:'youtube-premium',accessLabel:'Access Method',accessDetails:'Own account activation • Trial-eligible account required • Supported devices',logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/YouTube_Premium_logo_2024.svg/3840px-YouTube_Premium_logo_2024.svg.png',name:'YouTube Premium',category:'Entertainment',icon:'fa-youtube',price:'Rs. 1199',description:'A premium YouTube plan activated on your own eligible account for an enhanced viewing and listening experience.',plans:[
  {name:'3 Months',price:'Rs. 1199',details:'Three-month access'}
 ],features:['3-month Premium plan','Own account activation','Trial eligibility required','Payment method required for activation','4-hour link hold time','1-month warranty','Supported-device access'],detailedDescription:'YouTube Premium provides a more convenient YouTube experience for viewing entertainment, educational videos, music, tutorials, and creator content. This offer requires an account that is eligible for the available free-trial offer and is activated on the buyer\'s own account.',benefits:['Enhanced YouTube viewing experience','Ad-free viewing where Premium applies','Use your own eligible account','Suitable for learning, entertainment, music, and creator content'],bestFor:'YouTube viewers, students, learners, music listeners, and regular content viewers',stock:'In Stock (2)'}
];

const PRODUCT_SECTIONS={};

const LOGO_FIT={
 capcut:{size:'84px'},gemini:{size:'39px'},canva:{size:'48px'},surfshark:{size:'48px'},
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
 const featuredPlan=p.plans[0]||{name:'',price:p.price,details:''};
 root.innerHTML=`
 <section class="product-page">
  <div class="container">
   <div class="product-breadcrumb mb-4"><a href="index.html">Home</a><span>/</span><a href="tools.html">Tools</a><span>/</span><span>${escapeHtml(p.name)}</span></div>
   <div class="row g-4 g-lg-5 align-items-start">
    <div class="col-lg-5"><div class="glass-card product-main-visual text-center">
      <div class="product-icon-wrap"><div class="product-icon product-detail-icon" style="${logoStyle(p)}"><img src="${p.logo}" alt="${p.name} logo" loading="lazy"><i class="fa-solid ${p.icon}" aria-hidden="true"></i></div></div>
      <div class="small-label mt-3">${p.category}</div><h1 class="h2 fw-bold mt-2">${escapeHtml(p.name)}</h1><p class="text-silver mb-0">${escapeHtml(p.description)}</p>
    </div></div>
    <div class="col-lg-7"><div class="product-purchase-card">
      <div class="small-label">Choose Your Plan</div><h2 class="h3 fw-bold mt-2 mb-3">${escapeHtml(p.name)}</h2>
      <div class="product-plan-selector">${p.plans.map((pl,i)=>`<button type="button" class="product-plan-option ${i===0?'active':''}" data-plan-index="${i}"><strong>${escapeHtml(pl.name)}</strong><span>${escapeHtml(pl.price)}</span></button>`).join('')}</div>
      <div class="product-selected-detail mt-3"><span>${escapeHtml(featuredPlan.details||'Plan selected')}</span></div>
      ${p.slug==='capcut'?`
      <div id="capcutDeviceOptions" class="product-device-options" style="display:none">
       <span class="device-access-label">Device Access</span>
       <div class="device-option-row">
        <button type="button" class="device-option active" data-devices="1" data-price="Rs. 399"><strong>1 Device</strong><span>Rs. 399</span></button>
        <button type="button" class="device-option" data-devices="2" data-price="Rs. 699"><strong>2 Devices</strong><span>Rs. 699</span></button>
       </div>
      </div>
      <div id="capcutFixedDevice" class="product-device-access"><span class="device-access-label">Device Access</span><strong>2 Devices</strong></div>`: `
      <div class="product-device-access"><span class="device-access-label">${escapeHtml(p.accessLabel||'Access Method')}</span><strong>${escapeHtml(p.accessDetails||'See plan details')}</strong></div>`}
      <div class="product-total-box mt-4"><span>Total Amount</span><strong id="productTotalPrice">${escapeHtml(featuredPlan.price)}</strong></div>
      <button id="productOrderBtn" type="button" class="btn btn-gradient w-100 py-3 mt-3">Order Now via WhatsApp <i class="fa-brands fa-whatsapp ms-2"></i></button>
      <p class="product-order-note text-silver mb-0 mt-3"><i class="fa-solid fa-headset me-2"></i>Need help? Contact us on WhatsApp before ordering.</p>
    </div><div class="product-trust-strip mt-3"><span>✓ Clear Pricing</span><span>✓ WhatsApp Support</span><span>✓ Simple Ordering</span></div></div>
   </div>
  </div>
 </section>
 <section><div class="container"><div class="row g-4">
  <div class="col-lg-7"><div class="glass-card product-content-card"><h2 class="h3 fw-bold mb-3">About ${escapeHtml(p.name)}</h2><p class="text-silver">${escapeHtml(p.detailedDescription||p.description)}</p><h3 class="h5 fw-bold mt-4 mb-3">Benefits</h3><ul class="product-included-list">${p.benefits.map(f=>`<li><i class="fa-solid fa-check"></i><span>${escapeHtml(f)}</span></li>`).join("")}</ul><h3 class="h5 fw-bold mt-4 mb-3">Key Features</h3><ul class="product-included-list">${p.features.map(f=>`<li><i class="fa-solid fa-check"></i><span>${escapeHtml(f)}</span></li>`).join("")}</ul><p class="text-silver mt-4 mb-0"><strong>Best For:</strong> ${escapeHtml(p.bestFor||"")}</p><h3 class="h5 fw-bold mt-4 mb-3">What&#39;s Included</h3><ul id="productIncluded" class="product-included-list"></ul></div></div>
  <div class="col-lg-5"><div class="glass-card product-content-card"><h2 class="h3 fw-bold mb-3">How It Works</h2><div id="productSteps" class="product-steps"></div></div></div>
 </div></div></section>
 <section class="section-alt"><div class="container"><div class="glass-card product-content-card mx-auto" style="max-width:900px"><h2 class="h3 fw-bold mb-3">Customer Reviews</h2><p class="text-silver mb-4">Real customer feedback shared with AR SERVICES.</p><div id="productReviews" class="product-review-placeholder"></div><a class="btn btn-outline-glass mt-3" href="reviews.html">View All Reviews</a></div></div></section>
 <section><div class="container"><h2 class="section-title">Product <span class="text-gradient">FAQ</span></h2><div id="productFaq" class="accordion mx-auto" style="max-width:850px"></div></div></section>
 <section class="section-alt"><div class="container"><h2 class="section-title">More <span class="text-gradient">Premium Tools</span></h2><div id="relatedProducts" class="row g-4 justify-content-center"></div></div></section>`;
 document.title=`${p.name} | AR SERVICES`;
 const sectionData=PRODUCT_SECTIONS[p.slug]||{};
 const planButtons=[...root.querySelectorAll('.product-plan-option')], total=root.querySelector('#productTotalPrice'), selected=root.querySelector('.product-selected-detail span'), order=root.querySelector('#productOrderBtn');
 const includedEl=root.querySelector('#productIncluded'),stepsEl=root.querySelector('#productSteps'),faqEl=root.querySelector('#productFaq');
 function renderUniqueSections(pl){
  const included=(sectionData.included||[]).slice();
  if(pl&&pl.name)included.unshift('Selected plan: '+pl.name);
  if(pl&&pl.details)included.push('Plan detail: '+pl.details);
  if(includedEl)includedEl.innerHTML=included.map(x=>'<li><i class="fa-solid fa-check"></i><span>'+escapeHtml(x)+'</span></li>').join('');
  const steps=sectionData.steps||['Choose your plan','Click Order Now','Continue via WhatsApp','Receive your access'];
  if(stepsEl)stepsEl.innerHTML=steps.map((x,i)=>'<div class="product-step"><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+escapeHtml(x)+'</strong></div>').join('');
  const faq=sectionData.faq||[];
  if(faqEl)faqEl.innerHTML=faq.map((x,i)=>'<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button '+(i?'collapsed':'')+'" data-bs-toggle="collapse" data-bs-target="#pf'+i+'_'+p.slug+'">'+escapeHtml(x[0])+'</button></h2><div id="pf'+i+'_'+p.slug+'" class="accordion-collapse collapse '+(i?'':'show')+'"><div class="accordion-body">'+escapeHtml(x[1])+'</div></div></div>').join('');
 }
 const capcutDevices=root.querySelector('#capcutDeviceOptions'), capcutFixed=root.querySelector('#capcutFixedDevice');
 let selectedDevices=2, selectedCapcutPrice='Rs. 180';
 function selectPlan(i){
  const pl=p.plans[i]||p.plans[0];
  planButtons.forEach((btn,j)=>btn.classList.toggle('active',j===i));
  if(selected)selected.textContent=pl.details||'Plan selected';
  renderUniqueSections(pl);
  if(p.slug==='capcut'){
   const isMonth=i===1;
   if(capcutDevices)capcutDevices.style.display=isMonth?'block':'none';
   if(capcutFixed)capcutFixed.style.display=isMonth?'none':'flex';
   selectedDevices=isMonth?1:2;
   selectedCapcutPrice=isMonth?'Rs. 399':'Rs. 180';
   if(total)total.textContent=selectedCapcutPrice;
   if(order)order.onclick=()=>openOrder(p.name,`${pl.name} - ${selectedDevices} Device${selectedDevices>1?'s':''} - ${selectedCapcutPrice}`);
  }else{
   if(total)total.textContent=pl.price;
   if(order)order.onclick=()=>openOrder(p.name,`${pl.name} - ${pl.price}`);
  }
 }
 if(capcutDevices){
  capcutDevices.querySelectorAll('.device-option').forEach(btn=>{
   btn.addEventListener('click',()=>{
    capcutDevices.querySelectorAll('.device-option').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    selectedDevices=Number(btn.dataset.devices)||1;
    selectedCapcutPrice=btn.dataset.price||'Rs. 399';
    if(total)total.textContent=selectedCapcutPrice;
    const pl=p.plans[1];
    if(selected)selected.textContent=`${pl.name} • ${selectedDevices} Device${selectedDevices>1?'s':''}`;
    if(order)order.onclick=()=>openOrder(p.name,`${pl.name} - ${selectedDevices} Device${selectedDevices>1?'s':''} - ${selectedCapcutPrice}`);
   });
  });
 }
 planButtons.forEach((btn,i)=>btn.addEventListener('click',()=>selectPlan(i)));selectPlan(0);
 const rr=document.getElementById('relatedProducts');if(rr)rr.innerHTML=PRODUCTS.filter(x=>x.slug!==p.slug).slice(0,3).map(x=>`<div class="col-md-4"><div class="glass-card product-related-card"><div class="product-icon-wrap"><div class="product-icon" style="${logoStyle(x)}"><img src="${x.logo}" alt="${x.name} logo" loading="lazy"></div></div><h3 class="h6 fw-bold">${escapeHtml(x.name)}</h3><p class="text-silver small">${escapeHtml(x.description)}</p><a class="btn btn-outline-glass w-100" href="product-${x.slug}.html">View Product</a></div></div>`).join('');
 const pr=document.getElementById('productReviews');if(pr&&typeof renderCustomerReviews==='function')renderCustomerReviews('productReviews',3);
}
document.addEventListener('DOMContentLoaded',()=>{
 const run=(label,fn)=>{
  try{fn()}catch(error){console.error('[AR SERVICES] '+label+' failed:',error)}
 };
 run('AOS initialization',()=>{if(window.AOS)AOS.init({duration:600,once:true,offset:50,easing:'ease-in-out'})});
 run('Product page',renderProductPage);
 run('Home products',()=>{if(document.getElementById('homeProducts'))renderProductGrid('homeProducts',6)});
 run('Store products',()=>{if(document.getElementById('storeGrid')){renderProductGrid('storeGrid');initStoreFilters()}});
 run('Home reviews',()=>{if(document.getElementById('homeReviews'))renderCustomerReviews('homeReviews',6)});
 run('Reviews page',()=>{if(document.getElementById('reviewsGrid'))renderCustomerReviews('reviewsGrid',CUSTOMER_REVIEWS.length)});
 run('Navigation',()=>document.querySelectorAll('.nav-link').forEach(link=>link.addEventListener('click',()=>{const n=document.getElementById('navbarNav');if(n?.classList.contains('show')&&window.bootstrap)bootstrap.Collapse.getOrCreateInstance(n).hide()})));
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
