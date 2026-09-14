import DayTicketCard from './DayTicketCard'
import travel from '../../data/travel.json'
import styles from './RouteLine.module.css'

/** Group consecutive days with the same destinationSlug into stops. */
function groupByDestination(days) {
  const groups = []
  for (const day of days) {
    const last = groups[groups.length - 1]
    if (last && last.slug === day.destinationSlug) {
      last.days.push(day)
    } else {
      groups.push({ slug: day.destinationSlug, days: [day] })
    }
  }
  return groups
}

export default function RouteLine({ days, destinations, onSelect }) {
  const groups = groupByDestination(days)

  return (
    <ol className={styles.routeLine} aria-label="Trip itinerary">
      {groups.map((group, gi) => {
        const nextGroup = groups[gi + 1]
        const leg = nextGroup
          ? travel.legs.find(item => item.from === group.slug && item.to === nextGroup.slug)
          : null
        const dest = group.slug ? destinations[group.slug] : null

        return (
          <li
            key={gi}
            className={styles.stop}
            style={{ '--stop-index': gi }}
          >
            {/* ── Marker column (aria-hidden — purely visual) ── */}
            <div className={styles.markerCol} aria-hidden="true">
              <div
                className={styles.markerDot}
                data-transit={!group.slug || undefined}
              />
              {leg && <div className={styles.connector} data-type={leg.type} />}
            </div>

            {/* ── Content column ── */}
            <div className={styles.stopContent}>
              {dest && (
                <button
                  type="button"
                  className={styles.stationName}
                  onClick={() => onSelect(group.slug)}
                >
                  {dest.name}
                </button>
              )}
              <ul className={styles.dayList}>
                {group.days.map((day) => (
                  <li key={day.day ?? day.date}>
                    <DayTicketCard day={day} onSelect={onSelect} />
                  </li>
                ))}
              </ul>
              {leg && (
                <div className={styles.travelSummary}>
                  <span className={styles.travelIcon} aria-hidden="true">{leg.icon}</span>
                  <span>{leg.method} ({leg.time})</span>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
