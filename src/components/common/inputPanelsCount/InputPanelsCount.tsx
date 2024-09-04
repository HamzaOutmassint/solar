import { inputPanelCountProps } from '../../../types/solar';
import styles from "./inputPanelsCount.module.scss"
import { Sun } from 'lucide-react';


const InputPanelCount = ({ configId, setConfigId , solarPanelConfigs }: inputPanelCountProps ) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigId(parseInt(event.target.value, 10));
  };

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

export default InputPanelCount;
