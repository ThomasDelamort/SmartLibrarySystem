import '../../../styles/skeleton.css'

// Mirrors AdminRoomsPage: add-room form panel + rooms table.
export default function AdminRoomsSkeleton() {
    return (
        <div className="sec">
            <div className="sec-label">Rooms</div>

            {/* Add room form */}
            <div className="panel" style={{ marginBottom: 10 }}>
                <div className="panel-hdr"><div className="skeleton" style={{ height: 13, width: 90, borderRadius: 4 }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
                    <div className="skeleton" style={{ height: 31, borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 31, borderRadius: 8 }} />
                    <div className="skeleton" style={{ height: 31, borderRadius: 8 }} />
                    <div className="skeleton" style={{ width: 100, height: 31, borderRadius: 8 }} />
                </div>
            </div>

            {/* Table */}
            <div className="panel">
                <div className="panel-hdr">
                    <div className="skeleton" style={{ height: 13, width: 100, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 11, width: 50, borderRadius: 4 }} />
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                    {Array.from({ length: 6 }).map((_, r) => (
                        <tr key={r} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 70, borderRadius: 4 }} /></td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 50, borderRadius: 4 }} /></td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 130, borderRadius: 4 }} /></td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 18, width: 60, borderRadius: 999 }} /></td>
                            <td style={{ padding: '10px 12px' }}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <div className="skeleton" style={{ height: 26, width: 90, borderRadius: 6 }} />
                                    <div className="skeleton" style={{ height: 26, width: 52, borderRadius: 6 }} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}