import { BatteryFull, CircleDollarSign, CircleGauge, Leaf } from "lucide-react";
import "./summaryCard.scss";

interface RowData {
  name: string; // Name of the data point
  value: string | number; // Value can be a string or a number
  units?: string; // Units for the value (optional)
  icon?: string; // Icon name (required)
}

// Type for the rows array
type Rows = RowData[];

interface summaryCardProps {
  rows: Rows;
}

const SummaryCard = ({ rows }: summaryCardProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return <Leaf />;
      case "CircleGauge":
        return <CircleGauge />;
      case "CircleDollarSign":
        return <CircleDollarSign />;
      case "BatteryFull":
        return <BatteryFull />;
      default:
        return null; 
    }
  };

  return (
    <div className="summaryCard">
      {rows.map((item, i) => (
        <div className="summaryCard_item" key={i}>
          <strong>
            {getIcon(item.icon !== undefined ? item.icon : "")} {/* Render the icon dynamically */}
            <span>{item.name}</span>
          </strong>
          <div>{item.value} {item.units}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCard;