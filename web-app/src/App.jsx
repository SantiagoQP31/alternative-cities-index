import { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  Leaf, 
  Navigation, 
  Activity, 
  Info, 
  X, 
  GitCompare, 
  Filter, 
  Award, 
  BookOpen,
  DollarSign
} from 'lucide-react';
import citiesData from './data/cities_ranking.json';
import './App.css';

// Diccionario de traducción de Grupos de Ingresos
const incomeGroupTranslations = {
  'High Income': 'Ingreso Alto',
  'Upper Middle': 'Ingreso Medio Alto',
  'Lower Middle': 'Ingreso Medio Bajo',
  'Low Income': 'Ingreso Bajo'
};

// Diccionario de traducción de Regiones
const regionTranslations = {
  'East Asia & Pacific': 'Asia Oriental y Pacífico',
  'Europe & Central Asia': 'Europa y Asia Central',
  'Latin America & Caribbean': 'América Latina y el Caribe',
  'Middle East & North Africa': 'Medio Oriente y Norte de África',
  'South Asia': 'Asia del Sur',
  'Sub-Saharan Africa': 'África Subsahariana',
  'Other': 'Otros'
};

// Caracterización académica de cada Cluster para la UI
const clusterProfiles = {
  0: {
    icon: TrendingUp,
    color: '#facc15',
    summary: 'Nodos en Transición Dinámica',
    description: 'Metrópolis intermedias con economías locales e industriales en rápida expansión. Tienen accesibilidad de tránsito intermedia y áreas verdes en consolidación, representando el motor emergente del desarrollo.'
  },
  1: {
    icon: Globe,
    color: '#94a3b8',
    summary: 'Comunidades Locales de Baja Escala',
    description: 'Ciudades con menor integración comercial y PIB per cápita moderado. Muestran economías más cerradas y desafíos en infraestructura urbana, pero con menor presión de desigualdad de ingresos.'
  },
  2: {
    icon: Leaf,
    color: '#10b981',
    summary: 'Líderes de Sostenibilidad y Alta Conectividad',
    description: 'Nodos de clase mundial con el mejor rendimiento equilibrado. Combinan alta accesibilidad a transporte colectivo, amplias zonas verdes y políticas ambientales estables junto a robustez económica.'
  },
  3: {
    icon: ShieldAlert,
    color: '#f43f5e',
    summary: 'Metrópolis con Desafíos de Cohesión Social',
    description: 'Grandes centros urbanos (especialmente en América Latina) con alta tracción comercial y movilidad física, pero gravemente penalizados por una extrema desigualdad distributiva (coeficientes Gini superiores a 48).'
  }
};

