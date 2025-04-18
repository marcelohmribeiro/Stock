import styles from "./Register.module.css"
import Input from "../../form/Input"
import logo from "../../img/voar_logo.png"
import SubmitButton from "../../form/SubmitButton"
import Loading from "../../layout/Loading"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'

function Register() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    // Criando usúario
    const submit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setLoading(true)
        try {
            const res = await fetch(`${backendUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user)
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.message || "Erro ao cadastrar usuário")
            }
            navigate("/dashboard", toast.success("Usuário criado com sucesso!"))
        } catch (err) {
            alert(err.message)
        } finally {
            setSubmitting(false)
            setLoading(false)
        }
    }
    if (loading) return (
        <Loading txt="Criando..." />
    )
    return (
        <form onSubmit={submit} className={styles.register_container} autoComplete="off">
            <img src={logo} />
            <Input
                type="text"
                text="Nome"
                name="name"
                placeholder="Digite o nome do funcionário"
                handleOnChange={handleChange}
                value={user.name ? user.name : ''}
            />
            <Input
                type='email'
                text='Email'
                name='email'
                placeholder='Digite o email'
                handleOnChange={handleChange}
                value={user.email ? user.email : ''}
            />
            <Input
                type='password'
                text='Senha'
                name='password'
                placeholder='Digite a senha'
                handleOnChange={handleChange}
                value={user.password ? user.password : ''}
            />
            <SubmitButton text="CADASTRAR" disabled={submitting} />
        </form>
    )
}
export default Register