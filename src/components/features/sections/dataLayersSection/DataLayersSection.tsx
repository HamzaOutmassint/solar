// import { ChevronDown, ChevronUp, Layers } from "lucide-react";
// import DropDown from "../../../common/dropDown/DropDown";
// import styles from "./dataLayersSection.module.scss";
// import { useEffect, useState } from "react";
// import { 
//   DataLayersResponse, 
//   dataLayersSectionProps, 
//   LayerId, 
//   RequestError 
// } from "../../../../types/solar";
// import { getLayer, Layer } from "../../../../types/layer";
// import { getDataLayerUrls } from "../../../../utils/utils";

// const DataLayersSection: React.FC<dataLayersSectionProps> = ({
//   showPanels,
//   setShowPanels,
//   googleMapsApiKey,
//   buildingInsights,
//   geometryLibrary,
//   map,
// }) => {
//   const [accordionStates, setAccordionStates] = useState<boolean>(false);
//   const [dataLayersResponse, setDataLayersResponse] = useState<DataLayersResponse | undefined>();
//   const [imageryQuality, setImageryQuality] = useState<'HIGH' | 'MEDIUM' | 'LOW'>();
//   const [requestError, setRequestError] = useState<RequestError | undefined>();
//   const [overlays, setOverlays] = useState<google.maps.GroundOverlay[]>([]);
//   const [layerId, setLayerId] = useState<LayerId | 'none'>('none');
//   const [playAnimation, setPlayAnimation] = useState(true);
//   const [showRoofOnly, setShowRoofOnly] = useState(false);
//   const [layer, setLayer] = useState<Layer | undefined>();
//   const [month, setMonth] = useState(0);
//   const [hour, setHour] = useState(0);
//   const [day, setDay] = useState(14);
//   const [tick, setTick] = useState(0);

//   const [isLoading , setIsLoading] = useState<boolean>(false)

//   const monthNames = [
//     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//   ];

//   const dataLayerOptions: Record<LayerId | 'none', string> = {
//     none: 'No layer',
//     mask: 'Roof mask',
//     dsm: 'Digital Surface Model',
//     rgb: 'Aerial image',
//     annualFlux: 'Annual sunshine',
//     monthlyFlux: 'Monthly sunshine',
//     hourlyShade: 'Hourly shade',
//   };

//   const showDataLayer = async (reset = false) => {
//     if (reset && map !== null) {
//       console.log(layerId)
//       setDataLayersResponse(undefined);
//       setRequestError(undefined);
//       setLayer(undefined);
//       setShowRoofOnly(['annualFlux', 'monthlyFlux', 'hourlyShade'].includes(layerId));
//       map.setMapTypeId(layerId === 'rgb' ? 'roadmap' : 'satellite');
//       overlays.forEach((overlay) => overlay.setMap(null));
//       setMonth(layerId === 'hourlyShade' ? 3 : 0);
//       setDay(14);
//       setHour(5);
//       setPlayAnimation(['monthlyFlux', 'hourlyShade'].includes(layerId));
//     }

//     if (layerId === 'none') return;

//     if (!layer && geometryLibrary !== null) {
//       const { center, boundingBox } = buildingInsights;
//       const diameter = geometryLibrary.spherical.computeDistanceBetween(
//         new google.maps.LatLng(boundingBox.ne.latitude, boundingBox.ne.longitude),
//         new google.maps.LatLng(boundingBox.sw.latitude, boundingBox.sw.longitude)
//       );
//       const radius = Math.ceil(diameter / 2);

//       try {
//         const response = await getDataLayerUrls(center, radius, googleMapsApiKey);
//         setDataLayersResponse(response);
//         setImageryQuality(response.imageryQuality);
//         const layerResponse = await getLayer(layerId, response, googleMapsApiKey);
//         setLayer(layerResponse);
//       } catch (error) {
//         setRequestError(error as RequestError);
//       }
//     }

//     if (layer) {
//       const bounds = layer.bounds;
//       const newOverlays = layer
//         .render(showRoofOnly, month, day)
//         .map((canvas) => new google.maps.GroundOverlay(canvas.toDataURL(), bounds));

//       setOverlays(newOverlays);
//       if (!['monthlyFlux', 'hourlyShade'].includes(layer.id)) {
//         newOverlays[0]?.setMap(map);
//       }
//     }
//   };

//   useEffect(() => {
//     showDataLayer(true);

//     const interval = setInterval(() => {
//       setTick((prevTick) => prevTick + 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [layerId]);

//   // Handle overlay updates when the state changes
//   useEffect(() => {
//     if (map && overlays.length > 0) {
//       // Remove previous overlays
//       overlays.forEach((overlay) => overlay.setMap(null));

