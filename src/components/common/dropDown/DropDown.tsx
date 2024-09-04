import { LayerId } from "../../../types/solar";

interface DropDownProps {
  options: Record<LayerId | "none", string>;
  onChange: (value: LayerId) => void; 
}

const DropDown = ({ options, onChange }: DropDownProps) => {
  return (
    <>
      <select name="" id="" onChange={(e) => onChange(e.target.value as LayerId)}>
        {Object.entries(options).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
};

export default DropDown;