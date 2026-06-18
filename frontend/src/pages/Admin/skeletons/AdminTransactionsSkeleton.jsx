import '../../../styles/skeleton.css'

const TableBlock = ({ cols, rows }) => (
    <div className="panel" style={{ marginBottom: 10 }}>
        <div className="panel-hdr">
            <div className="skeleton" style={{ height: 13, width: 140, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 11, width: 60, borderRadius: 4 }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
            {Array.from({ length: rows }).map((_, r) => (
                <tr key={r} style={{ borderBottom: '1px solid var(--border)' }}>
                    {Array.from({ length: cols }).map((_, c) => (
                        <td key={c} style={{ padding: '12px' }}>
                            <div className="skeleton" style={{ height: 11, width: c === 0 ? '70%' : '55%', borderRadius: 4 }} />
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
)

// Mirrors AdminTransactionsPage: two table panels (book + room).
export default function AdminTransactionsSkeleton() {
    return (
        <div className="sec">
            <div className="sec-label">Transactions</div>
            <TableBlock cols={6} rows={6} />
            <TableBlock cols={5} rows={4} />
        </div>
    )
}