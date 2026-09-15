import { Link, useLocation } from 'react-router-dom'
import styles from './SiteNav.module.css'

export default function SiteNav() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav} aria-label="Site navigation">
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.home}>
          Japan Trip 2027
        </Link>
        <ul className={styles.links}>
          <li>
            <Link
              to="/"
              className={styles.link}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Itinerary
            </Link>
          </li>
          <li>
            <Link
              to="/travel"
              className={styles.link}
              aria-current={pathname === '/travel' ? 'page' : undefined}
            >
              Travel
            </Link>
          </li>
          <li>
            <Link
              to="/destinations"
              className={styles.link}
              aria-current={pathname.startsWith('/destinations') ? 'page' : undefined}
            >
              Destinations
            </Link>
          </li>
          <li>
            <Link
              to="/checklist"
              className={styles.link}
              aria-current={pathname === '/checklist' ? 'page' : undefined}
            >
              Checklist
            </Link>
          </li>
          <li>
            <Link
              to="/info"
              className={styles.link}
              aria-current={pathname === '/info' ? 'page' : undefined}
            >
              Info
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
