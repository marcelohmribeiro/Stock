// Páginas
import styles from './NavBar.module.css'
import logo from '../img/logo.png'
import { useAuth } from '../context/AuthContext'
import { IoIosLogOut } from "react-icons/io";
// Bibliotecas
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function NavBar() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const handleLogout = () => {
        logout()
        navigate('/login')
    }
    const defaultPicture = 'https://res.cloudinary.com/dtkkjffju/image/upload/v1744936712/default_qf4w1m.png'

    return (
        <>
            {user && (
                <nav className={styles.navbar}>
                    <div className={styles.logo_container}>
                        <img src={logo} alt="logo" />
                    </div>
                    {user.role === "admin" && (
                        <ul className={styles.list}>
                            <li className={styles.item}>
                                <Link to="/">Home</Link>
                            </li>
                            <li className={styles.item}>
                                <Link to="/stock">Estoque</Link>
                            </li>
                            <li className={styles.item}>
                                <Link to="/checkout">Checkout</Link>
                            </li>
                        </ul>
                    )}
                    {user && (
                        <div className={styles.profile_container}>
                            {user.role === "admin" ? (
                                <Link to="/dashboard"  >
                                    <img src={defaultPicture} />
                                </Link>
                            ) : (
                                <img src={defaultPicture} />
                            )}
                            <div className={styles.profile_info}>
                                <h3>{user.name}</h3>
                                {user.role === "admin" ? <p>Administrador</p> : <p>Funcionário</p>}

                            </div>
                            <button onClick={handleLogout}>
                                <IoIosLogOut />
                            </button>
                        </div>
                    )}
                </nav>
            )}
        </>
    )
}

export default NavBar