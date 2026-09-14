import travel from '../../data/travel.json'
import styles from './TravelReference.module.css'

export default function TravelReference() {
  return (
    <section aria-label="Travel reference" className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Getting around</p>
          <h2 className={styles.heading}>Travel reference</h2>
        </div>
        <span className={styles.updated}>Updated {travel.updated}</span>
      </div>

      <p className={styles.disclaimer}>{travel.disclaimer}</p>

      <div className={styles.legs}>
        {travel.legs.map(leg => (
          <article className={styles.leg} key={`${leg.day}-${leg.route}`}>
            <div className={styles.routeBlock}>
              <span className={styles.day}>{leg.day}</span>
              <h3 className={styles.route}>{leg.route}</h3>
            </div>
            <div className={styles.details}>
              <span className={styles.method}>{leg.method}</span>
              <span>{leg.time}</span>
              <span>{leg.cost}</span>
              <p className={styles.note}>{leg.note}</p>
              <a className={styles.source} href={leg.source} target="_blank" rel="noreferrer">
                Operator / airport info ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}