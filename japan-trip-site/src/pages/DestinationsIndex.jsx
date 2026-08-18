import itinerary from '../../data/itinerary.json'
import DestinationCard from '../components/DestinationCard'
import styles from './DestinationsIndex.module.css'

// All 9 destination JSONs loaded at build time
const destModules = import.meta.glob('../../data/destinations/*.json', {
  eager: true,
  import: 'default',
})
const allDestinations = Object.values(destModules)

// Preserve the real trip order from itinerary.json
const TRIP_ORDER = [
  ...new Set(itinerary.days.map(d => d.destinationSlug).filter(Boolean)),
]
const destinations = TRIP_ORDER
  .map(slug => allDestinations.find(d => d.slug === slug))
  .filter(Boolean)

export default function DestinationsIndex() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Destinations</h1>
          <p className={styles.subtitle}>9 stops · Jan 30 – Feb 14, 2027</p>
        </div>
      </header>

      <div className={`container ${styles.grid}`}>
        {destinations.map(dest => (
          <DestinationCard key={dest.slug} destination={dest} />
        ))}
      </div>
    </main>
  )
}
