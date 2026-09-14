import styles from './WeatherSummary.module.css'

export default function WeatherSummary({ weather }) {
  if (!weather) return null

  return (
    <section className={styles.summary} aria-label={`Typical ${weather.month} weather`}>
      <div className={styles.headingRow}>
        <h3 className={styles.heading}>Typical {weather.month} weather</h3>
        <span className={styles.eyebrow}>Historical average</span>
      </div>
      <div className={styles.temperatures}>
        <div className={styles.temperature}>
          <span className={styles.label}>Average high</span>
          <strong>{weather.high}</strong>
        </div>
        <div className={styles.temperature}>
          <span className={styles.label}>Average low</span>
          <strong>{weather.low}</strong>
        </div>
      </div>
      <p className={styles.source}>{weather.source}; not a forecast.</p>
    </section>
  )
}
