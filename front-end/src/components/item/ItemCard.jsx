import styles from './ItemCard.module.css'
// Bibliotecas
import { Link } from 'react-router-dom'
import { FaTrash, FaEdit, FaDownload } from "react-icons/fa"
import { useState } from 'react'
import QRCode from 'react-qr-code';
import QRCodeLink from 'qrcode'

function ItemCard({ id, name, budget, category, desc, handleRemove }) {

    const remove = (e) => {
        e.preventDefault()
        handleRemove(id)
    }

    const [qrcode, setQRCode] = useState('')
    const [itemCard, setItemCard] = useState(false)

    // Formatação do QR Code
    function HandleGenerateQRCode() {
        QRCodeLink.toDataURL(`http://localhost:8081/itens/${id}`, {
            width: 600,
            margin: 3,
        }, function (url) {
            setQRCode(url)
        })
    }

    function item_card() {
        setItemCard(!itemCard)
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
            <button onClick={item_card} className={styles.btn}>
                {!itemCard ? 'Gerar QR' : 'Voltar'}
            </button>
            {!itemCard ? (
                <div className={styles.item_card_actions}>
                    <Link to={`/item/${id}`}>
                    <FaEdit /> Editar
                    </Link>
                    <button onClick={remove}>
                        <FaTrash /> Excluir
                    </button>
                </div>
            ) : (
                <div className={styles.qr_code}>
                    <Link to={`/item/${id}`}>
                        <QRCode
                            value={`http://localhost:5173/item/${id}`}
                            style={{ height: "auto", maxWidth: "100%", width: "45%" }}
                        />
                    </Link>
                    <a className={styles.QRdownload} onClick={HandleGenerateQRCode} href={qrcode} download={`${name}-qrcode.png`}><FaDownload /></a>
                </div>
            )}
        </div>
    )
}

export default ItemCard