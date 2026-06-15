import { useState } from 'react'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Replaces the EJS calendar.js with a self-contained React month grid.
export default function LibrarianCalendar() {
    const today = new Date()
    const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

    const firstDay = new Date(view.year, view.month, 1).getDay()
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

    const isToday = (day) =>
        day === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear()

    const prev = () => setView((v) => {
        const m = v.month - 1
        return m < 0 ? { year: v.year - 1, month: 11 } : { ...v, month: m }
    })
    const next = () => setView((v) => {
        const m = v.month + 1
        return m > 11 ? { year: v.year + 1, month: 0 } : { ...v, month: m }
    })

    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="calendar-day empty" />)
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(
            <div key={day} className={`calendar-day ${isToday(day) ? 'today' : ''}`}>
                <span className="calendar-date">{day}</span>
            </div>
        )
    }

    return (
        <div className="calendar-card">
            <div className="calendar-header">
                <div>
                    <h3 className="fw-bold mb-1">Library Calendar</h3>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-outline-dark" onClick={prev}>←</button>
                    <h5 className="mb-0">{MONTHS[view.month]} {view.year}</h5>
                    <button className="btn btn-outline-dark" onClick={next}>→</button>
                </div>
            </div>

            <div className="calendar-grid mb-3">
                {DAY_NAMES.map((d) => <div key={d} className="calendar-day-name">{d}</div>)}
            </div>

            <div className="calendar-grid">
                {cells}
            </div>
        </div>
    )
}