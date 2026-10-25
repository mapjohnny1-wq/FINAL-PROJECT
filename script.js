(function () {
    'use strict';
    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Bộ Icon Vector SVG thuần (Không dùng Emoji) */
    var ICONS = {
        sun: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
        moon: '<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
        pin: '<svg class="svg-icon sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        tag: '<svg class="svg-icon sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
        clock: '<svg class="svg-icon sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        user: '<svg class="svg-icon sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        volume: '<svg class="svg-icon sm" viewBox="0 0 24 24" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
        stop: '<svg class="svg-icon sm" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
        drum: '<svg class="drum-pattern" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 4"/><circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="8 4"/><circle cx="100" cy="100" r="32" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M100 68 L106 90 L128 84 L112 100 L128 116 L106 110 L100 132 L94 110 L72 116 L88 100 L72 84 L94 90 Z" fill="currentColor" opacity="0.45"/></svg>'
    };

    /* 1. Chế độ Sáng / Tối (Theme Toggle bằng SVG) */
    var savedTheme = '';
    try { savedTheme = localStorage.getItem('disan-theme') || ''; } catch (e) {}
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    function updateThemeBtn(btn) {
        if (!btn) return;
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        btn.innerHTML = isDark ? ICONS.sun : ICONS.moon;
        btn.setAttribute('aria-label', isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
        btn.setAttribute('title', isDark ? 'Giao diện Sáng' : 'Giao diện Đêm phố cổ');
    }

    $$('.theme-toggle').forEach(function (btn) {
        updateThemeBtn(btn);
        btn.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            var next = isDark ? 'light' : 'dark';
            if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
            else document.documentElement.removeAttribute('data-theme');
            try { localStorage.setItem('disan-theme', next); } catch (e) {}
            $$('.theme-toggle').forEach(updateThemeBtn);
        });
    });

    /* Chèn hoa văn Trống Đồng SVG xoay nền vào Hero */
    var heroContainer = $('.hero') || $('.page-hero');
    if (heroContainer && !$('.drum-pattern', heroContainer)) {
        heroContainer.insertAdjacentHTML('beforeend', ICONS.drum);
    }

    /* 2. Con trỏ chuột Nghệ thuật (Custom Cursor) & Nút bấm Từ tính (Magnetic) */
    if (!reduce && window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var dot = document.createElement('div');
        dot.className = 'cursor-dot';
        var ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        }, { passive: true });

        (function animateCursor() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateCursor);
        })();

        document.addEventListener('mouseover', function (e) {
            if (e.target.closest('a, button, .heritage-card, .gallery-item, .feature, .quiz-opt')) {
                ring.classList.add('active');
            } else {
                ring.classList.remove('active');
            }
        });

        /* Hiệu ứng từ tính (Magnetic) nhẹ trên nút bấm */
        $$('.btn, .theme-toggle').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
                var dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
                el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    /* 3. Hiệu ứng Gợn sóng khi bấm nút (Ripple Effect) */
    document.addEventListener('click', function (e) {
        var target = e.target.closest('.btn, .chip');
        if (!target || reduce) return;
        var rect = target.getBoundingClientRect();
        var wave = document.createElement('span');
        wave.className = 'ripple-wave';
        var size = Math.max(rect.width, rect.height);
        wave.style.width = wave.style.height = size + 'px';
        wave.style.left = (e.clientX - rect.left - size / 2) + 'px';
        wave.style.top = (e.clientY - rect.top - size / 2) + 'px';
        target.appendChild(wave);
        setTimeout(function () {
            if (wave.parentNode) wave.parentNode.removeChild(wave);
        }, 650);
    });

    /* 4. Thanh tiến trình, Header dính & Nút lên đầu trang */
    var progress = $('.progress'), header = $('.header'), toTop = $('.to-top');
    function onScroll() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        if (header) header.classList.toggle('scrolled', h.scrollTop > 20);
        if (toTop) toTop.classList.toggle('show', h.scrollTop > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* 5. Menu di động */
    var burger = $('.burger'), nav = $('.nav');
    function closeMenu() {
        if (!burger || !nav) return;
        burger.classList.remove('open');
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
    }
    if (burger && nav) {
        burger.addEventListener('click', function () {
            var open = burger.classList.toggle('open');
            nav.classList.toggle('open', open);
            document.body.classList.toggle('menu-open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
        document.addEventListener('click', function (e) {
            if (document.body.classList.contains('menu-open') && !nav.contains(e.target) && !burger.contains(e.target)) {
                closeMenu();
            }
        });
        window.addEventListener('resize', function () { if (innerWidth > 920) closeMenu(); });
    }

    /* 6. Hiệu ứng hiện dần khi cuộn tới (IntersectionObserver) */
    var reveals = $$('.reveal');
    if ('IntersectionObserver' in window && !reduce) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    /* 7. Hiệu ứng đếm số thống kê */
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
            entries.forEach(function (en) {
                if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); }
            });
        }, { threshold: 0.45 });
        counters.forEach(function (c) { co.observe(c); });
    } else {
        counters.forEach(countUp);
    }

    /* 8. Chữ gõ tự động ở Hero */
    var typed = $('.typed');
    if (typed) {
        var words = (typed.getAttribute('data-words') || '').split('|').filter(Boolean);
        if (words.length && !reduce) {
            var wi = 0, ci = 0, del = false;
            (function tick() {
                var w = words[wi];
                typed.textContent = w.slice(0, ci);
                if (!del && ci < w.length) { ci++; setTimeout(tick, 85); }
                else if (!del) { del = true; setTimeout(tick, 1700); }
                else if (ci > 0) { ci--; setTimeout(tick, 40); }
                else { del = false; wi = (wi + 1) % words.length; setTimeout(tick, 280); }
            })();
        } else if (words.length) {
            typed.textContent = words[0];
        }
    }

    /* 9. Đốm sáng đèn lồng bay lơ lửng & Kết nối tia sáng trên Hero (Canvas) */
    var heroEl = $('.hero');
    if (heroEl && !reduce) {
        var canvas = document.createElement('canvas');
        canvas.className = 'hero-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        heroEl.insertBefore(canvas, heroEl.firstChild);
        var ctx = canvas.getContext('2d');
        var w = 0, h = 0, particles = [];
        function resizeCanvas() {
            w = canvas.width = heroEl.offsetWidth;
            h = canvas.height = heroEl.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
        for (var i = 0; i < 32; i++) {
            particles.push({
                x: Math.random() * (w || 1200),
                y: Math.random() * (h || 700),
                r: Math.random() * 2.8 + 1.1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -Math.random() * 0.48 - 0.15,
                a: Math.random() * 0.65 + 0.25
            });
        }
        (function drawParticles() {
            ctx.clearRect(0, 0, w, h);
            for (var j = 0; j < particles.length; j++) {
                var pt = particles[j];
                pt.x += pt.vx;
                pt.y += pt.vy;
                if (pt.y < -10) { pt.y = h + 10; pt.x = Math.random() * w; }
                if (pt.x < -10) pt.x = w + 10;
                if (pt.x > w + 10) pt.x = -10;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 217, 150, ' + pt.a + ')';
                ctx.fill();
            }
            requestAnimationFrame(drawParticles);
        })();
    }

    /* 10. Hiệu ứng Spotlight & Nghiêng 3D khi rê chuột */
    if (!reduce && window.matchMedia && matchMedia('(hover: hover)').matches) {
        $$('.heritage-card, .feature, .stat').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var mx = e.clientX - r.left;
                var my = e.clientY - r.top;
                card.style.setProperty('--mx', mx + 'px');
                card.style.setProperty('--my', my + 'px');
                if (card.classList.contains('heritage-card')) {
                    var x = mx / r.width - 0.5;
                    var y = my / r.height - 0.5;
                    card.style.transform = 'perspective(950px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-6px)';
                }
            });
            card.addEventListener('mouseleave', function () {
                if (card.classList.contains('heritage-card')) {
                    card.style.transform = '';
                }
            });
        });

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

    /* 11. Bộ lọc & Tìm kiếm trực tiếp trên trang Di sản */
    var chips = $$('.filters .chip');
    var searchInput = $('#heritage-search');
    var filterStatus = $('#filter-count');
    var activeFilter = 'all';

    function filterHeritageCards() {
        var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var visibleCount = 0;
        $$('.heritage-grid .heritage-card').forEach(function (card) {
            var catMatch = activeFilter === 'all' || card.getAttribute('data-cat') === activeFilter;
            var text = card.textContent.toLowerCase();
            var searchMatch = !q || text.indexOf(q) !== -1;
            var show = catMatch && searchMatch;
            card.classList.toggle('hide', !show);
            if (show) {
                visibleCount++;
                card.classList.add('in');
            }
        });
        if (filterStatus) {
            filterStatus.textContent = visibleCount > 0
                ? 'Đang hiển thị ' + visibleCount + ' địa điểm di sản phù hợp.'
                : 'Không tìm thấy di sản nào khớp với từ khóa của bạn.';
        }
    }

    if (chips.length) {
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (c) { c.classList.remove('active'); });
                chip.classList.add('active');
                activeFilter = chip.getAttribute('data-filter') || 'all';
                filterHeritageCards();
            });
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterHeritageCards);
    }

    /* 12. Bản đồ tương tác + Bộ lọc vùng miền */
    var mapFrame = $('#map-frame');
    if (mapFrame) {
        var cap = $('#map-name'), capDesc = $('#map-desc'), gmapLink = $('#map-gmap'), storyLink = $('#map-story');
        $$('.map-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lat = parseFloat(btn.getAttribute('data-lat')), lon = parseFloat(btn.getAttribute('data-lon'));
                var d = parseFloat(btn.getAttribute('data-zoom')) || 0.03;
                var bbox = [lon - d, lat - d * 0.6, lon + d, lat + d * 0.6].join('%2C');
                mapFrame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + bbox + '&layer=mapnik&marker=' + lat + '%2C' + lon;
                $$('.map-item').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                if (cap) cap.textContent = btn.getAttribute('data-name');
                if (capDesc) capDesc.textContent = btn.getAttribute('data-desc');
                if (gmapLink) gmapLink.href = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon;
                if (storyLink && btn.getAttribute('data-story')) storyLink.href = btn.getAttribute('data-story');
            });
        });

        var regionChips = $$('.map-filter-bar .chip');
        regionChips.forEach(function (rc) {
            rc.addEventListener('click', function () {
                regionChips.forEach(function (c) { c.classList.remove('active'); });
                rc.classList.add('active');
                var reg = rc.getAttribute('data-region') || 'all';
                var firstVisible = null;
                $$('.map-item').forEach(function (item) {
                    var match = reg === 'all' || item.getAttribute('data-region') === reg;
                    item.classList.toggle('hide', !match);
                    if (match && !firstVisible) firstVisible = item;
                });
                if (firstVisible) firstVisible.click();
            });
        });
    }

    /* 13. Hộp thoại Xem nhanh (Modal Lightbox bằng SVG) */
    var modalBackdrop = $('.modal-backdrop');
    if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'modal-backdrop';
        modalBackdrop.setAttribute('role', 'dialog');
        modalBackdrop.setAttribute('aria-modal', 'true');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        modalBackdrop.innerHTML =
            '<div class="modal-box">' +
                '<button class="modal-close" aria-label="Đóng hộp thoại">×</button>' +
                '<img class="modal-img" src="" alt="">' +
                '<div class="modal-body">' +
                    '<div class="modal-meta"></div>' +
                    '<h3 class="modal-title"></h3>' +
                    '<p class="modal-desc"></p>' +
                    '<div class="hero-buttons"><a href="ban-do.html" class="btn btn-dark btn-sm modal-map-btn">Xem trên bản đồ</a><a href="cau-chuyen.html" class="btn btn-primary btn-sm modal-story-btn">Đọc câu chuyện →</a></div>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modalBackdrop);
    }

    var modalClose = $('.modal-close', modalBackdrop);
    function closeModal() {
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
    });

    function openModal(data) {
        $('.modal-img', modalBackdrop).src = data.img || '';
        $('.modal-img', modalBackdrop).alt = data.title || '';
        $('.modal-title', modalBackdrop).textContent = data.title || '';
        $('.modal-desc', modalBackdrop).textContent = data.desc || '';
        var metaHtml = '';
        if (data.tag) metaHtml += '<span>' + ICONS.tag + ' ' + data.tag + '</span>';
        if (data.loc) metaHtml += '<span>' + ICONS.pin + ' ' + data.loc + '</span>';
        if (data.era) metaHtml += '<span>' + ICONS.clock + ' ' + data.era + '</span>';
        $('.modal-meta', modalBackdrop).innerHTML = metaHtml;
        var storyBtn = $('.modal-story-btn', modalBackdrop);
        if (storyBtn) storyBtn.href = data.link || 'cau-chuyen.html';
        modalBackdrop.classList.add('open');
        modalBackdrop.setAttribute('aria-hidden', 'false');
    }

    $$('.heritage-card').forEach(function (card) {
        var quickBtn = $('.quick-btn', card);
        if (quickBtn) {
            quickBtn.addEventListener('click', function () {
                var imgEl = $('img', card);
                var titleEl = $('h3', card);
                var descEl = $('.card-content p', card);
                var tagEl = $('.tag', card);
                var locEl = $('.loc', card);
                var eraEl = $('.era-badge', card);
                var linkEl = $('.text-link', card);
                openModal({
                    img: imgEl ? imgEl.src : '',
                    title: titleEl ? titleEl.textContent : '',
                    desc: card.getAttribute('data-detail') || (descEl ? descEl.textContent : ''),
                    tag: tagEl ? tagEl.textContent.trim() : '',
                    loc: locEl ? locEl.textContent.trim() : '',
                    era: eraEl ? eraEl.textContent.trim() : '',
                    link: linkEl ? linkEl.getAttribute('href') : 'cau-chuyen.html'
                });
            });
        }
    });

    $$('.gallery-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var imgEl = $('img', item);
            var tagEl = $('.gallery-overlay span', item);
            var titleEl = $('.gallery-overlay h3', item);
            var descEl = $('.gallery-overlay p', item);
            openModal({
                img: imgEl ? imgEl.src : '',
                title: titleEl ? titleEl.textContent : '',
                desc: descEl ? descEl.textContent : '',
                tag: tagEl ? tagEl.textContent : 'Tư liệu di sản',
                loc: item.getAttribute('data-loc') || 'Việt Nam',
                link: 'di-san.html'
            });
        });
    });

    /* 14. Trình đọc Âm thanh câu chuyện (Web Speech API) */
    if ('speechSynthesis' in window) {
        $$('.story').forEach(function (story) {
            var btn = $('.speak-btn', story);
            if (!btn) return;
            btn.addEventListener('click', function () {
                var synth = window.speechSynthesis;
                if (btn.classList.contains('playing')) {
                    synth.cancel();
                    btn.classList.remove('playing');
                    btn.innerHTML = ICONS.volume + ' Nghe đọc';
                    return;
                }
                synth.cancel();
                $$('.speak-btn.playing').forEach(function (b) {
                    b.classList.remove('playing');
                    b.innerHTML = ICONS.volume + ' Nghe đọc';
                });
                var title = ($('h3', story) || {}).textContent || '';
                var body = ($('p', story) || {}).textContent || '';
                var utter = new SpeechSynthesisUtterance(title + '. ' + body);
                utter.lang = 'vi-VN';
                utter.rate = 1.0;
                utter.onend = function () {
                    btn.classList.remove('playing');
                    btn.innerHTML = ICONS.volume + ' Nghe đọc';
                };
                btn.classList.add('playing');
                btn.innerHTML = ICONS.stop + ' Dừng đọc';
                synth.speak(utter);
            });
        });
    }

    /* 15. Trò chơi tương tác: Thử tài Di sản Việt (#quiz-widget) */
    var quizBox = $('#quiz-widget');
    if (quizBox) {
        var questions = [
            {
                q: 'Trường đại học đầu tiên của Việt Nam được thành lập vào năm 1076 dưới triều đại nhà Lý là di tích nào?',
                opts: ['Hoàng thành Thăng Long', 'Văn Miếu – Quốc Tử Giám', 'Kinh thành Huế', 'Thánh địa Mỹ Sơn'],
                ans: 1,
                note: 'Chính xác! Quốc Tử Giám được lập năm 1076 bên cạnh Văn Miếu, nơi lưu giữ 82 bia Tiến sĩ.'
            },
            {
                q: 'Cụm đền tháp cổ nào tại Quảng Nam nổi tiếng với kỹ thuật xây gạch nung không lộ mạch vữa của người Chăm Pa?',
                opts: ['Thánh địa Mỹ Sơn', 'Chùa Cầu Hội An', 'Tháp Phổ Minh', 'Thành nhà Hồ'],
                ans: 0,
                note: 'Tuyệt vời! Thánh địa Mỹ Sơn quy tụ hơn 70 đền tháp Chăm Pa cổ từ thế kỷ IV đến XIII.'
            },
            {
                q: 'Di sản nào tại Ninh Bình được UNESCO công nhận là Di sản Thế giới hỗn hợp (cả Văn hóa và Thiên nhiên) đầu tiên của Việt Nam?',
                opts: ['Vịnh Hạ Long', 'Phong Nha – Kẻ Bàng', 'Quần thể danh thắng Tràng An', 'Cao nguyên đá Đồng Văn'],
                ans: 2,
                note: 'Đúng rồi! Danh thắng Tràng An được UNESCO vinh danh Di sản kép vào năm 2014.'
            },
            {
                q: 'Làng nghề truyền thống hơn 700 năm tuổi nằm bên tả ngạn sông Hồng (Gia Lâm, Hà Nội) nổi danh với sản phẩm nào?',
                opts: ['Tranh dân gian Đông Hồ', 'Nón bài thơ Phú Cam', 'Gốm sứ Bát Tràng', 'Đúc đồng Ngũ Xã'],
                ans: 2,
                note: 'Xuất sắc! Làng gốm Bát Tràng nổi tiếng với các dòng gốm men lam, men ngọc, men rạn.'
            }
        ];
        var qi = 0, score = 0;
        var stepEl = $('.quiz-step', quizBox);
        var scoreEl = $('.quiz-score', quizBox);
        var qEl = $('.quiz-q', quizBox);
        var optsEl = $('.quiz-options', quizBox);
        var msgEl = $('.quiz-msg', quizBox);
        var nextBtn = $('.quiz-next', quizBox);

        function renderQuiz() {
            var item = questions[qi];
            stepEl.textContent = 'Câu hỏi ' + (qi + 1) + ' / ' + questions.length;
            scoreEl.textContent = 'Điểm: ' + score + '/' + questions.length;
            qEl.textContent = item.q;
            msgEl.textContent = 'Chọn một đáp án bên trên để kiểm tra.';
            nextBtn.style.display = 'none';
            optsEl.innerHTML = item.opts.map(function (opt, idx) {
                return '<button type="button" class="quiz-opt" data-idx="' + idx + '">' + opt + '</button>';
            }).join('');
            $$('.quiz-opt', optsEl).forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var chosen = parseInt(btn.getAttribute('data-idx'), 10);
                    $$('.quiz-opt', optsEl).forEach(function (b, bi) {
                        b.disabled = true;
                        if (bi === item.ans) b.classList.add('correct');
                    });
                    if (chosen === item.ans) {
                        score++;
                        msgEl.textContent = item.note;
                    } else {
                        btn.classList.add('wrong');
                        msgEl.textContent = 'Chưa chính xác. ' + item.note;
                    }
                    scoreEl.textContent = 'Điểm: ' + score + '/' + questions.length;
                    nextBtn.textContent = qi < questions.length - 1 ? 'Câu tiếp theo →' : 'Chơi lại từ đầu';
                    nextBtn.style.display = 'inline-flex';
                });
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                if (qi < questions.length - 1) {
                    qi++;
                } else {
                    qi = 0;
                    score = 0;
                }
                renderQuiz();
            });
        }
        renderQuiz();
    }

    /* 16. Accordion */
    $$('.acc-item').forEach(function (item) {
        var btn = $('.acc-btn', item), panel = $('.acc-panel', item);
        if (!btn || !panel) return;
        btn.addEventListener('click', function () {
            var open = item.classList.toggle('open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
        });
    });

    /* 17. Biểu mẫu đóng góp & Hiển thị đóng góp cộng đồng (Không dùng Emoji) */
    var toast = $('.toast');
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(showToast.t);
        showToast.t = setTimeout(function () { toast.classList.remove('show'); }, 4000);
    }

    var communityGrid = $('#community-list');
    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (m) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
        });
    }

    function renderCommunityContributions() {
        if (!communityGrid) return;
        var list = [];
        try { list = JSON.parse(localStorage.getItem('disan-contrib') || '[]'); } catch (e) {}
        if (!list.length) {
            communityGrid.innerHTML =
                '<article class="heritage-card in">' +
                    '<div class="card-img">' +
                        '<img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=75" alt="Chùa Cầu Hội An" loading="lazy">' +
                        '<span class="tag">Cộng đồng đóng góp</span>' +
                        '<span class="loc">' + ICONS.pin + ' Quảng Nam</span>' +
                    '</div>' +
                    '<div class="card-content">' +
                        '<h3>Chùa Cầu (Lai Viễn Kiều)</h3>' +
                        '<p>Biểu tượng giao lưu văn hóa hơn 400 năm tuổi bắc qua nhánh sông nhỏ giữa lòng phố cổ.</p>' +
                        '<div class="card-actions"><span class="text-link">' + ICONS.user + ' Nhóm Học sinh Lớp 12A</span></div>' +
                    '</div>' +
                '</article>';
            return;
        }
        communityGrid.innerHTML = list.slice().reverse().map(function (item) {
            var img = item['image-link'] && item['image-link'].trim()
                ? escapeHtml(item['image-link'])
                : 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=75';
            return (
                '<article class="heritage-card in">' +
                    '<div class="card-img">' +
                        '<img src="' + img + '" alt="' + escapeHtml(item['place-name']) + '" loading="lazy">' +
                        '<span class="tag">' + escapeHtml(item['category'] || 'Di sản địa phương') + '</span>' +
                        '<span class="loc">' + ICONS.pin + ' ' + escapeHtml(item['address'] || 'Việt Nam') + '</span>' +
                    '</div>' +
                    '<div class="card-content">' +
                        '<h3>' + escapeHtml(item['place-name']) + '</h3>' +
                        '<p>' + escapeHtml(item['story-content']) + '</p>' +
                        '<div class="card-actions"><span class="text-link">' + ICONS.user + ' Đóng góp bởi: ' + escapeHtml(item['author'] || 'Bạn đọc') + '</span></div>' +
                    '</div>' +
                '</article>'
            );
        }).join('');
    }
    renderCommunityContributions();

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
            } catch (err) {}
            form.reset();
            renderCommunityContributions();
            showToast('Cảm ơn bạn! Di sản đã được hiển thị ngay bên dưới.');
        });
    }
})();
