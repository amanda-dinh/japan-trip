import styles from './DayTicketCard.module.css'

export default function DayTicketCard({ day, onSelect }) {
  const hasDay = day.day !== null && day.day !== undefined
  const isDestination = !!day.destinationSlug
  const [weekday, month, date] = day.date.split(' ')
  const Wrapper = isDestination ? 'button' : 'article'
  const wrapperProps = isDestination
    ? { type: 'button', className: styles.card, onClick: () => onSelect(day.destinationSlug) }
    : { className: styles.card, 'data-transit': true }

  return (
    <Wrapper {...wrapperProps}>
      {/* ── Stub: date ── */}
      <div className={styles.stub}>
        <span className={styles.month}>{month}</span>
        <span className={styles.dateNum}>{date}</span>
        <span className={styles.weekday}>{weekday}</span>
      </div>

      {/* ── Body: day number + location + plan + friend ── */}
      <div className={styles.body}>
        <div className={styles.topRow}>
          {hasDay ? (
            <span className={styles.dayNumber}>
              DAY {String(day.day).padStart(2, '0')}
            </span>
          ) : (
            <span className={styles.departureIcon} aria-label="Departure day">
              ✈︎
            </span>
          )}
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
