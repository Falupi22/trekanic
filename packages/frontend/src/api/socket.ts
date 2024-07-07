import { io } from 'socket.io-client';

export const ROUTE_APPOINTMENTS = "appointments"
export const EVENT_APPOINTMENTS_STORE = "store"
export const EVENT_APPOINTMENTS_STORED = "stored"
export const EVENT_APPOINTMENTS_FREE = "free"
export const EVENT_APPOINTMENTS_FREED = "freed"
export const EVENT_APPOINTMENTS_ALL = "all"

const URL = 'http://localhost:8765';

export const socket = io(URL, { transports: ['websocket', 'polling', 'flashsocket'] });
export const emitAppointment = (event, data) => socket.emit(`${ROUTE_APPOINTMENTS}:${event}`, {
    data
});