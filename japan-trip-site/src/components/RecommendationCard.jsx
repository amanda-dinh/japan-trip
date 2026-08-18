import PulledImage from './PulledImage'
import styles from './RecommendationCard.module.css'

export const CATEGORY_LABELS = {
  iconic:                  'Iconic',
  historic:                'Historic',
  nature:                  'Nature',
  'traditional-experience': 'Traditional',
  food:                    'Food & Drink',
  'art-design':            'Art & Design',
  'pop-culture':           'Pop Culture',
  nightlife:               'Nightlife',
  wildlife:                'Wildlife',
  logistics:               'Logistics',
  'if-time-allows':        'If Time Allows',
  'ghibli-park':           'Ghibli Park',
}

export default function RecommendationCard({ rec, onSelect }) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onSelect(rec)}
    >
      <div className={styles.imageWrapper}>
        <PulledImage
          query={rec.imageQuery}
          alt={rec.title}
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <span className={styles.badge} data-cat={rec.category}>
          {CATEGORY_LABELS[rec.category] ?? rec.category}
        </span>
        <h3 className={styles.title}>{rec.title}</h3>
        <p className={styles.summary}>{rec.summary}</p>
      </div>
    </button>
  )
}
