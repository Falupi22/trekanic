import { useState } from 'react'
import '../styles/timeInput.css'

function TimeInput(props) {
    const [selectedHours, setSelectedHours] = useState(0)
    const [selectedMinutes, setSelectedMinutes] = useState(0)

    const hoursOptions = Array.from({ length: 24 }, (_, index) => {
        return (
            <option key={index} value={index}>
                {format(index)}
            </option>
        )
    })

    const minutesOptions = Array.from({ length: 60 / 30 }, (_, index) => {
        return (
            <option key={index * 30} value={index * 30}>
                {index * 30 === 0 ? '00' : `${index * 30}`}
            </option>
        )
    })

    function format(time) {
        return time < 10 ? `0${time}` : time.toString()
    }

    return (
        <div className="custom-time-input" style={{width: '100%'}}>
            <div className="d-flex flex-row" style={{gap: 10, fontSize: 32}}>
            <select value={selectedHours} onChange={event => setSelectedHours(parseInt(event.target.value))} style={{fontSize: 'inherit'}}>{hoursOptions}</select>
            <strong>:</strong>
            <select value={selectedMinutes} onChange={event => setSelectedMinutes(parseInt(event.target.value))} style={{fontSize: 'inherit'}}>{minutesOptions}</select>
            </div>

            <p style={{fontSize: 32}}>Selected time: {format(selectedHours)}:{format(selectedMinutes)}</p>
        </div>
    )
}

export default TimeInput