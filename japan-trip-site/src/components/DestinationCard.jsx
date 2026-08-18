import { Link } from 'react-router-dom'
import PulledImage from './PulledImage'
import styles from './DestinationCard.module.css'

export default function DestinationCard({ destination }) {
  const { slug, name, days, overview, imageQuery } = destination

  return (
    <Link to={`/destinations/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <PulledImage
          query={imageQuery}
          alt={name}
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.days}>{days}</p>
        <p className={styles.teaser}>{overview}</p>
      </div>
    </Link>
  )
}
