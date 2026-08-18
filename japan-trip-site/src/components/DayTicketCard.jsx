import styles from './DayTicketCard.module.css'

export default function DayTicketCard({ day, onSelect }) {
  const hasDay = day.day !== null && day.day !== undefined
  const isDestination = !!day.destinationSlug
  const Wrapper = isDestination ? 'button' : 'article'
  const wrapperProps = isDestination
    ? { type: 'button', className: styles.card, onClick: () => onSelect(day.destinationSlug) }
    : { className: styles.card, 'data-transit': true }

  return (
    <Wrapper {...wrapperProps}>
      {/* ── Stub: day number (JetBrains Mono, "stamped" look) ── */}
      <div className={styles.stub}>
        {hasDay ? (
          <>
            <span className={styles.dayLabel}>DAY</span>
            <span className={styles.dayNum}>
              {String(day.day).padStart(2, '0')}
            </span>
          </>
        ) : (
          <span className={styles.departureIcon} aria-label="Departure day">
            ✈︎
          </span>
        )}
      </div>

      {/* ── Body: date + location + plan + friend ── */}
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.date}>{day.date}</span>
          {day.location && (
            <span className={styles.location}>{day.location}</span>
          )}
        </div>

        <p className={styles.plan}>{day.plan}</p>

        {day.friend && (
          <p className={styles.friend}>
            <span className={styles.friendMarker} aria-hidden="true">◎</span>
            {day.friend}
          </p>
        )}
      </div>
</Wrapper>
  )
}
