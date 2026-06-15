import { useState } from 'react'

const asText = (v) => (Array.isArray(v) ? v.join(', ') : v || '')

// Add/edit book modal. `book` null = add; otherwise edit. Submits multipart FormData.
export default function BookFormModal({ book, onClose, saveBook }) {
    const isEdit = !!book
    const [form, setForm] = useState({
        title: book?.title || '',
        author: asText(book?.author),
        category: asText(book?.category),
        description: book?.description || '',
        isbn: book?.isbn || '',
        publisher: book?.publisher || '',
        publishedYear: book?.publishedYear || '',
        status: book?.status || 'available',
    })
    const [imageFile, setImageFile] = useState(null)
    const [pdfFile, setPdfFile] = useState(null)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

    const submit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!isEdit && !imageFile) {
            setError('A cover image is required.')
            return
        }

        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('author', form.author)
        fd.append('category', form.category)
        fd.append('description', form.description)
        fd.append('isbn', form.isbn)
        fd.append('publisher', form.publisher)
        fd.append('publishedYear', form.publishedYear)
        if (isEdit) fd.append('status', form.status)
        if (imageFile) fd.append('image', imageFile)
        if (pdfFile) fd.append('pdf', pdfFile)

        setSubmitting(true)
        try {
            await saveBook(isEdit ? book.id : null, fd)
            onClose(true)
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    return (
        <div
            onClick={() => onClose(false)}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                padding: '5vh 1rem', zIndex: 1055, overflowY: 'auto',
            }}
        >
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded shadow" style={{ width: '100%', maxWidth: 560 }}>
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="fw-bold mb-0">{isEdit ? 'Edit Book' : 'Add New Book'}</h5>
                    <button type="button" className="btn-close" onClick={() => onClose(false)} />
                </div>

                <form onSubmit={submit}>
                    <div className="p-3 d-flex flex-column gap-3">
                        {error && <div className="alert alert-danger mb-0">{error}</div>}

                        <div>
                            <label className="form-label fw-semibold">Title</label>
                            <input type="text" className="form-control" required value={form.title} onChange={(e) => set('title', e.target.value)} />
                        </div>

                        <div>
                            <label className="form-label fw-semibold">Author(s)</label>
                            <input type="text" className="form-control" placeholder="e.g. James Clear, John Doe" required value={form.author} onChange={(e) => set('author', e.target.value)} />
                            <small className="text-muted">Comma-separated.</small>
                        </div>

                        <div>
                            <label className="form-label fw-semibold">Category</label>
                            <input type="text" className="form-control" placeholder="e.g. Self Help, Business" required value={form.category} onChange={(e) => set('category', e.target.value)} />
                            <small className="text-muted">Comma-separated.</small>
                        </div>

                        <div>
                            <label className="form-label fw-semibold">Cover Image {isEdit && <span className="text-muted fw-normal">(leave empty to keep current)</span>}</label>
                            {isEdit && book.image && (
                                <div className="mb-2">
                                    <img src={book.image} alt="current cover" style={{ height: 70, borderRadius: 6 }} />
                                </div>
                            )}
                            <input type="file" className="form-control" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                        </div>

                        <div>
                            <label className="form-label fw-semibold">PDF {isEdit ? <span className="text-muted fw-normal">(leave empty to keep current)</span> : <span className="text-muted fw-normal">(optional)</span>}</label>
                            <input type="file" className="form-control" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                            {isEdit && book.pdfUrl && <small className="text-success d-block mt-1">A PDF is currently attached.</small>}
                        </div>

                        <div>
                            <label className="form-label fw-semibold">Description</label>
                            <textarea className="form-control" rows={4} required value={form.description} onChange={(e) => set('description', e.target.value)} />
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">ISBN</label>
                                <input type="text" className="form-control" value={form.isbn} onChange={(e) => set('isbn', e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Publisher</label>
                                <input type="text" className="form-control" value={form.publisher} onChange={(e) => set('publisher', e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Published Year</label>
                                <input type="number" className="form-control" min={1000} max={new Date().getFullYear()} value={form.publishedYear} onChange={(e) => set('publishedYear', e.target.value)} />
                            </div>
                            {isEdit && (
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Status</label>
                                    <select className="form-select" value={form.status} onChange={(e) => set('status', e.target.value)}>
                                        <option value="available">Available</option>
                                        <option value="borrowed">Borrowed</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 p-3 border-top">
                        <button type="button" className="btn btn-secondary" onClick={() => onClose(false)}>Cancel</button>
                        <button type="submit" className="btn btn-dark" disabled={submitting}>
                            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}