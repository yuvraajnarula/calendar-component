'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DateRange {
  start: Date | null
  end: Date | null
}

interface CalendarGridProps {
  onDateRangeChange: (range: DateRange) => void
  dateRange: DateRange
}

export function CalendarGrid({ onDateRangeChange, dateRange }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))
  const [selectedStart, setSelectedStart] = useState<Date | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateInRange = (date: Date): boolean => {
    if (!selectedStart || !selectedEnd) return false
    const start = selectedStart < selectedEnd ? selectedStart : selectedEnd
    const end = selectedStart < selectedEnd ? selectedEnd : selectedStart
    return date >= start && date <= end
  }

  const isDateSelected = (date: Date): boolean => {
    if (selectedStart && selectedStart.toDateString() === date.toDateString()) return true
    if (selectedEnd && selectedEnd.toDateString() === date.toDateString()) return true
    return false
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    
    if (!selectedStart) {
      setSelectedStart(clickedDate)
    } else if (!selectedEnd) {
      if (clickedDate < selectedStart) {
        setSelectedEnd(selectedStart)
        setSelectedStart(clickedDate)
      } else {
        setSelectedEnd(clickedDate)
      }
    } else {
      setSelectedStart(clickedDate)
      setSelectedEnd(null)
    }
  }

  useEffect(() => {
    onDateRangeChange({
      start: selectedStart,
      end: selectedEnd,
    })
  }, [selectedStart, selectedEnd, onDateRangeChange])

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days: (number | null)[] = []

  // Add empty slots for days before the first day
  for (let i = firstDay; i > 0; i--) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground hover:bg-opacity-20"
            onClick={previousMonth}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground hover:bg-opacity-20"
            onClick={nextMonth}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return (
                <div key={`empty-${index}`} className="aspect-square" />
              )
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            const selected = isDateSelected(date)
            const inRange = isDateInRange(date)
            const isWeekend = date.getDay() === 0 || date.getDay() === 6

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                  selected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : inRange
                      ? 'bg-accent text-foreground'
                      : isWeekend
                        ? 'text-primary'
                        : 'text-foreground hover:bg-muted'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
