import { Server } from "socket.io"
import { bindEvent } from "./helpers/socket"
import { storeAppointmentEvent, freeAppointmentEvent } from "./events/message"
import { freeClientAppointments } from "./managers/localAppointmentManager"

let server

class WS {
  private listener
  private server
  constructor() {
    this.listener = null
  }

  init(listener) {
    const handlers = [storeAppointmentEvent, freeAppointmentEvent]
    const server = new Server(listener)
    this.listener = listener
    this.server = server
    server.on("connection", (socket) => {
      handlers.forEach((handler) => {
        bindEvent(socket, handler)
      })

      socket.on("disconnect", () => {
        freeClientAppointments(socket.id)
      })
    })
  }

  emitEvent = async (event, message) => {
    this.server.sockets.emit(event, message)
  }
}

export default new WS()
