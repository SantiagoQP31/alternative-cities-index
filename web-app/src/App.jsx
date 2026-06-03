import { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Methodology from './components/Methodology';
import ConstellationMap from './components/ConstellationMap';
import Explorer from './components/Explorer';
import CityDetail from './components/CityDetail';
import Robustness from './components/Robustness';
import citiesData from './data/cities_ranking.json';
import './App.css';

function App() {
  // Navigation Tab State: 'narrative' | 'methodology' | 'map' | 'explorer' | 'robustness'
  const [activeTab, setActiveTab] = useState('narrative');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [incomeFilter, setIncomeFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  
  // Active Scenario Weight State: 'balanced' | 'pca' | 'social' | 'green'
  const [activeScenario, setActiveScenario] = useState('balanced');
  
  // City Select & Comparison State
  const [selectedCity, setSelectedCity] = useState(citiesData[0] || null);
  const [compareCity, setCompareCity] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Uniques Lists for Filter Dropdowns
  const regions = useMemo(() => {
    const set = new Set(citiesData.map(c => c.Region).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const incomeGroups = useMemo(() => {
    const set = new Set(citiesData.map(c => c.Income_Group).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  // Scenario column mapping config
  const scenarioConfig = useMemo(() => {
    switch (activeScenario) {
      case 'pca':
        return { scoreCol: 'ACI_PCA', rankCol: 'ACI_PCA_Rank' };
      case 'social':
        return { scoreCol: 'ACI_Social_Led', rankCol: 'ACI_Social_Led_Rank' };
      case 'green':
        return { scoreCol: 'ACI_Green_Led', rankCol: 'ACI_Green_Led_Rank' };
      case 'balanced':
      default:
        return { scoreCol: 'ACI', rankCol: 'ACI_Rank' };
    }
  }, [activeScenario]);

  // Filter and sort cities list
  const filteredCities = useMemo(() => {
    let result = [...citiesData];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.City.toLowerCase().includes(term) || 
        c.Country.toLowerCase().includes(term)
      );
    }

    // Region filter
    if (regionFilter !== '') {
      result = result.filter(c => c.Region === regionFilter);
    }

    // Income filter
    if (incomeFilter !== '') {
      result = result.filter(c => c.Income_Group === incomeFilter);
    }

    // Cluster filter
    if (clusterFilter !== '') {
      result = result.filter(c => c.Cluster_ID.toString() === clusterFilter);
    }

    // Sort by selected scenario score descending
    const scoreCol = scenarioConfig.scoreCol;
    result.sort((a, b) => (b[scoreCol] || 0) - (a[scoreCol] || 0));

    return result;
  }, [searchTerm, regionFilter, incomeFilter, clusterFilter, scenarioConfig]);

  // Paginated chunk
  const paginatedCities = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCities.slice(startIndex, startIndex + pageSize);
  }, [filteredCities, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredCities.length / pageSize));

  // Handle Scenario Tab Switching
  const handleScenarioChange = (scenario) => {
    setActiveScenario(scenario);
    setCurrentPage(1);
    if (selectedCity) {
      // Trigger update of selectedCity
      setSelectedCity({ ...selectedCity });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'narrative' && (
          <Hero setActiveTab={setActiveTab} />
        )}
        
        {activeTab === 'methodology' && (
          <Methodology />
        )}
        
        {activeTab === 'map' && (
          <div className="explorer-grid">
            <ConstellationMap 
              cities={filteredCities} 
              selectedCity={selectedCity} 
              setSelectedCity={setSelectedCity} 
              activeScenario={activeScenario}
            />
            <CityDetail 
              selectedCity={selectedCity}
              compareCity={compareCity}
              setCompareCity={setCompareCity}
              activeScenario={activeScenario}
              scenarioConfig={scenarioConfig}
            />
          </div>
        )}
        
        {activeTab === 'explorer' && (
          <div className="explorer-grid">
            <Explorer 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              regionFilter={regionFilter}
              setRegionFilter={setRegionFilter}
              incomeFilter={incomeFilter}
              setIncomeFilter={setIncomeFilter}
              clusterFilter={clusterFilter}
              setClusterFilter={setClusterFilter}
              activeScenario={activeScenario}
              handleScenarioChange={handleScenarioChange}
              filteredCities={filteredCities}
              paginatedCities={paginatedCities}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              scenarioConfig={scenarioConfig}
              regions={regions}
              incomeGroups={incomeGroups}
            />
            <CityDetail 
              selectedCity={selectedCity}
              compareCity={compareCity}
              setCompareCity={setCompareCity}
              activeScenario={activeScenario}
              scenarioConfig={scenarioConfig}
            />
          </div>
        )}
        
        {activeTab === 'robustness' && (
          <Robustness />
        )}
      </main>
    </div>
  );
}

export default App;
