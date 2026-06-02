import re

def clean_city_string(t):
    """
    Elimina sufijos administrativos comunes en nombres de ciudades para estandarizar las claves.
    """
    for w in ['city', 'metro', 'region', 'provincia', 'district', 'area']:
        t = t.replace(w, '').strip()
    return t

def normalizar_nombre(texto):
    """
    Normaliza el nombre de la ciudad. Si el nombre tiene tres o más partes separadas por coma,
    combina las dos primeras partes (ej: 'Yulin, Shaanxi, China' -> 'yulin shaanxi') para evitar colisiones.
    """
    if not isinstance(texto, str):
        return ''
    # Reemplazar espacios duros y recortar
    parts = [p.strip() for p in texto.replace('\xa0', ' ').split(',') if p.strip()]
    if len(parts) >= 3:
        city_part = parts[0] + ' ' + parts[1]
    elif len(parts) >= 1:
        city_part = parts[0]
    else:
        city_part = ''
    t = city_part.lower()
    return clean_city_string(t)

def normalizar_pais(texto):
    """
    Estandariza los nombres de los países en una clave común para corregir discrepancias ortográficas o geopolíticas.
    """
    if not isinstance(texto, str):
        return ''
    t = texto.strip().lower()
    mapping = {
        'united states of america': 'united states', 'usa': 'united states', 'us': 'united states',
        'korea': 'south korea', 'republic of korea': 'south korea', 'rep. of korea': 'south korea',
        'viet nam': 'vietnam', 'tűrkiye': 'turkey', 'turkiye': 'turkey', 'türkiye': 'turkey',
        'united kingdom of great britain and northern ireland': 'united kingdom', 'uk': 'united kingdom',
        'iran (islamic republic of)': 'iran', 'dem. rep.': 'congo', 'democratic republic of the congo': 'congo',
        'rep.': 'congo', 'republic of the congo': 'congo', 'russian federation': 'russia',
        'venezuela (bolivarian republic of)': 'venezuela'
    }
    for k, v in mapping.items():
        if k in t:
            return v
    return t
