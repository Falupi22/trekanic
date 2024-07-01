import { messageSchema } from "../helpers/schemas"
import { createEvent } from "../helpers/socket"
import { freeAppointment, storeAppointment } from "../managers/localAppointmentManager"

export const ROUTE_APPOINTMENTS = "appointments"
export const EVENT_APPOINTMENTS_STORE = "store"
export const EVENT_APPOINTMENTS_STORED = "stored"
export const EVENT_APPOINTMENTS_FREE = "free"
export const EVENT_APPOINTMENTS_FREED = "freed"

export const storeAppointmentEvent = createEvent(
  `${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_STORE}`,
  messageSchema,
  async (socket, { message }) => {
    storeAppointment(
      message,
      socket.id,
      (appointment) => {
        socket.broadcast.emit(`${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_STORED}`, appointment)
      },
      (appointment) => {
        socket.broadcast.emit(`${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_FREED}`, appointment)
      },
    )
  },
)

export const freeAppointmentEvent = createEvent(
  `${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_FREE}`,
  messageSchema,
  async (socket, { message }) => {
    freeAppointment(message, (appointment) => {
      socket.broadcast.emit(`${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_FREED}`, appointment)
    })
  },
)
