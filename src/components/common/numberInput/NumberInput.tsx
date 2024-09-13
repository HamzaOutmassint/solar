import { numberInputProps } from "../../../types/solar"
import styles from "./numberInput.module.scss"


const NumberInput = ({value , setValue , label , suffix,icon, percentage}: numberInputProps) => {
  return (
    <main className={styles.inputField}>
      <strong>{icon}</strong>
      <input 
        type="number" 
        data-surffix={suffix ? "watts" : ""} 
        data-icon={icon ? "icon_true" : ""}
        data-percentage={percentage ? "percentage" : ""}
        onChange={(e)=>setValue(
          label === "DC to AC conversion" ? parseInt(e.target.value) / 100 : parseFloat(e.target.value)
        )} 
        value={value}
      />
      <span>{label}</span>
      <em>{suffix}</em>
      <em>{percentage}</em>
    </main> 
  )
}

export default NumberInput
