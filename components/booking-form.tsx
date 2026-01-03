"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BookingFormProps {
  onBook: (numRooms: number) => void
}

export function BookingForm({ onBook }: BookingFormProps) {
  const [numRooms, setNumRooms] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBook(numRooms)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Number of Rooms (1-5)</label>
        <Input
          type="number"
          min="1"
          max="5"
          value={numRooms}
          onChange={(e) => setNumRooms(Number.parseInt(e.target.value) || 1)}
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full">
        Book Rooms
      </Button>
    </form>
  )
}
