"use client"

interface HotelVisualizationProps {
  occupancy: Set<number>
  booking: number[]
}

export function HotelVisualization({ occupancy, booking }: HotelVisualizationProps) {
  const bookingSet = new Set(booking)

  return (
    <div className="space-y-6 overflow-y-auto max-h-[800px]">
      {/* Floors 1-9 */}
      {Array.from({ length: 9 }, (_, floorIdx) => {
        const floor = floorIdx + 1
        const rooms = Array.from({ length: 10 }, (_, i) => floor * 100 + (i + 1))

        return (
          <div key={floor}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Floor {floor}</h3>
            <div className="grid grid-cols-10 gap-2">
              {rooms.map((roomNum) => (
                <RoomBox
                  key={roomNum}
                  roomNum={roomNum}
                  isOccupied={occupancy.has(roomNum)}
                  isBooked={bookingSet.has(roomNum)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Floor 10 */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Floor 10 (Top)</h3>
        <div className="flex gap-2">
          {Array.from({ length: 7 }, (_, i) => 1001 + i).map((roomNum) => (
            <RoomBox
              key={roomNum}
              roomNum={roomNum}
              isOccupied={occupancy.has(roomNum)}
              isBooked={bookingSet.has(roomNum)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface RoomBoxProps {
  roomNum: number
  isOccupied: boolean
  isBooked: boolean
}

function RoomBox({ roomNum, isOccupied, isBooked }: RoomBoxProps) {
  let bgColor = "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700"
  if (isBooked) {
    bgColor = "bg-blue-400 dark:bg-blue-600 border-blue-500 dark:border-blue-700 text-white font-bold"
  } else if (isOccupied) {
    bgColor = "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100"
  }

  return (
    <div
      className={`
        w-12 h-12 flex items-center justify-center rounded border text-xs font-medium transition-colors cursor-default
        ${bgColor}
      `}
      title={isOccupied ? "Occupied" : isBooked ? "Your Booking" : "Available"}
    >
      {roomNum}
    </div>
  )
}
