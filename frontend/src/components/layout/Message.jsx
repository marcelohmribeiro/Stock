// Páginas
import styles from './Message.module.css'
// Bibliotecas
import { useState, useEffect } from 'react'

function Message({ type, msg }) {

    const [visible, setVisible] = useState(false)

    // Mostrar Mensagem
    useEffect(() => {
        if (!msg) {
            setVisible(false)
            return
        }

        setVisible(true)

        const timer = setTimeout(() => {
            setVisible(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [msg])

    return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>
                    {msg}
                </div>
            )}
        </>
    )
}

export default Message