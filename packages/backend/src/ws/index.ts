import { Server } from "socket.io"
import { bindEvent } from "./helpers/socket"
import { storeAppointmentEvent, freeAppointmentEvent, ROUTE_APPOINTMENTS, EVENT_APPOINTMENTS_ALL } from "./events/message"
import { appointments, freeClientAppointments } from "./managers/localAppointmentManager"

class WS {
  private listener
  private server
  constructor() {
    this.listener = null
  }

  init(listener) {
    console.log("init")
    const handlers = [storeAppointmentEvent, freeAppointmentEvent]
    const server = new Server(listener, {
      cors: {
        origin: "https://localhost:3000",
        credentials: true,
        methods: ["GET", "POST"]
      }
    })
    this.listener = listener
    this.server = server
    server.on("connection", (socket) => {
      socket.join("default");
      socket.emit(`${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_ALL}`, { appointments: Array.from(appointments.values()) })
      console.log(JSON.stringify(server.sockets.sockets));

      socket.onAny((event, ...args) => {
        console.log(`got ${JSON.stringify(args)}`);
      });
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
