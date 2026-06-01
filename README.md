# alternative-cities-index

Proyecto de investigación desarrollado en el marco del **Semillero de Investigación de la Universidad Tecnológica de Bolívar**. Su propósito es analizar críticamente los sesgos de los rankings de ciudades globales (tomando como caso de estudio el reporte de *Oliver Wyman Forum*) y diseñar un índice multivariable alternativo y más equitativo para medir el desarrollo urbano y la sostenibilidad, centrado en el Sur Global.

---

## Objetivos del Proyecto

1. **Evidenciar sesgos estructurales:** Identificar colinealidades severas (redundancias) y desiertos de datos geográficos en el modelo comercial tradicional de evaluación urbana.
2. **Diseñar un índice alternativo y equitativo:** Integrar características de sostenibilidad (áreas verdes, transporte público, crecimiento espacial, población) y de equidad social (coeficiente de Gini) usando bases de datos globales de **ONU-Hábitat** y **OECD**.
3. **Desarrollar una aplicación web interactiva:** Crear un panel visual moderno en **Vite + React** para mapear las ciudades, comparar las puntuaciones originales de Oliver Wyman frente a nuestro índice propuesto y democratizar el acceso a los hallazgos de la investigación.

---

## Estructura del Proyecto

El proyecto está organizado bajo los más altos estándares de desarrollo y buenas prácticas:

```text
alternative-cities-index/
├── .gitignore                      # Exclusiones de Git (Ignora la carpeta data/)
├── README.md                       # Documentación principal (este archivo)
├── requirements.txt                # Dependencias de Python
├── data/                           # [EXCLUIDO EN GIT] Carpeta local de datos
│   ├── raw/                        # Datos crudos originales (Solo Lectura)
│   │   ├── oliver-wyman-forum-target/
│   │   │   └── book-cities-shaping-the-future.xlsx
│   │   └── urban-indicator-database-features/
│   │       ├── city-prosperity-index-cpi/
│   │       ├── economic-indicators/
│   │       ├── open-spaces-and-green-areas/
│   │       ├── spatial-growth-of-cities-and-urban-areas/
│   │       ├── urban-population-trends/
│   │       └── urban-transport/
│   └── processed/                  # Datos limpios y unificados generados
├── notebooks/                      # Libretas Jupyter estructuradas secuencialmente
│   ├── 01_exploracion_target_owf.ipynb    # Spearman, VIF y PCA del OWF original
│   ├── 02_exploracion_features.ipynb      # Análisis exploratorio de bases complementarias
│   └── 03_integracion_y_indice.ipynb      # Cruce de datos y formulación del índice propio
├── src/                            # Código modular (Clean Code)
│   ├── data_loader.py              # Carga segura en Windows (MAX_PATH)
│   ├── data_cleaning.py            # Normalización de ciudades y textos
│   └── index_builder.py            # Fórmulas de scoring y cálculo del índice
├── scripts/
│   └── run_pipeline.py             # Script de automatización (pipeline de datos)
└── web-app/                        # Aplicación interactiva en Vite + React (Próximamente)
```

---

## Configuración del Entorno de Python

### 1. Clonar el repositorio y configurar carpetas locales
Dado que la carpeta `data/` está excluida en Git por derechos de autor del dataset de Oliver Wyman, debes crear manualmente la estructura local de carpetas:

```bash
mkdir -p data/raw data/processed
```

Coloca los archivos de datos en `data/raw/` respetando los nombres de directorio descritos en la sección de estructura.

### 2. Instalar las dependencias
Se recomienda utilizar un entorno virtual de Python:

```bash
python -m venv venv
venv\Scripts\activate   # En Windows
# source venv/bin/activate # En macOS/Linux

pip install -r requirements.txt
```

---

## Ejecución de la Investigación

La investigación se puede seguir en orden secuencial dentro de la carpeta `notebooks/`:

1. [01_exploracion_target_owf.ipynb](notebooks/01_exploracion_target_owf.ipynb): Analiza la colinealidad del ranking de Oliver Wyman y los sesgos geográficos continentales mediante Voronoi y PCA.
2. [02_exploracion_features.ipynb](notebooks/02_exploracion_features.ipynb): Limpia y analiza individualmente las bases de ONU y OECD.
3. [03_integracion_y_indice.ipynb](notebooks/03_integracion_y_indice.ipynb): Fusiona los datasets mediante normalización léxica y calcula el nuevo índice ponderado y balanceado de sostenibilidad urbana.
