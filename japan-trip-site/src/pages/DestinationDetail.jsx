import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import itinerary from '../../data/itinerary.json'
import PulledImage from '../components/PulledImage'
import RecommendationCard from '../components/RecommendationCard'
import RecommendationSheet from '../components/RecommendationSheet'
import styles from './DestinationDetail.module.css'

// All destinations keyed by slug, loaded at build time
const destModules = import.meta.glob('../../data/destinations/*.json', {
  eager: true,
  import: 'default',
})
const destinations = Object.values(destModules).reduce((acc, dest) => {
  acc[dest.slug] = dest
  return acc
}, {})

// Ordered list of destination slugs, derived from the real trip sequence
const TRIP_ORDER = [
  ...new Set(itinerary.days.map(d => d.destinationSlug).filter(Boolean)),
]

const CATEGORY_ORDER = [
  'iconic', 'historic', 'nature', 'traditional-experience',
  'food', 'art-design', 'pop-culture', 'nightlife',
  'wildlife', 'ghibli-park', 'logistics', 'if-time-allows',
]

const CATEGORY_LABELS = {
  iconic:                  'Iconic',
  historic:                'Historic & Temples',
  nature:                  'Nature',
  'traditional-experience': 'Traditional Experiences',
  food:                    'Food & Drink',
  'art-design':            'Art & Design',
  'pop-culture':           'Pop Culture',
  nightlife:               'Nightlife',
  wildlife:                'Wildlife',
  logistics:               'Logistics',
  'if-time-allows':        'If Time Allows',
  'ghibli-park':           'Ghibli Park',
}

function groupRecommendations(recommendations) {
  const byCategory = {}
  for (const rec of recommendations) {
    if (!byCategory[rec.category]) byCategory[rec.category] = []
    byCategory[rec.category].push(rec)
  }
  const ordered = []
  for (const cat of CATEGORY_ORDER) {
    if (byCategory[cat]) ordered.push([cat, byCategory[cat]])
  }
  // Any unknown categories fall to the end
  for (const [cat, recs] of Object.entries(byCategory)) {
    if (!CATEGORY_ORDER.includes(cat)) ordered.push([cat, recs])
  }
  return ordered
}

export default function DestinationDetail() {
  const { slug } = useParams()
  const dest = destinations[slug]

  if (!dest) {
    return (
      <main className={`container ${styles.notFound}`}>
        <p>Destination "{slug}" not found.</p>
        <Link to="/destinations">← Back to destinations</Link>
      </main>
    )
  }

  const categoryGroups = groupRecommendations(dest.recommendations ?? [])

  const currentIdx = TRIP_ORDER.indexOf(slug)
  const prevDest = currentIdx > 0 ? destinations[TRIP_ORDER[currentIdx - 1]] : null
  const nextDest = currentIdx < TRIP_ORDER.length - 1 ? destinations[TRIP_ORDER[currentIdx + 1]] : null

  const [activeRec, setActiveRec] = useState(null)

  return (
    <main className={styles.page}>

      {activeRec && (
        <RecommendationSheet
          rec={activeRec}
          onClose={() => setActiveRec(null)}
        />
      )}

      {/* ── Hero: pulled photo + title overlay ── */}
      <div className={styles.hero}>
        <PulledImage
          query={dest.imageQuery}
          alt={dest.name}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <div className="container">
            <Link to="/destinations" className={styles.backLink}>
              ← Destinations
            </Link>
            <h1 className={styles.heroName}>{dest.name}</h1>
            <p className={styles.heroDays}>{dest.days}</p>
          </div>
        </div>
      </div>

      {/* ── Overview ── */}
      <section className={`container ${styles.overviewSection}`} aria-label="Overview">
        <p className={styles.overview}>{dest.overview}</p>

        {dest.openQuestions?.length > 0 && (
          <aside className={styles.openQuestions} aria-label="Still deciding">
            <h2 className={styles.oqHeading}>Still deciding…</h2>
            <ul className={styles.oqList}>
              {dest.openQuestions.map((q, i) => (
                <li key={i} className={styles.oqItem}>{q}</li>
              ))}
            </ul>
          </aside>
        )}
      </section>

      {/* ── Recommendations grouped by category ── */}
      {categoryGroups.map(([category, recs]) => (
        <section
          key={category}
          className={`container ${styles.categorySection}`}
          aria-label={CATEGORY_LABELS[category] ?? category}
        >
          <h2 className={styles.categoryHeading}>
            <span className={styles.categoryPip} data-cat={category} aria-hidden="true" />
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <ul className={styles.recGrid}>
            {recs.map(rec => (
              <li key={rec.slug}>
                <RecommendationCard rec={rec} onSelect={setActiveRec} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* ── Prev / next destination navigation ── */}
      <nav
        className={`container ${styles.destNav}`}
        aria-label="Destination navigation"
      >
        {prevDest ? (
          <Link
            to={`/destinations/${prevDest.slug}`}
            className={styles.navLink}
            data-dir="prev"
          >
            <span className={styles.navLabel}>← Previous</span>
            <span className={styles.navName}>{prevDest.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {nextDest && (
          <Link
            to={`/destinations/${nextDest.slug}`}
            className={styles.navLink}
            data-dir="next"
          >
            <span className={styles.navLabel}>Next →</span>
            <span className={styles.navName}>{nextDest.name}</span>
          </Link>
        )}
      </nav>

    </main>
  )
}
