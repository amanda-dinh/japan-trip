import { useState } from 'react'
import info from '../../data/info.json'
import styles from './InfoPage.module.css'

export default function InfoPage() {
  const [openSection, setOpenSection] = useState(null)
  const [packingChecked, setPackingChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('japan-trip-packing-list') ?? '{}')
    } catch {
      return {}
    }
  })

  function togglePackingItem(id) {
    setPackingChecked(current => {
      const next = { ...current, [id]: !current[id] }
      localStorage.setItem('japan-trip-packing-list', JSON.stringify(next))
      return next
    })
  }

  function toggleSection(slug) {
    const isOpening = openSection !== slug
    setOpenSection(isOpening ? slug : null)

    if (isOpening) {
      requestAnimationFrame(() => {
        document.getElementById(slug)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Trip reference</p>
          <h1 className={styles.title}>{info.pageTitle}</h1>
          <p className={styles.tagline}>Practical notes for the journey</p>
        </div>
      </header>

      <div className={`container ${styles.content}`}>
        <nav className={styles.contents} aria-label="Info sections">
          <p className={styles.contentsLabel}>On this page</p>
          <div className={styles.contentsLinks}>
            {info.sections.map(section => (
              <a
                key={section.slug}
                href={`#${section.slug}`}
                onClick={() => toggleSection(section.slug)}
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <div className={styles.sections}>
          {info.sections.map(section => {
            const isOpen = openSection === section.slug
            return (
            <section className={styles.section} id={section.slug} key={section.slug}>
              <h2 className={styles.sectionTitle}>
                <button
                  type="button"
                  className={styles.sectionToggle}
                  aria-expanded={isOpen}
                  aria-controls={`${section.slug}-content`}
                  onClick={() => toggleSection(section.slug)}
                >
                  <span>{section.title}</span>
                  <span className={styles.chevron} aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
              </h2>
              {isOpen && (
                <div className={styles.items} id={`${section.slug}-content`}>
                  {section.items.map(item => (
                    <article className={styles.item} key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                  {section.packingChecklist && (
                    <div className={styles.packingList}>
                      <h3>{section.packingChecklist.title}</h3>
                      <p className={styles.packingIntro}>{section.packingChecklist.intro}</p>
                      {section.packingChecklist.groups.map(group => (
                        <div className={styles.packingGroup} key={group.title}>
                          <h4>{group.title}</h4>
                          <ul>
                            {group.items.map(item => (
                              <li key={item.id}>
                                <label className={styles.packingItem} data-checked={packingChecked[item.id] || undefined}>
                                  <input
                                    type="checkbox"
                                    checked={Boolean(packingChecked[item.id])}
                                    onChange={() => togglePackingItem(item.id)}
                                  />
                                  <span className={styles.packingBox} aria-hidden="true">✓</span>
                                  <span>{item.label}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
