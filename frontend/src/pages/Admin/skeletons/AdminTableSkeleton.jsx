import '../../../styles/skeleton.css'

// Generic table-shaped skeleton for the admin list pages (students, librarians,
// books, transactions). Rendered inside .admin-scope.
export default function AdminTableSkeleton({ rows = 8, cols = 5, label = 'Loading' }) {
    return (
        <div className="sec">
            <div className="skeleton" style={{ height: 13, width: 90, marginBottom: 16, borderRadius: 4 }} />
            <div className="panel">
                <div className="panel-hdr">
                    <div className="skeleton" style={{ height: 13, width: 130, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 11, width: 50, borderRadius: 4 }} />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                        {Array.from({ length: rows }).map((_, r) => (
                            <tr key={r} style={{ borderBottom: '1px solid var(--border)' }}>
                                {Array.from({ length: cols }).map((_, c) => (
                                    <td key={c} style={{ padding: '12px' }}>
                                        <div className="skeleton" style={{ height: 12, width: c === 0 ? '70%' : '55%', borderRadius: 4 }} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}