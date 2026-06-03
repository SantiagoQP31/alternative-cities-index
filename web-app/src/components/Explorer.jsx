import React from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const incomeTranslations = {
  'High Income': 'Ingreso Alto',
  'Upper Middle': 'Ingreso Medio Alto',
  'Lower Middle': 'Ingreso Medio Bajo',
  'Low Income': 'Ingreso Bajo'
};

const regionTranslations = {
  'East Asia & Pacific': 'Asia Oriental y Pacífico',
  'Europe & Central Asia': 'Europa y Asia Central',
  'Latin America & Caribbean': 'América Latina y el Caribe',
  'Middle East & North Africa': 'Medio Oriente y Norte de África',
  'South Asia': 'Asia del Sur',
  'Sub-Saharan Africa': 'África Subsahariana',
  'Other': 'Otros'
};

const clusterShortNames = {
  0: 'Transición Dinámica',
  1: 'Comunidad Local',
  2: 'Líder de Sostenibilidad',
  3: 'Desafío de Cohesión'
};

function Explorer({
  searchTerm,
  setSearchTerm,
  regionFilter,
  setRegionFilter,
  incomeFilter,
  setIncomeFilter,
  clusterFilter,
  setClusterFilter,
  activeScenario,
  handleScenarioChange,
  filteredCities,
  paginatedCities,
  currentPage,
  setCurrentPage,
  totalPages,
  selectedCity,
  setSelectedCity,
  scenarioConfig,
  regions,
  incomeGroups
}) {
  const { scoreCol, rankCol } = scenarioConfig;

  const handleFilterChange = (setter, val) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <div className="editorial-card fade-in-section">
      <h2 className="card-title">Ranking General y Explorador</h2>
      
      {/* Scenario Tabs with Academic Explanations */}
      <div className="scenario-panel">
        <span className="scenario-panel-title">Escenario de Ponderaciones</span>
        <div className="scenario-buttons-row">
          <button 
            className={`scenario-button-tab ${activeScenario === 'balanced' ? 'active' : ''}`}
            onClick={() => handleScenarioChange('balanced')}
          >
            <span>Equilibrado (ACI)</span>
            <span className="scenario-button-tab-desc">25% por dimensión</span>
          </button>
          <button 
            className={`scenario-button-tab ${activeScenario === 'pca' ? 'active' : ''}`}
            onClick={() => handleScenarioChange('pca')}
          >
            <span>PCA Empírico</span>
            <span className="scenario-button-tab-desc">Cargas de Varianza</span>
          </button>
          <button 
            className={`scenario-button-tab ${activeScenario === 'social' ? 'active' : ''}`}
            onClick={() => handleScenarioChange('social')}
          >
            <span>Social-Led</span>
            <span className="scenario-button-tab-desc">40% Equidad / 30% Mov</span>
          </button>
          <button 
            className={`scenario-button-tab ${activeScenario === 'green' ? 'active' : ''}`}
            onClick={() => handleScenarioChange('green')}
          >
            <span>Green-Led</span>
            <span className="scenario-button-tab-desc">40% Eco / 30% Mov</span>
          </button>
        </div>
      </div>

      {/* Multi-variable Filters */}
      <div className="filter-panel">
        <div className="filter-input-wrapper">
          <Search size={16} className="filter-search-icon" />
          <input 
            type="text" 
            className="filter-search-input" 
            placeholder="Buscar por ciudad o país..." 
            value={searchTerm}
            onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
          />
        </div>

        <select 
          className="filter-dropdown"
          value={regionFilter}
          onChange={(e) => handleFilterChange(setRegionFilter, e.target.value)}
        >
          <option value="">Todas las regiones</option>
          {regions.map(r => (
            <option key={r} value={r}>{regionTranslations[r] || r}</option>
          ))}
        </select>

        <select 
          className="filter-dropdown"
          value={incomeFilter}
          onChange={(e) => handleFilterChange(setIncomeFilter, e.target.value)}
        >
          <option value="">Todos los ingresos</option>
          {incomeGroups.map(ig => (
            <option key={ig} value={ig}>{incomeTranslations[ig] || ig}</option>
          ))}
        </select>

        <select 
          className="filter-dropdown"
          value={clusterFilter}
          onChange={(e) => handleFilterChange(setClusterFilter, e.target.value)}
        >
          <option value="">Todos los clústeres</option>
          <option value="0">Transición Dinámica</option>
          <option value="1">Comunidad Local</option>
          <option value="2">Líderes de Sostenibilidad</option>
          <option value="3">Desafíos Cohesión Social</option>
        </select>
      </div>

      {/* Table Metadata */}
      <div className="table-pagination-row" style={{ marginTop: 0, paddingBottom: '12px' }}>
        <span className="page-info-label">
          Mostrando <strong>{filteredCities.length}</strong> ciudades de {filteredCities.length === 1500 ? '1,500' : filteredCities.length} en el ranking
        </span>
      </div>

      {/* Rankings Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>Rango</th>
              <th>Ciudad</th>
              <th>Región</th>
              <th>Tipología Urbana</th>
              <th style={{ width: '100px', textAlign: 'right' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCities.map((city) => {
              const score = city[scoreCol] || 0;
              const globalRank = Math.round(city[rankCol] || 0);
              const isSelected = selectedCity && selectedCity.City === city.City;

              return (
                <tr 
                  key={city.City} 
                  className={`data-table-row ${isSelected ? 'selected-row' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  <td style={{ textAlign: 'center' }}>
                    <span className="pos-badge">{globalRank}</span>
                  </td>
                  <td>
                    <span className="cell-city">{city.City}</span>
                    <span className="cell-country">{city.Country}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {regionTranslations[city.Region] || city.Region}
                    </span>
                  </td>
                  <td>
                    <span className={`archetype-badge c${city.Cluster_ID}`}>
                      {clusterShortNames[city.Cluster_ID] || city.Cluster_Name}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="table-score-val" style={{ color: 'var(--color-accent)' }}>
                      {score.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredCities.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No se encontraron registros coincidentes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination row */}
      {totalPages > 1 && (
        <div className="table-pagination-row">
          <span className="page-info-label">
            Página <strong>{currentPage}</strong> de {totalPages}
          </span>
          <div className="pagination-btn-group">
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} style={{ marginRight: '4px' }} />
              Anterior
            </button>
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explorer;
