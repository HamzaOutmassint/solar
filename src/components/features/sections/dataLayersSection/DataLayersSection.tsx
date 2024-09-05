import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import DropDown from "../../../common/dropDown/DropDown";
import styles from "./dataLayersSection.module.scss";
import { useEffect, useState } from "react";
import {
  DataLayersResponse,
  dataLayersSectionProps,
  LayerId,
  RequestError,
} from "../../../../types/solar";
import { getLayer, Layer } from "../../../../types/layer";
import { getDataLayerUrls } from "../../../../utils/utils";
import ShowRoofOnly from "../../../common/showRoofOnly/ShowRoofOnly";
import Loading from "../../../common/loading/Loading";

const DataLayersSection: React.FC<dataLayersSectionProps> = ({
  showPanels,
  setShowPanels,
  googleMapsApiKey,
  buildingInsights,
  geometryLibrary,
  map,
}) => {
  const [dataLayersResponse, setDataLayersResponse] = useState<DataLayersResponse | undefined>();
  const [imageryQuality, setImageryQuality] = useState<'HIGH' | 'MEDIUM' | 'LOW'>();
  const [requestError, setRequestError] = useState<RequestError | undefined>();
  const [overlays, setOverlays] = useState<google.maps.GroundOverlay[]>([]);
  const [accordionStates, setAccordionStates] = useState<boolean>(false);
  const [showRoofOnly, setShowRoofOnly] = useState<boolean>(false);
  const [layerId, setLayerId] = useState<LayerId | 'none'>('none');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playAnimation, setPlayAnimation] = useState(true);
  const [layer, setLayer] = useState<Layer | undefined>();
  const [month, setMonth] = useState(0);
  const [hour, setHour] = useState(0);
  const [tick, setTick] = useState(0);
  const [day, setDay] = useState(14);


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

  // const showRoofOnlyRef = useRef(false);

  useEffect(() => {
    setShowRoofOnly([
      "mask",
      "dsm",
      "annualFlux",
      "monthlyFlux",
      "hourlyShade",
    ].includes(layerId))
  }, [layerId]);

  // This effect fetches and updates the layer data
  useEffect(() => {
    if (layerId === "none"){
        setIsLoading(false)
        return
    };

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

          //  Wrap state layer in a Promise to avoid Asynchronous State Updates problem
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
        .render(showRoofOnly, month, day)
        .map((canvas) => new google.maps.GroundOverlay(canvas.toDataURL(), bounds));

      setOverlays(newOverlays);
      if (!["monthlyFlux", "hourlyShade"].includes(layer.id)) {
        newOverlays[0]?.setMap(map);
      }
    }
  };

  useEffect(() => {
    // if (map && overlays.length > 0) {
    //   // Remove previous overlays
    //   overlays.forEach((overlay) => overlay.setMap(null));
  
    //   if (["mask", "dsm", "annualFlux", "monthlyFlux", "hourlyShade"].includes(layerId)) {
    //     if (showRoofOnly) {
    //       // Show only the first overlay
    //       overlays[0]?.setMap(map); 
    //     } else {
    //       // Show all overlays
    //       overlays.forEach((overlay) => overlay.setMap(map));
    //     }
    //   } else if (layerId === "rgb") {
    //     // Show all overlays
    //     overlays.forEach((overlay) => overlay.setMap(map));
    //   }else if (layerId === "none"){
    //     // remove all overlays from the map
    //     overlays.forEach((overlay) => overlay.setMap(null));
    //   }
    // }
    if (map && overlays.length > 0) {
      overlays.forEach((overlay) => overlay.setMap(null));

      if (["mask", "dsm", "annualFlux", "monthlyFlux", "hourlyShade",].includes(layerId)) {
        // Show only the first overlay if `showRoofOnly` is true
        const visibleOverlays = overlays.filter(
          (_, i) => showRoofOnly && i === 0
        );
        visibleOverlays.forEach((overlay) => overlay.setMap(map));
      } else if (layerId === "rgb") {
        // Show all overlays
        overlays.forEach((overlay) => overlay.setMap(map));
      }else if (layerId === "none"){
        // remove all overlays from the map
        overlays.forEach((overlay) => overlay.setMap(null));
      }
    }
  }, [map, overlays, layerId, showRoofOnly]);

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

        {isLoading 
        ? 
          <Loading />
        : 
          null
        }

        <ShowRoofOnly 
          showRoofOnly={showRoofOnly}
          setShowRoofOnly={setShowRoofOnly}
        />
      </div>
    </div>
  );
};

export default DataLayersSection;