import styles from './Footer.module.css'
import logo from '../img/logo-voar-escuro_orig.png'
import { useAuth } from '../context/AuthContext'

function Footer() {

    const { user } = useAuth()

    return (
        <>
            {user && (
                <footer className={styles.footer}>
                    <ul>
                        <li>
                            <a
                                href="https://www.associacaovoar.org.br/"
                                target='_blank'
                                rel="noopener noreferrer"
                            >
                                <img src={logo} alt="Logo da Associação Voar" />
                            </a>
                        </li>
                    </ul>
                </footer>
            )}
        </>
    )
}

export default Footer