//       if (['annualFlux', 'monthlyFlux', 'hourlyShade'].includes(layerId)) {
//         // Show only the first overlay if `showRoofOnly` is true
//         const visibleOverlays = overlays.filter((_, i) => showRoofOnly && i === 0);
//         visibleOverlays.forEach((overlay) => overlay.setMap(map));
//       } else if (layerId === 'rgb') {
//         // Show all overlays
//         overlays.forEach((overlay) => overlay.setMap(map));
//       } else {
//         // No overlays to show
//       }
//     }
//   }, [map, overlays, layerId, showRoofOnly]);

//   useEffect(() => {
//     if (layer?.id === 'monthlyFlux') {
//       overlays.forEach((overlay, i) => overlay.setMap(i === month ? map : null));
//     } else if (layer?.id === 'hourlyShade') {
//       overlays.forEach((overlay, i) => overlay.setMap(i === hour ? map : null));
//     }
//   }, [month, hour, layer, overlays]);

//   useEffect(() => {
//     if (layer?.id === 'monthlyFlux') {
//       if (playAnimation) {
//         setMonth(tick % 12);
//       } else {
//         setTick(month);
//       }
//     } else if (layer?.id === 'hourlyShade') {
//       if (playAnimation) {
//         setHour(tick % 24);
//       } else {
//         setTick(hour);
//       }
//     }
//   }, [tick, month, hour, playAnimation]);

//   const handelSelectChange = async (value: LayerId) => {
//     setLayerId(value);
//     setLayer(undefined);
//     setIsLoading(true)

//     try {
//       await showDataLayer();
//     } catch (error) {
//       alert(`${error}`)
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.accordion}>
//       <div onClick={() => setAccordionStates(!accordionStates)} style={{ cursor: "pointer" }} className={styles.accordion__header}>
//         <div className={styles.accordion__header_title}>
//           <h1><Layers /> <span>Data Layers endpoint</span></h1>
//           {
//             accordionStates ? <ChevronDown /> : <ChevronUp />
//           }
//         </div>
//         <span>monthly sunshine</span>
//       </div>
//       <div className={` ${accordionStates ? styles.toggel : ''} ${styles.accordion__content}`}>
//         <div className={styles.desc}>
//           <strong>Data Layers endpoint</strong> provides raw and processed imagery and granular details on an area surrounding a location.
//         </div>
//         <DropDown
//           options={dataLayerOptions}
//           onChange={handelSelectChange}
//         />
        
//         {
//           isLoading
//           ?
//           <strong>LOADING...1</strong>
//           :
//           <strong>DONE</strong>
//         }
//       </div>
//     </div>
//   );
// };

// export default DataLayersSection;


import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import DropDown from "../../../common/dropDown/DropDown";
import styles from "./dataLayersSection.module.scss";
import { useEffect, useState, useRef } from "react";
import {
  DataLayersResponse,
  dataLayersSectionProps,
  LayerId,
  RequestError,
} from "../../../../types/solar";
import { getLayer, Layer } from "../../../../types/layer";
import { getDataLayerUrls } from "../../../../utils/utils";

