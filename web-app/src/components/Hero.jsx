import React from 'react';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';

function Hero({ setActiveTab }) {
  return (
    <section className="hero-section fade-in-section">
      <div className="hero-narrative">
        <span className="hero-tag">Investigación de Semillero</span>
        <h1 className="hero-title">Rediseñando la Gravedad Urbana: El Alternative Cities Index en el Sur Global</h1>
        <p className="hero-desc">
          Los rankings urbanos tradicionales, como el elaborado por Oliver Wyman Forum (OWF), están diseñados bajo una perspectiva comercial y de capital corporativo, 
          premiando de manera desproporcionada la concentración de flujos de capital absoluto y el volumen financiero histórico. Esto invisibiliza a las ciudades en desarrollo 
          y crea "desiertos de datos" en continentes enteros del Sur Global.
        </p>
        <p className="hero-desc">
          El <strong>Alternative Cities Index (ACI)</strong> propone un paradigma alternativo y riguroso. Evaluando a las ciudades según su habitabilidad, 
          justicia distributiva, resiliencia ecológica y flujos de movilidad sostenible (ODS 11 y ODS 10), construimos un modelo que equilibra la viabilidad material con la calidad de vida humana.
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button className="set-compare-btn" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => setActiveTab('methodology')}>
            <BookOpen size={16} />
            Ver Metodología
          </button>
          <button className="set-compare-btn" style={{ width: 'auto', padding: '12px 24px', background: 'var(--color-accent)', color: 'var(--bg-dark-900)' }} onClick={() => setActiveTab('map')}>
            <span>Explorar Constelación</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="hero-editorial-panel">
        <h2 className="hero-panel-title">Tesis y Diferenciación Teórica</h2>
        <ul className="hero-panel-list">
          <li className="hero-panel-item">
            <strong>Foco en el Sur Global:</strong> Nuestro estudio analiza 1,500 ciudades de economías emergentes de América Latina, Asia, África y Medio Oriente, eliminando la sobreponderación sistemática de metrópolis consolidadas del Norte Global.
          </li>
          <li className="hero-panel-item">
            <strong>Mitigación de Distorsiones:</strong> Aplicamos Winsorización estadística para evitar que extremos de ingresos (outliers como Singapur) compriman artificialmente las puntuaciones de las ciudades intermedias.
          </li>
          <li className="hero-panel-item">
            <strong>Clasificación Inteligente:</strong> Agrupamos a las ciudades mediante K-Means en 4 tipologías cualitativas para caracterizar sus perfiles reales de desarrollo urbano.
          </li>
          <li className="hero-panel-item">
            <strong>Consistencia Metodológica:</strong> El modelo general ACI es sometido a un análisis de sensibilidad de pesos y a un ajuste por Componentes Principales (PCA), garantizando una estabilidad estadística probada por Spearman.
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Hero;
