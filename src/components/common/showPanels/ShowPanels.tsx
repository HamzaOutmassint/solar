import { showPanlesProps } from "../../../types/solar";
import styles from "./showPanels.module.scss"

const ShowPanels = ({ showPanels, setShowPanels }: showPanlesProps) => {

  const toggleSwitch = () => {
    setShowPanels(!showPanels);
  };

  return (
    <div className={styles.container}>
        <div className={`${styles.on_off_switch} ${showPanels ? styles.on : styles.off}`} onClick={toggleSwitch}>
            <div className={` ${styles.slider} ${showPanels ? styles.on : styles.off}`}></div>
        </div>
        <span className={styles.lable}>Show solar panels</span>
    </div>
  );
};

export default ShowPanels;