import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'

// Data store for the librarian's own profile.
export function useLibrarianProfile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        return api.get('/api/librarian/profile')
            .then((res) => setProfile(res.profile))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const updateProfile = async (data) => {
        await api.post('/api/librarian/profile/update', data)
        setProfile((p) => ({ ...p, ...data, email: data.email.toLowerCase().trim() }))
    }

    const changePassword = async (data) => {
        await api.post('/api/librarian/profile/password', data)
    }

    // Multipart upload -> raw fetch (not the JSON client).
    const uploadPicture = async (file) => {
        const fd = new FormData()
        fd.append('profilePicture', file)
        const res = await fetch('/api/librarian/profile/picture', {
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