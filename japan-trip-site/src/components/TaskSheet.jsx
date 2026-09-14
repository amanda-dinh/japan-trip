import { useEffect, useState } from 'react'
import { addNote, deleteNote, loadNotes } from '../lib/tripPersistence'
import styles from './TaskSheet.module.css'

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

export default function TaskSheet({ task, checked, onToggle, onClose }) {
  const [notes, setNotes] = useState({})
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyAuthor, setReplyAuthor] = useState('')
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    let active = true
    loadNotes().then(nextNotes => {
      if (active) setNotes(nextNotes)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!task) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [task])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!task) return null

  const taskNotes = notes[`task:${task.id}`] ?? []
  const topLevelNotes = taskNotes.filter(note => !note.parentNoteId)

  async function addNoteToTask(event) {
    event.preventDefault()
    const trimmedAuthor = author.trim()
    const trimmedContent = content.trim()
    if (!trimmedAuthor || !trimmedContent) return

    const note = await addNote(`task:${task.id}`, trimmedAuthor, trimmedContent)
    setNotes(current => ({ ...current, [`task:${task.id}`]: [...(current[`task:${task.id}`] ?? []), note] }))
    setContent('')
  }

  async function handleDeleteNote(noteId) {
    if (!window.confirm('Delete this note?')) return

    await deleteNote(noteId, `task:${task.id}`)
    setNotes(current => ({
      ...current,
      [`task:${task.id}`]: taskNotes.filter(note => note.id !== noteId && note.parentNoteId !== noteId),
    }))
  }

  async function addReply(event) {
    event.preventDefault()
    const trimmedAuthor = replyAuthor.trim()
    const trimmedContent = replyContent.trim()
    if (!replyingTo || !trimmedAuthor || !trimmedContent) return

    const reply = await addNote(`task:${task.id}`, trimmedAuthor, trimmedContent, replyingTo)
    setNotes(current => ({ ...current, [`task:${task.id}`]: [...(current[`task:${task.id}`] ?? []), reply] }))
    setReplyingTo(null)
    setReplyContent('')
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <aside
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-sheet-title"
        onClick={event => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close task details">
          ×
        </button>

        <div className={styles.content}>
          <p className={styles.eyebrow}>Task details</p>
          <h2 className={styles.title} id="task-sheet-title">{task.label}</h2>

          {task.destinations?.length > 0 && (
            <div className={styles.destinations}>
              {task.destinations.map(destination => (
                <span key={destination}>{destination.replaceAll('-', ' ')}</span>
              ))}
            </div>
          )}

          <label className={styles.completeRow}>
            <input type="checkbox" checked={Boolean(checked)} onChange={onToggle} />
            <span>{checked ? 'Complete' : 'Mark as complete'}</span>
          </label>

          <section className={styles.notesSection} aria-labelledby="task-notes-title">
            <div className={styles.sectionHeading}>
              <h3 id="task-notes-title">Notes</h3>
              <span>{taskNotes.length}</span>
            </div>

            {taskNotes.length > 0 ? (
              <ul className={styles.notesList}>
                {topLevelNotes.map(note => (
                  <li key={note.id} className={styles.note}>
                    <div className={styles.noteMeta}>
                      <strong>{note.author}</strong>
                      <span className={styles.noteMetaRight}>
                        <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => handleDeleteNote(note.id)}
                          aria-label="Delete note"
                          title="Delete note"
                        >
                          🗑
                        </button>
                      </span>
                    </div>
                    <p>{note.content}</p>
                    <div className={styles.noteActions}>
                      <button type="button" className={styles.replyButton} onClick={() => setReplyingTo(note.id)}>Reply</button>
                    </div>
                    {taskNotes.filter(reply => reply.parentNoteId === note.id).map(reply => (
                      <div className={styles.reply} key={reply.id}>
                        <div className={styles.noteMeta}>
                          <strong>{reply.author}</strong>
                          <span className={styles.noteMetaRight}>
                            <time dateTime={reply.createdAt}>{formatDate(reply.createdAt)}</time>
                            <button type="button" className={styles.deleteButton} onClick={() => handleDeleteNote(reply.id)} aria-label="Delete reply" title="Delete reply">🗑</button>
                          </span>
                        </div>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                    {replyingTo === note.id && (
                      <form className={styles.replyForm} onSubmit={addReply}>
                        <input value={replyAuthor} onChange={event => setReplyAuthor(event.target.value)} placeholder="Your name" aria-label="Reply author" required />
                        <textarea value={replyContent} onChange={event => setReplyContent(event.target.value)} placeholder="Write a reply..." aria-label="Reply" rows="2" required />
                        <div className={styles.replyFormActions}>
                          <button type="button" onClick={() => setReplyingTo(null)}>Cancel</button>
                          <button type="submit">Reply</button>
                        </div>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No notes yet.</p>
            )}
          </section>

          <form className={styles.form} onSubmit={addNoteToTask}>
            <label>
              <span>Your name</span>
              <input value={author} onChange={event => setAuthor(event.target.value)} placeholder="e.g. Amanda" required />
            </label>
            <label>
              <span>Add a note</span>
              <textarea value={content} onChange={event => setContent(event.target.value)} placeholder="Add a booking detail, question, or decision..." rows="4" required />
            </label>
            <button className={styles.addButton} type="submit">Add note</button>
          </form>
        </div>
      </aside>
    </div>
  )
}
