(function () {
    'use strict';
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Thanh tiến trình, header, nút lên đầu trang */
    var progress = $('.progress'), header = $('.header'), toTop = $('.to-top');
    function onScroll() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        if (header) header.classList.toggle('scrolled', h.scrollTop > 20);
        if (toTop) toTop.classList.toggle('show', h.scrollTop > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    /* Menu di động */
    var burger = $('.burger'), nav = $('.nav');
    function closeMenu() {
        if (!burger) return;
        burger.classList.remove('open'); nav.classList.remove('open');
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
    }
    if (burger && nav) {
        burger.addEventListener('click', function () {
            var open = burger.classList.toggle('open');
            nav.classList.toggle('open', open);
            document.body.classList.toggle('menu-open', open);
            burger.setAttribute('aria-expanded', open);
        });
        $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
        document.addEventListener('click', function (e) {
            if (document.body.classList.contains('menu-open') && !nav.contains(e.target) && !burger.contains(e.target)) closeMenu();
        });
        window.addEventListener('resize', function () { if (innerWidth > 860) closeMenu(); });
    }

    /* Hiện dần khi cuộn tới */
    var reveals = $$('.reveal');
    if ('IntersectionObserver' in window && !reduce) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* Đếm số */
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduce) { el.textContent = target + suffix; return; }
        var start = null, dur = 1800;
        function step(t) {
            if (start === null) start = t;
            var p = Math.min((t - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    var counters = $$('[data-count]');
    if ('IntersectionObserver' in window) {
        var co = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
        }, { threshold: 0.5 });
        counters.forEach(function (c) { co.observe(c); });
    } else counters.forEach(countUp);

    /* Chữ gõ tự động ở hero */
    var typed = $('.typed');
    if (typed) {
        var words = (typed.getAttribute('data-words') || '').split('|').filter(Boolean);
        if (words.length && !reduce) {
            var wi = 0, ci = 0, del = false;
            (function tick() {
                var w = words[wi];
                typed.textContent = w.slice(0, ci);
                if (!del && ci < w.length) { ci++; setTimeout(tick, 90); }
                else if (!del) { del = true; setTimeout(tick, 1600); }
                else if (ci > 0) { ci--; setTimeout(tick, 45); }
                else { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 300); }
            })();
        } else if (words.length) typed.textContent = words[0];
    }

    /* Nghiêng 3D khi rê chuột lên thẻ (chỉ trên thiết bị có chuột) */
    if (!reduce && window.matchMedia && matchMedia('(hover: hover)').matches) {
        $$('.heritage-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function () { card.style.transform = ''; });
        });
        /* Parallax cho các quả cầu nền */
        var orbs = $$('.orb');
        if (orbs.length) {
            window.addEventListener('mousemove', function (e) {
                var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
                orbs.forEach(function (o, i) {
                    var k = (i + 1) * 14;
                    o.style.translate = (x * k) + 'px ' + (y * k) + 'px';
                });
            }, { passive: true });
        }
    }

    /* Bộ lọc di sản */
    var chips = $$('.chip');
    if (chips.length) {
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (c) { c.classList.remove('active'); });
                chip.classList.add('active');
                var f = chip.getAttribute('data-filter');
                $$('.heritage-card').forEach(function (card) {
                    var show = f === 'all' || card.getAttribute('data-cat') === f;
                    card.classList.toggle('hide', !show);
                    if (show) { card.classList.remove('in'); void card.offsetWidth; card.classList.add('in'); }
                });
            });
        });
    }

    /* Bản đồ tương tác */
    var mapFrame = $('#map-frame');
    if (mapFrame) {
        var cap = $('#map-name'), capDesc = $('#map-desc');
        $$('.map-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lat = parseFloat(btn.getAttribute('data-lat')), lon = parseFloat(btn.getAttribute('data-lon'));
                var d = parseFloat(btn.getAttribute('data-zoom')) || 0.03;
                var bbox = [lon - d, lat - d * 0.6, lon + d, lat + d * 0.6].join('%2C');
                mapFrame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + lat + '%2C' + lon;
                $$('.map-item').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
                if (cap) cap.textContent = btn.getAttribute('data-name');
                if (capDesc) capDesc.textContent = btn.getAttribute('data-desc');
            });
        });
    }

    /* Accordion */
    $$('.acc-item').forEach(function (item) {
        var btn = $('.acc-btn', item), panel = $('.acc-panel', item);
        btn.addEventListener('click', function () {
            var open = item.classList.toggle('open');
            btn.setAttribute('aria-expanded', open);
            panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
        });
    });

    /* Biểu mẫu đóng góp (demo: lưu tạm trên trình duyệt) */
    var toast = $('.toast');
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg; toast.classList.add('show');
        clearTimeout(showToast.t);
        showToast.t = setTimeout(function () { toast.classList.remove('show'); }, 3800);
    }
    var form = $('.contribute-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                var list = JSON.parse(localStorage.getItem('disan-contrib') || '[]');
                var data = {};
                new FormData(form).forEach(function (v, k) { data[k] = v; });
                list.push(data);
                localStorage.setItem('disan-contrib', JSON.stringify(list));
            } catch (err) { /* bỏ qua nếu trình duyệt chặn localStorage */ }
            form.reset();
            showToast('Cảm ơn bạn! Thông tin đã được ghi nhận (bản demo).');
        });
    }
})();
