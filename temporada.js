/* ==========================================================
   TEMPORADA — decoraciones que se prenden y apagan solas por fecha
   ----------------------------------------------------------
   · Diciembre: guirnalda de lucecitas en todas las páginas
                + "Nuestro primer año" en la página de inicio
   · Enero:     cartel "Cerrado por vacaciones" en todas las páginas,
                con botón para consultar fechas de febrero y marzo

   Para verlo antes de tiempo, agregá al final de la dirección:
     ?temporada=diciembre    o    ?temporada=enero
   ========================================================== */

(function () {
  /* ---------- DATOS PARA EDITAR ---------- */
  var CONFIG = {
    diciembreDesde: '12-01',   // mes-día en que aparece lo navideño
    diciembreHasta: '12-31',
    eneroDesde: '01-01',       // cartel de vacaciones
    eneroHasta: '01-31',
    vuelta: '2027-02-01',      // fecha en que vuelven a abrir
    vueltaTexto: 'el lunes 1° de febrero',
    // Números del primer año (cambiá solo el número o el texto)
    resumen: [
      { numero: 20, prefijo: '+', texto: 'encuentros realizados' },
      { numero: 10, prefijo: '+', texto: 'realizadores y empresas' },
      { numero: 10, prefijo: '',  texto: 'meses de puertas abiertas' }
    ],
    whatsapp: '5491162834000'
  };
  /* --------------------------------------- */

  var hoy = new Date();
  var md = ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
  var forzado = (location.search.match(/[?&]temporada=(diciembre|enero)/) || [])[1];
  var esDiciembre = forzado ? forzado === 'diciembre' : (md >= CONFIG.diciembreDesde && md <= CONFIG.diciembreHasta);
  var esEnero = forzado ? forzado === 'enero' : (md >= CONFIG.eneroDesde && md <= CONFIG.eneroHasta);
  if (!esDiciembre && !esEnero) return;

  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var waLink = function (texto) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  };

  var css = document.createElement('style');
  css.textContent = [
    /* Guirnalda */
    '.tp-guirnalda{position:absolute;left:0;top:100%;width:100%;height:34px;pointer-events:none;z-index:5;overflow:visible}',
    '.tp-guirnalda svg{display:block;width:100%;height:34px;overflow:visible}',
    '.tp-foco{animation:tpTitila 2.8s ease-in-out infinite}',
    '@keyframes tpTitila{0%,100%{opacity:1}50%{opacity:.35}}',
    /* Primer año */
    '.tp-anio{background:#173A2A;color:#FAF6EC;padding:56px 24px;text-align:center;position:relative;overflow:hidden}',
    '.tp-anio-in{max-width:960px;margin:0 auto;position:relative;z-index:1}',
    '.tp-eyebrow{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#FFC107}',
    '.tp-anio h2{font-family:"Bricolage Grotesque",sans-serif;font-size:clamp(26px,4vw,40px);line-height:1.1;letter-spacing:-.5px;margin:12px 0 36px;color:#FAF6EC}',
    '.tp-anio h2 em{color:#FFC107;font-style:normal}',
    '.tp-stats{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;margin-bottom:36px}',
    '.tp-stat{flex:1 1 200px;max-width:260px;border-top:1px solid rgba(250,246,236,.25);padding-top:16px}',
    '.tp-num{font-family:"Bricolage Grotesque",sans-serif;font-size:clamp(44px,6vw,64px);font-weight:700;line-height:1;color:#FFC107}',
    '.tp-txt{font-family:"Work Sans",sans-serif;font-size:14px;color:rgba(250,246,236,.8);margin-top:8px}',
    '.tp-brindis{font-family:"Bricolage Grotesque",sans-serif;font-size:20px;margin:0 0 10px}',
    '.tp-aviso{font-family:"Work Sans",sans-serif;font-size:14px;color:rgba(250,246,236,.75);margin:0}',
    '.tp-aviso a{color:#FFC107;font-weight:600}',
    '.tp-chispa{position:absolute;width:5px;height:5px;border-radius:50%;background:#FFC107;opacity:0;animation:tpChispa 4s ease-in-out infinite}',
    '@keyframes tpChispa{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:.8;transform:scale(1)}}',
    /* Cartel de vacaciones */
    '.tp-vac{position:fixed;left:20px;bottom:20px;z-index:2000;width:300px;background:#FAF6EC;border:1px solid rgba(23,58,42,.15);border-radius:10px;box-shadow:0 12px 32px rgba(23,58,42,.18);padding:0 20px 18px;text-align:center;font-family:"Work Sans",sans-serif;color:#173A2A;animation:tpEntra .6s ease-out}',
    '@keyframes tpEntra{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}',
    '.tp-cerrar{position:absolute;top:6px;right:8px;background:none;border:0;font-size:20px;line-height:1;color:#5A6660;cursor:pointer;padding:4px}',
    '.tp-playa{display:block;margin:14px auto 6px;overflow:visible}',
    '.tp-sombrilla{transform-origin:62px 96px;animation:tpViento 4s ease-in-out infinite}',
    '@keyframes tpViento{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}',
    '.tp-sol{transform-origin:150px 22px;animation:tpSol 6s ease-in-out infinite}',
    '@keyframes tpSol{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}',
    '.tp-titulo{font-family:"Bricolage Grotesque",sans-serif;font-weight:700;font-size:20px;line-height:1.15;margin:0 0 6px}',
    '.tp-titulo small{display:block;font-family:"JetBrains Mono",monospace;font-weight:500;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9C6B1F;margin-bottom:4px}',
    '.tp-vuelta{font-size:14px;margin:0 0 4px}',
    '.tp-faltan{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9C6B1F;margin:0 0 14px}',
    '.tp-btn{display:block;background:#173A2A;color:#FAF6EC;text-decoration:none;border-radius:6px;padding:11px 14px;font-size:13px;font-weight:600}',
    '.tp-btn:hover{background:#2C5A43}',
    '@media (max-width:700px){.tp-vac{left:12px;right:12px;bottom:12px;width:auto}.tp-anio{padding:44px 16px}.tp-stats{flex-wrap:nowrap;gap:10px}.tp-stat{flex:1 1 0}.tp-num{font-size:36px}.tp-txt{font-size:12px}}',
    '@media (prefers-reduced-motion:reduce){.tp-foco,.tp-sombrilla,.tp-sol,.tp-chispa,.tp-vac{animation:none}}'
  ].join('');
  document.head.appendChild(css);

  /* ================= DICIEMBRE ================= */
  if (esDiciembre) {
    // --- Guirnalda de lucecitas colgando del menú ---
    var header = document.querySelector('header');
    if (header) {
      if (getComputedStyle(header).position === 'static') header.style.position = 'relative';
      var guir = document.createElement('div');
      guir.className = 'tp-guirnalda';
      guir.setAttribute('aria-hidden', 'true');
      header.appendChild(guir);
      var colores = ['#FFC107', '#FFE9A8', '#F2A23A', '#FFF6DC'];
      var dibujar = function () {
        var w = header.offsetWidth || window.innerWidth;
        var tramos = Math.max(3, Math.round(w / 170));
        var paso = w / tramos, caida = 16;
        var d = 'M0,2', focos = '', n = 0;
        for (var i = 0; i < tramos; i++) {
          var x0 = i * paso, x1 = x0 + paso, cx = x0 + paso / 2;
          d += ' Q' + cx + ',' + (2 + caida * 2) + ' ' + x1 + ',2';
          for (var k = 1; k <= 4; k++) {
            var t = k / 5;
            var x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
            var y = (1 - t) * (1 - t) * 2 + 2 * (1 - t) * t * (2 + caida * 2) + t * t * 2;
            var c = colores[n % colores.length];
            var demora = ((n * 0.37) % 2.8).toFixed(2);
            focos += '<g class="tp-foco" style="animation-delay:' + demora + 's">' +
              '<rect x="' + (x - 1.5) + '" y="' + (y - 1) + '" width="3" height="3" fill="#3D2A1D"/>' +
              '<ellipse cx="' + x + '" cy="' + (y + 6) + '" rx="3.6" ry="5" fill="' + c + '"/>' +
              '<ellipse cx="' + x + '" cy="' + (y + 6) + '" rx="8" ry="9" fill="' + c + '" opacity=".18"/></g>';
            n++;
          }
        }
        guir.innerHTML = '<svg viewBox="0 0 ' + w + ' 34" preserveAspectRatio="none"><path d="' + d +
          '" fill="none" stroke="#3D2A1D" stroke-width="1.2" opacity=".7"/>' + focos + '</svg>';
      };
      dibujar();
      var espera;
      window.addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(dibujar, 200); });
    }

    // --- "Nuestro primer año" (solo en la página de inicio) ---
    var hero = document.getElementById('inicio');
    var sumario = document.querySelector('nav.sumario');
    if (hero && sumario) {
      var sec = document.createElement('section');
      sec.className = 'tp-anio';
      sec.setAttribute('aria-label', 'Nuestro primer año');
      var stats = CONFIG.resumen.map(function (s) {
        return '<div class="tp-stat"><div class="tp-num" data-n="' + s.numero + '" data-p="' + s.prefijo + '">' +
          s.prefijo + (calmo ? s.numero : 0) + '</div><div class="tp-txt">' + s.texto + '</div></div>';
      }).join('');
      var chispas = '';
      for (var j = 0; j < 14; j++) {
        chispas += '<span class="tp-chispa" style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' +
          (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 4).toFixed(2) + 's"></span>';
      }
      sec.innerHTML = chispas + '<div class="tp-anio-in">' +
        '<span class="tp-eyebrow">2026 · Nuestro primer año</span>' +
        '<h2>Gracias por hacer de Arcos V<br>un lugar de <em>encuentro</em></h2>' +
        '<div class="tp-stats">' + stats + '</div>' +
        '<p class="tp-brindis">Brindemos por un 2027 lleno de encuentros ✨</p>' +
        '<p class="tp-aviso">En enero nos tomamos vacaciones. Volvemos ' + CONFIG.vueltaTexto + ' — ' +
        '<a href="' + waLink('Hola! Quiero consultar una fecha en Arcos V para 2027.') + '" target="_blank" rel="noopener">ya podés consultar fechas para 2027</a>.</p>' +
        '</div>';
      sumario.parentNode.insertBefore(sec, sumario);

      // Los números suben cuando la sección aparece en pantalla
      if (!calmo && 'IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entradas) {
          entradas.forEach(function (e) {
            if (!e.isIntersecting) return;
            obs.disconnect();
            sec.querySelectorAll('.tp-num').forEach(function (el) {
              var fin = +el.dataset.n, p = el.dataset.p, t0 = null;
              var paso = function (ts) {
                if (!t0) t0 = ts;
                var avance = Math.min(1, (ts - t0) / 1600);
                el.textContent = p + Math.round(fin * (1 - Math.pow(1 - avance, 3)));
                if (avance < 1) requestAnimationFrame(paso);
              };
              requestAnimationFrame(paso);
            });
          });
        }, { threshold: 0.4 });
        obs.observe(sec);
      } else {
        sec.querySelectorAll('.tp-num').forEach(function (el) { el.textContent = el.dataset.p + el.dataset.n; });
      }
    }
  }

  /* ================= ENERO ================= */
  if (esEnero) {
    var clave = 'tpVacCerrado';
    var yaCerrado = false;
    try { yaCerrado = sessionStorage.getItem(clave) === '1'; } catch (e) {}
    if (!yaCerrado) {
      var vuelta = new Date(CONFIG.vuelta + 'T00:00:00');
      var faltan = Math.ceil((vuelta - new Date()) / 86400000);
      var faltanTxt = faltan > 1 ? 'Faltan ' + faltan + ' días' : (faltan === 1 ? '¡Falta 1 día!' : '');
      var vac = document.createElement('aside');
      vac.className = 'tp-vac';
      vac.setAttribute('role', 'note');
      vac.innerHTML =
        '<button class="tp-cerrar" aria-label="Cerrar aviso">×</button>' +
        '<svg class="tp-playa" width="190" height="110" viewBox="0 0 190 110" aria-hidden="true">' +
        '<circle class="tp-sol" cx="150" cy="22" r="12" fill="#FFC107"/>' +
        '<path d="M0,100 Q95,90 190,100 L190,110 L0,110 Z" fill="#F0E8D5"/>' +
        '<g class="tp-sombrilla">' +
        '<line x1="62" y1="28" x2="62" y2="100" stroke="#3D2A1D" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M14,40 Q62,-4 110,40 Z" fill="#173A2A"/>' +
        '<path d="M38,40 Q50,8 62,18 Q74,8 86,40 Z" fill="#FAF6EC"/>' +
        '<path d="M50,40 Q56,14 62,18 Q68,14 74,40 Z" fill="#FFC107"/>' +
        '<path d="M14,40 Q20,46 26,40 Q32,46 38,40 Q44,46 50,40 Q56,46 62,40 Q68,46 74,40 Q80,46 86,40 Q92,46 98,40 Q104,46 110,40" fill="none" stroke="#173A2A" stroke-width="2"/>' +
        '<circle cx="62" cy="18" r="2.5" fill="#3D2A1D"/></g>' +
        '<g stroke="#6B4E3A" stroke-width="3" stroke-linecap="round" fill="none">' +
        '<line x1="104" y1="100" x2="146" y2="84"/><line x1="156" y1="100" x2="120" y2="84"/>' +
        '<line x1="118" y1="84" x2="168" y2="84"/><line x1="168" y1="84" x2="178" y2="58"/></g>' +
        '<path d="M110,84 L168,84 L177,60 L171,58 L163,80 L112,80 Z" fill="#FFC107" opacity=".9"/>' +
        '<path d="M126,80 L134,80 L134,84 L126,84 Z M144,80 L152,80 L152,84 L144,84 Z" fill="#FAF6EC"/>' +
        '</svg>' +
        '<p class="tp-titulo"><small>Arcos V</small>Cerrado por vacaciones</p>' +
        '<p class="tp-vuelta">Volvemos <strong>' + CONFIG.vueltaTexto + '</strong></p>' +
        (faltanTxt ? '<p class="tp-faltan">' + faltanTxt + '</p>' : '') +
        '<a class="tp-btn" target="_blank" rel="noopener" href="' +
        waLink('Hola! Vi que están de vacaciones. Quiero consultar una fecha para febrero/marzo en Arcos V.') +
        '">Consultá fechas para febrero y marzo</a>';
      vac.querySelector('.tp-cerrar').addEventListener('click', function () {
        vac.remove();
        try { sessionStorage.setItem(clave, '1'); } catch (e) {}
      });
      document.body.appendChild(vac);
    }
  }
})();
