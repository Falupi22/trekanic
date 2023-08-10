import { BinLogo, CheckLogo, CloseLogo, EllipsisLogo, PencilLogo } from "../assets/icons";
import { useState } from "react"

function Appointment(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedMechanicName, setEditedMechanicName] = useState('');
    const [editedDescription, setEditedDescription] = useState('')

    function editAppointment() {
        setEditedTitle(props.title);
        setEditedMechanicName(props.mechanicName);
        setEditedDescription(props.description)
        setIsEditing(true);
    }

    function cancelEditAppointment() {
        setIsEditing(false);
        setEditedTitle('');
        setEditedMechanicName('');
        setEditedDescription('')
    }

    function saveAppointment() {
        setIsEditing(false);
        props.edit(editedTitle, editedMechanicName);
        setEditedTitle('');
        setEditedMechanicName('');
        setEditedDescription('')
    }

    function deleteAppointment() {
        props.setStatus('Canceled');
    }

    return <div className="card flex_card">
        <div className="card-header flex_card_row">
            {isEditing ?
                <input type="text" value={editedTitle} onChange={event => setEditedTitle(event.target.value)} className="form-control" style={{width: "50%"}}></input>
            :
                <strong>{props.title}</strong>
            }
            <div>
                <div className="flex_card_row_reversed">
                    {isEditing ?
                        <div className="d-flex flex-row" style={{gap: "10px"}}>
                            <button className="tiny_button transparent" onClick={saveAppointment}>
                                <CheckLogo/>
                            </button>
                            <button className="tiny_button transparent" onClick={cancelEditAppointment}>
                                <CloseLogo/>
                            </button>
                        </div>
                    :
                    <>
                        <button className="tiny_button transparent ellipsis-button">
                            <EllipsisLogo/>
                        </button>
                        <div className="hover_toggleable">
                            <button className="tiny_button transparent" onClick={deleteAppointment}>
                                <BinLogo/>
                            </button>
                            <button className="tiny_button transparent" onClick={editAppointment}>
                                <PencilLogo/>
                            </button>
                        </div>
                    </>
                    }
                </div>
            </div>
        </div>
        <div className="card-body">
            <p className="card-title flex_card_row">
                <div className="d-flex flex-column">
                    {isEditing ?
                    <>
                        <input type="text" value={editedMechanicName} onChange={event => setEditedMechanicName(event.target.value)} className="form-control" style={{width: "50%"}}></input>
                        <hr class="border-2"/>
                        <textarea value={editedDescription} onChange={event => setEditedDescription(event.target.value)} className="form-control" style={{width: "50%"}}></textarea>
                    </>
                    :  
                    <>
                        <em>{props.mechanicName}</em>
                        <hr class="border-2"/>
                        <pre>{props.description}</pre>
                    </>
                    }
                </div>
                <div className="small_icon">{props.iconPath}</div>
            </p>
            <p className="card-text flex_card_row">{formatDateTime(props.time)}<strong style={{color: colors[props.status]}}>{props.status}</strong></p>
        </div>
    </div>
}

export default Appointment;

const colors = {
    "Pending": "black",
    "Done": "green", 
    "Canceled": "var(--red)"
}

function formatDateTime(date) {
    return `${months[date.getMonth()]} ${formatTime(date.getDate())} ${formatTime(date.getHours())}:${formatTime(date.getMinutes())}`
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time.toString()
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]