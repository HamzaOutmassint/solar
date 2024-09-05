import { showRoofOnlyProps } from "../../../types/solar";
import styles from "./showRoofOnly.module.scss"


const ShowRoofOnly = ({showRoofOnly , setShowRoofOnly}: showRoofOnlyProps) => {

    const toggleSwitch = () => {
        setShowRoofOnly(!showRoofOnly);
    };
    
    return (
        <div className={styles.container}>
            <div className={`${styles.on_off_switch} ${showRoofOnly ? styles.on : styles.off}`} onClick={toggleSwitch}>
                <div className={` ${styles.slider} ${showRoofOnly ? styles.on : styles.off}`}></div>
            </div>
            <span className={styles.lable}>Show roof only</span>
        </div>
    )
}

export default ShowRoofOnly
