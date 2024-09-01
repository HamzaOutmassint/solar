import "./input.scss"

interface inputType {
    type? : string 
    value? : string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    ref?: React.RefObject<HTMLInputElement>;
    placeholder? : string
    id? : string
    className? : string
}


const Input = ({ type="text" , value, onChange , placeholder, ref , id , className } : inputType ) => {
  return (
    <main className='inputField'>
        <input 
          type={type} 
          value={value} 
          onChange={onChange} 
          placeholder="" 
          ref={ref}
          id={id}
          className={className}
        />
        <span>{placeholder}</span>
    </main>
  )
}

export default Input
