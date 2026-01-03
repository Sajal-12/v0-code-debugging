export class HotelManager {
  /**
   * Calculate travel time between rooms
   * - Horizontal: 1 minute per room
   * - Vertical: 2 minutes per floor
   */
  calculateTravelTime(rooms: number[]): number {
    if (rooms.length <= 1) return 0

    const sortedRooms = rooms.sort((a, b) => a - b)
    const firstRoom = sortedRooms[0]
    const lastRoom = sortedRooms[sortedRooms.length - 1]

    const firstFloor = Math.floor(firstRoom / 100)
    const lastFloor = Math.floor(lastRoom / 100)

    // Vertical travel
    const verticalTime = Math.abs(lastFloor - firstFloor) * 2

    // Horizontal travel (distance between first and last room on their respective floors)
    // For rooms on the same floor, it's the difference in room numbers
    // For rooms on different floors, we measure distance from left (stairs/lift)
    let horizontalTime = 0

    if (firstFloor === lastFloor) {
      // Same floor: distance between first and last room
      horizontalTime = lastRoom - firstRoom
    } else {
      // Different floors: distance from stairs on each end floor
      const firstRoomDistance = (firstRoom % 100) - 1 // Distance from room 01
      const lastRoomDistance = (lastRoom % 100) - 1 // Distance from room 01
      horizontalTime = firstRoomDistance + lastRoomDistance
    }

    return verticalTime + horizontalTime
  }

  /**
   * Find optimal rooms based on booking rules:
   * 1. Prefer rooms on the same floor
   * 2. Minimize travel time
   */
  findOptimalRooms(availableRooms: number[], numRooms: number): number[] {
    if (availableRooms.length < numRooms) {
      return []
    }

    // Try to find all rooms on a single floor first
    const roomsByFloor = this.groupRoomsByFloor(availableRooms)

    for (const floor of Array.from({ length: 10 }, (_, i) => i + 1)) {
      const floorRooms = roomsByFloor[floor] || []
      if (floorRooms.length >= numRooms) {
        // Get the numRooms with minimum span (closest to stairs)
        return this.selectClosestRooms(
          floorRooms.sort((a, b) => a - b),
          numRooms,
        )
      }
    }

    // If not enough on one floor, find optimal combination across floors
    return this.findOptimalMultiFloorRooms(availableRooms, numRooms)
  }

  private groupRoomsByFloor(rooms: number[]): Record<number, number[]> {
    const grouped: Record<number, number[]> = {}

    for (const room of rooms) {
      const floor = Math.floor(room / 100)
      if (!grouped[floor]) {
        grouped[floor] = []
      }
      grouped[floor].push(room)
    }

    return grouped
  }

  private selectClosestRooms(floorRooms: number[], numRooms: number): number[] {
    // Select numRooms with minimum travel distance (starting from left/stairs)
    let bestSelection: number[] = []
    let bestTime = Number.POSITIVE_INFINITY

    // Try all combinations of numRooms rooms
    for (let i = 0; i <= floorRooms.length - numRooms; i++) {
      const selection = floorRooms.slice(i, i + numRooms)
      const time = this.calculateTravelTime(selection)

      if (time < bestTime) {
        bestTime = time
        bestSelection = selection
      }
    }

    return bestSelection
  }

  private findOptimalMultiFloorRooms(availableRooms: number[], numRooms: number): number[] {
    const roomsByFloor = this.groupRoomsByFloor(availableRooms)
    let bestSelection: number[] = []
    let bestTime = Number.POSITIVE_INFINITY

    // Try different combinations starting from lower floors
    const floors = Object.keys(roomsByFloor)
      .map(Number)
      .sort((a, b) => a - b)

    // Recursive function to generate combinations
    const generateCombinations = (floorIdx: number, currentSelection: number[], remaining: number) => {
      if (remaining === 0) {
        const time = this.calculateTravelTime(currentSelection)
        if (time < bestTime) {
          bestTime = time
          bestSelection = [...currentSelection]
        }
        return
      }

      if (floorIdx >= floors.length) return

      const floor = floors[floorIdx]
      const floorRooms = roomsByFloor[floor]

      // Try taking different numbers of rooms from this floor
      for (let take = 0; take <= Math.min(remaining, floorRooms.length); take++) {
        // Get the best rooms from this floor (closest to stairs)
        const sortedFloorRooms = floorRooms.sort((a, b) => a - b)
        for (let start = 0; start <= sortedFloorRooms.length - take; start++) {
          const selectedFromFloor = sortedFloorRooms.slice(start, start + take)
          generateCombinations(floorIdx + 1, [...currentSelection, ...selectedFromFloor], remaining - take)
        }
      }
    }

    generateCombinations(0, [], numRooms)
    return bestSelection
  }
}
