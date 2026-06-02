import os
import pandas as pd
import json
import sys

# Asegurar que el directorio src está en el PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.data_loader import cargar_excel_seguro, obtener_raiz_proyecto
from src.data_cleaning import normalizar_nombre, normalizar_pais
from src.index_builder import imputar_datos_jerarquico, calcular_indice_ciudades

def run():
    print("Iniciando pipeline de integración y cálculo del índice...")
    
    # 1. Cargar datasets raw
    print("Cargando base de datos de Oliver Wyman Forum (OWF)...")
    df_owf = cargar_excel_seguro('data/raw/oliver-wyman-forum-target/book-cities-shaping-the-future.xlsx', sheet_name='Sheet1')
    df_owf['City'] = df_owf['City'].astype(str).str.replace('\xa0', ' ').str.strip()
    df_owf['Country'] = df_owf['City'].apply(lambda x: x.split(',')[-1].strip() if ',' in str(x) else '')
    
    print("Cargando bases de datos de features (CPI, Gini, Áreas Verdes, Transporte)...")
    # CPI
    df_cpi_raw = cargar_excel_seguro('data/raw/urban-indicator-database-features/city-prosperity-index-cpi/city_prosperity_index_database_2016.xls')
    headers = df_cpi_raw.iloc[0:4].ffill(axis=1).fillna('')
    new_cols = [' | '.join([str(p).replace('.0', '').strip() for p in headers.iloc[:, i] if str(p) != 'nan' and str(p).strip()]) for i in range(df_cpi_raw.shape[1])]
    df_cpi = df_cpi_raw.iloc[4:].copy()
    df_cpi.columns = new_cols
    df_cpi = df_cpi.rename(columns={
        'City Prosperity Index. Global CPI. Base Data. 2016 | COUNTRY': 'Country',
        'City Prosperity Index. Global CPI. Base Data. 2016 | CITY': 'City'
    }).dropna(subset=['City'])
    df_cpi = df_cpi[df_cpi['City'] != '--']
    
    # Gini
    df_gini_raw = cargar_excel_seguro('data/raw/urban-indicator-database-features/economic-indicators/Gini_at_disposable_income_after_taxes_and_transfers,_2010_-_2017.xls')
    df_gini = df_gini_raw.iloc[1:].copy()
    df_gini.columns = ['Country', 'City'] + [str(int(float(y))) for y in df_gini_raw.iloc[0].tolist()[2:]]
    
    # Áreas Verdes
    df_verdes = cargar_excel_seguro('data/raw/urban-indicator-database-features/open-spaces-and-green-areas/green_areas_1990_2020.xlsx', sheet_name='Data')
    df_verdes = df_verdes.rename(columns={'Country or Territory Name': 'Country', 'City Name': 'City'})
    
    # Transporte
    df_transporte = cargar_excel_seguro('data/raw/urban-indicator-database-features/urban-transport/public_transport_access.xlsx', sheet_name='Sheet1')
    df_transporte = df_transporte.rename(columns={'Country or Territory Name': 'Country', 'City Name': 'City'})
    
    # 2. Generar claves normalizadas para el cruce geopolítico
    print("Normalizando claves de ciudades y países...")
    df_owf['City_Key'] = df_owf['City'].apply(normalizar_nombre)
    df_owf['Country_Key'] = df_owf['Country'].apply(normalizar_pais)
    
    df_cpi['City_Key'] = df_cpi['City'].apply(normalizar_nombre)
    df_cpi['Country_Key'] = df_cpi['Country'].apply(normalizar_pais)
    
    df_gini['City_Key'] = df_gini['City'].apply(normalizar_nombre)
    df_gini['Country_Key'] = df_gini['Country'].apply(normalizar_pais)
    
    df_verdes['City_Key'] = df_verdes['City'].apply(normalizar_nombre)
    df_verdes['Country_Key'] = df_verdes['Country'].apply(normalizar_pais)
    
    df_transporte['City_Key'] = df_transporte['City'].apply(normalizar_nombre)
    df_transporte['Country_Key'] = df_transporte['Country'].apply(normalizar_pais)
    
    # 3. Limpieza de duplicados internos
    print("Limpiando registros duplicados internos de las variables auxiliares...")
    df_cpi_unique = df_cpi.drop_duplicates(subset=['City_Key', 'Country_Key']).copy()
    df_gini_unique = df_gini.drop_duplicates(subset=['City_Key', 'Country_Key']).copy()
    df_verdes_unique = df_verdes.drop_duplicates(subset=['City_Key', 'Country_Key']).copy()
    df_transporte_unique = df_transporte.drop_duplicates(subset=['City_Key', 'Country_Key']).copy()
    
    # 4. Alinear unidades de Gini (decimales a porcentaje, ej: 0.381 -> 38.1)
    def corregir_escala_gini(val):
        v = pd.to_numeric(val, errors='coerce')
        if pd.notnull(v) and v < 1.0:
            return v * 100
        return v
    
    df_gini_unique['Gini_Val'] = df_gini_unique['2017'].apply(corregir_escala_gini)
    df_cpi_unique['CPI_GDP_pc_Val'] = pd.to_numeric(df_cpi_unique['City Prosperity Index. Global CPI. Base Data. 2016 | PRODUCTIVITY INDEX (P) | Economic Strenght | City Product per capita'], errors='coerce')
    df_verdes_unique['Green_Val'] = pd.to_numeric(df_verdes_unique['Average share of green area in city/ urban area 2020 (%)'], errors='coerce')
    df_transporte_unique['Transport_Val'] = pd.to_numeric(df_transporte_unique['Share of urban population with convenient access to public transport (%)'], errors='coerce')
    
    # 5. Fusión geopolítica
    print("Realizando la fusión geopolítica (join por Ciudad y País)...")
    df_merged = df_owf.merge(df_cpi_unique[['City_Key', 'Country_Key', 'CPI_GDP_pc_Val']], on=['City_Key', 'Country_Key'], how='left')
    df_merged = df_merged.merge(df_gini_unique[['City_Key', 'Country_Key', 'Gini_Val']], on=['City_Key', 'Country_Key'], how='left')
    df_merged = df_merged.merge(df_verdes_unique[['City_Key', 'Country_Key', 'Green_Val']], on=['City_Key', 'Country_Key'], how='left')
    df_merged = df_merged.merge(df_transporte_unique[['City_Key', 'Country_Key', 'Transport_Val']], on=['City_Key', 'Country_Key'], how='left')
    
    df_merged = df_merged.rename(columns={
        'CPI_GDP_pc_Val': 'CPI_GDP_pc',
        'Gini_Val': 'Gini_Index',
        'Green_Val': 'Green_Area_Share',
        'Transport_Val': 'Transport_Access'
    })
    
    # Convertir a numérico explícito
    for col in ['CPI_GDP_pc', 'Gini_Index', 'Green_Area_Share', 'Transport_Access']:
        df_merged[col] = pd.to_numeric(df_merged[col], errors='coerce')
        
    # 6. Imputación jerárquica
    print("Aplicando pipeline de imputación jerárquica por grupo de ingresos...")
    df_imputed = imputar_datos_jerarquico(df_merged)
    
    # 7. Cálculo del Índice e Hilos Métricos
    print("Calculando subíndices de Dinamismo Económico, Inclusión Social, Vitalidad Ecológica y Movilidad...")
    df_final = calcular_indice_ciudades(df_imputed)
    
    # 8. Exportar resultados
    print("Exportando base de datos consolidada a Excel...")
    raiz = obtener_raiz_proyecto()
    processed_dir = os.path.join(raiz, 'data', 'processed')
    os.makedirs(processed_dir, exist_ok=True)
    df_final.to_excel(os.path.join(processed_dir, 'df_merged.xlsx'), index=False)
    
    # Crear un JSON ligero para la aplicación interactiva React
    print("Exportando archivo JSON para la interfaz de usuario...")
    json_cols = [
        'No', 'City', 'Country', 'Income_Group', 'ACI', 'ACI_Rank',
        'Sub_Index_Economic', 'Sub_Index_Equity', 'Sub_Index_Environmental', 'Sub_Index_Mobility',
        'GDP_Clean', 'Gini_Clean', 'Green_Clean', 'Transport_Clean'
    ]
    df_json = df_final[json_cols].copy()
    
    # Redondear floats para disminuir tamaño de archivo
    for col in ['ACI', 'Sub_Index_Economic', 'Sub_Index_Equity', 'Sub_Index_Environmental', 'Sub_Index_Mobility', 'GDP_Clean', 'Gini_Clean', 'Green_Clean', 'Transport_Clean']:
        df_json[col] = df_json[col].round(2)
        
    web_data_dir = os.path.join(raiz, 'web-app', 'src', 'data')
    os.makedirs(web_data_dir, exist_ok=True)
    json_path = os.path.join(web_data_dir, 'cities_ranking.json')
    
    df_json.to_json(json_path, orient='records', indent=2, force_ascii=False)
    
    print(f"Pipeline completado exitosamente. Datos de React exportados a: {json_path}")
    
if __name__ == '__main__':
    run()
