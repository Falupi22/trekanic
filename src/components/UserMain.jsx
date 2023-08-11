import { BrakeLogo, EllipsisLogo, FlatTireLogo, FrameLogo, PencilLogo, BinLogo, PlusLogo, CloseLogo, CheckLogo } from "../assets/icons";
import "../styles/style.css"
import Appointment from "./Appointment";
import Welcome from "./general/Welcome";
import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import TimeInput from "./TimeInput";
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalFooter from 'react-bootstrap/ModalFooter'
import ModalTitle from 'react-bootstrap/ModalTitle'

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

    async function submitNewAppointment() {
        createNewAppointment()

        resetAppointmentForm()

        setShowNewAppointmentModal(false)
    }

    async function cancelNewAppointment() {
        resetAppointmentForm()

        setShowNewAppointmentModal(false)
    }

    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)

    const [newAppointmentTitle, setNewAppointmentTitle] = useState('')
    const [newAppointmentMechanicId, setNewAppointmentMechanicId] = useState(-1)
    const [newAppointmentCategoryId, setNewAppointmentCategoryId] = useState(-1)
    const [newAppointmentDescription, setNewAppointmentDescription] = useState('')
    const [selectedNewAppointmentDate, setSelectedNewAppointmentDate] = useState(new Date())
    const [selectedNewAppointmentTimeSlot, setSelectedNewAppointmentTimeSlot] = useState(null)

    function newAppointmentTitleInputField() {
        const isValid = newAppointmentTitle.length > 0
        const label = isValid ? 'Appointment title' : 'Invalid appointment title'

        return (
        <form className="form-floating">
            <input type="text" value={newAppointmentTitle} onChange={event => setNewAppointmentTitle(event.target.value)} id="appointment-title" className={`form-control ${isValid ? '' : 'is-invalid'} input-lg`} placeholder="Appointment title here..." />
            <label htmlFor="appointment-title">{label}</label>
        </form>
        )
    }

    function isValidNewAppointment() {
        return newAppointmentTitle.length > 0 &&
               newAppointmentMechanicId !== -1 &&
               newAppointmentCategoryId !== -1 &&
               selectedNewAppointmentTimeSlot !== null
    }

    function resetAppointmentForm() {
        setNewAppointmentTitle('')
        setNewAppointmentMechanicId(-1)
        setNewAppointmentCategoryId(-1)
        setNewAppointmentDescription('')
        setSelectedNewAppointmentDate(new Date())
        setSelectedNewAppointmentTimeSlot(null)
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
        resetAppointmentForm();
    }

    return <div className="flex_component">
        <Welcome userName="Tal" style="header" />
        <div className="d-flex flex-column" style={{ width: "60%" }}>
            <div className="d-flex flex-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="mt-5 mb-5">Your appointments</h2>
                    <button className="tiny_button transparent" onClick={() => setShowNewAppointmentModal(true)} type="button">
                        <PlusLogo />
                    </button>
            </div>
        </div>

        <Modal show={showNewAppointmentModal} onHide={resetAppointmentForm} centered>
            <Modal.Header>
                <Modal.Title>New Appointment</Modal.Title>
                <button type="button" className="close btn" onClick={() => setShowNewAppointmentModal(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3" style={{ width: "100%" }}>
                    {newAppointmentTitleInputField()}

                    <div className="d-flex flex-row" style={{gap: 20}}>
                        <div className="mb-3 d-flex flex-column">
                            <label htmlFor="appointment-mechanic-id">Mechanic</label>
                            <select id="appointment-mechanic-id" className={`item-selector ${newAppointmentMechanicId === -1 ? 'is-invalid' : ''}`} value={newAppointmentMechanicId} onChange={event => setNewAppointmentMechanicId(event.target.value)}>
                                <option key="-1" selected disabled value={-1}>Select mechanic</option>
                                {mechanicNames.map((name, index) => {
                                    return <option key={index} value={index}>{name}</option>
                                })}
                            </select>
                            <div className="invalid-feedback">Please select a valid mechanic name</div>
                        </div>

                        <div className="mb-3 d-flex flex-column">
                            <label htmlFor="appointment-category-id">Mechanic</label>
                            <select id="appointment-category-id" className={`item-selector ${newAppointmentCategoryId === -1 ? 'is-invalid' : ''}`} value={newAppointmentCategoryId} onChange={event => setNewAppointmentCategoryId(event.target.value)}>
                                <option key="-1" selected disabled value={-1}>Select category</option>
                                {categories.map((category, index) => {
                                    return <option key={index} value={index}>{category.category}</option>
                                })}
                            </select>
                            <div className="invalid-feedback">Please select a valid category</div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="appointment-description">Description</label>
                        <textarea value={newAppointmentDescription} onChange={event => setNewAppointmentDescription(event.target.value)} id="appointment-description" className="form-control" style={{height: 200}} placeholder="Description here..." />
                    </div>

                    {
                        newAppointmentTitle.length > 0 && newAppointmentMechanicId !== -1 && newAppointmentCategoryId !== -1 ?
                        <>
                            <div className="mb-3">
                                <label htmlFor="appointment-date">Date</label>
                                <Calendar id="appointment-date" selectedDate={selectedNewAppointmentDate} setSelectedDate={setSelectedNewAppointmentDate}/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="appointment-time">Time</label>
                                <TimeInput id="appointment-time" appointments={filterByDate(appointments, selectedNewAppointmentDate)} selectedDate={selectedNewAppointmentDate} selectedSlot={selectedNewAppointmentTimeSlot} setSelectedSlot={setSelectedNewAppointmentTimeSlot}/>
                                {selectedNewAppointmentTimeSlot === null ? <h5 style={{color: 'red'}}>Please select a time slot</h5> : <></>}
                            </div>
                        </> : <></>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={cancelNewAppointment}>Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={submitNewAppointment} disabled={!isValidNewAppointment()}>Save</button>
            </Modal.Footer>
        </Modal>

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