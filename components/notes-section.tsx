'use client'

import { useState, useEffect, useCallback } from 'react'
import { Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface NotesSectionProps {
  dateRange: {
    start: Date | null
    end: Date | null
  }
  onNotesChange: (notes: string) => void
}

export function NotesSection({ dateRange, onNotesChange }: NotesSectionProps) {
  const [notes, setNotes] = useState('')
  const [isSaved, setIsSaved] = useState(true)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Generate a unique key for the current date range
  const getStorageKey = useCallback(() => {
    if (!dateRange.start) return 'notes-default'
    
    const startKey = dateRange.start.toISOString().split('T')[0] // YYYY-MM-DD format
    const endKey = dateRange.end ? dateRange.end.toISOString().split('T')[0] : startKey
    
    return `notes-${startKey}-${endKey}`
  }, [dateRange.start, dateRange.end])

  // Auto-save function with debouncing
  const autoSave = useCallback((notesToSave: string) => {
    if (!notesToSave.trim()) return
    
    setIsAutoSaving(true)
    const key = getStorageKey()
    
    // Simulate save delay for better UX feedback
    setTimeout(() => {
      localStorage.setItem(key, notesToSave)
      setIsSaved(true)
      setIsAutoSaving(false)
    }, 500)
  }, [getStorageKey])

  // Debounced auto-save effect
  useEffect(() => {
    if (!notes.trim()) {
      setIsSaved(true)
      setIsAutoSaving(false)
      return
    }

    setIsSaved(false)
    const timeoutId = setTimeout(() => {
      autoSave(notes)
    }, 2000) // Auto-save after 2 seconds of no typing

    return () => clearTimeout(timeoutId)
  }, [notes, autoSave])

  // Load notes from localStorage when date range changes
  useEffect(() => {
    const key = getStorageKey()
    const saved = localStorage.getItem(key) || ''
    setNotes(saved)
    setIsSaved(true)
    setIsAutoSaving(false)
  }, [getStorageKey])

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    onNotesChange(newNotes)
  }

  // Manual save notes to localStorage
  const handleSave = () => {
    if (notes.trim()) {
      const key = getStorageKey()
      localStorage.setItem(key, notes)
    }
    setIsSaved(true)
    setIsAutoSaving(false)
  }

  // Clear notes
  const handleClear = () => {
    const key = getStorageKey()
    localStorage.removeItem(key)
    setNotes('')
    setIsSaved(true)
    setIsAutoSaving(false)
    onNotesChange('')
  }

  const dateRangeText = dateRange.start
    ? `${dateRange.start.toLocaleDateString()} ${
        dateRange.end && dateRange.end.getTime() !== dateRange.start.getTime() 
          ? `- ${dateRange.end.toLocaleDateString()}` 
          : ''
      }`
    : 'No dates selected'

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 flex flex-col h-full border border-border">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground mb-2">Notes</h3>
        <p className="text-sm text-muted-foreground">{dateRangeText}</p>
        {isAutoSaving && (
          <p className="text-xs text-blue-600 mt-1">Auto-saving...</p>
        )}
      </div>

      <Textarea
        placeholder="Add your notes here..."
        value={notes}
        onChange={handleNotesChange}
        className="flex-1 resize-none mb-4 font-sans text-sm"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          className="flex-1"
          disabled={isSaved || isAutoSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaved ? 'Saved' : isAutoSaving ? 'Saving...' : 'Save Notes'}
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          className="px-3"
          disabled={!notes.trim()}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
