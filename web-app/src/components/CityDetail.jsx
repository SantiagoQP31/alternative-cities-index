import React from 'react';
import { Info, GitCompare, X, Activity } from 'lucide-react';

const incomeTranslations = {
  'High Income': 'Ingreso Alto',
  'Upper Middle': 'Ingreso Medio Alto',
  'Lower Middle': 'Ingreso Medio Bajo',
  'Low Income': 'Ingreso Bajo'
};

const clusterProfiles = {
  0: {
    title: 'Nodos en Transición Dinámica',
    desc: 'Ciudades intermedias con economías industriales en rápido crecimiento. Cuentan con accesibilidad de tránsito intermedia y áreas verdes en consolidación, representando el motor del desarrollo emergente.'
  },
  1: {
    title: 'Comunidades Locales de Baja Escala',
    desc: 'Urbes con menor integración comercial y PIB per cápita moderado. Muestran economías más cerradas y retos en transporte masivo, pero con niveles bajos de desigualdad de ingresos.'
  },
  2: {
    title: 'Líderes de Sostenibilidad y Alta Conectividad',
    desc: 'Centros urbanos consolidados con alto PIB pc y excelente equilibrio de políticas ecológicas (más del 25% de áreas verdes) y transporte masivo accesible a toda la población.'
  },
  3: {
    title: 'Metrópolis con Desafíos de Cohesión Social',
    desc: 'Metrópolis de gran envergadura (especialmente de América Latina) con robusta infraestructura de conectividad y economía formal, pero severamente penalizadas por una extrema desigualdad de ingresos (Gini > 48).'
  }
};

