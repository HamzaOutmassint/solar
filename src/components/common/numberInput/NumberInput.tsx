import { numberInputProps } from "../../../types/solar"
import styles from "./numberInput.module.scss"


const NumberInput = ({value , setValue , label , suffix}: numberInputProps) => {
  return (
    <main className={styles.inputField}>
      <input type="number" onChange={(e)=>setValue(parseInt(e.target.value))} value={value}/>
      <span>{label}</span>
  </main>
    
  )
}

export default NumberInput
