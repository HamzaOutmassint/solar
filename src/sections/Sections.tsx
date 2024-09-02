import { ChevronDown, ChevronUp, House } from "lucide-react";
import { useState } from "react";

import { BuildingInsightsResponse } from "../types/solar";
import { findSolarConfig } from "../types/utils";

import"./sections.scss"

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
    <div className="accordion">
        <div onClick={()=>setAccordionStates(!accordionStates)} style={{cursor: "pointer"}} className="accordion__header">
            <div className="accordion__header-title">
                <h1><House /> <span>Building Insights Section</span></h1>
                {
                    accordionStates ? <ChevronDown /> : <ChevronUp />
                }
                
            </div>
            <span>Yearly energy: 19.83 MWh</span>
        </div>
        <div className={` ${ accordionStates ? 'toggel' : ''} accordion__content`}>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio placeat, ratione eius id iste facilis, dolorum cumque unde veritatis praesentium, 
                consequuntur distinctio molestias. Excepturi illo corrupti libero voluptatum corporis sint ullam dicta vel quaerat fuga,
            </p>
        </div>
    </div>
  );
};

export default Sections;
