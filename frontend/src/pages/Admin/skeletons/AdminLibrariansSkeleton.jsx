import '../../../styles/skeleton.css'

// Mirrors AdminLibrariansPage: table (avatar+name / Email / Sex / Joined /
// Actions). Rendered inside .admin-scope.
export default function AdminLibrariansSkeleton() {
    return (
        <div className="sec">
            <div className="sec-label">Librarians</div>

            <div className="panel">
                <div className="panel-hdr">
                    <div className="skeleton" style={{ height: 13, width: 120, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 11, width: 50, borderRadius: 4 }} />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                        {Array.from({ length: 6 }).map((_, r) => (
                            <tr key={r} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '10px 12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div className="skeleton" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} />
                                        <div className="skeleton" style={{ height: 11, width: 120, borderRadius: 4 }} />
                                    </div>
                                </td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 160, borderRadius: 4 }} /></td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 50, borderRadius: 4 }} /></td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 90, borderRadius: 4 }} /></td>
                                <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 24, width: 52, borderRadius: 6 }} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}