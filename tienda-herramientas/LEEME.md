# La Tienda de Arcos V: cómo cargar productos

Guía para quien (Claude u otra persona) cargue productos en `tienda.html`. Si sos Claude: leé esto entero antes de tocar nada, y trabajá con Marcela como se explica al final.

## Cómo está armada la tienda

| Archivo | Qué es |
|---|---|
| `productos.js` | **Los datos de todos los productos.** Es lo único que se edita para sumar o cambiar uno. Arriba tiene la explicación de cada campo. |
| `tienda.html` | La página (grilla, filtros, ventana de detalle). No se toca para sumar productos. Tiene un bloque entre `<!--PRE:INI-->` y `<!--PRE:FIN-->` y un JSON-LD que **se regeneran solos** con `prerender.py`. |
| `tienda-herramientas/prerender.py` | Regenera ese bloque estático y el JSON-LD (es la versión que leen los rastreadores de IA y buscadores sin JavaScript). |
| `tienda-herramientas/fotos.py` | Arma las dos fotos de cada producto desde una foto cruda. |
| `<slug>-1.webp`, `<slug>-medidas.webp` | Las dos fotos de cada producto, en la raíz del repo. |

## Pasos para sumar un producto

1. **Pedir los datos a Marcela** (que los mande de a varios productos juntos): foto, nombre, precio, medidas (diámetro/ancho, alto, boca, base, plato), peso, material, con o sin plato y si tiene orificio de drenaje.
   Lo que no diga, **no se inventa** (por ejemplo, no afirmar que tiene drenaje si no lo dijo). Si falta algo importante, preguntar o dejarlo afuera y avisar.
2. **Armar las fotos** con `fotos.py` (ver abajo).
3. **Agregar el bloque** al final de `productos.js`, copiando uno existente. `id` en minúsculas sin tildes ni espacios (ej. `cilindro-grande-rosa`); es el link `tienda.html#id`.
4. **Regenerar la versión para rastreadores**, desde la raíz del repo:
   `python3 tienda-herramientas/prerender.py` (necesita Node instalado).
5. **Probar** en un navegador de prueba (Playwright): que cargue sin errores, que la grilla muestre todos los productos, que abra la ficha, que el WhatsApp salga bien y que también se vea con JavaScript apagado.
6. **Subir** directo a `main` del repositorio `ARCOSV2952/ARCOSV` (el sitemap lo actualiza solo una acción de GitHub). Mensaje de commit claro, en español.
7. Si aparece una categoría nueva (herramientas, etc.), revisar que `llms.txt` la describa.

## Reglas de las fotos (siempre)

- **Cada producto tiene exactamente 2 fotos, en este orden** en el campo `fotos`:
  1. `<slug>-medidas.webp`: la maceta **GRANDE con las medidas dibujadas**. Es la primera de la ficha.
  2. `<slug>-1.webp`: la maceta **CHICA a escala real**. Es la que se ve en la grilla (`tienda.html` usa `fotos[1]` para la tarjeta).
- En la grilla, `tienda.html` muestra la foto a escala con **un mismo recorte ampliado para todas** (se calcula solo según la maceta más grande del catálogo: `ENC`, `V`, `X0`, `Y0` en el script). La segunda foto de la ficha usa ese mismo recorte, así es igual a la de la grilla. No hace falta tocar nada al sumar productos; si se suma una maceta mucho más grande, el recorte se ajusta solo.
- **Escala fija de toda la tienda: 24 px = 1 cm**, en 1080 x 1080 px, para que en la grilla se vea la diferencia real de tamaño entre modelos. Nunca cambiar esa escala.
- Fondo **beige liso** (RGB 238, 228, 214), sombra suave debajo, luz pareja, sin otros objetos. Formato `.webp` calidad 90.
- **No se modifica la maceta**: solo se recorta y se reescala. Nada de redibujarla, cambiarle color ni "mejorarla" con IA. Si la foto cruda trae un reflejo de color fuerte (por ejemplo del mantel), se avisa a Marcela antes de decidir qué hacer.
- Medidas dibujadas: líneas y textos en verde `#173A2A`, fuente DejaVu Sans 42, con "Incluye plato" abajo cuando trae plato.
- Si hay plato, el campo `plato: true` en `productos.js` y la medida del plato en la tabla.

### Uso de `fotos.py`

```
python3 tienda-herramientas/fotos.py --foto cruda.png --slug cilindro-grande-rosa \
  --rect 235,270,545,500 --ancho-cm 16.5 \
  --ancho-cuerpo-cm 14 --alto-cm 11 \
  --etq-ancho "14 cm" --etq-alto "11 cm" --etq-plato "Plato 16,5 cm" --plato
```

- `--rect x,y,w,h`: caja aproximada alrededor de la maceta (y su plato) en píxeles de la foto cruda. Mirar la foto primero para estimarla.
- `--ancho-cm`: ancho real de lo más ancho que se ve (el plato, si hay; si no, el diámetro). De ahí sale la escala.
- Sin plato: omitir `--plato` y `--etq-plato`.
- **Siempre mirar los resultados** (sobre todo el borde de abajo y la silueta) antes de subirlos. Si la foto cruda tiene sombra oscura pegada al borde, el script la limpia; si queda algún píxel, retocar o avisar.
- El script recorta con GrabCut: funciona bien con macetas claras sobre fondos distintos, pero puede equivocarse con fondos del mismo color que la pieza. Revisar la máscara.
- Samba y Diamante tienen las medidas dibujadas con otro estilo (trazo gris fino). Es un pendiente estético, no un error.

## Datos fijos

- **WhatsApp de la tienda y de Arcos V: 1162834000** (`5491162834000` en los links). El `+54 9 11 6489-9011` **no** es de Arcos V; es de Carolina Vitulli, no usarlo en la tienda.
- Retiro: "Se retira en Arcos 2952, Núñez."
- Precio sin puntos en `productos.js` (`35000`). Si no hay precio todavía: `precio: null` y la tienda dice "Consultar precio".
- Productos agotados: `agotado: true` (quedan al final de la grilla y sin botón de compra).
- Los filtros de ancho de la grilla son por tramos (hasta 18 cm, de 18 a 25, más de 25) y se definen en el script de `tienda.html` (`TRAMOS`). Si aparecen macetas muy distintas, revisar los cortes.
- Los filtros de categoría y material se arman solos con lo que haya en `productos.js`.

## Cómo trabajar con Marcela

- No sabe programar: hay que hacerlo todo por ella (editar, probar y subir), sin pedirle que toque código. Responder en español rioplatense, breve y claro.
- **Nunca rehacer un archivo desde cero**: editar solo lo necesario (gasta tokens de más y puede romper lo que ya anda). Si una tarea va a gastar muchísimos tokens, avisarle antes.
- Verificar el resultado (con un navegador de prueba) antes de decirle que está listo, y decirle con honestidad lo que no se pudo comprobar.
- Marcela quiere el orden de fotos y la escala de arriba **siempre**, en todos los productos.
