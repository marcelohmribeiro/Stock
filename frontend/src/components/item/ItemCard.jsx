import styles from './ItemCard.module.css'
// Bibliotecas
import { Link } from 'react-router-dom'
import { FaTrash, FaEdit, FaDownload } from "react-icons/fa"
import { useState, useRef } from 'react'
import Barcode from 'react-barcode'

function ItemCard({ id, name, budget, category, desc, handleRemove }) {
    const remove = (e) => {
        e.preventDefault()
        handleRemove(id)
    }
    const [itemCard, setItemCard] = useState(false)
    const barcodeRef = useRef(null)
    // Formatação do Codigo de Barras
    const handleDownloadBarcode = () => {
        const svg = barcodeRef.current.querySelector('svg')
        if (!svg) return
        // Gerando o SVG
        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        // Transformando o SVG em imagem
        const image = new Image()
        image.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0)
            // Salva como PNG
            canvas.toBlob((blob) => {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `${name}-barcode.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
            }, 'image/png')
            URL.revokeObjectURL(url)
        }
        image.src = url
    }
    // Estado para mostrar ou não
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
                {!itemCard ? 'Gerar CB' : 'Voltar'}
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
                    <div ref={barcodeRef}>
                        <Barcode
                            value={String(id)}
                            format="CODE128"
                            height={100}
                            width={2}
                            displayValue={false}
                        />
                    </div>
                    <a className={styles.QRdownload} onClick={handleDownloadBarcode}><FaDownload /></a>
                </div>
            )}
        </div>
    )
}

export default ItemCard