import Chart from "react-google-charts"
import styles from "./solarAnalysisCard.module.scss"
import { useEffect, useState } from "react"
import { relative } from "path";

interface solarAnalysisCardProps {
  yearlyUtilityBillEstimates : number[];
  yearlyCostWithoutSolar : number[];
  installationCostTotal : number;
  solarIncentives : number;
  setBreakEvenYear : React.Dispatch<React.SetStateAction<number>>;
  installationLifeSpan : number
}

const SolarAnalysisCard : React.FC<solarAnalysisCardProps> = ({ 
  yearlyUtilityBillEstimates, 
  yearlyCostWithoutSolar, 
  installationCostTotal, 
  solarIncentives, 
  setBreakEvenYear,
  installationLifeSpan 
}) => {
  const [data, setData]=useState<(string | number)[][]>([])

  useEffect(()=>{
    const year = new Date().getFullYear();

    let costWithSolar = 0;  
    const cumulativeCostsWithSolar = yearlyUtilityBillEstimates.map(
      (billEstimate, i) =>
        (costWithSolar +=
          i === 0 ? billEstimate + installationCostTotal - solarIncentives : billEstimate),
    );

    let costWithoutSolar = 0;
    const cumulativeCostsWithoutSolar = yearlyCostWithoutSolar.map(
      (cost) => (costWithoutSolar += cost),
    );

    const breakEvenIdx = cumulativeCostsWithSolar.findIndex(
      (costWithSolar, i) => costWithSolar <= cumulativeCostsWithoutSolar[i],
    );
    setBreakEvenYear(breakEvenIdx);

    setData([
      ['Year', 'Solar', 'No solar'],
      [year.toString(), 0, 0],
      ...cumulativeCostsWithSolar.map((_, i) => [
        (year + i + 1).toString(),
        cumulativeCostsWithSolar[i],
        cumulativeCostsWithoutSolar[i],
      ]),
    ])

  },[installationCostTotal, setBreakEvenYear, solarIncentives, yearlyCostWithoutSolar, yearlyUtilityBillEstimates])

  console.log(data)
  return (
    <div className={styles.solarAnalysisCard}>
        <Chart
          chartType="Line"
          width="350px"
          height="200px"
          data={data}
          options={{
            chart: {
              title: `Cost analysis for ${installationLifeSpan} years`,
            },
          }}
        />
    </div>
      
  )
}

export default SolarAnalysisCard
