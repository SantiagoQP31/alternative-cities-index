import React from 'react';
import { ShieldCheck, BarChart2, Filter, Zap } from 'lucide-react';

function Methodology() {
  return (
    <div className="fade-in-section" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ textAlign: 'left' }}>
        <span className="hero-tag">Fundamentación Científica</span>
        <h1 className="hero-title" style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Metodología de Cálculo y Robustez</h1>
        <p className="hero-desc" style={{ fontSize: '0.95rem' }}>
          Para que una investigación sobre el bienestar y desarrollo urbano tenga peso académico, las variables no deben ponderarse arbitrariamente 
          ni verse arrastradas por extremos distributivos. A continuación se detallan los tres pilares de tratamiento estadístico aplicados en nuestro pipeline de datos:
        </p>
      </div>

      <div className="methodology-grid">
        <div className="editorial-card meth-card">
          <div className="meth-header">
            <div className="meth-icon-circle">
              <ShieldCheck size={20} />
            </div>
            <h3 className="meth-title">Winsorización al 5% - 95%</h3>
          </div>
          <p className="meth-text">
            <strong>Tratamiento de Valores Extremos:</strong> Si aplicáramos MinMaxScaler directo a variables como el PIB per cápita, Singapur ($130,000) o Tokio comprimirían a ciudades intermedias de América Latina ($12,000) hacia el cero absoluto.
          </p>
          <p className="meth-text">
            Al Winsorizar al 5% y 95%, recortamos las colas extremas de la distribución, reasignándolas al percentil respectivo. Esto distribuye equitativamente el escalado del índice sin distorsionar el ranking de los países emergentes.
          </p>
        </div>

        <div className="editorial-card meth-card">
          <div className="meth-header">
            <div className="meth-icon-circle">
              <BarChart2 size={20} />
            </div>
            <h3 className="meth-title">Validación por PCA</h3>
          </div>
          <p className="meth-text">
            <strong>Análisis de Componentes Principales:</strong> Ajustamos el primer componente principal (PC1) sobre las variables temáticas. Este factor latente captura el bienestar general y el flujo urbano, explicando el <strong>51.3% de la varianza acumulada</strong>.
          </p>
          <p className="meth-text">
            La alta concordancia entre nuestro índice compuesto ACI y la primera componente del PCA (Correlación de Spearman de 0.88) valida que nuestro modelo empírico es estadísticamente coherente y descriptivo de la realidad territorial.
          </p>
        </div>

        <div className="editorial-card meth-card">
          <div className="meth-header">
            <div className="meth-icon-circle">
              <Filter size={20} />
            </div>
            <h3 className="meth-title">Imputación Jerárquica</h3>
          </div>
          <p className="meth-text">
            <strong>Resolución de Desiertos de Datos:</strong> El coeficiente de Gini local o la accesibilidad de transporte no están disponibles para todas las 1,500 ciudades intermedias. En lugar de aplicar una mediana global (que introduciría un sesgo severo), diseñamos un pipeline de fallbacks por niveles:
          </p>
          <p className="meth-text" style={{ fontStyle: 'italic' }}>
            Valor de Ciudad &rarr; Mediana del País &rarr; Mediana de su Grupo de Ingreso del Banco Mundial (Alto, Medio Alto, Medio Bajo, Bajo).
          </p>
        </div>
      </div>

      <div className="editorial-card text-left" style={{ textAlign: 'left' }}>
        <h2 className="card-title">Composición y Ponderaciones del ACI</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div>
            <h4 style={{ color: 'var(--color-econ)', margin: '0 0 8px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>
              1. Dinamismo Económico (25%)
            </h4>
            <p className="meth-text">
              Pondera la relevancia material de la urbe mediante variables comerciales, balance de volumen exportador y poder adquisitivo relativo.
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <li>Commercial Hubs (OWF) - 40%</li>
              <li>Export Champions (OWF) - 30%</li>
              <li>PIB per cápita (PPA Imputado) - 30%</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-equity)', margin: '0 0 8px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>
              2. Inclusión Distributiva (25%)
            </h4>
            <p className="meth-text">
              Mide la cohesión socioeconómica. Penaliza de forma realista la desigualdad de los ingresos locales, un factor omitido en rankings tradicionales.
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <li>Coeficiente de Gini local (ONU/Banco Mundial) - 100%</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-env)', margin: '0 0 8px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>
              3. Vitalidad Ecológica (25%)
            </h4>
            <p className="meth-text">
              Prepara el ranking bajo la transición ecológica de los ODS. Mide el capital natural urbano y la resiliencia climática territorial.
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <li>Climate Resilient (OWF) - 50%</li>
              <li>Cobertura de Áreas Verdes Públicas (ONU) - 50%</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-mobility)', margin: '0 0 8px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>
              4. Movilidad Sostenible (25%)
            </h4>
            <p className="meth-text">
              Evalúa la infraestructura física colectiva. Premia el transporte masivo accesible a menos de 500 metros sobre el uso de vehículos particulares.
            </p>
            <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <li>Mobility Connectors (OWF) - 50%</li>
              <li>Convenient Access to Public Transport (ONU) - 50%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Methodology;
