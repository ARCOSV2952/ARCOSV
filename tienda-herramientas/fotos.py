#!/usr/bin/env python3
"""
Arma las dos fotos de un producto de la tienda a partir de UNA foto cruda.

  python3 fotos.py --foto cruda.png --slug cilindro-grande-rosa \
      --rect 235,270,545,500 --ancho-cm 16.5 \
      --ancho-cuerpo-cm 14 --alto-cm 11 \
      --etq-ancho "14 cm" --etq-alto "11 cm" --etq-plato "Plato 16,5 cm" --plato

Genera en --salida (por defecto, la carpeta actual):
  <slug>-1.webp        maceta CHICA a escala real (24 px = 1 cm) -> es la de la grilla
  <slug>-medidas.webp  maceta GRANDE con las medidas dibujadas   -> es la primera de la ficha

Los dos son 1080 x 1080, fondo beige liso y sombra suave.
Requiere: opencv-python, numpy, pillow.

Parámetros
  --rect x,y,w,h       caja aproximada (en px de la foto) que contiene la maceta y su plato
  --ancho-cm           ancho real en cm de lo MÁS ANCHO de la silueta (el plato si hay plato,
                       si no el diámetro). Con eso se calcula la escala.
  --ancho-cuerpo-cm    ancho real del cuerpo de la maceta (largo de la línea de arriba)
  --alto-cm            alto real de la maceta, de borde a base (largo de la línea de la izquierda)
  --etq-ancho/--etq-alto   textos de las medidas, ej. "14 cm"
  --etq-plato          texto de la medida del plato, ej. "Plato 16,5 cm" (solo si hay plato)
  --plato              la maceta trae plato (agrega la línea de abajo y "Incluye plato" y
                       redondea el borde inferior del plato)
  --sin-limpieza-base  no tocar la franja de abajo (si la foto original no tiene sombra oscura)
"""
import argparse, os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

S = 1080                    # lado de la imagen final
PX_CM_ESCALA = 24.0         # ESCALA FIJA DE TODA LA TIENDA: 24 px = 1 cm
BG_RGB = (238, 228, 214)    # beige liso de fondo
SOMBRA_RGB = (152, 138, 120)
VERDE = (23, 58, 42)        # color de las líneas y textos de medidas
BASE_ESCALA = 782           # y de la base de la maceta en la foto a escala


def fuente(tam):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
              '/usr/share/fonts/dejavu/DejaVuSans.ttf',
              '/Library/Fonts/Arial.ttf', 'C:/Windows/Fonts/arial.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, tam)
    return ImageFont.load_default()


def mayor_componente(m):
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    return np.where(lab == k, 255, 0).astype(np.uint8)


