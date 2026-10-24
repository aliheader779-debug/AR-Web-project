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

  /* ---------------- quantity discount (2026-10-23) ----------------
     Per-line tiers on the quantity of the SAME plan (multiple accounts):
       2 accounts = 5% off - 3 accounts = 10% off - 4+ accounts = 15% off.
     Applies to every cart line, CapCut 1-Device included (separate
     accounts).
     Pure logic between the QTY-LOGIC markers for Node unit tests. */
  /* QTY-LOGIC-START */
  var QTY_MAX = 10;
  function clampQty(q) { q = parseInt(q, 10); if (isNaN(q) || q < 1) return 1; return q > QTY_MAX ? QTY_MAX : q; }
  function qtyTierPercent(qty) {
    qty = clampQty(qty);
    if (qty >= 4) return 15;
    if (qty === 3) return 10;
    if (qty === 2) return 5;
    return 0;
  }
  function qtyDiscountFor(list) {
    var amount = 0, percents = [];
    (list || []).forEach(function (x) {
      var pct = qtyTierPercent(x && x.qty);
      if (pct > 0) {
        amount += Math.round((Number(x.price) || 0) * pct / 100);
        if (percents.indexOf(pct) === -1) percents.push(pct);
      }
    });
    return { amount: amount, percents: percents };
  }
  /* QTY-LOGIC-END */

  /* ---------------- coupon SAVE10 (restored 2026-10-23, owner order) ----
     One code: SAVE10 = 10% off. Rules (same as the original system):
       - CapCut 1-Device plan (id 'capcut-1-month-1device') is EXCLUDED
         from the coupon base; if the cart/selection has ONLY that item,
         the code does not apply at all.
       - Coupon and quantity discount NEVER stack: both are computed and
         only the LARGER one is applied.
     The applied code is a single shared state (localStorage) so a coupon
     applied on a product page also applies in the cart/checkout.
     Pure logic between the COUPON-LOGIC markers for Node unit tests. */
  var COUPON_KEY = 'ar_coupon_v1';
  var couponCode = '';
  function loadCoupon() {
    try { couponCode = normalizeCouponCode(localStorage.getItem(COUPON_KEY)); } catch (e) { couponCode = ''; }
    if (!couponPercent(couponCode)) couponCode = '';
  }
  function saveCoupon() {
    try {
      if (couponCode) localStorage.setItem(COUPON_KEY, couponCode);
      else localStorage.removeItem(COUPON_KEY);
    } catch (e) { /* private mode */ }
  }
  /* COUPON-LOGIC-START */
  var COUPONS = { SAVE10: 10 };
  var COUPON_EXCLUDED_IDS = ['capcut-1-month-1device'];
  function normalizeCouponCode(code) { return String(code == null ? '' : code).replace(/\s+/g, '').toUpperCase(); }
  function couponPercent(code) { return COUPONS[normalizeCouponCode(code)] || 0; }
  function isCouponExcluded(item) { return !!item && COUPON_EXCLUDED_IDS.indexOf(String(item.id || '')) !== -1; }
  function couponBaseFor(list) {
    return (list || []).reduce(function (s, x) { return isCouponExcluded(x) ? s : s + (Number(x.price) || 0); }, 0);
  }
  function couponDiscountFor(list, code) {
    var pct = couponPercent(code);
    var base = couponBaseFor(list);
    if (!pct) return { amount: 0, percent: 0, base: base };
    return { amount: Math.round(base * pct / 100), percent: pct, base: base };
  }
  function bestDiscountFor(list, code) {
    var gross = (list || []).reduce(function (sm, x) { return sm + (Number(x.price) || 0); }, 0);
    var qd = qtyDiscountFor(list);
    var cd = couponDiscountFor(list, code);
    var r = { type: '', amount: 0, percent: 0, gross: gross, qtyAmount: qd.amount, couponAmount: cd.amount, couponBase: cd.base };
    if (cd.amount > 0 && cd.amount >= qd.amount) {
      r.type = 'coupon'; r.amount = cd.amount; r.percent = cd.percent;
    } else if (qd.amount > 0) {
      r.type = 'qty'; r.amount = qd.amount;
      r.percent = qd.percents.length === 1 ? qd.percents[0] : 0;
    }
    return r;
  }
  function appliedDiscount(list) { return bestDiscountFor(list, couponCode); }
  /* COUPON-LOGIC-END */
  loadCoupon();
  function finalTotal() {
    return cartTotal() - appliedDiscount(items).amount;
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
      }).map(function (x) {
        var q = clampQty(x.qty);
        var unit = Number(x.unit) > 0 ? Number(x.unit) : Math.round((Number(x.price) || 0) / q);
        x.qty = q; x.unit = unit; x.price = unit * q;
        return x;
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
          '<div class="ar-cart-total ar-cart-disc-row" id="arCartDiscRow" hidden><span id="arCartDiscLabel">Discount</span><strong id="arCartDisc">−Rs 0</strong></div>' +
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
          '<form id="arCheckoutForm" novalidate>' +
            '<label class="ar-co-label" for="arCoName">Full Name *</label>' +
            '<input id="arCoName" class="ar-co-input" type="text" placeholder="Enter your name" autocomplete="name">' +
            '<label class="ar-co-label" for="arCoPhone">WhatsApp Number *</label>' +
            '<input id="arCoPhone" class="ar-co-input" type="tel" placeholder="03XXXXXXXXX" autocomplete="tel">' +
            '<details class="product-payments ar-co-payments"><summary><span>\uD83D\uDCB3 Payment Methods</span></summary><div class="product-payments-body"><div class="pay-method"><div><strong>JazzCash / EasyPaisa</strong><span>Ali Haider — 03179172511</span></div><button type="button" class="pay-copy-btn" data-copy="03179172511">Copy</button></div><p class="pay-note">Payment ke baad screenshot WhatsApp par bhejen.</p></div></details>' +
            '<div class="ar-co-coupon">' +
              '<label class="ar-co-label" for="arCoCouponInput">Coupon Code (agar hai to)</label>' +
              '<div class="ar-co-coupon-row">' +
                '<input id="arCoCouponInput" class="ar-co-input" type="text" placeholder="COUPON CODE (AGAR HAI TO)" autocomplete="off" spellcheck="false">' +
                '<button type="button" id="arCoCouponApply" class="ar-btn-gradient ar-co-coupon-apply">Apply</button>' +
              '</div>' +
              '<p id="arCoCouponMsg" class="ar-co-coupon-msg" hidden></p>' +
              '<button type="button" id="arCoCouponRemove" class="ar-co-coupon-remove" hidden>Remove coupon</button>' +
            '</div>' +
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
    els.discRow = $('#arCartDiscRow'); els.disc = $('#arCartDisc');
    els.checkoutBtn = $('#arCartCheckoutBtn');
    els.modal = $('#arCheckoutModal'); els.summary = $('#arCheckoutSummary');
    els.form = $('#arCheckoutForm'); els.error = $('#arCoError');
    els.toast = $('#arToast');
    els.discLabel = $('#arCartDiscLabel');
    els.couponInput = $('#arCoCouponInput'); els.couponApply = $('#arCoCouponApply');
    els.couponMsg = $('#arCoCouponMsg'); els.couponRemove = $('#arCoCouponRemove');

    els.fab.addEventListener('click', openDrawer);
    els.overlay.addEventListener('click', closeDrawer);
    $all('[data-ar-close]', wrap).forEach(function (b) { b.addEventListener('click', closeDrawer); });
    $all('[data-ar-close-checkout]', wrap).forEach(function (b) { b.addEventListener('click', closeCheckout); });
    els.checkoutBtn.addEventListener('click', openCheckout);
    /* Copy button inside the checkout Payment Methods box (same pattern as the product-page dropdown). */
    els.modal.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-copy]') : null;
      if (!b) return;
      var t = b.getAttribute('data-copy') || '';
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(done, function () {}); }
      else { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (err) {} document.body.removeChild(ta); }
    });
    els.itemsBox.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var qbtn = e.target.closest('[data-ar-qinc],[data-ar-qdec]');
      if (qbtn) {
        var qid = qbtn.getAttribute('data-ar-qinc') || qbtn.getAttribute('data-ar-qdec');
        ARCart.changeQty(qid, qbtn.hasAttribute('data-ar-qinc') ? 1 : -1);
        return;
      }
      var btn = e.target.closest('[data-ar-remove]');
      if (btn) ARCart.remove(btn.getAttribute('data-ar-remove'));
    });
    els.modal.addEventListener('click', function (e) { if (e.target === els.modal) closeCheckout(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeCheckout(); closeDrawer(); }
    });
    els.form.addEventListener('submit', onCheckoutSubmit);
    if (els.couponApply) els.couponApply.addEventListener('click', function () {
      if (tryApplyCoupon(els.couponInput.value, function () { return items; }, els.couponMsg)) {
        renderSummary(); renderCart(); syncCouponUI();
      }
      /* On failure the error message set by tryApplyCoupon stays as-is. */
    });
    if (els.couponRemove) els.couponRemove.addEventListener('click', function () {
      clearCoupon();
      renderSummary(); renderCart(); syncCouponUI();
    });
  }

  /* ---------------- coupon UI helpers ---------------- */
  function setCouponMsg(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.hidden = !text;
    el.classList.remove('is-error', 'is-ok', 'is-warn');
    if (text && kind) el.classList.add('is-' + kind);
  }
  function clearCoupon() {
    couponCode = '';
    saveCoupon();
    if (els.couponInput) els.couponInput.value = '';
    setCouponMsg(els.couponMsg, '', '');
    var pIn = $('#arCouponInput'), pMsg = $('#arCouponMsg'), pRem = $('#arCouponRemove');
    if (pIn) pIn.value = '';
    setCouponMsg(pMsg, '', '');
    if (pRem) pRem.hidden = true;
  }
  /* Validate + apply a code against a context list (cart items at checkout,
     the current selection line on a product page). Returns true if applied. */
  function tryApplyCoupon(raw, getList, msgEl) {
    var code = normalizeCouponCode(raw);
    if (!code) { setCouponMsg(msgEl, 'Please enter a coupon code.', 'error'); return false; }
    if (!couponPercent(code)) { setCouponMsg(msgEl, 'Invalid coupon code. Please check and try again.', 'error'); return false; }
    if (couponBaseFor(getList()) <= 0) { setCouponMsg(msgEl, 'This code does not apply to this plan.', 'error'); return false; }
    couponCode = code;
    saveCoupon();
    setCouponMsg(msgEl, 'Coupon ' + code + ' applied — ' + couponPercent(code) + '% off.', 'ok');
    return true;
  }
  /* Keep the checkout coupon field in step with the shared coupon state. */
  function syncCouponUI() {
    if (!els.couponInput) return;
    if (couponCode) {
      els.couponInput.value = couponCode;
      if (els.couponRemove) els.couponRemove.hidden = false;
      if (couponBaseFor(items) <= 0 && items.length) {
        setCouponMsg(els.couponMsg, 'Coupon ' + couponCode + ' is applied, but it does not apply to this plan.', 'warn');
      } else {
        setCouponMsg(els.couponMsg, 'Coupon ' + couponCode + ' applied — ' + couponPercent(couponCode) + '% off.', 'ok');
      }
    } else {
      if (els.couponRemove) els.couponRemove.hidden = true;
    }
  }

  /* ---------------- rendering / feedback ---------------- */
  function renderCart() {
    if (!els.badge) return;
    var units = items.reduce(function (sm, x) { return sm + clampQty(x.qty); }, 0);
    els.badge.textContent = units;
    els.badge.hidden = units === 0;
    if (!items.length) {
      els.itemsBox.innerHTML = '<p class="ar-cart-empty">Your cart is empty.<br>Add a plan and checkout in one tap.</p>';
    } else {
      els.itemsBox.innerHTML = items.map(function (x) {
        var q = clampQty(x.qty);
        return '<div class="ar-cart-item"><div class="ar-cart-item-info">' +
          '<strong>' + escapeHtml(x.name) + '</strong>' +
          '<span>' + fmt(x.unit) + (q > 1 ? ' × ' + q : '') + ' — ' + fmt(x.price) + '</span>' +
          '<div class="ar-cart-qty"><button type="button" data-ar-qdec="' + escapeHtml(x.id) + '" aria-label="Decrease quantity">−</button><span>' + q + '</span><button type="button" data-ar-qinc="' + escapeHtml(x.id) + '" aria-label="Increase quantity">+</button></div>' +
          '</div>' +
          '<button type="button" class="ar-cart-remove" data-ar-remove="' + escapeHtml(x.id) + '" aria-label="Remove item">&times;</button></div>';
      }).join('');
    }
    var best = appliedDiscount(items);
    if (els.discRow && els.disc) {
      els.discRow.hidden = best.amount <= 0;
      if (best.amount > 0) {
        els.disc.textContent = '−' + fmt(best.amount);
        if (els.discLabel) els.discLabel.textContent = best.type === 'coupon' ? 'Discount (Coupon ' + couponCode + ')' : 'Discount';
      }
    }
    els.total.textContent = fmt(finalTotal());
    els.checkoutBtn.disabled = items.length === 0;
    els.checkoutBtn.classList.toggle('ar-disabled', items.length === 0);
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
  function renderSummary() {
    var best = appliedDiscount(items);
    var html = items.map(function (x) {
      var q = clampQty(x.qty);
      return '<div class="ar-co-line"><span>' + escapeHtml(x.name) + (q > 1 ? ' × ' + q : '') + '</span><strong>' + fmt(x.price) + '</strong></div>';
    }).join('');
    if (best.amount > 0) {
      html += '<div class="ar-co-line"><span>Subtotal</span><strong>' + fmt(cartTotal()) + '</strong></div>';
      var discLabel = best.type === 'coupon'
        ? 'Coupon ' + couponCode + ' (' + best.percent + '%)'
        : 'Quantity discount' + (best.percent ? ' (' + best.percent + '%)' : '');
      html += '<div class="ar-co-line ar-co-discount"><span>' + discLabel + '</span><strong>−' + fmt(best.amount) + '</strong></div>';
    }
    html += '<div class="ar-co-line ar-co-grand"><span>Total</span><strong>' + fmt(finalTotal()) + '</strong></div>';
    els.summary.innerHTML = html;
    return best;
  }

  function openCheckout() {
    if (!items.length) { toast('Cart khaali hai — pehle koi plan add karein'); return; }
    closeDrawer();
    renderSummary();
    syncCouponUI();
    els.error.hidden = true;
    els.modal.classList.add('open'); els.modal.setAttribute('aria-hidden', 'false');
    /* Pixel: InitiateCheckout on modal open (spec) */
    fbqTrack('InitiateCheckout', {
      value: finalTotal(), currency: 'PKR', num_items: items.reduce(function (sm, x) { return sm + clampQty(x.qty); }, 0),
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
    var city = ''; /* City field hata diya gaya 2026-10-24 (owner: form sirf Name + Number + Coupon) — lead mein City khaali jayegi. */
    var phone = phoneRaw.replace(/[\s-]/g, '');
    function fail(msg) { els.error.textContent = msg; els.error.hidden = false; }
    if (!name) { fail('Meherbani karke apna naam likhein.'); return; }
    if (!/^\+?\d{10,13}$/.test(phone)) { fail('Sahi WhatsApp number likhein (masalan 03XXXXXXXXX).'); return; }
    if (!items.length) { fail('Cart khaali hai.'); return; }
    els.error.hidden = true;

    /* Phase B: send the lead to the sheet endpoint (fire-and-forget).
       Must NEVER block/delay/break the WhatsApp flow below. */
    try {
      var leadBest = appliedDiscount(items);
      var leadPayload = JSON.stringify({ action: 'websitelead', data: {
        name: name, number: phoneRaw, city: city,
        items: items.map(function (x) { var q = clampQty(x.qty); return x.name + (q > 1 ? ' x' + q : '') + ' Rs ' + x.price; }).join('; '),
        total: finalTotal(),
        coupon: leadBest.type === 'coupon' ? couponCode : ''
      } });
      var leadUrl = 'https://script.google.com/macros/s/AKfycby-brB_YTJvxp-dwjbVkI21OT1onpe7eck-3JpB-UJaw3BuVp-YaUHvMsRUO_K4om4/exec';
      try {
        if (!(navigator.sendBeacon && navigator.sendBeacon(leadUrl, new Blob([leadPayload], { type: 'text/plain' })))) throw 0;
      } catch (beaconErr) {
        try { fetch(leadUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: leadPayload, keepalive: true }); } catch (fetchErr) { /* ignore */ }
      }
    } catch (leadErr) { /* lead send is best-effort only — ignore */ }

    var lines = items.map(function (x) { var q = clampQty(x.qty); return '• ' + x.name + (q > 1 ? ' × ' + q : '') + ' — Rs ' + x.price; });
    var best = appliedDiscount(items);
    var totalsText = '\nTotal: Rs ' + finalTotal();
    if (best.amount > 0) {
      var totalsDiscLine = best.type === 'coupon'
        ? '\nCoupon: ' + couponCode + ' (' + best.percent + '%)'
        : '\nQuantity discount' + (best.percent ? ' (' + best.percent + '%)' : '');
      totalsText = '\nSubtotal: Rs ' + cartTotal() +
        totalsDiscLine +
        '\nDiscount: −Rs ' + best.amount +
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
    clearCoupon();
    closeCheckout();
    toast('Shukriya! Aap ka order WhatsApp par bhej diya gaya hai.');
  }

  /* ---------------- public API ---------------- */
  var ARCart = {
    add: function (item) {
      if (!item || !item.id || !item.name) return false;
      var qty = clampQty(item.qty);
      var unit = Number(item.unit) > 0 ? Number(item.unit) : (Number(item.price) || 0);
      var entry = { id: String(item.id), name: String(item.name), unit: unit, qty: qty, price: unit * qty };
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === entry.id) {
          items[i] = entry;
          save(); renderCart(); pulseBadge();
          toast('Cart update ho gaya — ' + qty + ' account' + (qty > 1 ? 's' : '') + ' set ho gaye');
          fbqTrack('AddToCart', {
            content_name: entry.name, content_ids: [entry.id], content_type: 'product',
            value: entry.price, currency: 'PKR'
          });
          return true;
        }
      }
      items.push(entry);
      save(); renderCart(); pulseBadge();
      fbqTrack('AddToCart', {
        content_name: entry.name, content_ids: [entry.id], content_type: 'product',
        value: entry.price, currency: 'PKR'
      });
      return true;
    },
    changeQty: function (id, delta) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items[i].qty = clampQty(items[i].qty + (parseInt(delta, 10) || 0));
          items[i].price = items[i].unit * items[i].qty;
          break;
        }
      }
      save(); renderCart();
    },

    remove: function (id) {
      items = items.filter(function (x) { return x.id !== id; });
      save(); renderCart();
    },
    items: function () { return items.slice(); },
    total: cartTotal,
    clear: function () { items = []; save(); renderCart(); },
    openDrawer: openDrawer,
    openCheckout: openCheckout,
    currentProductSelection: currentProductSelection
  };
  window.ARCart = ARCart;

  /* ---------------- product page: quantity selector + live total ----------------
     The purchase card is rendered by app.js; its #productTotalPrice always
     shows the UNIT price after a plan/device change. A MutationObserver
     treats any foreign write to that element as a new unit price, then
     re-applies quantity x tier discount to the displayed total (and to the
     sticky bar price). Add to Cart reads pageUnit/pageQty via
     currentProductSelection below. */
  var pageQty = 1, pageUnit = 0, pageLastDisplay = '';
  /* The product page's current selection as a one-line discount context:
     coupon (with its CapCut 1-Device exclusion) and the quantity tiers are
     both computed on this line, larger discount wins — same as checkout. */
  function pageContextList(root) {
    var sel = currentProductSelection(root);
    if (!sel || sel.outOfStock || !(pageUnit > 0)) return [];
    return [{ id: sel.id, price: pageUnit * pageQty, qty: pageQty }];
  }
  function refreshProductTotal(root) {
    var totalEl = $('#productTotalPrice', root);
    if (!totalEl || !(pageUnit > 0)) return;
    var gross = pageUnit * pageQty;
    var best = bestDiscountFor(pageContextList(root), couponCode);
    var disc = best.amount;
    var display = 'Rs. ' + (gross - disc).toLocaleString('en-US');
    pageLastDisplay = display;
    if (totalEl.textContent !== display) totalEl.textContent = display;
    var sticky = document.querySelector('.product-sticky-price');
    if (sticky && sticky.textContent !== display) sticky.textContent = display;
    var saveEl = $('#arQtySave', root);
    if (saveEl) {
      saveEl.hidden = disc <= 0;
      if (disc > 0) {
        saveEl.textContent = best.type === 'coupon'
          ? 'You save ' + fmt(disc) + ' (Coupon ' + couponCode + ' — ' + best.percent + '% off)'
          : 'You save ' + fmt(disc) + ' (' + best.percent + '% quantity discount)';
      }
    }
    var val = $('.ar-qty-val', root);
    if (val) val.textContent = pageQty;
    var dec = $('[data-ar-pq="-1"]', root), inc = $('[data-ar-pq="1"]', root);
    if (dec) dec.disabled = pageQty <= 1;
    if (inc) inc.disabled = pageQty >= QTY_MAX;
    updatePageCouponUI(root);
  }
  /* ---------------- product page coupon box (SR2 template renders it) ---- */
  function updatePageCouponUI(root) {
    var box = $('#arCouponBox', root || document);
    if (!box) return;
    var input = $('#arCouponInput', box), msg = $('#arCouponMsg', box), rem = $('#arCouponRemove', box);
    if (couponCode) {
      if (input && input.value !== couponCode) input.value = couponCode;
      if (rem) rem.hidden = false;
      if (couponBaseFor(pageContextList(root)) <= 0) {
        setCouponMsg(msg, 'Coupon ' + couponCode + ' is applied, but it does not apply to this plan.', 'warn');
      } else {
        setCouponMsg(msg, 'Coupon ' + couponCode + ' applied — ' + couponPercent(couponCode) + '% off.', 'ok');
      }
    } else if (rem) {
      rem.hidden = true;
    }
  }
  function bindCouponBox(root) {
    var box = $('#arCouponBox', root);
    if (!box || box.__arBound) return false;
    box.__arBound = true;
    var input = $('#arCouponInput', box), apply = $('#arCouponApply', box), msg = $('#arCouponMsg', box), rem = $('#arCouponRemove', box);
    if (apply) apply.addEventListener('click', function () {
      if (tryApplyCoupon(input ? input.value : '', function () { return pageContextList(root); }, msg)) {
        refreshProductTotal(root); /* also refreshes the coupon status line */
      }
      /* On failure the error message set by tryApplyCoupon stays as-is. */
    });
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (apply) apply.click(); } });
    if (rem) rem.addEventListener('click', function () {
      clearCoupon();
      refreshProductTotal(root);
      renderCart();
    });
    updatePageCouponUI(root);
    return true;
  }
  function injectQtyControl(root) {
    if ($('#arQtyRow', root)) return true;
    var totalBox = $('.product-total-box', root);
    if (!totalBox || !totalBox.parentNode) return false;
    var row = document.createElement('div');
    row.className = 'ar-qty-row';
    row.id = 'arQtyRow';
    row.innerHTML = '<span class="ar-qty-label">Quantity</span>' +
      '<div class="ar-qty-ctrl">' +
      '<button type="button" class="ar-qty-btn" data-ar-pq="-1" aria-label="Decrease quantity">\u2212</button>' +
      '<span class="ar-qty-val">1</span>' +
      '<button type="button" class="ar-qty-btn" data-ar-pq="1" aria-label="Increase quantity">+</button></div>';
    totalBox.parentNode.insertBefore(row, totalBox.nextSibling);
    var save = document.createElement('p');
    save.className = 'ar-qty-save';
    save.id = 'arQtySave';
    save.hidden = true;
    totalBox.parentNode.insertBefore(save, row.nextSibling);
    row.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-ar-pq]') : null;
      if (!b) return;
      pageQty = clampQty(pageQty + (parseInt(b.getAttribute('data-ar-pq'), 10) || 0));
      refreshProductTotal(root);
    });
    return true;
  }
  function watchProductTotal(root) {
    var totalEl = $('#productTotalPrice', root);
    if (!totalEl) return false;
    if (!(pageUnit > 0)) {
      pageUnit = parsePrice(totalEl.textContent);
      pageLastDisplay = totalEl.textContent;
    }
    if (window.MutationObserver && !totalEl.__arWatched) {
      totalEl.__arWatched = true;
      new MutationObserver(function () {
        var t = totalEl.textContent;
        if (t === pageLastDisplay) return;
        var v = parsePrice(t);
        if (v > 0) {
          pageUnit = v;
          /* Plan/device changed: drop any stale coupon message (e.g. an old
             error) instead of leaving the customer reading a past result. */
          if (!couponCode) { var pMsg = $('#arCouponMsg', root); if (pMsg) { pMsg.hidden = true; pMsg.textContent = ''; } }
          refreshProductTotal(root);
        }
      }).observe(totalEl, { childList: true, characterData: true, subtree: true });
    }
    injectQtyControl(root);
    refreshProductTotal(root);
    return true;
  }

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
    var unitPrice = pageUnit > 0 ? pageUnit : price;
    return { id: id, name: name, price: unitPrice, unit: unitPrice, qty: pageQty };
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
    orderBtn.parentNode.insertBefore(btn, orderBtn); /* DG order: Add to Cart pehle, Buy Now baad mein */
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
  function srCardItem(card, p) {
    var active = card.querySelector('.sr-plan.is-active') || card.querySelector('.sr-plan');
    if (!active) return null;
    var planName = active.getAttribute('data-name') || '';
    var price = parsePrice(active.getAttribute('data-price') || '');
    var devices = (p.slug === 'capcut' && /month/i.test(planName)) ? 1 : null;
    return {
      id: p.slug + '-' + slugify(planName) + (devices ? '-1device' : ''),
      name: p.name + ' — ' + planName + (devices ? ' (1 Device)' : ''),
      price: price
    };
  }
  function wireSrCard(card, p) {
    var cartBtn = card.querySelector('.sr-cart');
    var buyBtn = card.querySelector('.sr-buy');
    if (cartBtn && !cartBtn.getAttribute('data-ar-wired')) {
      cartBtn.setAttribute('data-ar-wired', '1');
      cartBtn.addEventListener('click', function () {
        var item = srCardItem(card, p);
        if (item) ARCart.add(item);
      });
    }
    if (buyBtn && !buyBtn.getAttribute('data-ar-wired')) {
      buyBtn.setAttribute('data-ar-wired', '1');
      buyBtn.addEventListener('click', function () {
        var item = srCardItem(card, p);
        if (!item) return;
        ARCart.add(item);
        ARCart.openCheckout();
      });
    }
  }
  function injectCardButtons() {
    var found = false;
    $all('#homeProducts .product-item, #storeGrid .product-item').forEach(function (card) {
      found = true;
      var sr = card.querySelector('.sr-card');
      if (sr) {
        var p = productBySlug(sr.getAttribute('data-slug') || '');
        if (p) wireSrCard(card, p);
        return;
      }
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
      var doneProduct = root ? (injectProductButton(root) && watchProductTotal(root)) : true;
      var doneCards = injectCardButtons();
      if (root) bindCouponBox(root);
      tries++;
      if ((!doneProduct || !doneCards) && tries < 20) setTimeout(inject, 150);
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
