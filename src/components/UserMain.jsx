import { BrakeLogo, EllipsisLogo, FlatTireLogo, FrameLogo, PencilLogo, BinLogo, PlusLogo, CloseLogo, CheckLogo } from "../assets/icons";
import "../styles/style.css"
import Appointment from "./Appointment";
import Welcome from "./general/Welcome";
import { useState } from "react";

function UserMain() {
    const [appointments, setAppointments] = useState([{
        id: generateRandomString(),
        title: "Broken frame",
        mechanicName: "Israel Israeli",
        time: new Date(),
        iconPath: <FrameLogo />,
        status: "Pending"
    }, {
        id: generateRandomString(),
        title: "Puncture",
        mechanicName: "Israela Israeli",
        time: new Date(),
        iconPath: <FlatTireLogo />,
        status: "Pending"
    }, {
        id: generateRandomString(),
        title: "Malfunctioned front brake",
        mechanicName: "Palestinia Palestine",
        time: new Date(),
        iconPath: <BrakeLogo />,
        status: "Pending"
    }, {
        id: generateRandomString(),
        title: "Malfunctioned front brake",
        mechanicName: "Palestinia Palestine",
        time: new Date(),
        iconPath: <BrakeLogo />,
        status: "Done"
    }, {
        id: generateRandomString(),
        title: "Malfunctioned front brake",
        mechanicName: "Palestinia Palestine",
        time: new Date(),
        iconPath: <BrakeLogo />,
        status: "Canceled"
    }]);

    const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
    const [newAppointmentTitle, setNewAppointmentTitle] = useState('');
    const [newAppointmentMechanicName, setNewAppointmentMechanicName] = useState('');

    function newAppointmentForm() {
        setNewAppointmentTitle('');
        setNewAppointmentMechanicName('');
        setShowNewAppointmentForm(true);
    }

    function cancelAppointmentForm() {
        setShowNewAppointmentForm(false);
        setNewAppointmentTitle('');
        setNewAppointmentMechanicName('');
    }

    function createNewAppointment() {
        const appointment = {
            id: generateRandomString(),
            title: newAppointmentTitle,
            mechanicName: newAppointmentMechanicName,
            time: new Date(),
            iconPath: <BrakeLogo />,
            status: "Pending"
        }

        appointments.unshift(appointment);
        setAppointments(appointments);
        cancelAppointmentForm();
    }

    function appointmentForm() {
        return <div className="mb-3" style={{width: "50%"}}>
            <div className="mb-3">
                <label htmlFor="appointment-title">Appointment Title</label>
                <input type="text" value={newAppointmentTitle} onChange={event => setNewAppointmentTitle(event.target.value)} id="appointment-title" className="form-control" placeholder="Appointment title here..."/>
            </div>

            <div className="mb-3">
                <label htmlFor="appointment-mechanic-name">Mechanic Name</label>
                <input type="text" value={newAppointmentMechanicName} onChange={event => setNewAppointmentMechanicName(event.target.value)} id="appointment-mechanic-name" className="form-control" placeholder="Mechanic name here..."/>
            </div>

            <button type="submit" className="btn btn-primary" onClick={createNewAppointment}>Submit</button>
        </div>
    }

    return <div className="flex_component">
        <Welcome userName="Tal" style="header"/>
        <div className="d-flex flex-column" style={{width: "60%"}}>
            <div className="d-flex flex-row" style={{justifyContent: "space-between", alignItems: "center"}}>
                <h2 className="mt-5 mb-5">Your appointments</h2>
                {showNewAppointmentForm ?
                    <button className="tiny_button transparent" onClick={cancelAppointmentForm}>
                        <CloseLogo/>
                    </button>
                :
                    <button className="tiny_button transparent" onClick={newAppointmentForm}>
                        <PlusLogo/>
                    </button>
                }
            </div>

            {showNewAppointmentForm ? appointmentForm() : <></>}
        </div>

        <div className="flex_card_list">
            {
                appointments.map(appointment => <Appointment
                        key={appointment.id}
                        title={appointment.title}
                        mechanicName={appointment.mechanicName}
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

function generateRandomString(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }