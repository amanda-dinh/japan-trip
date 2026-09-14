import { useEffect, useState } from 'react'
import checklist from '../../data/checklist.json'
import TaskSheet from '../components/TaskSheet'
import { loadChecklistProgress, saveChecklistProgress } from '../lib/tripPersistence'
import styles from './ChecklistPage.module.css'

export default function ChecklistPage() {
  const [checked, setChecked] = useState({})
  const [activeTask, setActiveTask] = useState(null)
  const items = checklist.groups.flatMap(group => group.items)
  const completedCount = items.filter(item => checked[item.id]).length

  useEffect(() => {
    let active = true
    loadChecklistProgress().then(progress => {
      if (active) setChecked(progress)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  function toggleItem(id) {
    setChecked(current => {
      const completed = !current[id]
      saveChecklistProgress(id, completed).catch(() => {})
      return { ...current, [id]: completed }
    })
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className="container">
          <p className={styles.eyebrow}>Trip planning</p>
          <h1 className={styles.title}>{checklist.title}</h1>
          <p className={styles.intro}>{checklist.intro}</p>
        </div>
      </header>

      <section className={`container ${styles.content}`} aria-label="Trip checklist">
        <div className={styles.progressRow}>
          <span>{completedCount} of {items.length} complete</span>
          <div className={styles.progressTrack} aria-hidden="true">
            <div
              className={styles.progressBar}
              style={{ width: `${items.length ? (completedCount / items.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className={styles.groups}>
          {checklist.groups.map(group => (
            <section className={styles.group} key={group.title}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <ul className={styles.list}>
                {group.items.map(item => (
                  <li key={item.id}>
                    <div className={styles.item} data-checked={checked[item.id] || undefined}>
                      <input
                        id={item.id}
                        type="checkbox"
                        checked={Boolean(checked[item.id])}
                        onChange={() => toggleItem(item.id)}
                      />
                      <label className={styles.checkControl} htmlFor={item.id} aria-label={`Mark ${item.label} complete`}>
                        <span className={styles.customBox} aria-hidden="true">✓</span>
                      </label>
                      <button type="button" className={styles.taskButton} onClick={() => setActiveTask(item)}>
                        <span className={styles.label}>{item.label}</span>
                        <span className={styles.openHint}>Details →</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <TaskSheet
        task={activeTask}
        checked={activeTask ? checked[activeTask.id] : false}
        onToggle={() => activeTask && toggleItem(activeTask.id)}
        onClose={() => setActiveTask(null)}
      />
    </main>
  )
}
