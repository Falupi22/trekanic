const APPOINTMENT_TIMEOUT = 300000 // 5 minutes in milliseconds
export const appointments = new Map()

/*
 * Stores an appointment in the appointments Map.
 * @param appointment The appointment to store.
 * @param socketId The socket id of the client that sent the appointment.
 * @param notifyTakenCallback The callback to notify the client that the appointment has been taken.
 * @param notifyFreedCallback The callback to notify the client that the appointment has been freed.
 */
export const storeAppointment = (appointment, socketId, notifyTakenCallback, notifyFreedCallback) => {
  console.log("storeAppointment")
  console.log("Appointment stored: ", appointment.data);
  const appointmentData = appointment.data
  appointments.set(socketId, {
    datetime: appointmentData.datetime,
    duration: appointmentData?.duration ?? 1,
    customer: appointmentData?.customer,
    mechanic: "default",
    clientId: socketId,
  })

  // Notify all connected clients that the appointment is taken
  notifyTakenCallback(appointments.get(socketId))

  // Schedule a timeout to free the appointment if not saved
  setTimeout(() => {
    freeAppointment(appointmentData, socketId, notifyFreedCallback)
  }, APPOINTMENT_TIMEOUT)
}

/*
 * Frees an appointment in the appointments Map.
 * @param appointment The appointment to free.
 * @param notifyFreedCallback The callback to notify the client that the appointment has been freed.
 */
export const freeAppointment = (appointment, socketId, notifyFreedCallback) => {
  let appointmentToDelete;
  if (appointments.has(socketId)) {
    appointmentToDelete = appointments.get(socketId)
    appointments.delete(socketId)
    console.log("Appointment deleted: ", appointment.data);

    notifyFreedCallback(appointmentToDelete)
  }
}

/*
 * Frees all appointments of a specific client.
 * @param socketId The socket id of the client.
 */
export const freeClientAppointments = (socketId) => {
  if (appointments.has(socketId)) {
    appointments.delete(socketId)
  }
}
