import DayTicketCard from './DayTicketCard'
import styles from './RouteLine.module.css'

/** True when the first day of a group arrived by ferry (plan contains "Ferry from"). */
function isFerryLeg(plan) {
  return /ferry from/i.test(plan ?? '')
}

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
        // The connector below this stop is colored by how we ARRIVE at the next stop
        const legType = nextGroup
          ? isFerryLeg(nextGroup.days[0]?.plan) ? 'ferry' : 'train'
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
              {legType && (
                <div className={styles.connector} data-type={legType} />
              )}
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
            </div>
          </li>
        )
      })}
    </ol>
  )
}
