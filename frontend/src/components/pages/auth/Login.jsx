import styles from "./Login.module.css"
// Paginas
import Input from "../../form/Input"
import logo from "../../img/voar_logo.png"
import SubmitButton from "../../form/SubmitButton"
// Bibliotecas
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"
import { toast } from 'react-toastify'

function Login() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { login } = useAuth()

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message || "Erro ao fazer login")
            }
            if (!data.user) {
                throw new Error("Usuário não encontrado")
            }
            login(data.token)
            localStorage.setItem("token", data.token)
            if (data.user.role === "admin") {
                navigate("/", toast.success("ADM logado!"))
            } else {
                navigate("/checkout", toast.success("FUNC logado!"))
            }
        } catch (err) {
            toast.error("Usuário não encontrado!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={submit} className={styles.login_container} autocomplete="off">
            <img src={logo} />
            <Input
                type='email'
                text='Email'
                name='email'
                placeholder='Digite seu email'
                value={email}
                handleOnChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type='password'
                text='Senha'
                name='password'
                placeholder='Digite sua senha'
                value={password}
                handleOnChange={(e) => setPassword(e.target.value)}
            />
            <SubmitButton text="ENTRAR" disabled={loading} />
        </form>
    )
}

export default Login