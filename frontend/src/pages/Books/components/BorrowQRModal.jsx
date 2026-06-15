import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })

// Shown after a successful borrow. Encodes the reference + book + due date as a QR
// the student presents to the librarian. Mirrors the EJS qrModal.
export default function BorrowQRModal({ borrow, onClose }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!canvasRef.current || !borrow) return
        const payload = JSON.stringify({
            ref: borrow.referenceNumber,
            book: borrow.book,
            dueDate: borrow.dueDate,
            status: 'pending',
        })
        QRCode.toCanvas(canvasRef.current, payload, {
            width: 200,
            margin: 1,
            color: { dark: '#1a1a2e', light: '#ffffff' },
        }).catch(() => {})
    }, [borrow])

    const downloadQr = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const link = document.createElement('a')
        link.download = `${borrow.referenceNumber}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    if (!borrow) return null

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem', zIndex: 1060,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded shadow text-center"
                style={{ width: '100%', maxWidth: 420 }}
            >
                <div className="pt-4 px-4">
                    <div style={{ fontSize: '2.5rem' }}>📚</div>
                    <h5 className="fw-bold mt-1 mb-1">Borrow Request Submitted!</h5>
                    <p className="text-muted small mb-0">Show this QR code to the librarian when collecting your book.</p>
                </div>

                <div className="py-3 px-4">
                    <div className="d-flex justify-content-center mb-3">
                        <div style={{ padding: 12, border: '2px solid #dee2e6', borderRadius: 12, background: '#fff' }}>
                            <canvas ref={canvasRef} />
                        </div>
                    </div>

                    <div className="text-start bg-light rounded p-3 small" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        <div className="mb-1"><strong>📖 Book:</strong> {borrow.book}</div>
                        <div className="mb-1"><strong>🔖 Reference:</strong> {borrow.referenceNumber}</div>
                        <div className="mb-1"><strong>📅 Borrowed On:</strong> {formatDate(new Date())}</div>
                        <div><strong>⏰ Due Date:</strong> {formatDate(borrow.dueDate)}</div>
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-2 pb-4 px-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={downloadQr}>⬇ Download QR</button>
                    <button type="button" className="btn btn-primary px-4" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    )
}