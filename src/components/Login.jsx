import { useState } from 'react'
import Menu from './Menu'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const PASSWORD_MINIMUM_CHARACTERS = 8
    const PASSWORD_MAXIMUM_CHARACTERS = 16

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    function login() {
        if (!isInputValid()) return
        navigate('/account')
    }

    function isInputValid() {
        const trimmed = password.trim()
        return EMAIL_REGEX.test(email) &&
               trimmed.length >= PASSWORD_MINIMUM_CHARACTERS &&
               trimmed.length <= PASSWORD_MAXIMUM_CHARACTERS
    }

    function emailInputField() {
        const valid = EMAIL_REGEX.test(email)

        return (
            <div class="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" value={email} onChange={event => setEmail(event.target.value)} className="form-control input-lg" id="email" aria-describedby="emailHelp" placeholder="name@example.com"/>
                <div className="d-flex flex-column">
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    {valid ? <></> :
                        <small className="form-text" style={{color: "red"}}>Invalid email</small>
                    }
                </div>
            </div>
        )
    }

    function passwordInputField() {
        const trimmed = password.trim()

        let label = ''
        if (trimmed.length < PASSWORD_MINIMUM_CHARACTERS) label = `Password must have at least ${PASSWORD_MINIMUM_CHARACTERS} characters`
        else if (trimmed.length > PASSWORD_MAXIMUM_CHARACTERS) label = `Password not exceed ${PASSWORD_MAXIMUM_CHARACTERS} characters`

        return (
            <div class="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} className="form-control" id="password" placeholder="Password"/>
                {label.length === 0 ? <></> :
                        <small className="form-text" style={{color: "red"}}>{label}</small>
                }
            </div>
        )
    }

    return (
        <div className="flex_wrapper">
            <Menu/>

            <div className="flex_login">
                <form className="d-flex flex-column" style={{gap: 15}}>
                    {emailInputField()}

                    {passwordInputField()}

                    <div className="form-check">
                        <input className="form-check-input chbx_base" type="checkbox" checked={rememberMe} onChange={event => setRememberMe(!rememberMe)} id="remember-me" />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me </label>
                    </div>

                    <button type="button" className="btn btn-primary" onClick={login}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login