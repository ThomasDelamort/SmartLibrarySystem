import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { api } from '../../../lib/api'

export default function ReservationChart({ initialProcessed = 0, initialCancelled = 0 }) {
    const [mode, setMode] = useState('weekly')
    const [data, setData] = useState([])
    const [totals, setTotals] = useState({ processed: initialProcessed, cancelled: initialCancelled })

    useEffect(() => {
        api.get(`/api/admin/chart/reservations?mode=${mode}`)
            .then((res) => {
                setData(res.labels.map((label, i) => ({
                    label, processed: res.processed[i], cancelled: res.cancelled[i],
                })))
                setTotals({
                    processed: res.processed.reduce((a, b) => a + b, 0),
                    cancelled: res.cancelled.reduce((a, b) => a + b, 0),
                })
            })
            .catch(() => setData([]))
    }, [mode])

    return (
        <div className="panel">
            <div className="panel-hdr">
                <div className="panel-title"><i className="ti ti-bookmark"></i>Reservations</div>
                <div className="pbtn-group">
                    <button className={`pbtn ${mode === 'weekly' ? 'active' : ''}`} onClick={() => setMode('weekly')}>Weekly</button>
                    <button className={`pbtn ${mode === 'monthly' ? 'active' : ''}`} onClick={() => setMode('monthly')}>Monthly</button>
                </div>
            </div>
            <div className="sum-row">
                <div className="sum-card">
                    <div className="sum-lbl">Processed</div>
                    <div className="sum-val">{totals.processed}</div>
                    <div className="sum-sub" style={{ color: '#16a34a' }}>Approved</div>
                </div>
                <div className="sum-card">
                    <div className="sum-lbl">Cancelled</div>
                    <div className="sum-val">{totals.cancelled}</div>
                    <div className="sum-sub" style={{ color: '#ca8a04' }}>Cancelled</div>
                </div>
            </div>
            <div className="legend">
                <span><span className="ldot" style={{ background: '#1e293b' }}></span>Processed</span>
                <span><span className="ldot" style={{ background: '#94a3b8' }}></span>Cancelled</span>
            </div>
            <div style={{ width: '100%', height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={28} />
                        <Tooltip />
                        <Bar dataKey="processed" fill="#1e293b" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="cancelled" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}