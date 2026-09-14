import TravelReference from '../components/TravelReference'
import styles from './TravelReferencePage.module.css'

export default function TravelReferencePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Trip logistics</p>
          <h1 className={styles.title}>Travel reference</h1>
          <p className={styles.tagline}>Times, transport, and planning costs between stops</p>
        </div>
      </header>
      <div className="container">
        <TravelReference />
      </div>
    </main>
  )
}