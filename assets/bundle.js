/* ==========================================================================
   AR SERVICES — Bundle Builder (Phase C, 2026-10-20)
   Vanilla JS, zero dependencies. Loaded AFTER assets/app.js + assets/cart.js
   on tools.html and all product-*.html pages. Renders into every
   [data-bundle-builder] mount on the page.

   Data comes from PRODUCTS (assets/app.js) — the single source of truth.
   Selected plans are handed to the cart via ARCart.addBundle() with the
   bundle flag; the tiered discount itself is computed inside cart.js
   (pricing()) so drawer, checkout, WhatsApp message, website lead and the
   InitiateCheckout value all agree. This file only mirrors the same rules
   for the live preview:
     2 tools = 10% off · 3 tools = 15% off · 4+ tools = 20% off
     Margin protection: the CapCut 1 Month (1 Device) plan counts toward
     the tier but its price is excluded from the discountable amount.
     Discount rounds to whole rupees (Math.round).
   ========================================================================== */
(function () {
  'use strict';

  var NO_DISCOUNT_ITEM_ID = 'capcut-1-month-1device';

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
  function getProducts() {
    try { return (typeof PRODUCTS !== 'undefined' && PRODUCTS) ? PRODUCTS : []; } catch (e) { return []; }
  }
  function tierPct(count) { return count >= 4 ? 20 : (count === 3 ? 15 : (count === 2 ? 10 : 0)); }

  /* Purchasable plan variants for one product, using the same cart item
     ids/names as the rest of the site. Out-of-stock plans are skipped.
     A plan whose details mention device access (CapCut 1 Month) expands
     into its device variants at the product-page prices (1 Device = the
     plan price, 2 Devices = Rs 699, as shown on the CapCut page). */
  function planOptions(p) {
    var out = [];
    (p.plans || []).forEach(function (plan) {
      if (plan.outOfStock) return;
      var basePrice = parsePrice(plan.price);
      if (p.slug === 'capcut' && /device/i.test(plan.details || '')) {
        out.push({
          id: p.slug + '-' + slugify(plan.name) + '-1device',
          label: plan.name + ' — 1 Device',
          name: p.name + ' — ' + plan.name + ' (1 Device)',
          price: basePrice
        });
        out.push({
          id: p.slug + '-' + slugify(plan.name) + '-2device',
          label: plan.name + ' — 2 Devices',
          name: p.name + ' — ' + plan.name + ' (2 Devices)',
          price: 699
        });
        return;
      }
      out.push({
        id: p.slug + '-' + slugify(plan.name),
        label: plan.name,
        name: p.name + ' — ' + plan.name,
        price: basePrice
      });
    });
    return out;
  }

  function renderBuilder(mount) {
    if (mount.getAttribute('data-bb2-done')) return true;
    var products = getProducts();
    if (!products.length) return false;
    mount.setAttribute('data-bb2-done', '1');

    var toolsHtml = products.map(function (p) {
      var opts = planOptions(p);
      if (!opts.length) return '';
      var optionsHtml = opts.map(function (o) {
        return '<option value="' + escapeHtml(o.id) + '" data-price="' + o.price + '" data-name="' + escapeHtml(o.name) + '">' +
          escapeHtml(o.label) + ' — ' + fmt(o.price) + '</option>';
      }).join('');
      return '<div class="bb2-tool" data-bb2-tool>' +
        '<label class="bb2-tool-head"><input type="checkbox" class="bb2-check" data-bb2-check>' +
        '<span class="bb2-tool-name">' + escapeHtml(p.name) + '</span></label>' +
        '<select class="bb2-plan" data-bb2-plan aria-label="' + escapeHtml(p.name) + ' plan">' + optionsHtml + '</select></div>';
    }).join('');

    mount.innerHTML =
      '<div class="bb2-card">' +
        '<div class="bb2-head"><span class="bb2-badge">🎁 Bundle &amp; Save</span>' +
          '<h2 class="bb2-title">Build Your Own <span class="text-gradient">Bundle</span></h2>' +
          '<p class="bb2-sub">Tick 2 or more tools, choose a plan for each, and the bundle discount is applied automatically in your cart — <strong>10% on 2 tools, 15% on 3, 20% on 4 or more.</strong></p></div>' +
        '<div class="bb2-grid">' + toolsHtml + '</div>' +
        '<div class="bb2-summary">' +
          '<div class="bb2-row"><span>Tools selected</span><strong data-bb2-count>0</strong></div>' +
          '<div class="bb2-row"><span>Subtotal</span><strong data-bb2-subtotal>Rs 0</strong></div>' +
          '<div class="bb2-row bb2-discount" data-bb2-discount-row hidden><span data-bb2-discount-label>Bundle Discount</span><strong data-bb2-discount>−Rs 0</strong></div>' +
          '<div class="bb2-row bb2-grand"><span>Total</span><strong data-bb2-total>Rs 0</strong></div>' +
          '<button type="button" class="ar-btn-gradient bb2-add" data-bb2-add disabled>Add Bundle to Cart</button>' +
          '<p class="bb2-note" data-bb2-note>Select at least 1 tool. Add 2 or more tools to unlock the bundle discount.</p>' +
        '</div>' +
      '</div>';

    var countEl = $('[data-bb2-count]', mount);
    var subtotalEl = $('[data-bb2-subtotal]', mount);
    var discountRow = $('[data-bb2-discount-row]', mount);
    var discountLabel = $('[data-bb2-discount-label]', mount);
    var discountEl = $('[data-bb2-discount]', mount);
    var totalEl = $('[data-bb2-total]', mount);
    var addBtn = $('[data-bb2-add]', mount);
    var noteEl = $('[data-bb2-note]', mount);

    function selection() {
      var picked = [];
      $all('[data-bb2-tool]', mount).forEach(function (toolEl) {
        var check = $('[data-bb2-check]', toolEl);
        if (!check || !check.checked) return;
        var sel = $('[data-bb2-plan]', toolEl);
        var opt = sel.options[sel.selectedIndex];
        picked.push({
          id: opt.value,
          name: opt.getAttribute('data-name'),
          price: Number(opt.getAttribute('data-price')) || 0
        });
      });
      return picked;
    }

    function update() {
      var picked = selection();
      var count = picked.length;
      var subtotal = picked.reduce(function (s, x) { return s + x.price; }, 0);
      var pct = tierPct(count);
      var discountable = picked.reduce(function (s, x) {
        return s + (x.id === NO_DISCOUNT_ITEM_ID ? 0 : x.price);
      }, 0);
      var discount = pct ? Math.round(discountable * pct / 100) : 0;
      countEl.textContent = count;
      subtotalEl.textContent = fmt(subtotal);
      totalEl.textContent = fmt(subtotal - discount);
      discountRow.hidden = discount <= 0;
      if (discount > 0) {
        discountLabel.textContent = 'Bundle Discount (' + pct + '%)';
        discountEl.textContent = '−' + fmt(discount);
      }
      addBtn.disabled = count === 0;
      $all('[data-bb2-tool]', mount).forEach(function (toolEl) {
        var check = $('[data-bb2-check]', toolEl);
        toolEl.classList.toggle('bb2-on', !!(check && check.checked));
      });
      if (count === 0) {
        noteEl.textContent = 'Select at least 1 tool. Add 2 or more tools to unlock the bundle discount.';
      } else if (count === 1) {
        noteEl.textContent = 'Add 1 more tool to unlock a 10% bundle discount.';
      } else {
        var hasExcluded = picked.some(function (x) { return x.id === NO_DISCOUNT_ITEM_ID; });
        noteEl.textContent = 'Bundle discount of ' + pct + '% is applied in the cart.' +
          (hasExcluded ? ' Note: the CapCut 1 Device plan counts toward your bundle but is excluded from the discount.' : '');
      }
    }

    mount.addEventListener('change', update);
    addBtn.addEventListener('click', function () {
      var picked = selection();
      if (!picked.length) return;
      if (window.ARCart && ARCart.addBundle) {
        ARCart.addBundle(picked);
        ARCart.openDrawer();
      }
    });
    update();
    return true;
  }

  function init() {
    var mounts = $all('[data-bundle-builder]');
    if (!mounts.length) return;
    var tries = 0;
    (function attempt() {
      var pending = mounts.filter(function (m) { return !renderBuilder(m); });
      tries++;
      if (pending.length && tries < 24) setTimeout(attempt, 150);
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
