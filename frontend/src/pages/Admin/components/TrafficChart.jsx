import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { api } from '../../../lib/api'

export default function TrafficChart() {
    const [range, setRange] = useState('14d')
    const [data, setData] = useState([])

    useEffect(() => {
        const days = range === '30d' ? 30 : 14
        api.get(`/api/admin/chart/traffic?days=${days}`)
            .then((res) => setData(res.labels.map((label, i) => ({
                label, students: res.students[i], librarians: res.librarians[i],
            }))))
            .catch(() => setData([]))
    }, [range])

    return (
        <div className="panel" style={{ marginBottom: 10 }}>
            <div className="panel-hdr">
                <div className="panel-title"><i className="ti ti-chart-line"></i>User traffic</div>
                <div className="pbtn-group">
                    <button className={`pbtn ${range === '14d' ? 'active' : ''}`} onClick={() => setRange('14d')}>14d</button>
                    <button className={`pbtn ${range === '30d' ? 'active' : ''}`} onClick={() => setRange('30d')}>30d</button>
                </div>
            </div>
            <div className="legend">
                <span><span className="ldot" style={{ background: '#1e293b' }}></span>Students</span>
                <span><span className="ldot" style={{ background: '#64748b' }}></span>Librarians (dashed)</span>
            </div>
            <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={28} />
                        <Tooltip />
                        <Line type="monotone" dataKey="students" stroke="#1e293b" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="librarians" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}