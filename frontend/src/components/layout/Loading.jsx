import { FaSpinner } from 'react-icons/fa'
import styles from './Loading.module.css'

function Loading({ txt }) {
    return (
        <div className={styles.loading_overlay}>
            <div className={styles.loading_container}>
                <FaSpinner className={styles.spinner} />
                <p className={styles.loading_message}>{txt}</p>
            </div>
        </div>
    )
}

export default Loading