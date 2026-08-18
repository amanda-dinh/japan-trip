import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PulledImage from './PulledImage'
import RecommendationSheet from './RecommendationSheet'
import { CATEGORY_LABELS } from './RecommendationCard'
import styles from './DestinationSheet.module.css'

const CATEGORY_ORDER = [
  'iconic', 'historic', 'nature', 'traditional-experience',
  'food', 'art-design', 'pop-culture', 'nightlife',
  'wildlife', 'ghibli-park', 'logistics', 'if-time-allows',
]

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
  for (const [cat, recs] of Object.entries(byCategory)) {
    if (!CATEGORY_ORDER.includes(cat)) ordered.push([cat, recs])
  }
  return ordered
}

export default function DestinationSheet({ dest, onClose }) {
  const [activeRec, setActiveRec] = useState(null)

  // Escape: close rec sheet first, then dest sheet
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !activeRec) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, activeRec])

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const categoryGroups = groupRecommendations(dest.recommendations ?? [])

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}>
        <div
          className={styles.sheet}
          role="dialog"
          aria-modal="true"
          aria-label={dest.name}
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            &#x2715;
          </button>

          {/* Destination photo */}
          <div className={styles.imageWrapper}>
            <PulledImage
              query={dest.imageQuery}
              alt={dest.name}
              className={styles.image}
            />
          </div>

          {/* Scrollable content */}
          <div className={styles.content}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>{dest.name}</h2>
              <span className={styles.days}>{dest.days}</span>
            </div>

            <p className={styles.overview}>{dest.overview}</p>

            {/* Recommendations, grouped by category */}
            {categoryGroups.map(([category, recs]) => (
              <div key={category} className={styles.categoryGroup}>
                <h3 className={styles.categoryHeading}>
                  <span
                    className={styles.categoryPip}
                    data-cat={category}
                    aria-hidden="true"
                  />
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
                <ul className={styles.recList}>
                  {recs.map(rec => (
                    <li key={rec.slug}>
                      <button
                        type="button"
                        className={styles.recItem}
                        onClick={() => setActiveRec(rec)}
                      >
                        <span className={styles.recTitle}>{rec.title}</span>
                        <span className={styles.recSummary}>{rec.summary}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sticky footer CTA */}
          <div className={styles.sheetFooter}>
            <Link
              to={`/destinations/${dest.slug}`}
              className={styles.fullPageLink}
              onClick={onClose}
            >
              View full {dest.name} page →
            </Link>
          </div>
        </div>
      </div>

      {/* Recommendation sheet stacks on top */}
      {activeRec && (
        <RecommendationSheet
          rec={activeRec}
          onClose={() => setActiveRec(null)}
        />
      )}
    </>
  )
}