function CityDetail({
  selectedCity,
  compareCity,
  setCompareCity,
  activeScenario,
  scenarioConfig
}) {
  if (!selectedCity) return null;

  const scoreField = scenarioConfig.scoreCol;
  const rankField = scenarioConfig.rankCol;
  const activeScore = selectedCity[scoreField] || 0;
  const activeRank = Math.round(selectedCity[rankField] || 0);

  return (
    <div className="details-sidebar">
      {/* 1. MAIN CITY PROFILE CARD */}
      <section className="glass-card editorial-card fade-in-section">
        <h3 className="sidebar-title">
          <Info size={16} className="nav-logo-accent" />
          Ficha Técnica
        </h3>

        <div className="profile-header">
          <div className="profile-meta-title-col">
            <h4 className="profile-city-title">{selectedCity.City}</h4>
            <p className="profile-country-title">
              {selectedCity.Country} • <strong>{incomeTranslations[selectedCity.Income_Group] || selectedCity.Income_Group}</strong>
            </p>
          </div>
          <div className="profile-score-badge">
            <span className="profile-score-number">{activeScore.toFixed(1)}</span>
            <span className="profile-score-rank">Rank #{activeRank}</span>
          </div>
        </div>

        {/* Sub-Indices Progress Bars */}
        <div className="pillar-bars-section">
          <div className="indicators-section-title">Pilares de Desarrollo ACI</div>
          
          <div className="metric-bar-group">
            <div className="pillar-bar-label-row">
              <span>Economía y Comercialización</span>
              <span className="table-score-val">{(selectedCity.Sub_Index_Economic || 0).toFixed(1)}</span>
            </div>
            <div className="pillar-bar-track">
              <div className="pillar-bar-fill bar-econ" style={{ width: `${selectedCity.Sub_Index_Economic}%` }}></div>
            </div>
          </div>

          <div className="metric-bar-group">
            <div className="pillar-bar-label-row">
              <span>Equidad Social (Gini)</span>
              <span className="table-score-val">{(selectedCity.Sub_Index_Equity || 0).toFixed(1)}</span>
            </div>
            <div className="pillar-bar-track">
              <div className="pillar-bar-fill bar-equity" style={{ width: `${selectedCity.Sub_Index_Equity}%` }}></div>
            </div>
          </div>

          <div className="metric-bar-group">
            <div className="pillar-bar-label-row">
              <span>Ecológico y Clima</span>
              <span className="table-score-val">{(selectedCity.Sub_Index_Environmental || 0).toFixed(1)}</span>
            </div>
            <div className="pillar-bar-track">
              <div className="pillar-bar-fill bar-env" style={{ width: `${selectedCity.Sub_Index_Environmental}%` }}></div>
            </div>
          </div>

          <div className="metric-bar-group">
            <div className="pillar-bar-label-row">
              <span>Movilidad Integrada</span>
              <span className="table-score-val">{(selectedCity.Sub_Index_Mobility || 0).toFixed(1)}</span>
            </div>
            <div className="pillar-bar-track">
              <div className="pillar-bar-fill bar-mobility" style={{ width: `${selectedCity.Sub_Index_Mobility}%` }}></div>
            </div>
          </div>
        </div>

        {/* Clean Variables grid */}
        <div className="indicators-section-title">Variables Base Procesadas</div>
        <div className="detail-indicator-grid">
          <div className="detail-ind-box">
            <div className="detail-ind-label">PIB per cápita (PPA)</div>
            <div className="detail-ind-value">
              {selectedCity.GDP_Clean ? `$${selectedCity.GDP_Clean.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : 'N/A'}
            </div>
            <div className="detail-ind-note">Proxy Imputado</div>
          </div>
          
          <div className="detail-ind-box">
            <div className="detail-ind-label">Coeficiente Gini</div>
            <div className="detail-ind-value">
              {selectedCity.Gini_Clean ? `${selectedCity.Gini_Clean.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="detail-ind-note">Escala Relativa</div>
          </div>

          <div className="detail-ind-box">
            <div className="detail-ind-label">Áreas Verdes Públicas</div>
            <div className="detail-ind-value">
              {selectedCity.Green_Clean ? `${selectedCity.Green_Clean.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="detail-ind-note">Espacio Urbano</div>
          </div>

          <div className="detail-ind-box">
            <div className="detail-ind-label">Acceso a Transporte</div>
            <div className="detail-ind-value">
              {selectedCity.Transport_Clean ? `${selectedCity.Transport_Clean.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="detail-ind-note">A &lt;500 metros</div>
          </div>
        </div>

        {/* Archetype qualitative description */}
        <div className="archetype-info-box">
          <div className="arch-title">Clúster: {clusterProfiles[selectedCity.Cluster_ID]?.title}</div>
          <p className="arch-desc">{clusterProfiles[selectedCity.Cluster_ID]?.desc}</p>
        </div>

        {/* Set compare baseline button */}
        {(!compareCity || compareCity.City !== selectedCity.City) && (
          <button 
            className="set-compare-btn"
            onClick={() => setCompareCity(selectedCity)}
          >
            <GitCompare size={14} />
            Establecer para Comparación
          </button>
        )}
      </section>

      {/* 2. DUAL COMPARATIVE PANEL */}
      {compareCity && selectedCity && selectedCity.City !== compareCity.City && (
        <section className="glass-card editorial-card comparison-card fade-in-section">
          <div className="comparison-header">
            <h3 className="sidebar-title" style={{ border: 'none', margin: 0, padding: 0 }}>
              <GitCompare size={16} className="nav-logo-accent" />
              Comparador de Desempeño
            </h3>
            <button className="close-btn" onClick={() => setCompareCity(null)}>
              <X size={14} />
            </button>
          </div>

          <div className="compare-versus-row">
            <div className="compare-city-box primary">
              <div className="compare-city-name">{compareCity.City.split(',')[0]}</div>
              <div className="vs-city-sub" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{compareCity.Country}</div>
              <div className="compare-city-rank">Rank #{Math.round(compareCity[rankField] || 0)}</div>
            </div>
            <div style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>vs</div>
            <div className="compare-city-box">
              <div className="compare-city-name">{selectedCity.City.split(',')[0]}</div>
              <div className="vs-city-sub" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{selectedCity.Country}</div>
              <div className="compare-city-rank" style={{ color: '#38bdf8' }}>Rank #{activeRank}</div>
            </div>
          </div>

          {/* Double horizontal comparison bars */}
          <div className="pillar-bars-section">
            {[
              { label: 'Dinamismo Económico', key: 'Sub_Index_Economic' },
              { label: 'Equidad Social', key: 'Sub_Index_Equity' },
              { label: 'Ecología y Clima', key: 'Sub_Index_Environmental' },
              { label: 'Movilidad Integrada', key: 'Sub_Index_Mobility' },
              { label: 'Índice General ACI', key: 'ACI' }
            ].map(item => {
              const valBase = compareCity[item.key] || 0;
              const valTarget = selectedCity[item.key] || 0;
              const diff = valTarget - valBase;
              
              const total = valBase + valTarget;
              const baseWidth = total > 0 ? (valBase / total) * 100 : 50;
              const targetWidth = total > 0 ? (valTarget / total) * 100 : 50;

              return (
                <div key={item.key} className="compare-double-bar-wrapper">
                  <div className="pillar-bar-label-row">
                    <span>{item.label}</span>
                    <span className={`delta-label ${diff > 0 ? 'pos' : diff < 0 ? 'neg' : ''}`}>
                      {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="compare-double-bar-track">
                    <div className="compare-fill-base" style={{ width: `${baseWidth}%` }} title={`${compareCity.City}: ${valBase.toFixed(1)}`}></div>
                    <div className="compare-fill-target" style={{ width: `${targetWidth}%` }} title={`${selectedCity.City}: ${valTarget.toFixed(1)}`}></div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span>{valBase.toFixed(1)}</span>
                    <span>{valTarget.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default CityDetail;
