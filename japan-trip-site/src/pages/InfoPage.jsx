import { useState } from 'react'
import info from '../../data/info.json'
import styles from './InfoPage.module.css'

export default function InfoPage() {
  const [openSection, setOpenSection] = useState(null)

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
