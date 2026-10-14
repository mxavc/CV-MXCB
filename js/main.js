/* =========================================================
   Mejoras progresivas. Si este archivo no carga, todo el
   contenido sigue visible y navegable (ver .no-js en CSS).
   Cada bloque indica la heurística de Nielsen que atiende.
   ========================================================= */
(function () {
    'use strict';

    var root = document.documentElement;

    /* ---------- H3 Control y libertad: tema claro/oscuro reversible ---------- */
    var themeBtn = document.getElementById('theme-toggle');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function systemTheme() {
        return systemDark.matches ? 'dark' : 'light';
    }

    function activeTheme() {
        return root.getAttribute('data-theme') || systemTheme();
    }

    function renderTheme() {
        var current = activeTheme();
        var next = current === 'dark' ? 'claro' : 'oscuro';
        root.setAttribute('data-theme-active', current);
        if (themeBtn) {
            themeBtn.querySelector('.theme-label').textContent = 'Modo ' + next;
            themeBtn.setAttribute('aria-label', 'Cambiar a modo ' + next);
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var next = activeTheme() === 'dark' ? 'light' : 'dark';
            // Si la elección coincide con el sistema, se vuelve a "seguir al sistema".
            try {
                if (next === systemTheme()) {
                    root.removeAttribute('data-theme');
                    localStorage.removeItem('tema');
                } else {
                    root.setAttribute('data-theme', next);
                    localStorage.setItem('tema', next);
                }
            } catch (e) {
                root.setAttribute('data-theme', next);
            }
            renderTheme();
        });
    }

    if (systemDark.addEventListener) {
        systemDark.addEventListener('change', renderTheme);
    }
    renderTheme();

    /* ---------- H3 Control y libertad: menú móvil (Esc / clic fuera) ---------- */
    var menuBtn = document.querySelector('.menu-toggle');
    var menuPanel = document.getElementById('menu-principal');

    function setMenu(open, returnFocus) {
        if (!menuBtn || !menuPanel) return;
        menuBtn.setAttribute('aria-expanded', String(open));
        menuPanel.classList.toggle('is-open', open);
        menuBtn.querySelector('.menu-toggle-label').textContent = open ? 'Cerrar' : 'Menú';
        if (!open && returnFocus) menuBtn.focus();
    }

    function menuIsOpen() {
        return menuBtn && menuBtn.getAttribute('aria-expanded') === 'true';
    }

    if (menuBtn && menuPanel) {
        menuBtn.addEventListener('click', function () {
            setMenu(!menuIsOpen(), false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuIsOpen()) setMenu(false, true);
        });

        document.addEventListener('click', function (e) {
            if (menuIsOpen() && !menuPanel.contains(e.target) && !menuBtn.contains(e.target)) {
                setMenu(false, false);
            }
        });

        menuPanel.addEventListener('click', function (e) {
            if (e.target.closest('.nav-link')) setMenu(false, false);
        });

        // Al pasar a escritorio el panel siempre es visible: resetea el estado.
        window.matchMedia('(min-width: 72rem)').addEventListener('change', function (mq) {
            if (mq.matches) setMenu(false, false);
        });
    }

    /* ---------- H1 Visibilidad del estado: sección activa en la navegación ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var sections = navLinks
        .map(function (link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);

    function markActive(id) {
        navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    if ('IntersectionObserver' in window && sections.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) markActive(entry.target.id);
            });
        }, { rootMargin: '-35% 0px -60% 0px' });
        sections.forEach(function (s) { observer.observe(s); });
    }

    /* ---------- H1 + H9: copiar email con feedback y alternativa ante error ---------- */
    var copyBtn = document.getElementById('copy-email');
    var copyStatus = document.getElementById('copy-status');
    var emailLink = document.getElementById('email');
    var statusTimer;

    function showStatus(msg, isError) {
        copyStatus.textContent = msg;
        copyStatus.classList.toggle('is-error', !!isError);
        clearTimeout(statusTimer);
        if (!isError) {
            statusTimer = setTimeout(function () { copyStatus.textContent = ''; }, 3000);
        }
    }

    function copyFailed() {
        // El email queda seleccionado y visible para copiarlo manualmente.
        var range = document.createRange();
        range.selectNodeContents(emailLink);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        showStatus('No se pudo copiar automáticamente. El email está seleccionado: pulsa Ctrl+C (⌘+C en Mac).', true);
    }

    if (copyBtn && copyStatus && emailLink) {
        copyBtn.addEventListener('click', function () {
            var text = copyBtn.getAttribute('data-copy');
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(function () {
                    showStatus('Copiado ✓', false);
                }, copyFailed);
            } else {
                copyFailed();
            }
        });
    }

    /* ---------- H7 Flexibilidad: imprimir / guardar como PDF ---------- */
    var printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function () {
            setMenu(false, false);
            window.print();
        });
    }

    /* ---------- H3 Control y libertad: "Volver arriba" aparece al bajar ---------- */
    var toTop = document.querySelector('.to-top');
    var ticking = false;

    function updateToTop() {
        toTop.classList.toggle('is-visible', window.scrollY > 600);
        ticking = false;
    }

    if (toTop) {
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateToTop);
                ticking = true;
            }
        }, { passive: true });
        updateToTop();
    }
})();
