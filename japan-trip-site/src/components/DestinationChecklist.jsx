import { useEffect, useState } from 'react'
import checklist from '../../data/checklist.json'
import TaskSheet from './TaskSheet'
import { loadChecklistProgress, loadNotes, loadSubtaskProgress, saveChecklistProgress, saveSubtaskProgress } from '../lib/tripPersistence'
import styles from './DestinationChecklist.module.css'

export default function DestinationChecklist({ slug }) {
  const [checked, setChecked] = useState({})
  const [commentCounts, setCommentCounts] = useState({})
  const [subtaskProgress, setSubtaskProgress] = useState({})
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

  useEffect(() => {
    let active = true
    loadNotes().then(notes => {
      if (!active) return
      setCommentCounts(Object.fromEntries(relatedItems.map(item => [item.id, (notes[`task:${item.id}`] ?? []).length])))
    }).catch(() => {})
    return () => { active = false }
  }, [slug])

  useEffect(() => {
    let active = true
    loadSubtaskProgress().then(progress => {
      if (active) setSubtaskProgress(progress)
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

  function toggleSubtask(item, assignee) {
    const subtaskId = `${item.id}-${assignee.toLowerCase()}`
    setSubtaskProgress(current => {
      const completed = !current[subtaskId]
      saveSubtaskProgress(subtaskId, item.id, assignee, completed).catch(() => {})
      return { ...current, [subtaskId]: completed }
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
                <span className={styles.taskText}>
                  <span>{item.label}</span>
                  {item.subtasks && <span className={styles.subtaskBadge}>{item.subtasks.filter(name => subtaskProgress[`${item.id}-${name.toLowerCase()}`]).length}/{item.subtasks.length} booked</span>}
                  {commentCounts[item.id] > 0 && <span className={styles.commentBadge}>{commentCounts[item.id]} comments</span>}
                </span>
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
        subtaskProgress={subtaskProgress}
        onToggleSubtask={toggleSubtask}
        onClose={() => setActiveTask(null)}
      />
    </section>
  )
}
