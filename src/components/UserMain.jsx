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

const categories = [
    'Chain Cleaning',
    'Tire Pressure Check',
    'Grip Replacement',
    'Wheel Turing',
    'Pedal Installation',
    'Tire Rotation',
    'Brake Alignment'
]


function UserMain() {
    const [appointments, setAppointments] = useState(Array(50).fill({}).map(_ => {
        return {
            id: generateRandomString(),
            title: 'Some title',
            mechanicName: 'Some mechanic name',
            description: '',
            time: generateRandomAppointmentDate(),
            iconPath: <FrameLogo/>,
            status: 'Confirmed'
        }
    }))

    const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
    const [newAppointmentTitle, setNewAppointmentTitle] = useState('');
    const [newAppointmentMechanicName, setNewAppointmentMechanicName] = useState('');
    const [newAppointmentDescription, setNewAppointmentDescription] = useState('')
    const [newAppointmentDateTime, setNewAppointmentDateTime] = useState(new Date())

    function newAppointmentForm() {
        setNewAppointmentTitle('');
        setNewAppointmentMechanicName('');
        setNewAppointmentDescription('')
        setShowNewAppointmentForm(true);
    }

    function cancelAppointmentForm() {
        setShowNewAppointmentForm(false);
        setNewAppointmentTitle('');
        setNewAppointmentMechanicName('');
        setNewAppointmentDescription('')
    }

    function createNewAppointment() {

        const appointment = {
            id: generateRandomString(),
            title: newAppointmentTitle,
            mechanicName: newAppointmentMechanicName,
            description: newAppointmentDescription,
            time: new Date(),
            iconPath: <BrakeLogo />,
            status: "Confirmed"
        }

        appointments.unshift(appointment);
        setAppointments(appointments);
        cancelAppointmentForm();
    }

    function appointmentForm() {
        return <div className="mb-3" style={{ width: "50%" }}>
            <div className="mb-3">
                <label htmlFor="appointment-title">Appointment Title</label>
                <input type="text" value={newAppointmentTitle} onChange={event => setNewAppointmentTitle(event.target.value)} id="appointment-title" className="form-control" placeholder="Appointment title here..." />
            </div>

            <div className="mb-3">
                <label htmlFor="appointment-mechanic-name">Mechanic Name</label>
                <input type="text" value={newAppointmentMechanicName} onChange={event => setNewAppointmentMechanicName(event.target.value)} id="appointment-mechanic-name" className="form-control" placeholder="Mechanic name here..." />
            </div>

            <button type="submit" className="btn btn-primary" onClick={createNewAppointment}>Submit</button>
        </div>
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

                            <div className="mb-3">
                                <label htmlFor="appointment-mechanic-name">Mechanic Name</label>
                                <input type="text" value={newAppointmentMechanicName} onChange={event => setNewAppointmentMechanicName(event.target.value)} id="appointment-mechanic-name" className="form-control" placeholder="Mechanic name here..." />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="appointment-description">Description</label>
                                <textarea value={newAppointmentDescription} onChange={event => setNewAppointmentDescription(event.target.value)} id="appointment-description" className="form-control" style={{height: 200}} placeholder="Description here..." />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="appointment-date">Date</label>
                                <Calendar id="appointment-date" appointments={order(appointments)}/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="appointment-time">Time</label>
                                <TimeInput id="appointment-time" appointments={order(appointments)}/>
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
                    mechanicName={appointment.mechanicName}
                    description={appointment.description}
                    time={appointment.time}
                    iconPath={appointment.iconPath}
                    status={appointment.status}
                    edit={(title, mechanicName) => {
                        const newApts = appointments.map(apt => {
                            if (apt === appointment) return { ...apt, title: title, mechanicName: mechanicName };
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

function order(appointments) {
    const map = new Map()
    
    for (let index = 0; index < appointments.length; index += 1) {
        const appointment = appointments[index]
        const date = new Date(appointment.time)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
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
    date.setMinutes(randomInt(0, 1) === 0 ? 0 : 30)
    date.setSeconds(0)
    date.setDate(date.getDate() + randomInt(0, 2))
    return date
}

function randomInt(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}