const minLengthOfDuration = 1

const getTakenDays = (appointmentsByMechanic): Date[] => {
  if (appointmentsByMechanic) {
    const takenDayByMechanics: Map<string, any[]> = new Map<string, any[]>()

    appointmentsByMechanic.forEach((mechanicData) => {
      const takenDaysOfMechanic = []
      const sortedAppointments = mechanicData.appointments.sort(
        (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      )

      const appointmentTimes = sortedAppointments.map((appointment) => {
        const date = new Date(appointment.datetime)
        const duration = appointment.duration
        return new AppointmentTime(date, duration)
      })

      const groupedDates = appointmentTimes.reduce((acc, appointmentTime) => {
        // Get the date formatted as YYYY-MM-DD (ignoring time)
        const dayKey = new Date(appointmentTime.datetime).toDateString() // YYYY-MM-DD format

        // If the dayKey doesn't exist in the accumulator, initialize it as an empty array
        if (!acc.get(dayKey)) {
          acc.set(dayKey, [])
        }
        // Push the current date into the corresponding dayKey array
        acc.get(dayKey).push(appointmentTime)

        return acc
      }, new Map<string, AppointmentTime[]>())

      let foundFreeTime = false

      // Checks if each day is free for the mechanic
      for (const [day, appointments] of Object.entries(groupedDates)) {
        let hour = 8

        do {
          const dayAndHour = new Date(new Date(Date.parse(day)).setHours(hour))
          const dayAndHourAppointmentTime = new AppointmentTime(dayAndHour, minLengthOfDuration)
          foundFreeTime = !(appointments as Array<any>)?.find(
            (appointmentTime) =>
              appointmentTime.compareTo(dayAndHourAppointmentTime.datetime) !== 0 &&
              (appointmentTime.compareTo(dayAndHourAppointmentTime.getEndTime()) > -1 ||
                dayAndHourAppointmentTime.compareTo(appointmentTime.getEndTime()) > -1),
          )

          hour += minLengthOfDuration
        } while (hour < 22 && !foundFreeTime)

        if (!foundFreeTime) {
          // This day is full for this mechanic because they don't have free time
          takenDaysOfMechanic.push(new Date(Date.parse(day)))
        }
      }

      takenDayByMechanics.set(mechanicData.mechanicId, takenDaysOfMechanic)
    })

    const distinctValuesSet = []

    // Iterate over each value array in the map
    takenDayByMechanics.forEach((values) => {
      // Add each value to the Set (to ensure uniqueness)
      values.forEach((value) => {
        distinctValuesSet.push(value)
      })
    })

    return Array.from(findDuplicateDates(distinctValuesSet)) as Date[]
  } else {
    return []
  }
}

export const getTakenHoursByDay = (appointmentsByMechanic, day: Date): Date[] => {
  if (appointmentsByMechanic && day) {
    const takenHoursByMechanics: Map<string, any[]> = new Map<string, any[]>()

    appointmentsByMechanic.forEach((mechanicData) => {
      const takenHoursOfMechanic = []
      const sortedAppointments = mechanicData.appointments.sort(
        (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      )

      const appointmentTimes = sortedAppointments.map((appointment) => {
        const date = new Date(appointment.datetime)
        const duration = appointment.duration
        return new AppointmentTime(date, duration)
      })

      const groupedDates = appointmentTimes.reduce((acc, appointmentTime) => {
        // Get the date formatted as YYYY-MM-DD (ignoring time)
        const dayKey = new Date(appointmentTime.datetime).toDateString() // YYYY-MM-DD format

        // If the dayKey doesn't exist in the accumulator, initialize it as an empty array
        if (!acc.get(dayKey)) {
          acc.set(dayKey, [])
        }
        // Push the current date into the corresponding dayKey array
        acc.get(dayKey).push(appointmentTime)

        return acc
      }, new Map<string, AppointmentTime[]>())
      const timesByDay: AppointmentTime[] | null = groupedDates.get(day.toDateString())

      // This mechanic has appointments that day
      if (timesByDay && timesByDay.length > 0) {
        // Checks if each day is free for the mechanic
        for (const time of timesByDay) {
          let hour = 8

          do {
            const dayAndHour = new Date(new Date(day).setHours(hour))
            const dayAndHourAppointmentTime = new AppointmentTime(dayAndHour, minLengthOfDuration)
            const isCurrentHourFree =
              // Checks if not the same hour
              !(
                time.compareTo(dayAndHourAppointmentTime.datetime) !== 0 &&
                // Checks if times are not overlapping each other
                (time.compareTo(dayAndHourAppointmentTime.getEndTime()) > -1 ||
                  dayAndHourAppointmentTime.compareTo(time.getEndTime()) > -1)
              )

            if (isCurrentHourFree) {
              takenHoursOfMechanic.push(dayAndHour)
            }

            hour += minLengthOfDuration
          } while (hour < 22)
        }

        takenHoursByMechanics.set(mechanicData.mechanicId, takenHoursOfMechanic)
      }
    })

    const distinctValuesSet = []

    // Iterate over each value array in the map
    takenHoursByMechanics.forEach((values) => {
      // Add each value to the Set (to ensure uniqueness)
      values.forEach((value) => {
        distinctValuesSet.push(value)
      })
    })

    return Array.from(findDuplicateDates(distinctValuesSet)) as Date[]
  } else {
    return []
  }
}

function findDuplicateDates(dateArray) {
  // Step 1: Convert dates to string format for comparison
  const dateStringArray = dateArray.map((date) => date.toISOString())

  // Step 2: Count occurrences of each date
  const countMap = dateStringArray.reduce((acc, dateString) => {
    acc[dateString] = (acc[dateString] || 0) + 1
    return acc
  }, {})

  // Step 3: Filter dates that appear more than once
  const duplicates = Object.keys(countMap)
    .filter((key) => countMap[key] > 1)
    .map((dateString) => new Date(dateString))

  return duplicates
}

class AppointmentTime {
  datetime: Date
  duration: number

  public constructor(datetime: Date, duration: number) {
    this.datetime = datetime
    this.duration = duration
  }

  getEndTime(): Date {
    return new Date(this.datetime.getTime() + this.duration * 60 * 1000 * 60)
  }

  isSameDay(appointmentTime: AppointmentTime): boolean {
    return (
      this.datetime.getDate() === appointmentTime.datetime.getDate() &&
      this.datetime.getMonth() === appointmentTime.datetime.getMonth() &&
      this.datetime.getFullYear() === appointmentTime.datetime.getFullYear()
    )
  }

  compareTo(appointmentDateTime: Date): number {
    let result = 1

    if (this.datetime.getTime() === appointmentDateTime.getTime()) {
      result = 0
    } else if (this.datetime.getTime() > appointmentDateTime.getTime()) {
      result = -1
    }

    return result
  }
}

export default getTakenDays
