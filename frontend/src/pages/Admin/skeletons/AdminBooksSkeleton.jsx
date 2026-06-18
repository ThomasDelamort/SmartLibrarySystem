import '../../../styles/skeleton.css'

// Mirrors AdminBooksPage: two stat panels + search + books table.
export default function AdminBooksSkeleton() {
    return (
        <div className="sec">
            <div className="sec-label">Books</div>

            {/* Stat panels */}
            <div className="two-col" style={{ marginBottom: 10 }}>
                {Array.from({ length: 2 }).map((_, p) => (
                    <div className="panel" key={p}>
                        <div className="panel-hdr"><div className="skeleton" style={{ height: 13, width: 110, borderRadius: 4 }} /></div>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="d-flex align-items-center gap-2" style={{ padding: '6px 0' }}>
                                <div className="skeleton" style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton" style={{ height: 10, width: '55%', marginBottom: 5, borderRadius: 4 }} />
                                    <div className="skeleton" style={{ height: 8, width: '35%', borderRadius: 4 }} />
                                </div>
                                <div className="skeleton" style={{ height: 10, width: 30, borderRadius: 4 }} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="panel" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <div className="skeleton" style={{ flex: 1, height: 31, borderRadius: 8 }} />
                    <div className="skeleton" style={{ width: 90, height: 31, borderRadius: 8 }} />
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
                    {Array.from({ length: 8 }).map((_, r) => (
                        <tr key={r} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '10px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className="skeleton" style={{ width: 32, height: 42, borderRadius: 4, flexShrink: 0 }} />
                                    <div className="skeleton" style={{ height: 11, width: 140, borderRadius: 4 }} />
                                </div>
                            </td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 90, borderRadius: 4 }} /></td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 80, borderRadius: 4 }} /></td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 18, width: 60, borderRadius: 999 }} /></td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 11, width: 30, borderRadius: 4 }} /></td>
                            <td style={{ padding: '10px 12px' }}><div className="skeleton" style={{ height: 24, width: 52, borderRadius: 6 }} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}