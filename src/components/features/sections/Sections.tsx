import { useState, useEffect } from 'react';
import { BuildingInsightsResponse } from '../../../types/solar'; 
import { findSolarConfig } from '../../../utils/utils';

import BuildingInsightsSection from './buildingInsightsSection/BuildingInsightsSection';
// import DataLayersSection from './DataLayersSection';
// import SolarPotentialSection from './SolarPotentialSection';

interface SolarComponentProps {
  location: google.maps.LatLng;
  map: google.maps.Map | undefined;
  geometryLibrary: google.maps.GeometryLibrary | null;
  googleMapsApiKey: string;
}

const Sections: React.FC<SolarComponentProps> = ({ location, map, geometryLibrary, googleMapsApiKey }) => {
  const [buildingInsights, setBuildingInsights] = useState<BuildingInsightsResponse | undefined>(undefined);
  const [expandedSection, setExpandedSection] = useState<string>('');
  const [showPanels, setShowPanels] = useState<boolean>(true);
  const [monthlyAverageEnergyBillInput, setMonthlyAverageEnergyBillInput] = useState<number>(300);
  const [panelCapacityWattsInput, setPanelCapacityWattsInput] = useState<number>(250);
  const [energyCostPerKwhInput, setEnergyCostPerKwhInput] = useState<number>(0.31);
  const [dcToAcDerateInput, setDcToAcDerateInput] = useState<number>(0.85);
  const [yearlyKwhEnergyConsumption, setYearlyKwhEnergyConsumption] = useState<number>(0);
  const [configId, setConfigId] = useState<number | undefined>(undefined);

  // Compute yearly energy consumption
  useEffect(() => {
    const consumption = (monthlyAverageEnergyBillInput / energyCostPerKwhInput) * 12;
    setYearlyKwhEnergyConsumption(consumption);
  }, [monthlyAverageEnergyBillInput, energyCostPerKwhInput]);

  // Update configId if necessary
  useEffect(() => {
    if (configId === undefined && buildingInsights) {
      const defaultPanelCapacity = buildingInsights.solarPotential.panelCapacityWatts;
      const panelCapacityRatio = panelCapacityWattsInput / defaultPanelCapacity;
      const newConfigId = findSolarConfig(
        buildingInsights.solarPotential.solarPanelConfigs,
        yearlyKwhEnergyConsumption,
        panelCapacityRatio,
        dcToAcDerateInput
      );
      setConfigId(newConfigId);
    }
  }, [buildingInsights, configId, panelCapacityWattsInput, yearlyKwhEnergyConsumption, dcToAcDerateInput]);

  return (
    <div className="flex flex-col rounded-md shadow-md">
      {geometryLibrary && map && (
        <BuildingInsightsSection
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
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

      {/* {buildingInsights && configId !== undefined && (
        <>
          <hr className="md-divider inset" />
          <DataLayersSection
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
            showPanels={showPanels}
            setShowPanels={setShowPanels}
            googleMapsApiKey={googleMapsApiKey}
            buildingInsights={buildingInsights}
            geometryLibrary={geometryLibrary}
            map={map}
          />

          <hr className="md-divider inset" />
          <SolarPotentialSection
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
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
      )} */}
    </div>
  );
};

export default Sections;
