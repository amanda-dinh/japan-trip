import { useEffect, useState } from 'react'
import checklist from '../../data/checklist.json'
import TaskSheet from './TaskSheet'
import { loadChecklistProgress, saveChecklistProgress } from '../lib/tripPersistence'
import styles from './DestinationChecklist.module.css'

export default function DestinationChecklist({ slug }) {
  const [checked, setChecked] = useState({})
  const [activeTask, setActiveTask] = useState(null)
  const relatedItems = checklist.groups
    .flatMap(group => group.items)
    .filter(item => item.destinations?.includes(slug))

  useEffect(() => {
    let active = true
    loadChecklistProgress().then(progress => {
      if (active) setChecked(progress)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  if (relatedItems.length === 0) return null

  function toggleItem(id) {
    setChecked(current => {
      const completed = !current[id]
      saveChecklistProgress(id, completed).catch(() => {})
      return { ...current, [id]: completed }
    })
  }

  const completedCount = relatedItems.filter(item => checked[item.id]).length

  return (
    <section className={styles.section} aria-label={`${slug} checklist`}>
      <div className={styles.headingRow}>
        <h3 className={styles.heading}>Checklist for this destination</h3>
        <span className={styles.progress}>{completedCount}/{relatedItems.length}</span>
      </div>
      <ul className={styles.list}>
        {relatedItems.map(item => (
          <li key={item.id}>
            <div className={styles.item} data-checked={checked[item.id] || undefined}>
              <input
                id={`${slug}-${item.id}`}
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggleItem(item.id)}
              />
              <label className={styles.checkControl} htmlFor={`${slug}-${item.id}`} aria-label={`Mark ${item.label} complete`}>
                <span className={styles.box} aria-hidden="true">✓</span>
              </label>
              <button type="button" className={styles.taskButton} onClick={() => setActiveTask(item)}>
                <span>{item.label}</span>
                <span className={styles.openHint}>Details →</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <TaskSheet
        task={activeTask}
        checked={activeTask ? checked[activeTask.id] : false}
        onToggle={() => activeTask && toggleItem(activeTask.id)}
        onClose={() => setActiveTask(null)}
      />
    </section>
  )
}
