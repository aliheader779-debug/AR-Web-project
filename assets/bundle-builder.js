/* ==========================================================================
   AR SERVICES — Homepage: Build Your Own Bundle + Gemini offer countdown
   (2026-10-23). Loaded ONLY on index.html, after assets/app.js (PRODUCTS)
   and assets/cart.js.

   Bundle formula (SR-style): select any 2 or more tools -> flat 10% off
   the combined regular total. Bundle orders go through the cart
   checkout form (owner, 2026-10-24): ORDER adds the chosen tools to
   the cart, sets the 10% bundle discount in cart.js, and opens the
   checkout modal — so the customer's name/number come through the form.
   The old direct wa.me message is gone.
   Cards are rendered from the PRODUCTS data in app.js — each tool's own
   logo, default (first) plan and current price — so prices never drift.

   Show-more: only the first 6 tools (ORDER below) are visible at first;
   the rest sit in a collapsible area behind the "Show all 11 tools"
   toggle. Selection state lives in a plain map, so a tool selected
   while expanded stays selected (and counted) after collapsing.

   Rollback: remove this file + its <script> tag + the two homepage
   sections (#bundle, .offer-wrap) + the CSS block in style.css.
   ========================================================================== */
(function () {
  'use strict';

  var OFFER_END = '2026-10-31T23:59:59+05:00'; /* Gemini offer deadline (PKT) */

  /* Card order on the homepage bundle builder: the first VISIBLE_COUNT
     tools are always shown; the rest are behind the show-more toggle. */
  var ORDER = ['canva', 'capcut', 'gemini', 'surfshark', 'netflix',
    'youtube-premium', 'adobe-express', 'office365', 'ilovepdf',
    'quillbot', 'duolingo'];
  var VISIBLE_COUNT = 6;

  /* ---------------- pure bundle math (unit-testable) ---------------- */
  function bundleCalc(prices) {
    var list = prices || [];
    var total = 0;
    for (var i = 0; i < list.length; i++) total += Number(list[i]) || 0;
    var discount = list.length >= 2 ? Math.round(total * 10 / 100) : 0;
    return {
      count: list.length,
      total: total,
      discount: discount,
      price: total - discount,
      unlocked: list.length >= 2
    };
  }
  window.ARBundleCalc = bundleCalc; /* exposed for tests */

  function countSelectedIn(selectedMap, slugs) {
    var n = 0;
    (slugs || []).forEach(function (s) { if (selectedMap && selectedMap[s]) n++; });
    return n;
  }
  window.ARBundleHiddenSelected = countSelectedIn; /* exposed for tests */
  window.ARBundleLayout = { order: ORDER.slice(), visibleCount: VISIBLE_COUNT }; /* tests */

  function parsePrice(text) {
    var n = parseInt(String(text == null ? '' : text).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }
  function fmt(n) { return 'Rs. ' + Number(n || 0).toLocaleString('en-US'); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  /* ---------------- Build Your Own Bundle ---------------- */
  function planLabel(p) {
    var plan = (p.plans && p.plans[0]) ? p.plans[0] : null;
    var name = plan ? plan.name : '';
    if (p.slug === 'capcut') return name + ' · 1 Device'; /* default = 1 Device plan */
    return name;
  }
  function orderLabel(p) {
    var plan = (p.plans && p.plans[0]) ? p.plans[0] : null;
    var name = plan ? plan.name : '';
    if (p.slug === 'capcut') return name + ' (1 Device)';
    return name;
  }
  function cardHtml(t, extra) {
    return '<button type="button" class="byob-card" data-byob="' + escapeHtml(t.slug) + '"' +
      ' aria-pressed="false"' + (extra ? ' tabindex="-1"' : '') + '>' +
      '<span class="byob-check"><i class="fa-solid fa-check"></i></span>' +
      '<span class="byob-logo"><i class="fa-solid ' + escapeHtml(t.icon) + '" aria-hidden="true"></i>' +
      (t.logo ? '<img src="' + escapeHtml(t.logo) + '" alt="' + escapeHtml(t.name) + ' logo" loading="lazy" onerror="this.remove()">' : '') +
      '</span>' +
      '<span class="byob-name">' + escapeHtml(t.name) + '</span>' +
      '<span class="byob-plan">' + escapeHtml(t.planLabel) + '</span>' +
      '<span class="byob-price">' + fmt(t.price) + '</span>' +
      '</button>';
  }

  function initBundle() {
    var wrap = document.getElementById('byobCards');
    if (!wrap || typeof PRODUCTS === 'undefined' || !PRODUCTS.length) return;
    var countEl = document.getElementById('byobCount');
    var regEl = document.getElementById('byobRegular');
    var discEl = document.getElementById('byobDiscount');
    var totalEl = document.getElementById('byobTotal');
    var hintEl = document.getElementById('byobHint');
    var btn = document.getElementById('byobOrder');
    var toggleBtn = document.getElementById('byobToggle');
    if (!countEl || !btn) return;

    var bySlug = {};
    PRODUCTS.forEach(function (p) { bySlug[p.slug] = p; });
    var ordered = [];
    ORDER.forEach(function (slug) { if (bySlug[slug]) ordered.push(bySlug[slug]); });
    PRODUCTS.forEach(function (p) { if (ORDER.indexOf(p.slug) === -1) ordered.push(p); });

    var tools = ordered.map(function (p) {
      var plan = (p.plans && p.plans[0]) ? p.plans[0] : null;
      return {
        slug: p.slug,
        name: p.name,
        logo: p.logo || '',
        icon: p.icon || 'fa-box',
        planLabel: planLabel(p),
        orderLabel: orderLabel(p),
        planName: plan ? plan.name : '',
        devices: p.slug === 'capcut' ? 1 : null, /* default = 1 Device (cart id 'capcut-1-month-1device') */
        price: parsePrice(plan ? plan.price : p.price)
      };
    });

    var visibleTools = tools.slice(0, VISIBLE_COUNT);
    var extraTools = tools.slice(VISIBLE_COUNT);
    var extraSlugs = extraTools.map(function (t) { return t.slug; });
    var selected = {}; /* slug -> tool */
    var expanded = false;
    var currentChosen = []; /* upd() se taaza selection — ORDER click handler ke liye */
    var currentBundle = null;
    function bundleSlugify(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
    function bundleItemId(t) { return t.slug + '-' + bundleSlugify(t.planName) + (t.devices ? '-' + t.devices + 'device' : ''); } /* cart.js currentProductSelection jaisi id — taake SAVE10 ki CapCut exclusion bhi sahi lage */

    var html = visibleTools.map(function (t) { return cardHtml(t, false); }).join('');
    if (extraTools.length) {
      html += '<div class="byob-more" id="byobMore" aria-hidden="true">' +
        '<div class="byob-more-inner"><div class="byob-more-grid">' +
        extraTools.map(function (t) { return cardHtml(t, true); }).join('') +
        '</div></div></div>';
    } else if (toggleBtn) {
      toggleBtn.style.display = 'none';
    }
    wrap.innerHTML = html;
    var moreWrap = document.getElementById('byobMore');

    function upd() {
      var chosen = tools.filter(function (t) { return selected[t.slug]; });
      var r = bundleCalc(chosen.map(function (t) { return t.price; }));
      countEl.textContent = r.count;
      regEl.innerHTML = r.count >= 2 ? '<span class="byob-strike">' + fmt(r.total) + '</span>' : fmt(r.total);
      discEl.textContent = r.unlocked ? '−' + fmt(r.discount) : '—';
      totalEl.textContent = r.count ? fmt(r.price) : '—';
      if (toggleBtn && extraTools.length) {
        if (expanded) {
          toggleBtn.innerHTML = 'Show less <span class="byob-toggle-arrow">&#9650;</span>';
        } else {
          var hiddenSel = countSelectedIn(selected, extraSlugs);
          toggleBtn.innerHTML = 'Show all ' + tools.length + ' tools' +
            (hiddenSel ? ' (' + hiddenSel + ' selected)' : '') +
            ' <span class="byob-toggle-arrow">&#9660;</span>';
        }
      }
      if (!r.unlocked) {
        hintEl.textContent = r.count === 1
          ? 'Add 1 more tool to unlock the 10% bundle discount.'
          : 'Select any 2 or more tools to unlock the 10% bundle discount.';
        btn.classList.add('disabled');
        btn.setAttribute('aria-disabled', 'true');
        btn.removeAttribute('href');
        currentChosen = [];
        currentBundle = null;
        return;
      }
      hintEl.innerHTML = '<span class="byob-save">Bundle discount applied — you save ' + fmt(r.discount) + '.</span>';
      currentChosen = chosen.slice();
      currentBundle = r;
      btn.classList.remove('disabled');
      btn.removeAttribute('aria-disabled'); /* 2026-10-24 (owner): ORDER seedha wa.me nahi — checkout form kholta hai (neeche click handler). */
    }

    Array.prototype.forEach.call(wrap.querySelectorAll('[data-byob]'), function (card) {
      card.addEventListener('click', function () {
        var slug = card.getAttribute('data-byob');
        var tool = null;
        tools.forEach(function (t) { if (t.slug === slug) tool = t; });
        if (!tool) return;
        if (selected[slug]) {
          delete selected[slug];
          card.classList.remove('byob-on');
          card.setAttribute('aria-pressed', 'false');
        } else {
          selected[slug] = tool;
          card.classList.add('byob-on');
          card.setAttribute('aria-pressed', 'true');
        }
        upd();
      });
    });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!currentBundle || !currentBundle.unlocked || !currentChosen.length) return;
      if (typeof ARCart === 'undefined' || !ARCart.add || !ARCart.openCheckout) return;
      currentChosen.forEach(function (t) {
        ARCart.add({ id: bundleItemId(t), name: t.name + ' — ' + t.planName + (t.devices ? ' (' + t.devices + ' Device)' : ''), price: t.price, unit: t.price, qty: 1 });
      });
      if (ARCart.setBundleDiscount) ARCart.setBundleDiscount(true);
      ARCart.openCheckout();
    });
    if (toggleBtn && moreWrap) {
      toggleBtn.addEventListener('click', function () {
        expanded = !expanded;
        moreWrap.classList.toggle('byob-open', expanded);
        moreWrap.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        Array.prototype.forEach.call(moreWrap.querySelectorAll('[data-byob]'), function (card) {
          if (expanded) card.removeAttribute('tabindex');
          else card.setAttribute('tabindex', '-1');
        });
        upd();
      });
    }
    upd();
  }

  /* ---------------- Gemini offer countdown ---------------- */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function initOffer() {
    var dEl = document.getElementById('offerDays');
    if (!dEl) return;
    var hEl = document.getElementById('offerHours');
    var mEl = document.getElementById('offerMins');
    var sEl = document.getElementById('offerSecs');
    var endedEl = document.getElementById('offerEnded');
    var target = new Date(OFFER_END).getTime();
    var timer = null;
    function tick() {
      var left = target - Date.now();
      if (left <= 0) {
        dEl.textContent = '00'; hEl.textContent = '00';
        mEl.textContent = '00'; sEl.textContent = '00';
        if (endedEl) endedEl.hidden = false;
        if (timer) clearInterval(timer);
        return;
      }
      var sec = Math.floor(left / 1000);
      dEl.textContent = pad2(Math.floor(sec / 86400));
      hEl.textContent = pad2(Math.floor(sec % 86400 / 3600));
      mEl.textContent = pad2(Math.floor(sec % 3600 / 60));
      sEl.textContent = pad2(sec % 60);
    }
    tick();
    timer = setInterval(tick, 1000);
  }

  function init() { initBundle(); initOffer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
