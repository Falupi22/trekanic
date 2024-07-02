import { useState } from 'react'
import '../styles/calendar.css'

function Calendar(props) {    
    const [anchorDate, setAnchorDate] = useState(new Date())

    function daysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate()
    }

    function firstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay()
    }

    function handleDateClick(date) {
        const now = new Date()
        if (date < now && !areSameDay(date, now)) return

        props.setSelectedDate(date)
    }

    function render() {
        const year = anchorDate.getFullYear()
        const month = anchorDate.getMonth()
        const totalDays = daysInMonth(year, month)
        const firstDay = firstDayOfMonth(year, month)

        const dates = Array.from({ length: totalDays }, (_, index) => {
            const date = new Date(year, month, index + 1)
            return date
        })

        return (
            <div className="calendar">
                <div className="calendar-header">
                    <button onClick={() => setAnchorDate(new Date(year, month - 1))}>Previous</button>
                    <h2>{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => setAnchorDate(new Date(year, month + 1))}>Next</button>
                </div>
                <div className="calendar-grid">
                    {renderGrid(firstDay, dates)}
                </div>
            </div>
        )
    }

    function renderGrid(firstDay, dates) {
        return (
            <>
            {
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
                    return <div key={day} className="calendar-day-header">{day}</div>
                })
            }
            {
                Array.from({ length: firstDay }).map((_, index) => {
                    return <div key={`empty-${index}`} className="calendar-day"></div>
                })
            }
            {
                dates.map(date => {
                    return <div key={date.getDate()} className={getBoxStyle(date)} onClick={() => handleDateClick(date)}>{date.getDate()}</div>
                })
            }
            </>
        )
    }

    function getBoxStyle(date) {
        const now = new Date()

        if (date < now && !areSameDay(date, now)) return 'calendar-day-disabled'
        if (areSameDay(date, props.selectedDate)) return 'calendar-day-selected'
        return 'calendar-day'
    }

    function areSameDay(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    return <div className="calendar-container">{render()}</div>
}

export default Calendar