/* ==========================================================
   TEMPORADA — decoraciones que se prenden y apagan solas por fecha
   ----------------------------------------------------------
   · Noviembre: enredadera que crece con el scroll, a la derecha,
                solo en la página de inicio
   · Diciembre: guirnalda de lucecitas en todas las páginas
                + "Nuestro primer año" en la página de inicio
   · Enero:     cartel "Cerrado por vacaciones" en todas las páginas,
                con botón para consultar fechas de febrero y marzo

   Para verlo antes de tiempo, agregá al final de la dirección:
     ?temporada=noviembre  ·  ?temporada=diciembre  ·  ?temporada=enero
   ========================================================== */

(function () {
  /* ---------- DATOS PARA EDITAR ---------- */
  var CONFIG = {
    diciembreDesde: '12-01',   // mes-día en que aparece lo navideño
    diciembreHasta: '12-31',
    noviembreDesde: '11-01',   // enredadera (solo inicio)
    noviembreHasta: '11-30',
    eneroDesde: '01-01',       // cartel de vacaciones
    eneroHasta: '01-31',
    vuelta: '2027-02-01',      // fecha en que vuelven a abrir
    vueltaTexto: 'el lunes 1° de febrero',
    // Números del primer año (cambiá solo el número o el texto)
    // Fotos del año que aparecen en "Nuestro primer año" (llevan a la galería)
    fotosAnio: [
      { img: 'collage-nov26-grupo.webp', texto: 'Mujeres & collage' },
      { img: 'cata-ciegas-ago26-01.webp', texto: 'Cata a ciegas' },
      { img: 'resina-02.webp', texto: 'Taller de resina' },
      { img: 'foto-fija-materia-prima-camila.jpg', texto: 'Materia Prima' }
    ],
    resumen: [
      { numero: 40, prefijo: '+', texto: 'encuentros realizados' },
      { numero: 15, prefijo: '+', texto: 'realizadores y empresas' },
      { numero: 10, prefijo: '',  texto: 'meses de puertas abiertas' }
    ],
    whatsapp: '5491162834000'
  };
  /* --------------------------------------- */

  var hoy = new Date();
  var md = ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
  var forzado = (location.search.match(/[?&]temporada=(noviembre|diciembre|enero)/) || [])[1];
  var esDiciembre = forzado ? forzado === 'diciembre' : (md >= CONFIG.diciembreDesde && md <= CONFIG.diciembreHasta);
  var esEnero = forzado ? forzado === 'enero' : (md >= CONFIG.eneroDesde && md <= CONFIG.eneroHasta);
  var esNoviembre = forzado ? forzado === 'noviembre' : (md >= CONFIG.noviembreDesde && md <= CONFIG.noviembreHasta);
  var esInicio = /(^|\/)(index\.html)?$/.test(location.pathname);
  if (esNoviembre && esInicio) enredadera();
  if (!esDiciembre && !esEnero) return;

  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var waLink = function (texto) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  };

  var css = document.createElement('style');
  css.textContent = [
    /* Guirnalda */
    '.tp-guirnalda{position:absolute;left:0;top:100%;width:100%;pointer-events:none;z-index:5;overflow:visible}',
    '.tp-guirnalda svg{display:block;width:100%;overflow:visible}',
    '.tp-foco{animation:tpTitila 2.8s ease-in-out infinite}',
    '@keyframes tpTitila{0%,100%{opacity:1}50%{opacity:.35}}',
    /* Primer año — estilo editorial rústico */
    '.tp-anio{background:#173A2A;color:#FAF6EC;padding:96px 24px 90px;position:relative;overflow:hidden;border-bottom:6px solid #FFC107}',
    '.tp-anio::before{content:"";position:absolute;inset:14px;border:1px dashed rgba(250,246,236,.32);pointer-events:none}',
    '.tp-anio-in{max-width:1130px;margin:0 auto;position:relative;z-index:1}',
    '.tp-eyebrow{display:flex;align-items:center;gap:16px;font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:#FFC107}',
    '.tp-eyebrow::after{content:"";flex:1;height:1px;background:rgba(250,246,236,.25)}',
    '.tp-anio h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:clamp(40px,6.2vw,86px);line-height:.95;letter-spacing:-.04em;margin:22px 0 56px;color:#FAF6EC;max-width:900px;text-wrap:balance}',
    '.tp-anio h2 em{color:#FFC107;font-style:normal}',
    '.tp-sello{position:absolute;right:0;top:46px;width:150px;height:150px;border-radius:50%;border:2px dashed #FFC107;color:#FFC107;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transform:rotate(-12deg);font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;line-height:1.5}',
    '.tp-sello b{font-family:"Bricolage Grotesque",sans-serif;font-size:46px;letter-spacing:-.04em;line-height:1;font-weight:800}',
    '.tp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-bottom:56px;border-top:3px solid #FFC107;counter-reset:tps}',
    '.tp-stat{padding:22px 28px 0 0;counter-increment:tps}',
    '.tp-stat+.tp-stat{padding-left:28px;border-left:1px solid rgba(250,246,236,.2)}',
    '.tp-stat::before{content:"0" counter(tps);display:block;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:2px;color:rgba(250,246,236,.55);margin-bottom:14px}',
    '.tp-num{font-family:"Bricolage Grotesque",sans-serif;font-size:clamp(56px,7.5vw,104px);font-weight:800;letter-spacing:-.05em;line-height:.9;color:#FFC107}',
    '.tp-txt{font-family:"Work Sans",sans-serif;font-size:16px;color:rgba(250,246,236,.85);margin-top:12px}',
    '.tp-fotos{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;margin:0 0 22px}',
    '.tp-fotos a{position:relative;display:block;background:#FFFDF8;padding:8px 8px 0;text-decoration:none;color:#3D2A1D;transition:transform .25s}',
    '.tp-fotos a:nth-child(odd){transform:rotate(-1.6deg)}',
    '.tp-fotos a:nth-child(even){transform:rotate(1.2deg)}',
    '.tp-fotos a:hover{transform:rotate(0) translateY(-4px)}',
    '.tp-fotos a::before{content:"";position:absolute;top:-9px;left:50%;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:radial-gradient(circle at 35% 32%,#FFE9A3 0 16%,#FFC107 22% 62%,#E6AC00 100%);border:1px solid #B88600;box-shadow:1px 3px 3px rgba(0,0,0,.35)}',
    '.tp-fotos img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block}',
    '.tp-fotos span{display:block;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;padding:10px 2px 12px}',
    '.tp-ver{margin:0 0 48px}',
    '.tp-ver a{color:#FFC107;font-weight:600;text-decoration:none;border-bottom:2px solid #FFC107}',
    '@media (max-width:700px){.tp-fotos{grid-template-columns:1fr 1fr;gap:20px 14px}}',
    '.tp-pie{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap;border-top:1px solid rgba(250,246,236,.2);padding-top:28px}',
    '.tp-brindis{font-family:"Bricolage Grotesque",sans-serif;font-weight:700;font-size:clamp(22px,2.4vw,30px);letter-spacing:-.02em;line-height:1.15;margin:0;max-width:560px}',
    '.tp-aviso{font-family:"Work Sans",sans-serif;font-size:15px;line-height:1.6;color:rgba(250,246,236,.78);margin:0;max-width:420px}',
    '.tp-aviso a{display:inline-block;margin-top:14px;background:#FFC107;color:#173A2A;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:2px;box-shadow:4px 4px 0 rgba(0,0,0,.35);transition:transform .15s,box-shadow .15s}',
    '.tp-aviso a:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 rgba(0,0,0,.35)}',
    '.tp-chispa{position:absolute;color:#FFC107;font-size:12px;line-height:1;opacity:0;animation:tpChispa 4s ease-in-out infinite}',
    '.tp-chispa::before{content:"✦"}',
    '@keyframes tpChispa{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:.7;transform:scale(1) rotate(45deg)}}',
    /* Cartel de vacaciones — papel sostenido con una chinche */
    '.tp-vac{position:fixed;right:28px;bottom:28px;z-index:2000;width:300px;background:#F5F4F0;border:1px solid rgba(61,42,29,.35);border-radius:2px;box-shadow:6px 6px 0 rgba(61,42,29,.85);padding:6px 20px 20px;text-align:center;font-family:"Work Sans",sans-serif;color:#173A2A;transform:rotate(-1.2deg);animation:tpEntra .6s ease-out}',
    '.tp-vac::before{content:"📌";position:absolute;top:-20px;left:50%;font-size:32px;line-height:1;transform:translateX(-50%) rotate(-12deg);filter:drop-shadow(1px 3px 2px rgba(61,42,29,.35));pointer-events:none}',
    '@keyframes tpEntra{from{opacity:0;transform:translateY(24px) rotate(-1.2deg)}to{opacity:1;transform:rotate(-1.2deg)}}',
    '.tp-cerrar{position:absolute;top:8px;right:8px;width:30px;height:30px;background:none;border:1px solid rgba(23,58,42,.35);border-radius:50%;font-size:18px;line-height:1;color:#173A2A;cursor:pointer;padding:0}',
    '.tp-cerrar:hover{background:#173A2A;color:#FAF6EC}',
    '.tp-playa{display:block;margin:14px auto 6px;overflow:visible;max-width:100%;height:auto;border-bottom:1px dashed rgba(61,42,29,.3);padding-bottom:6px}',
    '.tp-sombrilla{transform-origin:80px 140px;animation:tpViento 4s ease-in-out infinite}',
    '@keyframes tpViento{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}',
    '.tp-sol{transform-origin:222px 26px;animation:tpSol 6s ease-in-out infinite}',
    '@keyframes tpSol{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}',
    '.tp-cartelito{transform-origin:128px 50px;animation:tpHamaca 3s ease-in-out infinite}',
    '@keyframes tpHamaca{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}',
    '.tp-vuelta{font-family:"Bricolage Grotesque",sans-serif;font-size:19px;font-weight:600;letter-spacing:-.01em;margin:6px 0 4px}',
    '.tp-faltan{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9C6B1F;margin:0 0 16px}',
    '.tp-btn{display:block;background:#173A2A;color:#FAF6EC;text-decoration:none;border-radius:2px;padding:13px 14px;font-size:13px;font-weight:700;box-shadow:4px 4px 0 #FFC107;transition:transform .15s,box-shadow .15s}',
    '.tp-btn:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 #FFC107}',
    '@media (max-width:900px){.tp-sello{display:none}}',
    'body.tp-vac-abierto .wa-flotante{display:none!important}',
    '@media (max-width:700px){.tp-vac{left:14px;right:14px;bottom:14px;width:auto;transform:none;animation:none;padding:4px 14px 14px;display:grid;grid-template-columns:118px 1fr;gap:0 12px;align-items:center;text-align:left}.tp-vac::before{font-size:24px;top:-14px}.tp-playa{grid-row:1/4;width:118px;margin:10px 0 0;border-bottom:none;padding:0}.tp-vuelta{font-size:16px;margin:12px 34px 2px 0;line-height:1.2}.tp-faltan{font-size:11px;margin:0 0 10px}.tp-btn{padding:10px;font-size:12px;box-shadow:3px 3px 0 #FFC107;text-align:center}.tp-anio{padding:64px 20px 58px}.tp-anio h2{margin-bottom:36px}.tp-stats{margin-bottom:36px}.tp-stat{padding:16px 8px 0 0}.tp-stat+.tp-stat{padding-left:10px}.tp-num{font-size:40px}.tp-txt{font-size:12.5px;line-height:1.35}.tp-pie{flex-direction:column;align-items:flex-start;gap:16px}}',
    '@media (prefers-reduced-motion:reduce){.tp-foco,.tp-sombrilla,.tp-sol,.tp-cartelito,.tp-chispa,.tp-vac{animation:none}.tp-chispa{opacity:.5}}'
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
      var colores = ['#E53935', '#43A047', '#FFC107'];   // rojo, verde y dorado
      var dibujar = function () {
        var w = header.offsetWidth || window.innerWidth;
        var g = w < 700 ? 1.5 : 1;               // en el celular, focos más grandes
        var tramos = Math.max(3, Math.round(w / (w < 700 ? 130 : 170)));
        var paso = w / tramos, caida = w < 700 ? 10 : 16;
        var alto = Math.round(2 + caida * 2 + 16 * g);
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
              '<rect x="' + (x - 1.5 * g) + '" y="' + (y - 1) + '" width="' + 3 * g + '" height="' + 3 * g + '" fill="#3D2A1D"/>' +
              '<ellipse cx="' + x + '" cy="' + (y + 6 * g) + '" rx="' + 3.6 * g + '" ry="' + 5 * g + '" fill="' + c + '"/>' +
              '<ellipse cx="' + x + '" cy="' + (y + 6 * g) + '" rx="' + 7 * g + '" ry="' + 8 * g + '" fill="' + c + '" opacity="' + (g > 1 ? '.35' : '.25') + '"/></g>';
            n++;
          }
        }
        guir.innerHTML = '<svg width="' + w + '" height="' + alto + '" viewBox="0 0 ' + w + ' ' + alto + '"><path d="' + d +
          '" fill="none" stroke="#6B4E3A" stroke-width="' + 1.2 * g + '" opacity=".55"/>' + focos + '</svg>';
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
        '<div class="tp-sello" aria-hidden="true">Arcos V<b>1er</b>año</div>' +
        '<h2>Gracias por hacer de Arcos V<br>un lugar de <em>encuentro</em></h2>' +
        '<div class="tp-stats">' + stats + '</div>' +
        '<div class="tp-fotos">' + CONFIG.fotosAnio.map(function (f) {
          return '<a href="galeria.html"><img src="' + f.img + '" alt="' + f.texto + ' en Arcos V" loading="lazy"><span>' + f.texto + '</span></a>';
        }).join('') + '</div>' +
        '<p class="tp-ver"><a href="galeria.html">Mirá las fotos del año →</a></p>' +
        '<div class="tp-pie"><p class="tp-brindis">Brindemos por un 2027 lleno de proyectos que se hacen realidad ✨</p>' +
        '<p class="tp-aviso">En enero nos tomamos vacaciones. Volvemos ' + CONFIG.vueltaTexto + '.<br>' +
        '<a href="' + waLink('Hola! Quiero consultar una fecha en Arcos V para 2027.') + '" target="_blank" rel="noopener">Consultar fechas para 2027 →</a></p></div>' +
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
        '<svg class="tp-playa" width="260" height="150" viewBox="0 0 260 150" role="img" aria-label="Cerrado por vacaciones">' +
        '<circle class="tp-sol" cx="222" cy="26" r="14" fill="#FFC107"/>' +
        '<path d="M0,140 Q130,128 260,140 L260,150 L0,150 Z" fill="#F0E8D5"/>' +
        '<g stroke="#6B4E3A" stroke-width="3" stroke-linecap="round" fill="none">' +
        '<line x1="176" y1="140" x2="220" y2="122"/><line x1="230" y1="140" x2="190" y2="122"/>' +
        '<line x1="184" y1="122" x2="240" y2="122"/><line x1="240" y1="122" x2="251" y2="94"/></g>' +
        '<path d="M176,122 L240,122 L250,96 L244,94 L235,118 L178,118 Z" fill="#FFC107"/>' +
        '<path d="M196,118 L205,118 L205,122 L196,122 Z M216,118 L225,118 L225,122 L216,122 Z" fill="#FAF6EC"/>' +
        '<g class="tp-sombrilla">' +
        '<line x1="80" y1="30" x2="80" y2="140" stroke="#3D2A1D" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M24,50 Q80,-2 136,50 Z" fill="#173A2A"/>' +
        '<path d="M52,50 Q66,12 80,22 Q94,12 108,50 Z" fill="#FAF6EC"/>' +
        '<path d="M66,50 Q73,18 80,22 Q87,18 94,50 Z" fill="#FFC107"/>' +
        '<path d="M24,50 Q31,57 38,50 Q45,57 52,50 Q59,57 66,50 Q73,57 80,50 Q87,57 94,50 Q101,57 108,50 Q115,57 122,50 Q129,57 136,50" fill="none" stroke="#173A2A" stroke-width="2"/>' +
        '<circle cx="80" cy="22" r="2.8" fill="#3D2A1D"/>' +
        '<g class="tp-cartelito">' +
        '<path d="M128,50 L100,70 M128,50 L156,70" stroke="#6B4E3A" stroke-width="1.3" fill="none"/>' +
        '<circle cx="128" cy="50" r="2" fill="#3D2A1D"/>' +
        '<rect x="86" y="68" width="84" height="42" rx="4" fill="#3D2A1D"/>' +
        '<text x="128" y="85.5" text-anchor="middle" fill="#FAF6EC" style="font-family:Bricolage Grotesque,sans-serif;font-weight:700;font-size:13px">Cerrado por</text>' +
        '<text x="128" y="101.5" text-anchor="middle" fill="#FFC107" style="font-family:Bricolage Grotesque,sans-serif;font-weight:700;font-size:13px">vacaciones</text>' +
        '</g></g>' +
        '</svg>' +
        '<p class="tp-vuelta">Volvemos <strong>' + CONFIG.vueltaTexto + '</strong></p>' +
        (faltanTxt ? '<p class="tp-faltan">' + faltanTxt + '</p>' : '') +
        '<a class="tp-btn" target="_blank" rel="noopener" href="' +
        waLink('Hola! Vi que están de vacaciones. Quiero consultar una fecha para febrero/marzo en Arcos V.') +
        '">Consultá fechas para febrero y marzo</a>';
      document.body.classList.add('tp-vac-abierto');
      vac.querySelector('.tp-cerrar').addEventListener('click', function () {
        vac.remove();
        document.body.classList.remove('tp-vac-abierto');
        try { sessionStorage.setItem(clave, '1'); } catch (e) {}
      });
      document.body.appendChild(vac);
    }
  }

  /* ---------- NOVIEMBRE: enredadera ---------- */
  function enredadera() {
    var arrancar = function () {
      var NS = 'http://www.w3.org/2000/svg';
      var st = document.createElement('style');
      st.textContent = [
        '.tp-enr{position:absolute;top:0;right:0;width:110px;pointer-events:none;z-index:40;transform:scaleX(-1)}',
        '.tp-enr svg{display:block;width:100%;height:100%;overflow:visible}',
        '.tp-enr .tl{fill:none;stroke:#173A2A;stroke-width:1.6;stroke-linecap:round;opacity:.55}',
        '.tp-enr .zc{fill:none;stroke:#173A2A;stroke-width:1.1;opacity:.4;transition:stroke-dashoffset 1.4s}',
        '.tp-enr .hj{transform-box:fill-box;transform-origin:0% 50%;transform:scale(0);transition:transform 1.1s cubic-bezier(.2,1.4,.4,1)}',
        '.tp-enr .hj.ab{transform:scale(1)}',
        '.tp-enr .hj path{fill:#173A2A;fill-opacity:.1;stroke:#173A2A;stroke-width:1.2;opacity:.7}',
        '.tp-enr .hj .nv{fill:none;stroke-width:.8;opacity:.45}',
        '.tp-enr .hj.am path{fill:#FFC107;fill-opacity:.35}',
        '@media (max-width:700px){.tp-enr{width:56px;opacity:.8}}'
      ].join('');
      document.head.appendChild(st);
      if (getComputedStyle(document.body).position === 'static') document.body.style.position = 'relative';
      var cont = document.createElement('div');
      cont.className = 'tp-enr'; cont.setAttribute('aria-hidden', 'true');
      var svg = document.createElementNS(NS, 'svg');
      cont.appendChild(svg); document.body.appendChild(cont);
      var el = function (n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; };
      var HOJA = 'M0,0 C6,-9 20,-12 30,-4 C34,0 34,0 30,4 C20,12 6,9 0,0 Z';
      var tallo, largo = 0, hojas = [], actual = 0, altoArmado = 0;
      var armar = function () {
        svg.innerHTML = ''; hojas = [];
        cont.style.height = '0px';
        var H = document.documentElement.scrollHeight, W = cont.offsetWidth || 110;
        altoArmado = H; cont.style.height = H + 'px';
        var Hs = H * 120 / W;
        svg.setAttribute('viewBox', '0 0 120 ' + Hs);
        var d = 'M -10 -10', y = -10, x = -10, i = 0;
        while (y < Hs) {
          var ny = y + 140, nx = 22 + (i % 2 ? 26 : 6) + Math.random() * 8;
          d += ' C ' + (x + 30) + ' ' + (y + 50) + ', ' + (nx + (i % 2 ? -20 : 20)) + ' ' + (ny - 60) + ', ' + nx + ' ' + ny;
          x = nx; y = ny; i++;
        }
        tallo = el('path', { d: d, 'class': 'tl' }); svg.appendChild(tallo);
        largo = tallo.getTotalLength(); tallo.style.strokeDasharray = largo;
        var lado = 1;
        for (var L = 60; L < largo; L += 38 + Math.random() * 30) {
          var p = tallo.getPointAtLength(L), q = tallo.getPointAtLength(L + 2);
          var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI; lado *= -1;
          if (Math.random() < .18) {
            var z = el('path', { 'class': 'zc', d: 'M' + p.x + ',' + p.y + ' c' + (lado * 14) + ',4 ' + (lado * 18) + ',18 ' + (lado * 8) + ',20 c' + (lado * -6) + ',1 ' + (lado * -7) + ',-7 ' + (lado * -2) + ',-8' });
            z.style.strokeDasharray = 60; z.style.strokeDashoffset = 60;
            svg.appendChild(z); hojas.push({ L: L, e: z, zc: true }); continue;
          }
          var s = .7 + Math.random() * .6;
          var g = el('g', { transform: 'translate(' + p.x + ',' + p.y + ') rotate(' + (ang + lado * (55 + Math.random() * 25)) + ') scale(' + s + ')' });
          var inn = el('g', { 'class': 'hj' + (Math.random() < .06 ? ' am' : '') });
          inn.appendChild(el('path', { d: HOJA })); inn.appendChild(el('path', { 'class': 'nv', d: 'M2,0 L28,0' }));
          g.appendChild(inn); svg.appendChild(g); hojas.push({ L: L, e: inn });
        }
      };
      var objetivo = function () { return Math.min(1, (window.scrollY + window.innerHeight * .85) / document.documentElement.scrollHeight); };
      var pintar = function (f) {
        var dib = largo * f; tallo.style.strokeDashoffset = largo - dib;
        hojas.forEach(function (h) {
          var on = h.L < dib - 10;
          if (h.zc) h.e.style.strokeDashoffset = on ? 0 : 60; else h.e.classList.toggle('ab', on);
        });
      };
      armar();
      var espera;
      window.addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(armar, 250); });
      window.addEventListener('load', function () { if (Math.abs(document.documentElement.scrollHeight - altoArmado) > 50) armar(); });
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { pintar(1); return; }
      var paso = function () {
        actual += (objetivo() - actual) * .05;
        pintar(actual);
        requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  }
})();
