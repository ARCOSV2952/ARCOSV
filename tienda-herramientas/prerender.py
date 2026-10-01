# Regenera la parte estática de tienda.html (para rastreadores sin JavaScript) a partir de productos.js
import json, re, subprocess, html
BASE='https://arcosv.com.ar/'
prods=json.loads(subprocess.check_output(['node','-e',"const vm=require('vm'),fs=require('fs');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('productos.js','utf8')+';this.P=PRODUCTOS;this.T=TIENDA;',c);console.log(JSON.stringify({P:c.P,T:c.T}))"]).decode())
P=prods['P']
e=lambda s:html.escape(str(s),quote=True)
def plata(n): return '$'+format(int(n),',').replace(',','.')
def cm(n): return str(n).replace('.',',')+' cm'
cards=[]
for p in P:
    etiqueta='Agotada' if p.get('agotado') else ('Con plato' if p.get('plato') else '')
    medidas='; '.join(f'{a}: {b}' for a,b in p['medidas'])
    cards.append(
f'''<article class="tarjeta{' agotado' if p.get('agotado') else ''}"><a href="#{e(p['id'])}"><div class="foto"><img src="{e(p['fotos'][1] if len(p['fotos'])>1 else p['fotos'][0])}" alt="{e(p['nombre'])} a escala" loading="lazy">{f'<span class="etiqueta">{etiqueta}</span>' if etiqueta else ''}</div><h3>{e(p['nombre'])}</h3><p class="tarjeta-precio">{'Consultar precio' if p.get('precio') is None else plata(p['precio'])}</p><p class="tarjeta-medida">Ancho {cm(p['ancho'])} · Alto {cm(p['alto'])}</p><p class="tarjeta-resumen">{e(p['resumen'])}</p><p class="tarjeta-resumen">Medidas y datos: {e(medidas)}.</p></a></article>''')
estatico='<!--PRE:INI-->\n'+'\n'.join(cards)+'\n<!--PRE:FIN-->'
items=[]
for i,p in enumerate(P,1):
    prod={"@type":"Product","name":p['nombre'],"description":p['resumen'],"sku":p['id'],
      "category":p['categoria'],"material":p['material'],
      "image":[BASE+f for f in p['fotos']],
      "height":{"@type":"QuantitativeValue","value":p['alto'],"unitCode":"CMT"},
      "width":{"@type":"QuantitativeValue","value":p['ancho'],"unitCode":"CMT"},
      "additionalProperty":[{"@type":"PropertyValue","name":a,"value":b} for a,b in p['medidas']]+[{"@type":"PropertyValue","name":"Incluye plato","value":"Sí" if p.get('plato') else "No"}]}
    if p.get('precio') is not None:
        prod["offers"]={"@type":"Offer","price":str(p['precio']),"priceCurrency":"ARS","availability":"https://schema.org/"+("OutOfStock" if p.get('agotado') else "InStock"),"url":BASE+"tienda.html#"+p['id'],"seller":{"@id":BASE+"#business"}}
    items.append({"@type":"ListItem","position":i,"item":prod})
ld={"@context":"https://schema.org","@type":"CollectionPage","name":"La Tienda de Arcos V","url":BASE+"tienda.html","description":"Macetas y productos de jardinería que se retiran en Arcos 2952, Núñez, Buenos Aires.","mainEntity":{"@type":"ItemList","itemListElement":items}}
ldtag='<script type="application/ld+json" id="ld-tienda">\n'+json.dumps(ld,ensure_ascii=False,indent=1)+'\n</script>'
h=open('tienda.html',encoding='utf-8').read()
h=re.sub(r'<!--PRE:INI-->.*?<!--PRE:FIN-->',lambda m:estatico,h,flags=re.S)
h=re.sub(r'<script type="application/ld\+json" id="ld-tienda">.*?</script>',lambda m:ldtag,h,flags=re.S)
open('tienda.html','w',encoding='utf-8').write(h)
print(len(P),'productos prerenderizados')
