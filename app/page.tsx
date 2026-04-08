'use client'

import { useState, useCallback } from 'react'
import { CalendarGrid } from '@/components/calendar-grid'
import { NotesSection } from '@/components/notes-section'

interface DateRange {
  start: Date | null
  end: Date | null
}

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  })
  const [notes, setNotes] = useState('')

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range)
  }, [])

  const handleNotesChange = useCallback((newNotes: string) => {
    setNotes(newNotes)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-gradient-to-b from-foreground/20 to-foreground/5">
        <img
          src="/calendar-hero.jpg"
          alt="Mountain climbing adventure"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-background" />
        <div className="absolute top-6 left-6 md:top-8 md:left-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Calendar 2026</h1>
          <p className="text-white/80 mt-2 text-lg">Plan your adventures</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-10 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar and Notes */}
          <div className="lg:col-span-2">
            <CalendarGrid 
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
          
          {/* Notes Section */}
          <div className="lg:col-span-1 h-full">
            <NotesSection 
              dateRange={dateRange}
              onNotesChange={handleNotesChange}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
