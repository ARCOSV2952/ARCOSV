/* =====================================================================
   PRODUCTOS DE LA TIENDA · Arcos V
   Para agregar un producto: copiá un bloque { ... }, pegalo al final de
   la lista (con una coma después del bloque anterior) y cambiá los datos.
   Las fotos van en la misma carpeta que tienda.html.

   Campos:
   id         nombre corto para el link, sin espacios ni tildes (ej: "samba")
   nombre     como se muestra
   categoria  "Macetas", "Herramientas", etc. (los filtros se arman solos)
   tipo       para el mensaje de WhatsApp (ej: "la maceta"); puede ir vacío
   precio     número sin puntos (35000). Si todavía no hay precio: null
   ancho      ancho máximo en cm (decide el filtro de tamaño)
   alto       alto en cm
   material   se usa para el filtro de material
   plato      true si incluye plato, false si no
   agotado    true cuando se terminó (queda al final y sin botón de compra)
   resumen    texto corto de la ficha
   fotos      siempre dos fotos, en este orden:
              1ª = maceta GRANDE con las medidas dibujadas (es la que se ve primero en la ficha)
              2ª = maceta CHICA a escala real, 24 px = 1 cm (es la que se ve en la grilla,
                   así se compara el tamaño entre modelos)
   medidas    filas de la tabla: ["Título", "Valor"]
   ===================================================================== */

var TIENDA = {
  whatsapp: "5491162834000",
  retiro: "Se retira en Arcos 2952, Núñez, de martes a sábado de 10:30 a 13 y de 15:30 a 18:30. Se paga por transferencia o en efectivo al retirar."
};

var PRODUCTOS = [

  {
    id: "samba",
    nombre: "Samba",
    categoria: "Macetas",
    tipo: "la maceta",
    precio: 35000,
    ancho: 15.5,
    alto: 13,
    material: "Cerámica esmaltada",
    plato: false,
    agotado: false,
    resumen: "Tres anillos ondulados en cerámica esmaltada verde pastel. Chica y con mucha presencia, va bien con suculentas y plantas colgantes cortas. Tiene orificio de drenaje, así que se planta directo.",
    fotos: ["samba-2.webp", "samba-1.webp"],
    medidas: [
      ["Diámetro", "15,5 cm"],
      ["Alto", "13 cm"],
      ["Boca interna", "12,5 cm"],
      ["Peso", "1 kg"],
      ["Material", "Cerámica esmaltada"]
    ]
  },

  {
    id: "diamante",
    nombre: "Diamante",
    categoria: "Macetas",
    tipo: "la maceta",
    precio: 32000,
    ancho: 15,
    alto: 15,
    material: "Cerámica esmaltada",
    plato: false,
    agotado: false,
    resumen: "Cerámica esmaltada verde pastel con pliegues facetados que cambian con la luz. Tiene orificio de drenaje, así que se planta directo.",
    fotos: ["diamante-2.webp", "diamante-1.webp"],
    medidas: [
      ["Boca", "15 cm"],
      ["Alto", "15 cm"],
      ["Base", "11 cm"],
      ["Material", "Cerámica esmaltada"]
    ]
  },

  {
    id: "cilindro-grande",
    nombre: "Cilindro Grande",
    categoria: "Macetas",
    tipo: "la maceta",
    precio: 40000,
    ancho: 14,
    alto: 11,
    material: "Cerámica esmaltada",
    plato: true,
    agotado: false,
    resumen: "Cilindro liso en cerámica esmaltada amarillo mostaza, con plato a juego. Tiene orificio de drenaje, así que se planta directo.",
    fotos: ["cilindro-grande-2.webp", "cilindro-grande-1.webp"],
    medidas: [
      ["Diámetro", "14 cm"],
      ["Alto", "11 cm"],
      ["Plato", "16,5 cm"],
      ["Material", "Cerámica esmaltada"]
    ]
  },

  {
    id: "florencia-esfera",
    nombre: "Florencia Esfera",
    categoria: "Macetas",
    tipo: "la maceta",
    precio: 23000,
    ancho: 27,
    alto: 19,
    material: "Polietileno rotomoldeado",
    plato: true,
    agotado: false,
    resumen: "Esfera de 7 litros con acabado símil piedra, liviana y resistente. Es apta para intemperie: soporta sol, lluvia y humedad sin decolorarse. Tiene agujero de drenaje y plato incluido.",
    fotos: ["florencia-esfera-medidas.webp", "florencia-esfera-1.webp"],
    medidas: [
      ["Alto", "19 cm"],
      ["Ancho máximo", "27 cm"],
      ["Diámetro de la boca", "17 cm"],
      ["Diámetro de la base", "9 cm"],
      ["Capacidad", "7 litros"],
      ["Peso", "0,4 kg"],
      ["Material", "Polietileno rotomoldeado"],
      ["Acabado", "Símil piedra"],
      ["Plato", "Incluido"]
    ]
  },

  {
    id: "cilindro-grande-rosa",
    nombre: "Cilindro Grande Rosa y Arena",
    categoria: "Macetas",
    tipo: "la maceta",
    precio: 42500,
    ancho: 14,
    alto: 11,
    material: "Cerámica esmaltada",
    plato: true,
    agotado: false,
    resumen: "El mismo cilindro, esmaltado a mano en dos tonos: rosa claro brillante arriba y arena mate abajo, con plato a juego. Sirve para interior y exterior. No conviene dejar agua estancada en el plato.",
    fotos: ["cilindro-grande-rosa-medidas.webp", "cilindro-grande-rosa-1.webp"],
    medidas: [
      ["Diámetro", "14 cm"],
      ["Alto", "11 cm"],
      ["Plato", "16,5 cm"],
      ["Material", "Cerámica esmaltada a mano"]
    ]
  }

];
