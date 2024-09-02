import { ChevronDown, ChevronUp, House } from "lucide-react";
import { useState } from "react";

import { BuildingInsightsResponse } from "../../../types/solar";
import { findSolarConfig } from "../../../utils/utils";

import styles from "./sections.module.scss"
import InputPanelsCount from "../../common/inputPanelsCount/InputPanelsCount";


interface sectionsProps {
    location : google.maps.LatLng ;
    map : google.maps.Map | undefined;
    geometryLibrary : google.maps.GeometryLibrary | null;
    googleMapsApiKey : string ;
}

let buildingInsights: BuildingInsightsResponse | undefined;

const Sections = ({ location , map , geometryLibrary , googleMapsApiKey}: sectionsProps) => {
    const [accordionStates, setAccordionStates] = useState(false);
  

  return (
    <div className={styles.accordion}>
        <div onClick={()=>setAccordionStates(!accordionStates)} style={{cursor: "pointer"}} className={styles.accordion__header}>
            <div className={styles.accordion__header_title}>
                <h1><House /> <span>Building Insights Section</span></h1>
                {
                    accordionStates ? <ChevronDown /> : <ChevronUp />
                }
                
            </div>
            <span>Yearly energy: 19.83 MWh</span>
        </div>
        <div className={` ${ accordionStates ? styles.toggel : ''} ${styles.accordion__content}`}>
           <InputPanelsCount />
        </div>
    </div>
  );
};

export default Sections;
