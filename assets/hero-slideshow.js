(function () {
  var box = document.getElementById('dgHeroSlideshow');
  if (!box) return;
  var slides = box.querySelectorAll('.dg-hero-slide');
  var dots = box.querySelectorAll('.dg-hero-dot');
  if (!slides.length) return;
  var cur = 0;
  var timer = null;
  function show(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }
  function next() {
    show((cur + 1) % slides.length);
  }
  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 5000);
  }
  function pause() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      show(i);
      restart();
    });
  });
  box.addEventListener('mouseenter', pause);
  box.addEventListener('mouseleave', restart);
  restart();
})();
