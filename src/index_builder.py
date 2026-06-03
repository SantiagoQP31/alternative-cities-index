import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# Definición de Grupos de Ingresos según el Banco Mundial
HIGH_INCOME = {
    'Japan', 'Korea', 'Singapore', 'Saudi Arabia', 'United Arab Emirates', 'Qatar',
    'Bahrain', 'Kuwait', 'Oman', 'Uruguay', 'Chile', 'Panama', 'United States',
    'Canada', 'France', 'Italy', 'Belgium', 'Sweden', 'Austria', 'United Kingdom', 'Germany', 'Spain', 'Netherlands', 'Denmark', 'Australia', 'Poland'
}

UPPER_MIDDLE = {
    'China', 'Brazil', 'Mexico', 'Turkey', 'South Africa', 'Colombia', 'Argentina',
    'Peru', 'Ecuador', 'Costa Rica', 'Dominican Republic', 'Kazakhstan', 'Gabon',
    'Equatorial Guinea', 'Libya', 'Georgia', 'Armenia', 'Azerbaijan', 'Iraq',
    'Thailand', 'Malaysia', 'Venezuela', 'Botswana', 'Cuba', 'Jamaica', 'Algeria'
}

LOWER_MIDDLE = {
    'India', 'Indonesia', 'Philippines', 'Egypt', 'Vietnam', 'Pakistan', 'Bangladesh',
    'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Bolivia', 'El Salvador', 'Honduras',
    'Nicaragua', 'Morocco', 'Tunisia', 'Angola', 'Cameroon', 'Ghana', 'Kenya',
    'Nigeria', 'Mauritania', 'Rep.', 'Sri Lanka', 'Jordan', 'Lebanon', 'Syria',
    'Zimbabwe', 'Zambia', 'Djibouti', 'Mongolia', 'Cambodia', 'Laos', 'Myanmar',
    'Senegal', "Cote d'Ivoire", 'Turkmenistan'
}

LOW_INCOME = {
    'Afghanistan', 'Burkina Faso', 'Burundi', 'Central African Republic', 'Chad',
    'Dem. Rep.', 'Eritrea', 'Ethiopia', 'Gambia', 'Guinea', 'Guinea-Bissau',
    'Haiti', 'Liberia', 'Madagascar', 'Malawi', 'Mali', 'Mozambique', 'Niger',
    'Rwanda', 'Sierra Leone', 'Somalia', 'South Sudan', 'Sudan', 'Tanzania',
    'Togo', 'Uganda', 'Yemen'
}

# Diccionario de proxies nacionales de Gini (Banco Mundial)
COUNTRY_GINI_DICT = {
    'China': 38.2, 'India': 35.7, 'Brazil': 48.9, 'Mexico': 45.4, 'Nigeria': 35.1,
    'Indonesia': 37.9, 'Japan': 32.9, 'Philippines': 42.3, 'Turkey': 41.9, 'Iran': 40.9,
    'Korea': 31.4, 'Thailand': 35.0, 'Pakistan': 31.6, 'Malaysia': 41.1, 'Egypt': 31.5,
    'Colombia': 51.3, 'South Africa': 63.0, 'Vietnam': 35.7, 'Peru': 41.5, 'Saudi Arabia': 45.0,
    'Argentina': 42.9, 'Venezuela': 44.8, 'Ecuador': 47.3, 'Iraq': 38.5, 'Bangladesh': 32.4,
    'Kazakhstan': 27.5, 'Chile': 44.4, 'Panama': 49.8, 'Uruguay': 39.7, 'Singapore': 38.1,
    'United Arab Emirates': 26.0, 'Qatar': 29.0, 'Angola': 51.3, 'Morocco': 39.5,
    'Yemen': 36.7, 'Kenya': 38.9, 'Ethiopia': 35.0, 'Tanzania': 40.5, 'Ghana': 43.5,
    'Uganda': 42.7, 'Algeria': 27.6, 'Sudan': 34.2, 'Nepal': 32.8, 'Sri Lanka': 39.8,
    'Jordan': 33.7, 'Lebanon': 31.8, 'Syria': 35.6, 'Uzbekistan': 35.3, 'Myanmar': 30.7,
    'Cameroon': 46.6, 'Madagascar': 42.6, 'Mozambique': 54.0, 'Zambia': 57.1, 'Zimbabwe': 50.3
}