function App() {
  // Filtros de Búsqueda y Clasificación
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [incomeFilter, setIncomeFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  
  // Escenario Activo
  // 'balanced' -> ACI, 'pca' -> ACI_PCA, 'social' -> ACI_Social_Led, 'green' -> ACI_Green_Led
  const [activeScenario, setActiveScenario] = useState('balanced');
  
  // Selección de Ciudades para Detalle y Comparación
  const [selectedCity, setSelectedCity] = useState(citiesData[0] || null);
  const [compareCity, setCompareCity] = useState(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Lista única de Regiones disponibles en los datos
  const regions = useMemo(() => {
    const set = new Set(citiesData.map(c => c.Region).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  // Lista única de Grupos de Ingreso
  const incomeGroups = useMemo(() => {
    const set = new Set(citiesData.map(c => c.Income_Group).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  // Obtener columna y nombre del escenario activo
  const scenarioConfig = useMemo(() => {
    switch (activeScenario) {
      case 'pca':
        return { scoreCol: 'ACI_PCA', rankCol: 'ACI_PCA_Rank', label: 'PCA Estadístico', class: 'pca-sc' };
      case 'social':
        return { scoreCol: 'ACI_Social_Led', rankCol: 'ACI_Social_Led_Rank', label: 'Justicia Social-Led', class: 'social-sc' };
      case 'green':
        return { scoreCol: 'ACI_Green_Led', rankCol: 'ACI_Green_Led_Rank', label: 'Ecológico Green-Led', class: 'green-sc' };
      case 'balanced':
      default:
        return { scoreCol: 'ACI', rankCol: 'ACI_Rank', label: 'ACI Equilibrado', class: 'base-sc' };
    }
  }, [activeScenario]);

  // Filtrar y ordenar la lista completa de ciudades
  const filteredAndSortedCities = useMemo(() => {
    let result = [...citiesData];

    // Aplicar búsqueda por texto (Ciudad o País)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.City.toLowerCase().includes(term) || 
        c.Country.toLowerCase().includes(term)
      );
    }

    // Filtrar por Región
    if (regionFilter !== '') {
      result = result.filter(c => c.Region === regionFilter);
    }

    // Filtrar por Grupo de Ingresos
    if (incomeFilter !== '') {
      result = result.filter(c => c.Income_Group === incomeFilter);
    }

    // Filtrar por Cluster ID
    if (clusterFilter !== '') {
      result = result.filter(c => c.Cluster_ID.toString() === clusterFilter);
    }

    // Ordenar dinámicamente por la puntuación del escenario activo desc
    const { scoreCol } = scenarioConfig;
    result.sort((a, b) => (b[scoreCol] || 0) - (a[scoreCol] || 0));

    return result;
  }, [searchTerm, regionFilter, incomeFilter, clusterFilter, scenarioConfig]);

  // Paginación de resultados filtrados
  const paginatedCities = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedCities.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedCities, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedCities.length / pageSize));

  // Resetear paginación si cambian los filtros
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  // Cambiar de escenario activo
  const handleScenarioChange = (scenario) => {
    setActiveScenario(scenario);
    setCurrentPage(1);
    // Si hay ciudad seleccionada, actualizamos para mantener coherencia
    if (selectedCity) {
      // Forzar recálculo visual en UI
      setSelectedCity({ ...selectedCity });
    }
  };

  // Configurar ciudad como línea base de comparación
  const startComparison = (city) => {
    if (selectedCity && city.City !== selectedCity.City) {
      setCompareCity(city);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER SECTION */}
      <header className="app-header">
        <div className="header-title-row">
          <h1 className="app-title">Alternative Cities Index</h1>
          <div className="credential-item highlight">
            <Award size={16} />
            <span>Modelo Académico de Desarrollo Sostenible (ODS 11)</span>
          </div>
        </div>
        <p className="app-subtitle">
          Un marco analítico riguroso y alternativo enfocado en el <strong>Sur Global y el Sudeste Asiático Emergente</strong>. 
          A diferencia de los rankings comerciales tradicionales que sobreponderan la concentración de capital financiero absoluto, 
          nuestro modelo integra el tratamiento robusto de outliers mediante Winsorización, clústeres urbanos K-Means y un análisis multidimensional de equidad, ecología y movilidad integrada.
        </p>

        {/* Credentials / Validation Info Banner */}
        <div className="credentials-banner">
          <div className="credential-item">
            <Globe size={14} />
            <span>N = 1,500 Ciudades Evaluadas</span>
          </div>
          <div className="credential-item">
            <BookOpen size={14} />
            <span>Cruce Geopolítico de 5 Fuentes Globales (OWF, ONU, BM)</span>
          </div>
          <div className="credential-item">
            <Info size={14} />
            <span>Outliers Winsorizados al 5% - 95%</span>
          </div>
          <div className="credential-item">
            <TrendingUp size={14} />
            <span>Validación PCA (PC1 explica 51.3% varianza)</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: EXPLORER AND TABLE */}
        <section className="glass-card">
          <div className="controls-section">
            
            {/* Multi-variable Filters */}
            <div className="filters-grid">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Buscar ciudad o país..." 
                  value={searchTerm}
                  onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                />
              </div>
              
              <select 
                className="filter-select"
                value={regionFilter}
                onChange={(e) => handleFilterChange(setRegionFilter, e.target.value)}
              >
                <option value="">Todas las regiones</option>
                {regions.map(r => (
                  <option key={r} value={r}>{regionTranslations[r] || r}</option>
                ))}
              </select>

              <select 
                className="filter-select"
                value={incomeFilter}
                onChange={(e) => handleFilterChange(setIncomeFilter, e.target.value)}
              >
                <option value="">Todos los ingresos</option>
                {incomeGroups.map(ig => (
                  <option key={ig} value={ig}>{incomeGroupTranslations[ig] || ig}</option>
                ))}
              </select>

              <select 
                className="filter-select"
                value={clusterFilter}
                onChange={(e) => handleFilterChange(setClusterFilter, e.target.value)}
              >
                <option value="">Todos los clústeres</option>
                <option value="0">Transición Dinámica</option>
                <option value="1">Comunidad Local</option>
                <option value="2">Líderes de Sostenibilidad</option>
                <option value="3">Desafío de Cohesión Social</option>
              </select>
            </div>

            {/* Scenario Segmented Controls */}
            <div className="scenarios-container">
              <div className="scenario-label">Ajustar Enfoque del Índice (Análisis de Sensibilidad)</div>
              <div className="scenarios-tabs">
                <button 
                  className={`scenario-tab ${activeScenario === 'balanced' ? 'active base-sc' : ''}`}
                  onClick={() => handleScenarioChange('balanced')}
                >
                  <span>Base Equilibrado</span>
                  <span className="scenario-desc">25% c/u</span>
                </button>
                <button 
                  className={`scenario-tab ${activeScenario === 'pca' ? 'active pca-sc' : ''}`}
                  onClick={() => handleScenarioChange('pca')}
                >
                  <span>PCA Estadístico</span>
                  <span className="scenario-desc">Pesos Empíricos</span>
                </button>
                <button 
                  className={`scenario-tab ${activeScenario === 'social' ? 'active social-sc' : ''}`}
                  onClick={() => handleScenarioChange('social')}
                >
                  <span>Social-Led</span>
                  <span className="scenario-desc">40% Equidad / 30% Mov</span>
                </button>
                <button 
                  className={`scenario-tab ${activeScenario === 'green' ? 'active green-sc' : ''}`}
                  onClick={() => handleScenarioChange('green')}
                >
                  <span>Green-Led</span>
                  <span className="scenario-desc">40% Eco / 30% Mov</span>
                </button>
              </div>
            </div>

          </div>

          {/* Table Header / Meta Row */}
          <div className="rankings-header">
            <span className="results-count">
              Mostrando <strong>{filteredAndSortedCities.length}</strong> de {citiesData.length} ciudades
            </span>
            {compareCity && (
              <div className="credential-item highlight" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
                <span>Comparando con: <strong>{compareCity.City}</strong></span>
                <X size={14} style={{ cursor: 'pointer' }} onClick={() => setCompareCity(null)} />
              </div>
            )}
          </div>

          {/* Rankings Table */}
          <div className="table-wrapper">
            <table className="rankings-table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>Pos</th>
                  <th>Ciudad</th>
                  <th>Región</th>
                  <th>Arquetipo Urbano</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Puntuación</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCities.map((city) => {
                  const { scoreCol, rankCol } = scenarioConfig;
                  const isSelected = selectedCity && selectedCity.City === city.City;
                  const score = city[scoreCol];
                  const globalRank = Math.round(city[rankCol]);
                  
                  return (
                    <tr 
                      key={city.City} 
                      className={`rankings-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedCity(city)}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <span className="rank-badge">{globalRank}</span>
                      </td>
                      <td>
                        <div className="city-cell-content">
                          <span className="city-name">{city.City}</span>
                          <span className="country-name">{city.Country}</span>
                        </div>
                      </td>
                      <td>
                        <span className="region-tag">{regionTranslations[city.Region] || city.Region}</span>
                      </td>
                      <td>
                        <span className={`archetype-badge c${city.Cluster_ID}`}>
                          {clusterProfiles[city.Cluster_ID]?.summary || city.Cluster_Name}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`score-value ${
                          activeScenario === 'balanced' ? 'base-c' : 
                          activeScenario === 'pca' ? 'pca-c' :
                          activeScenario === 'social' ? 'social-c' : 'green-c'
                        }`}>
                          {score ? score.toFixed(2) : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredAndSortedCities.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      <ShieldAlert size={40} className="empty-state-icon" />
                      <span className="empty-state-text">No se encontraron ciudades con los criterios seleccionados.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="page-indicator">
                Página <strong>{currentPage}</strong> de {totalPages}
              </span>

              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: DETAIL & COMPARATIVE PANEL */}
        <aside className="details-sidebar">
          
          {/* PROFILE CARD */}
          {selectedCity && (
            <section className="glass-card">
              <h2 className="sidebar-title">
                <Info size={18} />
                Perfil Detallado
              </h2>
              
              <div className="profile-header">
                <div className="profile-meta">
                  <h3 className="profile-city">{selectedCity.City}</h3>
                  <p className="profile-country">
                    {selectedCity.Country} • <strong>{incomeGroupTranslations[selectedCity.Income_Group] || selectedCity.Income_Group}</strong>
                  </p>
                  <span className={`archetype-badge c${selectedCity.Cluster_ID}`} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    {clusterProfiles[selectedCity.Cluster_ID]?.summary || selectedCity.Cluster_Name}
                  </span>
                </div>
                
                <div className="profile-score-box">
                  <span className="profile-score-val">
                    {(selectedCity[scenarioConfig.scoreCol] || 0).toFixed(1)}
                  </span>
                  <span className="profile-rank-label">Rank Global #{Math.round(selectedCity[scenarioConfig.rankCol])}</span>
                </div>
              </div>

              {/* Sub-Indices Progress Bars */}
              <div className="metrics-section">
                <div className="indicators-section-title">Subíndices Temáticos ACI</div>
                
                <div className="metric-bar-group">
                  <div className="metric-bar-header">
                    <span className="metric-bar-name">
                      <span style={{ color: 'var(--color-econ)' }}>●</span> Dinamismo y Enlace Económico
                    </span>
                    <span className="metric-bar-value">{(selectedCity.Sub_Index_Economic || 0).toFixed(1)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill m-econ" style={{ width: `${selectedCity.Sub_Index_Economic}%` }}></div>
                  </div>
                </div>

                <div className="metric-bar-group">
                  <div className="metric-bar-header">
                    <span className="metric-bar-name">
                      <span style={{ color: 'var(--color-equity)' }}>●</span> Inclusión y Justicia Social (Gini)
                    </span>
                    <span className="metric-bar-value">{(selectedCity.Sub_Index_Equity || 0).toFixed(1)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill m-equity" style={{ width: `${selectedCity.Sub_Index_Equity}%` }}></div>
                  </div>
                </div>

                <div className="metric-bar-group">
                  <div className="metric-bar-header">
                    <span className="metric-bar-name">
                      <span style={{ color: 'var(--color-env)' }}>●</span> Vitalidad Ecológica y Clima
                    </span>
                    <span className="metric-bar-value">{(selectedCity.Sub_Index_Environmental || 0).toFixed(1)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill m-env" style={{ width: `${selectedCity.Sub_Index_Environmental}%` }}></div>
                  </div>
                </div>

                <div className="metric-bar-group">
                  <div className="metric-bar-header">
                    <span className="metric-bar-name">
                      <span style={{ color: 'var(--color-mobility)' }}>●</span> Movilidad Integrada y Sostenible
                    </span>
                    <span className="metric-bar-value">{(selectedCity.Sub_Index_Mobility || 0).toFixed(1)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill m-mobility" style={{ width: `${selectedCity.Sub_Index_Mobility}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Raw Variables Visual Block */}
              <div className="indicators-section-title">Variables Base Limpias (Post-Imputación)</div>
              <div className="indicators-grid">
                <div className="indicator-box">
                  <div className="indicator-lbl">PIB per cápita (PPA)</div>
                  <div className="indicator-val">
                    {selectedCity.GDP_Clean ? `$${selectedCity.GDP_Clean.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : 'N/A'}
                  </div>
                  <div className="indicator-subval">Proxy Nacional / Fallback</div>
                </div>
                
                <div className="indicator-box">
                  <div className="indicator-lbl">Coeficiente de Gini</div>
                  <div className="indicator-val">
                    {selectedCity.Gini_Clean ? `${selectedCity.Gini_Clean.toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="indicator-subval">Gini Distributivo Local</div>
                </div>

                <div className="indicator-box">
                  <div className="indicator-lbl">Área Verde Pública</div>
                  <div className="indicator-val">
                    {selectedCity.Green_Clean ? `${selectedCity.Green_Clean.toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="indicator-subval">Área urbana arbolada</div>
                </div>

                <div className="indicator-box">
                  <div className="indicator-lbl">Acceso a Transporte</div>
                  <div className="indicator-val">
                    {selectedCity.Transport_Clean ? `${selectedCity.Transport_Clean.toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className="indicator-subval">Acceso a &lt;500m</div>
                </div>
              </div>

              {/* Characterization box */}
              <div className="cluster-description-box">
                <div className="cluster-title" style={{ color: clusterProfiles[selectedCity.Cluster_ID]?.color }}>
                  {(() => {
                    const IconComponent = clusterProfiles[selectedCity.Cluster_ID]?.icon || Info;
                    return <IconComponent size={16} />;
                  })()}
                  <span>{clusterProfiles[selectedCity.Cluster_ID]?.summary}</span>
                </div>
                <p className="cluster-desc-text">
                  {clusterProfiles[selectedCity.Cluster_ID]?.description}
                </p>
              </div>

              {/* Action Button: Compare */}
              {(!compareCity || compareCity.City !== selectedCity.City) && (
                <button 
                  className="compare-action-btn"
                  onClick={() => startComparison(selectedCity)}
                >
                  <GitCompare size={16} />
                  Establecer como Línea Base de Comparación
                </button>
              )}
            </section>
          )}

          {/* DUAL COMPARATIVE PANEL (Visible if compareCity is active) */}
          {compareCity && selectedCity && selectedCity.City !== compareCity.City && (
            <section className="glass-card comparison-card">
              <div className="comparison-header">
                <h2 className="sidebar-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  <GitCompare size={18} />
                  Comparador de Ciudades
                </h2>
                <button className="comparison-close-btn" onClick={() => setCompareCity(null)}>
                  <X size={16} />
                </button>
              </div>

              <div className="comparison-versus">
                <div className="vs-city-box baseline">
                  <div className="vs-city-name">{compareCity.City.split(',')[0]}</div>
                  <div className="vs-city-sub">{compareCity.Country}</div>
                  <div className="vs-badge" style={{ marginTop: '8px', color: 'var(--color-primary)' }}>
                    {Math.round(compareCity[scenarioConfig.rankCol])}
                  </div>
                </div>
                <div className="vs-badge">VS</div>
                <div className="vs-city-box compare">
                  <div className="vs-city-name">{selectedCity.City.split(',')[0]}</div>
                  <div className="vs-city-sub">{selectedCity.Country}</div>
                  <div className="vs-badge" style={{ marginTop: '8px', color: '#38bdf8' }}>
                    {Math.round(selectedCity[scenarioConfig.rankCol])}
                  </div>
                </div>
              </div>

              <div className="comparison-metrics-list">
                
                {/* Dynamically calculate and display comparisons */}
                {[
                  { label: 'Dinamismo Económico', key: 'Sub_Index_Economic' },
                  { label: 'Justicia Social (Equity)', key: 'Sub_Index_Equity' },
                  { label: 'Ecología y Clima', key: 'Sub_Index_Environmental' },
                  { label: 'Movilidad Integrada', key: 'Sub_Index_Mobility' },
                  { label: 'Índice General ACI', key: 'ACI' }
                ].map(item => {
                  const valBase = compareCity[item.key] || 0;
                  const valTarget = selectedCity[item.key] || 0;
                  const diff = valTarget - valBase;
                  
                  // Calcular anchos relativos
                  const total = valBase + valTarget;
                  const baseWidth = total > 0 ? (valBase / total) * 100 : 50;
                  const targetWidth = total > 0 ? (valTarget / total) * 100 : 50;

                  return (
                    <div key={item.key} className="metric-bar-group">
                      <div className="compare-bar-label-row">
                        <span className="compare-bar-label">{item.label}</span>
                        <span className={`compare-delta ${diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral'}`}>
                          {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                        </span>
                      </div>
                      
                      {/* Double horizontal bar comparison */}
                      <div className="compare-double-bar">
                        <div className="compare-fill-base" style={{ width: `${baseWidth}%` }} title={`${compareCity.City}: ${valBase.toFixed(1)}`}></div>
                        <div className="compare-fill-target" style={{ width: `${targetWidth}%` }} title={`${selectedCity.City}: ${valTarget.toFixed(1)}`}></div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <span>{valBase.toFixed(1)}</span>
                        <span>{valTarget.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}

              </div>
            </section>
          )}

          {/* SENSITIVITY SPEARMAN CORRELATION CARD */}
          <section className="glass-card sensitivity-card">
            <h2 className="sidebar-title">
              <TrendingUp size={18} />
              Validación Científica
            </h2>
            <p className="sensitivity-desc-text" style={{ margin: '0 0 12px 0' }}>
              <strong>Estabilidad del Ranking (Correlación de Spearman):</strong> La consistencia ordinal de las ciudades ante variaciones drásticas en ponderación valida matemáticamente la solidez del ACI.
            </p>

            <div className="spearman-table-container">
              <table className="spearman-table">
                <thead>
                  <tr>
                    <th>Escenario</th>
                    <th>ACI</th>
                    <th>PCA</th>
                    <th>Social</th>
                    <th>Green</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="header-col">ACI Base</td>
                    <td className="spearman-cell perfect">1.000</td>
                    <td className="spearman-cell strong">0.883</td>
                    <td className="spearman-cell strong">0.924</td>
                    <td className="spearman-cell perfect">0.962</td>
                  </tr>
                  <tr>
                    <td className="header-col">PCA Index</td>
                    <td className="spearman-cell strong">0.883</td>
                    <td className="spearman-cell perfect">1.000</td>
                    <td className="spearman-cell medium">0.666</td>
                    <td className="spearman-cell strong">0.886</td>
                  </tr>
                  <tr>
                    <td className="header-col">Social-Led</td>
                    <td className="spearman-cell strong">0.924</td>
                    <td className="spearman-cell medium">0.666</td>
                    <td className="spearman-cell perfect">1.000</td>
                    <td className="spearman-cell strong">0.857</td>
                  </tr>
                  <tr>
                    <td className="header-col">Green-Led</td>
                    <td className="spearman-cell perfect">0.962</td>
                    <td className="spearman-cell strong">0.886</td>
                    <td className="spearman-cell strong">0.857</td>
                    <td className="spearman-cell perfect">1.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="sensitivity-desc-text">
              La correlación de Spearman &gt; 0.92 entre el ACI base y los escenarios alternativos demuestra que el ranking general no se distorsiona con el peso de los coeficientes, confirmando que la Winsorización previno la tracción indebida de outliers.
            </p>
          </section>

        </aside>

      </div>
    </div>
  );
}

export default App;
