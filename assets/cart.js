/* ==========================================================================
   AR SERVICES — Cart + Checkout funnel (Phase A, 2026-10-19)
   Vanilla JS, zero dependencies. Loaded AFTER assets/app.js on:
   index.html, tools.html and all product-*.html pages.

   Pixel events fired here: ViewContent (product pages), AddToCart,
   InitiateCheckout (checkout modal open).
   NOTE on Lead: the site's existing helper (in every page <head>) wraps
   window.open and fires fbq('track','Lead') automatically for any wa.me
   URL. The checkout below opens WhatsApp via window.open, so Lead fires
   exactly ONCE through that wrapper. We deliberately do NOT fire Lead
   again here — that would double-count the conversion.
   NO 'Purchase' event is fired anywhere (no online payment on this site).
   ========================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = '923179172511';
  var STORAGE_KEY = 'ar_cart_v1';

  /* ---------------- helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function parsePrice(text) {
    var n = parseInt(String(text == null ? '' : text).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }
  function fmt(n) { return 'Rs ' + Number(n || 0).toLocaleString('en-US'); }
  function slugify(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
  function fbqTrack(event, params) {
    if (window.fbq) { try { window.fbq('track', event, params || {}); } catch (e) { /* pixel blocked — ignore */ } }
  }
  /* Flat 2D cart icon — same path/design as the FAB icon. The stroke uses
     currentColor: it renders white on the gradient add-to-cart buttons and
     dark in the (light) drawer header, matching each surface. */
  function cartIcon(size) {
    var s = size || 18;
    return '<svg class="ar-ico-cart" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.5 3h2.1l2.5 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 7H6"/></svg>';
  }
  /* PRODUCTS is a top-level const in assets/app.js (loaded before this file). */
  function getProducts() {
    try { return (typeof PRODUCTS !== 'undefined' && PRODUCTS) ? PRODUCTS : []; } catch (e) { return []; }
  }
  function productBySlug(slug) {
    var list = getProducts();
    for (var i = 0; i < list.length; i++) { if (list[i].slug === slug) return list[i]; }
    return null;
  }
  /* Default purchasable plan = first plan that is not out of stock. */
  function defaultPlan(p) {
    if (!p || !p.plans || !p.plans.length) return null;
    for (var i = 0; i < p.plans.length; i++) { if (!p.plans[i].outOfStock) return p.plans[i]; }
    return null;
  }

  /* ---------------- coupon (SAVE10, 2026-10-23) ----------------
     One public code: SAVE10 = 10% off. Rules:
       - CapCut Pro 1 Month — 1 Device (id 'capcut-1-month-1device', Rs 399)
         is NEVER discountable (margin protection).
       - Bundle-priced items never get a second discount. (Bundle orders on
         this site go through the homepage bundle WhatsApp link and never
         enter the cart; the 'bundle' id check below is a safety net.)
     The pure logic sits between the COUPON-LOGIC markers so it can be
     unit-tested in Node without a DOM. */
  /* COUPON-LOGIC-START */
  var COUPONS = { 'SAVE10': 10 };
  function isCouponExcluded(x) {
    if (!x || !x.id) return true;
    if (x.id === 'capcut-1-month-1device') return true;
    if (String(x.id).indexOf('bundle') !== -1) return true;
    return false;
  }
  function couponCalc(list, code) {
    var r = { applied: false, code: '', percent: 0, base: 0, discount: 0, reason: '' };
    if (!code || !String(code).trim()) { r.reason = 'empty'; return r; }
    var c = String(code).trim().toUpperCase();
    if (!COUPONS[c]) { r.reason = 'invalid'; return r; }
    r.code = c; r.percent = COUPONS[c];
    var base = 0;
    (list || []).forEach(function (x) { if (!isCouponExcluded(x)) base += Number(x.price) || 0; });
    r.base = base;
    if (base <= 0) { r.reason = 'not_applicable'; return r; }
    r.discount = Math.round(base * r.percent / 100);
    r.applied = r.discount > 0;
    if (!r.applied) r.reason = 'zero';
    return r;
  }
  /* COUPON-LOGIC-END */
  var appliedCoupon = '';
  function finalTotal() {
    var calc = couponCalc(items, appliedCoupon);
    return cartTotal() - (calc.applied ? calc.discount : 0);
  }

  /* ---------------- cart state ---------------- */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      /* Cleanup: drop items for plans that no longer exist (the removed
         CapCut 7 Days plan could never be added via the UI, but a stale
         saved cart must not resurrect it). */
      return arr.filter(function (x) {
        return x && x.id && x.name && typeof x.price === 'number' && x.id !== 'capcut-7-days';
      });
    } catch (e) { return []; }
  }
  var items = load();
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { /* private mode */ } }
  function cartTotal() { return items.reduce(function (s, x) { return s + (Number(x.price) || 0); }, 0); }

  /* ---------------- UI skeleton (injected once) ---------------- */
  var els = {};
  function buildUI() {
    if ($('#arCartFab')) return;
    var wrap = document.createElement('div');
    wrap.id = 'arCartRoot';
    wrap.innerHTML =
      '<button type="button" id="arCartFab" class="ar-cart-fab" aria-label="Open cart"><svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2.5 3h2.1l2.5 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L21.5 7H6"/></svg>' +
        '<span id="arCartBadge" class="ar-cart-badge" hidden>0</span></button>' +
      '<div id="arCartOverlay" class="ar-cart-overlay"></div>' +
      '<aside id="arCartDrawer" class="ar-cart-drawer" aria-hidden="true">' +
        '<div class="ar-cart-head"><strong>' + cartIcon(20) + ' Your Cart</strong>' +
          '<button type="button" class="ar-cart-close" data-ar-close aria-label="Close cart">&times;</button></div>' +
        '<div id="arCartItems" class="ar-cart-items"></div>' +
        '<div class="ar-cart-foot">' +
          '<div class="ar-cart-total"><span>Total</span><strong id="arCartTotal">Rs 0</strong></div>' +
          '<button type="button" id="arCartCheckoutBtn" class="ar-btn-gradient ar-w100">Checkout</button>' +
          '<button type="button" class="ar-cart-continue" data-ar-close>Continue shopping</button>' +
        '</div>' +
      '</aside>' +
      '<div id="arCheckoutModal" class="ar-checkout-modal" aria-hidden="true">' +
        '<div class="ar-checkout-box">' +
          '<div class="ar-cart-head"><strong>Checkout</strong>' +
            '<button type="button" class="ar-cart-close" data-ar-close-checkout aria-label="Close checkout">&times;</button></div>' +
          '<div id="arCheckoutSummary" class="ar-checkout-summary"></div>' +
          '<div class="ar-coupon-row">' +
            '<input id="arCoCoupon" class="ar-co-input ar-coupon-input" type="text" placeholder="Coupon code (SAVE10)" autocomplete="off">' +
            '<button type="button" id="arCoApply" class="ar-coupon-apply">Apply</button></div>' +
          '<p id="arCoCouponMsg" class="ar-coupon-msg" hidden></p>' +
          '<form id="arCheckoutForm" novalidate>' +
            '<label class="ar-co-label" for="arCoName">Full Name *</label>' +
            '<input id="arCoName" class="ar-co-input" type="text" placeholder="Enter your name" autocomplete="name">' +
            '<label class="ar-co-label" for="arCoPhone">WhatsApp Number *</label>' +
            '<input id="arCoPhone" class="ar-co-input" type="tel" placeholder="03XXXXXXXXX" autocomplete="tel">' +
            '<label class="ar-co-label" for="arCoCity">City (optional)</label>' +
            '<input id="arCoCity" class="ar-co-input" type="text" placeholder="e.g. Mirpur" autocomplete="address-level2">' +
            '<p id="arCoError" class="ar-co-error" hidden></p>' +
            '<button type="submit" class="ar-btn-gradient ar-w100 ar-co-submit">Place Order on WhatsApp <i class="fa-brands fa-whatsapp"></i></button>' +
            '<p class="ar-co-note">Payment JazzCash / EasyPaisa par WhatsApp par confirm hoga. Koi online payment nahi hai.</p>' +
          '</form>' +
        '</div>' +
      '</div>' +
      '<div id="arToast" class="ar-toast" hidden></div>';
    document.body.appendChild(wrap);

    els.fab = $('#arCartFab'); els.badge = $('#arCartBadge');
    els.overlay = $('#arCartOverlay'); els.drawer = $('#arCartDrawer');
    els.itemsBox = $('#arCartItems'); els.total = $('#arCartTotal');
    els.checkoutBtn = $('#arCartCheckoutBtn');
    els.modal = $('#arCheckoutModal'); els.summary = $('#arCheckoutSummary');
    els.form = $('#arCheckoutForm'); els.error = $('#arCoError');
    els.toast = $('#arToast');
    els.couponInput = $('#arCoCoupon'); els.couponApply = $('#arCoApply');
    els.couponMsg = $('#arCoCouponMsg');

    els.fab.addEventListener('click', openDrawer);
    els.overlay.addEventListener('click', closeDrawer);
    $all('[data-ar-close]', wrap).forEach(function (b) { b.addEventListener('click', closeDrawer); });
    $all('[data-ar-close-checkout]', wrap).forEach(function (b) { b.addEventListener('click', closeCheckout); });
    els.checkoutBtn.addEventListener('click', openCheckout);
    els.couponApply.addEventListener('click', applyCouponFromInput);
    els.itemsBox.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-ar-remove]') : null;
      if (btn) ARCart.remove(btn.getAttribute('data-ar-remove'));
    });
    els.modal.addEventListener('click', function (e) { if (e.target === els.modal) closeCheckout(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeCheckout(); closeDrawer(); }
    });
    els.form.addEventListener('submit', onCheckoutSubmit);
  }

  /* ---------------- rendering / feedback ---------------- */
  function renderCart() {
    if (!els.badge) return;
    var count = items.length;
    els.badge.textContent = count;
    els.badge.hidden = count === 0;
    if (!count) {
      els.itemsBox.innerHTML = '<p class="ar-cart-empty">Your cart is empty.<br>Add a plan and checkout in one tap.</p>';
    } else {
      els.itemsBox.innerHTML = items.map(function (x) {
        return '<div class="ar-cart-item"><div class="ar-cart-item-info">' +
          '<strong>' + escapeHtml(x.name) + '</strong><span>' + fmt(x.price) + '</span></div>' +
          '<button type="button" class="ar-cart-remove" data-ar-remove="' + escapeHtml(x.id) + '" aria-label="Remove item">&times;</button></div>';
      }).join('');
    }
    els.total.textContent = fmt(cartTotal());
    els.checkoutBtn.disabled = count === 0;
    els.checkoutBtn.classList.toggle('ar-disabled', count === 0);
  }
  function pulseBadge() {
    if (!els.fab) return;
    els.fab.classList.remove('ar-pulse');
    void els.fab.offsetWidth; /* restart animation */
    els.fab.classList.add('ar-pulse');
  }
  var toastTimer = null;
  function toast(msg) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.hidden = true; }, 2600);
  }

  /* ---------------- drawer / checkout ---------------- */
  function openDrawer() {
    renderCart();
    els.drawer.classList.add('open'); els.drawer.setAttribute('aria-hidden', 'false');
    els.overlay.classList.add('open');
  }
  function closeDrawer() {
    if (!els.drawer) return;
    els.drawer.classList.remove('open'); els.drawer.setAttribute('aria-hidden', 'true');
    els.overlay.classList.remove('open');
  }
  function couponMsgShow(text, ok) {
    if (!els.couponMsg) return;
    els.couponMsg.textContent = text;
    els.couponMsg.hidden = false;
    els.couponMsg.className = 'ar-coupon-msg ' + (ok ? 'ok' : 'err');
  }
  function renderSummary() {
    var calc = couponCalc(items, appliedCoupon);
    var html = items.map(function (x) {
      return '<div class="ar-co-line"><span>' + escapeHtml(x.name) + '</span><strong>' + fmt(x.price) + '</strong></div>';
    }).join('');
    if (calc.applied) {
      html += '<div class="ar-co-line"><span>Subtotal</span><strong>' + fmt(cartTotal()) + '</strong></div>' +
        '<div class="ar-co-line ar-co-discount"><span>Coupon: ' + calc.code + ' (−' + calc.percent + '%)</span><strong>−' + fmt(calc.discount) + '</strong></div>';
    }
    html += '<div class="ar-co-line ar-co-grand"><span>Total</span><strong>' + fmt(finalTotal()) + '</strong></div>';
    els.summary.innerHTML = html;
    return calc;
  }
  function applyCouponFromInput() {
    var code = els.couponInput ? els.couponInput.value : '';
    if (!code || !String(code).trim()) { couponMsgShow('Enter a coupon code.', false); return; }
    var calc = couponCalc(items, code);
    if (calc.reason === 'invalid') {
      appliedCoupon = ''; renderSummary();
      couponMsgShow('Invalid coupon code.', false);
      return;
    }
    if (calc.reason === 'not_applicable') {
      appliedCoupon = ''; renderSummary();
      couponMsgShow('This code does not apply to this plan.', false);
      return;
    }
    appliedCoupon = calc.code;
    renderSummary();
    couponMsgShow('Coupon ' + calc.code + ' applied — you save ' + fmt(calc.discount) + '.', true);
  }
  function openCheckout() {
    if (!items.length) { toast('Cart khaali hai — pehle koi plan add karein'); return; }
    closeDrawer();
    var calc = renderSummary();
    if (appliedCoupon) {
      if (calc.applied) couponMsgShow('Coupon ' + calc.code + ' applied — you save ' + fmt(calc.discount) + '.', true);
      else if (calc.reason === 'not_applicable') couponMsgShow('This code does not apply to this plan.', false);
    } else if (els.couponMsg) { els.couponMsg.hidden = true; }
    els.error.hidden = true;
    els.modal.classList.add('open'); els.modal.setAttribute('aria-hidden', 'false');
    /* Pixel: InitiateCheckout on modal open (spec) */
    fbqTrack('InitiateCheckout', {
      value: finalTotal(), currency: 'PKR', num_items: items.length,
      content_ids: items.map(function (x) { return x.id; }), content_type: 'product'
    });
  }
  function closeCheckout() {
    if (!els.modal) return;
    els.modal.classList.remove('open'); els.modal.setAttribute('aria-hidden', 'true');
  }
  function onCheckoutSubmit(e) {
    e.preventDefault();
    var name = $('#arCoName').value.trim();
    var phoneRaw = $('#arCoPhone').value.trim();
    var city = $('#arCoCity').value.trim();
    var phone = phoneRaw.replace(/[\s-]/g, '');
    function fail(msg) { els.error.textContent = msg; els.error.hidden = false; }
    if (!name) { fail('Meherbani karke apna naam likhein.'); return; }
    if (!/^\+?\d{10,13}$/.test(phone)) { fail('Sahi WhatsApp number likhein (masalan 03XXXXXXXXX).'); return; }
    if (!items.length) { fail('Cart khaali hai.'); return; }
    els.error.hidden = true;

    /* Phase B: send the lead to the sheet endpoint (fire-and-forget).
       Must NEVER block/delay/break the WhatsApp flow below. */
    try {
      var leadPayload = JSON.stringify({ action: 'websitelead', data: {
        name: name, number: phoneRaw, city: city,
        items: items.map(function (x) { return x.name + ' Rs ' + x.price; }).join('; '),
        total: finalTotal(),
        coupon: couponCalc(items, appliedCoupon).applied ? appliedCoupon : ''
      } });
      var leadUrl = 'https://script.google.com/macros/s/AKfycby-brB_YTJvxp-dwjbVkI21OT1onpe7eck-3JpB-UJaw3BuVp-YaUHvMsRUO_K4om4/exec';
      try {
        if (!(navigator.sendBeacon && navigator.sendBeacon(leadUrl, new Blob([leadPayload], { type: 'text/plain' })))) throw 0;
      } catch (beaconErr) {
        try { fetch(leadUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: leadPayload, keepalive: true }); } catch (fetchErr) { /* ignore */ }
      }
    } catch (leadErr) { /* lead send is best-effort only — ignore */ }

    var lines = items.map(function (x) { return '• ' + x.name + ' — Rs ' + x.price; });
    var calc = couponCalc(items, appliedCoupon);
    var totalsText = '\nTotal: Rs ' + finalTotal();
    if (calc.applied) {
      totalsText = '\nSubtotal: Rs ' + cartTotal() +
        '\nCoupon: ' + calc.code + ' (−' + calc.percent + '%)' +
        '\nDiscount: −Rs ' + calc.discount +
        '\nTotal: Rs ' + finalTotal();
    }
    var msg = 'Assalam o Alaikum! Main website se order karna chahta hoon:\n' +
      lines.join('\n') +
      totalsText +
      '\nName: ' + name +
      '\nNumber: ' + phoneRaw +
      (city ? '\nCity: ' + city : '');
    /* The site-wide wa.me window.open wrapper fires the Lead event once. */
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
    ARCart.clear();
    appliedCoupon = '';
    if (els.couponInput) els.couponInput.value = '';
    if (els.couponMsg) els.couponMsg.hidden = true;
    closeCheckout();
    toast('Shukriya! Aap ka order WhatsApp par bhej diya gaya hai.');
  }

  /* ---------------- public API ---------------- */
  var ARCart = {
    add: function (item) {
      if (!item || !item.id || !item.name) return false;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === item.id) { toast('Ye plan pehle se cart mein hai'); pulseBadge(); return false; }
      }
      var entry = { id: String(item.id), name: String(item.name), price: Number(item.price) || 0 };
      items.push(entry);
      save(); renderCart(); pulseBadge();
      fbqTrack('AddToCart', {
        content_name: entry.name, content_ids: [entry.id], content_type: 'product',
        value: entry.price, currency: 'PKR'
      });
      return true;
    },
    remove: function (id) {
      items = items.filter(function (x) { return x.id !== id; });
      save(); renderCart();
    },
    items: function () { return items.slice(); },
    total: cartTotal,
    clear: function () { items = []; save(); renderCart(); },
    openDrawer: openDrawer,
    openCheckout: openCheckout
  };
  window.ARCart = ARCart;

  /* ---------------- product page: selection + button + ViewContent ---------------- */
  function currentProductSelection(root) {
    var slug = root.getAttribute('data-slug') || '';
    var p = productBySlug(slug);
    var h1 = $('h1', root);
    var prodName = p ? p.name : (h1 ? h1.textContent.trim() : slug);
    var activeBtn = $('.product-plan-option.active', root);
    if (activeBtn && activeBtn.disabled) return { outOfStock: true };
    var planName = '';
    if (activeBtn) {
      var strong = activeBtn.querySelector('strong');
      planName = strong ? strong.textContent.trim() : '';
    }
    var totalEl = $('#productTotalPrice', root);
    var price = totalEl ? parsePrice(totalEl.textContent) : 0;
    var devices = null;
    var devWrap = $('#capcutDeviceOptions', root);
    if (devWrap && devWrap.style.display !== 'none') {
      var devBtn = $('.device-option.active', devWrap);
      if (devBtn) devices = parseInt(devBtn.getAttribute('data-devices'), 10) || null;
    }
    if (!planName && p) {
      var dp = defaultPlan(p);
      if (dp) { planName = dp.name; if (!price) price = parsePrice(dp.price); }
    }
    var name = prodName + (planName ? ' — ' + planName : '') +
      (devices ? ' (' + devices + ' Device' + (devices > 1 ? 's' : '') + ')' : '');
    var id = slug + '-' + slugify(planName) + (devices ? '-' + devices + 'device' : '');
    return { id: id, name: name, price: price };
  }

  function injectProductButton(root) {
    if ($('#arAddCartProduct', root)) return true;
    var orderBtn = $('#productOrderBtn', root);
    if (!orderBtn) return false;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'arAddCartProduct';
    btn.className = 'ar-add-cart-btn ar-add-cart-product';
    btn.innerHTML = cartIcon(18) + ' Add to Cart';
    btn.addEventListener('click', function () {
      var sel = currentProductSelection(root);
      if (!sel) return;
      if (sel.outOfStock) { toast('Ye plan Out of Stock hai'); return; }
      ARCart.add(sel);
    });
    orderBtn.parentNode.insertBefore(btn, orderBtn.nextSibling);
    return true;
  }

  function fireViewContent(root) {
    var slug = root.getAttribute('data-slug') || '';
    var p = productBySlug(slug);
    if (!p) return;
    var dp = defaultPlan(p);
    fbqTrack('ViewContent', {
      content_name: p.name, content_ids: [p.slug], content_type: 'product',
      value: dp ? parsePrice(dp.price) : parsePrice(p.price), currency: 'PKR'
    });
  }

  /* ---------------- index / tools cards ---------------- */
  function cardItem(p) {
    var dp = defaultPlan(p);
    if (!dp) return null;
    var devices = (p.slug === 'capcut' && /month/i.test(dp.name)) ? 1 : null;
    return {
      id: p.slug + '-' + slugify(dp.name) + (devices ? '-1device' : ''),
      name: p.name + ' — ' + dp.name + (devices ? ' (1 Device)' : ''),
      price: parsePrice(dp.price)
    };
  }
  function injectCardButtons() {
    var found = false;
    $all('#homeProducts .product-item, #storeGrid .product-item').forEach(function (card) {
      found = true;
      if (card.querySelector('.ar-add-cart-btn')) return;
      var link = card.querySelector('a[href^="product-"]');
      if (!link) return;
      var m = /product-([a-z0-9-]+)\.html/.exec(link.getAttribute('href') || '');
      if (!m) return;
      var p = productBySlug(m[1]);
      if (!p) return;
      var item = cardItem(p);
      if (!item) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ar-add-cart-btn ar-add-cart-card';
      btn.innerHTML = cartIcon(18) + ' Add to Cart';
      btn.addEventListener('click', function () { ARCart.add(item); });
      link.parentNode.insertBefore(btn, link.nextSibling);
    });
    return found;
  }

  /* ---------------- init ---------------- */
  function init() {
    buildUI();
    renderCart();
    var root = $('#productPage');
    if (root) fireViewContent(root);
    /* app.js renders product page + grids in its own DOMContentLoaded handler
       (registered before ours). Poll briefly as a safety net. */
    var tries = 0;
    (function inject() {
      var doneProduct = root ? injectProductButton(root) : true;
      var doneCards = injectCardButtons();
      tries++;
      if ((!doneProduct || !doneCards) && tries < 20) setTimeout(inject, 150);
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