# Diccionario de proxies nacionales de PIB pc PPP
COUNTRY_GDP_DICT = {
    'Singapore': 130000, 'Qatar': 110000, 'United Arab Emirates': 80000, 'Saudi Arabia': 55000,
    'Japan': 48000, 'Korea': 50000, 'Turkey': 38000, 'Malaysia': 32000, 'China': 21000,
    'Brazil': 18000, 'Mexico': 22000, 'Colombia': 17000, 'Thailand': 20000, 'Egypt': 15000,
    'Indonesia': 14000, 'South Africa': 15000, 'India': 8000, 'Vietnam': 13000,
    'Philippines': 10000, 'Nigeria': 5500, 'Pakistan': 6000, 'Bangladesh': 7500,
    'Kazakhstan': 30000, 'Chile': 28000, 'Panama': 39000, 'Uruguay': 27000, 'Argentina': 26000,
    'Peru': 15000, 'Ecuador': 12000, 'Venezuela': 7000, 'Iraq': 12000, 'Iran': 16000,
    'Algeria': 13000, 'Morocco': 9500, 'Tunisia': 12500, 'Libya': 24000, 'Oman': 37000,
    'Kuwait': 51000, 'Bahrain': 53000, 'Jordan': 11000, 'Lebanon': 12000, 'Syria': 2900,
    'Yemen': 2000, 'Angola': 6500, 'Ethiopia': 3100, 'Kenya': 5300, 'Tanzania': 3300,
    'Ghana': 6900, 'Uganda': 2700, 'Sudan': 4000, 'Mozambique': 1300, 'Zambia': 3800,
    'Zimbabwe': 2500, 'Cameroon': 4400, 'Madagascar': 1700, 'Nepal': 4300, 'Sri Lanka': 14000,
    'Uzbekistan': 9000, 'Myanmar': 4800, 'Cambodia': 5000, 'Laos': 8500, 'Afghanistan': 2000
}

def obtener_grupo_ingresos(pais):
    """
    Retorna el grupo de ingresos del Banco Mundial al que pertenece el país.
    """
    if pais in HIGH_INCOME: return 'High Income'
    if pais in UPPER_MIDDLE: return 'Upper Middle'
    if pais in LOWER_MIDDLE: return 'Lower Middle'
    if pais in LOW_INCOME: return 'Low Income'
    return 'Other'

def imputar_datos_jerarquico(df):
    """
    Aplica el pipeline de imputación jerárquica a las columnas del dataframe:
    Gini, PIB per cápita, Áreas Verdes, Acceso a Transporte.
    """
    df = df.copy()
    
    # 1. Asignar grupo de ingresos a cada ciudad según su país
    df['Income_Group'] = df['Country'].apply(obtener_grupo_ingresos)
    
    # 2. Imputación de Gini
    df['Gini_Clean'] = df['Gini_Index'].fillna(df['Country'].map(COUNTRY_GINI_DICT))
    gini_medians = df.groupby('Income_Group')['Gini_Clean'].median()
    df['Gini_Clean'] = df.apply(
        lambda r: gini_medians[r['Income_Group']] if pd.isnull(r['Gini_Clean']) else r['Gini_Clean'], axis=1
    )
    
    # 3. Imputación de PIB per cápita
    df['GDP_Clean'] = df['CPI_GDP_pc'].fillna(df['Country'].map(COUNTRY_GDP_DICT))
    gdp_medians = df.groupby('Income_Group')['GDP_Clean'].median()
    df['GDP_Clean'] = df.apply(
        lambda r: gdp_medians[r['Income_Group']] if pd.isnull(r['GDP_Clean']) else r['GDP_Clean'], axis=1
    )
    
    # 4. Imputación de Áreas Verdes
    green_medians = df.groupby('Income_Group')['Green_Area_Share'].median()
    df['Green_Clean'] = df.apply(
        lambda r: green_medians[r['Income_Group']] if pd.isnull(r['Green_Area_Share']) else r['Green_Area_Share'], axis=1
    )
    
    # 5. Imputación de Acceso a Transporte
    transport_medians = df.groupby('Income_Group')['Transport_Access'].median()
    df['Transport_Clean'] = df.apply(
        lambda r: transport_medians[r['Income_Group']] if pd.isnull(r['Transport_Access']) else r['Transport_Access'], axis=1
    )
    
    return df

