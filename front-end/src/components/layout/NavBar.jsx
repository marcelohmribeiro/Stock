// Páginas
import styles from './NavBar.module.css'
import logo from '../img/logo-voar-escuro_orig.png'
import Container from './Container'
// Bibliotecas
import { Link } from 'react-router-dom'


function NavBar() {
    return (
        <nav className={styles.navbar}>
            <Container>
                <Link to="/">
                    <img src={logo} alt="associacao-voar-logo" />
                </Link>
                <ul className={styles.list}>
                    <li className={styles.item}>
                        <Link to="/">Home</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/stock">Estoque</Link>
                    </li>
                </ul>
            </Container>
        </nav>
    )
}

export default NavBar