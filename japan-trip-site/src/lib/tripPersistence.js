import { createClient } from '@supabase/supabase-js'

export const TRIP_ID = 'japan-trip-2027'
const CHECKLIST_STORAGE_KEY = 'japan-trip-checklist'
const SUBTASK_STORAGE_KEY = 'japan-trip-checklist-subtasks'
const NOTES_STORAGE_KEY = 'japan-trip-notes'
const TASK_NOTES_STORAGE_KEY = 'japan-trip-task-notes'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSharedPersistenceEnabled = Boolean(supabaseUrl && supabaseAnonKey)
const supabase = isSharedPersistenceEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

function readLocal(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export async function loadChecklistProgress() {
  if (!supabase) return readLocal(CHECKLIST_STORAGE_KEY, {})
  const { data, error } = await supabase
    .from('trip_checklist')
    .select('item_id, completed')
    .eq('trip_id', TRIP_ID)
  if (error) throw error
  return Object.fromEntries(data.map(row => [row.item_id, row.completed]))
}

export async function saveChecklistProgress(itemId, completed) {
  if (!supabase) {
    const current = readLocal(CHECKLIST_STORAGE_KEY, {})
    writeLocal(CHECKLIST_STORAGE_KEY, { ...current, [itemId]: completed })
    return
  }
  const { error } = await supabase
    .from('trip_checklist')
    .upsert({ trip_id: TRIP_ID, item_id: itemId, completed, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function loadSubtaskProgress() {
  if (!supabase) return readLocal(SUBTASK_STORAGE_KEY, {})
  const { data, error } = await supabase
    .from('trip_checklist_subtasks')
    .select('subtask_id, completed')
    .eq('trip_id', TRIP_ID)
  if (error) throw error
  return Object.fromEntries(data.map(row => [row.subtask_id, row.completed]))
}

export async function saveSubtaskProgress(subtaskId, parentItemId, assignee, completed) {
  if (!supabase) {
    const current = readLocal(SUBTASK_STORAGE_KEY, {})
    writeLocal(SUBTASK_STORAGE_KEY, { ...current, [subtaskId]: completed })
    return
  }
  const { error } = await supabase
    .from('trip_checklist_subtasks')
    .upsert({ trip_id: TRIP_ID, subtask_id: subtaskId, parent_item_id: parentItemId, assignee, completed, updated_at: new Date().toISOString() })
  if (error) throw error
}

function mergeLocalNotes() {
  return {
    ...readLocal(NOTES_STORAGE_KEY, {}),
    ...readLocal(TASK_NOTES_STORAGE_KEY, {}),
  }
}

export async function loadNotes() {
  if (!supabase) return mergeLocalNotes()
  const { data, error } = await supabase
    .from('trip_notes')
    .select('id, note_key, author, content, parent_note_id, created_at')
    .eq('trip_id', TRIP_ID)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.reduce((grouped, note) => {
    const key = note.note_key
    grouped[key] ??= []
    grouped[key].push({
      id: note.id,
      author: note.author,
      content: note.content,
      parentNoteId: note.parent_note_id,
      createdAt: note.created_at,
    })
    return grouped
  }, {})
}

export async function addNote(noteKey, author, content, parentNoteId = null) {
  if (!supabase) {
    const notes = mergeLocalNotes()
    const nextNotes = {
      ...notes,
      [noteKey]: [
        ...(notes[noteKey] ?? []),
        { id: `${noteKey}-${Date.now()}`, author, content, parentNoteId, createdAt: new Date().toISOString() },
      ],
    }
    writeLocal(NOTES_STORAGE_KEY, nextNotes)
    return nextNotes[noteKey].at(-1)
  }
  const { data, error } = await supabase
    .from('trip_notes')
    .insert({ trip_id: TRIP_ID, note_key: noteKey, author, content, parent_note_id: parentNoteId })
    .select('id, author, content, parent_note_id, created_at')
    .single()
  if (error) throw error
  return { id: data.id, author: data.author, content: data.content, parentNoteId: data.parent_note_id, createdAt: data.created_at }
}

export async function deleteNote(noteId, noteKey) {
  if (!supabase) {
    for (const key of [NOTES_STORAGE_KEY, TASK_NOTES_STORAGE_KEY]) {
      const notes = readLocal(key, {})
      if (!notes[noteKey]) continue
      writeLocal(key, {
        ...notes,
        [noteKey]: notes[noteKey].filter(note => note.id !== noteId && note.parentNoteId !== noteId),
      })
    }
    return
  }
  const { error } = await supabase
    .from('trip_notes')
    .delete()
    .eq('trip_id', TRIP_ID)
    .eq('id', noteId)
  if (error) throw error
}