def calcular_indice_ciudades(df):
    """
    Realiza el escalamiento, cálculo de subíndices temáticos, índice compuesto final ACI,
    escenarios alternativos (Social-Led y Green-Led), análisis de clústeres (K-Means)
    y un índice derivado estadísticamente por Componentes Principales (PCA).
    """
    df = df.copy()
    
    # 1. Winsorización de variables directas para mitigar el impacto de outliers extremos (5% al 95%)
    # Esto distribuye equitativamente la escala para el resto de las ciudades.
    for col in ['GDP_Clean', 'Gini_Clean', 'Green_Clean', 'Transport_Clean']:
        lower_bound = df[col].quantile(0.05)
        upper_bound = df[col].quantile(0.95)
        df[col + '_Winsorized'] = df[col].clip(lower=lower_bound, upper=upper_bound)
        
    scaler = MinMaxScaler(feature_range=(0, 100))
    
    # Ránkings OWF (invertidos, rango 1 es mejor)
    df['Economic_Hubs_Score'] = 100 - scaler.fit_transform(df[['Commercial Hubs']])
    df['Export_Champions_Score'] = 100 - scaler.fit_transform(df[['Export Champions']])
    df['Mobility_Connectors_Score'] = 100 - scaler.fit_transform(df[['Mobility Connectors']])
    df['Climate_Resilient_Score'] = 100 - scaler.fit_transform(df[['Climate Resilient']])
    
    # Características directas Winsorizadas (mayor es mejor)
    df['GDP_pc_Score'] = scaler.fit_transform(df[['GDP_Clean_Winsorized']])
    df['Green_Score'] = scaler.fit_transform(df[['Green_Clean_Winsorized']])
    df['Transport_Score'] = scaler.fit_transform(df[['Transport_Clean_Winsorized']])
    
    # Gini Winsorizado (invertido, menor Gini es mejor)
    df['Gini_Score'] = 100 - scaler.fit_transform(df[['Gini_Clean_Winsorized']])
    
    # --- Construcción de los 4 Subíndices ---
    
    # 1. Dinamismo Económico y Enlace Global
    df['Sub_Index_Economic'] = (
        df['Economic_Hubs_Score'] * 0.4 +
        df['Export_Champions_Score'] * 0.3 +
        df['GDP_pc_Score'] * 0.3
    )
    
    # 2. Inclusión Distributiva y Justicia Social
    df['Sub_Index_Equity'] = df['Gini_Score']
    
    # 3. Vitalidad Ecológica y Resiliencia Climática
    df['Sub_Index_Environmental'] = (
        df['Green_Score'] * 0.5 +
        df['Climate_Resilient_Score'] * 0.5
    )
    
    # 4. Movilidad Integrada y Flujo Sostenible
    df['Sub_Index_Mobility'] = (
        df['Transport_Score'] * 0.5 +
        df['Mobility_Connectors_Score'] * 0.5
    )
    
    # --- Índice de Ciudades Alternativo (ACI) Escenario Base (Ponderaciones Equilibradas - 25% c/u) ---
    df['ACI'] = (
        df['Sub_Index_Economic'] * 0.25 +
        df['Sub_Index_Equity'] * 0.25 +
        df['Sub_Index_Environmental'] * 0.25 +
        df['Sub_Index_Mobility'] * 0.25
    )
    df['ACI_Rank'] = df['ACI'].rank(ascending=False, method='min')
    
    # --- Escenario Alternativo 1: Enfoque de Justicia Social (Social-Led) ---
    df['ACI_Social_Led'] = (
        df['Sub_Index_Economic'] * 0.10 +
        df['Sub_Index_Equity'] * 0.40 +
        df['Sub_Index_Environmental'] * 0.20 +
        df['Sub_Index_Mobility'] * 0.30
    )
    df['ACI_Social_Led_Rank'] = df['ACI_Social_Led'].rank(ascending=False, method='min')
    
    # --- Escenario Alternativo 2: Enfoque Ecológico (Green-Led) ---
    df['ACI_Green_Led'] = (
        df['Sub_Index_Economic'] * 0.10 +
        df['Sub_Index_Equity'] * 0.20 +
        df['Sub_Index_Environmental'] * 0.40 +
        df['Sub_Index_Mobility'] * 0.30
    )
    df['ACI_Green_Led_Rank'] = df['ACI_Green_Led'].rank(ascending=False, method='min')
    
    # --- 9. Análisis de Clústeres (K-Means) ---
    features_cluster = ['Sub_Index_Economic', 'Sub_Index_Equity', 'Sub_Index_Environmental', 'Sub_Index_Mobility']
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    df['Cluster_ID'] = kmeans.fit_predict(df[features_cluster])
    
    # Mapear nombres cualitativos premium basados en la caracterización de los centroides
    cluster_names = {
        0: 'Nodos en Transición Dinámica',
        1: 'Comunidades Locales de Baja Escala',
        2: 'Líderes de Sostenibilidad y Alta Conectividad',
        3: 'Metrópolis con Desafíos de Cohesión Social'
    }
    df['Cluster_Name'] = df['Cluster_ID'].map(cluster_names)
    
    # --- 10. Validación Metodológica por PCA ---
    pca = PCA(n_components=1, random_state=42)
    # El primer componente principal captura el factor latente general de bienestar y desarrollo sostenible
    pca_values = pca.fit_transform(df[features_cluster])
    df['ACI_PCA'] = scaler.fit_transform(pca_values) # Escalar a [0, 100]
    df['ACI_PCA_Rank'] = df['ACI_PCA'].rank(ascending=False, method='min')
    
    return df

