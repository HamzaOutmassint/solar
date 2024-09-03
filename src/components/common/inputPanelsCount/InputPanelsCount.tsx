import React, { useState } from 'react';
import { SolarPanelConfig } from '../../../types/solar';
import { Sun } from 'lucide-react';

import styles from "./inputPanelsCount.module.scss"


interface solarPanelCountProps {
  configId : number | undefined;
  setConfigId: React.Dispatch<React.SetStateAction<number | undefined>>;
  solarPanelConfigs : SolarPanelConfig[];
}

const SolarPanelCount = ({ configId, setConfigId , solarPanelConfigs }: solarPanelCountProps ) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigId(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.header_left}>
            <Sun />
            <span>Panels count</span>
        </div>
        <div className={styles.header_right}>
            {
              configId !== undefined  && (
                `${solarPanelConfigs[configId].panelsCount} panels`
              )
            }
        </div>
      </div>

      <input 
        type="range" 
        min={0}
        max={solarPanelConfigs.length - 1} 
        value={configId} 
        className={styles.inputPanelsCount}  
        onChange={(e)=>handleChange(e)}
      />
    </div>
  );
};

export default SolarPanelCount;
