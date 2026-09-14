import { useEffect, useState } from 'react'
import { addNote, deleteNote, loadNotes } from '../lib/tripPersistence'
import styles from './NotesPanel.module.css'

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

export default function NotesPanel({ noteKey, title = 'Notes', description }) {
  const [allNotes, setAllNotes] = useState({})
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const notes = allNotes[noteKey] ?? []

  useEffect(() => {
    let active = true
    loadNotes().then(nextNotes => {
      if (active) setAllNotes(nextNotes)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  async function addNoteToThread(event) {
    event.preventDefault()
    const trimmedAuthor = author.trim()
    const trimmedContent = content.trim()
    if (!trimmedAuthor || !trimmedContent) return

    const note = await addNote(noteKey, trimmedAuthor, trimmedContent)
    setAllNotes(current => ({ ...current, [noteKey]: [...(current[noteKey] ?? []), note] }))
    setContent('')
  }

  async function handleDeleteNote(noteId) {
    if (!window.confirm('Delete this note?')) return

    await deleteNote(noteId, noteKey)
    setAllNotes(current => ({ ...current, [noteKey]: (current[noteKey] ?? []).filter(note => note.id !== noteId) }))
  }

  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.headingRow}>
        <div>
          <h3 className={styles.heading}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <span className={styles.count}>{notes.length}</span>
      </div>

      {notes.length > 0 ? (
        <ul className={styles.list}>
          {notes.map(note => (
            <li className={styles.note} key={note.id}>
              <div className={styles.meta}>
                <strong>{note.author}</strong>
                <span className={styles.metaRight}>
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
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No notes yet.</p>
      )}

      <form className={styles.form} onSubmit={addNoteToThread}>
        <input value={author} onChange={event => setAuthor(event.target.value)} placeholder="Your name" aria-label="Your name" required />
        <textarea value={content} onChange={event => setContent(event.target.value)} placeholder="Add a note..." aria-label="Add a note" rows="3" required />
        <button type="submit">Add note</button>
      </form>
    </section>
  )
}
