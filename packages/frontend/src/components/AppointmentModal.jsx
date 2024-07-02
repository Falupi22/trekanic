import { useState, useEffect } from 'react'
import Modal from 'react-bootstrap-modal'
import { mechanicNames, categories, getAppointmentById } from './Account'
import Calendar from './Calendar'
import TimeInput from './TimeInput'

function AppointmentModal(props) {
    const appointment = getAppointmentById(props.id, props.appointments)

    const [title, setTitle] = useState('')
    const [mechanicId, setMechanicId] = useState(-1)
    const [categoryId, setCategoryId] = useState(-1)
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date())
    const [timeSlot, setTimeSlot] = useState(null)

    useEffect(() => {
        setTitle(appointment?.title ?? '')
        setMechanicId(appointment?.mechanicId ?? -1)
        setCategoryId(appointment?.categoryId ?? -1)
        setDescription(appointment?.description ?? '')
        setDate(appointment?.time ?? new Date())
        if (appointment === null) {
            setTimeSlot(null)
            return
        }
        const finish = new Date(appointment.time)
        finish.setHours(finish.getHours() + 1)
        setTimeSlot({ start: appointment.time, finish: finish })
    }, [props.id])

    function submit() {
        create()

        cancel()
    }

    function cancel() {
        props.setIsActive(false)
    }

    function create() {
        const newAppointment = {
            id: props.id,
            title: title,
            mechanicId: mechanicId,
            categoryId: categoryId,
            description: description,
            time: new Date(timeSlot.start),
            status: 'Confirmed'
        }

        if (props.createMode) props.appointments.unshift(newAppointment)
        else {
            for (let index = 0; index < props.appointments.length; index += 1) {
                if (props.appointments[index].id === props.id) {
                    props.appointments[index] = newAppointment
                    break
                }
            }
        }

        props.setAppointments(props.appointments)
    }

    function isValid() {
        return title.length > 0 &&
            mechanicId !== -1 &&
            categoryId !== -1 &&
            timeSlot !== null
    }

    function titleInputField() {
        const isValidTitle = title.length > 0
        const label = isValidTitle ? 'Appointment title' : 'Invalid appointment title'

        return (
            <form className="form-floating">
                <input type="text" value={title} onChange={event => setTitle(event.target.value)} id="appointment-title" className={`form-control ${isValidTitle ? '' : 'is-invalid'} input-lg`} placeholder="Appointment title here..." />
                <label htmlFor="appointment-title">{label}</label>
            </form>
        )
    }

    return (
        <Modal show={props.isActive} onHide={cancel} centered>
            <Modal.Header>
                <Modal.Title>{props.createMode ? 'Create Appointment' : 'Edit Appointment'}</Modal.Title>
                <button type="button" className="close btn" onClick={() => props.setIsActive(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3" style={{ width: '100%' }}>
                    {titleInputField()}

                    <div className="d-flex flex-row" style={{ gap: 20 }}>
                        <div className="mb-3 d-flex flex-column">
                            <label htmlFor="appointment-mechanic-id">Mechanic</label>
                            <select id="appointment-mechanic-id" className={`item-selector ${mechanicId === -1 ? 'is-invalid' : ''}`} value={mechanicId} onChange={event => setMechanicId(event.target.value)}>
                                <option key="-1" selected disabled value={-1}>Select mechanic</option>
                                {mechanicNames.map((name, index) => {
                                    return <option key={index} value={index}>{name}</option>
                                })}
                            </select>
                            <div className="invalid-feedback">Please select a valid mechanic name</div>
                        </div>

                        <div className="mb-3 d-flex flex-column">
                            <label htmlFor="appointment-category-id">Category</label>
                            <select id="appointment-category-id" className={`item-selector ${categoryId === -1 ? 'is-invalid' : ''}`} value={categoryId} onChange={event => setCategoryId(event.target.value)}>
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
                        <textarea value={description} onChange={event => setDescription(event.target.value)} id="appointment-description" className="form-control" style={{ height: 200 }} placeholder="Description here..." />
                    </div>

                    {
                        title.length > 0 && mechanicId !== -1 && categoryId !== -1 ?
                            <>
                                <div className="mb-3">
                                    <label htmlFor="appointment-date">Date</label>
                                    <Calendar id="appointment-date" selectedDate={date} setSelectedDate={setDate} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="appointment-time">Time</label>
                                    <TimeInput id="appointment-time" appointments={filterByDate(props.appointments, date, props.createMode ? null : props.id)} selectedDate={date} selectedSlot={timeSlot} setSelectedSlot={setTimeSlot} />
                                    {timeSlot === null ? <h5 style={{ color: 'red' }}>Please select a time slot</h5> : <></>}
                                </div>
                            </> : <></>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={cancel}>Cancel</button>
                <button type="submit" className="btn btn-primary" onClick={submit} disabled={!isValid()}>Save</button>
            </Modal.Footer>
        </Modal>
    )
}

export default AppointmentModal

function filterByDate(appointments, date, idToRemove) {
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    const result = []

    const toRemove = getAppointmentById(idToRemove, appointments)

    for (let index = 0; index < appointments.length; index += 1) {
        const appointment = appointments[index]
        const appointmentDate = new Date(appointment.time)
        appointmentDate.setHours(0, 0, 0, 0)
        if (appointmentDate.getTime() === target.getTime()) {
            if (toRemove !== null && toRemove.time.getTime() === appointment.time.getTime()) continue
            result.push(appointment)
        }
    }

    return result
}