import React, { useState } from 'react';
// import { SolarPanelConfig } from '../../types/solar';
import { Sun } from 'lucide-react';

import styles from "./inputPanelsCount.module.scss"

const SolarPanelCount = () => {
  const [configId, setConfigId] = useState<number>(0);

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
            250 panels
        </div>
      </div>

      <input type="range" min="0" max="200" value={configId} className={styles.inputPanelsCount}  onChange={(e)=>handleChange(e)}/>
    </div>
  );
};

export default SolarPanelCount;
