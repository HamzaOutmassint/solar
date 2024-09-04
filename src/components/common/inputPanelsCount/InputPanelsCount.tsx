import { inputPanelCountProps } from '../../../types/solar';
import styles from "./inputPanelsCount.module.scss"
import { Sun } from 'lucide-react';


const InputPanelCount = ({ configId, setConfigId , solarPanelConfigs }: inputPanelCountProps ) => {

  // console.log(solarPanelConfigs)
  // console.log(configId)
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.header_left}>
            <Sun />
            <span>Panels count</span>
        </div>
        <div className={styles.header_right}>
            {
              // temporary solution
              configId !== undefined && configId <= solarPanelConfigs.length
              ?
              `${solarPanelConfigs[configId].panelsCount} panels`
              :
              `${solarPanelConfigs[0].panelsCount} panels`
            }
        </div>
      </div>

      <input 
        type="range" 
        min={0}
        max={solarPanelConfigs.length - 1} 
        value={configId} 
        // value={configId !== undefined && configId <= solarPanelConfigs.length ? configId : 4} 
        className={styles.inputPanelsCount}  
        onChange={(e)=>setConfigId(parseInt(e.target.value))}
      />
    </div>
  );
};

export default InputPanelCount;
