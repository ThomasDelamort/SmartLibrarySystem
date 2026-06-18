import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../stores/AuthContext'
import Logo from "./components/Logo.jsx";

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const user = await login(email, password)
            // Role-based routing: students -> books, librarians -> their dashboard.
            if (user.role === 'admin') navigate('/admin')
            else if (user.role === 'librarian') navigate('/librarian')
            else navigate('/books')
        } catch (err) {
            setError(err.message || 'Login failed')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: 350 }}>
                <main className="form-signin w-100 m-auto">
                    <form onSubmit={handleSubmit}>
                        <Logo />

                        <h1 className="h4 mb-3 fw-normal text-center">Please log in</h1>

                        <div className="form-floating mb-2">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Email Address</label>
                        </div>

                        <div className="form-floating mb-2">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>

                        {error && <p className="text-danger text-center">{error}</p>}

                        <div className="form-check text-start my-3">
                            <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
                            <label className="form-check-label" htmlFor="checkDefault">Remember me</label>
                        </div>

                        <button className="btn btn-primary w-100 py-2" type="submit" disabled={submitting}>
                            {submitting ? 'Signing in…' : 'Sign in'}
                        </button>

                        <p className="mt-4 mb-0 text-center text-body-secondary">
                            © {new Date().getFullYear()} SmartLS
                        </p>
                    </form>
                </main>
            </div>
        </div>
    )
}