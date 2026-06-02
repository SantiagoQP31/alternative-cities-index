import os
import pandas as pd

def obtener_raiz_proyecto():
    """
    Encuentra recursivamente la raíz del proyecto buscando el archivo README.md o .git
    """
    current = os.path.abspath(os.getcwd())
    while current != os.path.dirname(current):
        if '.git' in os.listdir(current) or 'README.md' in os.listdir(current):
            return current
        current = os.path.dirname(current)
    return os.getcwd()

def cargar_excel_seguro(path_relativo, sheet_name=0, skiprows=0):
    """
    Carga un archivo Excel de forma segura, manejando límites de ruta en Windows (MAX_PATH).
    """
    raiz = obtener_raiz_proyecto()
    abs_path = os.path.abspath(os.path.join(raiz, path_relativo))
    
    # Manejar rutas largas en sistemas Windows
    if os.name == 'nt' and len(abs_path) >= 260:
        abs_path = '\\\\?\\' + abs_path
        
    if not os.path.exists(abs_path):
        raise FileNotFoundError(f"El archivo especificado no existe en la ruta: {abs_path}")
        
    return pd.read_excel(abs_path, sheet_name=sheet_name, skiprows=skiprows)
