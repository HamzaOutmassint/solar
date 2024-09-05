import styles from "./loading.module.scss"

const Loading = () => {
  return (
    <div className={styles.load_wrapp}>
        <div className={styles.load}>
            <div className={styles.bar}></div>
        </div>
    </div>
  )
}

export default Loading