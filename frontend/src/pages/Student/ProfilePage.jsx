import { useEffect, useRef, useState } from 'react'
import Header from '../../components/header/Header.jsx'
import Footer from '../../components/footer/Footer.jsx'
import { useProfile } from '../../stores/useProfile'
import ProfileSkeleton from './components/ProfileSkeleton'
import Space from "../../components/Space.jsx";

import '../../styles/style.css'
import '../../styles/layout.css'

export default function ProfilePage() {
    const { profile, loading, error, updateProfile, changePassword, uploadPicture } = useProfile()

    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', sex: 'male' })
    const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [notice, setNotice] = useState(null)
    const [savingInfo, setSavingInfo] = useState(false)
    const [savingPwd, setSavingPwd] = useState(false)
    const fileRef = useRef(null)

    // Populate the edit form once the profile loads.
    useEffect(() => {
        if (profile) {
            setForm({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                sex: profile.sex || 'male',
            })
        }
    }, [profile])

    const onSaveInfo = async (e) => {
        e.preventDefault()
        setNotice(null)
        setSavingInfo(true)
        try {
            await updateProfile(form)
            setNotice({ type: 'success', text: 'Profile updated successfully.' })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        } finally {
            setSavingInfo(false)
        }
    }

    const onChangePassword = async (e) => {
        e.preventDefault()
        setNotice(null)
        setSavingPwd(true)
        try {
            await changePassword(pwd)
            setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setNotice({ type: 'success', text: 'Password changed successfully.' })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        } finally {
            setSavingPwd(false)
        }
    }

    const onPickFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setNotice(null)
        try {
            await uploadPicture(file)
            setNotice({ type: 'success', text: 'Profile picture updated.' })
        } catch (err) {
            setNotice({ type: 'danger', text: err.message })
        }
    }

    return (
        <>
            <Header />

            <div className="container-fluid mt-4">
                <div className="container" style={{ maxWidth: 700 }}>

                    <h2 className="fw-bold mb-4">My Profile</h2>

                    {notice && <div className={`alert alert-${notice.type}`}>{notice.text}</div>}
                    {loading && <ProfileSkeleton />}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && profile && (
                        <>
                            {/* Info card */}
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <div className="d-flex align-items-center gap-4 mb-4">
                                    <div style={{ position: 'relative', width: 80, height: 80 }}>
                                        <img
                                            src={profile.profilePicture || '/images/user.png'}
                                            alt="profile"
                                            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            title="Change photo"
                                            style={{
                                                position: 'absolute', bottom: 0, right: 0, width: 24, height: 24,
                                                background: '#212529', color: '#fff', border: 'none',
                                                borderRadius: '50%', cursor: 'pointer', lineHeight: 1, fontSize: 12,
                                            }}
                                        >
                                            ✎
                                        </button>
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            style={{ display: 'none' }}
                                            onChange={onPickFile}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-0">{profile.firstName} {profile.lastName}</h4>
                                        <small className="text-muted">{profile.studentId}</small>
                                        <br />
                                        <span className={`badge mt-1 ${profile.canBorrow ? 'bg-success' : 'bg-danger'}`}>
                                            {profile.canBorrow ? 'Can Borrow' : 'Borrowing Suspended'}
                                        </span>
                                    </div>
                                </div>

                                <div className="row g-3 mb-2">
                                    <div className="col-md-4 text-center">
                                        <div className="card border-0 bg-light p-3">
                                            <h4 className="fw-bold mb-0">{profile.borrowedCount}</h4>
                                            <small className="text-muted">Borrowed</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <div className="card border-0 bg-light p-3">
                                            <h4 className="fw-bold mb-0">{profile.likedCount}</h4>
                                            <small className="text-muted">Liked Books</small>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <div className="card border-0 bg-light p-3">
                                            <h4 className={`fw-bold mb-0 ${profile.fines > 0 ? 'text-danger' : 'text-success'}`}>
                                                ₱{profile.fines}
                                            </h4>
                                            <small className="text-muted">Fines</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit profile */}
                            <div className="card border-0 shadow-sm p-4 mb-4">
                                <h5 className="fw-bold mb-3">Edit Profile</h5>
                                <form onSubmit={onSaveInfo}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">First Name</label>
                                            <input
                                                type="text" className="form-control" required
                                                value={form.firstName}
                                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Last Name</label>
                                            <input
                                                type="text" className="form-control" required
                                                value={form.lastName}
                                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Email</label>
                                            <input
                                                type="email" className="form-control" required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Sex</label>
                                            <select
                                                className="form-select" required
                                                value={form.sex}
                                                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mt-3">
                                        <button type="submit" className="btn btn-dark px-4" disabled={savingInfo}>
                                            {savingInfo ? 'Saving…' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Change password */}
                            <div className="card border-0 shadow-sm p-4">
                                <h5 className="fw-bold mb-3">Change Password</h5>
                                <form onSubmit={onChangePassword}>
                                    <div className="d-flex flex-column gap-3">
                                        <div>
                                            <label className="form-label fw-semibold">Current Password</label>
                                            <input
                                                type="password" className="form-control" required
                                                value={pwd.currentPassword}
                                                onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label fw-semibold">New Password</label>
                                            <input
                                                type="password" className="form-control" minLength={6} required
                                                value={pwd.newPassword}
                                                onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label fw-semibold">Confirm New Password</label>
                                            <input
                                                type="password" className="form-control" minLength={6} required
                                                value={pwd.confirmPassword}
                                                onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mt-3">
                                        <button type="submit" className="btn btn-outline-dark px-4" disabled={savingPwd}>
                                            {savingPwd ? 'Updating…' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}

                </div>
            </div>
            <Space />
            <Footer />
        </>
    )
}