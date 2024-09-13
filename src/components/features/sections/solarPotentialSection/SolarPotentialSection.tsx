import styles from "./solarPotentialSection.module.scss";
import { ChartLine, ChevronDown, ChevronUp } from "lucide-react";
import NumberInput from "../../../common/numberInput/NumberInput";
// import SolarAnalysisCard from "../../../common/solarAnalysisCard/SolarAnalysisCard";
// import InputPanelsCount from "../../../common/inputPanelsCount/InputPanelsCount";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// import { GoogleCharts } from "google-charts";
import { Chart } from "react-google-charts";

import React, { useEffect, useState, useRef } from "react";
// import type { SolarPanelConfig } from "../../../../types/solar";
import { showMoney, showNumber } from './../../../../utils/utils';

import { solarPotentiolSectionProps } from "../../../../types/solar";
import SummaryCard from "../../../common/summaryCard/SummaryCard";
import SolarAnalysisCard from "../../../common/solarAnalysisCard/SolarAnalysisCard";

const SolarPotentiolSection: React.FC<solarPotentiolSectionProps> = ({
    configId,
    setConfigId,
    monthlyAverageEnergyBillInput,
    setMonthlyAverageEnergyBillInput,
    setDcToAcDerateInput,
    dcToAcDerateInput,
    setEnergyCostPerKwhInput,
    energyCostPerKwhInput,
    setPanelCapacityWattsInput,
    panelCapacityWattsInput,
    solarPanelConfigs,
    defaultPanelCapacityWatts,
}) => {
    const [accordionStates, setAccordionStates] = useState(false);
  const [panelsCount] = useState(20);
  const [yearlyEnergyDcKwh] = useState(12000);

  // Basic settings
  const [solarIncentives, setSolarIncentives] = useState(7000);
  const [installationCostPerWatt, setInstallationCostPerWatt] = useState(4.0);
  const [installationLifeSpan, setInstallationLifeSpan] = useState(20);

  // Advanced settings
  const [efficiencyDepreciationFactor, setEfficiencyDepreciationFactor] = useState(0.995);
  const [costIncreaseFactor, setCostIncreaseFactor] = useState(1.022);
  const [discountRate, setDiscountRate] = useState(1.04);
  const [installationSizeKw, setInstallationSizeKw] = useState( (panelsCount * panelCapacityWattsInput) / 1000 );
  const [installationCostTotal, setInstallationCostTotal] = useState( installationCostPerWatt * installationSizeKw * 1000 );
  const [monthlyKwhEnergyConsumption, setMonthlyKwhEnergyConsumption] = useState( monthlyAverageEnergyBillInput / energyCostPerKwhInput );
  const [yearlyKwhEnergyConsumption, setYearlyKwhEnergyConsumption] = useState( monthlyKwhEnergyConsumption * 12 );
  const [initialAcKwhPerYear, setInitialAcKwhPerYear] = useState( yearlyEnergyDcKwh * dcToAcDerateInput );
  const [yearlyProductionAcKwh, setYearlyProductionAcKwh] = useState<number[]>([]);
  const [yearlyUtilityBillEstimates, setYearlyUtilityBillEstimates] = useState<number[]>([]);
  const [remainingLifetimeUtilityBill, setRemainingLifetimeUtilityBill] = useState(0);
  const [totalCostWithSolar, setTotalCostWithSolar] = useState(0);
  const [yearlyCostWithoutSolar, setYearlyCostWithoutSolar] = useState<number[]>([]);
  const [totalCostWithoutSolar, setTotalCostWithoutSolar] = useState(0);
  const [savings, setSavings] = useState(0);
  const [energyCovered, setEnergyCovered] = useState(0);
  const [breakEvenYear, setBreakEvenYear] = useState(-1);
  const [panelCapacityRatio, setPanelCapacityRatio] = useState(1.0);

  const costChart = useRef<HTMLDivElement | null>(null);

  // UseEffect to handle updates for values
  useEffect(() => {
    if(configId !== undefined){
        setPanelCapacityWattsInput(panelCapacityWattsInput);
        setInstallationSizeKw((solarPanelConfigs[configId]?.panelsCount ?? panelsCount) * panelCapacityWattsInput / 1000);
        setInstallationCostTotal(installationCostPerWatt * installationSizeKw * 1000);
        setMonthlyKwhEnergyConsumption(monthlyAverageEnergyBillInput / energyCostPerKwhInput);
        setYearlyKwhEnergyConsumption(monthlyKwhEnergyConsumption * 12);
        setInitialAcKwhPerYear(
          solarPanelConfigs[configId]?.yearlyEnergyDcKwh * (panelCapacityWattsInput / defaultPanelCapacityWatts) * dcToAcDerateInput
        );
        setPanelCapacityRatio(panelCapacityWattsInput / defaultPanelCapacityWatts);
    }
  }, [configId, panelCapacityWattsInput, monthlyAverageEnergyBillInput, energyCostPerKwhInput, dcToAcDerateInput, solarPanelConfigs, panelsCount, installationCostPerWatt, installationSizeKw, monthlyKwhEnergyConsumption, defaultPanelCapacityWatts, setPanelCapacityWattsInput]);

  useEffect(() => {
    // Calculate yearly production and savings
    const yearlyProductionAcKwhTemp = [...Array(installationLifeSpan).keys()].map(
      (year) => initialAcKwhPerYear * efficiencyDepreciationFactor ** year
    );
    setYearlyProductionAcKwh(yearlyProductionAcKwhTemp);

    const yearlyUtilityBillEstimatesTemp = yearlyProductionAcKwhTemp.map((yearlyKwhEnergyProduced, year) => {
      const billEnergyKwh = yearlyKwhEnergyConsumption - yearlyKwhEnergyProduced;
      return Math.max(
        (billEnergyKwh * energyCostPerKwhInput * costIncreaseFactor ** year) / discountRate ** year,
        0
      );
    });
    setYearlyUtilityBillEstimates(yearlyUtilityBillEstimatesTemp);
    setRemainingLifetimeUtilityBill(yearlyUtilityBillEstimatesTemp.reduce((x, y) => x + y, 0));

    setTotalCostWithSolar(
      installationCostTotal + remainingLifetimeUtilityBill - solarIncentives
    );

    const yearlyCostWithoutSolarTemp = [...Array(installationLifeSpan).keys()].map(
      (year) =>
        (monthlyAverageEnergyBillInput * 12 * costIncreaseFactor ** year) / discountRate ** year
    );
    setYearlyCostWithoutSolar(yearlyCostWithoutSolarTemp);
    setTotalCostWithoutSolar(yearlyCostWithoutSolarTemp.reduce((x, y) => x + y, 0));

    setSavings(totalCostWithoutSolar - totalCostWithSolar);
    setEnergyCovered(yearlyProductionAcKwhTemp[0] / yearlyKwhEnergyConsumption);
  }, [initialAcKwhPerYear, installationCostTotal, remainingLifetimeUtilityBill, solarIncentives, yearlyKwhEnergyConsumption, efficiencyDepreciationFactor, costIncreaseFactor, discountRate, installationLifeSpan, totalCostWithoutSolar, totalCostWithSolar, energyCostPerKwhInput, monthlyAverageEnergyBillInput]);


//   useEffect(() => {
//     if (costChart.current) {
//       GoogleCharts.load(() => {
//         const year = new Date().getFullYear();
//         const cumulativeCostsWithSolar = yearlyUtilityBillEstimates.map(
//           (billEstimate, i) =>
//             i === 0 ? billEstimate + installationCostTotal - solarIncentives : billEstimate
//         );
//         const cumulativeCostsWithoutSolar = yearlyCostWithoutSolar.map((cost) => cost);

//         const breakEvenIdx = cumulativeCostsWithSolar.findIndex(
//           (costWithSolar, i) => costWithSolar <= cumulativeCostsWithoutSolar[i]
//         );
//         setBreakEvenYear(breakEvenIdx);

//         const data = GoogleCharts.api.visualization.arrayToDataTable([
//           ["Year", "Solar", "No solar"],
//           [year.toString(), 0, 0],
//           ...cumulativeCostsWithSolar.map((_, i) => [
//             (year + i + 1).toString(),
//             cumulativeCostsWithSolar[i],
//             cumulativeCostsWithoutSolar[i],
//           ]),
//         ]);

//         const chart = new GoogleCharts.api.visualization.LineChart(costChart.current);
//         // const options = {
//         //   title: `Cost analysis for ${installationLifeSpan} years`,
//         //   width: 400,
//         //   height: 200,
//         // };
//         chart.draw(data);
//       }, { packages: ["line"] });
//     }
//   }, [yearlyUtilityBillEstimates, yearlyCostWithoutSolar, installationCostTotal, solarIncentives, installationLifeSpan]);

  // Handle changes from input fields
//   const updateConfig = () => {
//     setMonthlyKwhEnergyConsumption(monthlyAverageEnergyBillInput / energyCostPerKwhInput);
//     setYearlyKwhEnergyConsumption(monthlyKwhEnergyConsumption * 12);
//     setPanelCapacityWatts(panelCapacityWattsInput);
//   };

  return (
        <div className={styles.accordion}>
            <div
                onClick={() => setAccordionStates(!accordionStates)}
                style={{ cursor: "pointer" }}
                className={styles.accordion__header}
            >
                <div className={styles.accordion__header_title}>
                    <h1>
                        <ChartLine /> <span>Solar Potential analysis</span>
                    </h1>
                    {accordionStates ? <ChevronDown /> : <ChevronUp />}
                </div>
                <span>update with your own values</span>
            </div>
            <div className={` ${accordionStates ? styles.toggel : ""} ${styles.accordion__content}`}>
                
                <NumberInput
                  value={monthlyAverageEnergyBillInput}
                  setValue={setMonthlyAverageEnergyBillInput}
                  label="Monthly average energy bill"
                  icon="$"
                />
                {/* <InputPanelsCount
                  configId={configId}
                  setConfigId={setConfigId}
                  solarPanelConfigs={solarPanelConfigs}
                /> */}
                <NumberInput
                  value={energyCostPerKwhInput}
                  setValue={setEnergyCostPerKwhInput}
                  label="Energy cost per kWh"
                  icon="$"
                />
                <NumberInput
                  value={solarIncentives}
                  setValue={setSolarIncentives}
                  label="Solar incentives"
                  icon="$"
                />
                <NumberInput
                  value={installationCostPerWatt}
                  setValue={setInstallationCostPerWatt}
                  label="Installation cost per Watt"
                  icon="$"
                />
                <NumberInput
                  value={panelCapacityWattsInput}
                  setValue={setPanelCapacityWattsInput}
                  label="Panel capacity"
                  suffix="Watts"
                />
                <NumberInput
                  value={installationLifeSpan}
                  setValue={setInstallationLifeSpan}
                  label="Installation lifespan"
                  suffix="years"
                />
                <NumberInput
                  value={dcToAcDerateInput * 100}
                  setValue={setDcToAcDerateInput}
                  label="DC to AC conversion"
                  percentage="%"
                />
                <NumberInput
                  value={efficiencyDepreciationFactor}
                  setValue={setEfficiencyDepreciationFactor}
                  label="Panel efficiency decline per year"
                  percentage="%"
                />
                <NumberInput
                  value={costIncreaseFactor}
                  setValue={setCostIncreaseFactor}
                  label="Energy cost increase per year"
                  percentage="%"
                />
                <NumberInput
                  value={discountRate}
                  setValue={setDiscountRate}
                  label="Discount rate per year"
                  percentage="%"
                />

                {
                  accordionStates
                  ?
                  <>
                    <SummaryCard 
                      rows={[
                        {
                          name: 'Yearly energy',
                          value: showNumber(
                            configId !== undefined 
                            ?
                            (solarPanelConfigs[configId]?.yearlyEnergyDcKwh ?? 0) * panelCapacityRatio
                            :
                            0
                          ),
                          units: 'kWh',
                          icon: "Leaf"
                        },
                        {
                          name: 'Installation size',
                          value: showNumber(installationSizeKw),
                          units: 'kW',
                          icon: "CircleGauge"
                        },
                        {
                          name: 'Installation cost',
                          value: showMoney(installationCostTotal),
                          icon: "CircleDollarSign"
                        },
                        {
                          name: 'Energy covered',
                          value: Math.round(energyCovered * 100).toString(),
                          units: '%',
                          icon : "BatteryFull"
                        }
                      ]}
                    />
                      <SolarAnalysisCard 
                        yearlyCostWithoutSolar={yearlyCostWithoutSolar}
                        yearlyUtilityBillEstimates={yearlyUtilityBillEstimates}
                        setBreakEvenYear={setBreakEvenYear}
                        installationCostTotal={installationCostTotal}
                        solarIncentives={solarIncentives}
                        installationLifeSpan={installationLifeSpan}
                      />
                  </>
                  :
                      null
                }
            </div>
        </div>
  )
}

export default SolarPotentiolSection