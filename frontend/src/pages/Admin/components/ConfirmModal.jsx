export default function ConfirmModal({
                                         title = 'Confirm Action',
                                         message = 'Are you sure?',
                                         confirmLabel = 'Confirm',
                                         confirmColor = '#e11d48',
                                         onConfirm,
                                         onClose,
                                         busy = false,
                                     }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{ background: '#fff', borderRadius: 12, padding: '28px 24px', width: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
            >
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>{message}</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose} disabled={busy}
                        style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, cursor: 'pointer', color: '#374151' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm} disabled={busy}
                        style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: confirmColor, color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 500, opacity: busy ? 0.7 : 1 }}
                    >
                        {busy ? '…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}