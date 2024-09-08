import { toggleSwitchProps } from "../../../types/solar";
import styles from "./toggleSwitch.module.scss"

const ToggleSwitch = ({ state, setState }: toggleSwitchProps) => {

  const toggleSwitch = () => {
    setState(!state);
  };

  return (
    <div className={styles.container}>
        <div className={`${styles.on_off_switch} ${state ? styles.on : styles.off}`} onClick={toggleSwitch}>
            <div className={` ${styles.slider} ${state ? styles.on : styles.off}`}></div>
        </div>
    </div>
  );
};

export default ToggleSwitch;