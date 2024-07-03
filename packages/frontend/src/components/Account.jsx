import { BrakeLogo, EllipsisLogo, FlatTireLogo, FrameLogo, PencilLogo, BinLogo, PlusLogo, CloseLogo, CheckLogo, LogOutIcon } from '../assets/icons'
import '../styles/style.css'
import Appointment from './Appointment'
import Welcome from './general/Welcome'
import { useState } from 'react'
import AppointmentModal from './AppointmentModal'
import Menu from './Menu'
import { Button, Icon } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"

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
        icon: <BrakeLogo />
    },
    {
        category: 'Tire Pressure Check',
        icon: <FlatTireLogo />
    },
    {
        category: 'Grip Replacement',
        icon: <FrameLogo />
    },
    {
        category: 'Wheel Turing',
        icon: <BrakeLogo />
    },
    {
        category: 'Pedal Installation',
        icon: <FlatTireLogo />
    },
    {
        category: 'Tire Rotation',
        icon: <FrameLogo />
    },
    {
        category: 'Brake Alignment',
        icon: <BrakeLogo />
    }
]


function Account() {
    const [appointments, setAppointments] = useState(Array(5).fill({}).map(_ => {
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

    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
    const [createMode, setCreateMode] = useState(true)

    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [mechanicId, setMechanicId] = useState(-1)
    const [categoryId, setCategoryId] = useState(-1)
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date())
    const [timeSlot, setTimeSlot] = useState(null)

    const [id, setId] = useState('')

    function createAppointment() {
        setId(generateRandomString())
        setCreateMode(true)
        setShowNewAppointmentModal(true)
    }

    return (
        <div className="flex_component">
            <Welcome userName="Tal" />
            <div className="d-flex flex-column" style={{ width: "60%" }}>
                <div className="d-flex flex-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <h2 className="mt-5 mb-5">Your appointments</h2>
                    <button className="tiny_button transparent" onClick={createAppointment}>
                        <PlusLogo />
                    </button>
                    <Button onClick={
                        () => {
                            api.logout().then(() => {
                                navigate("/")
                            }).catch(err => { });
                        }
                    }>
                        <LogOutIcon />
                    </Button>
                </div>

            </div>

            <AppointmentModal
                isActive={showNewAppointmentModal}
                setIsActive={setShowNewAppointmentModal}
                appointments={appointments}
                setAppointments={setAppointments}
                createMode={createMode}
                id={id}
                setId={setId}
            />

            <div className="flex_card_list">
                {
                    appointments.map(appointment => (
                        <Appointment
                            key={appointment.id}
                            setCreateMode={setCreateMode}
                            setShowAppointmentModal={setShowNewAppointmentModal}
                            setId={setId}
                            id={appointment.id}
                            title={appointment.title}
                            mechanicId={appointment.mechanicId}
                            categoryId={appointment.categoryId}
                            description={appointment.description}
                            time={appointment.time}
                            status={appointment.status}
                            deleteAppointment={() => {
                                setAppointments(appointments.filter(apt => {
                                    return apt.id !== appointment.id
                                }))
                            }}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Account

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

export function generateRandomString(length = 16) {
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
    date.setDate(date.getDate() + randomInt(0, 0))

    date.setHours(randomInt(9, 16))
    if (date.getHours() === 12) date.setHours(17)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    date.setDate(date.getDate() + randomInt(0, 2))
    return date
}

function randomInt(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

export function getAppointmentById(id, appointments) {
    for (let index = 0; index < appointments.length; index += 1) {
        const appointment = appointments[index]
        if (appointment.id === id) {
            return appointment
        }
    }

    return null
}

