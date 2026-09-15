import { useEffect, useState } from 'react'
import { addNote, deleteNote, loadNotes } from '../lib/tripPersistence'
import { NOTE_AUTHORS } from '../lib/noteAuthors'
import styles from './NotesPanel.module.css'

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

function authorInitial(author) {
  return author.trim().charAt(0).toUpperCase()
}

export default function NotesPanel({ noteKey, title = 'Notes', description }) {
  const [allNotes, setAllNotes] = useState({})
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyAuthor, setReplyAuthor] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const notes = allNotes[noteKey] ?? []
  const topLevelNotes = notes.filter(note => !note.parentNoteId)

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
    setAllNotes(current => ({
      ...current,
      [noteKey]: (current[noteKey] ?? []).filter(note => note.id !== noteId && note.parentNoteId !== noteId),
    }))
  }

  async function addReply(event) {
    event.preventDefault()
    const trimmedAuthor = replyAuthor.trim()
    const trimmedContent = replyContent.trim()
    if (!replyingTo || !trimmedAuthor || !trimmedContent) return

    const reply = await addNote(noteKey, trimmedAuthor, trimmedContent, replyingTo)
    setAllNotes(current => ({ ...current, [noteKey]: [...(current[noteKey] ?? []), reply] }))
    setReplyingTo(null)
    setReplyContent('')
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
          {topLevelNotes.map(note => (
            <li className={styles.note} key={note.id}>
              <div className={styles.meta}>
                <span className={styles.author}>
                  <span className={styles.avatar} data-author={note.author.toLowerCase()} aria-hidden="true">
                    {authorInitial(note.author)}
                  </span>
                  <strong>{note.author}</strong>
                </span>
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
              <div className={styles.noteActions}>
                <button type="button" className={styles.replyButton} onClick={() => setReplyingTo(note.id)}>
                  Reply
                </button>
              </div>
              {notes.filter(reply => reply.parentNoteId === note.id).map(reply => (
                <div className={styles.reply} key={reply.id}>
                  <div className={styles.meta}>
                    <span className={styles.author}>
                      <span className={styles.avatar} data-author={reply.author.toLowerCase()} aria-hidden="true">
                        {authorInitial(reply.author)}
                      </span>
                      <strong>{reply.author}</strong>
                    </span>
                    <span className={styles.metaRight}>
                      <time dateTime={reply.createdAt}>{formatDate(reply.createdAt)}</time>
                      <button type="button" className={styles.deleteButton} onClick={() => handleDeleteNote(reply.id)} aria-label="Delete reply" title="Delete reply">🗑</button>
                    </span>
                  </div>
                  <p>{reply.content}</p>
                </div>
              ))}
              {replyingTo === note.id && (
                <form className={styles.replyForm} onSubmit={addReply}>
                  <select value={replyAuthor} onChange={event => setReplyAuthor(event.target.value)} aria-label="Reply author" required>
                    <option value="">Select your name</option>
                    {NOTE_AUTHORS.map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
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

      <form className={styles.form} onSubmit={addNoteToThread}>
        <select value={author} onChange={event => setAuthor(event.target.value)} aria-label="Your name" required>
          <option value="">Select your name</option>
          {NOTE_AUTHORS.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <textarea value={content} onChange={event => setContent(event.target.value)} placeholder="Add a note..." aria-label="Add a note" rows="3" required />
        <button type="submit">Add note</button>
      </form>
    </section>
  )
}
