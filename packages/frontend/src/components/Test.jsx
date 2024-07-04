import { useState } from "react";
import { FrameIcon } from "../assets/icons";

function Test() {
    const [appointments, setAppointments] = useState([]);


    const [isNewAppointment, setIsNewAppointment] = useState(false);
    const [appointmentTitle, setAppointmentTitle] = useState('');
    const [appointmentDetail, setAppointmentDetail] = useState('');

    const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
    const [editedAppointmentTitle, setEditedAppointmentTitle] = useState('');
    const [editedAppointmentDetail, setEditedAppointmentDetail] = useState('');


    function showAddAppointment() {
        return <>
            <p class="card-title" style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                <h3>New Appointment</h3>
            </p>
            <div class="form-group">
                <label for="appointment-title">Title</label>
                <input type="text" value={appointmentTitle} onChange={event => setAppointmentTitle(event.target.value)} id="appointment-title" class="form-control" placeholder="Your title here..."></input>
            </div>

            <div class="form-group">
                <label for="appointment-detail">Detail</label>
                <input type="text" value={appointmentDetail} onChange={event => setAppointmentDetail(event.target.value)} id="appointment-detail" class="form-control" placeholder="Your title here..."></input>
            </div>

            <div class="d-flex flex-row" style={{ gap: "10px" }}>
                <button type="submit" class="btn btn-primary" onClick={addNewAppointment}>Submit</button>
                <button class="btn btn-primary" onClick={cancelNewAppointment}>Cancel</button>
            </div>
        </>
    }

    function addNewAppointment() {
        const appointment = {
            id: generateRandomString(),
            title: appointmentTitle,
            mechanicName: appointmentDetail,
            time: new Date(Date.now()).toDateString(),
            iconPath: <FrameIcon />
        }

        setAppointments([
            appointment,
            ...appointments
        ])

        setAppointmentTitle('');
        setAppointmentDetail('');
        setIsNewAppointment(false);
    }

    function removeAppointment(appointmentId) {
        const apts = appointments.filter(apt => apt.id !== appointmentId);
        setAppointments(apts);
    }

    function cancelNewAppointment() {
        setAppointmentTitle('');
        setAppointmentDetail('');
        setIsNewAppointment(false);
    }

    function editAppointment(appointment) {
        setEditedAppointmentTitle(appointment.title);
        setEditedAppointmentDetail(appointment.mechanicName);
        setSelectedAppointmentId(appointment.id);
    }

    function cancelEdit() {
        setSelectedAppointmentId('');
        setEditedAppointmentTitle('');
        setEditedAppointmentDetail('');
    }

    function saveAppointment(appointment) {
        appointment.title = editedAppointmentTitle;
        appointment.mechanicName = editedAppointmentDetail;
        setAppointments([...appointments]);
        setSelectedAppointmentId('');
    }



    return <div class="card-body" style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: "column",
        gap: "20px",
        width: "60%"
    }}>


        {isNewAppointment ? showAddAppointment() : <button class="btn btn-primary btn-lg" style={{
            width: "10%"
        }} onClick={() => setIsNewAppointment(true)}>
            +
        </button>}










        {appointments.map(appointment => <div class="card" style={{ width: "100%", alignSelf: "center" }}>
            <div class="card-header">
                <div class="d-flex flex-row" style={{ gap: "10px", justifyContent: "space-between" }}>
                    {selectedAppointmentId === appointment.id ?
                        <input type="text" value={editedAppointmentTitle} onChange={event => setEditedAppointmentTitle(event.target.value)} id="appointment-detail" class="form-control" placeholder="New title..."></input>
                        :
                        <strong>{appointment.title}</strong>
                    }
                    <div class="d-flex flex-row" style={{ gap: "10px" }}>
                        {selectedAppointmentId === appointment.id ?
                            <>
                                <button type="button" onClick={cancelEdit} class="btn btn-primary">Cancel</button>
                                <button type="button" onClick={() => saveAppointment(appointment)} class="btn btn-success">Save</button>
                            </>
                            :
                            <button type="button" onClick={() => editAppointment(appointment)} class="btn btn-secondary">Edit</button>
                        }
                        <button type="button" onClick={() => removeAppointment(appointment.id)} class="btn btn-danger">Remove</button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-title" style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                    {selectedAppointmentId === appointment.id ?
                        <input type="text" value={editedAppointmentDetail} onChange={event => setEditedAppointmentDetail(event.target.value)} id="appointment-detail" class="form-control" placeholder="New detail..."></input>
                        :
                        <em>{appointment.mechanicName}</em>
                    }
                    <div style={{ width: "3em", height: "3em" }}>
                        {appointment.iconPath}
                    </div>
                </p>
                <p class="card-text">{appointment.time}</p>
            </div>
        </div>)}
    </div>
}

export default Test;

function generateRandomString(length = 16) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};