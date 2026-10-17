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

    /* ---------- H6 Reconocer: la cabecera fija nunca tapa el destino de un enlace ---------- */
    // Su alto cambia con el ancho (las secciones pueden ocupar dos filas): se mide en vivo.
    var header = document.querySelector('.site-header');

    if (header && 'ResizeObserver' in window) {
        new ResizeObserver(function () {
            root.style.setProperty('--header-h', header.offsetHeight + 'px');
        }).observe(header);
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

    /* ---------- Decoración «Bosque digital»: luz de luciérnaga que sigue al cursor ---------- */
    // Solo con ratón y si el usuario no pidió reducir el movimiento. Sin naturaleza.css el
    // elemento queda vacío e invisible. Se mueve con transform (no recalcula el diseño).
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (finePointer.matches && !calmMotion.matches) {
        var glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.setAttribute('aria-hidden', 'true');
        document.body.appendChild(glow);

        var glowFrame = 0;
        window.addEventListener('pointermove', function (e) {
            if (glowFrame) return;
            glowFrame = requestAnimationFrame(function () {
                glow.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
                glow.classList.add('is-active');
                glowFrame = 0;
            });
        }, { passive: true });

        document.documentElement.addEventListener('pointerleave', function () {
            glow.classList.remove('is-active');
        });
    }
})();
