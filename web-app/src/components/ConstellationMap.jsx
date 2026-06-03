import React, { useState, useMemo } from 'react';
import { Info, Globe } from 'lucide-react';

function ConstellationMap({ cities, selectedCity, setSelectedCity, activeScenario }) {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map dimensions
  const width = 1000;
  const height = 500;

  // Equirectangular Projection
  const project = (lat, lng) => {
    // Convert lat/lng to x/y coordinates
    const x = ((parseFloat(lng) + 180) / 360) * width;
    // Account for vertical flip in SVG space
    const y = ((90 - parseFloat(lat)) / 180) * height;
    return { x, y };
  };

  const mapData = useMemo(() => {
    return cities.map(city => {
      if (city.Lat === null || city.Lng === null) return null;
      const { x, y } = project(city.Lat, city.Lng);
      return {
        ...city,
        x,
        y
      };
    }).filter(Boolean);
  }, [cities]);

  const handleMouseMove = (e, city) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredCity(city);
    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredCity(null);
  };

  const getScoreField = () => {
    switch (activeScenario) {
      case 'pca': return 'ACI_PCA';
      case 'social': return 'ACI_Social_Led';
      case 'green': return 'ACI_Green_Led';
      case 'balanced':
      default:
        return 'ACI';
    }
  };

  return (
    <div className="editorial-card fade-in-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ textAlign: 'left' }}>
        <h2 className="card-title" style={{ display: 'flex', alignPage: 'center', gap: '8px', margin: 0 }}>
          <Globe size={20} className="nav-logo-accent" />
          Constelación Urbana Global
        </h2>
        <p className="card-subtitle" style={{ margin: '4px 0 0 0' }}>
          Visualización geoespacial de las 1,500 ciudades. La distribución natural de los puntos dibuja las masas continentales de interés para la investigación (Sur Global y Asia Oriental Emergente).
        </p>
      </div>

      <div className="map-visual-area">
        {/* SVG Map Grid Background */}
        <svg className="constellation-svg" viewBox={`0 0 ${width} ${height}`}>
          {/* Latitude & Longitude Grid Lines */}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
            const x = ((lng + 180) / 360) * width;
            return <line key={`lng-${lng}`} x1={x} y1={0} x2={x} y2={height} className="map-bg-grid" />;
          })}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * height;
            return <line key={`lat-${lat}`} x1={0} y1={y} x2={width} y2={y} className="map-bg-grid" />;
          })}

          {/* City Nodes */}
          {mapData.map((city) => {
            const isSelected = selectedCity && selectedCity.City === city.City;
            const scoreField = getScoreField();
            const score = city[scoreField];
            
            return (
              <circle
                key={city.City}
                cx={city.x}
                cy={city.y}
                r={isSelected ? 6.5 : 3.5}
                className={`map-city-node cc-c${city.Cluster_ID} ${isSelected ? 'selected-node' : ''}`}
                onMouseMove={(e) => handleMouseMove(e, city)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setSelectedCity(city)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredCity && (
          <div 
            className="map-tooltip" 
            style={{ 
              left: `${tooltipPos.x}px`, 
              top: `${tooltipPos.y}px` 
            }}
          >
            <span className="map-tooltip-city">{hoveredCity.City}</span>
            <span className="map-tooltip-meta">{hoveredCity.Country} • Clúster {hoveredCity.Cluster_ID}</span>
            <span className="map-tooltip-meta">Puntaje: <strong>{hoveredCity[getScoreField()].toFixed(2)}</strong></span>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="map-legend-bar">
        <div className="map-legend-item">
          <span className="legend-dot c2" />
          <span>Líderes de Sostenibilidad</span>
        </div>
        <div className="map-legend-item">
          <span className="legend-dot c0" />
          <span>Transición Dinámica</span>
        </div>
        <div className="map-legend-item">
          <span className="legend-dot c3" />
          <span>Desafíos Cohesión Social</span>
        </div>
        <div className="map-legend-item">
          <span className="legend-dot c1" />
          <span>Comunidades de Baja Escala</span>
        </div>
      </div>
    </div>
  );
}

export default ConstellationMap;
