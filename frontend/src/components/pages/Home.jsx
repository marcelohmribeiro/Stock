import styles from "./Home.module.css"
import carImg from "../img/caminhao.png"
import LinkButton from "../layout/LinkButton"

function Home() {
    return (
        <section className={styles.home_container}>
            <h1>Bem vindo ao <span>Stock</span></h1>
            <p>Comece a gerenciar seu estoque!</p>
            <LinkButton to="/newitem" text="Criar Item" />
            <img src={carImg} alt="logo_img" />
        </section>
    )
}

export default Home