import { useState } from 'react'
import itinerary from '../../data/itinerary.json'
import RouteLine from '../components/RouteLine'
import DestinationSheet from '../components/DestinationSheet'
import styles from './ItineraryHome.module.css'

// Load all destination JSONs at build time via Vite glob
const destModules = import.meta.glob('../../data/destinations/*.json', {
  eager: true,
  import: 'default',
})
const destinations = Object.values(destModules).reduce((acc, dest) => {
  acc[dest.slug] = dest
  return acc
}, {})

export default function ItineraryHome() {
  const [activeDest, setActiveDest] = useState(null)

  return (
    <main className={styles.page}>
      {activeDest && (
        <DestinationSheet
          dest={activeDest}
          onClose={() => setActiveDest(null)}
        />
      )}
      <header className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Jan 29 – Feb 14, 2027</p>
          <h1 className={styles.title}>Japan Trip 2027</h1>
          <p className={styles.tagline}>16 days · 9 destinations</p>
        </div>
      </header>

      <section
        aria-label="Day-by-day itinerary"
        className={`container ${styles.itinerarySection}`}
      >
        <RouteLine
          days={itinerary.days}
          destinations={destinations}
          onSelect={slug => setActiveDest(destinations[slug])}
        />
      </section>

      {itinerary.notes?.length > 0 && (
        <section
          aria-label="Planning notes"
          className={`container ${styles.notesSection}`}
        >
          <div className={styles.notes}>
            <h2 className={styles.notesHeading}>Planning notes</h2>
            <ul className={styles.notesList}>
              {itinerary.notes.map((note, i) => (
                <li key={i} className={styles.notesItem}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
