// Páginas
import styles from './Footer.module.css'
// Bibliotecas
import { FaGithub } from "react-icons/fa"

function Footer() {
    return (
        <footer className={styles.footer}>
            <ul>
                <li>
                    <a target='_blank' href="https://github.com/marcelohmribeiro"><FaGithub /></a>
                </li>
            </ul>
        </footer>
    )
}

export default Footer