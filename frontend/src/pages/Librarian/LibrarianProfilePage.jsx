import { useState, useEffect, useRef } from 'react'
import LibrarianHeader from '../../components/librarian/LibrarianHeader.jsx'
import { useLibrarianProfile } from '../../stores/useLibrarianProfile'
import { useAuth } from '../../stores/AuthContext'
import LibrarianProfileSkeleton from './components/LibrarianProfileSkeleton'

import '../../styles/layout.css'
import '../../styles/librarian.css'

const DEFAULT_AVATAR = '/images/user.png'

export default function LibrarianProfilePage() {
    const { profile, loading, error, updateProfile, changePassword, uploadPicture } = useLibrarianProfile()
    const { refreshUser } = useAuth()
    const fileRef = useRef(null)

    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', sex: '', married: false })
    const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [notice, setNotice] = useState(null)   // { type, text }
    const [savingProfile, setSavingProfile] = useState(false)
    const [savingPw, setSavingPw] = useState(false)

    // Hydrate the form once the profile arrives.
    useEffect(() => {
        if (profile) {
            setForm({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                sex: profile.sex || '',
                married: !!profile.married,
            })
        }
    }, [profile])

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

    const saveProfile = async (e) => {
        e.preventDefault()
        setNotice(null)
        setSavingProfile(true)
        try {
            await updateProfile(form)
            await refreshUser()
            setNotice({ type: 'success', text: 'Profile updated successfully.' })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        } finally {
            setSavingProfile(false)
        }
    }

    const savePassword = async (e) => {
        e.preventDefault()
        setNotice(null)
        setSavingPw(true)
        try {
            await changePassword(pw)
            setPw({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setNotice({ type: 'success', text: 'Password changed successfully.' })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        } finally {
            setSavingPw(false)
        }
    }

    const onPickFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setNotice(null)
        try {
            await uploadPicture(file)
            await refreshUser()
            setNotice({ type: 'success', text: 'Profile picture updated.' })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        }
    }

    return (
        <>
            <LibrarianHeader />

            <div className="container-fluid mt-4">
                <div className="container" style={{ maxWidth: 900, marginBottom: 50 }}>
                    <h2 className="fw-bold mb-4">My Profile</h2>

                    {notice && <div className={`alert alert-${notice.type}`}>{notice.text}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <LibrarianProfileSkeleton />
                    ) : profile ? (
                        <div className="row g-4">
                            {/* Picture card */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 text-center">
                                    <img
                                        src={profile.profilePicture || DEFAULT_AVATAR}
                                        alt="profile"
                                        style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #dee2e6', margin: '0 auto' }}
                                    />
                                    <h5 className="fw-bold mt-3 mb-0">{profile.firstName} {profile.lastName}</h5>
                                    <p className="text-muted small">{profile.email}</p>
                                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="d-none" onChange={onPickFile} />
                                    <button className="btn btn-outline-dark btn-sm mt-2" onClick={() => fileRef.current?.click()}>
                                        Change Picture
                                    </button>
                                </div>
                            </div>

                            {/* Details + password */}
                            <div className="col-md-8">
                                <div className="card border-0 shadow-sm p-4 mb-4">
                                    <h5 className="fw-bold mb-3">Account Details</h5>
                                    <form onSubmit={saveProfile} className="d-flex flex-column gap-3">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">First Name</label>
                                                <input type="text" className="form-control" required value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Last Name</label>
                                                <input type="text" className="form-control" required value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label fw-semibold">Email</label>
                                            <input type="email" className="form-control" required value={form.email} onChange={(e) => setField('email', e.target.value)} />
                                        </div>
                                        <div className="row g-3 align-items-end">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Sex</label>
                                                <select className="form-select" value={form.sex} onChange={(e) => setField('sex', e.target.value)}>
                                                    <option value="">Prefer not to say</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="married" checked={form.married} onChange={(e) => setField('married', e.target.checked)} />
                                                    <label className="form-check-label" htmlFor="married">Married</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-dark px-4" disabled={savingProfile}>
                                                {savingProfile ? 'Saving…' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="card border-0 shadow-sm p-4">
                                    <h5 className="fw-bold mb-3">Change Password</h5>
                                    <form onSubmit={savePassword} className="d-flex flex-column gap-3">
                                        <div>
                                            <label className="form-label fw-semibold">Current Password</label>
                                            <input type="password" className="form-control" required value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} />
                                        </div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">New Password</label>
                                                <input type="password" className="form-control" required minLength={6} value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Confirm New Password</label>
                                                <input type="password" className="form-control" required minLength={6} value={pw.confirmPassword} onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-dark px-4" disabled={savingPw}>
                                                {savingPw ? 'Saving…' : 'Change Password'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}