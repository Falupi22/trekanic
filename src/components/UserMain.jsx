import { BrakeLogo, EllipsisLogo, FlatTireLogo, FrameLogo, PencilLogo, BinLogo, PlusLogo, CloseLogo, CheckLogo } from "../assets/icons";
import "../styles/style.css"
import Appointment from "./Appointment";
import Welcome from "./general/Welcome";
import { useState } from "react";
import Calendar from "./Calendar";
import TimeInput from "./TimeInput";

const colors = {
    "Confirmed": "black",
    "Done": "green",
    "Canceled": "var(--red)"
}

export const mechanicNames = [
    'LeBron James',
    'Kevin Durant',
    'Stephen Curry',
    'Kawhi Leonard',
    'James Harden',
    'Russell Westbrook',
    'Kyrie Irving'
]

export const categories = [
    {
        category: 'Chain Cleaning',
        icon: <BrakeLogo/>
    },
    {
        category: 'Tire Pressure Check',
        icon: <FlatTireLogo/>
    },
    {
        category: 'Grip Replacement',
        icon: <FrameLogo/>
    },
    {
        category: 'Wheel Turing',
        icon: <BrakeLogo/>
    },
    {
        category: 'Pedal Installation',
        icon: <FlatTireLogo/>
    },
    {
        category: 'Tire Rotation',
        icon: <FrameLogo/>
    },
    {
        category: 'Brake Alignment',
        icon: <BrakeLogo/>
    }
]


function UserMain() {
    const [appointments, setAppointments] = useState(Array(50).fill({}).map(_ => {
        return {
            id: generateRandomString(),
            title: 'Some title',
            mechanicId: randomInt(0, mechanicNames.length - 1), 
            categoryId: randomInt(0, categories.length - 1),
            description: '',
            time: generateRandomAppointmentDate(),
            status: 'Confirmed'
        }
    }))

    const [newAppointmentTitle, setNewAppointmentTitle] = useState('');
    const [newAppointmentMechanicId, setNewAppointmentMechanicId] = useState(null);
    const [newAppointmentCategoryId, setNewAppointmentCategoryId] = useState(null)
    const [newAppointmentDescription, setNewAppointmentDescription] = useState('')
    const [selectedNewAppointmentDate, setSelectedNewAppointmentDate] = useState(new Date())
    const [selectedNewAppointmentTimeSlot, setSelectedNewAppointmentTimeSlot] = useState(null)

    function newAppointmentForm() {
        setNewAppointmentTitle('')
        setNewAppointmentMechanicId(0)
        setNewAppointmentCategoryId(0)
        setNewAppointmentDescription('')
    }

    function cancelAppointmentForm() {
        setNewAppointmentTitle('');
        setNewAppointmentMechanicId()
        setNewAppointmentCategoryId(0)
        setNewAppointmentDescription('')
    }

    function createNewAppointment() {
        const appointment = {
            id: generateRandomString(),
            title: newAppointmentTitle,
            mechanicId: newAppointmentMechanicId,
            categoryId: newAppointmentCategoryId,
            description: newAppointmentDescription,
            time: new Date(selectedNewAppointmentTimeSlot.start),
            status: 'Confirmed'
        }

        appointments.unshift(appointment);
        setAppointments(appointments);
        cancelAppointmentForm();
    }

    return <div className="flex_component">
        <Welcome userName="Tal" style="header" />
        <div className="d-flex flex-column" style={{ width: "60%" }}>
            <div className="d-flex flex-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="mt-5 mb-5">Your appointments</h2>
                    <button className="tiny_button transparent" onClick={newAppointmentForm}
                        type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <PlusLogo />
                    </button>
            </div>
        </div>

        <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" className="close btn" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3" style={{ width: "100%" }}>
                            <div className="mb-3">
                                <label htmlFor="appointment-title">Appointment Title</label>
                                <input type="text" value={newAppointmentTitle} onChange={event => setNewAppointmentTitle(event.target.value)} id="appointment-title" className="form-control" placeholder="Appointment title here..." />
                            </div>

                            <div className="mb-3 d-flex flex-column">
                                <label htmlFor="appointment-mechanic-id">Mechanic</label>
                                <select id="appointment-mechanic-id" className="item-selector" value={newAppointmentMechanicId} onChange={event => setNewAppointmentMechanicId(event.target.value)}>
                                    <option key="-1" value={null}>Select mechanic</option>
                                    {mechanicNames.map((name, index) => {
                                        return <option key={index} value={index}>{name}</option>
                                    })}
                                </select>
                            </div>

                            <div className="mb-3 d-flex flex-column">
                                <label htmlFor="appointment-category-id">Mechanic</label>
                                <select id="appointment-category-id" className="item-selector" value={newAppointmentCategoryId} onChange={event => setNewAppointmentCategoryId(event.target.value)}>
                                    <option key="-1" value={null}>Select category</option>
                                    {categories.map((category, index) => {
                                        return <option key={index} value={index}>{category.category}</option>
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="appointment-description">Description</label>
                                <textarea value={newAppointmentDescription} onChange={event => setNewAppointmentDescription(event.target.value)} id="appointment-description" className="form-control" style={{height: 200}} placeholder="Description here..." />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="appointment-date">Date</label>
                                <Calendar id="appointment-date" selectedDate={selectedNewAppointmentDate} setSelectedDate={setSelectedNewAppointmentDate}/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="appointment-time">Time</label>
                                <TimeInput id="appointment-time" appointments={filterByDate(appointments, selectedNewAppointmentDate)} selectedDate={selectedNewAppointmentDate} selectedSlot={selectedNewAppointmentTimeSlot} setSelectedSlot={setSelectedNewAppointmentTimeSlot}/>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={createNewAppointment}>Save</button>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex_card_list">
            {
                appointments.map(appointment => <Appointment
                    key={appointment.id}
                    title={appointment.title}
                    mechanicId={appointment.mechanicId}
                    categoryId={appointment.categoryId}
                    description={appointment.description}
                    time={appointment.time}
                    status={appointment.status}
                    edit={(title, mechanicId) => {
                        const newApts = appointments.map(apt => {
                            if (apt === appointment) return { ...apt, title: title, mechanicId: mechanicId };
                            return apt;
                        })

                        setAppointments(newApts);
                    }}
                    setStatus={status => {
                        const newApts = appointments.map(apt => {
                            if (apt === appointment) return { ...apt, status: status };
                            return apt;
                        })

                        setAppointments(newApts);
                    }}
                />
                )
            }
        </div>
    </div>
}

export default UserMain;

function filterByDate(appointments, date) {
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    const result = []

    for (let index = 0; index < appointments.length; index += 1) {
        const appointment = appointments[index]
        const appointmentDate = new Date(appointment.time)
        appointmentDate.setHours(0, 0, 0, 0)
        if (appointmentDate.getTime() === target.getTime()) {
            result.push(appointment)
        }
    }

    return result
}

function order(appointments) {
    const map = new Map()
    
    for (let index = 0; index < appointments.length; index += 1) {
        const appointment = appointments[index]
        const date = new Date(appointment.time)
        date.setHours(0, 0, 0, 0)
        const key = date.getTime()
        if (key in map) {
            map[key].push(appointment)
        } else {
            map[key] = [appointment]
        }
    }

    return map
}

function generateRandomString(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function generateRandomAppointmentDate() {
    const date = new Date()
    date.setHours(randomInt(0, 23))
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    date.setDate(date.getDate() + randomInt(0, 2))
    return date
}

function randomInt(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}