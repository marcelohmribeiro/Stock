import styles from './SubmitButton.module.css'

function SubmitButton({ text, disabled }) {
    return (
        <div>
            <button className={styles.btn} disabled={disabled} >{text}</button>
        </div>
    )
}

export default SubmitButton