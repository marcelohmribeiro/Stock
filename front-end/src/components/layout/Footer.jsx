import styles from './Footer.module.css'
import logo from '../img/logo-voar-escuro_orig.png'

function Footer() {
    return (
        <footer className={styles.footer}>
            <ul>
                <li>
                    <a href="https://www.associacaovoar.org.br/" target='_blank'><img src={logo} /></a>
                </li>
            </ul>
        </footer>
    )
}

export default Footer