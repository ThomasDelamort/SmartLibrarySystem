import '../../../styles/skeleton.css'

// Mirrors the dashboard layout (stat grid + analytics + statistics panels) so
// there's no jump when data arrives. Rendered inside .admin-scope.
const Bar = ({ w = '100%', h = 12, mb = 0, r = 4 }) => (
    <div className="skeleton" style={{ width: w, height: h, marginBottom: mb, borderRadius: r }} />
)

const PanelRows = ({ count }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="d-flex align-items-center gap-2" style={{ padding: '8px 0' }}>
                <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <Bar w="50%" h={11} mb={6} />
                    <Bar w="75%" h={9} />
                </div>
            </div>
        ))}
    </>
)

export default function AdminDashboardSkeleton() {
    return (
        <>
            <div className="sec-label" style={{ marginBottom: 16 }}>Overview</div>

            {/* Stat grid */}
            <div className="stat-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div className="stat-card" key={i}>
                        <Bar w="60%" h={11} mb={14} />
                        <Bar w={50} h={26} mb={10} />
                        <Bar w="40%" h={9} />
                    </div>
                ))}
            </div>

            {/* Analytics */}
            <div className="sec" style={{ marginTop: 16 }}>
                <div className="sec-label">Analytics</div>

                <div className="panel" style={{ marginBottom: 10 }}>
                    <Bar w={120} h={13} mb={16} />
                    <div className="skeleton" style={{ width: '100%', height: 180, borderRadius: 8 }} />
                </div>

                <div className="two-col">
                    <div className="panel">
                        <Bar w={110} h={13} mb={16} />
                        <div className="skeleton" style={{ width: '100%', height: 140, borderRadius: 8 }} />
                    </div>
                    <div className="panel">
                        <Bar w={90} h={13} mb={16} />
                        <Bar w="100%" h={9} mb={8} />
                        <Bar w="80%" h={9} mb={16} />
                        <div className="skeleton" style={{ width: '100%', height: 36, borderRadius: 6 }} />
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="sec">
                <div className="sec-label">Statistics</div>
                <div className="two-col">
                    <div className="panel">
                        <Bar w={110} h={13} mb={16} />
                        <PanelRows count={5} />
                    </div>
                    <div className="panel">
                        <Bar w={120} h={13} mb={16} />
                        <PanelRows count={5} />
                    </div>
                </div>
            </div>
        </>
    )
}