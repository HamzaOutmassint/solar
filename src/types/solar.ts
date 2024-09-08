/*
 Copyright 2023 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// [START solar_api_data_types]
export interface DataLayersResponse {
  imageryDate: Date;
  imageryProcessedDate: Date;
  dsmUrl: string;
  rgbUrl: string;
  maskUrl: string;
  annualFluxUrl: string;
  monthlyFluxUrl: string;
  hourlyShadeUrls: string[];
  imageryQuality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// https://developers.google.com/maps/documentation/solar/reference/rest/v1/buildingInsights/findClosest
export interface BuildingInsightsResponse {
  name: string;
  center: LatLng;
  boundingBox: LatLngBox;
  imageryDate: Date;
  imageryProcessedDate: Date;
  postalCode: string;
  administrativeArea: string;
  statisticalArea: string;
  regionCode: string;
  solarPotential: SolarPotential;
  imageryQuality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SolarPotential {
  maxArrayPanelsCount: number;
  panelCapacityWatts: number;
  panelHeightMeters: number;
  panelWidthMeters: number;
  panelLifetimeYears: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
  wholeRoofStats: SizeAndSunshineStats;
  buildingStats: SizeAndSunshineStats;
  roofSegmentStats: RoofSegmentSizeAndSunshineStats[];
  solarPanels: SolarPanel[];
  solarPanelConfigs: SolarPanelConfig[];
  financialAnalyses: object;
}

export interface SizeAndSunshineStats {
  areaMeters2: number;
  sunshineQuantiles: number[];
  groundAreaMeters2: number;
}

export interface RoofSegmentSizeAndSunshineStats {
  pitchDegrees: number;
  azimuthDegrees: number;
  stats: SizeAndSunshineStats;
  center: LatLng;
  boundingBox: LatLngBox;
  planeHeightAtCenterMeters: number;
}

export interface SolarPanel {
  center: LatLng;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
  segmentIndex: number;
  yearlyEnergyDcKwh: number;
}

export interface SolarPanelConfig {
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  roofSegmentSummaries: RoofSegmentSummary[];
}

export interface RoofSegmentSummary {
  pitchDegrees: number;
  azimuthDegrees: number;
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  segmentIndex: number;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface LatLngBox {
  sw: LatLng;
  ne: LatLng;
}

export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface RequestError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}
// [END solar_api_data_types]

// https://developers.google.com/maps/documentation/solar/reference/rest/v1/dataLayers
export type LayerId = 'mask' | 'dsm' | 'rgb' | 'annualFlux' | 'monthlyFlux' | 'hourlyShade';


// [START my_components_data_types]
export interface SearchBarProps {
  setLocation: (location: google.maps.LatLng | undefined) => void;
  placesLibrary: google.maps.PlacesLibrary | null;
  map: google.maps.Map | null;
  initialValue: string;
  zoom: number;
}

export interface SolarSectionsProps {
  location: google.maps.LatLng;
  map: google.maps.Map | null;
  geometryLibrary: google.maps.GeometryLibrary | null;
  googleMapsApiKey: string;
}

export interface buildingInsightsSectionProps {
  expandedSection?: string;
  setExpandedSection?: React.Dispatch<React.SetStateAction<string>>;
  buildingInsights: BuildingInsightsResponse | undefined;
  setBuildingInsights: React.Dispatch<React.SetStateAction<BuildingInsightsResponse | undefined>>;
  configId: number | undefined;
  setConfigId: React.Dispatch<React.SetStateAction<number | undefined>>;
  panelCapacityWatts: number;
  setPanelCapacityWatts: React.Dispatch<React.SetStateAction<number>>;
  showPanels: boolean;
  setShowPanels: React.Dispatch<React.SetStateAction<boolean>>;
  googleMapsApiKey: string;
  geometryLibrary: google.maps.GeometryLibrary;
  location: google.maps.LatLng;
  map: google.maps.Map;
}

export interface dataLayersSectionProps {
  expandedSection?: string;
  showPanels: boolean;
  setShowPanels : React.Dispatch<React.SetStateAction<boolean>>
  googleMapsApiKey: string;
  buildingInsights: BuildingInsightsResponse;
  geometryLibrary: google.maps.GeometryLibrary | null;
  map: google.maps.Map | null;
}

export interface inputPanelCountProps {
  configId : number | undefined;
  setConfigId: React.Dispatch<React.SetStateAction<number | undefined>>;
  solarPanelConfigs : SolarPanelConfig[];
}

export interface toggleSwitchProps {
  state : boolean;
  setState : React.Dispatch<React.SetStateAction<boolean>>;
}

export interface showRoofOnlyProps {
  showRoofOnly : boolean;
  setShowRoofOnly : React.Dispatch<React.SetStateAction<boolean>>;
}

export interface playAnimationProps {
  playAnimation : boolean;
  setPlayAnimation : React.Dispatch<React.SetStateAction<boolean>>
}

export interface numberInputProps{
  value : number
  setValue : React.Dispatch<React.SetStateAction<number>>
  label : string
  suffix : string
}
// [END my_components_data_types]