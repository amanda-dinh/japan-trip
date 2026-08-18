import { useState, useEffect } from 'react'
import { fetchPixabayImage } from '../lib/pixabay'
import styles from './PulledImage.module.css'

/**
 * Fetches an image from Pixabay for the given `query` and renders it.
 * Falls back to a neutral placeholder on load or failure.
 * Pass `className` to control dimensions / object-fit from the parent.
 */
export default function PulledImage({ query, alt, className }) {
  // undefined = still loading, null = confirmed no image, string = URL
  const [src, setSrc] = useState(undefined)

  useEffect(() => {
    let active = true
    setSrc(undefined)
    fetchPixabayImage(query).then(url => {
      if (active) setSrc(url)
    })
    return () => {
      active = false
    }
  }, [query])

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={`${styles.placeholder} ${className ?? ''}`}
      role="img"
      aria-label={alt}
    >
      {src === null && (
        <span className={styles.placeholderText}>{alt}</span>
      )}
    </div>
  )
}
