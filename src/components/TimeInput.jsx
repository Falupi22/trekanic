import { useEffect, useState } from 'react'
import '../styles/timeInput.css'

function TimeInput(props) {
    function generateTimeSlots() {
        const slots = []
        const targetStartTime = new Date(props.selectedDate)
        targetStartTime.setHours(9, 0, 0, 0)
        let startTime = new Date()
        startTime.setMinutes(0, 0, 0)
        if (startTime < targetStartTime) {
            startTime = targetStartTime
        }

        const endTime = new Date(props.selectedDate)
        endTime.setHours(17, 59, 59, 0)

        while (startTime <= endTime) {
            if (startTime.getHours() !== 12) {
                const finish = new Date(startTime)
                finish.setHours(finish.getHours() + 1)
                slots.push({ start: new Date(startTime), finish: finish })
            }

            startTime.setHours(startTime.getHours() + 1)
        }

        return slots.filter(slot => {
            const start = slot.start.getTime()
            return !props.appointments.some(appointment => {
                const appointmentStart = new Date(appointment.time).getTime()
                return appointmentStart === start
            })
        })
    }

    let slots = generateTimeSlots()

    function renderSlots() {
        if (slots.length === 0) return <span style={{fontSize: 32}}>All slots are taken for this day</span>
        return (
            <>
            {slots.map((slot, index) => {
                return (
                    <div key={index} className={slotStyle(slot)} onClick={() => props.setSelectedSlot(slot)}>
                        {hoursAndMinutes(slot.start)} - {hoursAndMinutes(slot.finish)}
                    </div>
                )
            })}
            </>
        )
    }

    function slotStyle(slot) {
        if (props.selectedSlot === null) return 'time-slot'
        if (props.selectedSlot.start.getTime() === slot.start.getTime() && props.selectedSlot.finish.getTime() === slot.finish.getTime()) return 'time-slot selected'
        return 'time-slot'
    }

    return (
        <div className="time-slot-picker">
            {renderSlots()}
        </div>
    )
}

function hoursAndMinutes(date) {
    const hours = format(date.getHours())
    const minutes = format(date.getMinutes())
    return `${hours}:${minutes}`
}

function format(time) {
    return time < 10 ? `0${time}` : time.toString()
}

export default TimeInput