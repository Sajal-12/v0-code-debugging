"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HotelVisualization } from "@/components/hotel-visualization"
import { BookingForm } from "@/components/booking-form"
import { HotelManager } from "@/lib/hotel-manager"

export default function Home() {
  const [occupancy, setOccupancy] = useState<Set<number>>(new Set())
  const [booking, setBooking] = useState<number[]>([])
  const [message, setMessage] = useState("")

  const hotelManager = useMemo(() => new HotelManager(), [])

  const handleBook = (numRooms: number) => {
    if (numRooms < 1 || numRooms > 5) {
      setMessage("Please enter a number between 1 and 5")
      return
    }

    const availableRooms = Array.from({ length: 97 }, (_, i) => i + 1).filter((room) => !occupancy.has(room))

    const bookedRooms = hotelManager.findOptimalRooms(availableRooms, numRooms)

    if (bookedRooms.length === numRooms) {
      setOccupancy((prev) => new Set([...prev, ...bookedRooms]))
      setBooking(bookedRooms)
      const travelTime = hotelManager.calculateTravelTime(bookedRooms)
      setMessage(`Successfully booked rooms: ${bookedRooms.join(", ")} (Travel time: ${travelTime} min)`)
    } else {
      setMessage(`Could not book ${numRooms} rooms. Only ${availableRooms.length} available.`)
    }
  }

  const generateRandomOccupancy = () => {
    const randomOccupancy = new Set<number>()
    const numRandomRooms = Math.floor(Math.random() * 50) + 20

    while (randomOccupancy.size < numRandomRooms) {
      randomOccupancy.add(Math.floor(Math.random() * 97) + 1)
    }

    setOccupancy(randomOccupancy)
    setBooking([])
    setMessage(`Generated random occupancy: ${randomOccupancy.size} rooms occupied`)
  }

  const handleReset = () => {
    setOccupancy(new Set())
    setBooking([])
    setMessage("")
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Hotel Room Reservation System</h1>
          <p className="text-muted-foreground">
            97 rooms across 10 floors. Book up to 5 rooms with optimized travel time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Book Rooms</h2>
              <BookingForm onBook={handleBook} />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                <Button onClick={generateRandomOccupancy} variant="outline" className="w-full bg-transparent">
                  Generate Random Occupancy
                </Button>
                <Button onClick={handleReset} variant="destructive" className="w-full">
                  Reset All
                </Button>
              </div>
            </Card>

            {message && (
              <Card className="p-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                <p className="text-sm text-blue-900 dark:text-blue-100">{message}</p>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Occupied: <span className="font-bold">{occupancy.size}</span> / 97
                </p>
                <p>
                  Available: <span className="font-bold">{97 - occupancy.size}</span>
                </p>
                {booking.length > 0 && (
                  <p>
                    Last Booking: <span className="font-bold">{booking.length}</span> rooms
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Room Layout</h2>
              <HotelVisualization occupancy={occupancy} booking={booking} />
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
