export class AppointmentTime {
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
      this.datetime.getDate() == appointmentTime.datetime.getDate() &&
      this.datetime.getMonth() == appointmentTime.datetime.getMonth() &&
      this.datetime.getFullYear() == appointmentTime.datetime.getFullYear()
    )
  }

  compareTo(appointmentDateTime: Date): number {
    let result = 1

    if (this.datetime.getTime() == appointmentDateTime.getTime()) {
      result = 0
    } else if (this.datetime.getTime() > appointmentDateTime.getTime()) {
      result = -1
    }

    return result
  }
}