const DataLayersSection: React.FC<dataLayersSectionProps> = ({
  showPanels,
  setShowPanels,
  googleMapsApiKey,
  buildingInsights,
  geometryLibrary,
  map,
}) => {
  const [accordionStates, setAccordionStates] = useState<boolean>(false);
  const [dataLayersResponse, setDataLayersResponse] =
    useState<DataLayersResponse | undefined>();
  const [imageryQuality, setImageryQuality] = useState<'HIGH' | 'MEDIUM' | 'LOW'>();
  const [requestError, setRequestError] = useState<RequestError | undefined>();
  const [overlays, setOverlays] = useState<google.maps.GroundOverlay[]>([]);
  const [layerId, setLayerId] = useState<LayerId | 'none'>('none');
  const [playAnimation, setPlayAnimation] = useState(true);
  const [showRoofOnly, setShowRoofOnly] = useState(false);
  const [layer, setLayer] = useState<Layer | undefined>();
  const [month, setMonth] = useState(0);
  const [hour, setHour] = useState(0);
  const [day, setDay] = useState(14);
  const [tick, setTick] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const layerRef = useRef<Layer | undefined>(null);
  let intervalRef = useRef<NodeJS.Timeout | null>(null); 

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dataLayerOptions: Record<LayerId | "none", string> = {
    none: "No layer",
    mask: "Roof mask",
    dsm: "Digital Surface Model",
    rgb: "Aerial image",
    annualFlux: "Annual sunshine",
    monthlyFlux: "Monthly sunshine",
    hourlyShade: "Hourly shade",
  };

  const showRoofOnlyRef = useRef(true); // Use a ref for showRoofOnly

  useEffect(() => {
    showRoofOnlyRef.current = [
      "annualFlux",
      "monthlyFlux",
      "hourlyShade",
    ].includes(layerId);
  }, [layerId]);

  // console.log(sh)
  // This effect fetches and updates the layer data
  useEffect(() => {
    if (layerId === "none") return;

    setIsLoading(true);

    const fetchData = async () => {
      try {
        if (!layer && geometryLibrary !== null) {
          const { center, boundingBox } = buildingInsights;
          const diameter = geometryLibrary.spherical.computeDistanceBetween(
            new google.maps.LatLng(
              boundingBox.ne.latitude,
              boundingBox.ne.longitude
            ),
            new google.maps.LatLng(
              boundingBox.sw.latitude,
              boundingBox.sw.longitude
            )
          );
          const radius = Math.ceil(diameter / 2);

          const response = await getDataLayerUrls(
            center,
            radius,
            googleMapsApiKey
          );
          setDataLayersResponse(response);
          setImageryQuality(response.imageryQuality);

          const layerResponse = await getLayer(
            layerId,
            response,
            googleMapsApiKey
          );

          // Wrap state update in a Promise
          const updatePromise = new Promise<void>((resolve) => {
            setLayer(layerResponse);
            resolve();
          });

          // Wait for the state to update
          await updatePromise; 
          updateOverlays(); 
        } else {
          updateOverlays(); // Update overlays if layerId changes
        }
      } catch (error) {
        setRequestError(error as RequestError);
        alert(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [layerId, layer]);

  // Function to handle overlay updates
  const updateOverlays = () => {
    if (layer && map) {
      // Remove previous overlays
      overlays.forEach((overlay) => overlay.setMap(null));

      const bounds = layer.bounds;

      const newOverlays = layer
        .render(showRoofOnlyRef.current, month, day)
        .map((canvas) => new google.maps.GroundOverlay(canvas.toDataURL(), bounds));

      setOverlays(newOverlays);
      if (!["monthlyFlux", "hourlyShade"].includes(layer.id)) {
        newOverlays[0]?.setMap(map);
      }
    }
  };

  useEffect(() => {
    if (map && overlays.length > 0) {
      if (["annualFlux", "monthlyFlux", "hourlyShade"].includes(layerId)) {
        // Show only the first overlay if `showRoofOnly` is true
        const visibleOverlays = overlays.filter(
          (_, i) => showRoofOnlyRef.current && i === 0
        );
        visibleOverlays.forEach((overlay) => overlay.setMap(map));
      } else if (layerId === "rgb") {
        // Show all overlays
        overlays.forEach((overlay) => overlay.setMap(map));
      }
    }
  }, [map, overlays, layerId, showRoofOnlyRef]);

  // Manage overlays for monthly/hourly layers
  useEffect(() => {
    if (layer?.id === "monthlyFlux") {
      overlays.forEach((overlay, i) =>
        overlay.setMap(i === month ? map : null)
      );
    } else if (layer?.id === "hourlyShade") {
      overlays.forEach((overlay, i) =>
        overlay.setMap(i === hour ? map : null)
      );
    }
  }, [month, hour, layer, overlays]);

  // Handle animation for monthly/hourly layers
  useEffect(() => {
    if (layer?.id === "monthlyFlux") {
      if (playAnimation) {
        setMonth(tick % 12);
      } else {
        setTick(month);
      }
    } else if (layer?.id === "hourlyShade") {
      if (playAnimation) {
        setHour(tick % 24);
      } else {
        setTick(hour);
      }
    }
  }, [tick, month, hour, playAnimation]);

  // Handle layer selection
  const handleSelectChange = (value: LayerId) => {
    setLayerId(value);
    setLayer(undefined);
    setIsLoading(true);
  };

  return (
    <div className={styles.accordion}>
      <div
        onClick={() => setAccordionStates(!accordionStates)}
        style={{ cursor: "pointer" }}
        className={styles.accordion__header}
      >
        <div className={styles.accordion__header_title}>
          <h1>
            <Layers /> <span>Data Layers endpoint</span>
          </h1>
          {accordionStates ? <ChevronDown /> : <ChevronUp />}
        </div>
        <span>monthly sunshine</span>
      </div>
      <div
        className={` ${accordionStates ? styles.toggel : ""} ${
          styles.accordion__content
        }`}
      >
        <div className={styles.desc}>
          <strong>Data Layers endpoint</strong> provides raw and processed
          imagery and granular details on an area surrounding a location.
        </div>
        <DropDown options={dataLayerOptions} onChange={handleSelectChange} />

        {isLoading ? <strong>LOADING...1</strong> : <strong>DONE</strong>}
      </div>
    </div>
  );
};

export default DataLayersSection;