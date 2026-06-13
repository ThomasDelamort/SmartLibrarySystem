import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

// "Store" for the Books page: owns data fetching and URL-param plumbing.
// The URL (?page=&q=&category=) is the source of truth.
export function useBooks() {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseInt(searchParams.get('page')) || 1
    const q = searchParams.get('q') || ''
    const selectedCategories = searchParams.getAll('category')

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let active = true
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.set('page', String(page))
        if (q) params.set('q', q)
        selectedCategories.forEach((c) => params.append('category', c))

        api.get(`/api/books?${params.toString()}`)
            .then((res) => { if (active) { setData(res); setLoading(false) } })
            .catch((err) => { if (active) { setError(err.message); setLoading(false) } })

        return () => { active = false }
    }, [page, q, selectedCategories.join(',')])

    const goToPage = (n) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', String(n))
        setSearchParams(params)
    }

    const applyCategories = (categories) => {
        const params = new URLSearchParams(searchParams)
        params.delete('category')
        categories.forEach((c) => params.append('category', c))
        params.set('page', '1')
        setSearchParams(params)
    }

    return {
        books: data?.books || [],
        totalPages: data?.pagination?.totalPages || 1,
        loading,
        error,
        page,
        q,
        selectedCategories,
        goToPage,
        applyCategories,
    }
}