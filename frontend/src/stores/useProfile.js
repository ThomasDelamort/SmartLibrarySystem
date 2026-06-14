import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Data store for the student's profile.
export function useProfile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/students/profile')
            .then((res) => setProfile(res.profile))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const updateProfile = async (data) => {
        await api.post('/api/students/profile', data)
        setProfile((p) => ({ ...p, ...data, email: data.email.toLowerCase().trim() }))
    }

    const changePassword = async (data) => {
        await api.post('/api/students/profile/password', data)
    }

    // File upload needs multipart/form-data, so use fetch directly (not the JSON client).
    const uploadPicture = async (file) => {
        const fd = new FormData()
        fd.append('profilePicture', file)
        const res = await fetch('/api/students/profile/picture', {
            method: 'POST',
            body: fd,
            credentials: 'include',
        })
        if (!res.ok) {
            const d = await res.json().catch(() => ({}))
            throw new Error(d.error || 'Upload failed')
        }
        const data = await res.json()
        setProfile((p) => ({ ...p, profilePicture: data.profilePicture }))
        return data
    }

    return { profile, loading, error, updateProfile, changePassword, uploadPicture, refetch: load }
}