def recortar(img, rect, plato, limpiar_base):
    """Devuelve (imagen limpia, máscara 0/255) de la maceta."""
    h, w = img.shape[:2]
    mk = np.zeros((h, w), np.uint8)
    cv2.grabCut(img, mk, tuple(rect), np.zeros((1, 65)), np.zeros((1, 65)), 10, cv2.GC_INIT_WITH_RECT)
    m = np.where((mk == 1) | (mk == 3), 255, 0).astype(np.uint8)
    m = mayor_componente(m)
    # rellenar huecos internos
    ff = cv2.bitwise_not(m).copy()
    cv2.floodFill(ff, None, (0, 0), 0)
    m = cv2.bitwise_or(m, ff)
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ys, xs = np.where(m > 0)
    y0, y1 = ys.min(), ys.max()
    hh = y1 - y0
    clean = img.copy()
    if limpiar_base:
        # la sombra oscura de la mesa queda pegada abajo: sacarla
        dark = np.zeros_like(m)
        z = int(y1 - 0.10 * hh)
        dark[z:] = (g[z:] < 135).astype(np.uint8) * 255
        m = cv2.bitwise_and(m, cv2.bitwise_not(cv2.dilate(dark, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    m = mayor_componente(m)
    ys, xs = np.where(m > 0)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    hh = y1 - y0
    if plato:
        # el plato es una elipse: rehacer limpio su mitad inferior
        cx, a = (x0 + x1) / 2, (x1 - x0) / 2
        b = int(0.13 * hh)
        cy = int(y1 - b)
        e = np.zeros_like(m)
        cv2.ellipse(e, (int(round(cx)), cy), (int(a), b), 0, 0, 180, 255, -1)
        low = np.zeros_like(m); low[cy:] = e[cy:]
        up = m.copy(); up[cy:] = 0
        m = cv2.morphologyEx(cv2.bitwise_or(up, low), cv2.MORPH_CLOSE,
                             cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    m = cv2.GaussianBlur(m, (0, 0), 2.0)
    m = np.where(m > 127, 255, 0).astype(np.uint8)
    if limpiar_base:
        er = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        z = int(y1 - 0.085 * hh)
        m[z:] = er[z:]
        # repintar hilos oscuros que queden dentro de la silueta en la franja de abajo
        z2 = int(y1 - 0.075 * hh)
        sel = ((g < 150) & (m > 0)); sel[:z2] = False
        sel = cv2.dilate(sel.astype(np.uint8) * 255, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        clean = cv2.inpaint(img, sel, 5, cv2.INPAINT_TELEA)
    m = cv2.GaussianBlur(m, (0, 0), 1.4)
    m = np.where(m > 127, 255, 0).astype(np.uint8)
    return clean, m


def elipse_difusa(c, ejes, sigma):
    t = np.zeros((S, S), np.float32)
    cv2.ellipse(t, c, ejes, 0, 0, 360, 1.0, -1)
    return cv2.GaussianBlur(t, (0, 0), sigma)


def componer(img, m, px_cm_src, px_cm_dest, base_y):
    """Pega la maceta recortada sobre el fondo beige, a la escala pedida, con la base en base_y."""
    ys, xs = np.where(m > 0)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    s = px_cm_dest / px_cm_src
    pad = 6
    a = cv2.GaussianBlur(cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))).astype(np.float32) / 255, (0, 0), 1.0)
    cx0, cx1, cy0, cy1 = x0 - pad, x1 + pad, y0 - pad, y1 + pad
    crop = img[cy0:cy1, cx0:cx1].astype(np.float32)
    ca = a[cy0:cy1, cx0:cx1]
    nw, nh = int(round(crop.shape[1] * s)), int(round(crop.shape[0] * s))
    crop = cv2.resize(crop, (nw, nh), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_LANCZOS4)
    ca = np.clip(cv2.resize(ca, (nw, nh), interpolation=cv2.INTER_AREA), 0, 1)[..., None]
    bg = np.ones((S, S, 3), np.float32) * np.array(BG_RGB[::-1], np.float32)
    pw = (x1 - x0) * s
    ox = int(round(S / 2 - (nw / 2)))
    oy = int(round(base_y - (y1 - cy0) * s))
    sh = np.clip(0.42 * elipse_difusa((S // 2, int(base_y - 4)), (int(pw * 0.40), max(8, int(pw * 0.035))), max(4, pw * 0.022)) +
                 0.20 * elipse_difusa((S // 2, int(base_y + 4)), (int(pw * 0.55), max(14, int(pw * 0.06))), max(10, pw * 0.05)),
                 0, 1)[..., None]
    bg = bg * (1 - sh) + np.array(SOMBRA_RGB[::-1], np.float32) * 0 + np.array((120, 138, 152), np.float32) * sh
    reg = bg[oy:oy + nh, ox:ox + nw]
    bg[oy:oy + nh, ox:ox + nw] = crop * ca + reg * (1 - ca)
    caja = (ox + pad * s, oy + pad * s, ox + (x1 - x0 + pad) * s, base_y)   # izq, arriba, der, base (px finales)
    return np.clip(bg, 0, 255).astype(np.uint8), caja


def dibujar(canvas_bgr, caja, px_cm, a):
    im = Image.fromarray(cv2.cvtColor(canvas_bgr, cv2.COLOR_BGR2RGB))
    d = ImageDraw.Draw(im)
    f_big, f_mid = fuente(42), fuente(34)
    bgc = im.getpixel((20, 20))
    L, T, R, B = caja

    def hline(xa, xb, y, txt):
        d.line([(xa, y), (xb, y)], fill=VERDE, width=3)
        for x in (xa, xb):
            d.line([(x, y - 14), (x, y + 14)], fill=VERDE, width=3)
        tw = d.textlength(txt, font=f_big); c = (xa + xb) / 2
        d.rectangle([c - tw / 2 - 14, y - 28, c + tw / 2 + 14, y + 28], fill=bgc)
        d.text((c, y), txt, font=f_big, fill=VERDE, anchor='mm')

    def vline(x, ya, yb, txt):
        d.line([(x, ya), (x, yb)], fill=VERDE, width=3)
        for y in (ya, yb):
            d.line([(x - 14, y), (x + 14, y)], fill=VERDE, width=3)
        tw = d.textlength(txt, font=f_big); c = (ya + yb) / 2
        d.rectangle([x - tw / 2 - 12, c - 28, x + tw / 2 + 12, c + 28], fill=bgc)
        d.text((x, c), txt, font=f_big, fill=VERDE, anchor='mm')

    cx = (L + R) / 2
    wc = a.ancho_cuerpo_cm * px_cm
    hline(cx - wc / 2, cx + wc / 2, T - 58, a.etq_ancho)
    vline(L - 70, T, T + a.alto_cm * px_cm, a.etq_alto)
    if a.plato:
        if a.etq_plato:
            hline(L, R, B + 85, a.etq_plato)
        d.text((S / 2, B + 190), 'Incluye plato', font=f_mid, fill=VERDE, anchor='mm')
    return im


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--foto', required=True)
    p.add_argument('--slug', required=True)
    p.add_argument('--rect', required=True, help='x,y,w,h')
    p.add_argument('--ancho-cm', type=float, required=True)
    p.add_argument('--ancho-cuerpo-cm', type=float, required=True)
    p.add_argument('--alto-cm', type=float, required=True)
    p.add_argument('--etq-ancho', required=True)
    p.add_argument('--etq-alto', required=True)
    p.add_argument('--etq-plato', default='')
    p.add_argument('--plato', action='store_true')
    p.add_argument('--sin-limpieza-base', action='store_true')
    p.add_argument('--salida', default='.')
    a = p.parse_args()

    img = cv2.imread(a.foto)
    rect = [int(v) for v in a.rect.split(',')]
    clean, m = recortar(img, rect, a.plato, not a.sin_limpieza_base)
    ys, xs = np.where(m > 0)
    px_cm_src = (xs.max() - xs.min()) / a.ancho_cm          # px de la foto cruda por cada cm real
    alto_px_dest_cm = (ys.max() - ys.min()) / px_cm_src      # alto de toda la silueta en cm

    # 1) a escala real (la de la grilla)
    esc, _ = componer(clean, m, px_cm_src, PX_CM_ESCALA, BASE_ESCALA)
    cv2.imwrite(os.path.join(a.salida, f'{a.slug}-1.webp'), esc, [cv2.IMWRITE_WEBP_QUALITY, 90])

    # 2) grande con medidas (la primera de la ficha)
    px_cm_big = max(PX_CM_ESCALA * 1.2, min(40.0, 640.0 / a.ancho_cm))
    alto_total = alto_px_dest_cm * px_cm_big
    arriba, abajo = 86, (207 if a.plato else 70)
    top = (S - (alto_total + arriba + abajo)) / 2 + arriba
    base = top + alto_total
    big, caja = componer(clean, m, px_cm_src, px_cm_big, base)
    im = dibujar(big, caja, px_cm_big, a)
    im.save(os.path.join(a.salida, f'{a.slug}-medidas.webp'), 'WEBP', quality=90, method=6)
    print(f'ok: {a.slug}-1.webp y {a.slug}-medidas.webp | escala original {px_cm_src:.1f} px/cm | grande {px_cm_big:.1f} px/cm')


if __name__ == '__main__':
    main()
