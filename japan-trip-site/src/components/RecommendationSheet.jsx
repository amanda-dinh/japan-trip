import { useEffect } from 'react'
import PulledImage from './PulledImage'
import { CATEGORY_LABELS } from './RecommendationCard'
import styles from './RecommendationSheet.module.css'

export default function RecommendationSheet({ rec, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={rec.title}
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

        <div className={styles.imageWrapper}>
          <PulledImage
            query={rec.imageQuery}
            alt={rec.title}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <span className={styles.badge} data-cat={rec.category}>
            {CATEGORY_LABELS[rec.category] ?? rec.category}
          </span>
          <h2 className={styles.title}>{rec.title}</h2>
          <p className={styles.summary}>{rec.summary}</p>
          <p className={styles.body}>{rec.body}</p>
        </div>
      </div>
    </div>
  )
}
