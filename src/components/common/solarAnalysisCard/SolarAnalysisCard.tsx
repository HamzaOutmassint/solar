import styles from "./solarAnalysisCard.module.scss"

const SolarAnalysisCard = ({ costChartRef }: { costChartRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <div className={styles.solarAnalysisCard}>
      <div ref={costChartRef} style={{ width: '100%', height: '200px' }} />
    </div>
      
  )
}

export default SolarAnalysisCard
