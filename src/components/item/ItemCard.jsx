import styles from './ItemCard.module.css'
// Bibliotecas
import { Link } from 'react-router-dom'
import { FaTrash, FaEdit } from "react-icons/fa"
import QRCode from 'react-qr-code';

function ItemCard({ id, name, budget, category, desc, handleRemove }) {

    const remove = (e) => {
        e.preventDefault()
        handleRemove(id)
    }

    return (
        <div className={styles.item_card}>
            <h4>
                {name.toUpperCase()}
            </h4>
            <p>
                <span>Valor:</span> R${Number(budget).toFixed(2)}
            </p>
            <p className={styles.category_text}>
                <span className={`${styles[category.toLowerCase()]}`}></span> {category}
            </p>
            <p>
                <span>Descrição:</span> {desc}
            </p>
            <div className={styles.qr_code}>
                <QRCode
                    value={`http://localhost:5000/itens/${id}`}
                    target='_blank'
                    style={{ height: "auto", maxWidth: "100%", width: "45%", margin: "auto", cursor: "pointer" }}
                />
            </div>
            <div className={styles.item_card_actions}>
                <Link to={`/item/${id}`}>
                    <FaEdit /> Editar
                </Link>
                <button onClick={remove}>
                    <FaTrash /> Excluir
                </button>
            </div>
        </div>
    )
}

export default ItemCard