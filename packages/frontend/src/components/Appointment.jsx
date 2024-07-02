import { BinLogo, EllipsisLogo, PencilLogo } from '../assets/icons'
import { categories, mechanicNames } from './Account'
import axios from 'axios'

function Appointment(props) {
    function deleteAppointment() {
        axios.get(`appointments/delete/${props.id}`).then(response => {
            if (response.ok) {
                props.deleteAppointment()
            }
        }).catch(() => {
            
        })

        // do it anyway for the sake of debugging because the fetching is yet to be implemented
        props.deleteAppointment()
    }

    function editAppointment() {
        props.setId(props.id)
        props.setCreateMode(false)
        props.setShowAppointmentModal(true)
    }

    return (
        <div className="card flex_card">
            <div className="card-header flex_card_row">
                <strong>{props.title}</strong>
                <div>
                    <div className="flex_card_row_reversed">
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
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="card-title flex_card_row">
                    <div className="d-flex flex-column">
                        <em>{mechanicNames[props.mechanicId]}</em>
                        <em>{categories[props.categoryId].category}</em>
                        <hr className="border-2"/>
                        <pre>{props.description}</pre>
                    </div>
                    <div className="small_icon">{categories[props.categoryId].icon}</div>
                </div>
                <p className="card-text flex_card_row">{formatDateTime(props.time)}<strong style={{color: colors[props.status]}}>{props.status}</strong></p>
            </div>
        </div>
    )
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