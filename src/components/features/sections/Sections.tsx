import { useState, useEffect } from 'react';
import { BuildingInsightsResponse, SolarSectionsProps } from '../../../types/solar'; 
import { findSolarConfig } from '../../../utils/utils';

import styles from "./sections.module.scss"

import BuildingInsightsSection from './buildingInsightsSection/BuildingInsightsSection';
import DataLayersSection from './dataLayersSection/DataLayersSection';
import SolarPotentialSection from './solarPotentialSection/SolarPotentialSection';
// import SolarPotentialSection from './SolarPotentialSection';



const Sections: React.FC<SolarSectionsProps> = ({ location, map, geometryLibrary, googleMapsApiKey }) => {
  const [buildingInsights, setBuildingInsights] = useState<BuildingInsightsResponse | undefined>(undefined);
  const [showPanels, setShowPanels] = useState<boolean>(true);
  // const [showRoofOnly, setShowRoofOnly] = useState<boolean>(false);
  const [monthlyAverageEnergyBillInput, setMonthlyAverageEnergyBillInput] = useState<number>(300);
  const [panelCapacityWattsInput, setPanelCapacityWattsInput] = useState<number>(250);
  const [energyCostPerKwhInput, setEnergyCostPerKwhInput] = useState<number>(0.31);
  const [dcToAcDerateInput, setDcToAcDerateInput] = useState<number>(0.85);
  const [yearlyKwhEnergyConsumption, setYearlyKwhEnergyConsumption] = useState<number>(0);
  const [configId, setConfigId] = useState<number | undefined>(undefined);


  useEffect(() => {
    // Compute yearly energy consumption
    const consumption = (monthlyAverageEnergyBillInput / energyCostPerKwhInput) * 12;
    setYearlyKwhEnergyConsumption(consumption);
    
  
    // Update configId if necessary, but only after yearlyKwhEnergyConsumption has been updated
    if (yearlyKwhEnergyConsumption > 0) {
      if (configId === undefined && buildingInsights) {
        const defaultPanelCapacity = buildingInsights.solarPotential.panelCapacityWatts; //400
        const panelCapacityRatio = panelCapacityWattsInput / defaultPanelCapacity;
        const newConfigId = findSolarConfig(
          buildingInsights.solarPotential.solarPanelConfigs,
          yearlyKwhEnergyConsumption,
          panelCapacityRatio,
          dcToAcDerateInput
        );
        setConfigId(newConfigId);
      }
    }
  }, [buildingInsights, configId, dcToAcDerateInput, energyCostPerKwhInput, monthlyAverageEnergyBillInput, panelCapacityWattsInput, yearlyKwhEnergyConsumption]);

  return (
    <div className={styles.section_container}>
      {geometryLibrary && map && (
        <BuildingInsightsSection
          buildingInsights={buildingInsights}
          setBuildingInsights={setBuildingInsights}
          configId={configId}
          setConfigId={setConfigId}
          showPanels={showPanels}
          setShowPanels={setShowPanels}
          panelCapacityWatts={panelCapacityWattsInput}
          setPanelCapacityWatts={setPanelCapacityWattsInput}
          googleMapsApiKey={googleMapsApiKey}
          geometryLibrary={geometryLibrary}
          location={location}
          map={map}
        />
      )}

      {buildingInsights && configId !== undefined && (
        <>
          <DataLayersSection
            showPanels={showPanels}
            setShowPanels={setShowPanels}
            googleMapsApiKey={googleMapsApiKey}
            buildingInsights={buildingInsights}
            geometryLibrary={geometryLibrary}
            map={map}
          />

          
          <SolarPotentialSection
            configId={configId}
            setConfigId={setConfigId}
            monthlyAverageEnergyBillInput={monthlyAverageEnergyBillInput}
            setMonthlyAverageEnergyBillInput={setMonthlyAverageEnergyBillInput}
            energyCostPerKwhInput={energyCostPerKwhInput}
            setEnergyCostPerKwhInput={setEnergyCostPerKwhInput}
            panelCapacityWattsInput={panelCapacityWattsInput}
            setPanelCapacityWattsInput={setPanelCapacityWattsInput}
            dcToAcDerateInput={dcToAcDerateInput}
            setDcToAcDerateInput={setDcToAcDerateInput}
            solarPanelConfigs={buildingInsights.solarPotential.solarPanelConfigs}
            defaultPanelCapacityWatts={buildingInsights.solarPotential.panelCapacityWatts}
          />
        </>
      )}
    </div>
  );
};

export default Sections;
