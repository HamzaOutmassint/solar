import { ChevronDown, ChevronUp, House, OctagonX } from "lucide-react";
import { useState , useEffect, useRef } from "react";

import styles from "./buildingInsightsSection.module.scss"
import { buildingInsightsSectionProps, RequestError, SolarPanelConfig } from "../../../../types/solar";
import { createPalette , normalize, rgbToColor } from "../../../../utils/visualize";

import InputPanelsCount from "../../../common/inputPanelsCount/InputPanelsCount";
import { panelsPalette } from "../../../../types/colors";
import { findClosestBuilding } from "../../../../utils/utils";
import NumberInput from "../../../common/numberInput/NumberInput";
import ShowPanels from "./../../../common/showPanels/ShowPanels";


const BuildingInsightsSection = ({ 
  expandedSection, 
  setExpandedSection, 
  buildingInsights, 
  setBuildingInsights, 
  configId, 
  setConfigId, 
  panelCapacityWatts,
  setPanelCapacityWatts, 
  showPanels,
  setShowPanels, 
  googleMapsApiKey,
  geometryLibrary, 
  location, 
  map
  } : buildingInsightsSectionProps ) => {
  const [accordionStates, setAccordionStates] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<RequestError | undefined>(undefined);
  const apiResponseDialog = useRef<HTMLDialogElement>(null);
  const [solarPanels, setSolarPanels] = useState<google.maps.Polygon[]>([]);
  const [panelCapacityRatio, setPanelCapacityRatio] = useState(1.0);
  const panelConfig: SolarPanelConfig | undefined = buildingInsights?.solarPotential.solarPanelConfigs[configId ?? 0];


  useEffect(() => {
    if (buildingInsights) {
      const defaultPanelCapacity = buildingInsights.solarPotential.panelCapacityWatts;
      setPanelCapacityRatio(panelCapacityWatts / defaultPanelCapacity);
    }
  }, [buildingInsights, panelCapacityWatts]);

  
  useEffect(() => {
    if (buildingInsights && solarPanels.length > 0) {
      solarPanels.map((panel, i)=>(
        panel.setMap(showPanels && panelConfig && i < panelConfig.panelsCount ? map : null)
      ))
    }
  }, [buildingInsights, showPanels, panelConfig, map, solarPanels]);

  
  const showSolarPotential = async (location: google.maps.LatLng) => {
    if (requestSent) return;

    setBuildingInsights(undefined);
    setRequestError(undefined);
    setRequestSent(true);

    try {
      const response = await findClosestBuilding(location, googleMapsApiKey);
      setBuildingInsights(response);

      // Create the solar panels on the map
      const solarPotential = response.solarPotential;
      const palette = createPalette(panelsPalette).map(rgbToColor);
      const minEnergy = solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
      const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;
      const panels = solarPotential.solarPanels.map((panel) => {
        const [w, h] = [solarPotential.panelWidthMeters / 2, solarPotential.panelHeightMeters / 2];
        const points = [
          { x: +w, y: +h }, // top right
          { x: +w, y: -h }, // bottom right
          { x: -w, y: -h }, // bottom left
          { x: -w, y: +h }, // top left
          { x: +w, y: +h }, // top right
        ];
        const orientation = panel.orientation === 'PORTRAIT' ? 90 : 0;
        const azimuth = solarPotential.roofSegmentStats[panel.segmentIndex].azimuthDegrees;
        const colorIndex = Math.round(normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255);
        return new google.maps.Polygon({
          paths: points.map(({ x, y }) =>
            geometryLibrary.spherical.computeOffset(
              { lat: panel.center.latitude, lng: panel.center.longitude },
              Math.sqrt(x * x + y * y),
              Math.atan2(y, x) * (180 / Math.PI) + orientation + azimuth,
            )
          ),
          strokeColor: '#B0BEC5',
          strokeOpacity: 0.9,
          strokeWeight: 1,
          fillColor: palette[colorIndex],
          fillOpacity: 0.9,
        });
      });
      setSolarPanels(panels);
    } catch (e) {
      setRequestError(e as RequestError);
    } finally {
      setRequestSent(false);
    }

  };

  useEffect(() => {
    showSolarPotential(location);
  }, [location, map]);

  return (
    <div className={styles.accordion}>
        <div onClick={()=>setAccordionStates(!accordionStates)} style={{cursor: "pointer"}} className={styles.accordion__header}>
            <div className={styles.accordion__header_title}>
                <h1><House /> <span>Building Insights Section</span></h1>
                {
                    accordionStates ? <ChevronDown /> : <ChevronUp />
                }
                
            </div>
            <span>
              { panelConfig !== undefined && (
                  `Yearly energy: ${((panelConfig.yearlyEnergyDcKwh * panelCapacityRatio) / 1000).toFixed(2)} MWh`
                )
              }
            </span>
        </div>
        <div className={` ${ accordionStates ? styles.toggel : ''} ${styles.accordion__content}`}>
        {

          requestError 
          ?
            <div className={styles.errorMessage}>
              <div className={styles.top}>
                <OctagonX size={30}/>
                <div>Not Found</div>
              </div>
              <div className={styles.label}>Requested entity was not found. Please try with another location.</div>
            </div>
          :
            buildingInsights !== undefined && (   
              <>
                <InputPanelsCount 
                  configId={configId}
                  setConfigId={setConfigId}
                  solarPanelConfigs={buildingInsights.solarPotential.solarPanelConfigs}
                />

                <NumberInput
                  value={panelCapacityWatts}
                  setValue={setPanelCapacityWatts}
                  label="Panel capacity"
                  suffix="Watts"
                />

                <ShowPanels 
                  showPanels={showPanels}
                  setShowPanels={setShowPanels}
                />
              </>  
            )
          }
          </div>

    </div>
  );
}

export default BuildingInsightsSection