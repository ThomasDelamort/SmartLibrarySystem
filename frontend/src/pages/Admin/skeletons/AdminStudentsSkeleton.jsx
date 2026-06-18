import '../../../styles/skeleton.css'

// Mirrors AdminStudentsPage: search panel + table (avatar+name / ID / Email /
// Fines / Borrow / Actions). Rendered inside .admin-scope.
export default function AdminStudentsSkeleton() {
    return (
        <div className="sec">
            <div className="sec-label">Students</div>

            {/* Search bar */}
            <div className="panel" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <div className="skeleton" style={{ flex: 1, height: 31, borderRadius: 8 }} />
                    <div className="skeleton" style={{ width: 90, height: 31, borderRadius: 8 }} />
                </div>
            </div>

            {/* Table */}
            <div className="panel">
                <div className="panel-hdr">
                    <div className="skeleton" style={{ height: 13, width: 120, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 11, width: 50, borderRadius: 4 }} />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                        {Array.from({ length: 8 }).map((_, r) => (
                            <tr key={r} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '10px 12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} />
                                        <div className="skeleton" style={{ height: 11, width: 110, borderRadius: 4 }} />
                                    </div>
                                </td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 70, borderRadius: 4 }} /></td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 150, borderRadius: 4 }} /></td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 35, borderRadius: 4 }} /></td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 18, width: 44, borderRadius: 999 }} /></td>
                                <td style={{ padding: '10px 12px' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <div className="skeleton" style={{ height: 24, width: 56, borderRadius: 6 }} />
                                        <div className="skeleton" style={{ height: 24, width: 52, borderRadius: 6 }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}