import { useState } from 'react'
import Menu from './Menu'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    function login() {
        navigate('/account')
    }

    return (
        <div className="flex_wrapper">
            <Menu/>

            <div className="flex_login">
                <form className="d-flex flex-column" style={{gap: 15}}>
                    <div class="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" value={email} onChange={event => setEmail(event.target.value)} className="form-control input-lg" id="email" aria-describedby="emailHelp" placeholder="name@example.com"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>

                    <div class="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={event => setPassword(event.target.value)} className="form-control" id="password" placeholder="Password"/>
                    </div>

                    <div className="form-check">
                        <input className="form-check-input chbx_base" type="checkbox" checked={rememberMe} onChange={event => setRememberMe(!rememberMe)} id="remember-me" />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me </label>
                    </div>

                    <button type="submit" className="btn btn-primary" onClick={login}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login