"""Genera disponibilidad.json (ocupado / libre por franja) a partir de la planilla de Arcos V.

Uso:  python3 herramientas/disponibilidad.py RUTA_PLANILLA.xlsm disponibilidad.json

Solo publica fechas y franjas ocupadas: nunca nombres, montos ni datos de clientes.
Franjas: mañana 8-13, tarde 13-18, noche 18-23 (domingos 10-22).
Ocupa una franja cualquier alquiler (confirmado o prerreserva) que se superponga con ella.
Los alquileres sin horario cargado y los días "NO SE PUEDE ALQUILAR" ocupan el día entero.
"""
import sys, json, datetime as dt
import openpyxl

DIAS_VENTANA = 62
FRANJAS = [("manana", 8 * 60, 13 * 60), ("tarde", 13 * 60, 18 * 60), ("noche", 18 * 60, 23 * 60)]


def minutos(t):
    if isinstance(t, dt.datetime):
        t = t.time()
    if isinstance(t, dt.time):
        return t.hour * 60 + t.minute
    if isinstance(t, (int, float)):  # fracción de día de Excel
        return round(float(t) % 1 * 24 * 60)
    return None


def main(planilla, salida):
    wb = openpyxl.load_workbook(planilla, data_only=True, read_only=True)
    ws = wb["DATOS"]
    filas = ws.iter_rows(values_only=True)
    hdr = [str(h).strip() if h else "" for h in next(filas)]
    col = {h: i for i, h in enumerate(hdr)}

    hoy = dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).date()
    hasta = hoy + dt.timedelta(days=DIAS_VENTANA)
    ocupado = {}

    for r in filas:
        fecha = r[col["Fecha"]]
        if not isinstance(fecha, (dt.date, dt.datetime)):
            continue
        fecha = fecha.date() if isinstance(fecha, dt.datetime) else fecha
        if not (hoy <= fecha <= hasta):
            continue
        cliente = str(r[col["Cliente"]] or "").strip().upper()
        tipo = str(r[col["Tipo"]] or "").strip().lower()
        pre = str(r[col["Prereserva"]] or "").strip().upper()
        if not cliente or tipo == "cancelado" or pre == "CONSULTA":
            continue
        ini, fin = minutos(r[col["Alquiler desde"]]), minutos(r[col["Alquiler hasta"]])
        clave = fecha.isoformat()
        if cliente == "NO SE PUEDE ALQUILAR" or ini is None or fin is None:
            ocupado[clave] = [f for f, _, _ in FRANJAS]
            continue
        if fin <= ini:
            fin += 24 * 60  # termina pasada la medianoche
        actuales = set(ocupado.get(clave, []))
        for nombre, a, b in FRANJAS:
            if ini < b and fin > a:
                actuales.add(nombre)
        ocupado[clave] = [f for f, _, _ in FRANJAS if f in actuales]

    datos = {
        "actualizado": dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).strftime("%Y-%m-%dT%H:%M"),
        "desde": hoy.isoformat(),
        "hasta": hasta.isoformat(),
        "ocupado": dict(sorted(ocupado.items())),
    }
    with open(salida, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
    print(f"{len(ocupado)} días con franjas ocupadas entre {hoy} y {hasta}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
