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

  var WA_NUMBER = '923351925662';
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

  /* ---------------- cart state ---------------- */
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr.filter(function (x) { return x && x.id && x.name && typeof x.price === 'number'; });
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
      '<button type="button" id="arCartFab" class="ar-cart-fab" aria-label="Open cart">🛒' +
        '<span id="arCartBadge" class="ar-cart-badge" hidden>0</span></button>' +
      '<div id="arCartOverlay" class="ar-cart-overlay"></div>' +
      '<aside id="arCartDrawer" class="ar-cart-drawer" aria-hidden="true">' +
        '<div class="ar-cart-head"><strong>🛒 Your Cart</strong>' +
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

    els.fab.addEventListener('click', openDrawer);
    els.overlay.addEventListener('click', closeDrawer);
    $all('[data-ar-close]', wrap).forEach(function (b) { b.addEventListener('click', closeDrawer); });
    $all('[data-ar-close-checkout]', wrap).forEach(function (b) { b.addEventListener('click', closeCheckout); });
    els.checkoutBtn.addEventListener('click', openCheckout);
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
  function openCheckout() {
    if (!items.length) { toast('Cart khaali hai — pehle koi plan add karein'); return; }
    closeDrawer();
    els.summary.innerHTML = items.map(function (x) {
      return '<div class="ar-co-line"><span>' + escapeHtml(x.name) + '</span><strong>' + fmt(x.price) + '</strong></div>';
    }).join('') + '<div class="ar-co-line ar-co-grand"><span>Total</span><strong>' + fmt(cartTotal()) + '</strong></div>';
    els.error.hidden = true;
    els.modal.classList.add('open'); els.modal.setAttribute('aria-hidden', 'false');
    /* Pixel: InitiateCheckout on modal open (spec) */
    fbqTrack('InitiateCheckout', {
      value: cartTotal(), currency: 'PKR', num_items: items.length,
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

    var lines = items.map(function (x) { return '• ' + x.name + ' — Rs ' + x.price; });
    var msg = 'Assalam o Alaikum! Main website se order karna chahta hoon:\n' +
      lines.join('\n') +
      '\nTotal: Rs ' + cartTotal() +
      '\nName: ' + name +
      '\nNumber: ' + phoneRaw +
      (city ? '\nCity: ' + city : '');
    /* The site-wide wa.me window.open wrapper fires the Lead event once. */
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
    ARCart.clear();
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
    btn.innerHTML = '🛒 Add to Cart';
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
      btn.innerHTML = '🛒 Add to Cart';
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
